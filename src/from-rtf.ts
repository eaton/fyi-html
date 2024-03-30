import rtfToHTML from '@iarna/rtf-to-html';
import { promisify } from 'util';

type RgbColor = { red: number, blue: number, green: number };

export interface HtmlToRTFOptions {
  // defaults to \n\n
  paraBreaks?: string;
  // defaults to p
  paraTag?: string;
  template?: typeof outputTemplate
  // Defaults to true. If you set this to false then we'll output font change information when we encounter it. This is a bit broken due to our not supporting styles.
  disableFonts?: boolean;
  // Defaults to the document-wide declared font size, or if that's missing, 24.
  fontSize?: number;
  // Defaults to false
  bold?: boolean;
  // Defaults to false
  italic?: boolean;
  // Defaults to false
  underline?: boolean;
  // Defaults to false
  strikethrough?: boolean;
  foreground?: RgbColor;
  background?: RgbColor;
  indent?: number;
  align?: 'left' | 'center' | 'right';
};

export async function fromRtf(input: string, options: HtmlToRTFOptions = {}) {
  const fromStream = promisify(rtfToHTML);
  const fromString = promisify(rtfToHTML.fromString);

  options.template ??= outputTemplate;

  if (typeof input === 'string') {
    return fromString(input, options);
  } else {
    return fromStream(input, options);
  }
}

function outputTemplate (doc: Record<string, unknown>, defaults: HtmlToRTFOptions, content: string) {
  console.log(doc);
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
  </head>
  <body>
    ${content.replace(/\n/, '\n    ')}
  </body>
</html>`
}


const exampleDocument = {
  parent: undefined,
  content: [
    { style: {}, content: [[]] },
    { style: {}, content: [] },
  ],
  fonts: [
    {
      family: 'swiss',
      charset: 'ASCII',
      name: 'Helvetica',
      pitch: 0
    }
  ],
  colors: [
    { red: 0, blue: 0, green: 0 },
    { red: 255, blue: 255, green: 255 }
  ],
  style: {
    indent: 720,
    firstLineIndent: -720,
    foreground: { red: 0, blue: 0, green: 0 }
  },
  ignorable: false,
  charset: 'CP1252',
  marginLeft: 1440,
  marginRight: 1440,
  marginBottom: 1440,
  marginTop: 1440,
  type: 'ansi'
}