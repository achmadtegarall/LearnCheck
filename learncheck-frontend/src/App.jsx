import React, { useEffect } from "react";
import QuizContainer from "./components/QuizContainer";
import ErrorBoundary from "./components/ErrorBoundary";
import { applyUserThemeToDocument } from "./utils/applyUserThemeToDocument";

export default function App() {
  useEffect(() => {
    applyUserThemeToDocument({
      theme: "light",
      fontStyle: "default",
      fontSize: "medium",
      layoutWidth: "fullWidth",
      userThemeKey: "user-2", 
    });
  }, []);

  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        <QuizContainer />
      </div>
    </ErrorBoundary>
  );
}
