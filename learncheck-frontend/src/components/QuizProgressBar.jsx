import React from "react";

/**
 * QuizProgressBar — Displays the current question number
 * and a visual progress bar.
 */
export default function QuizProgressBar({
  currentQuestionIndex,
  totalQuestions,
}) {
  const progressPercent =
    totalQuestions > 0
      ? ((currentQuestionIndex + 1) / totalQuestions) * 100
      : 0;

  return (
    <div className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2 mt-2">
      <p className="font-mini font-medium text-[var(--text-secondary)] opacity-70 text-center sm:text-left">
        Soal {currentQuestionIndex + 1} dari {totalQuestions}
      </p>
      <div className="flex-1 sm:max-w-xs ml-0 sm:ml-auto bg-[var(--text-primary)]/10 rounded-full h-2">
        <div
          className="bg-[var(--blue-primary)] h-2 rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
          role="progressbar"
          aria-valuenow={currentQuestionIndex + 1}
          aria-valuemin={1}
          aria-valuemax={totalQuestions}
        />
      </div>
    </div>
  );
}
