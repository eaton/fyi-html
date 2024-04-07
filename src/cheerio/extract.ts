import { toCheerio } from './to-cheerio.js';
import * as cheerio from 'cheerio';

import {
  cheerioJsonMapper,
  JsonTemplateObject as ExtractTemplateObject,
  JsonTemplate as ExtractTemplate,
  Options as ExtractOptions
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

type MappedReturn<T extends string | ExtractTemplateObject[] | ExtractTemplate, S> =
  (T extends string ? unknown : (T extends ExtractTemplateObject[] ? S[] : S));

const fallbackSchema = z.record(z.unknown());

/**
 * Uses cheerio to extract structured data from markup
 */
export async function extract<T extends string | ExtractTemplate, S extends z.ZodTypeAny = typeof fallbackSchema>(
  input: string | Buffer,
  template: T,
  schema?: S,
  options: Partial<ExtractOptions> = {}
): Promise<MappedReturn<T, z.infer<S>>> {
  if (options) {
    options.pipeFns = { ...options.pipeFns, ...pipeFnMap};
  } else {
    options = { pipeFns: pipeFnMap };
  }

  const parsingSchema = schema ?? (Array.isArray(template) ? z.array(fallbackSchema) : fallbackSchema);
  return cheerioJsonMapper(input.toString(), template, options).then(results => (schema ?? parsingSchema).parse(results))
}

/**
 * Uses cheerio to to extract data from markup, with XML parsing rules
 */
export async function extractXml<T extends string | ExtractTemplate, S extends z.ZodTypeAny = typeof fallbackSchema>(
  input: string | Buffer,
  template: T,
  schema?: S,
  options: Partial<ExtractOptions> = {}
): Promise<MappedReturn<T, z.infer<S>>> {
  if (options) {
    options.pipeFns = { ...options.pipeFns, ...pipeFnMap};
  } else {
    options = { pipeFns: pipeFnMap };
  }

  const parsingSchema = schema ?? (Array.isArray(template) ? z.array(fallbackSchema) : fallbackSchema);
  const dom = toCheerio(input.toString(), { xml: true, xmlMode: true })(':root');

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return cheerioJsonMapper(dom, template, options).then(results => (schema ?? parsingSchema).parse(results))
}
