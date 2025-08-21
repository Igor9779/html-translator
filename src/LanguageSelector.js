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
      <label className="flex flex-col text-sm font-medium text-gray-700">
        Звідки:
        <select
          value={sourceLang}
          onChange={(e) => onSourceChange(e.target.value)}
          className="mt-1 border border-gray-300 rounded-md px-3 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col text-sm font-medium text-gray-700">
        Куди:
        <select
          value={targetLang}
          onChange={(e) => onTargetChange(e.target.value)}
          className="mt-1 border border-gray-300 rounded-md px-3 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
