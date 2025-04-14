
import { FileText, Mic, Video, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import LoginButton from "./LoginButton";

const Header = ({ selectedMedia, setSelectedMedia }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <header className="relative z-10 bg-pink-100 border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-news-primary p-2 rounded-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-foreground hidden sm:block text-black">
              HackCity Boys
            </h1>
            <h1 className="text-xl font-bold text-foreground sm:hidden">
              News AI
            </h1>
          </div>
          
          <div className="hidden md:flex space-x-1 items-center">
            <Button
              variant={selectedMedia === 'text' ? 'default' : 'outline'}
              className={`flex items-center gap-2 ${selectedMedia === 'text' ? 'bg-news-primary hover:bg-news-dark' : ''}`}
              onClick={() => setSelectedMedia('text')}
            >
              <FileText className="h-4 w-4" />
              <span>Text</span>
            </Button>
            <Button
              variant={selectedMedia === 'video' ? 'default' : 'outline'}
              className={`flex items-center gap-2 ${selectedMedia === 'video' ? 'bg-news-primary hover:bg-news-dark' : ''}`}
              onClick={() => setSelectedMedia('video')}
            >
              <Video className="h-4 w-4" />
              <span>Video</span>
            </Button>
            <Button
              variant={selectedMedia === 'audio' ? 'default' : 'outline'}
              className={`flex items-center gap-2 ${selectedMedia === 'audio' ? 'bg-news-primary hover:bg-news-dark' : ''}`}
              onClick={() => setSelectedMedia('audio')}
            >
              <Mic className="h-4 w-4" />
              <span>Audio</span>
            </Button>
            <div className="flex items-center gap-2 ml-2">
              <LoginButton />
              <ThemeToggle />
            </div>
          </div>
          
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 bg-card rounded-md shadow-lg border border-border animate-fade-in absolute right-4 left-4 z-50">
            <div className="py-2 space-y-1">
              <button 
                className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${selectedMedia === 'text' ? 'bg-muted text-primary font-medium' : 'text-foreground'}`}
                onClick={() => {
                  setSelectedMedia('text');
                  setMobileMenuOpen(false);
                }}
              >
                <FileText className="h-4 w-4" />
                <span>Text</span>
              </button>
              <button 
                className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${selectedMedia === 'video' ? 'bg-muted text-primary font-medium' : 'text-foreground'}`}
                onClick={() => {
                  setSelectedMedia('video');
                  setMobileMenuOpen(false);
                }}
              >
                <Video className="h-4 w-4" />
                <span>Video</span>
              </button>
              <button 
                className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${selectedMedia === 'audio' ? 'bg-muted text-primary font-medium' : 'text-foreground'}`}
                onClick={() => {
                  setSelectedMedia('audio');
                  setMobileMenuOpen(false);
                }}
              >
                <Mic className="h-4 w-4" />
                <span>Audio</span>
              </button>
              <div className="px-4 py-2 flex justify-between items-center">
                <LoginButton />
                <ThemeToggle />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;