// src/translateGoogle.js
import axios from "axios";

export async function translateTextGoogle(text, source = "en", target = "uk") {
  if (!text.trim()) return text;
  try {
    // Собираем URL
    const url = "https://translate.googleapis.com/translate_a/single";
    const params = {
      client: "gtx",
      sl: source,
      tl: target,
      dt: "t",
      q: text,
    };
    const res = await axios.get(url, { params });
    // res.data[0] — массив фрагментов [ [translated, original, ...], ... ]
    return res.data[0].map(item => item[0]).join("");
  } catch (err) {
    console.error("GoogleTranslate error:", err);
    return text;
  }
}
