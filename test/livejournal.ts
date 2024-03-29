import test from 'ava';
import { fromLivejournal } from '../src/index.js';

// Based on Livejournal's HTML scrubbing tests at
// https://github.com/apparentlymart/livejournal/blob/master/t/cleaner-ljtags.t

test('lj user', t => {
  const inputs = [
    '<lj user=name>',
    "<lj user='name'>",
    '<lj user="name">',
    '<lj user=name />',
    "<lj user='name' />",
    '<lj user="name" />',
  ];
  const expected = `<a class="lj-user" href="https://livejournal.com/users/name">name</a>`;

  for (const input of inputs) {
    t.is(fromLivejournal(input), expected);  
  }
});

test('lj-cut', t => {
  t.is(
    fromLivejournal("some text <lj-cut> more text"),
    'some text <span class="lj-uncut" /> more text'
  );

  t.is(
    fromLivejournal("some text <lj-cut> more text", { teaser: true }),
    'some text <span class="lj-cut" />'
  );
});

test('lj-cut with text', t => {
  t.is(
    fromLivejournal('some text <lj-cut text="marker"> more text'),
    'some text <span class="lj-uncut" /> more text'
  );

  t.is(
    fromLivejournal('some text <lj-cut text="marker"> more text', { teaser: true }),
    'some text <span class="lj-cut">marker</span>'
  );
});

test('lj-cut wrapper', t => {
  t.is(
    fromLivejournal('some text <lj-cut text="marker">hidden text</lj-cut> more text', { teaser: true }),
    'some text <span class="lj-cut">marker</span> more text'
  );

  t.is(
    fromLivejournal('some text <lj-cut text="marker">hidden text</lj-cut> more text'),
    'some text <span class="lj-uncut">hidden text</span> more text'
  );
});