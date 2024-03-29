import TurndownService from 'turndown';

/**
 * Options to control the rendering of Markdown markup to HTML.
 * 
 * @see {@link https://marked.js.org/demo} for syntax and rendering demo.
 * @see {@link https://github.github.com/gfm/} for Github-Flavored Markdown documentation.
 */
export interface ToMarkdownOptions extends TurndownService.Options {
  gfm?: boolean,
  highlightedCodeBlock?: boolean,
  strikethrough?: boolean,
  tables?: boolean,
  taskListItems?: boolean,
};

/**
 * Parse Markdown text and return formatted HTML.
 * 
 * @see {@link https://marked.js.org/demo} for syntax and rendering demo.
 * @see {@link https://github.github.com/gfm/} for Github-Flavored Markdown documentation.
 */
export function toMarkdown(input: string, options: ToMarkdownOptions = {}) {
  const turndownService = new TurndownService({
    hr: '---',
    emDelimiter: '*',
    headingStyle: 'atx',
    bulletListMarker: '-',
    codeBlockStyle: 'fenced',
    ...options,
  });
  
  // if (options.gfm) turndownService.use(gfm)

  return turndownService.turndown(input);
}
