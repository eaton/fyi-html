import test from 'ava';
import { extract, extractXml } from '../src/index.js';

const html = `
<html>
<body>
<h2>Title</h2>
<p>Body</p>
<p>More body</p>
<p><img src="img.jpg" alt="alt text" /> Image here</p>
<p>Transcript</p>
<span>Doesn't appear</span>
<p>More transcript</p>
</body>
</html>
`;

test('test extraction', async t => {
  const extracted = await extract(html, {
    title: 'h2',
    body: 'p:has(~ p>img) | html',
    bodyOuter: 'p:has(~ p>img) | outerHtml',
    image:  'p>img | attr:src',
    alt: 'p>img | attr:alt',
    transcript: 'p:not(:has(>img), :has(~ p>img)) | html'
  });

  t.is(extracted.body, '<p>Body</p><p>More body</p>');
  t.is(extracted.bodyOuter, '<p>Body</p><p>More body</p>');
  t.is(extracted.transcript, '<p>Transcript</p><p>More transcript</p>');
});


test('xml', async t => {
  const xml = '<xml><test>Text<foo id="1" /></test></xml>';
  const extracted = await extractXml(xml, {
    test: 'test',
    id: 'foo | attr:id',
  });

  t.deepEqual(extracted, { test: 'Text', id: '1' });
});

test('cdata', async t => {
  const xml = "<xml><test><![CDATA[<p>This is a test.</p>]]></test></xml>";
  const extracted = await extractXml(xml, { test: 'test' });
  t.deepEqual(extracted, { test: '<p>This is a test.</p>' });
});
