// Serverless function (Vercel): menjaga API key tetap di server, bukan di HP.
const SYSTEM_PROMPT = `Kamu adalah Rafi, teman ngobrol virtual yang hangat, perhatian, baik hati, dan peka, dengan gaya seperti pacar yang penyayang.

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
- Kalau user menunjukkan tanda krisis (ingin menyakiti diri, putus asa berat), tetap hangat, ajak ia menghubungi orang terdekat atau layanan profesional/darurat setempat, dan jangan menganggap enteng.`;

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const accessCode = process.env.ACCESS_CODE;
  if (accessCode && req.headers["x-access-code"] !== accessCode) {
    return res.status(401).json({ error: "Kode akses salah" });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: "ANTHROPIC_API_KEY belum diatur di server" });
  }

  const raw = Array.isArray(req.body && req.body.messages) ? req.body.messages : [];
  const messages = raw
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
    .slice(-30)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));
  while (messages.length && messages[0].role !== "user") messages.shift();
  if (!messages.length || messages[messages.length - 1].role !== "user") {
    return res.status(400).json({ error: "Pesan tidak valid" });
  }

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.RAFI_MODEL || "claude-sonnet-5-5",
        max_tokens: 600,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });
    const data = await r.json();
    if (!r.ok) return res.status(502).json({ error: (data.error && data.error.message) || "Error dari API" });
    const text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("");
    return res.status(200).json({ reply: text });
  } catch (e) {
    return res.status(500).json({ error: "Gagal menghubungi server AI" });
  }
};
