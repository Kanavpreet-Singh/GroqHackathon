import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from "react";
import { Mic, Sparkles, Copy, Volume2, Play, Pause } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { analyzeAudio } from "@/utils/api";

const AudioEditor = ({ audioUrl, setAudioUrl }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [summary, setSummary] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  
  // Use useEffect to apply white color to the heading
  // useEffect(() => {
  //   const heading = document.querySelector('.audio-analyzer-heading');
  //   if (heading) {
  //     heading.style.color = '#FFFFFF';
  //   }
  // }, []);

  const handleAnalyze = async () => {
    if (!audioUrl.trim()) {
      toast({
        title: "Empty URL",
        description: "Please enter an audio URL to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const data = await analyzeAudio(audioUrl);
      setSummary(data.summary);
    } catch (error) {
      console.error('Error analyzing audio:', error);
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
      // Simulate playback progress
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

  // const formatTime = (percentage) => {
  //   const totalSeconds = 90; // Assuming 1:30 total length
  //   const currentSeconds = Math.floor((percentage / 100) * totalSeconds);
  //   const minutes = Math.floor(currentSeconds / 60);
  //   const seconds = currentSeconds % 60;
  //   return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  // };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <Mic className="h-5 w-5 text-news-primary" />
          <h2 className="text-xl font-semibold text-foreground dark:text-white">Audio Analyzer</h2>
        </div>
        <div className="content-card">
          <div className="mb-4">
            <label htmlFor="audioUrl" className="block text-sm font-medium text-foreground mb-1">
              Enter audio URL
            </label>
            <div className="flex space-x-2">
              <Input
                id="audioUrl"
                type="url"
                placeholder="https://example.com/audio"
                value={audioUrl}
                onChange={(e) => setAudioUrl(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleAnalyze}
                className="bg-news-primary hover:bg-news-dark whitespace-nowrap flex items-center gap-2"
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

          {/* {audioUrl && (
            <div className="mt-6 bg-gray-50 rounded-lg p-4 border">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className={`h-10 w-10 rounded-full ${isPlaying ? 'bg-news-primary text-white hover:bg-news-dark' : ''}`}
                  onClick={togglePlayback}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                
                <div className="flex-1 space-y-1">
                  <Slider 
                    value={[progress]} 
                    max={100} 
                    step={1}
                    onValueChange={(value) => setProgress(value[0])}
                    className="cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{formatTime(progress)}</span>
                    <span>1:30</span>
                  </div>
                </div>
                
                <Volume2 className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-xs text-gray-500 mt-2 truncate">{audioUrl}</p>
            </div>
          )} */}
        </div>
      </div>

      {summary && (
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-news-primary" />
              <h2 className="text-xl font-semibold text-gray-800">Generated Summary</h2>
            </div>
            <Button variant="outline" size="sm" onClick={handleCopy} className="flex items-center gap-1">
              <Copy className="h-4 w-4" />
              <span>Copy</span>
            </Button>
          </div>
          <div className="content-card bg-news-light">
            <div className="prose max-w-none">
              <p className="text-gray-800">{summary}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioEditor;
