import { Code, File, FileCode, FileJson, FileType, Globe, Palette, Braces } from "lucide-react";

// Helper to choose file icon based on extension with better visual design
export const getFileIcon = (filename = "") => {
  const ext = filename.split(".").pop()?.toLowerCase();
  
  // File icon configurations with brand-inspired colors
  const iconConfigs = {
    // Web technologies
    html: { icon: Globe, color: "#EB4C4C", bg: "bg-[#EB4C4C]/10" },
    css: { icon: Palette, color: "#3B82F6", bg: "bg-blue-500/10" },
    js: { icon: Braces, color: "#F59E0B", bg: "bg-yellow-500/10" },
    jsx: { icon: Braces, color: "#61DAFB", bg: "bg-cyan-500/10" },
    ts: { icon: FileCode, color: "#3178C6", bg: "bg-blue-600/10" },
    tsx: { icon: FileCode, color: "#3178C6", bg: "bg-blue-600/10" },
    
    // Data formats
    json: { icon: FileJson, color: "#8B5CF6", bg: "bg-purple-500/10" },
    xml: { icon: FileCode, color: "#8B5CF6", bg: "bg-purple-500/10" },
    csv: { icon: FileType, color: "#10B981", bg: "bg-emerald-500/10" },
    
    // Documents
    pdf: { icon: File, color: "#EB4C4C", bg: "bg-[#EB4C4C]/10" },
    doc: { icon: File, color: "#2B579A", bg: "bg-blue-700/10" },
    docx: { icon: File, color: "#2B579A", bg: "bg-blue-700/10" },
    txt: { icon: File, color: "#6B7280", bg: "bg-gray-500/10" },
    
    // Images
    png: { icon: File, color: "#EC4899", bg: "bg-pink-500/10" },
    jpg: { icon: File, color: "#EC4899", bg: "bg-pink-500/10" },
    jpeg: { icon: File, color: "#EC4899", bg: "bg-pink-500/10" },
    svg: { icon: File, color: "#EC4899", bg: "bg-pink-500/10" },
    gif: { icon: File, color: "#EC4899", bg: "bg-pink-500/10" },
  };

  const config = iconConfigs[ext] || { 
    icon: File, 
    color: "#9CA3AF", 
    bg: "bg-gray-500/10" 
  };

  const IconComponent = config.icon;
  
  return (
    <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${config.bg} transition-all duration-200 group-hover:scale-110`}>
      <IconComponent 
        size={14} 
        className="transition-all duration-200"
        style={{ color: config.color }}
        strokeWidth={2}
      />
    </div>
  );
};

// Helper function to combine HTML, CSS, and JS into iframe preview content
export const generatePreviewSrcDoc = (files = []) => {
  if (!files || files.length === 0) return "";

  const htmlFile = files.find((f) => f.name.endsWith(".html"))?.content || "";
  const cssFile = files.find((f) => f.name.endsWith(".css"))?.content || "";
  const jsFile = files.find((f) => f.name.endsWith(".js"))?.content || "";

  // Inject CSS with better styling
  let combined = htmlFile;
  if (cssFile) {
    // Add brand color as CSS variable
    const enhancedCSS = `
      :root {
        --brand-color: #EB4C4C;
        --brand-hover: #D63F3F;
      }
      ${cssFile}
    `;
    
    if (combined.includes("</head>")) {
      combined = combined.replace("</head>", `<style>${enhancedCSS}</style></head>`);
    } else {
      combined = `<style>${enhancedCSS}</style>${combined}`;
    }
  }

  // Inject JS with error handling
  if (jsFile) {
    const enhancedJS = `
      // Error handling wrapper
      try {
        ${jsFile}
      } catch (error) {
        console.error('Runtime Error:', error);
        // Optionally display error in preview
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = 'position:fixed;bottom:10px;right:10px;background:#EB4C4C;color:white;padding:8px 12px;border-radius:8px;font-size:12px;font-family:monospace;z-index:9999;';
        errorDiv.textContent = '⚠️ ' + error.message;
        document.body.appendChild(errorDiv);
      }
    `;
    
    if (combined.includes("</body>")) {
      combined = combined.replace("</body>", `<script>${enhancedJS}</script></body>`);
    } else {
      combined += `<script>${enhancedJS}</script>`;
    }
  }

  return combined;
};

// Enhanced language detection with more languages and metadata
export const getLanguage = (filename = "") => {
  const ext = filename.split(".").pop()?.toLowerCase();
  
  const languageMap = {
    // Web
    html: { id: "html", label: "HTML", color: "#EB4C4C" },
    css: { id: "css", label: "CSS", color: "#3B82F6" },
    scss: { id: "scss", label: "SCSS", color: "#CC6699" },
    less: { id: "less", label: "LESS", color: "#1D365D" },
    
    // JavaScript/TypeScript
    js: { id: "javascript", label: "JavaScript", color: "#F59E0B" },
    jsx: { id: "jsx", label: "React JSX", color: "#61DAFB" },
    ts: { id: "typescript", label: "TypeScript", color: "#3178C6" },
    tsx: { id: "tsx", label: "React TSX", color: "#3178C6" },
    
    // Data
    json: { id: "json", label: "JSON", color: "#8B5CF6" },
    yaml: { id: "yaml", label: "YAML", color: "#CB171E" },
    yml: { id: "yaml", label: "YAML", color: "#CB171E" },
    xml: { id: "xml", label: "XML", color: "#8B5CF6" },
    
    // Backend
    py: { id: "python", label: "Python", color: "#3572A5" },
    java: { id: "java", label: "Java", color: "#B07219" },
    rb: { id: "ruby", label: "Ruby", color: "#701516" },
    go: { id: "go", label: "Go", color: "#00ADD8" },
    rs: { id: "rust", label: "Rust", color: "#DEA584" },
    
    // Databases
    sql: { id: "sql", label: "SQL", color: "#00758F" },
    
    // Markup
    md: { id: "markdown", label: "Markdown", color: "#083FA1" },
    markdown: { id: "markdown", label: "Markdown", color: "#083FA1" },
    
    // Default
    txt: { id: "text", label: "Text", color: "#6B7280" },
  };

  return languageMap[ext] || { id: "text", label: "Text", color: "#6B7280" };
};

// Additional helper for getting file extension badge
export const getFileBadge = (filename = "") => {
  const ext = filename.split(".").pop()?.toLowerCase() || "file";
  const lang = getLanguage(filename);
  
  return {
    extension: ext.toUpperCase(),
    color: lang.color,
    label: lang.label
  };
};

// Helper for formatting file size
export const formatFileSize = (bytes = 0) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};