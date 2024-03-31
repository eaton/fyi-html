declare module '@iarna/rtf-to-html'  {
  export function fromString(txt: string, opt?: Record<string, unknown>): string;
  export function fromStream (stream: any, opts: Record<string, unknown>, cb: any): string;
}
