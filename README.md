# LearnCheck! Formative Assessment Powered with AI 🤖✨

![LearnCheck](https://github.com/Learncheck-A25-CS155/LEARNCHECK-A25-CS155/blob/5efac83c8c4b6a0abd3329c05ce19197d3e9ceb9/learncheck-image.png)

**Capstone Project Team A25-CS155 | Asah Led by Dicoding**

LearnCheck! adalah sistem evaluasi formatif adaptif yang terintegrasi (iFrame) ke dalam platform pembelajaran (LMS Dicoding). Melalui soal otomatis, umpan balik instan, hint adaptif, ringkasan materi dan penilaian self-reflection, LearnCheck membantu peserta mengukur pemahaman konsep secara lebih mendalam.


# 🔍 Features LearnCheck!

### **1. Kuis Otomatis Berbasis AI**
Menghasilkan tiga soal multiple-choice secara otomatis berdasarkan konteks materi pembelajaran.

### **2. Umpan Balik, Hint Adaptif & Ringkasan Materi**
Memberikan feedback benar/salah, penjelasan, hint dari AI, serta ringkasan materi untuk memperkuat pemahaman.

### **3. Reset Soal (Satu atau Semua)**
Memungkinkan pengguna mencoba ulang satu soal atau mereset seluruh set pertanyaan agar mendapatkan variasi baru.

### **4. Penyimpanan Preferensi & Progres**
Semua progres kuis dan preferensi pengguna tersimpan di LocalStorage — termasuk jawaban, hint, status, layout, dan tema.

### **5. Self-Reflection Rating**
Membantu siswa menilai tingkat pemahaman diri melalui skala emotikon interaktif.

### **6. Visualisasi Skor Akhir**
Menampilkan hasil akhir dalam bentuk lingkaran progres (score ring) yang jelas dan informatif.

---

# 🛠️ Tech
LearnCheck dibangun menggunakan teknologi berikut:
- Backend: Node.js, Express, Redis, Gemini 2.5 Models
- Frontend: React, Vite, Tailwind CSS
- Bahasa Pemrograman: JavaScript

---

# 💻 Instalation
Ikuti langkah berikut untuk menjalankan LearnCheck secara lokal:
```
# Clone repository
git clone https://github.com/username/learncheck.git

# Masuk ke folder proyek
cd learncheck

# Install dependencies frontend
cd frontend
npm install
npm run dev

# Install dependencies backend
cd ../backend
npm install
npm start
```

Buka browser dan akses:
```
http://localhost:5173/?tutorial={tutorial_id}&user={user_id}
```
(Port bisa berbeda tergantung konfigurasi Vite. ``tutorial_id`` dan ``user_id`` bisa disesuaikan dengan mock yang ingin diakses)

---

# 📍 API Endpoints
| Method | Endpoint                        | Deskripsi                                  |
|--------|--------------------------------|-------------------------------------------|
| GET    | /users/:userId/preferences     | Ambil preferensi & progres belajar user   |
| POST   | /assessment/generate           | Generate kuis AI baru                      |
| POST   | /assessment/reset              | Reset semua progres belajar user          |
| POST   | /assessment/reset-one          | Reset satu kuis        |
| POST   | /assessment/submit             | Submit jawaban kuis                        |

---

# 📲 How to Use
1. Jalankan frontend dan backend di komputer lokal.
2. Buka browser dan akses:
    ```
    http://localhost:5173/?tutorial={tutorial_id}&user={user_id}
    ```
    Ganti ``{tutorial_id}`` dan ``{user_id}`` sesuai yang diinginkan.
3. Halaman quiz LearnCheck akan muncul. Klik `Mulai` untuk memulai kuis.
4. Kerjakan kuis: 
    - Jika membutuhkan bantuan, klik `Hint` untuk mendapatkan petunjuk.
    - Jika ingin mengulangi satu soal, klik `Ulangi` pada soal tersebut.
5. Setelah semua soal selesai, klik `Lihat Hasil` untuk menuju halaman Self-Reflection.
6. Pilih opsi sesuai dengan keadaan yang dirasakan lalu klik `Beri Rating` untuk menilai pengalaman belajar.
7. Lalu akan muncul halaman visualisasi skor akhir dan rangkuman materi. Pengguna bisa memilih untuk mengulangi kuis atau melihat soal yang sudah dikerjakan.

---

## 👥 Our Team
**ID Team: A25-CS155**
| ID | Nama | Role | 
| :--- | :--- | :--- | 
| R891D5X1646 | Ramdhini Novita Sari | React & Back-End with AI | 
| R891D5X1501 | Ni Nyoman Bella Nindya A. | React & Back-End with AI | 
| R891D5Y1624 | Rahmat Angga Saputra | React & Back-End with AI | 
| R340D5X1008 | Lulu Aprilia Wijayanti | React & Back-End with AI | 
| R254D5Y0029 | Achmad Tegar Almannudin | React & Back-End with AI |

---

## 📄 License

Project ini dikembangkan sebagai bagian dari program **Asah Led by Dicoding**.

---
*Dibuat oleh Tim A25-CS155*




