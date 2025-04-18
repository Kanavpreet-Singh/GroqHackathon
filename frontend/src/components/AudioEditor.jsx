import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { Mic, Sparkles, Copy, Volume2, Play, Pause } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios"

const AudioEditor = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [summary, setSummary] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
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
          inputType: "text",
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
              className="prose prose-slate max-w-none"
              dangerouslySetInnerHTML={{ __html: summary }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioEditor;
