import { useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  PanelRightClose,
  PanelRightOpen,
  FileCode2,
  Play,
  Code2,
  Copy,
  Check,
  X,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { getFileIcon, generatePreviewSrcDoc, getLanguage } from "./artifactUtils";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export const Artifacts = ({ isMobileOpen, setIsMobileOpen}) => {
  const [collapsed, setCollapsed] = useState(true);
  const [activeTab, setActiveTab] = useState("preview");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [copied, setCopied] = useState(false);

  const artifactsData = useSelector((state) => state.messages.artifacts);

  const files = useMemo(() => {
    if (!artifactsData) return [];
    if (Array.isArray(artifactsData)) {
      if (artifactsData.length === 0) return [];
      if (artifactsData[0]?.files && Array.isArray(artifactsData[0].files)) {
        return artifactsData[0].files;
      }
      if (artifactsData[0]?.name && artifactsData[0]?.content) {
        return artifactsData;
      }
    }
    if (artifactsData.files && Array.isArray(artifactsData.files)) {
      return artifactsData.files;
    }
    return [];
  }, [artifactsData]);

  useEffect(() => {
    if (files.length > 0) {
      setCollapsed(false);
      if (setIsMobileOpen) {
        setIsMobileOpen(true);
      }
    }
  }, [files, setIsMobileOpen]);

  const activeFile = useMemo(() => {
    if (files.length === 0) return null;
    return (
      files.find((f) => f.name === selectedFileName) ||
      files.find((f) => f.name === "index.html") ||
      files[0]
    );
  }, [files, selectedFileName]);

  const previewSrcDoc = useMemo(() => {
    return generatePreviewSrcDoc(files);
  }, [files]);

  const handleCopyCode = () => {
    if (!activeFile?.content) return;
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const closeMobileDrawer = () => {
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  const hasFiles = files.length > 0;

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden animate-in fade-in duration-200"
          onClick={closeMobileDrawer}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 right-0 z-50 flex h-full shrink-0 flex-col
          border-l border-[#EB4C4C]/10 bg-gradient-to-b from-white to-[#EB4C4C]/5
          shadow-2xl shadow-[#EB4C4C]/5 transition-all duration-300 ease-in-out
          md:relative md:z-auto md:shadow-none
          ${isMobileOpen ? "translate-x-0 w-full sm:w-[420px]" : "translate-x-full md:translate-x-0"}
          ${collapsed ? "md:w-[60px]" : "md:w-[440px]"}
        `}
      >
        {/* Header */}
        <header
          className={`
            flex h-16 shrink-0 items-center border-b border-[#EB4C4C]/10 px-4
            ${collapsed && !isMobileOpen ? "md:justify-center" : "justify-between"}
            bg-white/80 backdrop-blur-sm
          `}
        >
          {(!collapsed || isMobileOpen) && (
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="relative flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#EB4C4C] shadow-lg shadow-[#EB4C4C]/25">
                <FileCode2 size={18} className="text-white" strokeWidth={2.5} />
                {hasFiles && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#EB4C4C] opacity-40" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-[#EB4C4C] border-2 border-white" />
                  </span>
                )}
              </div>
              <div className="truncate">
                <h2 className="text-sm font-semibold text-zinc-800 leading-none">
                  Artifacts
                </h2>
                <p className="mt-1 text-[11px] text-zinc-500 truncate flex items-center gap-1.5">
                  {hasFiles ? (
                    <>
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#EB4C4C]" />
                      {files.length} File{files.length > 1 ? 's' : ''} Generated
                    </>
                  ) : (
                    "No artifacts yet"
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Desktop Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden size-8 text-zinc-400 transition-all hover:bg-[#EB4C4C]/10 hover:text-[#EB4C4C] hover:scale-105 md:flex"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <PanelRightOpen size={16} /> : <PanelRightClose size={16} />}
          </Button>

          {/* Mobile Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-zinc-400 transition-all hover:bg-[#EB4C4C]/10 hover:text-[#EB4C4C] hover:scale-105 md:hidden"
            onClick={closeMobileDrawer}
          >
            <X size={18} />
          </Button>
        </header>

        {/* Main Content Area */}
        {(!collapsed || !isMobileOpen) && (
          <div className="flex flex-1 flex-col min-h-0">
            {!hasFiles ? (
              /* Empty State */
              <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                <div className="relative mb-5">
                  <div className="absolute inset-0 animate-pulse rounded-full bg-[#EB4C4C]/10 blur-xl" />
                  <div className="relative flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#EB4C4C] to-[#D63F3F] shadow-lg shadow-[#EB4C4C]/30">
                    <FileCode2 size={26} className="text-white" strokeWidth={2} />
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-zinc-800">No artifacts yet</h3>
                <p className="mt-1.5 max-w-[220px] text-xs leading-5 text-zinc-500">
                  Generated code, documents, and interactive files will appear here.
                </p>
                <div className="mt-4 flex gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#EB4C4C]/20 animate-pulse" />
                  <span className="h-1.5 w-1.5 rounded-full bg-[#EB4C4C]/30 animate-pulse delay-75" />
                  <span className="h-1.5 w-1.5 rounded-full bg-[#EB4C4C]/20 animate-pulse delay-150" />
                </div>
              </div>
            ) : (
              /* Active Artifact Content */
              <div className="flex flex-1 flex-col min-h-0">
                {/* Controls Bar: Mode Switcher & File Tabs */}
                <div className="flex flex-col border-b border-[#EB4C4C]/10 bg-gradient-to-r from-[#EB4C4C]/5 via-white to-[#EB4C4C]/5 p-3 gap-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex rounded-xl bg-white p-1 border border-[#EB4C4C]/10 shadow-sm">
                      <button
                        onClick={() => setActiveTab("preview")}
                        className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
                          activeTab === "preview"
                            ? "bg-[#EB4C4C] text-white shadow-md shadow-[#EB4C4C]/30 hover:bg-[#D63F3F]"
                            : "text-zinc-500 hover:text-[#EB4C4C] hover:bg-[#EB4C4C]/5"
                        }`}
                      >
                        <Play size={12} className={activeTab === "preview" ? "text-white" : "text-zinc-400"} />
                        Preview
                      </button>

                      <button
                        onClick={() => setActiveTab("code")}
                        className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
                          activeTab === "code"
                            ? "bg-[#EB4C4C] text-white shadow-md shadow-[#EB4C4C]/30 hover:bg-[#D63F3F]"
                            : "text-zinc-500 hover:text-[#EB4C4C] hover:bg-[#EB4C4C]/5"
                        }`}
                      >
                        <Code2 size={12} className={activeTab === "code" ? "text-white" : "text-zinc-400"} />
                        Code
                      </button>
                    </div>

                    {activeTab === "code" && activeFile && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopyCode}
                        className="h-8 text-xs gap-1.5 border-[#EB4C4C]/20 text-zinc-600 hover:bg-[#EB4C4C]/5 hover:text-[#EB4C4C] hover:border-[#EB4C4C]/40 transition-all"
                      >
                        {copied ? (
                          <>
                            <Check size={12} className="text-[#EB4C4C]" />
                            <span className="text-[#EB4C4C]">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy size={12} />
                            Copy
                          </>
                        )}
                      </Button>
                    )}
                  </div>

                  {/* File List Selector */}
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                    {files.map((file) => {
                      const isSelected = activeFile?.name === file.name;
                      return (
                        <button
                          key={file.name}
                          disabled={!file?.content || activeTab === "preview"}
                          onClick={() => {
                            setSelectedFileName(file.name);
                          }}
                          className={`group flex items-center gap-1.5 shrink-0 rounded-xl px-3 py-1.5 text-xs font-medium border transition-all duration-200 ${
                            isSelected
                              ? "border-[#EB4C4C] bg-[#EB4C4C]/5 text-[#EB4C4C] shadow-sm"
                              : "border-transparent text-zinc-500 hover:border-[#EB4C4C]/20 hover:bg-[#EB4C4C]/5 hover:text-[#EB4C4C]"
                          }`}
                        >
                          <span className="transition-transform group-hover:scale-110">
                            {getFileIcon(file.name)}
                          </span>
                          <span className="truncate max-w-[120px]">{file.name}</span>
                          {isSelected && (
                            <span className="ml-0.5 h-1.5 w-1.5 rounded-full bg-[#EB4C4C] animate-pulse" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* View Container */}
                <div className="flex-1 min-h-0 bg-white relative">
                  {activeTab === "preview" && activeFile?.name.includes(".html") ? (
                    <iframe
                      title="Artifact Preview"
                      srcDoc={previewSrcDoc}
                      className="w-full h-full border-0 bg-white"
                      sandbox="allow-scripts allow-modals"
                    />
                  ) : (
                    <div className="h-full overflow-auto bg-[#0D1117] font-mono text-xs">
                      <SyntaxHighlighter
                        language={getLanguage(activeFile?.name)}
                        style={vscDarkPlus}
                        showLineNumbers
                        customStyle={{
                          margin: 0,
                          padding: "1rem",
                          fontSize: "12px",
                          lineHeight: "1.6",
                          backgroundColor: "transparent",
                        }}
                      >
                        {activeFile?.content || "// No content available"}
                      </SyntaxHighlighter>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Collapsed Sidebar Indicator (Desktop only) */}
        {collapsed && !isMobileOpen && (
          <div className="hidden flex-1 flex-col items-center pt-6 gap-4 md:flex">
            <div className="relative">
              <FileCode2 size={20} className="text-zinc-400/60" />
              {hasFiles && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#EB4C4C] opacity-40" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-[#EB4C4C]" />
                </span>
              )}
            </div>
            {hasFiles && (
              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-medium text-[#EB4C4C]">
                  {files.length}
                </span>
                <span className="h-1 w-6 rounded-full bg-[#EB4C4C]/20" />
              </div>
            )}
          </div>
        )}
      </aside>
    </>
  );
};