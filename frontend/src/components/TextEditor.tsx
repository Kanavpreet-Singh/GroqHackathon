
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { FileText, Sparkles, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TextEditorProps {
  text: string;
  setText: (text: string) => void;
}

const TextEditor = ({ text, setText }: TextEditorProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [summary, setSummary] = useState("");
  const { toast } = useToast();

  const handleAnalyze = () => {
    if (!text.trim()) {
      toast({
        title: "Empty content",
        description: "Please enter some text to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate analysis delay
    setTimeout(() => {
      const words = text.split(' ');
      const firstSentence = words.slice(0, 10).join(' ');
      const lastSentence = words.slice(-10).join(' ');
      
      setSummary(`Summary: ${firstSentence}... ${lastSentence}`);
      setIsAnalyzing(false);
    }, 1500);
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

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <FileText className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Text Analyzer</h2>
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
        <div className="animate-fade-in">
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
          <div className="content-card bg-muted p-6 rounded-xl shadow-md border border-border">
            <div className="prose max-w-none">
              <p className="text-foreground">{summary}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextEditor;
