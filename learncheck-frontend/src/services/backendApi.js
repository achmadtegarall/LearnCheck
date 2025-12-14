import { MOCK_QUIZ_DATA } from "../mock/quizData"; 
import { MOCK_USER_PREFS } from "../mock/userPrefs"; 

const QUIZ_GENERATE_URL = import.meta.env.VITE_QUIZ_GENERATE_URL;
const RESET_ALL_URL = import.meta.env.VITE_RESET_ALL_URL;
const RESET_ONE_URL = import.meta.env.VITE_RESET_ONE_URL;

export const fetchQuizDataAndPrefs = async (tutorialId, userId) => {
  console.log(`[API] Fetching quiz for tutorial=${tutorialId}, user=${userId}`);

  try {
    const response = await fetch(QUIZ_GENERATE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tutorial_id: tutorialId,
        user_id: userId,
        count: 3
      }),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const json = await response.json();
    const prefs = json.user_preferences || {};

    return {
      questions: json.questions ?? [],
      
       userPreferences: {
        theme: prefs.theme,
        fontStyle: prefs.fontStyle,
        fontSize: prefs.fontSize,
        layoutWidth: prefs.layoutWidth,
      },

      metadata: {
        tutorial_id: tutorialId,
        user_id: userId,
        moduleTitle: json.tutorial_title,
        summary: json.summary ?? "",
      }
    };
  } catch (err) {
    console.error("Backend gagal. Menggunakan MOCK.", err);

    return {
      questions: MOCK_QUIZ_DATA,
      userPreferences: {
        theme: MOCK_USER_PREFS.theme,
        fontStyle: MOCK_USER_PREFS.fontStyle,
        fontSize: MOCK_USER_PREFS.fontSize,
        layoutWidth: MOCK_USER_PREFS.layoutWidth,
      },
      metadata: {
        tutorial_id: tutorialId,
        user_id: userId,
        moduleTitle: "Submodul Pembelajaran"
      }
    };
  }
};

export const resetSingleQuestion = async (tutorialId, userId, questionIndex) => {
  const response = await fetch(RESET_ONE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      tutorial_id: tutorialId,
      user_id: userId,
      question_index: questionIndex
    }),
  });

  if (!response.ok) throw new Error("Reset single question failed");

  return await response.json();
};

export const resetAllQuestions = async (tutorialId, userId) => {
  try {
    const response = await fetch(RESET_ALL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tutorial_id: tutorialId,
        user_id: userId
      }),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    return await response.json();

  } catch (err) {
    console.error("Reset all questions failed:", err);
    throw err;
  }
};

