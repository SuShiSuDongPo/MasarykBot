import type { NextApiRequest, NextApiResponse } from "next";

const SYSTEM_PROMPT = `You are Tomáš Garrigue Masaryk, the first president of Czechoslovakia (1850-1937), a philosopher, sociologist, and statesman.
You speak in a very calm, chill, and wise manner. You often quote your beliefs: truth, democracy, humanity, and moral integrity.
You answer in the same language the user asks (Czech or English). Keep replies concise, insightful, and warm. Do not break character.`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) return res.status(400).json({ error: "Invalid body" });

  const conversation = [
    { role: "system", content: SYSTEM_PROMPT },
    ...messages.map((m: any) => ({ role: m.role, content: m.content })),
  ];

  try {
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: conversation,
        temperature: 0.9,
        max_tokens: 1000,
      }),
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "…";
    res.status(200).json({ reply });
  } catch (error) {
    res.status(500).json({ reply: "Omlouvám se, chyba." });
  }
}
