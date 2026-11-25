# Naskah Video Demo — Buku Tamu Quantum

Durasi target: **±2:40** (batas fest: 3 menit). Rekam layar + suara sendiri — Muse tidak bisa membuat video.
Bahasa: Indonesia. Rekam di 1080p, zoom browser 100%, matikan notifikasi.

## Adegan 1 — Pembuka (0:00–0:15)
**Tampilkan:** halaman web Buku Tamu Quantum (localhost:5174 atau versi deploy).
**Katakan:**
> "Halo, ini Buku Tamu Quantum — buku tamu post-quantum di atas QoreChain, dibuat untuk Build Before Q-Day."

## Adegan 2 — Masalahnya (0:15–0:45)
**Tampilkan:** tetap di halaman utama, arahkan kursor ke bagian 'Cara kerjanya'.
**Katakan:**
> "Kunci dompet biasa, secp256k1, suatu hari bisa dipecahkan komputer kuantum. QoreChain menyelesaikannya dengan tanda tangan hybrid: setiap transaksi ditandatangani dua kunci sekaligus — secp256k1 dan ML-DSA-87 — dan hanya bisa dikirim saat window otorisasi EVM sedang terbuka. Kunci yang dicuri saja tidak cukup."

## Adegan 3 — Demo web (0:45–1:20)
**Tampilkan:** klik Connect Wallet → hubungkan QoreX (testnet, akun sudah terisi QOR) → status window terlihat "aktif" → ketik pesan → klik "Tanda tangani" → setujui di QoreX → tunggu tx sukses → entri muncul di daftar.
**Katakan:**
> "Dari web, pengunjung cukup hubungkan QoreX, lalu tanda tangani. QoreX mendaftarkan kunci ML-DSA-87 dan membuka window-nya sendiri di dalam persetujuan. Pesan langsung tercatat di chain."

## Adegan 4 — Bukti di chain (1:20–1:50)
**Tampilkan:** buka explorer (explore.qore.network, tab Testnet) → alamat kontrak `0x1D71b23650B30558F9C6aDAf916382b243ECFb55` → tunjukkan transaksi tanda tangan pertama (blok 10718571) dan daftar entri.
**Katakan:**
> "Ini buktinya di explorer: kontrak sudah ter-deploy, dan tanda tangan pertama tercatat di blok 10718571. Semuanya transaksi asli di testnet, bukan mock."

## Adegan 5 — Fitur (1:50–2:20)
**Tampilkan:** klik statistik, ketik di kolom pencarian, ganti urutan Terbaru/Terlama, klik "Salin alamat".
**Katakan:**
> "Web-nya berbahasa Indonesia, dengan statistik tanda tangan, pencarian pesan, urutan terbaru atau terlama, dan penjelasan cara kerja hybrid signing. Bukan salinan contoh tutorial — desain dan fiturnya dibuat sendiri."

## Adegan 6 — Penutup (2:20–2:40)
**Tampilkan:** kembali ke halaman utama, lalu tampilkan README repo (atau layar akhir dengan tautan).
**Katakan:**
> "Buku Tamu Quantum — repositori dan alamat kontrak ada di deskripsi. Terima kasih, dan sampai jumpa di Q-Day."

## Checklist sebelum rekam
- [ ] QoreX di testnet, saldo QOR cukup (window + 1 tanda tangan).
- [ ] Halaman web sudah menampilkan entri yang ada.
- [ ] Tab explorer sudah dibuka di alamat kontrak.
- [ ] Matikan notifikasi HP/komputer; tutup tab yang tidak perlu.
- [ ] Rekam satu take; kalau salah ucap di tengah, ulangi kalimatnya saja lalu potong saat edit.
