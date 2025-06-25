import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { FileText, Sparkles, Copy, Send, X, MessageCircle, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { analyzeText } from "@/utils/api";
import axios from "axios"
import { BASE_URL } from "../helper";
const TextEditor = ({ text, setText }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [summary, setSummary] = useState("");
  const [question, setQuestion] = useState("");
  const [qaHistory, setQaHistory] = useState([]);
  const [isQaSessionActive, setIsQaSessionActive] = useState(false);
  const [isCheckingFakeNews, setIsCheckingFakeNews] = useState(false);
  const [fakeNewsAnalysis, setFakeNewsAnalysis] = useState(null);
  const { toast } = useToast();

  // Use useEffect to apply white color to the heading
  // useEffect(() => {
  //   const heading = document.querySelector('.text-analyzer-heading');
  //   if (heading) {
  //     heading.style.color = '#FFFFFF';
  //   }
  // }, []);
  const handleAnalyze = async () => {
    if (!text.trim()) {
      toast({
        title: "Empty content",
        description: "Please enter some text to analyze",
        variant: "destructive",
      });
      return;
    }

    // Clear previous analysis
    setSummary("");
    setFakeNewsAnalysis(null);
    setQaHistory([]);
    setIsQaSessionActive(false);

    setIsAnalyzing(true);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${BASE_URL}/news/text`,
        {
          inputType: "text",
          originalText: text,
          transcription: text,
          status: "completed",
        },
        {
          headers: {
            token: token,
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
      console.error("Error analyzing text:", error);
      toast({
        title: "Analysis failed",
        description: error.response?.data?.message || "Failed to summarize text",
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
        "https://groqhackathon.onrender.com/answer-question",
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
        // Add the new Q&A pair to history
        setQaHistory([...qaHistory, {
          question: question.trim(),
          answer: response.data.answer,
          timestamp: new Date().toISOString()
        }]);

        // Clear the question input
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

  const handleFakeNewsCheck = async () => {
    if (!summary) {
      toast({
        title: "No summary available",
        description: "Please generate a summary first",
        variant: "destructive",
      });
      return;
    }

    setIsCheckingFakeNews(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://groqhackathon.onrender.com/detect-fake-news",
        {
          text: summary
        },
        {
          headers: {
            token: token,
          },
        }
      );

      if (response.data?.analysis) {
        setFakeNewsAnalysis(response.data.analysis);
        toast({
          title: "Analysis complete",
          description: "Fake news detection completed",
        });
      } else {
        throw new Error("No analysis returned from server");
      }
    } catch (error) {
      console.error("Error checking for fake news:", error);
      toast({
        title: "Analysis failed",
        description: error.response?.data?.error || "Failed to analyze for fake news",
        variant: "destructive",
      });
    } finally {
      setIsCheckingFakeNews(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <FileText className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold text-foreground dark:text-white">Text Analyzer</h2>
        </div>
        <div className="content-card bg-card p-6 rounded-xl shadow-md border border-border">
          <div className="mb-4">
            <label htmlFor="textarea" className="block text-sm font-medium text-foreground mb-1">
              Paste or type your text content
            </label>
            <Textarea
              id="textarea"
              placeholder="Enter news content to be summarized..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[200px] text-foreground"
            />
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleAnalyze}
              className="bg-primary hover:bg-primary/80 flex items-center gap-2"
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
                  <span>Analyze & Summarize</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {summary && (
        <>
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">
                  Generated Summary
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy} className="flex items-center gap-1">
                  <Copy className="h-4 w-4" />
                  <span>Copy</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleFakeNewsCheck} 
                  className="flex items-center gap-1"
                  disabled={isCheckingFakeNews}
                >
                  {isCheckingFakeNews ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                      <span>Checking...</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-4 w-4" />
                      <span>Check for Fake News</span>
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="bg-muted p-6 rounded-xl shadow-md border border-border">
              <div
                className="prose text-foreground dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: summary }}
              />
            </div>
          </div>

          {fakeNewsAnalysis && (
            <div className="mt-8 mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <AlertTriangle className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Fake News Analysis</h2>
              </div>
              <div className={`bg-muted p-6 rounded-xl shadow-md border ${
                fakeNewsAnalysis.is_fake ? 'border-red-500' : 'border-green-500'
              }`}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Result:</span>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      fakeNewsAnalysis.is_fake ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {fakeNewsAnalysis.is_fake ? 'Likely Fake News' : 'Likely Real News'}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold">Confidence:</span>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div 
                        className={`h-2.5 rounded-full ${
                          fakeNewsAnalysis.is_fake ? 'bg-red-500' : 'bg-green-500'
                        }`} 
                        style={{ width: `${fakeNewsAnalysis.confidence * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-500">{Math.round(fakeNewsAnalysis.confidence * 100)}%</span>
                  </div>
                  <div>
                    <span className="font-semibold">Reasons:</span>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      {fakeNewsAnalysis.reasons.map((reason, index) => (
                        <li key={index} className="text-sm">{reason}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="font-semibold">Suggestions:</span>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      {fakeNewsAnalysis.suggestions.map((suggestion, index) => (
                        <li key={index} className="text-sm">{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

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

export default TextEditor;
