import test from 'ava';
import fs from 'node:fs';
import { fromMarkdown, toMarkdown } from '../src/index.js';

const md = fs.readFileSync(new URL('./fixtures/test.md', import.meta.url)).toString();
const html = fs.readFileSync(new URL('./fixtures/test.html', import.meta.url)).toString();

test('reference doc', async t => {
  t.is(fromMarkdown(md), html);
});

test('reference doc roundtrip', t => {
  t.is(toMarkdown(html).trim(), md.trim());
});

test('inline markdown', t => {
  t.is(
    fromMarkdown(`Short **strong** *emphasized* text with [a link](https://example.com)`, { inline: true }),
    'Short <strong>strong</strong> <em>emphasized</em> text with <a href="https://example.com">a link</a>'
  );
});