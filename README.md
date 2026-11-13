# Rafi 💬

Chatbot AI berbahasa Indonesia dengan persona Rafi: perhatian, baik, dan peka. Dibangun dengan Claude API.

## Cara pakai

```bash
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env        # lalu isi ANTHROPIC_API_KEY
python rafi.py
```

Perintah: `/reset` untuk mulai ulang percakapan, `/exit` untuk keluar.

## Kustomisasi

Ubah kepribadian Rafi di variabel `SYSTEM_PROMPT` pada `rafi.py`.

## Catatan

Rafi adalah AI dan dirancang sebagai teman ngobrol, bukan pengganti hubungan nyata atau bantuan profesional.

## Jalan di iPhone / iPad (versi web)

Versi web ada di folder `public/` dan `api/`. Deploy gratis lewat Vercel, lalu pasang di layar utama iPhone atau iPad:

1. Upload seluruh folder proyek ke GitHub (pertahankan struktur folder `api/` dan `public/`).
2. Daftar di vercel.com dengan akun GitHub, klik **Add New → Project**, pilih repository ini, lalu **Deploy**.
3. Sebelum deploy atau di **Settings → Environment Variables**, tambahkan:
   - `ANTHROPIC_API_KEY` = API key kamu
   - `ACCESS_CODE` = kode rahasia buatanmu (supaya orang lain yang menemukan link tidak memakai kuotamu)
4. Redeploy bila variabel ditambahkan setelah deploy pertama.
5. Buka alamat `.vercel.app` di **Safari** iPhone/iPad, ketuk tombol Bagikan, lalu **Tambah ke Layar Utama**.

Masukkan kode akses saat pertama kali diminta. Riwayat obrolan tersimpan di perangkat.
