import React, { useState } from "react";
import axios from "axios";

async function translateTextGoogle(text, source = "en", target = "uk") {
  if (!text.trim()) return text;
  const { data } = await axios.get(
    "https://translate.googleapis.com/translate_a/single",
    {
      params: {
        client: "gtx",
        sl: source,
        tl: target,
        dt: "t",
        q: text,
      },
    }
  );
  return data[0].map(item => item[0]).join("");
}

export default function App() {
  const [inputHtml, setInputHtml] = useState(
    "<p>Hello <strong>world</strong>!</p>"
  );
  const [translatedHtml, setTranslatedHtml] = useState("");

  const handleTranslate = async () => {
    const parts = inputHtml.split(/(<\/?[^>]+>)/g).filter(Boolean);
    const translated = await Promise.all(
      parts.map(async part => {
        if (/^<\/?[^>]+>$/.test(part)) return part;
        const leading  = (part.match(/^\s+/)  || [""])[0];
        const trailing = (part.match(/\s+$/) || [""])[0];
        const core     = part.trim();
        if (!core) return part;
        const tr = await translateTextGoogle(core);
        return leading + tr + trailing;
      })
    );
    setTranslatedHtml(translated.join(""));
  };

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
      <h2>HTML-Перекладач</h2>
      <textarea
        rows={4}
        style={{ width: "100%", fontFamily: "monospace" }}
        value={inputHtml}
        onChange={e => setInputHtml(e.target.value)}
      />
      <button onClick={handleTranslate} style={{ margin: "10px 0" }}>
        Перекласти
      </button>

      <h3>Результат (як текст із тегами):</h3>
      <pre
        style={{
          border: "1px solid #ccc",
          padding: 10,
          whiteSpace: "pre-wrap",
          wordBreak: "break-all",
          background: "#f9f9f9",
          fontFamily: "monospace"
        }}
      >
        {translatedHtml}
      </pre>
    </div>
  );
}
