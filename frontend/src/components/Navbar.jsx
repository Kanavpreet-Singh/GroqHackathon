import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, Mic, Video, AlertCircle } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="bg-card border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                <span>Text</span>
              </Button>
            </Link>
            <Link to="/audio">
              <Button variant="ghost" className="flex items-center gap-2">
                <Mic className="h-5 w-5" />
                <span>Audio</span>
              </Button>
            </Link>
            <Link to="/video">
              <Button variant="ghost" className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                <span>Video</span>
              </Button>
            </Link>
            <Link to="/deepfake">
              <Button variant="ghost" className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                <span>Deepfake Detector</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 