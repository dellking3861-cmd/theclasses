import { NextResponse } from "next/server";
import { aiServices } from "@/services/ai";
import type { AIMessage } from "@/services/ai";

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json() as {
      message: string;
      history: AIMessage[];
    };

    const response = await aiServices.tutor.chat(message, history);
    return NextResponse.json(response);
  } catch {
    return NextResponse.json({
      role: "assistant",
      content: "AI Tutor is being configured. Please check back soon for personalized tutoring assistance.",
    });
  }
}
