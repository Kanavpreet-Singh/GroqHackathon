
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
      document.documentElement.style.setProperty("--background", "260 25% 11%");
      document.documentElement.style.setProperty("--foreground", "0 0% 98%");
      document.documentElement.style.setProperty("--card", "260 25% 9%");
      document.documentElement.style.setProperty("--card-foreground", "0 0% 98%");
      document.documentElement.style.setProperty("--popover", "260 25% 9%");
      document.documentElement.style.setProperty("--popover-foreground", "0 0% 98%");
      document.documentElement.style.setProperty("--primary", "252 87% 67%");
      document.documentElement.style.setProperty("--primary-foreground", "0 0% 100%");
      document.documentElement.style.setProperty("--secondary", "260 25% 16%");
      document.documentElement.style.setProperty("--secondary-foreground", "0 0% 98%");
      document.documentElement.style.setProperty("--muted", "260 25% 16%");
      document.documentElement.style.setProperty("--muted-foreground", "215 20% 75%");
      document.documentElement.style.setProperty("--accent", "252 87% 67%");
      document.documentElement.style.setProperty("--accent-foreground", "0 0% 98%");
      document.documentElement.style.setProperty("--destructive", "0 84% 60%");
      document.documentElement.style.setProperty("--destructive-foreground", "0 0% 98%");
      document.documentElement.style.setProperty("--border", "260 25% 20%");
      document.documentElement.style.setProperty("--input", "260 25% 20%");
      document.documentElement.style.setProperty("--ring", "252 87% 67%");
    } else {
      document.documentElement.classList.remove("dark-theme");
      document.documentElement.style.setProperty("--background", "0 0% 100%");
      document.documentElement.style.setProperty("--foreground", "240 10% 3.9%");
      document.documentElement.style.setProperty("--card", "0 0% 100%");
      document.documentElement.style.setProperty("--card-foreground", "240 10% 3.9%");
      document.documentElement.style.setProperty("--popover", "0 0% 100%");
      document.documentElement.style.setProperty("--popover-foreground", "240 10% 3.9%");
      document.documentElement.style.setProperty("--primary", "240 5.9% 10%");
      document.documentElement.style.setProperty("--primary-foreground", "0 0% 98%");
      document.documentElement.style.setProperty("--secondary", "240 4.8% 95.9%");
      document.documentElement.style.setProperty("--secondary-foreground", "240 5.9% 10%");
      document.documentElement.style.setProperty("--muted", "240 4.8% 95.9%");
      document.documentElement.style.setProperty("--muted-foreground", "240 3.8% 46.1%");
      document.documentElement.style.setProperty("--accent", "240 4.8% 95.9%");
      document.documentElement.style.setProperty("--accent-foreground", "240 5.9% 10%");
      document.documentElement.style.setProperty("--destructive", "0 84.2% 60.2%");
      document.documentElement.style.setProperty("--destructive-foreground", "0 0% 98%");
      document.documentElement.style.setProperty("--border", "240 5.9% 90%");
      document.documentElement.style.setProperty("--input", "240 5.9% 90%");
      document.documentElement.style.setProperty("--ring", "240 5.9% 10%");
    }
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
