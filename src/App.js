// src/App.jsx
import React from "react";
import { Link, Routes, Route, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import HtmlTranslatorPage from "./pages/HtmlTranslatorPage";
import ImageCompressorPage from "./pages/ImageCompressorPage";
import AddressGeneratorPage from "./pages/AddressGeneratorPage";
import NumberGeneratorPage from "./pages/NumberGeneratorPage";

function Home() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Work Tools</h1>

      {/* Блок із перемикачем теми */}
      <div className="flex justify-end mb-4">
        <ThemeToggle />
      </div>

      {/* Кнопки навігації */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <NavButton to="/translate" label="HTML-перекладач" />
        <NavButton to="/compress" label="Стиснення зображень" />
        <NavButton to="/addresses" label="Генератор адрес" />
        <NavButton to="/numbers" label="Генератор номерів" />
      </div>
    </div>
  );
}

function NavButton({ to, label }) {
  return (
    <Link
      to={to}
      className="block w-full text-center px-4 py-3 rounded-lg
                 bg-blue-600 text-white font-medium
                 hover:bg-blue-700 active:scale-[0.98] transition
                 dark:bg-blue-500 dark:hover:bg-blue-600"
    >
      {label}
    </Link>
  );
}

function PageShell({ title, children }) {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen transition-colors bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <div className="max-w-3xl mx-auto p-6">
        {/* Заголовок та перемикач теми */}
        <div className="flex flex-col items-center mb-4">
          <h1 className="text-3xl font-semibold mb-2">{title}</h1>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="px-3 py-2 rounded-md border text-sm
                 border-gray-300 hover:bg-gray-100
                 dark:border-gray-700 dark:hover:bg-gray-800 transition"
            >
              На головну
            </Link>
            <ThemeToggle />
          </div>
        </div>

        {/* Контент сторінки */}
        <div className="rounded-xl p-4 border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800">
          {children}
        </div>

        {/* Хлібні крихти */}
        <div className="mt-6 text-xs text-gray-500 dark:text-gray-400">
          Path: <code>{pathname}</code>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PageShell title="Work Tools">
            <Home />
          </PageShell>
        }
      />
      <Route
        path="/translate"
        element={
          <PageShell title="HTML-перекладач">
            <HtmlTranslatorPage />
          </PageShell>
        }
      />
      <Route
        path="/compress"
        element={
          <PageShell title="Стиснення зображень">
            <ImageCompressorPage />
          </PageShell>
        }
      />
      <Route
        path="/addresses"
        element={
          <PageShell title="Генератор адрес">
            <AddressGeneratorPage />
          </PageShell>
        }
      />
      <Route
        path="/numbers"
        element={
          <PageShell title="Генератор номерів">
            <NumberGeneratorPage />
          </PageShell>
        }
      />
      <Route
        path="*"
        element={
          <PageShell title="Сторінку не знайдено">
            <div className="text-sm">404. Спробуй повернутися на головну.</div>
          </PageShell>
        }
      />
    </Routes>
  );
}
