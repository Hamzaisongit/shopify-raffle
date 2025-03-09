import { createContext, useContext, useState } from "react";

const SiteContext = createContext();

export function SiteProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("en");
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <SiteContext.Provider value={{ theme, toggleTheme, language, setLanguage, sidebarOpen, setSidebarOpen }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  return useContext(SiteContext);
}
