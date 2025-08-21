import React from "react";

/**
 * Компонент вибору мов перекладу
 * @param {{ sourceLang: string, targetLang: string, onSourceChange: (lang: string) => void, onTargetChange: (lang: string) => void, languages: {code: string, name: string}[] }} props
 */
export default function LanguageSelector({
  sourceLang,
  targetLang,
  onSourceChange,
  onTargetChange,
  languages,
}) {
  return (
    <div className="flex gap-4 mb-3">
      {/* Звідки */}
      <label className="flex flex-col text-sm font-medium text-gray-700 dark:text-gray-200">
        Звідки:
        <select
          value={sourceLang}
          onChange={(e) => onSourceChange(e.target.value)}
          className="mt-1 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 cursor-pointer 
                   bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                   transition duration-200"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </label>

      {/* Куди */}
      <label className="flex flex-col text-sm font-medium text-gray-700 dark:text-gray-200">
        Куди:
        <select
          value={targetLang}
          onChange={(e) => onTargetChange(e.target.value)}
          className="mt-1 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 cursor-pointer 
                   bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                   transition duration-200"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
