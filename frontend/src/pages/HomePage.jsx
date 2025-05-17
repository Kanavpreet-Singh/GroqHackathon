import React from "react";
import bgImage from "./bgimage.jpg";
import { useTheme } from "@/context/ThemeContext";
import { TypeAnimation } from "react-type-animation";
import ThreeDCard from "@/components/ThreeDCard";
// import { ColourfulText } from '@/components/ui/colourful-text';

const HomePage = () => {
  const { isDark } = useTheme();

  const themeClasses = isDark ? "dark-theme bg-[#1a1a1a]" : "";

  return (
    <>
      {/* Desktop Layout */}
      <main className={`hidden md:flex flex-col min-h-screen ${themeClasses}`}>
        <div className="relative z-30 text-center px-6 py-16 max-w-4xl mx-auto">
          <h1
            className={`font-extrabold mb-4 ${
              isDark ? "text-white" : "text-black"
            }`}
            style={{
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              lineHeight: "1.1",
            }}
          >
            <TypeAnimation
              sequence={["BriefLens", 2000, "", 500]}
              wrapper="span"
              speed={30}
              deletionSpeed={1}
              cursor={true}
              style={{
                display: "inline-block",
                textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
              }}
              repeat={Infinity}
            />
          </h1>
          <p
            className={`text-xl md:text-2xl mb-8 font-bold ${
              isDark ? "text-white" : "text-black"
            }`}
          >
            Quickly analyze and summarize news content from text, video, or
            audio sources
          </p>
        </div>
        <div className="relative w-full" style={{ height: "400px" }}>
          <div className="absolute inset-0">
            <img
              src={bgImage}
              alt="News background"
              className="w-full h-full object-cover"
              style={{ maxHeight: "400px" }}
            />
          </div>
        </div>
        <div className="relative z-30 text-center px-6 py-16 max-w-4xl mx-auto">
          <h2
            className={`font-extrabold mb-2 mt-24 ${
              isDark ? "text-white" : "text-black"
            }`}
            style={{
              fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
              lineHeight: "1.1",
              textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
              letterSpacing: "0.05em",
              fontWeight: "700",
              textTransform: "uppercase",
              position: "relative",
              paddingBottom: "0.5rem",
            }}
          >
            Our Features
            <div
              className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 ${
                isDark ? "bg-white" : "bg-black"
              }`}
              style={{ borderRadius: "2px" }}
            />
          </h2>
          <div className="flex flex-row items-center justify-center gap-20 py-8 w-full">
            <ThreeDCard
              title="News Summarization"
              content="Analyze and summarize text, video, and audio sources efficiently"
              imageUrl="https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070&auto=format&fit=crop"
            />
            <ThreeDCard
              title="Fake News Detection"
              content="Check the authenticity of news articles, videos and audio sources"
              imageUrl="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=2070&auto=format&fit=crop"
            />
            <ThreeDCard
              title="Live News Updates"
              content="Get real-time news updates from around the world"
              imageUrl="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2070&auto=format&fit=crop"
            />
          </div>
        </div>
      </main>

      {/* Mobile Layout */}
      <main className={`flex md:hidden flex-col min-h-screen ${themeClasses}`}>
        <div className="flex flex-col items-center justify-center text-center px-4 pt-12 pb-6">
          <h1
            className={`font-extrabold mb-4 ${
              isDark ? "text-white" : "text-black"
            }`}
            style={{
              fontSize: "clamp(3rem, 6vw, 4rem)",
              lineHeight: "1.1",
              textShadow: "2px 2px 4px rgba(0,0,0,0.4)",
            }}
          >
            <TypeAnimation
              sequence={["BriefLens", 2000, "", 500]}
              wrapper="span"
              speed={30}
              deletionSpeed={1}
              cursor={true}
              style={{
                display: "inline-block",
                textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
              }}
              repeat={Infinity}
            />
          </h1>
          <p
            className={`text-lg sm:text-xl font-bold ${
              isDark ? "text-white" : "text-black"
            }`}
          >
            Quickly analyze and summarize news content from text, video, or
            audio sources
          </p>
        </div>
        <div className="w-full h-[200px]">
          <img
            src={bgImage}
            alt="News background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-30 text-center px-4 py-12 max-w-6xl mx-auto">
          <h2
            className={`font-extrabold mb-2 mt-8 ${
              isDark ? "text-white" : "text-black"
            }`}
            style={{
              fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
              lineHeight: "1.1",
              textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
              letterSpacing: "0.05em",
              fontWeight: "700",
              textTransform: "uppercase",
              position: "relative",
              paddingBottom: "0.5rem",
            }}
          >
            Our Features
            <div
              className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 ${
                isDark ? "bg-white" : "bg-black"
              }`}
              style={{ borderRadius: "2px" }}
            />
          </h2>

          <div className="flex flex-col items-center justify-center gap-8 mt-10">
            <ThreeDCard
              title="News Summarization"
              content="Analyze and summarize text, video, and audio sources efficiently"
              imageUrl="https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070&auto=format&fit=crop"
            />
            <ThreeDCard
              title="Fake News Detection"
              content="Check the authenticity of news articles, videos, and audio sources"
              imageUrl="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=2070&auto=format&fit=crop"
            />
            <ThreeDCard
              title="Live News Updates"
              content="Get real-time news updates from around the world"
              imageUrl="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2070&auto=format&fit=crop"
            />
          </div>
        </div>
      </main>
    </>
  );
};

export default HomePage;
