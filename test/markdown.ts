import test from 'ava';
import fs from 'node:fs';
import { fromMarkdown, toMarkdown } from '../src/index.js';

const md = fs.readFileSync(new URL('./fixtures/test.md', import.meta.url)).toString();
const html = fs.readFileSync(new URL('./fixtures/test.html', import.meta.url)).toString();

test('markdown rendering', async t => {
  t.is(await fromMarkdown(md), html);
});

test('markdown generation', t => {
  t.is(toMarkdown(html).trim(), md.trim());
});