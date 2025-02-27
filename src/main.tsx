
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Function to handle initial dark/light mode
const initializeTheme = () => {
  // Check stored theme or system preference
  const storedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  
  if (storedTheme === "dark" || (!storedTheme && prefersDark)) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};

// Initialize theme before rendering
initializeTheme();

// Render the app
createRoot(document.getElementById("root")!).render(<App />);
