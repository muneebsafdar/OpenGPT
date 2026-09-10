import { Sparkles, Code2, Image, FileText, Presentation, SearchIcon } from "lucide-react";

const MODES = [
  { id: "auto", label: "Auto", Icon: Sparkles },
  { id: "coding", label: "Coding", Icon: Code2 },
  { id: "image", label: "Image", Icon: Image },
  { id: "pdf", label: "PDF", Icon: FileText },
  { id: "ppt", label: "PPT", Icon: Presentation },
  { id: "search", label: "Search", Icon: SearchIcon },
];

export const ModeSelector = ({ selectedMode="auto", onSelectMode }) => {
  return (
    <div className="flex items-center gap-1   overflow-x-auto pb-0.5 scrollbar-thin scrollbar-thumb-[#EB4C4C]/20 scrollbar-track-transparent">
      {MODES.map(({ id, label, Icon }) => {
        const isSelected = selectedMode === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onSelectMode(id)}
            className={`
              group relative flex h-8 shrink-0 items-center gap-2 rounded-xl px-3.5 
              text-[12px] font-medium transition-all duration-300 ease-out
              hover:scale-105 active:scale-95 mt-4
              ${
                isSelected
                  ? "bg-[#EB4C4C] text-white shadow-lg shadow-[#EB4C4C]/30 hover:bg-[#D63F3F] hover:shadow-[#EB4C4C]/40"
                  : "bg-transparent text-zinc-500 hover:bg-[#EB4C4C]/8 hover:text-[#EB4C4C]"
              }
            `}
          >
            {/* Selected indicator dot */}
            {isSelected && (
              <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-40" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#D63F3F]" />
              </span>
            )}
            
            <Icon
              size={13}
              className={`
                transition-all duration-300
                ${isSelected 
                  ? "text-white drop-shadow-sm" 
                  : "text-zinc-400 group-hover:text-[#EB4C4C] group-hover:scale-110"
                }
              `}
            />
            <span className={`
              transition-all duration-300
              ${isSelected 
                ? "text-white" 
                : "group-hover:text-[#EB4C4C]"
              }
            `}>
              {label}
            </span>

            {/* Hover background effect */}
            {!isSelected && (
              <span className="absolute inset-0 -z-10 rounded-xl bg-[#EB4C4C]/0 transition-all duration-300 group-hover:bg-[#EB4C4C]/5" />
            )}
          </button>
        );
      })}
    </div>
  );
};