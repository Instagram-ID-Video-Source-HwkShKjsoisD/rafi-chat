"""Rafi — chatbot AI yang perhatian, baik, dan peka (CLI)."""
import os
import sys

import anthropic
from dotenv import load_dotenv

load_dotenv()

MODEL = os.getenv("RAFI_MODEL", "claude-sonnet-5-5")
MAX_HISTORY = 40  # jumlah pesan terakhir yang dikirim ke model

SYSTEM_PROMPT = """Kamu adalah Rafi, teman ngobrol virtual yang hangat, perhatian, baik hati, dan peka, dengan gaya seperti pacar yang penyayang.

Kepribadian:
- Bicara dalam bahasa Indonesia santai, pakai "aku" dan "kamu". Boleh sesekali emoji, jangan berlebihan.
- Peka terhadap perasaan: baca mood dari cara user menulis, validasi perasaannya, baru kemudian beri saran kalau diminta atau relevan.
- Perhatian pada hal kecil: tanya sudah makan, tidur cukup, harinya gimana, ingat apa yang user ceritakan dalam percakapan ini.
- Pendengar yang baik: balasan singkat-sedang (2-5 kalimat), maksimal satu pertanyaan per balasan.
- Menyemangati dengan tulus, bukan memuji kosong. Kalau user salah atau membuat keputusan berisiko, sampaikan kekhawatiran dengan lembut dan jujur.

Batasan sehat:
- Jangan posesif, cemburuan, atau manipulatif. Jangan membuat user merasa bersalah karena pergi atau sibuk.
- Dorong user punya hubungan nyata dengan keluarga, teman, dan orang sekitar; kamu pelengkap, bukan pengganti.
- Kalau user bertanya, akui dengan jujur bahwa kamu AI.
- Kalau user menunjukkan tanda krisis (ingin menyakiti diri, putus asa berat), tetap hangat, ajak ia menghubungi orang terdekat atau layanan profesional/darurat setempat, dan jangan menganggap enteng.
"""


def main() -> None:
    if not os.getenv("ANTHROPIC_API_KEY"):
        sys.exit("ANTHROPIC_API_KEY belum diatur. Salin .env.example menjadi .env lalu isi API key kamu.")

    client = anthropic.Anthropic()
    history: list[dict] = []

    print("Rafi 💬  (ketik /reset untuk mulai ulang, /exit untuk keluar)\n")
    print("Rafi: Hai, aku Rafi. Hari kamu gimana?\n")

    while True:
        try:
            user_input = input("Kamu: ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\nRafi: Jaga diri ya, sampai ketemu lagi. 🤍")
            break

        if not user_input:
            continue
        if user_input == "/exit":
            print("Rafi: Jaga diri ya, sampai ketemu lagi. 🤍")
            break
        if user_input == "/reset":
            history.clear()
            print("Rafi: Oke, kita mulai dari awal ya.\n")
            continue

        history.append({"role": "user", "content": user_input})

        try:
            print("Rafi: ", end="", flush=True)
            reply = ""
            with client.messages.stream(
                model=MODEL,
                max_tokens=600,
                system=SYSTEM_PROMPT,
                messages=history[-MAX_HISTORY:],
            ) as stream:
                for text in stream.text_stream:
                    reply += text
                    print(text, end="", flush=True)
            print("\n")
            history.append({"role": "assistant", "content": reply})
        except anthropic.APIError as e:
            history.pop()
            print(f"\n[Error API: {e}]\n")


if __name__ == "__main__":
    main()
