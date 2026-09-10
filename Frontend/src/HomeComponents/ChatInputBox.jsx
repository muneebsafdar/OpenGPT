import { useRef, useState, useEffect } from "react";
import { Send, Paperclip, Mic, MicOff, X, FileText, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeSelector } from "./ModeSelector";

export const ChatInputBox = ({
  input,
  setInput,
  handleSend,
  handleKeyDown,
  selectedMode,
  setSelectedMode,
  file,
  setFile,
  loading,
}) => {
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);
  const baseInputRef = useRef("");

  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        180
      )}px`;
    }
  }, [input]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in your browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    baseInputRef.current = input ? `${input.trim()} ` : "";

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      let sessionTranscript = "";

      for (let i = 0; i < event.results.length; i++) {
        sessionTranscript += event.results[i][0].transcript;
      }

      setInput(baseInputRef.current + sessionTranscript);
    };

    recognition.onerror = (event) => {
      console.error("Speech Recognition Error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handlePaperclipClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="shrink-0 bg-gradient-to-t from-[#EB4C4C]/5 via-white to-transparent px-4 pb-5 pt-6">
      <div className="mx-auto max-w-3xl">
        {/* Active Voice Recording Status Banner */}
        {isListening && (
          <div className="mb-3 flex w-fit items-center gap-2.5 rounded-full bg-[#EB4C4C] px-4 py-1.5 text-xs font-medium text-white shadow-lg shadow-[#EB4C4C]/30 animate-in slide-in-from-top-2 fade-in duration-200">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
              <span className="relative inline-flex size-2.5 rounded-full bg-white" />
            </span>
            Listening... speak now
          </div>
        )}

        {/* File Preview Chip */}
        {file && (
          <div className="group relative mb-3 flex w-fit max-w-full items-center gap-3 rounded-2xl border border-[#EB4C4C]/20 bg-gradient-to-r from-white to-[#EB4C4C]/5 p-2 pr-4 shadow-md shadow-[#EB4C4C]/5 animate-in slide-in-from-top-2 fade-in duration-200">
            {file.type.startsWith("image/") ? (
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-[#EB4C4C]/10 bg-zinc-100">
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="h-full w-full object-cover"
                  onLoad={(e) => URL.revokeObjectURL(e.currentTarget.src)}
                />
              </div>
            ) : (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EB4C4C]/10 text-[#EB4C4C] transition-colors group-hover:bg-[#EB4C4C]/20">
                <FileText size={18} />
              </div>
            )}

            <div className="flex flex-col min-w-0 pr-1">
              <span className="truncate text-sm font-medium text-zinc-800 max-w-[160px] sm:max-w-[220px]">
                {file.name}
              </span>
              <span className="text-[11px] text-zinc-400">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </span>
            </div>

            <button
              type="button"
              onClick={removeFile}
              disabled={loading}
              className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-zinc-400 transition-all hover:bg-[#EB4C4C]/15 hover:text-[#EB4C4C] hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EB4C4C]/40 disabled:pointer-events-none"
              title="Remove attachment"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Main Input Container - Unified Box with Mode Selector */}
        <div
          className={`
            relative rounded-3xl border-2 bg-white p-3 
            shadow-[0_4px_20px_rgba(0,0,0,0.06)]
            transition-all duration-300
            ${isListening 
              ? "border-[#EB4C4C] shadow-[0_4px_24px_rgba(235,76,76,0.15)] ring-4 ring-[#EB4C4C]/10" 
              : "border-[#EB4C4C]/20 hover:border-[#EB4C4C]/40 focus-within:border-[#EB4C4C] focus-within:shadow-[0_4px_24px_rgba(235,76,76,0.12)] focus-within:ring-4 focus-within:ring-[#EB4C4C]/5"}
          `}
        >
          {/* Mode Selector - Inside the box */}
          <div className="mb-3">
            <ModeSelector
              selectedMode={selectedMode}
              onSelectMode={setSelectedMode}
            />
          </div>

          {/* Divider */}
          <div className="mb-3 h-px bg-gradient-to-r from-transparent via-[#EB4C4C]/20 to-transparent" />

          {/* Input Area */}
          <div className="flex items-end gap-1">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*,.pdf,application/pdf"
              className="hidden"
            />

            {/* Attachment Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePaperclipClick}
              disabled={loading}
              className="group relative size-9 shrink-0 rounded-full text-zinc-400 transition-all hover:bg-[#EB4C4C]/10 hover:text-[#EB4C4C] hover:scale-105 active:scale-95"
              title="Attach File"
            >
              <Paperclip size={17} className="transition-transform group-hover:rotate-12" />
            </Button>

            {/* Dynamic Auto-Expanding Multi-line Textarea */}
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              disabled={loading}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message OpenGPT..."
              className="min-h-[40px] max-h-[180px] flex-1 resize-none overflow-y-auto bg-transparent px-1 py-2.5 text-[15px] leading-6 text-zinc-800 outline-none placeholder:text-zinc-400/60 disabled:cursor-not-allowed disabled:opacity-50"
            />

            {/* Voice Input Button */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={toggleListening}
              disabled={loading}
              className={`group relative size-9 shrink-0 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 ${
                isListening
                  ? "bg-[#EB4C4C] text-white shadow-lg shadow-[#EB4C4C]/40 hover:bg-[#D63F3F] hover:shadow-[#EB4C4C]/50"
                  : "text-zinc-400 hover:bg-[#EB4C4C]/10 hover:text-[#EB4C4C]"
              }`}
              title={isListening ? "Stop Recording" : "Start Voice Input"}
            >
              {isListening ? (
                <MicOff size={16} className="animate-pulse" />
              ) : (
                <Mic size={16} className="transition-transform group-hover:scale-110" />
              )}
            </Button>

            {/* Send Button */}
            <Button
              size="icon"
              onClick={handleSend}
              disabled={(!input.trim() && !file) || loading}
              className={`
                group relative size-9 shrink-0 rounded-full transition-all duration-300
                disabled:bg-zinc-100 disabled:text-zinc-300 disabled:shadow-none
                ${
                  loading
                    ? "bg-zinc-800 text-white hover:bg-zinc-700"
                    : "bg-[#EB4C4C] text-white shadow-lg shadow-[#EB4C4C]/30 hover:bg-[#D63F3F] hover:scale-105 hover:shadow-[#EB4C4C]/50 active:scale-95"
                }
              `}
              title={loading ? "Generating..." : "Send Message"}
            >
              {loading ? (
                <Square size={14} fill="currentColor" className="animate-spin" />
              ) : (
                <Send size={15} className="transition-transform group-hover:translate-x-[1px] group-hover:-translate-y-[1px]" />
              )}
            </Button>
          </div>

          {/* Brand accent line at bottom */}
          <div className="absolute -bottom-0.5 left-1/2 h-0.5 w-0 rounded-full bg-[#EB4C4C] transition-all duration-500 group-focus-within:w-[90%] group-focus-within:left-[5%]" />
        </div>

        <p className="mt-3.5 text-center text-[11px] text-zinc-400/70">
          OpenGPT can make mistakes. Check important information.
        </p>
      </div>
    </div>
  );
};