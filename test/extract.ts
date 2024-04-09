import test from 'ava';
import { extract } from '../src/index.js';
import { z } from 'zod';

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

const xml = `
<xml>
<test>Text<foo id="1" /></test>
<p>Paragraph</p>
<p>Paragraph 2</p>
<data><![CDATA[<p>Escaped text</p>]]></data>
</xml>
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

test('array extraction', async t => {
  const extracted = await extract(html, [{ $: 'p', value: '|text' }]);
  const expected = [
    { value: 'Body' }, 
    { value: 'More body' },
    { value: 'Image here' },
    { value: 'Transcript' },
    { value: 'More transcript' }
  ];

  t.deepEqual(extracted, expected);
});

test('xml', async t => {
  const extracted = await extract(
    xml,
    { test: 'test', id: 'foo | attr:id' },
    undefined,
    { xml: true }
  );

  t.deepEqual(extracted, { test: 'Text', id: '1' });
});

test('cdata', async t => {
  const extracted = await extract(xml, { data: 'data' }, undefined, { xml: true });
  t.deepEqual(extracted, { data: '<p>Escaped text</p>' });
});

test('template + schema', async t => {
  const html = '<div><p>First string</p><p>Second string</p></div>';
  const template = [{ $: 'p', value: '|text' }];
  const schema = z.array(z.object({ value: z.string() }));

  const extracted = await extract(html, template, schema);
  
  t.deepEqual(extracted, [{ value: 'First string' }, { value: 'Second string' }]);
});
