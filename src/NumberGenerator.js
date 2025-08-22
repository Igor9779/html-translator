import React, { useState } from "react";

/**
 * Генерація мобільних номерів у форматі E.164 та локальному.
 */
const cfg = {
  US: {
    name: "United States",
    gen: () => {
      const area = randBetween(200, 989);
      const exchange = randBetween(200, 999);
      const line = pad(randBetween(0, 9999), 4);
      return {
        e164: `+1${area}${exchange}${line}`,
        pretty: `+1 (${area}) ${exchange}-${line}`,
      };
    },
  },
  UA: {
    name: "Україна",
    gen: () => {
      const p = choose([
        "39",
        "50",
        "63",
        "66",
        "67",
        "68",
        "73",
        "91",
        "92",
        "93",
        "94",
        "95",
        "96",
        "97",
        "98",
        "99",
      ]);
      const tail = pad(randBetween(0, 9999999), 7);
      return {
        e164: `+380${p}${tail}`,
        pretty: `+380 ${p} ${tail.slice(0, 3)} ${tail.slice(3, 5)} ${tail.slice(
          5
        )}`,
      };
    },
  },
  PL: {
    name: "Polska",
    gen: () => genericWithMask("+48 ### ### ###"),
  },
  DE: {
    name: "Deutschland",
    gen: () => {
      const p = choose(["15", "16", "17"]);
      const rest = pad(randBetween(0, 99999999), 8);
      return {
        e164: `+49${p}${rest}`,
        pretty: `+49 ${p}${rest.slice(0, 2)} ${rest.slice(2, 5)} ${rest.slice(
          5
        )}`,
      };
    },
  },
  FR: {
    name: "France",
    gen: () => {
      const s = choose(["6", "7"]);
      const rest = pad(randBetween(0, 99999999), 8);
      return {
        e164: `+33${s}${rest}`,
        pretty: `+33 ${s} ${rest.match(/.{1,2}/g).join(" ")}`,
      };
    },
  },
  IT: {
    name: "Italia",
    gen: () => {
      const p = `3${randDigit()}`;
      const rest = pad(randBetween(0, 99999999), 8);
      return {
        e164: `+39${p}${rest}`,
        pretty: `+39 ${p} ${rest.slice(0, 3)} ${rest.slice(3, 6)} ${rest.slice(
          6
        )}`,
      };
    },
  },
  ES: {
    name: "España",
    gen: () => {
      const s = choose(["6", "7"]);
      const rest = pad(randBetween(0, 99999999), 8);
      return {
        e164: `+34${s}${rest}`,
        pretty: `+34 ${s}${rest.slice(0, 2)} ${rest.slice(2, 5)} ${rest.slice(
          5
        )}`,
      };
    },
  },
  PT: {
    name: "Portugal",
    gen: () => {
      const p = `9${randDigit()}`;
      const rest = pad(randBetween(0, 99999999), 8);
      return {
        e164: `+351${p}${rest}`,
        pretty: `+351 ${p}${rest.slice(0, 2)} ${rest.slice(2, 5)} ${rest.slice(
          5
        )}`,
      };
    },
  },
  NL: {
    name: "Nederland",
    gen: () => {
      const rest = pad(randBetween(0, 99999999), 8);
      return {
        e164: `+316${rest}`,
        pretty: `+31 6 ${rest.slice(0, 2)} ${rest.slice(2, 4)} ${rest.slice(
          4,
          6
        )} ${rest.slice(6)}`,
      };
    },
  },
  EE: {
    name: "Eesti",
    gen: () => {
      const rest = pad(randBetween(0, 9999999), 7);
      return {
        e164: `+3725${rest}`,
        pretty: `+372 5${rest.slice(0, 2)} ${rest.slice(2, 5)} ${rest.slice(
          5
        )}`,
      };
    },
  },
  LV: {
    name: "Latvija",
    gen: () => {
      const rest = pad(randBetween(0, 9999999), 7);
      return {
        e164: `+3712${rest}`,
        pretty: `+371 2${rest.slice(0, 2)} ${rest.slice(2, 5)} ${rest.slice(
          5
        )}`,
      };
    },
  },
  LT: {
    name: "Lietuva",
    gen: () => {
      const rest = pad(randBetween(0, 9999999), 7);
      return {
        e164: `+3706${rest}`,
        pretty: `+370 6${rest.slice(0, 2)} ${rest.slice(2, 4)} ${rest.slice(
          4
        )}`,
      };
    },
  },
  BR: {
    name: "Brasil",
    gen: () => {
      const area = pad(randBetween(11, 99), 2);
      const body = pad(randBetween(0, 99999999), 8);
      return {
        e164: `+55${area}9${body}`,
        pretty: `+55 (${area}) 9${body.slice(0, 4)}-${body.slice(4)}`,
      };
    },
  },
  RO: {
    name: "România",
    gen: () => {
      const p = `7${randDigit()}`;
      const rest = pad(randBetween(0, 9999999), 7);
      return {
        e164: `+40${p}${rest}`,
        pretty: `+40 ${p}${rest.slice(0, 2)} ${rest.slice(2, 5)} ${rest.slice(
          5
        )}`,
      };
    },
  },
  HU: {
    name: "Magyarország",
    gen: () => {
      const p = choose(["20", "30", "70"]);
      const rest = pad(randBetween(0, 9999999), 7);
      return {
        e164: `+36${p}${rest}`,
        pretty: `+36 ${p} ${rest.slice(0, 3)} ${rest.slice(3)}`,
      };
    },
  },
  KZ: {
    name: "Қазақстан",
    gen: () => {
      const p = choose(["70", "77"]);
      const rest = pad(randBetween(0, 9999999), 7);
      return {
        e164: `+7${p}${rest}`,
        pretty: `+7 ${p} ${rest.slice(0, 3)} ${rest.slice(3, 5)} ${rest.slice(
          5
        )}`,
      };
    },
  },
};

const countries = Object.keys(cfg).map((c) => ({ code: c, name: cfg[c].name }));

// Допоміжні функції
function choose(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function randBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randDigit() {
  return Math.floor(Math.random() * 10);
}
function pad(n, len) {
  return String(n).padStart(len, "0");
}
function genericWithMask(mask) {
  const onlyDigits = mask.replace(/#/g, () => randDigit()).replace(/\D/g, "");
  const pretty = mask.replace(/#/g, () => randDigit());
  return { e164: `+${onlyDigits}`, pretty };
}

export default function NumberGenerator() {
  const [selectedCountry, setSelectedCountry] = useState("UA");
  const [number, setNumber] = useState(null);
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const { e164, pretty } = cfg[selectedCountry].gen();
    setNumber({ e164, pretty, country: cfg[selectedCountry].name });
    setCopied(false);
  };

  const copy = async () => {
    if (!number) return;
    try {
      await navigator.clipboard.writeText(number.e164); // копіюємо тільки номер у форматі E.164
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ігноруємо */
    }
  };

  return (
    <div
      className="max-w-md mx-auto my-6 p-6 rounded-xl shadow-sm
                 bg-white text-gray-900
                 dark:bg-gray-900 dark:text-gray-100 transition-colors"
    >
      <h2 className="text-xl font-semibold mb-4 text-center">
        Random Number Generator
      </h2>

      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
        Country
      </label>
      <select
        value={selectedCountry}
        onChange={(e) => setSelectedCountry(e.target.value)}
        className="w-full mb-4 px-3 py-2 rounded-md border
                   bg-white text-gray-900
                   border-gray-300 placeholder-gray-400
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                   dark:bg-gray-800 dark:text-gray-100
                   dark:border-gray-600 dark:placeholder-gray-400"
      >
        {countries.map((c) => (
          <option key={c.code} value={c.code}>
            {c.name}
          </option>
        ))}
      </select>

      <button
        onClick={generate}
        className="w-full px-4 py-2 rounded-md text-white font-medium
                   bg-blue-600 hover:bg-blue-700
                   dark:bg-blue-500 dark:hover:bg-blue-600
                   focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      >
        Generate Number
      </button>

      {number && (
        <div className="mt-5 rounded-lg border p-4 bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <p className="text-sm">
            <span className="font-semibold">Country:</span> {number.country}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Local format:</span> {number.pretty}
          </p>
          <p className="text-sm">
            <span className="font-semibold">E.164:</span> {number.e164}
          </p>

          <div className="mt-3 flex items-center gap-3">
            <button
              onClick={copy}
              className="px-3 py-2 text-sm rounded-md border
                         border-gray-300 hover:bg-gray-100
                         dark:border-gray-600 dark:hover:bg-gray-700
                         focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              Copy
            </button>
            {copied && (
              <span className="text-green-500 font-semibold text-sm">
                Copied!
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
