import { cheerioJsonMapper, JsonTemplateObject, Options } from 'cheerio-json-mapper';
import { z } from 'zod';
import { pipeFnMap } from './pipes.js';

export { JsonTemplateObject } from 'cheerio-json-mapper';

const fallBackSchema = z.record(z.unknown());

/**
 * Uses cheerio to extract structured data from markup
 */
export async function extract(
  input: string | Buffer,
  template: JsonTemplateObject,
  schema: z.ZodTypeAny = fallBackSchema,
  options: Partial<Options> = {}
): Promise<z.SafeParseReturnType<z.infer<typeof schema>,z.infer<typeof schema>>> {

  if (options) {
    options.pipeFns = { ...options.pipeFns, ...pipeFnMap};
  } else {
    options = { pipeFns: pipeFnMap };
  }
  
  return cheerioJsonMapper(input.toString(), template, options)
    .then(results => schema.safeParse(results))
}
