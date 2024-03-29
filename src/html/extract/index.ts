import { cheerioJsonMapper, JsonTemplateObject, Options } from 'cheerio-json-mapper';
import { z } from 'zod';
import { pipeFnMap } from './pipes.js';

export { type JsonTemplateObject } from 'cheerio-json-mapper';

/**
 * Uses cheerio to extract structured data from markup
 */
export async function extract<T extends z.ZodTypeAny>(
  input: string | Buffer,
  template: JsonTemplateObject | JsonTemplateObject[],
  schema: T,
  options: Partial<Options> = {}
): Promise<z.infer<T>> {

  if (options) {
    options.pipeFns = { ...options.pipeFns, ...pipeFnMap};
  } else {
    options = { pipeFns: pipeFnMap };
  }
  
  return cheerioJsonMapper(input.toString(), template, options)
    .then(results => schema.parse(results))
}
