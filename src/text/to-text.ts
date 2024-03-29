import { HtmlToTextOptions as ToTextOptions, htmlToText } from 'html-to-text';

export { type HtmlToTextOptions as ToTextOptions } from 'html-to-text';

export function toText(html: string, options: string | ToTextOptions = 'default'): string {
  const op = (typeof options === 'string') ? textPresets[options] : options;
  return htmlToText(html, op).trim();
}

export const textPresets: Record<string, ToTextOptions | undefined> = {
  default: {
    wordwrap: false,
    selectors: [
      { selector: 'img', format: 'skip' },
      { selector: 'a', options: { ignoreHref: true } },
    ]
  },

  visibleText: {
    wordwrap: false,
    selectors: [
      { selector: 'img', format: 'skip' },
      { selector: 'a', options: { ignoreHref: true } },
    ]
  },

  readableText: {
    wordwrap: false,
    selectors: [
      { selector: 'img', format: 'readableImage' },
      { selector: 'a', options: { ignoreHref: true } },
    ],
    formatters: {
      readableImage: (el, walk, builder) => {
        const alt = el.attribs.alt?.toString().trim() ?? '';
        const src = el.attribs.src?.toString().trim() ?? '';
        const text = alt.trim().length ? alt : src;
        builder.addInline(text + ' ', { noWordTransform: true });
      },
    },
  },
};