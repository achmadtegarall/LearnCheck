import React from "react";

import hintLogoButton from "../images/hint-logo-button.png";

/**
 * QuizFooter — Contains all action buttons: Hint, Check/Reset,
 * View Score, and Previous/Next navigation.
 */
export default function QuizFooter({
  userPrefs,
  isLoading,
  currentQuestion,
  isCurrentQuestionSubmitted,
  isCurrentQuestionAnswered,
  isFirstQuestion,
  isLastQuestion,
  isAllQuestionsChecked,
  onShowHint,
  onCheckAnswer,
  onResetCurrentQuestion,
  onPrev,
  onNext,
  onOpenSelfReflection,
}) {
  const isMedium = userPrefs.layoutWidth === "mediumWidth";

  const secondaryBtn = `
    flex-1 sm:flex-none
    justify-center items-center
    px-3 py-2 sm:px-3 sm:py-2  
    rounded-lg font-medium 
    text-[11px] sm:text-xs
    border border-[var(--text-primary)] text-[var(--text-primary)]
    hover:bg-[var(--bg-primary)]/10
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-all duration-200
    whitespace-nowrap
  `;

  const primaryBtn = `
    flex-1 sm:flex-none
    justify-center items-center
    px-3 py-2 sm:px-4 sm:py-2 
    rounded-lg font-bold 
    text-[11px] sm:text-xs
    bg-[var(--blue-primary)] text-[var(--white-primary)]
    hover:brightness-110 hover:shadow-lg
    active:brightness-95
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-all duration-200
    whitespace-nowrap
  `;

  const resetBtn = `
    flex-1 sm:flex-none
    justify-center items-center
    px-3 py-2 sm:px-3 sm:py-2 
    rounded-lg font-semibold 
    text-[11px] sm:text-xs
    border border-red-500
    bg-red-500 text-[var(--white-primary)]
    hover:brightness-110 hover:shadow-lg
    active:brightness-95
    flex gap-1
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-all duration-200
    whitespace-nowrap
  `;

  let MainActionButton;
  if (isCurrentQuestionSubmitted) {
    MainActionButton = (
      <button
        onClick={onResetCurrentQuestion}
        className={resetBtn}
        disabled={isLoading}
      >
        <span>↻</span> Ulang
      </button>
    );
  } else if (isCurrentQuestionAnswered) {
    MainActionButton = (
      <button
        onClick={onCheckAnswer}
        className={primaryBtn}
        disabled={isLoading}
      >
        Periksa
      </button>
    );
  } else {
    MainActionButton = (
      <button
        onClick={onResetCurrentQuestion}
        className={resetBtn}
        disabled={isLoading}
      >
        <span>↻</span> Ulang
      </button>
    );
  }

  return (
    <div className="p-4 sm:p-5">
      <div className="footer-actions">
        <div className="footer-secondary">
          <button
            onClick={onShowHint}
            className="
              w-full sm:w-auto px-0 py-2 sm:px-3 sm:py-2 
              bg-[var(--hint-button-yellow)]
              text-[var(--text-light-primary)] rounded-lg font-semibold
              text-xs sm:font-mini
              flex items-center justify-center gap-1
              hover:brightness-110 hover:shadow-lg
              border border-[var(--hint-button-yellow)]
            "
            disabled={!currentQuestion.pre_hint || isLoading}
          >
            <img
              src={hintLogoButton}
              alt="Hint Logo"
              className="w-3.5 h-3.5"
            />
            <span>Petunjuk</span>
          </button>

          <div className="main-action-mediumwidth">{MainActionButton}</div>

          {isLastQuestion && isAllQuestionsChecked && (
            <button
              onClick={onOpenSelfReflection}
              className={`${primaryBtn} btn-score`}
              disabled={isLoading}
            >
              Lihat Hasil
            </button>
          )}
        </div>

        <div className="footer-navigation">
          <button
            onClick={onPrev}
            disabled={isFirstQuestion || isLoading}
            className={`${secondaryBtn} ${isMedium ? "truncate-nav" : ""}`}
          >
            &lt; {isMedium ? "Sebelum…" : "Sebelumnya"}
          </button>

          <button
            onClick={onNext}
            disabled={isLastQuestion || isLoading}
            className={`${secondaryBtn} ${isMedium ? "truncate-nav" : ""}`}
          >
            {isMedium ? "Selanjut…" : "Selanjutnya"} &gt;
          </button>

          <div className="main-action-fullwidth">{MainActionButton}</div>
        </div>
      </div>
    </div>
  );
}
