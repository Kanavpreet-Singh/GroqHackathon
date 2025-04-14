
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={`w-10 h-10 rounded-full border shadow-md transition-colors duration-300 hover-glow ${
        isDark ? "bg-green-200 border-green-500" : "bg-gray-900 border-gray-700"
      }`}
      title={isDark ? "Currently: Dark Mode" : "Currently: Light Mode"}
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-yellow-700" />
      ) : (
        <Moon className="h-5 w-5 text-white" />
      )}
    </Button>
  );
};
export default ThemeToggle;