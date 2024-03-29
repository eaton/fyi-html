import * as cheerio from 'cheerio';

export type CheerioInput = Parameters<typeof cheerio.load>[0];

/**
 * A simple wrapper for Cheerio's `load` function
 */
export function toCheerio(
  content: CheerioInput,
  options?: cheerio.CheerioOptions,
  isDocument?: boolean,
) {
  return cheerio.load(content, options, isDocument);
}
