import { useEffect, useState } from "react";

export default function useTheme() {
  const getInitial = () => {
    const ls = localStorage.getItem("theme");
    if (ls) return ls; // 'light' | 'dark'
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  const [theme, setTheme] = useState(getInitial);

  useEffect(() => {
    const root = document.documentElement.classList;
    if (theme === "dark") root.add("dark");
    else root.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  // оновлюємося при зміні системної теми, якщо користувач не задав свою (необов'язково)
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const ls = localStorage.getItem("theme");
      if (!ls) setTheme(media.matches ? "dark" : "light");
    };
    media.addEventListener?.("change", handler);
    return () => media.removeEventListener?.("change", handler);
  }, []);

  const toggle = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  return { theme, toggle, setTheme };
}
