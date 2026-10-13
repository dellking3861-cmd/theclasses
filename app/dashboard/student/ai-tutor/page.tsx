"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Brain, Send, Sparkles } from "lucide-react";
import type { AIMessage } from "@/services/ai";

export default function StudentAITutorPage() {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI tutor at The Classes. I can help you with Mathematics, Physics, Chemistry, Biology, Computer Science, and English. What would you like to learn today?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSend() {
    if (!input.trim()) return;

    const userMessage: AIMessage = { role: "user", content: input, timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, history: messages }),
      });
      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.content, timestamp: new Date().toISOString() }]);
    } catch {
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: "I'm currently being configured. Please check back soon for AI tutoring assistance!",
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <PageHeader title="AI Tutor" description="Get personalized help with any subject" />

      <Card className="h-[calc(100vh-280px)] flex flex-col">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-100">
          <div className="rounded-lg bg-indigo-50 p-2"><Brain className="h-5 w-5 text-indigo-600" /></div>
          <div>
            <p className="font-semibold text-slate-900">AI Tutor</p>
            <p className="text-xs text-slate-500 flex items-center gap-1"><Sparkles className="h-3 w-3" /> Powered by AI</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                msg.role === "user"
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-800"
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-100 rounded-2xl px-4 py-3 text-sm text-slate-500">Thinking...</div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-100">
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
            <Input
              placeholder="Ask me anything about your subjects..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
