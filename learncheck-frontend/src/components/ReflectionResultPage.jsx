import React from "react";
import logoLight from "../images/logo-light-mode.png";
import logoDark from "../images/logo-dark-mode.png";

import sadIcon from "../images/sad-emoticon.png";
import neutralIcon from "../images/neutral-emoticon.png";
import happyIcon from "../images/happy-emoticon.png";

export default function ReflectionResultPage({
  rating,
  moduleTitle,
  contextText,
  onViewFinalScore,
  onViewHistory,
  userPrefs
}) {

  const FEEDBACK = {
    1: {
      title: "Kurang Memahami",
      text: "Materi ini mungkin cukup menantang. Disarankan untuk meninjau kembali bagian pentingnya agar pemahamanmu semakin kuat.",
      colorVar: "var(--red-primary)",
      icon: sadIcon
    },
    2: {
      title: "Cukup Memahami",
      text: "Pemahamanmu sudah baik. Sedikit penguatan akan membuatmu lebih mantap. Semangat!",
      colorVar: "var(--yellow-primary)",
      icon: neutralIcon
    },
    3: {
      title: "Memahami dengan Baik",
      text: "Pemahamanmu sangat baik. Pertahankan dan tetap semangat belajar!",
      colorVar: "var(--green-primary)",
      icon: happyIcon
    }
  };

  const { title, text, colorVar, icon } = FEEDBACK[rating];

  const isDark = userPrefs.theme === "dark";
  const logoSrc = isDark ? logoDark : logoLight;
  const titleColor = isDark
    ? "text-[var(--text-primary)]"
    : "text-[var(--blue-primary)]";
    
const greenWrapper = isDark
  ? "bg-[var(--green-secondary)] border border-[var(--green-primary)]"
  : "bg-[var(--green-primary)] border border-[var(--green-secondary)]";

const redWrapper = isDark
  ? "bg-[var(--red-secondary)] border border-[var(--red-primary)]"
  : "bg-[var(--red-primary)] border border-[var(--red-secondary)]";


  return (
    <div
      className="
        min-h-screen w-full
        flex items-center justify-center
        bg-[var(--bg-primary)] text-[var(--text-primary)]
        transition-colors duration-300
        opacity-0 animate-fadeIn
      "
    >
      <div className="w-[var(--max-width-card)]">

        <header
          className="
            px-4 sm:px-6 py-3 sm:py-4
            flex items-center
            bg-[var(--bg-secondary)]
            border-b border-[var(--text-primary)]/20
            rounded-t-2xl shadow
          "
        >
          <img
            src={logoSrc}
            alt="LearnCheck Logo"
            className="w-14 h-14 sm:w-16 sm:h-16"
          />

          <div className="leading-tight ml-3">
            <h1 className={`font-subtitle font-bold ${titleColor}`}>
              LearnCheck!
            </h1>
            <p className={`font-mini ${titleColor}`}>
              Formative Assessment <br /> Powered with AI
            </p>
          </div>
        </header>

        <div
          className="
            px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12
            rounded-b-2xl shadow bg-[var(--bg-secondary)]
          "
        >
          <div className="mb-6 text-center">
            <h1 className="font-heading font-bold text-[var(--text-primary)]">
              Hasil Refleksi Belajar
            </h1>
          </div>

          <div
            className="
              p-6 sm:p-8 rounded-2xl border-1 shadow-sm mb-6
              bg-[var(--text-primary)]/3
              border-[var(--text-primary)]/20
              text-center
            "
          >
            <div className="flex flex-col items-center mb-3">
              <img
                src={icon}
                alt="Rating Icon"
                className="w-16 h-16 mb-3 drop-shadow-lg"
                style={{
                  filter: `drop-shadow(0 0 8px ${colorVar})`
                }}
              />

              <h2
                className="font-subtitle font-bold"
                style={{ color: colorVar }}
              >
                {title}
              </h2>
            </div>

            <p className="font-body leading-relaxed text-[var(--text-primary)]">
              {text}
            </p>
          </div>

          <div
            className="
              p-6 sm:p-8 rounded-2xl border-1 shadow-sm mb-8
              bg-[var(--text-primary)]/3
              border-[var(--text-primary)]/20
            "
          >
            <h3 className="font-subtitle font-semibold mb-3">
              {moduleTitle}
            </h3>
            <p className="font-body leading-relaxed">
              {contextText || "Tidak ada ringkasan materi tersedia."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={onViewHistory}
              className={`
                py-3 sm:py-4 rounded-2xl font-bold font-body
                hover:brightness-95 active:brightness-95
                transition text-[var(--white-primary)]
                ${greenWrapper}
                `}
            >
              Lihat Riwayat Kuis
            </button>

            <button
              onClick={onViewFinalScore}
                className={`
                py-3 sm:py-4 rounded-2xl font-bold font-body
                hover:brightness-110 active:brightness-95
                transition text-[var(--white-primary)]
                ${redWrapper}
                `}
            >
              Lihat Skor Akhir
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
