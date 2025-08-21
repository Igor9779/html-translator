import React, { useState } from "react";
import axios from "axios";
import "./FileTranslator.css";

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

export default function FileTranslator({ sourceLang, targetLang }) {
  const [loading, setLoading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);

    const text = await file.text();
    const parts = text.split(/(<\/?.+?>)/g).filter(Boolean);
    let ignoreBlock = false;

    const translated = await Promise.all(
      parts.map(async (part) => {
        // Відкриття <style> або <script>
        if (/^<\s*(style|script)(\s|>)/i.test(part)) {
          ignoreBlock = true;
          return part;
        }
        // Закриття </style> або </script>
        if (/^<\s*\/\s*(style|script)\s*>/i.test(part)) {
          ignoreBlock = false;
          return part;
        }
        // Якщо ми всередині блоку <style>…</style> або <script>…</script>, або це будь-який тег — повертаємо без змін
        if (ignoreBlock || /^<\/?[^>]+>$/.test(part)) {
          return part;
        }
        // Інакше — чистий текст, переводимо
        const leading = (part.match(/^\s+/) || [""])[0];
        const trailing = (part.match(/\s+$/) || [""])[0];
        const core = part.trim();
        if (!core) return part;
        const tr = await translateTextGoogle(core, sourceLang, targetLang);
        return leading + tr + trailing;
      })
    );

    const result = translated.join("");
    const blob = new Blob([result], { type: file.type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name.replace(/\.(html?|php)$/, `.${targetLang}$&`);
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    setLoading(false);
    e.target.value = "";
  };

  return (
    <div
      className="file-translator p-4 border border-gray-300 rounded-md shadow-sm 
                  bg-gray-50 dark:bg-gray-800 dark:border-gray-600 transition"
    >
      <label className="ft-label block mb-2 font-medium text-gray-800 dark:text-gray-200">
        Завантажте HTML/PHP для перекладу:
        <input
          type="file"
          accept=".html,.php"
          onChange={handleFile}
          className="ft-input mt-2 block w-full text-sm text-gray-700 dark:text-gray-300
                   file:mr-4 file:py-2 file:px-4 file:rounded-md
                   file:border-0 file:text-sm file:font-semibold
                   file:bg-blue-600 file:text-white
                   hover:file:bg-blue-700 dark:file:bg-blue-500 dark:hover:file:bg-blue-600
                   cursor-pointer"
        />
      </label>

      {loading && (
        <div className="ft-loader mt-3 text-blue-600 dark:text-blue-400 font-semibold animate-pulse">
          Перекладаємо файл…
        </div>
      )}
    </div>
  );
}
