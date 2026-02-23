"use client";

import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";

type ChatRole = "user" | "assistant";

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
};

type ChatApiResponse = {
  message?: string;
  error?: string;
};

const CHATBOT_STORAGE_KEY = "studio.chatbot.messages.v1";
const MAX_PERSISTED_MESSAGES = 30;

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "assistant-welcome",
    role: "assistant",
    content:
      "I’m your AI Image Guide. Ask me for prompt ideas, style directions, refinements, or variations for your next generation.",
  },
];

const STARTER_PROMPTS = [
  "Give me 5 cinematic prompt ideas for a cyberpunk portrait.",
  "Improve this prompt for better detail and lighting: \"a forest at night\"",
  "Create 3 style variations for a product hero image.",
];

export default function ChatbotGuide() {
  // The chat starts with an assistant welcome message to orient first-time users.
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasHydratedStorage, setHasHydratedStorage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const canSend = useMemo(() => input.trim().length > 0 && !isLoading, [input, isLoading]);

  // Hydrate message history once from localStorage so chat survives refresh.
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(CHATBOT_STORAGE_KEY);
      if (!stored) {
        return;
      }

      const parsed = JSON.parse(stored) as unknown;
      if (!Array.isArray(parsed)) {
        return;
      }

      const restoredMessages = parsed
        .filter(
          (entry): entry is ChatMessage =>
            typeof entry === "object" &&
            entry !== null &&
            "id" in entry &&
            "role" in entry &&
            "content" in entry &&
            typeof entry.id === "string" &&
            (entry.role === "user" || entry.role === "assistant") &&
            typeof entry.content === "string"
        )
        .slice(-MAX_PERSISTED_MESSAGES);

      if (restoredMessages.length > 0) {
        setMessages(restoredMessages);
      }
    } catch {
      // Ignore malformed local storage and continue with default chat state.
    } finally {
      setHasHydratedStorage(true);
    }
  }, []);

  // Persist only after hydration to avoid overwriting stored history on first paint.
  useEffect(() => {
    if (!hasHydratedStorage) {
      return;
    }

    window.localStorage.setItem(
      CHATBOT_STORAGE_KEY,
      JSON.stringify(messages.slice(-MAX_PERSISTED_MESSAGES))
    );
  }, [messages, hasHydratedStorage]);

  // Keep the latest message visible after each update and while the assistant is thinking.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isLoading]);

  const appendMessage = (role: ChatRole, content: string) => {
    const nextMessage: ChatMessage = {
      id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      role,
      content,
    };

    setMessages((previous) => [...previous, nextMessage]);
  };

  const submitMessage = async (rawInput?: string) => {
    const prompt = (rawInput ?? input).trim();
    if (!prompt || isLoading) {
      return;
    }

    // Send the full conversation so the backend model can answer with context.
    const updatedMessages = [...messages, { id: `user-${Date.now()}`, role: "user" as const, content: prompt }];

    setError(null);
    setInput("");
    setIsLoading(true);
    setMessages(updatedMessages);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: updatedMessages.map(({ role, content }) => ({ role, content })) }),
      });

      const data = (await response.json()) as ChatApiResponse;

      if (!response.ok) {
        throw new Error(data.error || "Unable to get a response right now.");
      }

      appendMessage("assistant", data.message || "I couldn’t generate a response. Please try again.");
    } catch (fetchError) {
      const message = fetchError instanceof Error ? fetchError.message : "Unexpected error.";
      setError(message);
      appendMessage("assistant", "I hit a temporary issue. Please try again in a moment.");
    } finally {
      setIsLoading(false);
      textareaRef.current?.focus();
    }
  };

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await submitMessage();
  };

  const handleKeyDown = async (event: KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter sends quickly; Shift+Enter preserves multiline input.
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      await submitMessage();
    }
  };

  return (
    <section className="rounded-sm border border-white/10 bg-(--color-bg-secondary) p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[1.125rem] font-medium tracking-[-0.01em]">AI Chatbot Guide</h2>
          <p className="mt-2 text-sm text-(--color-fg-secondary)">
            Prompt brainstorming, style guidance, and prompt improvements for image generation.
          </p>
        </div>
        <span className="rounded-xs border border-white/10 px-2 py-1 text-[0.65rem] font-medium uppercase tracking-[0.08em] text-(--color-fg-tertiary)">
          Beta
        </span>
      </div>

      <div className="mt-4 h-105 overflow-y-auto rounded-sm border border-white/10 bg-background p-4">
        <div className="grid gap-3">
          {messages.map((message) => (
            <article
              key={message.id}
              className={`max-w-[85%] rounded-sm border px-3 py-2 text-sm leading-relaxed ${
                message.role === "user"
                  ? "ml-auto border-white/20 bg-white/10 text-white"
                  : "border-white/10 bg-(--color-bg-tertiary) text-foreground"
              }`}
            >
              <p className="mb-1 text-[0.65rem] font-medium uppercase tracking-[0.08em] text-(--color-fg-tertiary)">
                {message.role === "user" ? "You" : "Guide"}
              </p>
              <p className="whitespace-pre-wrap">{message.content}</p>
            </article>
          ))}

          {isLoading ? (
            <article className="max-w-[85%] rounded-sm border border-white/10 bg-(--color-bg-tertiary) px-3 py-2 text-sm text-foreground">
              <p className="mb-1 text-[0.65rem] font-medium uppercase tracking-[0.08em] text-(--color-fg-tertiary)">
                Guide
              </p>
              <p className="animate-pulse text-(--color-fg-secondary)">Thinking…</p>
            </article>
          ) : null}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {STARTER_PROMPTS.map((starterPrompt) => (
          <button
            key={starterPrompt}
            type="button"
            onClick={() => {
              setInput(starterPrompt);
              textareaRef.current?.focus();
            }}
            className="focus-ring rounded-xs border border-white/15 px-2.5 py-1.5 text-xs text-(--color-fg-secondary) transition-colors duration-200 hover:border-white/30 hover:text-white"
          >
            {starterPrompt}
          </button>
        ))}
      </div>

      <form className="mt-4" onSubmit={handleFormSubmit}>
        <label htmlFor="chatbot-input" className="sr-only">
          Ask the chatbot guide
        </label>
        <textarea
          ref={textareaRef}
          id="chatbot-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
          rows={3}
          placeholder="Ask for prompt ideas, style variations, or improvements..."
          className="focus-ring min-h-24 w-full resize-y rounded-xs border border-white/10 bg-transparent px-3 py-2 text-sm text-white placeholder:text-(--color-fg-tertiary) focus:border-white/30 focus:outline-none"
          disabled={isLoading}
        />
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-xs text-(--color-fg-tertiary)">Press Enter to send. Use Shift+Enter for a new line.</p>
          <button
            type="submit"
            disabled={!canSend}
            className="focus-ring rounded-xs border border-white/15 px-4 py-2 text-xs font-medium uppercase tracking-[0.08em] text-white transition-colors duration-200 hover:border-white/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Sending..." : "Send"}
          </button>
        </div>
      </form>

      {error ? <p className="mt-3 text-sm text-(--color-accent)">{error}</p> : null}
    </section>
  );
}
