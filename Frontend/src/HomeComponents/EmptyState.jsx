import { Sparkles } from "lucide-react";

export const EmptyState = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
      {/* Animated icon container */}
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 animate-pulse rounded-full bg-[#EB4C4C]/20 blur-2xl" />
        
        {/* Main icon container */}
        <div className="relative flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#EB4C4C] to-[#D63F3F] shadow-lg shadow-[#EB4C4C]/30 transition-all hover:scale-105 hover:shadow-[#EB4C4C]/50">
          <Sparkles 
            size={28} 
            className="text-white drop-shadow-sm animate-in zoom-in duration-300" 
            strokeWidth={2.5}
          />
          
          {/* Decorative rings */}
          <div className="absolute -inset-1 rounded-2xl border border-[#EB4C4C]/10 animate-pulse" />
          <div className="absolute -inset-2 rounded-2xl border border-[#EB4C4C]/5" />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2 max-w-sm">
        <h2 className="text-lg font-semibold bg-gradient-to-r from-zinc-800 to-zinc-600 bg-clip-text text-transparent">
          What can I help with today?
        </h2>
        <p className="text-sm text-zinc-500 leading-relaxed">
          Type a message below to start a new chat with OpenGPT.
        </p>
      </div>

     

      {/* Decorative dots */}
      <div className="flex gap-1.5 mt-1">
        <span className="h-1.5 w-1.5 rounded-full bg-[#EB4C4C]/20 animate-pulse" />
        <span className="h-1.5 w-1.5 rounded-full bg-[#EB4C4C]/30 animate-pulse delay-75" />
        <span className="h-1.5 w-1.5 rounded-full bg-[#EB4C4C]/20 animate-pulse delay-150" />
      </div>
    </div>
  );
};