import { parse, MarkedOptions, MarkedExtension } from 'marked';
import TurndownService from 'turndown';

export interface ToMarkdownOptions extends TurndownService.Options {};
export interface FromMarkdownOptions extends MarkedOptions {};
export interface MarkdownExtension extends MarkedExtension {};

export function fromMarkdown(input: string, options: FromMarkdownOptions = {}) {
  const opt: FromMarkdownOptions = {
    gfm: true,
    breaks: true,
    ...options
  }
  return parse(input, options);
}

export function toMarkdown(input: string, options: ToMarkdownOptions = {}) {
  const turndownService = new TurndownService({
    hr: '---',
    emDelimiter: '*',
    headingStyle: 'atx',
    bulletListMarker: '-',
    codeBlockStyle: 'fenced',
    ...options,
  });
  return turndownService.turndown(input);
}
