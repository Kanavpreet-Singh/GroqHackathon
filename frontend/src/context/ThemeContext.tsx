
import React, { createContext, useState, useContext, useEffect } from "react";

type ThemeContextType = {
  isDark: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  isDark: true,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  // Apply theme to the document when it changes
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark-theme");
      // Dark mode with green tones
      document.documentElement.style.setProperty("--background", "222 30% 10%"); // Dark green-gray
      document.documentElement.style.setProperty("--foreground", "90 15% 90%");
      document.documentElement.style.setProperty("--card", "220 25% 12%"); // Slightly lighter dark green
      document.documentElement.style.setProperty("--card-foreground", "90 15% 90%");
      document.documentElement.style.setProperty("--popover", "220 25% 12%");
      document.documentElement.style.setProperty("--popover-foreground", "90 15% 90%");
      document.documentElement.style.setProperty("--primary", "142 70% 45%"); // Vibrant green
      document.documentElement.style.setProperty("--primary-foreground", "0 0% 100%");
      document.documentElement.style.setProperty("--secondary", "220 25% 16%"); // Medium green-gray
      document.documentElement.style.setProperty("--secondary-foreground", "90 15% 90%");
      document.documentElement.style.setProperty("--muted", "220 25% 16%");
      document.documentElement.style.setProperty("--muted-foreground", "90 10% 70%");
      document.documentElement.style.setProperty("--accent", "142 70% 45%");
      document.documentElement.style.setProperty("--accent-foreground", "0 0% 98%");
      document.documentElement.style.setProperty("--destructive", "0 84% 60%");
      document.documentElement.style.setProperty("--destructive-foreground", "0 0% 98%");
      document.documentElement.style.setProperty("--border", "220 25% 20%");
      document.documentElement.style.setProperty("--input", "220 25% 20%");
      document.documentElement.style.setProperty("--ring", "142 70% 45%");
    } else {
      document.documentElement.classList.remove("dark-theme");
      // Light mode with subtle green undertones
      document.documentElement.style.setProperty("--background", "120 10% 98%"); // Very light green-white
      document.documentElement.style.setProperty("--foreground", "220 20% 20%");
      document.documentElement.style.setProperty("--card", "120 10% 96%"); // Light green-gray
      document.documentElement.style.setProperty("--card-foreground", "220 20% 20%");
      document.documentElement.style.setProperty("--popover", "120 10% 96%");
      document.documentElement.style.setProperty("--popover-foreground", "220 20% 20%");
      document.documentElement.style.setProperty("--primary", "142 70% 40%"); // Green
      document.documentElement.style.setProperty("--primary-foreground", "0 0% 100%");
      document.documentElement.style.setProperty("--secondary", "120 5% 90%"); // Light green-gray
      document.documentElement.style.setProperty("--secondary-foreground", "220 20% 20%");
      document.documentElement.style.setProperty("--muted", "120 5% 90%");
      document.documentElement.style.setProperty("--muted-foreground", "220 10% 40%");
      document.documentElement.style.setProperty("--accent", "142 50% 40%");
      document.documentElement.style.setProperty("--accent-foreground", "0 0% 98%");
      document.documentElement.style.setProperty("--destructive", "0 84% 60%");
      document.documentElement.style.setProperty("--destructive-foreground", "0 0% 98%");
      document.documentElement.style.setProperty("--border", "120 10% 85%");
      document.documentElement.style.setProperty("--input", "120 10% 85%");
      document.documentElement.style.setProperty("--ring", "142 70% 40%");
    }
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);