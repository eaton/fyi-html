import { cheerioJsonMapper, JsonTemplateObject, JsonTemplate, Options } from 'cheerio-json-mapper';
import { z } from 'zod';
import { pipeFnMap } from './pipes.js';

export { type JsonTemplateObject, type JsonTemplate } from 'cheerio-json-mapper';

type MappedReturn<T extends string | JsonTemplateObject[] | JsonTemplateObject, S> =
  (T extends string ? unknown : (T extends JsonTemplateObject[] ? S[] : S));

const fallbackSchema = z.record(z.unknown());

/**
 * Uses cheerio to extract structured data from markup
 */
export async function extract<T extends string | JsonTemplate, S extends z.ZodTypeAny = typeof fallbackSchema>(
  input: string | Buffer,
  template: T,
  schema?: S,
  options: Partial<Options> = {}
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
