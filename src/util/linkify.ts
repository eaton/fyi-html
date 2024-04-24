import linkifyHtml from 'linkify-html';
import humanizeUrl from 'humanize-url';

// TODO: figure out whether we want to support raw IP addresses, hashtags, and @mentions

export function linkify(input: string) {
  return linkifyHtml(input, {
    defaultProtocol: 'https',
    format: (url, type) => (type === 'url' ? humanizeUrl(url) : url),
    truncate: 40,
  });
}
