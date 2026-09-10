import pptxgen from "pptxgenjs";

// Vibrant Modern Theme Palette
const THEME = {
  bgDark: "0F172A",      // Slate 900 (Hero & Closing Slides)
  bgLight: "FFFFFF",     // White (Standard Content Background)
  primary: "6366F1",     // Indigo 500
  primarySoft: "EEF2FF", // Indigo 50 (Badge BG)
  secondary: "EC4899",   // Pink 500
  accentTeal: "14B8A6",  // Teal 500
  tealSoft: "CCFBF1",    // Teal 50 (Badge BG)
  textDark: "0F172A",    // Dark Text
  textMuted: "64748B",   // Secondary Text
  textWhite: "FFFFFF",   // White Text
  cardBg: "FFFFFF",      // White Card Fill
  cardBorder: "E2E8F0",  // Light Card Border
};

// Canvas is 13.333" x 7.5" — every coordinate below assumes this.
const SLIDE_W = 13.333;
const SLIDE_H = 7.5;
const MARGIN = 0.6;

const FONT_HEAD = "Cambria";   // safe-list serif, ships with Office & renders true-to-width
const FONT_BODY = "Calibri";   // safe-list sans

export const generatePPT = async (pptData) => {
  const pptx = new pptxgen();

  // IMPORTANT: LAYOUT_16x9 is only 10" x 5.625". Use LAYOUT_WIDE (13.333" x 7.5")
  // to match the coordinate system used throughout this file.
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "OpenGPT";
  pptx.title = pptData.title || "Presentation";
  pptx.subject = pptData.subtitle || "Generated Presentation";

  // ==========================================
  // 1. HERO TITLE SLIDE
  // ==========================================
  const titleSlide = pptx.addSlide();
  titleSlide.background = { color: THEME.bgDark };

  // Pill Brand Badge
  titleSlide.addShape(pptx.ShapeType.roundRect, {
    x: MARGIN, y: 1.5, w: 2.3, h: 0.4, rectRadius: 0.2,
    fill: { color: "1E293B" },
    line: { color: THEME.primary, width: 0.8 }
  });

  titleSlide.addText("OPENGPT PRESENTATION", {
    x: MARGIN, y: 1.5, w: 2.3, h: 0.4, margin: 0,
    fontFace: FONT_BODY, fontSize: 9, bold: true, color: THEME.primary,
    align: "center", valign: "middle", isTextBox: true, charSpacing: 1
  });

  // Title
  titleSlide.addText(pptData.title || "Untitled Presentation", {
    x: MARGIN, y: 2.4, w: SLIDE_W - MARGIN * 2, h: 1.8,
    fontFace: FONT_HEAD, fontSize: 40, bold: true, color: THEME.textWhite,
    valign: "top", wrap: true, isTextBox: true
  });

  // Subtitle
  if (pptData.subtitle) {
    titleSlide.addText(pptData.subtitle, {
      x: MARGIN, y: 4.3, w: SLIDE_W - MARGIN * 2, h: 1.0,
      fontFace: FONT_BODY, fontSize: 16, color: "94A3B8",
      valign: "top", wrap: true, isTextBox: true
    });
  }

  // Footer
  titleSlide.addText("Created with OpenGPT AI Engine", {
    x: MARGIN, y: SLIDE_H - 0.55, w: 5, h: 0.3,
    fontFace: FONT_BODY, fontSize: 9, color: "475569", isTextBox: true
  });

  // ==========================================
  // 2. ADAPTIVE CONTENT SLIDES
  // ==========================================
  if (Array.isArray(pptData.slides)) {
    const totalSlides = pptData.slides.length;

    pptData.slides.forEach((slideData, slideIndex) => {
      const slide = pptx.addSlide();
      const isConclusion = slideIndex === totalSlides - 1 && totalSlides > 2;

      slide.background = { color: isConclusion ? THEME.bgDark : THEME.bgLight };

      // Header Section — plain bold title, no accent stripe
      if (slideData.title) {
        slide.addText(slideData.title, {
          x: MARGIN, y: 0.5, w: SLIDE_W - MARGIN * 2, h: 0.7,
          fontFace: FONT_HEAD, fontSize: 26, bold: true,
          color: isConclusion ? THEME.textWhite : THEME.textDark,
          valign: "middle", isTextBox: true
        });
      }

      // Render Dynamic Grid Cards
      if (Array.isArray(slideData.points) && slideData.points.length > 0) {
        renderAdaptiveCards(pptx, slide, slideData.points, isConclusion, slideIndex);
      }

      // Slide Footer
      slide.addText("OpenGPT", {
        x: MARGIN, y: SLIDE_H - 0.45, w: 3, h: 0.25,
        fontFace: FONT_BODY, fontSize: 9, color: isConclusion ? "64748B" : THEME.textMuted,
        isTextBox: true
      });

      slide.addText(`${slideIndex + 1} / ${totalSlides}`, {
        x: SLIDE_W - MARGIN - 1, y: SLIDE_H - 0.45, w: 1, h: 0.25,
        fontFace: FONT_BODY, fontSize: 9, color: isConclusion ? "64748B" : THEME.textMuted,
        align: "right", isTextBox: true
      });
    });
  }

  return await pptx.write({ outputType: "nodebuffer" });
};

// ==========================================
// ADAPTIVE LAYOUT ENGINE
// ==========================================
function renderAdaptiveCards(pptx, slide, points, isDark = false, slideIndex = 0) {
  const count = points.length;
  const startX = MARGIN;
  const startY = 1.5;
  const totalW = SLIDE_W - MARGIN * 2;
  const bottomY = SLIDE_H - 0.75; // leave room for footer
  const availH = bottomY - startY;

  // 1. THREE COLUMN CARDS
  if (count === 3) {
    const gap = 0.4;
    const cardW = (totalW - gap * 2) / 3;
    const cardH = availH;

    points.forEach((pointText, i) => {
      const x = startX + i * (cardW + gap);
      drawColumnCard(pptx, slide, x, startY, cardW, cardH, i + 1, pointText, isDark);
    });
  }
  // 2. TWO COLUMN SPLIT
  else if (count === 2) {
    const gap = 0.5;
    const cardW = (totalW - gap) / 2;
    const cardH = availH;

    points.forEach((pointText, i) => {
      const x = startX + i * (cardW + gap);
      drawColumnCard(pptx, slide, x, startY, cardW, cardH, i + 1, pointText, isDark);
    });
  }
  // 3. 2x2 QUADRANT GRID
  else if (count === 4) {
    const gapX = 0.5;
    const gapY = 0.35;
    const cardW = (totalW - gapX) / 2;
    const cardH = (availH - gapY) / 2;

    points.forEach((pointText, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = startX + col * (cardW + gapX);
      const y = startY + row * (cardH + gapY);
      drawRowCard(pptx, slide, x, y, cardW, cardH, i + 1, pointText, isDark);
    });
  }
  // 4. VERTICAL STACK FALLBACK (1 or 5+ Points)
  else {
    const gapY = 0.25;
    const cardH = Math.min(1.0, (availH - gapY * (count - 1)) / count);

    points.forEach((pointText, i) => {
      const y = startY + i * (cardH + gapY);
      drawRowCard(pptx, slide, startX, y, totalW, cardH, i + 1, pointText, isDark);
    });
  }
}

// Vertical Column Card (Used for 2 or 3 items)
function drawColumnCard(pptx, slide, x, y, w, h, index, text, isDark) {
  const isPrimary = index % 2 !== 0;
  const accentColor = isPrimary ? THEME.primary : THEME.accentTeal;
  const badgeBg = isPrimary ? THEME.primarySoft : THEME.tealSoft;

  // Card container — subtle fill + border, no edge stripe
  slide.addShape(pptx.ShapeType.roundRect, {
    x, y, w, h, rectRadius: 0.1,
    fill: { color: isDark ? "1E293B" : THEME.cardBg },
    line: { color: isDark ? "334155" : THEME.cardBorder, width: 1 },
    shadow: isDark ? undefined : {
      type: "outer", color: "1E293B", opacity: 0.12, blur: 6, offset: 2, angle: 90
    }
  });

  // Number Badge (colored circle icon — the deck's repeated motif)
  const badgeSize = 0.5;
  slide.addShape(pptx.ShapeType.ellipse, {
    x: x + 0.3, y: y + 0.3, w: badgeSize, h: badgeSize,
    fill: { color: badgeBg }
  });

  slide.addText(String(index), {
    x: x + 0.3, y: y + 0.3, w: badgeSize, h: badgeSize, margin: 0,
    fontFace: FONT_BODY, fontSize: 16, bold: true, color: accentColor,
    align: "center", valign: "middle", isTextBox: true
  });

  // Body Text
  const textContent = String(text);
  slide.addText(textContent, {
    x: x + 0.3, y: y + 1.0, w: w - 0.6, h: h - 1.3,
    fontFace: FONT_BODY, fontSize: 14,
    color: isDark ? THEME.textWhite : THEME.textDark,
    valign: "top", wrap: true, isTextBox: true, paraSpaceAfter: 6
  });
}

// Horizontal Row Card (Used for 4 items in a 2x2 grid or single-column fallback)
function drawRowCard(pptx, slide, x, y, w, h, index, text, isDark) {
  const isPrimary = index % 2 !== 0;
  const accentColor = isPrimary ? THEME.primary : THEME.accentTeal;
  const badgeBg = isPrimary ? THEME.primarySoft : THEME.tealSoft;

  // Card container — subtle fill + border, no edge stripe
  slide.addShape(pptx.ShapeType.roundRect, {
    x, y, w, h, rectRadius: 0.08,
    fill: { color: isDark ? "1E293B" : THEME.cardBg },
    line: { color: isDark ? "334155" : THEME.cardBorder, width: 1 }
  });

  // Number Badge
  const badgeSize = 0.45;
  const badgeY = y + (h - badgeSize) / 2;
  slide.addShape(pptx.ShapeType.ellipse, {
    x: x + 0.25, y: badgeY, w: badgeSize, h: badgeSize,
    fill: { color: badgeBg }
  });

  slide.addText(String(index), {
    x: x + 0.25, y: badgeY, w: badgeSize, h: badgeSize, margin: 0,
    fontFace: FONT_BODY, fontSize: 13, bold: true, color: accentColor,
    align: "center", valign: "middle", isTextBox: true
  });

  // Body Text
  const textContent = String(text);
  slide.addText(textContent, {
    x: x + 0.9, y: y + 0.1, w: w - 1.15, h: h - 0.2,
    fontFace: FONT_BODY, fontSize: 13,
    color: isDark ? THEME.textWhite : THEME.textDark,
    valign: "middle", wrap: true, isTextBox: true, paraSpaceAfter: 4
  });
}