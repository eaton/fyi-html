import pkg from 'textile-js';
const { parse } = pkg;

export function fromTextile(input: string) {
  return parse(input);
}