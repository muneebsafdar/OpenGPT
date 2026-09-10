import { useState } from "react";

export const ImageItem = ({ src, idx, onClick }) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  if (hasError) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative aspect-square overflow-hidden rounded-xl border border-border/60 bg-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
    >
      {!isLoaded && (
        <div className="absolute inset-0 animate-pulse bg-muted-foreground/10" />
      )}
      <img
        src={src}
        alt={`Attachment ${idx + 1}`}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`h-full w-full object-cover transition-all duration-200 group-hover:scale-105 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </button>
  );
};