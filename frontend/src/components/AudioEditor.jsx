import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Mic, Sparkles, Copy, Volume2, Play, Pause, MessageCircle, Send, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios"

const AudioEditor = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [summary, setSummary] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [question, setQuestion] = useState("");
  const [qaHistory, setQaHistory] = useState([]);
  const [isQaSessionActive, setIsQaSessionActive] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!audioFile) {
      toast({
        title: "No File Selected",
        description: "Please upload an audio file to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    const formData = new FormData();
    formData.append("audio", audioFile);

    try {
      const resp = await axios.post("http://localhost:5000/news/audio", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          token: localStorage.getItem("token"), 
        },
      });
      

      const response = await axios.post(
        "http://localhost:5000/news/text",
        {
          inputType: "audio",
          originalText: resp.data.transcription,
          transcription: resp.data.transcription,
          status: "completed",
        },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      const summaryText = response.data?.data?.summary;

      if (summaryText) {
        setSummary(summaryText);
        toast({
          title: "Analysis complete",
          description: "The text was successfully summarized",
        });
      } else {
        throw new Error("No summary returned from server");
      }
  
      
    } catch (error) {
      console.error("Error analyzing audio:", error);
      toast({
        title: "Analysis failed",
        description: "There was a problem connecting to the backend service",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopy = () => {
    if (summary) {
      navigator.clipboard.writeText(summary);
      toast({
        title: "Copied!",
        description: "Summary copied to clipboard",
      });
    }
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 100);
    }
  };
  const MAX_FILE_SIZE_MB = 25;
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024; // Convert MB to bytes
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast({
        title: "File too large",
        description: `Please upload a file smaller than ${MAX_FILE_SIZE_MB}MB`,
        variant: "destructive",
      });
      e.target.value = ""; // Clear the file input
      setAudioFile(null);
    } else {
      setAudioFile(file);
    }
  };

  const startQaSession = () => {
    setIsQaSessionActive(true);
    toast({
      title: "Q&A Session Started",
      description: "You can now ask as many questions as you'd like about the summary.",
    });
  };

  const endQaSession = () => {
    setIsQaSessionActive(false);
    toast({
      title: "Q&A Session Ended",
      description: "Your Q&A history has been saved.",
    });
  };

  const handleQuestionSubmit = async () => {
    if (!question.trim()) {
      toast({
        title: "Empty question",
        description: "Please enter a question",
        variant: "destructive",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5001/answer-question",
        {
          summary: summary,
          question: question.trim()
        },
        {
          headers: {
            token: token,
          },
        }
      );

      if (response.data && response.data.answer) {
        setQaHistory([...qaHistory, {
          question: question.trim(),
          answer: response.data.answer,
          timestamp: new Date().toISOString()
        }]);

        setQuestion("");

        toast({
          title: "Response received",
          description: "Feel free to ask another question!",
        });
      } else {
        throw new Error("No answer received from server");
      }
    } catch (error) {
      console.error("Error getting answer:", error);
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to get answer",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <Mic className="h-5 w-5 text-news-primary" />
          <h2 className="text-xl font-semibold text-foreground dark:text-white">Audio Analyzer</h2>
        </div>
        <div className="content-card">
          <div className="mb-4">
            <label className="block text-sm font-medium text-foreground mb-1">
              Upload Audio File
            </label>
            <div className="flex space-x-2 items-center">
              <Input
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="flex-1"
              />
              <Button
                onClick={handleAnalyze}
                className="bg-news-primary hover:bg-news-dark flex items-center gap-2"
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Analyze</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {summary && (
        <>
          <div className="">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Generated Summary</h2>
              </div>
              <Button variant="outline" size="sm" onClick={handleCopy} className="flex items-center gap-1">
                <Copy className="h-4 w-4" />
                <span>Copy</span>
              </Button>
            </div>

            <div className="bg-muted p-6 rounded-xl shadow-md border border-border">
              <div
                className="prose text-foreground dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: summary }}
              />
            </div>
          </div>

          {/* Q&A Section */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Interactive Q&A Session</h2>
              </div>
              {!isQaSessionActive ? (
                <Button
                  onClick={startQaSession}
                  className="bg-primary hover:bg-primary/80"
                >
                  Start Q&A Session
                </Button>
              ) : (
                <Button
                  onClick={endQaSession}
                  variant="destructive"
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  End Q&A Session
                </Button>
              )}
            </div>

            {isQaSessionActive && (
              <>
                <div className="bg-card p-6 rounded-xl shadow-md border border-border mb-4">
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Ask any question about the summary... You can ask as many questions as you'd like!"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      className="flex-1"
                      rows={2}
                    />
                    <Button
                      onClick={handleQuestionSubmit}
                      className="bg-primary hover:bg-primary/80 self-end flex items-center gap-2"
                    >
                      <Send className="h-4 w-4" />
                      Ask
                    </Button>
                  </div>
                </div>

                {/* Q&A History */}
                {qaHistory.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-foreground mb-2">Previous Questions & Answers</h3>
                    {qaHistory.map((qa, index) => (
                      <div key={index} className="bg-muted p-4 rounded-lg border border-border">
                        <div className="font-medium text-primary mb-2">
                          Q: {qa.question}
                        </div>
                        <div className="text-foreground pl-4 border-l-2 border-primary">
                          A: {qa.answer}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AudioEditor;
