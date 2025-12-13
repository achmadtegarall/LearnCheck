const fs = require("fs");
const path = require("path");
const { generateQuiz, redis } = require("../services/llm.service");
const { buildAssessmentPrompt } = require("../utils/promptBuilder");
const axios = require("axios");

const extractFirstH2 = (html) => {
  const match = html.match(/<h2[^>]*>(.*?)<\/h2>/i);
  return match ? match[1].trim() : "Submodul Pembelajaran";
};

const fetchModuleTitle = async (tutorial_id) => {
  const url = `${process.env.MOCK_DICODING_API_BASE_URL}/tutorials/${tutorial_id}`;
  try {
    const res = await axios.get(url);
    const rawHTML = res.data?.data?.content || "";
    return extractFirstH2(rawHTML);
  } catch (err) {
    console.error(`[BE] Error fetch tutorial ${tutorial_id}:`, err.message);
    return "Submodul Pembelajaran";
  }
};

const generateAssessment = async (req, res) => {
  const { tutorial_id, user_id, count = 3 } = req.body;
  if (!tutorial_id || !user_id)
    return res.status(400).json({ status: "error", error: "tutorial_id & user_id wajib" });

  try {
    let contentText = "";
    const txtPath = path.join(__dirname, "../data/clean_texts", `${tutorial_id}.txt`);

    if (fs.existsSync(txtPath)) {
      contentText = fs.readFileSync(txtPath, "utf-8");
    } else {
      try {
        const resMock = await axios.get(`${process.env.MOCK_DICODING_API_BASE_URL}/tutorials/${tutorial_id}`);
        contentText = resMock.data?.data?.content || "Materi tidak tersedia";
      } catch (err) {
        console.error(`Gagal fetch mock materi tutorial ${tutorial_id}:`, err.message);
        contentText = "Materi tidak tersedia";
      }
    }
    
    const tutorial_title = await fetchModuleTitle(tutorial_id);

    let user_preferences = {};
    try {
      const prefRes = await axios.get(
        `${process.env.MOCK_DICODING_API_BASE_URL}/users/${user_id}/preferences`
      );
      user_preferences = prefRes.data?.data?.preference || {};
    } catch (err) {
      console.error("Gagal fetch user preferences:", err.message);
      user_preferences = {};
    }

    const cacheKey = `quiz:${tutorial_id}_${user_id}`;
    let cachedQuestions = [];
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      const parsed = JSON.parse(cachedData);
      cachedQuestions = parsed.questions || [];
    }

    const prompt = buildAssessmentPrompt(
      contentText,
      count,
      true,
      { questions: cachedQuestions, user_preferences }
    );

    const llmOutput = await generateQuiz(prompt, `${cacheKey}_${Date.now()}_${Math.random()}`);
    if (!llmOutput || !Array.isArray(llmOutput.questions)) {
      return res.status(500).json({ status: "error", error: "Output LLM tidak valid" });
    }

    await redis.set(cacheKey, JSON.stringify({
      ...llmOutput,
      user_preferences
    }));

    res.json({
      status: "success",
      tutorial_title,
      user_preferences,
      questions: llmOutput.questions,
      summary: llmOutput.summary || "",
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", error: "Gagal generate assessment" });
  }
};

const resetAssessment = async (req, res) => {
  const { tutorial_id, user_id } = req.body;

  if (!tutorial_id || !user_id)
    return res.status(400).json({
      status: "error",
      error: "tutorial_id & user_id wajib"
    });

  try {
    const cachePattern = `quiz:${tutorial_id}_${user_id}*`;
    const keys = await redis.keys(cachePattern);

    if (keys.length) await redis.del(keys);

    res.json({
      status: "success",
      message: "Assessment berhasil di-reset."
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      error: "Gagal reset assessment"
    });
  }
};

const resetOneQuestion = async (req, res) => {
  const { tutorial_id, user_id, question_index, userPreferences = {} } = req.body;

  if (!tutorial_id || !user_id || typeof question_index !== "number") {
    return res.status(400).json({
      status: "error",
      error: "tutorial_id, user_id & question_index wajib"
    });
  }

  try {
    const cacheKeyPattern = `quiz:${tutorial_id}_${user_id}*`;
    const keys = await redis.keys(cacheKeyPattern);

    if (!keys.length) {
      return res.status(404).json({
        status: "error",
        error: "Tidak ada soal tersimpan"
      });
    }

    const cacheKey = keys[0];
    const cached = JSON.parse(await redis.get(cacheKey));

    const oldQuestion = cached.questions.find(q => q.question_index === question_index);
    if (!oldQuestion) {
      return res.status(404).json({
        status: "error",
        error: "Question index tidak ditemukan"
      });
    }

    let contentText = "";
    const txtPath = path.join(__dirname, "../data/clean_texts", `${tutorial_id}.txt`);
    if (fs.existsSync(txtPath)) {
      contentText = fs.readFileSync(txtPath, "utf-8");
    } else {
      try {
        const resMock = await axios.get(`${process.env.MOCK_DICODING_API_BASE_URL}/tutorials/${tutorial_id}`);
        contentText = resMock.data?.data?.content || "Materi tidak tersedia";
      } catch (err) {
        console.error(`Gagal fetch mock materi tutorial ${tutorial_id}:`, err.message);
        contentText = "Materi tidak tersedia";
      }
    }

    const tutorial_title = await fetchModuleTitle(tutorial_id);

    const finalPreferences = {
      ...cached.userPreferences,
      ...userPreferences
    };

    const prompt = buildAssessmentPrompt(
      contentText,
      1,
      true,
      { questions: [oldQuestion], userPreferences: finalPreferences }
    );

    const newCacheKey = `quiz:${tutorial_id}_${user_id}_${question_index}_${Date.now()}`;
    const llmOutput = await generateQuiz(prompt, newCacheKey);

    if (!llmOutput || !Array.isArray(llmOutput.questions) || llmOutput.questions.length === 0) {
      return res.status(500).json({
        status: "error",
        error: "Output LLM tidak valid atau kosong"
      });
    }

    const newQuestion = {
      ...llmOutput.questions[0],
      question_index
    };

    cached.questions = cached.questions.map(q =>
      q.question_index === question_index ? newQuestion : q
    );
    cached.userPreferences = finalPreferences;

    await redis.set(cacheKey, JSON.stringify(cached));

    res.json({
      status: "success",
      message: "Satu soal berhasil di-reset & digenerate ulang.",
      tutorial_title,
      questions: [newQuestion],
      summary: llmOutput.summary || cached.summary || ""
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      error: "Gagal reset soal"
    });
  }
};

const submitAssessment = async (req, res) => {
  const { tutorial_id, user_id, answers } = req.body;

  if (!tutorial_id || !user_id || !answers)
    return res.status(400).json({
      status: "error",
      error: "tutorial_id, user_id & answers wajib"
    });

  try {
    const cacheKey = `submitted:${tutorial_id}_${user_id}`;

    await redis.set(cacheKey, JSON.stringify({
      answers,
      submitted_at: new Date().toISOString(),
    }));

    res.json({
      status: "success",
      message: "Jawaban berhasil disubmit"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      error: "Gagal submit assessment"
    });
  }
};

module.exports = {
  generateAssessment,
  resetAssessment,
  resetOneQuestion,
  submitAssessment,
};