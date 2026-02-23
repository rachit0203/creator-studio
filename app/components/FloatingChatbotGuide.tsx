"use client";

import { useEffect, useState } from "react";
import ChatbotGuide from "./ChatbotGuide";

const AI_GUIDE_SEEN_KEY = "studio.chatbot.launcher.seen.v1";

export default function FloatingChatbotGuide() {
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    try {
      const hasSeenGuide = window.localStorage.getItem(AI_GUIDE_SEEN_KEY);
      if (!hasSeenGuide) {
        window.localStorage.setItem(AI_GUIDE_SEEN_KEY, "true");
        return true;
      }
    } catch {
      // If storage is unavailable, keep default closed behavior.
    }

    return false;
  });

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-50 flex max-w-[calc(100vw-2rem)] flex-col items-end md:right-6 md:bottom-6">
      {isOpen ? (
        <div
          id="floating-ai-guide"
          className="pointer-events-auto mb-3 w-[min(460px,calc(100vw-2rem))] max-h-[calc(100vh-6rem)] overflow-y-auto rounded-sm border border-white/20 bg-(--color-bg-secondary)"
        >
          <ChatbotGuide />
        </div>
      ) : null}

      <div className="pointer-events-auto flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsOpen((previous) => !previous)}
          aria-expanded={isOpen}
          aria-controls="floating-ai-guide"
          className="focus-ring rounded-sm border border-(--color-accent) bg-(--color-accent) px-4 py-2 text-xs font-medium uppercase tracking-[0.08em] text-white transition-opacity duration-200 hover:opacity-90"
        >
          {isOpen ? "Hide AI Guide" : "Open AI Guide"}
        </button>

        {!isOpen ? (
          <span className="rounded-xs border border-white/15 bg-(--color-bg-secondary) px-2 py-1 text-[0.65rem] font-medium uppercase tracking-[0.08em] text-(--color-fg-secondary)">
            Prompt Help
          </span>
        ) : null}
      </div>
    </div>
  );
}
