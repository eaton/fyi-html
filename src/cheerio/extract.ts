import { toCheerio } from './to-cheerio.js';
import { z } from 'zod';

import {
  cheerioJsonMapper,
  JsonTemplate as ExtractTemplate,
  Options,
} from 'cheerio-json-mapper';

import { pipeFnMap } from './pipes.js';

export {
  type JsonTemplateObject as ExtractTemplateObject,
  type PipeFn as ExtractPipe,
  type PipeInput as ExtractPipeInput,
} from 'cheerio-json-mapper';

export interface ExtractOptions extends Options {
  xml?: boolean;
}

type ArrayOrSingle<T> = T extends [] ? Record<string, unknown>[] : Record<string, unknown>;
type ZodOrFallback<T, S extends z.ZodTypeAny> = S extends z.ZodUndefined ? ArrayOrSingle<T> : z.infer<S>;

/**
 * Uses cheerio to extract structured data from markup
 */
export async function extract<T extends ExtractTemplate, S extends z.ZodTypeAny = z.ZodUndefined>(
  input: string | Buffer,
  template: T,
  schema?: S,
  options: Partial<ExtractOptions> = {}
): Promise<ZodOrFallback<T, S>> {
  if (options) {
    options.pipeFns = { ...options.pipeFns, ...pipeFnMap};
  } else {
    options = { pipeFns: pipeFnMap };
  }
  const dom = toCheerio(input.toString(), { xml: options.xml, xmlMode: options.xml })(':root');

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return cheerioJsonMapper(dom, template, options)
    .then(output => schema ? schema.parse(output) :  output) as Promise<ZodOrFallback<T, S>>;
}
