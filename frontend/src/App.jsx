import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import TextEditor from "./components/TextEditor";
import AudioEditor from "./components/AudioEditor";
import VideoEditor from "./components/VideoEditor";
import DeepfakeDetector from "./components/DeepfakeDetector";
import Header from "./components/Header";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto py-8 px-4">
          <Routes>
            <Route path="/" element={<TextEditor />} />
            <Route path="/audio" element={<AudioEditor />} />
            <Route path="/video" element={<VideoEditor />} />
            <Route path="/deepfake" element={<DeepfakeDetector />} />
          </Routes>
        </main>
        <Toaster />
      </div>
    </Router>
  );
}

export default App; 