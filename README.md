# 🇰🇷 한글마루 HangulMaru - Web Belajar Bahasa Korea Interaktif

Aplikasi web modern, interaktif, dan gamified untuk belajar bahasa Korea dari dasar hingga tingkat menengah (TOPIK II) yang diolah langsung dari kurikulum **Talk To Me In Korean (TTMIK)** dan materi persiapan **TOPIK II**.

---

## ✨ Fitur Utama

1. **🎓 Kurikulum Bertingkat TTMIK (Level 1 - 9)**
   - Jalur belajar terstruktur mulai dari Hangul pemula, salam, partikel kalimat, hingga konjugasi kompleks.
   - Dilengkapi rumus tata bahasa kunci, penjelasan ramah pemula berbahasa Indonesia, dan audio pelafalan asli.
   - Pemutar dialog interaktif baris-per-baris dengan suara penutur Korea (Web Speech API).
   - Daftar kosakata utama per pelajaran dengan audio.

2. **🃏 Flashcard 3D & Kosakata Harian (Spaced Repetition)**
   - **720 Everyday Words in 31 Days**: Dikelompokkan per hari dan tema (Alam, Manusia, Makanan, Transportasi, dll).
   - **Kosakata TOPIK Indonesia**: Dilengkapi contoh kalimat nyata dan terjemahan bahasa Indonesia.
   - **Bank Kosakata TOPIK II**: 500+ kosakata tingkat menengah.
   - Kartu 3D flip interaktif, tombol suara pengucapan, dan sistem penandaan tingkat hafalan (*Belum Hafal / Ragu / Sudah Hafal*).

3. **✍️ Kuis & Latihan Soal Interaktif**
   - Mode kuis: *Tebak Nuansa Kalimat (TOPIK II)*, *Tata Bahasa & Partikel*, serta *Kosakata Cepat*.
   - Evaluasi instan dengan pembahasan detail dalam bahasa Indonesia.
   - Animasi perayaan confetti saat menyelesaikan latihan.

4. **📚 Kamus Tata Bahasa (Grammar Bank 148+ Pola)**
   - 148 pola tata bahasa intermediate TOPIK II (`-(으)ㄴ 채(로)`, `-(으)ㄴ/는 김에`, dll).
   - Pencarian cepat berdasarkan huruf Hangul maupun arti.
   - Contoh kalimat dan audio suara untuk setiap pola tata bahasa.
   - Fitur bookmark / simpan tata bahasa favorit.

5. **🎮 Gamifikasi & Progres Belajar**
   - Penghitung Streak harian (🔥).
   - Poin Pengalaman (XP) dan sistem level.
   - Penyimpanan otomatis progres lokal (*localStorage*).
   - Mode Gelap (Dark Mode) & Terang (Light Mode) dengan estetika modern.

---

## 🛠️ Teknologi yang Digunakan

- **Frontend**: [React 19](https://react.dev/), [Vite](https://vitejs.dev/)
- **Desain & Styling**: Modern Vanilla CSS, Glassmorphism, Google Fonts (*Outfit*, *Noto Sans KR*, *Plus Jakarta Sans*)
- **Ikon**: [Lucide React](https://lucide.dev/)
- **Efek & Audio**: Canvas Confetti, Web Speech Synthesis API (`ko-KR`)
- **Data Extractor**: Python (PyMuPDF) untuk parsing bahan ajar PDF

---

## 🚀 Menjalankan Aplikasi Secara Lokal

1. **Clone repository ini:**
   ```bash
   git clone https://github.com/Mikhael20-tech/belajarbakor.git
   cd belajarbakor
   ```

2. **Install dependensi:**
   ```bash
   npm install
   ```

3. **Jalankan development server:**
   ```bash
   npm run dev
   ```
   Buka browser di `http://localhost:5173/`.

4. **Build untuk produksi:**
   ```bash
   npm run build
   ```

---

Dibuat dengan ❤️ untuk pembelajar bahasa Korea di Indonesia. 화이팅! (Semangat!)
