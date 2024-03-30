# Eaton's Markup Tools

Consolidates the setup of assorted markup parsing, scrubbing, and manipulation tools I use frequently. Generally speaking, everything in this kit is focused on either parsing/extracting stuff from HTML, or translating other common lightweight markup formats into HTML.

## DOM

- **`toCheerio(html: string)`** takes HTML (or XML) and returns a traversable Cheerio DOM for markup manipulation/examination/etc. Nothing fancy here, just does what it says on the tin.
- **`extract(html: string, template: JSON, schema?: ZodSchema)`** uses the excellent [cheerio-json-mapper](https://github.com/denkan/cheerio-json-mapper) project to quickly extract structured data from HTML. A simple JSON template is used to describe the properties you want, the selectors that should be used to populate them, and some simple post-processing operations that can be performend on what's selected. Additionally, you can optionally pass in a [zod](https://zod.dev) schema to parse and validate the JSON that comes back, turning it into a strongly typed data structure full of useful bits.

## Markdown

- **`fromMarkdown(text: string)`** takes a Markdown string and spits out HTML. Under the hood it uses [marked](https://github.com/markedjs/marked), augmented by the popular [marked-footnote](https://github.com/bent10/marked-extensions/tree/main/packages/footnote) extension. Down the line, more Github-flavored extensions might be added as well.
- **`toMarkdown(html: string)`** uses the comparatively less popular [turndown](https://github.com/mixmark-io/turndown) project; it's configured to use ATX style headers, dashes as bullets, single/double asterisks instead of underscores, and inline link references rather than footnoted ones. A single custom override to the normal formatting is used to ensure bulletted lists have a single-space rather than double or triples.

## Plaintext

- **`toText(html: string)`** accepts a pile of HTML and spits out a reasonably readable plaintext analogue. Under the hood, it uses the extremely customizable [HtmlToText](https://github.com/html-to-text/node-html-to-text) library, with a handful of configuration tweaks. A tags' HREF attributes are put in parenthesis after their text, and ignored if the text and href are duplicates of each other. Images are reduced to their alt text, and their URLs are ignored. Several other presets are available in the `textPresets` collection, the default one can be modified by changing `textPresets.default`, and you can pass in custom `HtmlToTextOption` structures to exercise full control.
- **`fromText(text: string)`** uses double linebreaks to indentify boundaries for `<p>` tags, converts URLs and URL-like strings into clickable `<a>` tags, and can optionally excale HTML entities. Each of those features can be toggled on and off via its options, but out of the box it's handy for turning stuff like oldschool "plain text" blog posts and scraped plaintext into something reasonably nice. Note that passing `{ inline: true }` into the options for this function avoids unecessarily wrapping single-line strings in a `<p>` tag.

## Weird Janky Stuff

- **`fromBBCode(text: string)`** uses [ya-bbcode](https://github.com/nodecraft/ya-bbcode), to convert BBCode from old forums into HTML. Nothing fancy here, just needed it for some old migrations.
- **`fromTextile(text: string)`** uses [textile-js](https://github.com/borgar/textile-js) to parse and HTMLify Textile markup. MovableType had a popular extension that used Textile to render posts, and a bunch of my old archives turned out to be formatted in it.
- **`fromLivejournal(text: string)`** Livejournal was pretty loosey-goosey with things like clean markup; quite a few old posts are plaintext with no wrapping markup. Others are "partial HTML", and many use proprietary LJ tags like `<lj user="foo">` or `<lj-cut>`. Passing `{ teaser: true }` in as an option to this function will hide anything behind an `<lj-cut>` tag; by default, it only converts the cut tag into a `<span class="lj-cut" />` placeholder that can be used for more traditional DOM manipulation.
- **`linkify(html: string)`** turns URLs and domain-like strings into `<a>` tags, avoiding any that *already* appear inside of an `<a>` tag.

## Potential Future Stuff

I'd like to consolidate the HTML-to-Markdown and turn it into a special case of HTML-To-Text; it's possible, but would take a bunch of troubleshooting for the edge cases and I'm honestly not THAT passionate about it.

HTML scrubbing/pretty-pringing. amd sanitization would be handy but that's also a BIG SPACE, and probably beyond what's reasonable for this already-bloated convenience library.

Text and typography cleanup tools like SmartPants are handy; I might use [textr](https://github.com/A/textr) or [typogr](https://github.com/ekalinin/typogr.js), but these things aren't really markup manipulation per se — my own [text tools](https://github.com/eaton/text) is probably a better place for it.

XPath support when cheerio just won't do is another wishlist item; [xpath-ts](https://github.com/backslash47/xpath) and [ts-xpath](https://github.com/SGbo/ts-xpath) are both long in the tooth but might still be good options.

I'm considering the value of porting more of the conversion bits to [unified](https://github.com/unifiedjs/unified). Obviously it'd be a giant adventure in gold plating, but it's a consistent base on which most of these different utilities could be consolidated. Maybe when I retire and really, really want to parse my old Setext files, too.
