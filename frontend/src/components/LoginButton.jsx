
import { useState } from "react";
import { Link } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const LoginButton = () => {
  // Get user from localStorage (we'll store it there after login)
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <div>
      {user ? (
        <div className="flex items-center gap-2">
          <span className="text-sm hidden md:inline text-black">{user.name}</span>
          <Button 
            onClick={handleLogout} 
            variant="outline" 
            className="flex items-center gap-1 text-black"
            title="Log out"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden md:inline">Logout</span>
          </Button>
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