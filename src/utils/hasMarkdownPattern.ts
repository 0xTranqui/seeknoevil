export const hasMarkdownPattern = (text: string) => {
    const markdownPatterns = [
      /^#.*$/m, // Headers
      /\*\*.*\*\*/, // Bold
      /\*.*\*/, // Italic
      /!\[.*\]\(.*\)/, // Images
      /\[.*\]\(.*\)/, // Links
      /^>.*$/m, // Blockquotes
      /^- .*$/m, // Unordered lists
      /^\d+\. .*$/m, // Ordered lists
      /^```[\s\S]*```/m, // Fenced code blocks
      /^`.*`$/, // Inline code
    ];
    return markdownPatterns.some((pattern) => pattern.test(text));
};