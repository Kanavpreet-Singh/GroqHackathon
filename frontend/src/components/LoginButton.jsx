import { useState } from "react";
import { Link } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios"
const LoginButton = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("token") !== null;
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    toast({
      title: "Logged out successfully",
      description: "You have been logged out",
      variant: "default",
    });
    navigate("/");
  };
  

  return (
    <div>
      {isLoggedIn ? (
        <div className="flex items-center gap-2">
          <Button 
            onClick={handleLogout} 
            variant="outline" 
            className="flex items-center gap-1 text-black"
            title="Log out"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden md:inline">Logout</span>
          </Button>
          <Link to="/history">
  <Button 
    variant="outline" 
    className="flex items-center gap-1 text-black"
    title="View your history"
  >
    Get history
    <span className="hidden md:inline">Get History</span>
  </Button>
</Link>

        </div>
      ) : (
        <Link to="/login">
          <Button 
            variant="outline" 
            className="flex items-center gap-1 text-black"
            title="Log in or sign up"
          >
            <User className="h-4 w-4" />
            <span className="hidden md:inline">Login</span>
          </Button>
        </Link>
        
      )}
    </div>
  );
};

export default LoginButton;