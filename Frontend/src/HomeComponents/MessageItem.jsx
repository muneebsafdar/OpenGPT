import { useState } from "react";
import { Bot, X, Check, Copy, Sparkles } from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ImageItem } from "./ImageItems";

// Custom Code Block Component with Copy Button & Language Header
const CodeBlock = ({ language, value }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-4 overflow-hidden rounded-2xl border border-[#EB4C4C]/10 bg-[#0D1117] font-mono text-xs shadow-xl shadow-[#EB4C4C]/5 transition-all hover:shadow-[#EB4C4C]/10">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-[#EB4C4C]/10 bg-gradient-to-r from-[#EB4C4C]/5 to-transparent px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-[#EB4C4C]/20">
            <span className="text-[8px] font-bold text-[#EB4C4C]">#</span>
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-white/80">
            {language || "code"}
          </span>
        </div>
        <button
          onClick={handleCopy}
          type="button"
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-medium transition-all duration-200 hover:scale-105 active:scale-95"
        >
          {copied ? (
            <>
              <Check size={13} className="text-[#EB4C4C]" />
              <span className="font-medium text-[#EB4C4C]">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="text-white/60 transition-colors group-hover:text-white" size={13} />
              <span className="text-white/60 transition-colors group-hover:text-white">Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Syntax Highlighting Area */}
      <SyntaxHighlighter
        language={language || "text"}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: "1rem",
          fontSize: "0.8rem",
          lineHeight: "1.6",
          background: "transparent",
        }}
        codeTagProps={{
          style: { fontFamily: "var(--font-mono, monospace)" },
        }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
};

export const MessageItem = ({ message }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const isUser = typeof message === "string" ? false : message.role === "user";
  const messageContent =
    typeof message === "string"
      ? message
      : message.content || message.text || message.message;

  const images =
    typeof message === "object" && Array.isArray(message.images)
      ? message.images
      : [];

  return (
    <>
      <div
        className={`flex w-full gap-3 sm:gap-4 ${
          isUser ? "flex-row-reverse" : "flex-row"
        } animate-in slide-in-from-bottom-2 fade-in duration-300`}
      >
        {/* Avatar */}
        {isUser ? (
          <Avatar className="mt-0.5 size-8 shrink-0 ring-2 ring-[#EB4C4C]/20 shadow-lg shadow-[#EB4C4C]/10">
            <AvatarFallback className="bg-gradient-to-br from-[#EB4C4C] to-[#D63F3F] text-[11px] font-semibold text-white">
              U
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#EB4C4C] to-[#D63F3F] shadow-lg shadow-[#EB4C4C]/25">
            <Bot size={14} className="text-white" strokeWidth={2.5} />
          </div>
        )}

        {/* Message Content Container */}
        <div
          className={`flex max-w-[85%] flex-col gap-2.5 sm:max-w-[75%] md:max-w-[70%] ${
            isUser ? "items-end" : "items-start"
          }`}
        >
          {/* Lazy-Loaded Image Grid */}
          {images.length > 0 && (
            <div className="grid w-full max-w-2xl grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
              {images.map((img, idx) => {
                const imgSrc =
                  typeof img === "string" ? img : img.url || img.src;
                return (
                  <ImageItem
                    key={idx}
                    src={imgSrc}
                    idx={idx}
                    onClick={() => setSelectedImage(imgSrc)}
                  />
                );
              })}
            </div>
          )}

          {/* Text Message Content */}
          {messageContent && (
            <div
              className={`w-full overflow-hidden rounded-2xl px-4 py-3 text-xs sm:px-5 sm:py-3.5 sm:text-sm leading-relaxed transition-all ${
                isUser
                  ? "rounded-tr-sm bg-gradient-to-br from-[#EB4C4C] to-[#D63F3F] text-white shadow-lg shadow-[#EB4C4C]/30"
                  : "rounded-tl-sm bg-white/80 text-zinc-800 shadow-xl shadow-black/5 backdrop-blur-sm border border-[#EB4C4C]/10"
              }`}
            >
              <Markdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => (
                    <h1 className={`mb-3 mt-4 border-b border-[#EB4C4C]/20 pb-2 text-xl font-bold tracking-tight sm:text-2xl ${
                      isUser ? "text-white" : "text-zinc-800"
                    }`}>
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className={`mb-2.5 mt-3 border-b border-[#EB4C4C]/10 pb-1.5 text-lg font-semibold tracking-tight sm:text-xl ${
                      isUser ? "text-white" : "text-zinc-800"
                    }`}>
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className={`mb-2 mt-3 text-base font-semibold ${
                      isUser ? "text-white" : "text-zinc-800"
                    }`}>
                      {children}
                    </h3>
                  ),
                  h4: ({ children }) => (
                    <h4 className={`mb-1.5 mt-2 text-sm font-semibold ${
                      isUser ? "text-white" : "text-zinc-800"
                    }`}>
                      {children}
                    </h4>
                  ),
                  p: ({ children }) => (
                    <p className={`mb-3 leading-relaxed last:mb-0 ${
                      isUser ? "text-white/95" : "text-zinc-700/90"
                    }`}>
                      {children}
                    </p>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`break-all font-medium underline underline-offset-4 transition-all hover:opacity-80 ${
                        isUser ? "text-white" : "text-[#EB4C4C]"
                      }`}
                    >
                      {children}
                    </a>
                  ),
                  ul: ({ children }) => (
                    <ul className={`mb-3 ml-4 list-disc space-y-1.5 sm:ml-6 ${
                      isUser ? "text-white/95" : "text-zinc-700/90"
                    }`}>
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className={`mb-3 ml-4 list-decimal space-y-1.5 sm:ml-6 ${
                      isUser ? "text-white/95" : "text-zinc-700/90"
                    }`}>
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="leading-relaxed">{children}</li>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className={`my-2.5 border-l-4 ${
                      isUser ? "border-white/50" : "border-[#EB4C4C]/40"
                    } pl-3 italic ${
                      isUser ? "text-white/80" : "text-zinc-500"
                    }`}>
                      {children}
                    </blockquote>
                  ),
                  hr: () => <hr className={`my-4 ${
                    isUser ? "border-white/20" : "border-[#EB4C4C]/10"
                  }`} />,
                  strong: ({ children }) => (
                    <strong className={`font-semibold ${
                      isUser ? "text-white" : "text-zinc-800"
                    }`}>
                      {children}
                    </strong>
                  ),
                  em: ({ children }) => <em className="italic">{children}</em>,
                  img: ({ src, alt, title, ...props }) => (
                    <span className="my-4 block overflow-hidden rounded-xl border border-[#EB4C4C]/10 bg-white/5">
                      <img
                        src={src}
                        alt={alt || "Markdown Image"}
                        title={title}
                        loading="lazy"
                        className="h-auto max-h-[350px] w-full object-contain sm:max-h-[500px]"
                        {...props}
                      />
                      {alt && (
                        <span className={`block border-t border-[#EB4C4C]/10 px-3 py-1.5 text-center text-[11px] ${
                          isUser ? "text-white/70" : "text-zinc-500"
                        }`}>
                          {alt}
                        </span>
                      )}
                    </span>
                  ),
                  table: ({ children }) => (
                    <div className={`my-4 w-full overflow-x-auto rounded-xl border ${
                      isUser ? "border-white/20" : "border-[#EB4C4C]/10"
                    }`}>
                      <table className="w-full border-collapse text-left text-xs sm:text-sm">
                        {children}
                      </table>
                    </div>
                  ),
                  thead: ({ children }) => (
                    <thead className={`font-semibold ${
                      isUser ? "bg-white/10 text-white" : "bg-[#EB4C4C]/5 text-zinc-800"
                    }`}>
                      {children}
                    </thead>
                  ),
                  tbody: ({ children }) => (
                    <tbody className={`divide-y ${
                      isUser ? "divide-white/10" : "divide-[#EB4C4C]/10"
                    }`}>
                      {children}
                    </tbody>
                  ),
                  tr: ({ children }) => (
                    <tr className={`transition-colors ${
                      isUser ? "hover:bg-white/5" : "hover:bg-[#EB4C4C]/5"
                    }`}>
                      {children}
                    </tr>
                  ),
                  th: ({ children }) => (
                    <th className={`border-b px-4 py-2.5 font-semibold ${
                      isUser ? "border-white/20 text-white" : "border-[#EB4C4C]/10 text-zinc-800"
                    }`}>
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className={`px-4 py-2.5 ${
                      isUser ? "text-white/90" : "text-zinc-700/90"
                    }`}>
                      {children}
                    </td>
                  ),
                  pre: ({ children }) => <>{children}</>,
                  code: ({ inline, className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || "");
                    const codeString = String(children).replace(/\n$/, "");

                    if (!inline && (match || codeString.includes("\n"))) {
                      return (
                        <CodeBlock
                          language={match ? match[1] : ""}
                          value={codeString}
                        />
                      );
                    }

                    return (
                      <code
                        className={`break-all rounded px-1.5 py-0.5 font-mono text-[11px] font-semibold sm:text-xs ${
                          isUser 
                            ? "bg-white/20 text-white" 
                            : "bg-[#EB4C4C]/10 text-[#EB4C4C]"
                        }`}
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {messageContent}
              </Markdown>
            </div>
          )}
        </div>
      </div>

      {/* Enlarged Image Modal Popup */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 backdrop-blur-md sm:p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-h-[90vh] max-w-[95vw] overflow-hidden rounded-2xl bg-white/5 p-1 shadow-2xl shadow-[#EB4C4C]/10 sm:max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute right-3 top-3 z-10 flex size-9 items-center justify-center rounded-full bg-black/60 text-white shadow-lg transition-all hover:bg-[#EB4C4C] hover:scale-110 active:scale-95"
            >
              <X size={16} />
            </button>

            <img
              src={selectedImage}
              alt="Enlarged view"
              loading="lazy"
              className="max-h-[85vh] max-w-[90vw] rounded-xl object-contain shadow-lg sm:max-w-[85vw]"
            />
          </div>
        </div>
      )}
    </>
  );
};