import rtfToHTML from '@iarna/rtf-to-html';
const { fromString, fromStream } = rtfToHTML;
import { promisify } from 'util';

export type FromRtfOptions = {
  paraBreaks?: string;
  paraTag?: string;
  template?: OutputTemplate
  disableFonts?: boolean;
  fontSize?: number;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  foreground?: RgbColor;
  background?: RgbColor;
  indent?: number;
  align?: 'left' | 'center' | 'right';
};
type OutputTemplate = (doc: any, defaults: FromRtfOptions, content: string) => string;
type RgbColor = { red: number, blue: number, green: number };

export async function fromRtf(input: string, options: FromRtfOptions = {}) {
  const stream = promisify(fromStream);
  const text = promisify(fromString);

  options.template ??= outputTemplate;

  if (typeof input === 'string') {
    return stream(input, options);
  } else {
    return text(input, options);
  }
}

function outputTemplate(doc: Record<string, unknown>, defaults: FromRtfOptions, content: string) {
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