import useTheme from "./hooks/useTheme";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <div className="fixed top-2 right-2 sm:top-3 sm:right-3 md:top-5 md:right-5 z-50 print:hidden">
      <button
        onClick={toggle}
        aria-label="Toggle theme"
        className="inline-flex items-center gap-1 sm:gap-2 px-2 py-1 sm:px-3 sm:py-2 
                   rounded-md border border-gray-300 dark:border-gray-600
                   bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-100
                   hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
      >
        {theme === "dark" ? (
          <>
            <span>🌙</span>
            <span className="hidden xs:inline">Dark</span>
          </>
        ) : (
          <>
            <span>☀️</span>
            <span className="hidden xs:inline">Light</span>
          </>
        )}
      </button>
    </div>
  );
}
