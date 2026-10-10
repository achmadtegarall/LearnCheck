import { describe, it, expect } from "vitest";
import { checkSingleQuestion, calculateScore } from "../utils/quizLogic";

/**
 * Unit tests for quizLogic utility functions.
 * 
 * Tests cover:
 * - Single answer correctness checking
 * - Multiple correct answers
 * - Partial/wrong answer detection
 * - Empty answer handling
 * - Score calculation across multiple questions
 * - Edge cases (0%, 100%, mixed)
 */

// Mock question data factories
const createQuestion = (questionIndex, options) => ({
  question_index: questionIndex,
  question: `Question ${questionIndex}`,
  options: options.map((opt, i) => ({
    label: String.fromCharCode(65 + i), // A, B, C, D
    text: `Option ${String.fromCharCode(65 + i)}`,
    is_correct: opt,
  })),
});

describe("checkSingleQuestion", () => {
  it("should return true when single correct answer is selected", () => {
    const question = createQuestion(1, [true, false, false, false]);
    const selected = ["A"];
    
    expect(checkSingleQuestion(question, selected)).toBe(true);
  });

  it("should return false when wrong answer is selected", () => {
    const question = createQuestion(1, [true, false, false, false]);
    const selected = ["B"];
    
    expect(checkSingleQuestion(question, selected)).toBe(false);
  });

  it("should return true when all correct answers are selected (multiple correct)", () => {
    const question = createQuestion(1, [true, true, false, false]);
    const selected = ["A", "B"];
    
    expect(checkSingleQuestion(question, selected)).toBe(true);
  });

  it("should return false when only some correct answers are selected", () => {
    const question = createQuestion(1, [true, true, false, false]);
    const selected = ["A"]; // Missing "B"
    
    expect(checkSingleQuestion(question, selected)).toBe(false);
  });

  it("should return false when correct + extra wrong answers are selected", () => {
    const question = createQuestion(1, [true, false, false, false]);
    const selected = ["A", "C"]; // A is correct, C is wrong
    
    expect(checkSingleQuestion(question, selected)).toBe(false);
  });

  it("should return false when no answers are selected", () => {
    const question = createQuestion(1, [true, false, false, false]);
    const selected = [];
    
    expect(checkSingleQuestion(question, selected)).toBe(false);
  });

  it("should handle order-independent selection", () => {
    const question = createQuestion(1, [true, true, false, false]);
    const selected = ["B", "A"]; // Different order than options
    
    expect(checkSingleQuestion(question, selected)).toBe(true);
  });

  it("should return false when all wrong answers are selected", () => {
    const question = createQuestion(1, [true, false, false, false]);
    const selected = ["B", "C", "D"];
    
    expect(checkSingleQuestion(question, selected)).toBe(false);
  });
});

describe("calculateScore", () => {
  it("should calculate 100% when all answers are correct", () => {
    const quizState = {
      questions: [
        createQuestion(0, [true, false, false, false]),
        createQuestion(1, [false, true, false, false]),
        createQuestion(2, [false, false, true, false]),
      ],
      answers: {
        0: ["A"],
        1: ["B"],
        2: ["C"],
      },
    };

    const result = calculateScore(quizState);
    
    expect(result.correctCount).toBe(3);
    expect(result.totalQuestions).toBe(3);
    expect(result.score).toBe(100);
  });

  it("should calculate 0% when all answers are wrong", () => {
    const quizState = {
      questions: [
        createQuestion(0, [true, false, false, false]),
        createQuestion(1, [false, true, false, false]),
        createQuestion(2, [false, false, true, false]),
      ],
      answers: {
        0: ["B"],
        1: ["C"],
        2: ["D"],
      },
    };

    const result = calculateScore(quizState);
    
    expect(result.correctCount).toBe(0);
    expect(result.totalQuestions).toBe(3);
    expect(result.score).toBe(0);
  });

  it("should calculate partial score correctly", () => {
    const quizState = {
      questions: [
        createQuestion(0, [true, false, false, false]),
        createQuestion(1, [false, true, false, false]),
        createQuestion(2, [false, false, true, false]),
      ],
      answers: {
        0: ["A"],  // correct
        1: ["C"],  // wrong
        2: ["C"],  // correct
      },
    };

    const result = calculateScore(quizState);
    
    expect(result.correctCount).toBe(2);
    expect(result.totalQuestions).toBe(3);
    expect(result.score).toBe(67); // Math.round(66.67) = 67
  });

  it("should handle unanswered questions as wrong", () => {
    const quizState = {
      questions: [
        createQuestion(0, [true, false, false, false]),
        createQuestion(1, [false, true, false, false]),
        createQuestion(2, [false, false, true, false]),
      ],
      answers: {
        0: ["A"], // correct, others unanswered
      },
    };

    const result = calculateScore(quizState);
    
    expect(result.correctCount).toBe(1);
    expect(result.totalQuestions).toBe(3);
    expect(result.score).toBe(33); // Math.round(33.33) = 33
  });

  it("should handle questions with multiple correct answers", () => {
    const quizState = {
      questions: [
        createQuestion(0, [true, true, false, false]),  // A & B correct
        createQuestion(1, [false, false, true, true]),   // C & D correct
      ],
      answers: {
        0: ["A", "B"],  // all correct
        1: ["C"],       // missing D
      },
    };

    const result = calculateScore(quizState);
    
    expect(result.correctCount).toBe(1);
    expect(result.totalQuestions).toBe(2);
    expect(result.score).toBe(50);
  });
});
