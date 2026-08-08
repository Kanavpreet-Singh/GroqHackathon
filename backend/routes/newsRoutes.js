const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();
const User = require("../models/user");
const News = require("../models/news");
const userAuth = require("../middlewares/authentication/user");
const path = require("path");
// Configuration constants
const FLASK_API_URL = process.env.FLASK_API_URL || 'https://brieflensflask.onrender.com/summarize';
const FLASK_API_TIMEOUT = parseInt(process.env.FLASK_API_TIMEOUT) || 30000; // 30 seconds

router.post("/text", userAuth, async (req, res) => {
    try {
        let { transcription, inputType, videoUrl, originalText, status } = req.body;
        const userId = req.user.userid;

        // Input validation
        if (!inputType || !['text', 'video','audio'].includes(inputType)) {
            return res.status(400).json({ 
                success: false,
                message: "Invalid input type. Must be either 'text' or 'video'" 
            });
        }

        if (!transcription) {
            return res.status(400).json({ 
                success: false,
                message: "Transcription text is required" 
            });
        }

        if (inputType === 'text' && !originalText) {
            return res.status(400).json({ 
                success: false,
                message: "Original text is required for text input type" 
            });
        }

        // Call Flask summarization service
        let summarizedText;
        try {
            const response = await axios.post(
                FLASK_API_URL,
                { originalText: originalText || transcription },
                { timeout: FLASK_API_TIMEOUT }
            );

            if (!response.data || !response.data.summarizedText) {
                throw new Error('Invalid response format from summarization service');
            }
            summarizedText = response.data.summarizedText;
        } catch (flaskError) {
            console.error('Summarization service error:', flaskError);
            // Fallback to truncated original text if summarization fails
            summarizedText = (originalText || transcription).substring(0, 500) + '... [Summary failed]';
        }

        // Save to database
        if (inputType === 'audio') {
          originalText = 'Audio File';
      }
        const newsItem = new News({
            userId,
            inputType,
            videoUrl: inputType === 'video' ? videoUrl : null,
            originalText: inputType === 'text' || inputType === 'audio' ? originalText : null,
            transcription,
            summarizedText,
            status: status || 'completed',
        });

        await newsItem.save();

        res.status(201).json({
            success: true,
            message: "News summary stored successfully",
            data: {
                id: newsItem._id,
                inputType: newsItem.inputType,
                status: newsItem.status,
                summary: newsItem.summarizedText,
                createdAt: newsItem.createdAt
            }
        });

    } catch (err) {
        console.error("Error in news summary endpoint:", err);
        res.status(500).json({ 
            success: false,
            message: "Internal server error",
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});


const FLASK_VIDEO_API_URL = process.env.FLASK_VIDEO_API_URL || 'https://brieflensflask.onrender.com/summarize-video';
// Video summarization involves fetching a transcript plus several LLM calls (more for
// longer videos, via map-reduce), which routinely takes well past 30s — and longer
// still on a cold-started free-tier dyno. Tune via env if the hosting platform allows
// longer-lived connections.
const FLASK_VIDEO_API_TIMEOUT = parseInt(process.env.FLASK_VIDEO_API_TIMEOUT) || 180000; // 3 minutes

router.post("/video", userAuth, async (req, res) => {
    try {
        const { videoUrl, inputType, status } = req.body;
        const userId = req.user.userid;

        // Input validation
        if (!inputType || inputType !== 'video') {
            return res.status(400).json({
                success: false,
                message: "Invalid input type. This endpoint only accepts 'video'."
            });
        }

        if (!videoUrl || typeof videoUrl !== 'string') {
            return res.status(400).json({
                success: false,
                message: "Video URL is required"
            });
        }

        try {
            new URL(videoUrl);
        } catch {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid video URL"
            });
        }

        // Call Flask video summarization service
        let flaskResponse;
        try {
            flaskResponse = await axios.post(
                FLASK_VIDEO_API_URL,
                { videoUrl },
                { timeout: FLASK_VIDEO_API_TIMEOUT }
            );
        } catch (flaskError) {
            console.error("Flask video summarization error:", flaskError.message);

            if (flaskError.code === 'ECONNABORTED') {
                return res.status(504).json({
                    success: false,
                    message: "The video summarization service took too long to respond. This can happen with long videos or right after the service has been idle — please try again shortly."
                });
            }

            if (flaskError.response) {
                // Forward the specific reason the Flask service gave (invalid URL,
                // no captions available, video unavailable, rate-limited, etc.)
                const upstreamStatus = flaskError.response.status;
                const message = flaskError.response.data?.error || "Failed to summarize video";
                return res.status(upstreamStatus >= 400 && upstreamStatus < 500 ? upstreamStatus : 502).json({
                    success: false,
                    message
                });
            }

            return res.status(503).json({
                success: false,
                message: "The video summarization service is currently unavailable. Please try again later."
            });
        }

        if (!flaskResponse.data || !flaskResponse.data.summarizedText) {
            return res.status(502).json({
                success: false,
                message: "Received an invalid response from the summarization service"
            });
        }

        const summarizedText = flaskResponse.data.summarizedText;
        const transcription = flaskResponse.data.transcription || null;

        // Only persist a record once we actually have a successful summary —
        // a failed attempt has nothing useful to store and shouldn't clutter history.
        const newsItem = new News({
            userId,
            inputType,
            videoUrl,
            originalText: null,
            transcription,
            summarizedText,
            status: status || 'completed'
        });

        await newsItem.save();

        res.status(201).json({
            success: true,
            message: "Video summary stored successfully",
            data: {
                id: newsItem._id,
                inputType: newsItem.inputType,
                status: newsItem.status,
                summary: newsItem.summarizedText,
                createdAt: newsItem.createdAt
            }
        });

    } catch (err) {
        console.error("Error in video summary endpoint:", err);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});
const { AssemblyAI } = require('assemblyai');
const fs = require('fs');
const multer=require("multer")

// Initialize AssemblyAI client
const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY || '6491c189bb4b4f9fb9aa8ac8f340ab62'
});

/**
 * Transcribes audio file using AssemblyAI SDK
 * @param {string} filePath - Path to audio file
 * @param {number} maxRetries - Maximum retry attempts
 * @param {number} initialDelay - Initial retry delay in ms
 * @returns {Promise<string>} - Transcription text
 */
const transcribeAudio = async (filePath, maxRetries = 3, initialDelay = 1000) => {
  let retryCount = 0;
  let currentDelay = initialDelay;
  let lastError;

  while (retryCount < maxRetries) {
    try {
      const params = {
        audio: filePath
      };

      const transcript = await client.transcripts.transcribe(params);

      if (transcript.status === 'error') {
        throw new Error(transcript.error);
      }

      // Poll for completion if not already done
      if (transcript.status !== 'completed') {
        return await pollTranscriptStatus(transcript.id);
      }

      return transcript.text;
    } catch (error) {
      lastError = error;
      retryCount++;

      if (retryCount < maxRetries) {
        const isRateLimit = error.response?.status === 429;
        const isServerError = error.response?.status >= 500;

        if (isRateLimit || isServerError) {
          console.warn(`Attempt ${retryCount}/${maxRetries} failed. Retrying in ${currentDelay}ms...`);
          await sleep(currentDelay);
          currentDelay *= 2; // Exponential backoff
          continue;
        }
      }
      throw error;
    }
  }
  throw lastError || new Error('Transcription failed after retries');
};

/**
 * Polls transcript status until completion
 * @param {string} transcriptId - Transcript ID
 * @returns {Promise<string>} - Completed transcription text
 */
const pollTranscriptStatus = async (transcriptId) => {
  const maxPollingAttempts = 60; // 5 minutes max (60 attempts * 5 seconds)
  
  for (let attempt = 1; attempt <= maxPollingAttempts; attempt++) {
    const transcript = await client.transcripts.get(transcriptId);

    if (transcript.status === 'completed') {
      if (!transcript.text) {
        throw new Error('Transcription completed but no text returned');
      }
      return transcript.text;
      
    }

    if (transcript.status === 'error') {
      throw new Error(transcript.error || 'Transcription failed');
    }

    await sleep(5000); // Wait 5 seconds between checks
  }

  throw new Error('Transcription timeout - took too long to complete');
};

// Helper function
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Create uploads directory if it doesn't exist
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 40 * 1024 * 1024 // 40MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/webm'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only audio files are allowed.'));
    }
  }
});

// Audio endpoint
router.post("/audio", userAuth, upload.single("audio"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ 
      success: false,
      message: "No file uploaded" 
    });
  }

  try {
    const transcription = await transcribeAudio(req.file.path);
    
    // Clean up the uploaded file
    fs.unlink(req.file.path, (err) => {
      if (err) console.error('Error deleting temp file:', err);
    });

    res.json({ 
      success: true,
      transcription,
      message: "Audio transcribed successfully"
    });
  } catch (err) {
    console.error('Transcription error:', err);
    
    // Clean up the uploaded file even if there's an error
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlink(req.file.path, (unlinkErr) => {
        if (unlinkErr) console.error('Error deleting temp file:', unlinkErr);
      });
    }

    const statusCode = err.message.includes('Invalid file type') ? 400 : 500;
    
    res.status(statusCode).json({ 
      success: false,
      message: "Failed to transcribe audio",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

router.get('/livenews', userAuth, async (req, res) => {
  try {
    const response = await axios.get('https://gnews.io/api/v4/top-headlines', {
      params: {
        lang: 'en',        // Language: English
        country: 'in',     // Country: India
        token: process.env.GNEWS_API_KEY,
        max: 9           
      }
    });

    res.status(200).json({
      success: true,
      totalResults: response.data.totalArticles,
      articles: response.data.articles
    });
  } catch (error) {
    console.error('Error fetching news:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch live news'
    });
  }
});

module.exports = router;