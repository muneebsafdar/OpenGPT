import { Sparkles, ChevronDown, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ChatHeader = ({ title }) => {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between  border-[#EB4C4C]/10  px-6 transition-colors">
      <div className="flex min-w-0 items-center gap-4">
        <div className="relative flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#EB4C4C] shadow-lg shadow-[#EB4C4C]/25 transition-all hover:scale-105 hover:shadow-[#EB4C4C]/40">
          <Bot size={17} className="text-white" strokeWidth={2.5} />
        </div>

        <div className="min-w-0">
          <h1 className="truncate text-sm font-semibold text-foreground/90 transition-colors hover:text-foreground">
            {title || "New Chat"}
          </h1>
          <p className="text-xs text-muted-foreground/60">AI Assistant • Online</p>
        </div>
      </div>

    </header>
  );
};