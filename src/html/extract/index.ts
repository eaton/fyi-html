import { cheerioJsonMapper, JsonTemplateObject, PipeFn, Options } from 'cheerio-json-mapper';
import { pipeFnMap } from './pipes.js';
import { z } from 'zod';
type MapperOptions = Parameters<typeof cheerioJsonMapper>[2];
const fallBackSchema = z.record(z.unknown());

export { JsonTemplateObject, PipeFn } from 'cheerio-json-mapper'

/**
 * Uses cheerio to extract structured data from markup
 */
export async function parse(
  input: string | Buffer,
  template: JsonTemplateObject,
  schema: z.ZodTypeAny = fallBackSchema,
  options: MapperOptions = {}
): Promise<z.SafeParseReturnType<z.infer<typeof schema>,z.infer<typeof schema>>> {

  if (options) {
    options.pipeFns = { ...options.pipeFns, ...pipeFnMap};
  } else {
    options = { pipeFns: pipeFnMap };
  }
  
  return cheerioJsonMapper(input.toString(), template, options)
    .then(results => schema.safeParse(results))
}
