import PDFDocument from "pdfkit";

// Vibrant Modern Theme Palette
const THEME = {
  primary: "#6366F1",     // Indigo
  secondary: "#EC4899",   // Rose Pink
  accentTeal: "#14B8A6",  // Bright Teal
  darkBg: "#0F172A",      // Dark Slate Header
  cardBg: "#F8FAFC",      // Light Card Background
  cardBorder: "#E2E8F0",  // Card Border
  textDark: "#0F172A",    // Primary Text
  textMuted: "#64748B",   // Subtitle & Secondary Text
  textWhite: "#FFFFFF",   // White Text
};

export const generatePDF = (pdfData) => {
  return new Promise((resolve, reject) => {
    try {
      // 1. Initialize Document
      const doc = new PDFDocument({
        size: "A4",
        margin: 40,
        bufferPages: true,
        info: {
          Title: pdfData.title || "Document",
          Author: "OpenGPT",
          Creator: "OpenGPT Agent System",
        },
      });

      const chunks = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", (err) => reject(err));

      const pageWidth = doc.page.width;
      const pageHeight = doc.page.height;
      const margin = 40;
      const contentWidth = pageWidth - margin * 2;
      const maxY = pageHeight - margin - 15; // Safe bottom boundary for body content

      // Helper function to handle page breaks cleanly
      const ensureSpace = (requiredSpace) => {
        if (doc.y + requiredSpace > maxY) {
          doc.addPage();
          doc.y = margin;
        }
      };

      // ==========================================
      // 1. HEADER BANNER (Top Section, page 1 only)
      // ==========================================
      const bannerHeight = 120;

      doc.rect(0, 0, pageWidth, bannerHeight).fill(THEME.darkBg);

      // Category / Brand Pill Badge
      doc.roundedRect(margin, 24, 140, 22, 5).fill("#1E293B");
      doc
        .fillColor(THEME.primary)
        .fontSize(8)
        .font("Helvetica-Bold")
        .text("OPENGPT DOCUMENT", margin + 10, 31, {
          width: 120,
          align: "center",
          lineBreak: false,
        });

      // Main Document Title
      doc
        .fillColor(THEME.textWhite)
        .fontSize(22)
        .font("Helvetica-Bold")
        .text(pdfData.title || "Untitled Document", margin, 58, {
          width: contentWidth,
          height: 28,
          ellipsis: true,
        });

      // Subtitle
      if (pdfData.subtitle) {
        doc
          .fillColor("#94A3B8")
          .fontSize(11)
          .font("Helvetica")
          .text(pdfData.subtitle, margin, 90, {
            width: contentWidth,
            height: 24,
            ellipsis: true,
          });
      }

      // Set starting Y position below banner
      doc.y = bannerHeight + 24;

      // ==========================================
      // 2. SECTIONS & CARDS
      // ==========================================
      if (Array.isArray(pdfData.sections)) {
        pdfData.sections.forEach((section) => {
          // Check boundary before rendering Section Heading
          if (section.heading) {
            ensureSpace(30);
            const currentY = doc.y;

            // Heading Text — no accent stripe, bold serif-weight heading is enough
            doc
              .fillColor(THEME.textDark)
              .fontSize(14)
              .font("Helvetica-Bold")
              .text(section.heading, margin, currentY, {
                width: contentWidth,
                lineBreak: false,
              });

            doc.y = currentY + 24;
          }

          // Section Points as Cards
          if (Array.isArray(section.points)) {
            section.points.forEach((point, pIdx) => {
              const textWidth = contentWidth - 52; // Left badge + internal paddings
              const lineGap = 3;
              const fontSize = 10;
              const fontName = "Helvetica";

              // Set font first to calculate string height accurately
              doc.font(fontName).fontSize(fontSize);

              const textHeight = doc.heightOfString(point, {
                width: textWidth,
                lineGap: lineGap,
              });

              const cardHeight = Math.max(textHeight + 16, 32);

              // Check if entire card fits on current page
              ensureSpace(cardHeight + 8);

              const pointY = doc.y;

              // Card Outer Box
              doc
                .roundedRect(margin, pointY, contentWidth, cardHeight, 6)
                .fillAndStroke(THEME.cardBg, THEME.cardBorder);

              // Circular Bullet Number Badge
              const badgeSize = 18;
              const badgeY = pointY + (cardHeight - badgeSize) / 2;

              doc
                .circle(margin + 18, badgeY + badgeSize / 2, badgeSize / 2)
                .fill(pIdx % 2 === 0 ? "#EEF2FF" : "#CCFBF1");

              doc
                .fillColor(pIdx % 2 === 0 ? THEME.primary : THEME.accentTeal)
                .fontSize(9)
                .font("Helvetica-Bold")
                .text(String(pIdx + 1), margin + 9, badgeY + 4, {
                  width: 18,
                  align: "center",
                  lineBreak: false,
                });

              // Point Text
              const textY = pointY + (cardHeight - textHeight) / 2;
              doc
                .fillColor(THEME.textDark)
                .fontSize(fontSize)
                .font(fontName)
                .text(point, margin + 42, textY, {
                  width: textWidth,
                  lineGap: lineGap,
                });

              // Explicitly position doc.y for the next card
              doc.y = pointY + cardHeight + 8;
            });

            doc.y += 10; // Space between sections
          }
        });
      }

      // ==========================================
      // 3. DYNAMIC MULTI-PAGE FOOTER & NUMBERS
      // ==========================================
      const range = doc.bufferedPageRange();

      for (let i = range.start; i < range.start + range.count; i++) {
        doc.switchToPage(i);

        const footerY = pageHeight - 35;

        // CRITICAL FIX: pdfkit auto-inserts a new page whenever text is drawn
        // inside the document's bottom margin band. The footer lives at
        // pageHeight - 35, which is *inside* the default 40pt bottom margin,
        // so every footer draw was silently creating an extra blank page.
        // Temporarily zero the bottom margin while stamping the footer, then
        // restore it so body-content pagination (ensureSpace) is unaffected.
        const originalBottomMargin = doc.page.margins.bottom;
        doc.page.margins.bottom = 0;

        // Footer Horizontal Divider
        doc
          .strokeColor(THEME.cardBorder)
          .lineWidth(0.8)
          .moveTo(margin, footerY - 8)
          .lineTo(pageWidth - margin, footerY - 8)
          .stroke();

        // Footer Left Text
        doc
          .fillColor(THEME.textMuted)
          .fontSize(8)
          .font("Helvetica-Bold")
          .text("Generated by OpenGPT", margin, footerY, { lineBreak: false });

        // Footer Right Page Numbering
        doc
          .fillColor(THEME.textMuted)
          .fontSize(8)
          .font("Helvetica")
          .text(
            `Page ${i + 1} of ${range.count}`,
            pageWidth - margin - 100,
            footerY,
            { width: 100, align: "right", lineBreak: false }
          );

        doc.page.margins.bottom = originalBottomMargin;
      }

      // End PDF Stream
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};