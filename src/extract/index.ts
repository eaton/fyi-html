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
  Options as ExtractOptions,
  PipeFn as ExtractPipe,
  PipeInput as ExtractPipeInput,
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

  return cheerioJsonMapper(input.toString(), template, options)
    .then(results => (schema ?? parsingSchema).parse(results))
}
