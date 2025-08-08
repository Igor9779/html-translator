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
    <div style={{ display: "flex", gap: "1rem", marginBottom: 10 }}>
      <label style={{ display: "flex", flexDirection: "column" }}>
        Звідки:
        <select
          value={sourceLang}
          onChange={(e) => onSourceChange(e.target.value)}
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </label>
      <label style={{ display: "flex", flexDirection: "column" }}>
        Куди:
        <select
          value={targetLang}
          onChange={(e) => onTargetChange(e.target.value)}
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
