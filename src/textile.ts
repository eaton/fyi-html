import pkg from 'textile-js';
const { parse } = pkg;

// See http://borgar.github.io/textile-js/

export interface FromTextileOptions extends Record<string, unknown> {
  /**
   * Convert single-line linebreaks to `<br \>`
   */
  breaks?: boolean
}

export function fromTextile(input: string, options: FromTextileOptions = {}) {
  const opt: FromTextileOptions = { breaks: false, ...options };
  return parse(input, opt);
}