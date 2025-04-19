import { FileText, Mic, Video, Menu, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import LoginButton from "./LoginButton";
import { Link, useLocation } from "react-router-dom";

const Header = ({ selectedMedia, setSelectedMedia }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Handle optional media change
  const handleMediaClick = (mediaType) => {
    if (setSelectedMedia) {
      setSelectedMedia(mediaType);
      setMobileMenuOpen(false); // close mobile menu if open
    }
  };

  return (
    <header className="relative z-10 bg-pink-100 border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-news-primary p-2">
                <img
                  src="/myLogo.png"
                  alt="Logo"
                  className="h-8 w-8 object-contain"
                />
              </div>
              <h1 className="text-xl font-bold text-foreground hidden sm:block text-black">
                BriefLens
              </h1>
            </Link>
            <h1 className="text-xl font-bold text-foreground sm:hidden">
              News AI
            </h1>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex space-x-1 items-center">
            <Link to="/livenews">
              <Button
                variant="ghost"
                className={`flex items-center gap-2 btn-animated ${
                  location.pathname === "/livenews"
                    ? "text-primary font-medium"
                    : ""
                }`}
              >
                <Newspaper className="h-4 w-4" />
                <span>Live News</span>
              </Button>
            </Link>
            <Button
              variant={selectedMedia === "text" ? "default" : "outline"}
              className={`flex items-center gap-2 btn-animated ${
                selectedMedia === "text"
                  ? "bg-news-primary hover:bg-news-dark"
                  : ""
              }`}
              onClick={() => handleMediaClick("text")}
            >
              <FileText className="h-4 w-4" />
              <span>Text</span>
            </Button>
            <Button
              variant={selectedMedia === "video" ? "default" : "outline"}
              className={`flex items-center gap-2 btn-animated ${
                selectedMedia === "video"
                  ? "bg-news-primary hover:bg-news-dark"
                  : ""
              }`}
              onClick={() => handleMediaClick("video")}
            >
              <Video className="h-4 w-4" />
              <span>Video</span>
            </Button>
            <Button
              variant={selectedMedia === "audio" ? "default" : "outline"}
              className={`flex items-center gap-2 btn-animated ${
                selectedMedia === "audio"
                  ? "bg-news-primary hover:bg-news-dark"
                  : ""
              }`}
              onClick={() => handleMediaClick("audio")}
            >
              <Mic className="h-4 w-4" />
              <span>Audio</span>
            </Button>
            <div className="flex items-center gap-2 ml-2">
              <LoginButton />
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Menu Icon */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 bg-card rounded-md shadow-lg border border-border animate-fade-in absolute right-4 left-4 z-50">
            <div className="py-2 space-y-1">
              <Link to="/livenews">
                <button
                  className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${
                    location.pathname === "/livenews"
                      ? "bg-muted text-primary font-medium"
                      : "text-foreground"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Newspaper className="h-4 w-4" />
                  <span>Live News</span>
                </button>
              </Link>
              <button
                className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${
                  selectedMedia === "text"
                    ? "bg-muted text-primary font-medium"
                    : "text-foreground"
                }`}
                onClick={() => handleMediaClick("text")}
              >
                <FileText className="h-4 w-4" />
                <span>Text</span>
              </button>
              <button
                className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${
                  selectedMedia === "video"
                    ? "bg-muted text-primary font-medium"
                    : "text-foreground"
                }`}
                onClick={() => handleMediaClick("video")}
              >
                <Video className="h-4 w-4" />
                <span>Video</span>
              </button>
              <button
                className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${
                  selectedMedia === "audio"
                    ? "bg-muted text-primary font-medium"
                    : "text-foreground"
                }`}
                onClick={() => handleMediaClick("audio")}
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
