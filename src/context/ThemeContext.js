import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

const ThemeContext = createContext({ theme: "dark", toggleTheme: () => {} });

export function ThemeProvider({ children }) {
  const router = useRouter();
  const isAdminRoute = router.pathname.startsWith("/admin");
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    if (isAdminRoute) {
      document.documentElement.dataset.theme = "dark";
      return;
    }
    const savedTheme = localStorage.getItem("site-theme");
    const nextTheme = savedTheme === "light" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
  }, [isAdminRoute]);

  const toggleTheme = () => {
    if (isAdminRoute) return;
    setTheme((current) => {
      const nextTheme = current === "dark" ? "light" : "dark";
      localStorage.setItem("site-theme", nextTheme);
      document.documentElement.dataset.theme = nextTheme;
      return nextTheme;
    });
  };

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
