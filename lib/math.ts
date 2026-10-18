import katex from 'katex';

const ESC: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ESC[c]);

// Renders our own content strings ("text $math$ text") to HTML on the server. Never pass student text here.
export function renderMath(text: string): string {
  return text
    .split('$')
    .map((seg, i) => (i % 2 ? katex.renderToString(seg, { throwOnError: false }) : esc(seg)))
    .join('');
}
