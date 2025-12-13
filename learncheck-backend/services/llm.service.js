const { GoogleGenAI } = require("@google/genai");
const Redis = require("ioredis");

const redis = new Redis(process.env.REDIS_URL);

const GEMINI_KEYS = [
  process.env.GEMINI_KEY_1,
  process.env.GEMINI_KEY_2,
  process.env.GEMINI_KEY_3,
  process.env.GEMINI_API_KEY,
].filter(Boolean);

let keyIndex = 0;

function getGeminiClient() {
  if (GEMINI_KEYS.length === 0) {
    throw new Error("No Gemini API keys provided!");
  }

  const key = GEMINI_KEYS[keyIndex];
  keyIndex = (keyIndex + 1) % GEMINI_KEYS.length; // round-robin

  return new GoogleGenAI({ apiKey: key });
}

const withTimeout = (promise, ms) =>
  Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("LLM TimeoutExceeded")), ms)
    ),
  ]);

const extractJSON = (raw) => {
  if (!raw) return null;
  const match = raw.match(/\{[\s\S]*\}/);
  return match ? match[0] : null;
};

const MODEL_CHAIN = ["gemini-2.5-flash-lite", "gemini-2.5-flash"];

async function generateQuiz(prompt) {
  const CACHE_KEY = `quiz:${Buffer.from(prompt).toString("base64")}`;
  const CACHE_TTL = 3600; // 1 jam

  const cached = await redis.get(CACHE_KEY);
  if (cached) return JSON.parse(cached);

  for (const modelName of MODEL_CHAIN) {
    let attempt = 0;
    while (attempt < 3) {
      try {
        attempt++;
        const ai = getGeminiClient();
          const response = await withTimeout(
            ai.models.generateContent({
              model: modelName,
              contents: prompt,
              config: { responseMimeType: "application/json", temperature: 0.5 },
            }),
            15000
          );

        const raw = response.text?.trim();
        const jsonClean = extractJSON(raw);
        if (!jsonClean) throw new Error("Invalid JSON from LLM");

        await redis.set(CACHE_KEY, jsonClean, "EX", CACHE_TTL);
        return JSON.parse(jsonClean);
      } catch (error) {
        const errMsg = error.message || "";
        const isRetry =
          errMsg.includes("503") ||
          errMsg.includes("UNAVAILABLE") ||
          errMsg.includes("429") ||
          errMsg.includes("TimeoutExceeded");
        if (isRetry) {
          const delay = 1000 * Math.pow(2, attempt - 1);
          await new Promise((r) => setTimeout(r, delay));
          continue;
        }
        console.error(`[LLM Service] Non-retryable error on model ${modelName}:`, errMsg);
        break;
      }
    }
  }

  throw new Error("All LLM models failed after retries");
}

module.exports = { generateQuiz, redis };
