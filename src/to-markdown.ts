import TurndownService from 'turndown';

// Currently does NOT parse tables, github flavored markdown, etc., correctly.

export interface ToMarkdownOptions extends TurndownService.Options {
  gfm?: boolean,
  highlightedCodeBlock?: boolean,
  strikethrough?: boolean,
  tables?: boolean,
  taskListItems?: boolean,
};

// See https://marked.js.org/demo and https://github.github.com/gfm/ 

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
