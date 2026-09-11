export const chunkText = (
  text,
  maxLength = 800,
  overlap = 100
) => {
  const cleanText = text.replace(/\s+/g, " ").trim();

  if (!cleanText) {
    return [];
  }

  const chunks = [];
  let start = 0;

  while (start < cleanText.length) {
    let end = Math.min(
      start + maxLength,
      cleanText.length
    );

    // Avoid cutting a word in half
    if (end < cleanText.length) {
      const lastSpace = cleanText.lastIndexOf(" ", end);

      if (lastSpace > start) {
        end = lastSpace;
      }
    }

    const chunk = cleanText.slice(start, end).trim();

    if (chunk) {
      chunks.push(chunk);
    }

    if (end >= cleanText.length) {
      break;
    }

    // Keep overlap, but start from a complete word
    start = Math.max(
      0,
      end - overlap
    );

    const nextSpace = cleanText.indexOf(" ", start);

    if (nextSpace !== -1 && nextSpace < end) {
      start = nextSpace + 1;
    }
  }

  return chunks;
};