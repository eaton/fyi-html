import yabbcode from 'ya-bbcode';

/**
 * Options to control the rendering of BBCode markup to HTML.
 * 
 * @see {@link https://www.bbcode.org/reference.php} for syntax guidelines.
 */
export interface FromBBCodeOptions extends Record<string, unknown> {
  /**
   * Convert single-line linebreaks to `<br \>`
   */
  newline?: boolean

  /**
   * Generate paragraph tags
   */
  paragraph?: boolean

  /**
   * Discard unmatched BBCode tags
   */
  cleanUnmatchable?: boolean

  /**
   * Clean up HTML after conversion
   */
  sanitizeHtml?: boolean,
}

/**
 * Parse BBCode text and return formatted HTML.
 * 
 * @see {@link https://www.bbcode.org/reference.php} for syntax guidelines.
 */
export function fromBbcode(input: string, options: FromBBCodeOptions = {}) {
  const opt = {
    newline: false,
    paragraph: true,
    ...options
  };

  const parser = new yabbcode(opt);

  parser.registerTag('li', { type: 'replace', open: '<li>', close: '</li>' });
  parser.registerTag('ol', { type: 'replace', open: '<ol>', close: '</ol>' });
  parser.registerTag('ul', { type: 'replace', open: '<ul>', close: '</ul>' });

  return parser.parse(input);
}