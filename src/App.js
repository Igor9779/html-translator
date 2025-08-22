import React, { useState, useEffect } from "react";
import axios from "axios";
import LanguageSelector from "./LanguageSelector";
import FileTranslator from "./FileTranslator";
import ImageZipCompressor from "./ImageZipCompressor";
import ThemeToggle from "./ThemeToggle";
import AddressGenerator from "./AddressGenerator";
import NumberGenerator from "./NumberGenerator";

async function translateTextGoogle(text, source = "en", target = "uk") {
  if (!text.trim()) return text;
  const { data } = await axios.get(
    "https://translate.googleapis.com/translate_a/single",
    {
      params: { client: "gtx", sl: source, tl: target, dt: "t", q: text },
    }
  );
  return data[0].map((item) => item[0]).join("");
}

export default function App() {
  const [inputHtml, setInputHtml] = useState(
    "<p>Hello <strong>world</strong>!</p>"
  );
  const [translatedHtml, setTranslatedHtml] = useState("");
  const [sourceLang, setSourceLang] = useState(
    () => localStorage.getItem("sourceLang") || "en"
  );
  const [targetLang, setTargetLang] = useState(
    () => localStorage.getItem("targetLang") || "uk"
  );
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem("sourceLang", sourceLang);
  }, [sourceLang]);

  useEffect(() => {
    localStorage.setItem("targetLang", targetLang);
  }, [targetLang]);

  const languages = [
    { code: "en", name: "English" },
    { code: "uk", name: "Українська" },
    { code: "ru", name: "Русский" },
    { code: "de", name: "Deutsch" },
    { code: "fr", name: "Français" },
    { code: "es", name: "Español" },
    { code: "hu", name: "Magyar" },
    { code: "et", name: "Eesti" },
    { code: "pt", name: "Português" },
    { code: "cs", name: "Čeština" },
    { code: "ro", name: "Română" },
  ];

  const handleTranslate = async () => {
    setLoading(true);
    const parts = inputHtml.split(/(<\/?.+?>)/g).filter(Boolean);
    const translated = await Promise.all(
      parts.map(async (part) => {
        if (/^<\/?[^>]+>$/.test(part)) return part;
        const leading = (part.match(/^\s+/) || [""])[0];
        const trailing = (part.match(/\s+$/) || [""])[0];
        const core = part.trim();
        if (!core) return part;
        const tr = await translateTextGoogle(core, sourceLang, targetLang);
        return leading + tr + trailing;
      })
    );
    setTranslatedHtml(translated.join(""));
    setLoading(false);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(translatedHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <style>{`
      @keyframes spin { to { transform: rotate(360deg); } }
    `}</style>
      <div
        className="min-h-screen font-sans transition-colors
                bg-white text-gray-900
                dark:bg-gray-900 dark:text-gray-100"
      >
        <div className="max-w-2xl mx-auto p-6 font-sans dark:bg-gray-900 dark:text-gray-100 transition-colors">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 text-center">
            HTML-перекладач
          </h2>
          <div className="ml-4">
            <ThemeToggle />
          </div>

          <LanguageSelector
            sourceLang={sourceLang}
            targetLang={targetLang}
            onSourceChange={setSourceLang}
            onTargetChange={setTargetLang}
            languages={languages}
          />

          <FileTranslator sourceLang={sourceLang} targetLang={targetLang} />

          <textarea
            rows={4}
            className="w-full mt-4 p-3 border border-gray-300 dark:border-gray-700 rounded-md font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 transition dark:bg-gray-800 dark:text-gray-100"
            value={inputHtml}
            onChange={(e) => setInputHtml(e.target.value)}
            placeholder="Вставте сюди HTML..."
          />

          <div className="flex flex-wrap items-center gap-3 mt-4">
            <button
              onClick={() => setInputHtml("")}
              className="px-4 py-2 bg-red-600 text-white rounded-md shadow hover:bg-red-700 transition"
            >
              Очистити
            </button>
            <button
              onClick={handleTranslate}
              disabled={loading}
              className={`px-5 py-2 rounded-md shadow text-white transition 
            ${
              loading
                ? "bg-blue-300 cursor-not-allowed dark:bg-blue-400"
                : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            }
          `}
            >
              {loading ? "Перекладаємо…" : "Перекласти"}
            </button>
          </div>

          {loading && (
            <div className="fixed inset-0 bg-white/70 dark:bg-black/70 flex items-center justify-center z-50">
              <div className="w-16 h-16 border-8 border-gray-200 dark:border-gray-600 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          )}

          <h3 className="text-lg font-semibold mt-6 mb-2 text-gray-800 dark:text-gray-100">
            Результат:
          </h3>
          <div
            className="border border-gray-300 dark:border-gray-700 rounded-md p-4 bg-gray-50 dark:bg-gray-800 min-h-[60px]"
            dangerouslySetInnerHTML={{ __html: translatedHtml }}
          />

          <h3 className="text-lg font-semibold mt-6 mb-2 text-gray-800 dark:text-gray-100">
            Сирий HTML:
          </h3>
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-green-600 text-white rounded-md shadow hover:bg-green-700 transition dark:bg-green-500 dark:hover:bg-green-600"
            >
              Скопіювати
            </button>
            {copied && (
              <span className="text-green-600 dark:text-green-400 font-semibold">
                Скопійовано!
              </span>
            )}
          </div>

          <pre className="border border-gray-300 dark:border-gray-700 rounded-md bg-gray-100 dark:bg-gray-800 p-4 whitespace-pre-wrap font-mono text-sm text-gray-800 dark:text-gray-100">
            {translatedHtml}
          </pre>

          <div className="mt-8">
            <ImageZipCompressor />
          </div>
          <div className="mt-8">
            <AddressGenerator />
          </div>
          <div className="mt-8">
            <NumberGenerator />
          </div>
        </div>
      </div>
    </>
  );
}
