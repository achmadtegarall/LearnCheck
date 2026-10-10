import React from "react";

import hintLogoButton from "../images/hint-logo-button.png";
import logoLight from "../images/logo-light-mode.png";
import logoDark from "../images/logo-dark-mode.png";

/**
 * QuizHeader — Displays the LearnCheck logo, module title,
 * and the current question's status badge (Benar/Salah).
 */
export default function QuizHeader({
  userPrefs,
  moduleTitle,
  isCurrentQuestionSubmitted,
  isCurrentQuestionCorrect,
}) {
  const isDark = userPrefs.theme === "dark";
  const logoSrc = isDark ? logoDark : logoLight;
  const titleColor = isDark
    ? "text-[var(--text-secondary)]"
    : "text-[var(--blue-primary)]";

  const renderStatusBadge = () => {
    if (!isCurrentQuestionSubmitted) return null;

    return (
      <div
        className={`
          px-7 py-1.5 rounded-xl
          font-mini font-semibold border-1
          ${
            isCurrentQuestionCorrect
              ? "bg-[var(--green-secondary)] border-[var(--green-primary)] text-[var(--green-primary)]"
              : "bg-[var(--red-secondary)] border-[var(--red-primary)] text-[var(--red-primary)]"
          }
        `}
      >
        {isCurrentQuestionCorrect ? "Benar" : "Salah"}
      </div>
    );
  };

  return (
    <div className="px-2 sm:px-2 py-2 mb-2 sm:mb-5">
      <div className="lc-header grid grid-cols-1 sm:grid-cols-3 items-center gap-2 sm:gap-0">
        <div className="flex items-center gap-2 header-left">
          <img
            src={logoSrc}
            alt="LearnCheck Logo"
            className="w-12 h-12 sm:w-16 sm:h-16"
          />
          <div className="leading-tight text-left">
            <span
              className={`block font-subtitle sm:text-2xl font-bold ${titleColor}`}
            >
              LearnCheck!
            </span>
            <span className={`block font-mini ${titleColor}`}>
              Formative Assessment
              <br />
              Powered with AI
            </span>
          </div>
        </div>

        <div className="header-title flex justify-center items-center my-1 sm:my-0">
          <p className="font-body font-medium text-[var(--text-primary)]/80 text-left sm:text-center">
            {moduleTitle}
          </p>
        </div>
        <div className="flex justify-center sm:justify-end pr-0 sm:pr-3 header-status">
          {renderStatusBadge()}
        </div>
      </div>
    </div>
  );
}
