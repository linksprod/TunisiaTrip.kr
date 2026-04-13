export function stripMarkdown(markdown: string): string {
  if (!markdown) return '';
  
  return markdown
    // Remove headers
    .replace(/#{1,6}\s+/g, '')
    // Remove bold and italic
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    // Remove links
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    // Remove images
    .replace(/!\[([^\]]*)\]\([^\)]+\)/g, '$1')
    // Remove blockquotes
    .replace(/>\s+/g, '')
    // Remove horizontal rules
    .replace(/---/g, '')
    // Remove list markers
    .replace(/^\s*[-\*\+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    // Clean up extra whitespace
    .replace(/\n\s*\n/g, '\n')
    .trim();
}