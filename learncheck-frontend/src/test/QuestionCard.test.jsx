import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import QuestionCard from "../components/QuestionCard";

/**
 * Component tests for QuestionCard.
 *
 * Tests cover:
 * - Rendering question text and options
 * - Option selection behavior
 * - Disabled state after submission
 * - Correct/wrong feedback display
 * - Hint visibility toggle
 * - AI hint display on wrong answers
 */

// Mock image imports
vi.mock("../images/correct-logo.png", () => ({ default: "correct-logo.png" }));
vi.mock("../images/wrong-logo.png", () => ({ default: "wrong-logo.png" }));
vi.mock("../images/hint-logo.png", () => ({ default: "hint-logo.png" }));

const mockQuestion = {
  question_index: 0,
  question: "Apa itu React.js?",
  feedback: "React.js adalah library JavaScript untuk membangun UI.",
  pre_hint: "Pikirkan tentang library frontend populer.",
  hint: "React dibuat oleh Facebook.",
  options: [
    { label: "A", text: "Library JavaScript untuk UI", is_correct: true },
    { label: "B", text: "Database NoSQL", is_correct: false },
    { label: "C", text: "Bahasa pemrograman", is_correct: false },
    { label: "D", text: "Framework CSS", is_correct: false },
  ],
};

describe("QuestionCard", () => {
  const defaultProps = {
    questionData: mockQuestion,
    questionIndex: 1,
    selectedAnswers: [],
    onSelect: vi.fn(),
    isDisabled: false,
    theme: "light",
    hintText: mockQuestion.pre_hint,
    aiHint: null,
    isHintVisible: false,
  };

  it("should render the question text", () => {
    render(<QuestionCard {...defaultProps} />);
    
    expect(screen.getByText(/Apa itu React.js\?/)).toBeInTheDocument();
  });

  it("should render all answer options", () => {
    render(<QuestionCard {...defaultProps} />);
    
    expect(screen.getByText("Library JavaScript untuk UI")).toBeInTheDocument();
    expect(screen.getByText("Database NoSQL")).toBeInTheDocument();
    expect(screen.getByText("Bahasa pemrograman")).toBeInTheDocument();
    expect(screen.getByText("Framework CSS")).toBeInTheDocument();
  });

  it("should call onSelect when an option is clicked", () => {
    const onSelect = vi.fn();
    render(<QuestionCard {...defaultProps} onSelect={onSelect} />);
    
    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[0]);
    
    expect(onSelect).toHaveBeenCalledWith(0, "A");
  });

  it("should show checkboxes as checked for selected answers", () => {
    render(
      <QuestionCard {...defaultProps} selectedAnswers={["A"]} />
    );
    
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
  });

  it("should disable checkboxes when isDisabled is true", () => {
    render(<QuestionCard {...defaultProps} isDisabled={true} />);
    
    const checkboxes = screen.getAllByRole("checkbox");
    checkboxes.forEach((checkbox) => {
      expect(checkbox).toBeDisabled();
    });
  });

  it("should show correct feedback when answer is right and submitted", () => {
    render(
      <QuestionCard
        {...defaultProps}
        selectedAnswers={["A"]}
        isDisabled={true}
      />
    );
    
    expect(screen.getByText("Benar! Kerja bagus!")).toBeInTheDocument();
    expect(
      screen.getByText("React.js adalah library JavaScript untuk membangun UI.")
    ).toBeInTheDocument();
  });

  it("should show wrong feedback when answer is incorrect and submitted", () => {
    render(
      <QuestionCard
        {...defaultProps}
        selectedAnswers={["B"]}
        isDisabled={true}
      />
    );
    
    expect(screen.getByText("Salah! Coba lagi!")).toBeInTheDocument();
  });

  it("should show AI hint when answer is wrong and aiHint is provided", () => {
    render(
      <QuestionCard
        {...defaultProps}
        selectedAnswers={["B"]}
        isDisabled={true}
        aiHint="React dibuat oleh Facebook."
      />
    );
    
    expect(screen.getByText("React dibuat oleh Facebook.")).toBeInTheDocument();
  });

  it("should show pre-hint when isHintVisible is true", () => {
    render(
      <QuestionCard
        {...defaultProps}
        isHintVisible={true}
      />
    );
    
    expect(
      screen.getByText("Pikirkan tentang library frontend populer.")
    ).toBeInTheDocument();
  });

  it("should not show pre-hint when isHintVisible is false", () => {
    render(
      <QuestionCard
        {...defaultProps}
        isHintVisible={false}
      />
    );
    
    expect(
      screen.queryByText("Pikirkan tentang library frontend populer.")
    ).not.toBeInTheDocument();
  });

  it("should not show feedback when question is not submitted", () => {
    render(<QuestionCard {...defaultProps} />);
    
    expect(screen.queryByText("Benar! Kerja bagus!")).not.toBeInTheDocument();
    expect(screen.queryByText("Salah! Coba lagi!")).not.toBeInTheDocument();
  });

  it("should render question number correctly", () => {
    render(<QuestionCard {...defaultProps} questionIndex={3} />);
    
    expect(screen.getByText(/3\. Apa itu React.js\?/)).toBeInTheDocument();
  });
});
