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
  
  // All this just to make list item indentation correct.
  // @see {@link https://github.com/mixmark-io/turndown/blob/master/src/commonmark-rules.js}
  // for the original code.
  turndownService.addRule('listItem', {
    filter: 'li',
    replacement: (content, node, options) => {
      content = content
      .replace(/^\n+/, '') // remove leading newlines
      .replace(/\n+$/, '\n') // replace trailing newlines with just a single one
      .replace(/\n/gm, '\n    ') // indent
      var prefix = options.bulletListMarker + ' '
      var parent = node.parentNode
      if (parent.nodeName === 'OL') {
        var start = parent.getAttribute('start')
        var index = Array.prototype.indexOf.call(parent.children, node)
        prefix = (start ? Number(start) + index : index + 1) + '. '
      }
      return (
        prefix + content + (node.nextSibling && !/\n$/.test(content) ? '\n' : '')
      )
    }
  });

  return turndownService.turndown(input);
}
