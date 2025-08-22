import React, { useState } from "react";

// Список країн з назвами рідною мовою
const countries = [
  { code: "US", name: "United States" },
  { code: "UA", name: "Україна" },
  { code: "PL", name: "Polska" },
  { code: "DE", name: "Deutschland" },
  { code: "FR", name: "France" },
  { code: "IT", name: "Italia" },
  { code: "ES", name: "España" },
  { code: "PT", name: "Portugal" },
  { code: "RO", name: "România" },
  { code: "HU", name: "Magyarország" },
  { code: "KZ", name: "Қазақстан" },
  { code: "EE", name: "Eesti" },
  { code: "NL", name: "Nederland" },
];

// Дані для генерації
const addressData = {
  US: {
    streets: ["Main St", "Broadway", "Elm St", "Maple Ave", "Oak St"],
    cities: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"],
    zip: () => String(Math.floor(10000 + Math.random() * 89999)),
  },
  UA: {
    streets: [
      "вул. Шевченка",
      "пр-т Перемоги",
      "вул. Хрещатик",
      "вул. Лесі Українки",
    ],
    cities: ["Київ", "Львів", "Харків", "Одеса", "Дніпро"],
    zip: () => String(Math.floor(10000 + Math.random() * 89999)),
  },
  PL: {
    streets: ["ul. Długa", "ul. Krótka", "al. Jerozolimskie", "ul. Nowa"],
    cities: ["Warszawa", "Kraków", "Gdańsk", "Wrocław", "Poznań"],
    zip: () =>
      `${Math.floor(10 + Math.random() * 89)}-${Math.floor(
        100 + Math.random() * 899
      )}`,
  },
  DE: {
    streets: [
      "Alexanderplatz",
      "Friedrichstraße",
      "Kurfürstendamm",
      "Unter den Linden",
    ],
    cities: ["Berlin", "Hamburg", "München", "Frankfurt", "Köln"],
    zip: () => String(Math.floor(10000 + Math.random() * 89999)),
  },
  FR: {
    streets: [
      "Rue de Rivoli",
      "Avenue des Champs-Élysées",
      "Boulevard Saint-Germain",
      "Rue de la Paix",
    ],
    cities: ["Paris", "Lyon", "Marseille", "Nice", "Toulouse"],
    zip: () => `75${Math.floor(100 + Math.random() * 899)}`,
  },
  IT: {
    streets: ["Via Roma", "Corso Italia", "Via Milano", "Piazza Venezia"],
    cities: ["Roma", "Milano", "Napoli", "Torino", "Firenze"],
    zip: () => String(Math.floor(10000 + Math.random() * 89999)),
  },
  ES: {
    streets: ["Calle Mayor", "Gran Vía", "Calle de Alcalá", "Paseo del Prado"],
    cities: ["Madrid", "Barcelona", "Valencia", "Sevilla", "Bilbao"],
    zip: () => String(Math.floor(10000 + Math.random() * 89999)),
  },
  PT: {
    streets: [
      "Rua Augusta",
      "Avenida da Liberdade",
      "Rua do Carmo",
      "Rua Garrett",
    ],
    cities: ["Lisboa", "Porto", "Faro", "Coimbra", "Braga"],
    zip: () =>
      `${Math.floor(1000 + Math.random() * 8999)}-${Math.floor(
        100 + Math.random() * 899
      )}`,
  },
  RO: {
    streets: [
      "Strada Victoriei",
      "Bulevardul Unirii",
      "Strada Revoluției",
      "Strada Libertății",
    ],
    cities: ["București", "Cluj-Napoca", "Iași", "Timișoara", "Brașov"],
    zip: () => String(Math.floor(10000 + Math.random() * 89999)),
  },
  HU: {
    streets: ["Andrássy út", "Váci utca", "Rákóczi út", "Bajcsy-Zsilinszky út"],
    cities: ["Budapest", "Debrecen", "Szeged", "Pécs", "Győr"],
    zip: () => String(Math.floor(1000 + Math.random() * 8999)),
  },
  KZ: {
    streets: ["ул. Абая", "пр. Назарбаева", "ул. Толе би", "ул. Сейфуллина"],
    cities: ["Алматы", "Астана", "Шымкент", "Караганда", "Актобе"],
    zip: () => String(Math.floor(100000 + Math.random() * 899999)),
  },
  EE: {
    streets: ["Narva mnt", "Tartu mnt", "Pärnu mnt", "Viru tänav"],
    cities: ["Tallinn", "Tartu", "Pärnu", "Narva", "Viljandi"],
    zip: () => String(Math.floor(10000 + Math.random() * 89999)),
  },
  NL: {
    streets: ["Damrak", "Prinsengracht", "Herengracht", "Keizersgracht"],
    cities: ["Amsterdam", "Rotterdam", "The Hague", "Utrecht", "Eindhoven"],
    zip: () =>
      `${Math.floor(1000 + Math.random() * 8999)} ${String.fromCharCode(
        65 + Math.floor(Math.random() * 26)
      )}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
  },
};

// Допоміжна функція для вибору випадкового елемента
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

export default function AddressGenerator() {
  const [selectedCountry, setSelectedCountry] = useState("UA");
  const [address, setAddress] = useState(null);
  const [copied, setCopied] = useState(false);

  const generateAddress = () => {
    const data = addressData[selectedCountry];
    const randomAddress = {
      street: `${randomItem(data.streets)} ${Math.floor(
        1 + Math.random() * 200
      )}`,
      city: randomItem(data.cities),
      zipCode: data.zip(),
      country: countries.find((c) => c.code === selectedCountry).name, // локалізована назва
    };
    setAddress(randomAddress);
    setCopied(false);
  };

  const copyOne = async () => {
    if (!address) return;
    const text = `${address.street}, ${address.city}, ${address.zipCode}, ${address.country}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      console.error("Failed to copy address.");
    }
  };

  return (
    <div
      className="max-w-md mx-auto my-6 p-6 rounded-xl shadow-sm
                 bg-white text-gray-900
                 dark:bg-gray-900 dark:text-gray-100 transition-colors"
    >
      <h2 className="text-xl font-semibold mb-4 text-center">
        Random Address Generator
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
        {countries.map((country) => (
          <option key={country.code} value={country.code}>
            {country.name}
          </option>
        ))}
      </select>

      <button
        onClick={generateAddress}
        className="w-full px-4 py-2 rounded-md text-white font-medium
                   bg-blue-600 hover:bg-blue-700
                   dark:bg-blue-500 dark:hover:bg-blue-600
                   focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      >
        Generate Address
      </button>

      {address && (
        <div
          className="mt-5 rounded-lg border p-4
                     bg-gray-50 border-gray-200
                     dark:bg-gray-800 dark:border-gray-700"
        >
          <p className="text-sm">
            <span className="font-semibold">Street:</span> {address.street}
          </p>
          <p className="text-sm">
            <span className="font-semibold">City:</span> {address.city}
          </p>
          <p className="text-sm">
            <span className="font-semibold">ZIP:</span> {address.zipCode}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Country:</span> {address.country}
          </p>

          <div className="mt-3 flex items-center gap-3">
            <button
              onClick={copyOne}
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
