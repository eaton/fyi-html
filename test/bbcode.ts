import test from 'ava';
import fs from 'node:fs';
import { fromBbcode } from '../src/index.js';

const bbcode = fs.readFileSync(new URL('./fixtures/test.bbcode', import.meta.url)).toString();
const html = fs.readFileSync(new URL('./fixtures/test.html', import.meta.url)).toString();

test.failing('reference doc', async t => {
  t.is(fromBbcode(bbcode), html);
});
