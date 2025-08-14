import React, { useState, useEffect } from "react";
import axios from "axios";
import LanguageSelector from "./LanguageSelector";
import FileTranslator from "./FileTranslator";

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
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }
.loader-overlay { position: fixed; top:0; left:0; width:100%; height:100%; background:rgba(255,255,255,0.7); display:flex; align-items:center; justify-content:center; z-index:1000; }
.spinner { width:60px; height:60px; border:8px solid #f3f3f3; border-top-color:#2563eb; border-radius:50%; animation:spin 1s linear infinite; }`}</style>
      <div
        style={{
          padding: 20,
          maxWidth: 700,
          margin: "0 auto",
          fontFamily: "sans-serif",
        }}
      >
        <h2>HTML-перекладач</h2>
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
          style={{ width: "100%", fontFamily: "monospace" }}
          value={inputHtml}
          onChange={(e) => setInputHtml(e.target.value)}
        />
        <button
          onClick={() => setInputHtml("")}
          style={{
            margin: "10px 8px",
            padding: "6px 12px",
            background: "#e53e3e",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Очистити
        </button>
        <button
          onClick={handleTranslate}
          disabled={loading}
          style={{
            margin: "10px 0",
            padding: "8px 16px",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Перекладаємо…" : "Перекласти"}
        </button>
        {loading && (
          <div className="loader-overlay">
            <div className="spinner" />
          </div>
        )}
        <h3>Результат:</h3>
        <div
          style={{ border: "1px solid #ccc", padding: 10, minHeight: 60 }}
          dangerouslySetInnerHTML={{ __html: translatedHtml }}
        />
        <h3>Сирий HTML:</h3>
        <button
          onClick={handleCopy}
          style={{
            margin: "10px 0 5px",
            padding: "6px 12px",
            background: "#4caf50",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Скопіювати
        </button>
        {copied && (
          <span style={{ marginLeft: 8, color: "#4caf50", fontWeight: "bold" }}>
            Скопійовано!
          </span>
        )}
        <pre
          style={{
            border: "1px solid #ccc",
            padding: 10,
            whiteSpace: "pre-wrap",
            background: "#f9f9f9",
            fontFamily: "monospace",
            marginTop: 5,
          }}
        >
          {translatedHtml}
        </pre>
      </div>
    </>
  );
}
