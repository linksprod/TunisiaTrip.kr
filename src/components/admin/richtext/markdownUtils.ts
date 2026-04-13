import { sanitizeHTML } from '@/utils/sanitize';

/**
 * Converts markdown text to HTML for the preview mode
 */
export const renderMarkdownToHTML = (markdown: string): { __html: string } => {
  if (!markdown) return { __html: '' };
  
  let html = markdown;
  
  // Convert headings
  html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
  html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  
  // Convert bold and italic
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Convert quotes
  html = html.replace(/^\> (.*$)/gm, '<blockquote><p>$1</p></blockquote>');
  
  // Convert links (but not images)
  html = html.replace(/(^|[^!])\[(.*?)\]\((.*?)\)/g, '$1<a href="$3" target="_blank" rel="noopener noreferrer">$2</a>');
  
  // Convert images
  html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<img alt="$1" src="$2" class="editor-image max-w-full h-auto rounded-lg shadow-sm my-4 mx-auto block" loading="lazy">');
  
  // Convert lists
  html = html.replace(/^\- (.*$)/gm, '<li>$1</li>');
  html = html.replace(/^\d+\. (.*$)/gm, '<li>$1</li>');
  
  // Wrap list items
  html = html.replace(/(<li>.*<\/li>)/gs, (match) => {
    return `<ul>${match}</ul>`;
  });
  
  // Handle paragraphs - split by double newlines and process each section
  const sections = html.split(/\n\s*\n/);
  html = sections.map(section => {
    const trimmed = section.trim();
    if (!trimmed) return '';
    
    // Don't wrap block elements in paragraphs
    if (trimmed.match(/<(h[1-6]|ul|ol|li|blockquote|img|div|hr)/)) {
      return trimmed;
    }
    
    // Convert single newlines to <br> within paragraphs
    const withBreaks = trimmed.replace(/\n/g, '<br>');
    return `<p>${withBreaks}</p>`;
  }).filter(p => p).join('\n\n');
  
  return { __html: html };
};

/**
 * Converts markdown text to sanitized HTML (XSS-safe)
 * Use this for user-generated content
 */
export const renderSafeMarkdownToHTML = (markdown: string): { __html: string } => {
  const result = renderMarkdownToHTML(markdown);
  return { __html: sanitizeHTML(result.__html) };
};

/**
 * Formats selected text with the specified formatting tag
 */
export const formatSelectedText = (
  formatTag: string,
  selectedText: string,
): string => {
  switch (formatTag) {
    case 'bold':
      return `**${selectedText || 'Bold text'}**`;
    case 'italic':
      return `*${selectedText || 'Italic text'}*`;
    case 'underline':
      return `<u>${selectedText || 'Underlined text'}</u>`;
    case 'h1':
      return `\n# ${selectedText || 'Heading 1'}\n\n`;
    case 'h2':
      return `\n## ${selectedText || 'Heading 2'}\n\n`;
    case 'h3':
      return `\n### ${selectedText || 'Heading 3'}\n\n`;
    case 'list':
      return selectedText ? 
        `\n- ${selectedText.split('\n').join('\n- ')}\n\n` : 
        `\n- List item\n\n`;
    case 'ordered-list':
      return selectedText ? 
        `\n1. ${selectedText.split('\n').join('\n1. ')}\n\n` : 
        `\n1. List item\n\n`;
    case 'center':
      return `\n<div style="text-align: center;">${selectedText || 'Centered text'}</div>\n\n`;
    case 'right':
      return `\n<div style="text-align: right;">${selectedText || 'Right-aligned text'}</div>\n\n`;
    case 'quote':
      return selectedText ? 
        `\n> ${selectedText.split('\n').join('\n> ')}\n\n` : 
        `\n> Blockquote\n\n`;
    case 'link':
      return `[${selectedText || 'Link text'}](https://example.com)`;
    case 'image':
      return `\n![${selectedText || 'Image description'}](https://example.com/image.jpg)\n\n`;
    case 'line-break':
      return '\n\n';
    case 'horizontal-rule':
      return '\n\n---\n\n';
    default:
      return selectedText;
  }
}
