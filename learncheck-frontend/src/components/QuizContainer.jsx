import React from "react";
import useQuizState from "../hooks/useQuizState";
import QuestionCard from "./QuestionCard";
import QuizResults from "./QuizResults";
import WelcomeScreen from "./WelcomeScreen";
import SelfReflectionPage from "./SelfReflectionPage";
import ReflectionResultPage from "./ReflectionResultPage";
import QuizHeader from "./QuizHeader";
import QuizProgressBar from "./QuizProgressBar";
import QuizFooter from "./QuizFooter";
import LoadingSpinner from "./LoadingSpinner";

/**
 * QuizContainer — Main orchestrator component for the quiz flow.
 *
 * Responsibilities (after refactor):
 * - Delegates state management to `useQuizState` custom hook
 * - Delegates UI sections to child components
 * - Handles screen routing (Welcome → Quiz → Reflection → Results)
 *
 * Previously 661 lines — now ~160 lines thanks to modular extraction.
 */
export default function QuizContainer() {
  const {
    // State
    quizState,
    userPrefs,
    isLoading,
    currentQuestionIndex,
    isHintVisible,
    showResults,
    isWelcomeScreen,
    showSelfReflection,
    showReflectionResult,
    selfRating,

    // Derived state
    totalQuestions,
    currentQuestion,
    isFirstQuestion,
    isLastQuestion,
    isCurrentQuestionSubmitted,
    isCurrentQuestionCorrect,
    isCurrentQuestionAnswered,
    isAllQuestionsChecked,

    // Handlers
    handleAnswerSelect,
    handleNext,
    handlePrev,
    handleShowHint,
    handleCheckAnswer,
    handleResetCurrentQuestion,
    handleReset,
    handleExitToFirstQuestion,
    handleStartQuiz,
    handleSkipReflection,
    handleSubmitReflection,
    handleViewReflectionHistory,
    handleViewFinalScore,
    handleOpenSelfReflection,
    setSelfRating,
  } = useQuizState();

  // Loading state
  if (isLoading || !quizState || !currentQuestion) {
    return <LoadingSpinner />;
  }

  // Self-reflection screen
  if (showSelfReflection) {
    return (
      <SelfReflectionPage
        rating={selfRating}
        setRating={setSelfRating}
        onSubmit={handleSubmitReflection}
        onSkip={handleSkipReflection}
        userPrefs={userPrefs}
      />
    );
  }

  // Reflection result screen
  if (showReflectionResult) {
    return (
      <ReflectionResultPage
        rating={quizState.selfRating}
        moduleTitle={quizState.moduleTitle}
        contextText={quizState.contextText}
        onViewFinalScore={handleViewFinalScore}
        onViewHistory={handleViewReflectionHistory}
        userPrefs={userPrefs}
      />
    );
  }

  // Final score screen
  if (showResults) {
    const finalScore = {
      correct: quizState.correctCount || 0,
      total: quizState.questions.length,
      score: quizState.score || 0,
    };

    return (
      <QuizResults
        score={finalScore}
        theme={userPrefs.theme}
        onReset={handleReset}
        onExitToFirstQuestion={handleExitToFirstQuestion}
      />
    );
  }

  // Welcome screen
  if (isWelcomeScreen && userPrefs) {
    return (
      <WelcomeScreen
        tutorialTitle={quizState.moduleTitle}
        onStartQuiz={handleStartQuiz}
        userPrefs={userPrefs}
      />
    );
  }

  // Main quiz screen
  return (
    <div
      className="
        min-h-screen w-full
        flex items-center justify-center
        bg-[var(--bg-primary)] text-[var(--text-primary)]
        font-[var(--font-primary)]
        transition-colors duration-300
      "
    >
      <div className="w-[var(--max-width-card)]">
        <div
          className="
            lc-card
            mx-auto
            overflow-hidden
            bg-[var(--bg-secondary)]
            border border-[var(--text-primary)]/20
            shadow-lg
            transition-all duration-300
          "
        >
          <QuizHeader
            userPrefs={userPrefs}
            moduleTitle={quizState.moduleTitle}
            isCurrentQuestionSubmitted={isCurrentQuestionSubmitted}
            isCurrentQuestionCorrect={isCurrentQuestionCorrect}
          />

          <div className="w-full h-px bg-gradient-to-r from-transparent via-[var(--text-primary)]/20 to-transparent"></div>

          <QuizProgressBar
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={totalQuestions}
          />

          <div className="w-full h-px bg-gradient-to-r from-transparent via-[var(--text-primary)]/20 to-transparent"></div>

          <div className="pb-5 px-4 sm:px-5 pt-4 sm:pt-3 border-b border-[var(--text-primary)]/20">
            <QuestionCard
              key={`${currentQuestion.question_index}_${currentQuestion._unique || 0}`}
              questionData={currentQuestion}
              questionIndex={currentQuestionIndex + 1}
              selectedAnswers={
                quizState.answers[currentQuestion.question_index] || []
              }
              onSelect={handleAnswerSelect}
              isDisabled={isCurrentQuestionSubmitted}
              theme={userPrefs.theme}
              hintText={currentQuestion.pre_hint}
              aiHint={
                quizState.aiHints?.[currentQuestion.question_index] || null
              }
              isHintVisible={isHintVisible}
            />
          </div>

          <QuizFooter
            userPrefs={userPrefs}
            isLoading={isLoading}
            currentQuestion={currentQuestion}
            isCurrentQuestionSubmitted={isCurrentQuestionSubmitted}
            isCurrentQuestionAnswered={isCurrentQuestionAnswered}
            isFirstQuestion={isFirstQuestion}
            isLastQuestion={isLastQuestion}
            isAllQuestionsChecked={isAllQuestionsChecked}
            onShowHint={handleShowHint}
            onCheckAnswer={handleCheckAnswer}
            onResetCurrentQuestion={handleResetCurrentQuestion}
            onPrev={handlePrev}
            onNext={handleNext}
            onOpenSelfReflection={handleOpenSelfReflection}
          />
        </div>
      </div>
    </div>
  );
}