import * as entities from 'entities';
import { linkify } from '../linkify.js';

export interface FromTextOptions {
  /**
   * Encode entities
   *
   * @defaultValue: 'utf8'
   */
  entities?: 'xml' | 'utf8' | 'html' | false;

  /**
   * Treat double-linefeeds (or any run of 2+ linefeeds) as paragraph separators
   *
   * @defaultValue: true
   */
  paragraphs?: boolean;
  
  /**
   * Turn URLs in the text into clickable links
   *
   * @defaultValue: true
   */
  urls?: boolean;
}

/**
 * Extremely simple conversion of plaintext to HTML:
 *
 * - Special characters are encoded
 * - Multiple sequential newlines are treated as paragraph separators
 *
 * For formatting or more complex structures, something like markdown makes a lot
 * more sense. Notably, single linebreaks are NOT converted to `<br/>` tags, as
 * was sometimes done in the olden days of internet text. We may add that option
 * eventually, but for now, yuck.
 */
export function fromText(text: string, options: FromTextOptions = {}) {
  const opt: FromTextOptions = {
    entities: 'utf8',
    paragraphs: true,
    ...options,
  };
  let output = text;

  switch (opt.entities) {
    case 'utf8':
      output = entities.escapeUTF8(output);
      break;
    case 'html':
      output = entities.encodeNonAsciiHTML(output);
      break;
    case 'xml':
      output = entities.encodeXML(output);
      break;
  }

  if (opt.paragraphs) {
    output = output
      .split(/(\s*\n){2,}/g) // split on multiple linebreaks
      .filter((t) => t.trim().length > 0) // filter blank lines
      .map((t) => '<p>' + t + '</p>') // wrap in paragraph tags
      .join('\n'); // join with single linebreaks
  }

  if (opt.urls) {
    output = linkify(output);
  }

  return output;
}
