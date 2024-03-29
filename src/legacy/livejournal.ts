/**
 * Livejournal and its forked derivatives (most notably dreamwidth)
 * supported a handful of custom tags.
 *
 * In particular, a number of variations on the lj-cut tag are supported;
 * while this interperetation of tag behavior doesn't make a lot of sense
 * according to the HTML spec, it is an attempt to faithfully reproduce
 * the way the `<lj-cut>` tag actually behaved on the service. Such is life.
 *
 * @see {@link https://github.com/apparentlymart/livejournal/blob/master/t/cleaner-ljtags.t | Livejournal's old codebase} for details.
 * 
 * pre <lj-cut> hidden
 * pre <lj-cut text="text"> hidden
 *
 * pre <lj-cut /> hidden
 * pre <lj-cut text="text" /> hidden
 *
 * pre <lj-cut></lj-cut> hidden
 * pre <lj-cut text="text"></lj-cut> hidden
 *
 * pre <lj-cut>hidden</lj-cut> post
 * pre <lj-cut text="text">hidden</lj-cut> post
 */

/**
 * Options to control the rendering of Livejournal custom markup to HTML.
 */
export interface FromLivejournalOptions extends Record<string, unknown> {
  /**
   * Convert double-linebreaks into `<p>` tags
   */
  breaks?: boolean,

  /**
   * Only return the teaser portion of posts with `<lj-cut>` tags
   */
  teaser?: boolean,

  /**
   * Convert `<lj-user>` tags to `<a>` tags.
   */
  usernames?: boolean

  /**
   * Clean up HTML after conversion
   */
  sanitizeHtml?: boolean,
}

/**
 * Parse the contents of a Livejournal post and return formatted HTML.
 * 
 * @see {@link https://www.bbcode.org/reference.php} for syntax guidelines.
 */
export function fromLivejournal(html: string, options: FromLivejournalOptions = {}) {
  const opt = { usernames: true, sanitizeHtml: true, ...options };
  let output = '';

  if (opt.teaser) {
    output = cutTeaser(html);
  } else {
    output = cutBody(html);
  }

  if (opt.usernames) {
    output = userToLink(output);
  }

  return output;
}

const patterns = {
  user: /<lj user=['"]?(\w*)['"]?[^>]*>/gi,
  cutWrapper: /<lj-cut\s+text=['"]?([^'">]*)['"]?>(.+)<\/lj-cut>/gi, // <lj-cut text="cut text">Hidden content</lj-cut>
  cutWrapperNoText: /<lj-cut[^>]*>(.+)<\/lj-cut>/gi, // <lj-cut>Hidden content</lj-cut>
  cutClosed: /<lj-cut\s+text=['"]?([^'">]*)['"]?[^>]*><\/lj-cut>/gi, // <lj-cut text="cut text"></lj-cut>
  cutClosedNoText: /<lj-cut[^>]*><\/lj-cut>/gi, // <lj-cut></lj-cut>
  cutSelfClosing: /<lj-cut\s+text=['"]?([^'">]*)['"]?[^>]*>/gi, // <lj-cut text="cut text">
  cutSelfClosingNoText: /<lj-cut[^>]*>/gi, // <lj-cut>
};

/**
 * Generate an entry teaser from an entry with lj-cut tags.
 *
 * There are a couple of permutations that make handling cut tags in an
 * output-agnostic manner difficult;
 */
function cutTeaser(html: string) {
  const wrapperReplacement = '<span class="lj-cut">$1</span>';
  const wrapperNoTextReplacement = '<span class="lj-cut" />';
  const placeholder = '\ufeff';

  return html
    .replace(patterns.cutWrapper, wrapperReplacement) // Replace wrapper with text
    .replace(patterns.cutWrapperNoText, wrapperNoTextReplacement + placeholder) // Replace wrapper with text
    .replace(patterns.cutSelfClosing, wrapperReplacement + placeholder) // Replace breaker with placeholder
    .replace(patterns.cutClosedNoText, wrapperNoTextReplacement + placeholder) // Replace annotated breaker with text & placeholder
    .replace(patterns.cutClosed, wrapperReplacement + placeholder) // Replace annotated breaker with text & placeholder
    .replace(patterns.cutSelfClosingNoText, wrapperNoTextReplacement + placeholder) // Replace breaker with placeholder
    .split(placeholder)[0]; // Discard post-placeholder text
}

type CutResults = {
  /**
   * Event markup appearing before the lj-cut tag. If no cut tag is used,
   * only this value will be populated.
   */
  pre?: string;

  /**
   * The custom cut text entered by the event's author.
   */
  text?: string;

  /**
   * The event content hidden by the `lj-cut` tag. In most cases, this will be
   * the remainder of the event but there may be additional un-hidden text after
   * the cut.
   */
  hidden?: string;

  /**
   * Any event markup appearing after the `<lj-cut>` tag is closed.
   */
  post?: string;
};

function processCutTag(html: string) {
  const output: CutResults = {};
  return output;
}

/**
 * Generate an full post body from an entry with lj-cut tags.
 */
function cutBody(html: string) {
  const wrapperReplacement = '<span class="lj-uncut">$1</span>';
  const wrapperNoTextReplacement = '<span class="lj-uncut" />';

  return html
    .replace(patterns.cutWrapperNoText, wrapperReplacement) // Remove cut wrapper
    .replace(patterns.cutClosedNoText, wrapperNoTextReplacement) // Remove cut breaker
    .replace(patterns.cutSelfClosingNoText, wrapperNoTextReplacement); // Remove cut breaker
}

/**
 * Replace `<lj user="username" />` tags with classed a tags.
 */
function userToLink(html: string, replacement?: string) {
  replacement ??= `<a class="lj-user" href="https://livejournal.com/users/$1">$1</a>`;
  return html.replaceAll(patterns.user, replacement);
}
