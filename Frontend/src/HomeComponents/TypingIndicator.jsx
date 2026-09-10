import { useEffect, useState } from "react";
import { Bot, Sparkles } from "lucide-react";

const THINKING_PHRASES = [
  "Thinking...",
  "Analyzing request...",
  "Searching knowledge...",
  "Formulating response...",
  "Almost there...",
];

export const TypingIndicator = () => {
  const [phraseIndex, setPhraseIndex] = useState(0);

  // Cycle indefinitely through thinking phrases every 2.5s while mounted
  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % THINKING_PHRASES.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex w-full gap-2 sm:gap-3">
      {/* Avatar with Ambient Pulse Glow */}
      <div className="relative mt-0.5 flex size-7 shrink-0 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-[#EB4C4C]/25 duration-1000" />
        <div className="relative flex size-7 items-center justify-center rounded-full bg-[#EB4C4C] shadow-sm shadow-[#EB4C4C]/30">
          <Bot size={13} className="text-white" />
        </div>
      </div>

      {/* Animated Thinking Bubble */}
      <div className="flex max-w-[85%] items-center gap-2 rounded-2xl rounded-tl-xs border border-black/[0.06] bg-white px-3 py-2 shadow-sm sm:max-w-[75%] sm:gap-2.5 sm:px-4 sm:py-2.5 md:max-w-[70%]">
        <Sparkles
          size={13}
          className="shrink-0 animate-spin text-[#EB4C4C] [animation-duration:3s]"
        />

        <span className="truncate text-[11px] font-medium text-zinc-500 animate-pulse transition-all duration-300 sm:text-xs">
          {THINKING_PHRASES[phraseIndex]}
        </span>

        <div className="flex shrink-0 items-center gap-1 pl-0.5 sm:pl-1">
          <span className="size-1 animate-bounce rounded-full bg-[#EB4C4C] sm:size-1.5 [animation-delay:-0.32s]" />
          <span className="size-1 animate-bounce rounded-full bg-[#EB4C4C] sm:size-1.5 [animation-delay:-0.16s]" />
          <span className="size-1 animate-bounce rounded-full bg-[#EB4C4C] sm:size-1.5" />
        </div>
      </div>
    </div>
  );
};