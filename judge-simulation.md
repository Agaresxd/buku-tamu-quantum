# Simulasi Juri — Buku Tamu Quantum

Simulasi awal (sebelum video direkam) memakai skill `hackathon-judge-simulator`.
Tujuan: mengeraskan pitch dan demo sebelum submit. Diulang setelah video jadi.

## Fakta proyek yang dinilai

- **Judul:** Buku Tamu Quantum — buku tamu post-quantum di QoreChain testnet (diana, EVM 9800).
- **Masalah:** kunci secp256k1 terancam komputer kuantum (Q-Day); kunci yang dicuri bisa menghabiskan akun.
- **Solusi:** tanda tangan hybrid (secp256k1 + ML-DSA-87) + window otorisasi EVM; satu tanda tangan per alamat.
- **Bukti nyata:** kontrak ter-deploy `0x1D71b23650B30558F9C6aDAf916382b243ECFb55`, tanda tangan pertama di blok 10718571.
- **Yang dibangun:** kontrak (tes 3/3), web Bahasa Indonesia (statistik, cari, urut, salin alamat, badge ML-DSA-87, penjelasan cara kerja), README, gambar utama, naskah video.
- **Stack:** Solidity + Hardhat, React + Vite + wagmi + RainbowKit + QoreX, QoreChain testnet.

## Juri yang disimulasikan

- **Juri teknis (post-quantum / QoreChain):** prioritas — implementasi benar-benar jalan, pemahaman hybrid signing, bukan sekadar contoh.
- **Juri produk/UX:** prioritas — apakah orang awam paham dan bisa pakai, apakah ada pengguna nyata.
- **Juri umum hackathon:** prioritas — orisinalitas, kelengkapan, kualitas presentasi.

## Pertanyaan yang mungkin muncul

### Inovasi
- **Juri teknis:** "Apa bedanya dengan contoh Q-Day Guestbook resmi? Apa yang benar-benar baru di sini?"
  **Jawaban yang disarankan:** "Kontraknya memakai contoh resmi sebagai fondasi — itu disengaja, karena kontraknya harus benar. Yang baru: seluruh web ditulis ulang (UI Indonesia, statistik, pencarian, pengurutan, penjelasan hybrid signing), plus deployment dan tanda tangan pertama yang nyata di testnet. Contoh tidak punya semua itu."
  **Sulit:** hard.
- **Juri umum:** "Kenapa buku tamu? Apa masalah nyata yang diselesaikan, bukan sekadar demo teknologi?"
  **Jawaban yang disarankan:** "Buku tamu adalah cara paling jujur menunjukkan hybrid signing: satu aksi sederhana yang mustahil tanpa kunci post-quantum dan window. Ini bukti konsep yang bisa dipakai siapa pun — pola yang sama bisa dipakai untuk voting, absensi, atau persetujuan dokumen."
  **Sulit:** medium.

### Eksekusi Teknis
- **Juri teknis:** "Tunjukkan transaksi hybrid-nya. Bagaimana kami tahu ini bukan sekadar klaim?"
  **Jawaban yang disarankan:** "Di explorer: registrasi kunci `DEB22C91...`, pembukaan window `CF50E8A1...`, deploy kontrak, dan tanda tangan pertama di blok 10718571 — semuanya tautannya ada di README."
  **Sulit:** easy.
- **Juri teknis:** "Apa yang terjadi kalau window habis di tengah demo? Bagaimana web menangani penolakan?"
  **Jawaban yang disarankan:** "Web mengklasifikasikan penolakan (tidak ada kunci, tidak ada window, window habis, parameter ditolak) dan menampilkan solusinya dalam Bahasa Indonesia. Kalau window habis, QoreX membuka window baru dari dalam persetujuan."
  **Sulit:** medium.
- **Juri teknis:** "Kenapa hanya 1 tanda tangan di chain? Apakah ada yang benar-benar memakai ini?"
  **Jawaban yang disarankan:** "Satu tanda tangan pertama adalah bukti end-to-end. Tanda tangan kedua dan seterusnya datang dari pengunjung lewat QoreX — video demo menunjukkan satu tanda tangan live dari dompet yang berbeda, jadi bukan hanya satu akun."
  **Sulit:** hard.

### Kelengkapan & UX
- **Juri produk:** "Orang awam tidak tahu apa itu ML-DSA-87. Apakah mereka paham halaman ini?"
  **Jawaban yang disarankan:** "Ada bagian 'Cara kerjanya' tiga langkah dalam Bahasa Indonesia, dan badge ML-DSA-87 di tiap entri. Pengunjung tidak perlu paham kriptografinya — cukup hubungkan QoreX dan tanda tangani."
  **Sulit:** medium.
- **Juri produk:** "Apakah web ini bisa dibuka publik, atau hanya jalan di laptopmu?"
  **Jawaban yang disarankan:** "Saat ini jalan lokal dengan `pnpm dev`; repo berisi instruksi lengkap. Kekurangannya jujur: belum ada hosting publik karena status window butuh proxy `/lcd` (endpoint REST tidak mengirim header CORS). Rencana: build statis + degradasi yang rapi untuk status window."
  **Sulit:** hard.

### Presentasi & Kejelasan
- **Juri umum:** "Dalam satu kalimat, kenapa proyek ini layak menang?"
  **Jawaban yang disarankan:** "Satu-satunya buku tamu berbahasa Indonesia yang membuktikan tanda tangan post-quantum di chain — bukan slide, tapi transaksi nyata yang bisa dicek siapa pun."
  **Sulit:** easy.
- **Juri umum:** "Video demonya menunjukkan apa yang tidak bisa dibaca di README?"
  **Jawaban yang disarankan:** "Video menunjukkan alur lengkap dari mata pengunjung: hubungkan QoreX, tanda tangani, entri muncul, lalu bukti yang sama dibuka di explorer. README membuktikan; video membuat orang percaya."
  **Sulit:** medium.

## Keberatan yang mungkin muncul

- **"Ini cuma contoh tutorial yang diganti bahasa."**
  Kemungkinan: high.
  Strategi: jangan membantah fondasinya — akui kontraknya dari contoh resmi, lalu tunjukkan daftar perbedaannya (UI, fitur, deployment nyata). Di video, sempatkan 10 detik menunjukkan fitur pencarian/statistik yang tidak ada di contoh.
- **"Tidak ada pengguna nyata / hanya 1 tanda tangan."**
  Kemungkinan: high.
  Strategi: sebelum submit, minta 2–3 orang (atau akun kedua sendiri) menandatangani lewat QoreX supaya daftar entrinya hidup. Tunjukkan di video.
- **"Tidak ada demo publik yang bisa dibuka juri."**
  Kemungkinan: medium.
  Strategi: siapkan build statis yang bisa dibuka, atau pastikan video demo cukup jelas sehingga juri tidak perlu menjalankan sendiri. Instruksi `pnpm dev` di README harus bekerja dari clone bersih — sudah diverifikasi.
- **"Kenapa Intermediate, bukan Advanced? Terlalu sederhana?"**
  Kemungkinan: low.
  Strategi: Intermediate adalah track yang tepat untuk dApp lengkap berbasis SDK + QoreX; contoh resmi Guestbook memang contoh Intermediate. Nilai ada di eksekusi dan presentasi, bukan di kerumitan yang dipaksakan.

## Prediksi skor (skala 1–5)

- **Inovasi: 3** — Penggunaan hybrid signing nyata dan tepat guna, tapi ide buku tamu sendiri sederhana dan fondasinya contoh resmi.
- **Eksekusi Teknis: 4** — Kontrak ter-deploy, tanda tangan pertama di chain, tes 3/3, typecheck + build lolos; dikurangi karena belum ada hosting publik.
- **Kelengkapan & UX: 4** — UI Indonesia lengkap dengan statistik, pencarian, dan penjelasan; dikurangi karena daftar entri masih sepi (1 tanda tangan).
- **Presentasi & Kejelasan: 4** — README lengkap dengan tautan bukti, gambar utama dan naskah video siap; video belum direkam.

## Vonis keseluruhan

- **Kesan:** Proyek yang jujur dan terbukti — semua klaim bisa dicek di explorer. Risiko terbesar bukan teknis, melainkan kesan "contoh tutorial" dan daftar entri yang sepi.
- **Peluang peringkat:** mid-field ke top-3 — tergantung video demo dan apakah ada beberapa tanda tangan tambahan sebelum submit.
- **Kekuatan utama:** bukti on-chain nyata; UI Indonesia yang rapi; README yang bisa diverifikasi.
- **Kelemahan utama:** diferensiasi dari contoh resmi harus dijelaskan eksplisit; belum ada pengguna lain; belum ada demo publik.

## Perbaikan yang disarankan

- **(high)** Sebelum submit, kumpulkan 2–3 tanda tangan tambahan dari alamat berbeda (QoreX / akun lain) supaya daftar entri hidup dan statistik uniknya bukan 1.
- **(high)** Di video, luangkan 10 detik untuk menunjukkan fitur yang tidak ada di contoh (pencarian + statistik) dan sebutkan eksplisit perbedaannya.
- **(medium)** Siapkan jawaban satu kalimat untuk "apa bedanya dengan contoh resmi" — latih sampai lancar, karena pertanyaan ini hampir pasti muncul.
- **(medium)** Pertimbangkan build statis yang bisa dibuka juri (dengan catatan status window mungkin tidak tampil tanpa proxy) — atau pastikan video cukup meyakinkan tanpa itu.
- **(low)** Tambahkan tangkapan layar web ke README supaya juri langsung melihat tampilannya tanpa menjalankan.
