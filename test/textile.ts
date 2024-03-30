import test from 'ava';
import fs from 'node:fs';
import { fromTextile } from '../src/index.js';

const textile = fs.readFileSync(new URL('./fixtures/test.textile', import.meta.url)).toString();
const html = fs.readFileSync(new URL('./fixtures/test.html', import.meta.url)).toString();

// Indentation is inconsistent, and image alt is repeated in image title
test.failing('reference doc', async t => {
  t.is(fromTextile(textile), html);
});
