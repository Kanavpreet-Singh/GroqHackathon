const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();
const User = require("../models/user");
const News = require("../models/news");
const userAuth = require("../middlewares/authentication/user");

// Configuration constants
const FLASK_API_URL = process.env.FLASK_API_URL || 'http://localhost:5001/summarize';
const FLASK_API_TIMEOUT = parseInt(process.env.FLASK_API_TIMEOUT) || 30000; // 30 seconds

router.post("/text", userAuth, async (req, res) => {
    try {
        const { transcription, inputType, videoUrl, originalText, status } = req.body;
        const userId = req.user.userid;

        // Input validation
        if (!inputType || !['text', 'video'].includes(inputType)) {
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
        const newsItem = new News({
            userId,
            inputType,
            videoUrl: inputType === 'video' ? videoUrl : null,
            originalText: inputType === 'text' ? originalText : null,
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


const FLASK_VIDEO_API_URL = "http://localhost:5001/summarize-video"; 

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

        if (!videoUrl) {
            return res.status(400).json({
                success: false,
                message: "Video URL is required"
            });
        }

        // Call Flask video summarization service
        let summarizedText, transcription;
        try {
            const response = await axios.post(
                FLASK_VIDEO_API_URL,
                { videoUrl },
                { timeout: FLASK_API_TIMEOUT }
            );

            if (!response.data || !response.data.summarizedText) {
                throw new Error("Invalid response format from summarization service");
            }

            summarizedText = response.data.summarizedText;
            // Optional: assign transcription if your Flask API returns transcript too
            transcription = response.data.transcription || "[Transcript not available]";
        } catch (flaskError) {
            console.error("Flask video summarization error:", flaskError);
            summarizedText = "Summary failed. Please try again later.";
        }

        // Save to database
        const newsItem = new News({
            userId,
            inputType,
            videoUrl,
            originalText: null,
            transcription: transcription || null,
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

module.exports = router;