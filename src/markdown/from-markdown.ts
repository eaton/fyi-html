import { parse, MarkedOptions, MarkedExtension, Marked } from 'marked';
import markedFootnote from 'marked-footnote'

export interface MarkdownFootnoteOptions {
  /**
   * The prefix ID for footnotes. Defaults to 'footnote-'.
   */
  prefixId?: string,

  /**
   * The description of footnotes, used by aria-labeledby attribute. Defaults to 'Footnotes'.
   */
  description?: string,

  /**
   * If set to true, it will place footnote reference in square brackets, like this: [1]. Defaults to false.
   */
  refMarkers?: boolean
}

export interface FromMarkdownOptions extends MarkedOptions {
  footnotes?: boolean | MarkdownFootnoteOptions,
  inline?: boolean,
};
export interface MarkdownExtension extends MarkedExtension {};

// See https://marked.js.org/demo and https://github.github.com/gfm/ 

export function fromMarkdown(input: string, options: FromMarkdownOptions = {}) {
  const opt: FromMarkdownOptions = {
    gfm: true,
    footnotes: true,
    breaks: true,
    ...options
  };

  const marked = new Marked();

  if (opt.footnotes) {
    if (opt.footnotes !== true) {
      marked.use(markedFootnote(opt.footnotes));
    } else {
      marked.use(markedFootnote());
    }
  } 
  
  if (opt.inline) {
    return marked.parseInline(input, opt);
  } else {
    return marked.parse(input, opt);
  }
}
