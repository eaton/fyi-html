import test from 'ava';
import { fromText, toText, linkify, textPresets } from '../src/index.js';

const text = `Here's some text.

This is another paragraph.

This mentions https://www.google.com in the text, as well as google.com.`;

const roundTripText = `Here's some text.

This is another paragraph.

This mentions google.com in the text, as well as google.com.`;


const html = `<p>Here's some text.</p>
<p>This is another paragraph.</p>
<p>This mentions https://www.google.com in the text, as well as google.com.</p>`;

const escapedHtml = `<p>Here&apos;s some text.</p>
<p>This is another paragraph.</p>
<p>This mentions https://www.google.com in the text, as well as google.com.</p>`;

const linkified = `<p>Here&apos;s some text.</p>
<p>This is another paragraph.</p>
<p>This mentions <a href="https://www.google.com">google.com</a> in the text, as well as <a href="https://google.com">google.com</a>.</p>`;

test('text to HTML', t => {
  t.is(fromText(text), escapedHtml);
});

test('unescaped conversion', t => {
  t.is(fromText(text, { entities: false }), html);
});

test('linkified conversion', t => {
  t.is(fromText(text, { urls: true }), linkified);
});

test('HTML to text', t => {
  t.is(toText(html), text);
})

test('HTML links to text', t => {
  t.is(toText(linkified, textPresets.plain), roundTripText);
})