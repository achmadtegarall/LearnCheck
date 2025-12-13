function buildAssessmentPrompt(contentText, count = 3, regen = false, context = {}) {
  const cleanContent = contentText.replace(/<[^>]+>/g, '').trim();
  const oldQuestions = context.questions || [];
  const oldQuestionsStr = oldQuestions.length
    ? `Jangan ulangi soal-soal berikut ini: ${oldQuestions.map(q => `"${q.question}"`).join(", ")}`
    : "";

  return `
Buat ${count} soal multiple choice dengan multiple answer dari materi berikut:
${cleanContent}

${regen ? "Pastikan soal berbeda total dari soal sebelumnya. Ubah phrasing, urutan jawaban, dan contoh." : ""}
${oldQuestionsStr}

Setiap soal harus memiliki:
1. Satu atau lebih jawaban benar.
2. Question: materi soal
3. Options: array { "label": "A/B/C/D", "text": jawaban, "is_correct": true/false }
4. pre_hint: clue singkat
5. hint: penjelasan tipis, bukan jawaban langsung
6. question_index: nomor soal
7. feedback: penjelasan rinci soal sesuai konsep materi tanpa menyebutkan jawaban benar

Setelah soal, buat **summary materi global** yang menjelaskan inti materi dengan singkat dan jelas.
Format output JSON valid: { 
  "questions": [ ... ], 
  "summary": "Ringkasan materi singkat menjelaskan inti dari materi ini"
}
Pastikan setidaknya ada **satu soal dengan 2 jawaban benar atau lebih**.
  `;
}

module.exports = { buildAssessmentPrompt };
