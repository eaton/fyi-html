import textile from 'textile-js';
const parse = textile;

/**
 * Options to control the rendering of Textile markup to HTML.
 * 
 * @see {@link http://borgar.github.io/textile-js/} for syntax guidelines.
 */
export interface FromTextileOptions extends Record<string, unknown> {
  /**
   * Convert single-line linebreaks to `<br \>`
   */
  breaks?: boolean
}

/**
 * Parse Textile text and return formatted HTML.
 * 
 * @see {@link http://borgar.github.io/textile-js/} for syntax guidelines.
 */
export function fromTextile(input: string, options: FromTextileOptions = {}) {
  const opt: FromTextileOptions = { breaks: false, ...options };
  return parse(input, opt) as string;
}