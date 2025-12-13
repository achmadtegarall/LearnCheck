# LearnCheck! 
Sistem formative assessment yang membantu menilai pemahaman materi melalui umpan balik langsung, dan penilaian mandiri berbasis AI. Fitur ini mendukung proses belajar lebih efektif dengan memberikan evaluasi yang lebih adaptif dan mudah dipahami.

# Features LearnCheck!
- Kuis otomatis berbasis AI
- Umpan balik, hint & ringkasan materi
- Reset ulang
- Visualisasi skor akhir
- Penilaian Self-Reflection
- Penyimpanan preferensi & progres belajar

# Tech
LearnCheck dibangun menggunakan teknologi berikut:
- Backend: Node.js, Express, Redis, Gemini 2.5 Models
- Frontend: React, Vite, Tailwind CSS
- Bahasa Pemrograman: JavaScript

# Instalation
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

# API Endpoints
| Method | Endpoint                        | Deskripsi                                  |
|--------|--------------------------------|-------------------------------------------|
| GET    | /users/:userId/preferences     | Ambil preferensi & progres belajar user   |
| POST   | /assessment/generate           | Generate kuis AI baru                      |
| POST   | /assessment/reset              | Reset semua progres belajar user          |
| POST   | /assessment/reset-one          | Reset satu kuis        |
| POST   | /assessment/submit             | Submit jawaban kuis                        |

# How to Use
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


