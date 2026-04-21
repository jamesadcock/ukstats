/**
 * Converts inline markdown links ([text](url)) to HTML anchor tags.
 * Intended only for trusted, internal content — not user-supplied input.
 */
export function parseInlineMarkdown(text: string): string {
  return text.replace(
    /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
    '<a href="$2" class="underline underline-offset-2 hover:text-indigo-600 transition-colors" target="_blank" rel="noopener noreferrer">$1</a>',
  );
}
