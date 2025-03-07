"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";

const DarkModeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setIsDarkMode(savedTheme === "dark");
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  const toggleDarkMode = () => {
    const newTheme = isDarkMode ? "light" : "dark";
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <Button onClick={toggleDarkMode}>
      {isDarkMode ? (
        <Sun className="w-4 h-4 mr-2" />
      ) : (
        <Moon className="w-4 h-4 mr-2" />
      )}
      {isDarkMode ? "Light Mode" : "Dark Mode"}
    </Button>
  );
};

export default DarkModeToggle;
