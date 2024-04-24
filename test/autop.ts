import test from 'ava';
import fs from 'node:fs';
import { autop } from '../src/index.js';

const html = fs.readFileSync(new URL('./fixtures/linebreaks.html', import.meta.url)).toString();
const target = `<h1>Test File</h1>
<p>This is some text, but we're not using paragraph tags.</p>
<blockquote><p>here's a quote! we're terrible citizens.</p>
<p>this is another line.
</p></blockquote>
<ul>
<li>testing</li>
<li>testing</li>
</ul>
<p>This is more text.
On the same line.</p>
<p>On a new line?</p>
<p>And a third line.</p>
`;

test('wp autop', t => {
  t.is(target, autop(html, false));
});
