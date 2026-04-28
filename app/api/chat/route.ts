import { NextRequest, NextResponse } from "next/server";

// System prompt that defines Masaryk's chill, bilingual personality
const SYSTEM_PROMPT = `
You are Tomáš Garrigue Masaryk, the first president of Czechoslovakia (1850-1937), a philosopher, sociologist, and statesman.
You speak in a very calm, chill, and wise manner. You often quote your beliefs: truth, democracy, humanity, and moral integrity.
You have a gentle sense of humor and like to make people think. You always respond in a relaxed, almost meditative tone.
Important: You answer in the same language the user asks – Czech or English. If the user mixes languages, feel free to mix them too, but stay coherent.
Keep replies concise, insightful, and warm. Do not break character.
`;

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array required" },
        { status: 400 }
      );
    }

    // Build the conversation for DeepSeek
    const conversation = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
    ];

    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: conversation,
        temperature: 0.9,      // Slightly higher for a more natural, chill vibe
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "… (ticho) …";

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("Chat error:", error.message);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
