import { toCheerio } from './to-cheerio.js';
import * as cheerio from 'cheerio';

import {
  cheerioJsonMapper,
  JsonTemplateObject as ExtractTemplateObject,
  JsonTemplate as ExtractTemplate,
  Options as ExtractOptions,
} from 'cheerio-json-mapper';

import { z } from 'zod';
import { pipeFnMap } from './pipes.js';

export {
  type JsonTemplateObject as ExtractTemplateObject,
  type JsonTemplate as ExtractTemplate,
  type PipeFn as ExtractPipe,
  type Options as ExtractOptions,
  type PipeInput as ExtractPipeInput,
} from 'cheerio-json-mapper';

/**
 * Uses cheerio to extract structured data from markup
 */
export async function extractAndParse<T extends ExtractTemplate, S extends z.ZodTypeAny>(
  input: string | Buffer,
  template: T,
  schema: S,
  options: Partial<ExtractOptions> = {}
): Promise<z.infer<S>> {
  if (options) {
    options.pipeFns = { ...options.pipeFns, ...pipeFnMap};
  } else {
    options = { pipeFns: pipeFnMap };
  }

  return cheerioJsonMapper(input.toString(), template, options)
    .then(results => (schema).parse(results)) as Promise<z.infer<S>>
}

/**
 * Uses cheerio to to extract data from markup, with XML parsing rules
 */
export async function extractAndParseXml<T extends ExtractTemplate, S extends z.ZodTypeAny>(
  input: string | Buffer,
  template: T,
  schema: S,
  options: Partial<ExtractOptions> = {}
): Promise<z.infer<S>> {
  if (options) {
    options.pipeFns = { ...options.pipeFns, ...pipeFnMap};
  } else {
    options = { pipeFns: pipeFnMap };
  }

  const dom = toCheerio(input.toString(), { xml: true, xmlMode: true })(':root');

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return cheerioJsonMapper(dom, template, options)
    .then(results => (schema).parse(results)) as Promise<z.infer<S>>
}
