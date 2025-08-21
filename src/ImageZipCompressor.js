import React, { useState, useRef } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const MAX_BYTES = 190 * 1024;
const MAX_DIMENSION = 4000;

async function fileToImageBitmap(file) {
  const arrayBuffer = await file.arrayBuffer();
  const blob = new Blob([arrayBuffer], { type: file.type });
  if ("createImageBitmap" in window) {
    return await createImageBitmap(blob);
  }
  const url = URL.createObjectURL(blob);
  const img = await new Promise((res, rej) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = url;
  });
  URL.revokeObjectURL(url);
  return img;
}

function drawToCanvas(image, targetW, targetH) {
  const canvas =
    "OffscreenCanvas" in window
      ? new OffscreenCanvas(targetW, targetH)
      : document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0, targetW, targetH);
  return canvas;
}

async function canvasToBlob(canvas, type, quality) {
  if ("convertToBlob" in canvas) {
    return await canvas.convertToBlob(
      quality != null ? { type, quality } : { type }
    );
  }
  return await new Promise((resolve) =>
    canvas.toBlob((b) => resolve(b), type, quality)
  );
}

/**
 * Стиск під ліміт із збереженням формату.
 * jpg/jpeg -> image/jpeg з quality, + масштабування
 * webp -> image/webp з quality, + масштабування
 * png -> image/png (без quality), тільки масштабування
 */
async function compressPreservingFormat(file, onProgress) {
  const img = await fileToImageBitmap(file);
  const origType = (file.type || "").toLowerCase();

  const origW = img.width;
  const origH = img.height;

  // обмеження максимального боку
  let scale = 1;
  const maxSide = Math.max(origW, origH);
  if (maxSide > MAX_DIMENSION) scale = MAX_DIMENSION / maxSide;

  let curW = Math.max(1, Math.round(origW * scale));
  let curH = Math.max(1, Math.round(origH * scale));

  const isJPEG = origType === "image/jpeg" || origType === "image/jpg";
  const isWEBP = origType === "image/webp";
  const isPNG = origType === "image/png";

  // Для форматів з якістю
  const qualities = isPNG
    ? [1]
    : [0.9, 0.85, 0.8, 0.75, 0.7, 0.65, 0.6, 0.55, 0.5, 0.45, 0.4];
  // Поступове зменшення розмірів
  const shrinkSteps = [1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.45, 0.4];

  const outMime = isJPEG ? "image/jpeg" : isWEBP ? "image/webp" : "image/png";
  const outExt = isJPEG ? "jpg" : isWEBP ? "webp" : "png";

  let bestBlob = null;

  for (let s = 0; s < shrinkSteps.length; s++) {
    const factor = shrinkSteps[s];
    const w = Math.max(1, Math.round(curW * factor));
    const h = Math.max(1, Math.round(curH * factor));
    const canvas = drawToCanvas(img, w, h);

    for (let q = 0; q < qualities.length; q++) {
      const quality = qualities[q];
      const blob = await canvasToBlob(
        canvas,
        outMime,
        isPNG ? undefined : quality
      );
      onProgress?.(
        Math.min(
          100,
          Math.round(
            ((s * qualities.length + (q + 1)) /
              (shrinkSteps.length * qualities.length)) *
              100
          )
        )
      );

      if (!bestBlob || blob.size < bestBlob.size) {
        bestBlob = blob;
      }

      if (blob.size <= MAX_BYTES) {
        return { blob, ext: outExt };
      }
    }
  }

  // Якщо не вклалися у ліміт — повертаємо найменший досягнутий варіант
  return { blob: bestBlob, ext: outExt };
}

export default function ImageZipCompressor() {
  const [files, setFiles] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [zipping, setZipping] = useState(false);
  const inputRef = useRef(null);

  function onSelect(e) {
    const list = Array.from(e.target.files || []);
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const filtered = list.filter((f) => allowed.includes(f.type));
    setFiles(filtered);
    setProgressMap({});
  }

  function updateProgress(name, value) {
    setProgressMap((prev) => ({ ...prev, [name]: value }));
  }

  async function handleCompressAndZip() {
    if (!files.length) return;
    setZipping(true);
    try {
      const zip = new JSZip();

      for (const file of files) {
        updateProgress(file.name, 1);
        const { blob, ext } = await compressPreservingFormat(file, (p) =>
          updateProgress(file.name, p)
        );

        const base = file.name.replace(/\.[^.]+$/, "") || "image";
        // зберігаємо оригінальний розширення, якщо воно збігається з ext;
        // але бережемо назву з _compressed, щоб не плутати з оригіналом
        const origExt = (file.name.split(".").pop() || "").toLowerCase();
        const useExt = origExt === ext ? ext : origExt; // гарантія "оригінального" формату в назві
        const filename = `${base}.${useExt}`;

        zip.file(filename, blob);
      }

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "compressed_images.zip");
    } catch (err) {
      console.error(err);
      alert("Сталася помилка під час стискання/архівації.");
    } finally {
      setZipping(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 text-center">
        Стиснення зображень у ZIP (≤ 190KB) з оригінальним форматом
      </h2>

      <div className="flex flex-col items-center gap-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 bg-white dark:bg-gray-800">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={onSelect}
        />
        <button
          onClick={() => inputRef.current?.click()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          Обрати зображення
        </button>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Підтримувані формати: JPG, JPEG, PNG, WEBP
        </p>
      </div>

      {!!files.length && (
        <div className="mt-5">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">
            Обрано файлів: {files.length}
          </h3>
          <ul className="space-y-2">
            {files.map((f) => (
              <li
                key={f.name + f.size}
                className="flex items-center justify-between gap-3 rounded-md border border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-800"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-gray-800 dark:text-gray-100">
                    {f.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {(f.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {progressMap[f.name] != null && (
                    <div className="w-40">
                      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded">
                        <div
                          className="h-2 bg-blue-600 dark:bg-blue-400 rounded"
                          style={{ width: `${progressMap[f.name]}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-300 mt-1 text-right">
                        {progressMap[f.name]}%
                      </div>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={handleCompressAndZip}
              disabled={zipping}
              className={`px-5 py-2 rounded-md text-white shadow transition ${
                zipping
                  ? "bg-blue-300 dark:bg-blue-600 cursor-not-allowed"
                  : "bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600"
              }`}
            >
              {zipping ? "Опрацьовуємо…" : "Стиснути та завантажити ZIP"}
            </button>
            <button
              onClick={() => {
                setFiles([]);
                setProgressMap({});
                if (inputRef.current) inputRef.current.value = "";
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-md shadow hover:bg-red-700 transition dark:bg-red-500 dark:hover:bg-red-600"
            >
              Очистити список
            </button>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
            Примітка: для PNG стискання відбувається шляхом зменшення розмірів.
            Якщо файл усе одно більший за 190 KB, це фізичне обмеження формату
            без зміни формату.
          </p>
        </div>
      )}
    </div>
  );
}
