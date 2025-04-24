import { useState } from "react";
import Header from "@/components/Header";
import TextEditor from "@/components/TextEditor";
import VideoEditor from "@/components/VideoEditor";
import AudioEditor from "@/components/AudioEditor";
import { useTheme } from "@/context/ThemeContext";
import { ColourfulText } from "@/components/ui/colourful-text";
import Footer from "@/components/Footer";
import { GoogleTranslateWidget } from "../components/GoogleTranslateWidget";
import HomePage from "./HomePage.jsx";

const Index = () => {
  const [selectedMedia, setSelectedMedia] = useState(null); // Start with null instead of 'text'
  const [text, setText] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const { isDark } = useTheme();

  return (
    <>
      <div className="hidden md:block fixed top-4 right-4 z-50 bg-background shadow-md rounded-md p-2">
      </div>

      <div className={`min-h-screen flex flex-col bg-background ${isDark ? 'dark-theme' : ''}`}>
        <Header
          selectedMedia={selectedMedia}
          setSelectedMedia={setSelectedMedia}
        />

        {selectedMedia === null ? (
          // Show HomePage when no media type is selected
          <HomePage />
        ) : (
          // Show editors when a media type is selected
          <main className="flex-1 container mx-auto px-4 py-8">
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground text-center">
                BriefLens
              </h1>
              <p className="text-muted-foreground text-center mt-2 max-w-2xl mx-auto">
                Quickly analyze and summarize news content from text, video, or audio sources
                using our advanced AI technology.
              </p>
            </div>

            <div className="mt-8">
              {selectedMedia === 'text' && (
                <TextEditor text={text} setText={setText} />
              )}

              {selectedMedia === 'video' && (
                <VideoEditor videoUrl={videoUrl} setVideoUrl={setVideoUrl} />
              )}

              {selectedMedia === 'audio' && (
                <AudioEditor audioUrl={audioUrl} setAudioUrl={setAudioUrl} />
              )}
            </div>
          </main>
        )}

        <footer className="border-t border-border mt-auto">
          <div className="container mx-auto px-4 py-6">
            <p className="text-muted-foreground text-center text-sm">
              © 2025 BriefLens • HackCity Boys
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;