import test from 'ava';
import fs from 'node:fs';
import { fromRtf } from '../src/index.js';

const rtf = fs.readFileSync(new URL('./fixtures/test.rtf', import.meta.url)).toString();
const html = fs.readFileSync(new URL('./fixtures/test.html', import.meta.url)).toString();

test.failing('reference doc', async t => {
  t.is(await fromRtf(rtf), html);
});
