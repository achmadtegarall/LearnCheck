import { useState, useEffect, useCallback } from "react";
import useLocalStorage from "./useLocalStorage";
import { useUrlParams } from "./useUrlParams";
import { checkSingleQuestion, calculateScore } from "../utils/quizLogic";
import {
  fetchQuizDataAndPrefs,
  resetSingleQuestion,
  resetAllQuestions,
} from "../services/backendApi";
import { applyUserThemeToDocument } from "../utils/applyUserThemeToDocument";

/**
 * Custom hook that encapsulates all quiz state management logic.
 * Extracted from QuizContainer to improve modularity and testability.
 *
 * Handles:
 * - Quiz data fetching & caching (localStorage)
 * - Answer selection & submission
 * - Question navigation
 * - Hint visibility
 * - Single/all question reset
 * - Score calculation
 * - Self-reflection flow
 * - User preferences & theming
 */
export default function useQuizState() {
  const { userId, tutorialId } = useUrlParams() || {};
  const storageKey = `LEARNCHECK_STATE_${userId}_${tutorialId}`;

  const [quizState, setQuizState] = useLocalStorage(storageKey, null);

  const [userPrefs, setUserPrefs] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isHintVisible, setIsHintVisible] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isWelcomeScreen, setIsWelcomeScreen] = useState(true);

  const [showSelfReflection, setShowSelfReflection] = useState(false);
  const [showReflectionResult, setShowReflectionResult] = useState(false);
  const [selfRating, setSelfRating] = useState(null);

  // Derived state
  const totalQuestions = quizState?.questions?.length || 0;
  const currentQuestion = quizState?.questions?.[currentQuestionIndex];
  const currentQuestionId = currentQuestion?.question_index;

  const isCompleted = quizState?.isCompleted || false;
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  const isCurrentQuestionSubmitted =
    quizState?.checkedStatus?.[currentQuestionId]?.submitted || false;
  const isCurrentQuestionCorrect =
    quizState?.checkedStatus?.[currentQuestionId]?.isCorrect || false;
  const isCurrentQuestionAnswered =
    (quizState?.answers?.[currentQuestionId]?.length || 0) > 0;

  const isAllQuestionsChecked =
    totalQuestions > 0 &&
    Object.keys(quizState?.checkedStatus || {}).length === totalQuestions;

  // Higher-order function for loading states
  const withLoading =
    (handler, delay = 500) =>
    async (...args) => {
      if (isLoading) return;
      setIsLoading(true);
      try {
        await handler(...args);
      } catch (err) {
        console.error("Error during loading process:", err);
      } finally {
        await new Promise((r) => setTimeout(r, delay));
        setIsLoading(false);
      }
    };

  // Data fetching
  const loadQuizData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchQuizDataAndPrefs(tutorialId, userId);

      setQuizState({
        questions: data.questions,
        userId,
        tutorialId,
        moduleTitle: data.metadata?.moduleTitle || "Submodul Pembelajaran",
        contextText: data.metadata?.summary || "",
        answers: {},
        checkedStatus: {},
        aiHints: {},
        isCompleted: false,
        score: 0,
        userPreferences: data.userPreferences,
      });

      setUserPrefs(data.userPreferences || {});
    } catch (err) {
      console.error("Gagal memuat data kuis:", err);
    } finally {
      setIsLoading(false);
    }
  }, [tutorialId, userId, setQuizState]);

  // Effects
  useEffect(() => {
    setIsWelcomeScreen(true);
    setCurrentQuestionIndex(0);
    setShowResults(false);
    setIsHintVisible(false);
  }, [userId]);

  useEffect(() => {
    const isStateValid =
      quizState && quizState.questions && quizState.questions.length > 0;

    if (!isStateValid) {
      loadQuizData();
    } else {
      setUserPrefs(quizState.userPreferences || {});
      setIsLoading(false);
    }
  }, [userId, tutorialId, quizState, loadQuizData]);

  useEffect(() => {
    if (userPrefs?.theme) {
      applyUserThemeToDocument(userPrefs);
    }
  }, [userPrefs]);

  useEffect(() => {
    if (quizState?.selfRating !== undefined) {
      setSelfRating(quizState.selfRating);
    }
  }, [quizState]);

  // Handlers
  const handleAnswerSelect = useCallback(
    (questionId, optionLabel) => {
      if (isCurrentQuestionSubmitted || isLoading || !quizState) return;

      const currentAnswers = quizState.answers[questionId] || [];
      const isSelected = currentAnswers.includes(optionLabel);

      const newAnswers = isSelected
        ? currentAnswers.filter((lbl) => lbl !== optionLabel)
        : [...currentAnswers, optionLabel];

      setQuizState({
        ...quizState,
        answers: {
          ...quizState.answers,
          [questionId]: newAnswers,
        },
      });
    },
    [isCurrentQuestionSubmitted, isLoading, quizState, setQuizState]
  );

  const handleNext = withLoading(() => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setIsHintVisible(false);
    }
  }, 300);

  const handlePrev = withLoading(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setIsHintVisible(false);
    }
  }, 300);

  const handleShowHint = useCallback(() => {
    setIsHintVisible((prev) => !prev);
  }, []);

  const handleCheckAnswer = async () => {
    if (isCurrentQuestionSubmitted || isLoading || !currentQuestion) return;

    setIsLoading(true);

    const qid = currentQuestion.question_index;
    const answers = quizState.answers[qid] || [];
    const isCorrect = checkSingleQuestion(currentQuestion, answers);
    const initialHint = currentQuestion.hint || null;

    setQuizState((prev) => ({
      ...prev,
      checkedStatus: {
        ...prev.checkedStatus,
        [qid]: {
          submitted: true,
          isCorrect,
          attemptCount: (prev.checkedStatus?.[qid]?.attemptCount || 0) + 1,
        },
      },
      aiHints: {
        ...prev.aiHints,
        [qid]: initialHint,
      },
    }));

    setIsHintVisible(false);

    await new Promise((r) => setTimeout(r, 300));
    setIsLoading(false);
  };

  const handleViewScore = withLoading(() => {
    if (!isCompleted) {
      const results = calculateScore(quizState);
      setQuizState({
        ...quizState,
        isCompleted: true,
        score: results.score,
        correctCount: results.correctCount,
      });
    }
    setShowResults(true);
  }, 1000);

  const handleResetCurrentQuestion = withLoading(async () => {
    const qIndex = currentQuestionIndex;

    try {
      const newQuestionData = await resetSingleQuestion(
        tutorialId,
        userId,
        currentQuestionId
      );

      const updatedQuestions = [...quizState.questions];
      updatedQuestions[qIndex] = {
        ...newQuestionData.questions[0],
        question_index: quizState.questions[qIndex].question_index,
        _unique: Date.now(),
      };

      const newAnswers = { ...quizState.answers };
      const newCheckedStatus = { ...quizState.checkedStatus };

      delete newAnswers[currentQuestionId];
      delete newCheckedStatus[currentQuestionId];

      setQuizState({
        ...quizState,
        questions: updatedQuestions,
        answers: newAnswers,
        checkedStatus: newCheckedStatus,
      });
    } catch (err) {
      console.error("Failed regenerate question:", err);

      const newAnswers = { ...quizState.answers };
      const newCheckedStatus = { ...quizState.checkedStatus };

      delete newAnswers[currentQuestionId];
      delete newCheckedStatus[currentQuestionId];

      setQuizState({
        ...quizState,
        answers: newAnswers,
        checkedStatus: newCheckedStatus,
      });
    }

    setIsHintVisible(false);
  }, 700);

  const handleReset = withLoading(async () => {
    const currentTheme = userPrefs.theme;

    try {
      await resetAllQuestions(tutorialId, userId);
      await loadQuizData();
    } catch (err) {
      console.error("Reset gagal:", err);
    }

    setCurrentQuestionIndex(0);
    setIsHintVisible(false);
    setShowResults(false);
    setIsWelcomeScreen(true);
    setUserPrefs({ theme: currentTheme });
  }, 1000);

  const handleExitToFirstQuestion = useCallback(() => {
    setCurrentQuestionIndex(0);
    setShowResults(false);
    setIsHintVisible(false);
  }, []);

  const handleStartQuiz = withLoading(async () => {
    if (!quizState || !quizState.questions || quizState.questions.length === 0) {
      await loadQuizData();
    }
    setIsWelcomeScreen(false);
  }, 800);

  const handleSkipReflection = async () => {
    setQuizState((prev) => ({
      ...prev,
      selfRating: null,
    }));

    setShowSelfReflection(false);
    setShowReflectionResult(false);
    await handleViewScore();
  };

  const handleSubmitReflection = useCallback(() => {
    setQuizState((prev) => ({
      ...prev,
      selfRating: selfRating,
    }));

    setShowSelfReflection(false);
    setShowReflectionResult(true);
  }, [selfRating, setQuizState]);

  const handleViewReflectionHistory = useCallback(() => {
    setShowReflectionResult(false);
    setShowSelfReflection(false);
    setShowResults(false);
    setCurrentQuestionIndex(0);
    setIsHintVisible(false);
  }, []);

  const handleViewFinalScore = useCallback(() => {
    setShowReflectionResult(false);
    handleViewScore();
  }, []);

  const handleOpenSelfReflection = useCallback(() => {
    setShowSelfReflection(true);
  }, []);

  return {
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
    currentQuestionId,
    isCompleted,
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
    handleViewScore,
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
  };
}
