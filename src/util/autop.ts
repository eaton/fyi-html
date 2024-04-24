// Just an absolute embarassment of a function.
// Brute-force ported from php to typescript with codellama.
// Will replace later. 

export function autop(text: string, br = true): string {
  const preTags: { [key: string]: string } = {};

  if (text.trim() === '') {
    return '';
  }

  // Just to make things a little easier, pad the end.
  text = `${text}\n`;

  /*
   * Pre tags shouldn't be touched by autop.
   * Replace pre tags with placeholders and bring them back after autop.
   */
  if (text.includes('<pre')) {
    const textParts = text.split('</pre>');
    const lastPart = textParts.pop() || '';
    text = '';
    let i = 0;

    for (const textPart of textParts) {
      const start = textPart.indexOf('<pre');

      // Malformed HTML?
      if (start === -1) {
        text += textPart;
        continue;
      }

      const name = `<pre wp-pre-tag-${i}></pre>`;
      preTags[name] = `${textPart.slice(start)}</pre>`;

      text += `${textPart.slice(0, start)}${name}`;
      ++i;
    }

    text += lastPart;
  }

  // Change multiple <br>'s into two line breaks, which will turn into paragraphs.
  text = text.replace(/(<br\s*\/?>\s*<br\s*\/?>)/g, '\n\n');

  const allblocks = '(?:table|thead|tfoot|caption|col|colgroup|tbody|tr|td|th|div|dl|dd|dt|ul|ol|li|pre|form|map|area|blockquote|address|style|p|h[1-6]|hr|fieldset|legend|section|article|aside|hgroup|header|footer|nav|figure|figcaption|details|menu|summary)';

  // Add a double line break above block-level opening tags.
  text = text.replace(new RegExp(`(<${allblocks}[\\s/>])`, 'g'), '\n\n$1');

  // Add a double line break below block-level closing tags.
  text = text.replace(new RegExp(`(</${allblocks}>)`, 'g'), '$1\n\n');

  // Add a double line break after hr tags, which are self closing.
  text = text.replace(/(<hr\s*?\/??>)/g, '$1\n\n');

  // Standardize newline characters to "\n".
  text = text.replace(/\r\n?/g, '\n');

  // Find newlines in all elements and add placeholders.
  text = wpReplaceInHtmlTags(text, { '\n': ' <!-- wpnl --> ' });

  // Collapse line breaks before and after <figcaption> elements.
  if (text.includes('<figcaption')) {
    text = text.replace(/\s*(<figcaption[^>]*>)/g, '$1');
    text = text.replace(/<\/figcaption>\s*/g, '</figcaption>');
  }

  // Remove more than two contiguous line breaks.
  text = text.replace(/\n\n+/g, '\n\n');

  // Split up the contents into an array of strings, separated by double line breaks.
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);

  // Reset text prior to rebuilding.
  text = '';

  // Rebuild the content as a string, wrapping every bit with a <p>.
  for (const paragraph of paragraphs) {
    text += `<p>${paragraph.trim()}</p>\n`;
  }

  // Under certain strange conditions it could create a P of entirely whitespace.
  text = text.replace(/<p>\s*<\/p>/g, '');

  // Add a closing <p> inside <div>, <address>, or <form> tag if missing.
  text = text.replace(/<p>([^<]+)<\/(div|address|form)>/g, '<p>$1</p></$2>');

  // If an opening or closing block element tag is wrapped in a <p>, unwrap it.
  text = text.replace(new RegExp(`<p>\\s*(</?(${allblocks})[^>]*>)\\s*</p>`, 'g'), '$1');

  // In some cases <li> may get wrapped in <p>, fix them.
  text = text.replace(/<p>(<li.+?)<\/p>/g, '$1');

  // If a <blockquote> is wrapped with a <p>, move it inside the <blockquote>.
  text = text.replace(/<p><blockquote([^>]*)>/gi, '<blockquote$1><p>');
  text = text.replace(/<\/blockquote><\/p>/g, '</p></blockquote>');

  // If an opening or closing block element tag is preceded by an opening <p> tag, remove it.
  text = text.replace(new RegExp(`<p>\\s*(</?(${allblocks})[^>]*>)`, 'g'), '$1');

  // If an opening or closing block element tag is followed by a closing <p> tag, remove it.
  text = text.replace(new RegExp(`(</?(${allblocks})[^>]*>)\\s*</p>`, 'g'), '$1');

  // Optionally insert line breaks.
  if (br) {
    // Replace newlines that shouldn't be touched with a placeholder.
    text = text.replace(/<(script|style|svg|math).*?<\/\1>/gs, match => _autop_newline_preservation_helper(match));

    // Normalize <br>
    text = text.replace(/(<br>|<br\/>)/g, '<br />');

    // Replace any new line characters that aren't preceded by a <br /> with a <br />.
    text = text.replace(/(?<!<br \/>)\s*\n/g, '<br />\n');

    // Replace newline placeholders with newlines.
    text = text.replace(/<WPPreserveNewline \/>/g, '\n');
  }

  // If a <br /> tag is after an opening or closing block tag, remove it.
  text = text.replace(new RegExp(`(</?(${allblocks})[^>]*>)\\s*<br />`, 'g'), '$1');

  // If a <br /> tag is before a subset of opening or closing block tags, remove it.
  text = text.replace(/<br \/>(\s*<\/?(p|li|div|dl|dd|dt|th|pre|td|ul|ol)[^>]*>)/g, '$1');
  text = text.replace(/\n<\/p>$/g, '</p>');

  // Replace placeholder <pre> tags with their original content.
  if (Object.keys(preTags).length > 0) {
    text = replaceAll(text, Object.keys(preTags), Object.values(preTags));
  }

  // Restore newlines in all elements.
  if (text.includes('<!-- wpnl -->')) {
    text = text.replace(/ <!-- wpnl --> /g, '\n').replace(/<!-- wpnl -->/g, '\n');
  }

  return text;
}

function _autop_newline_preservation_helper(match: string): string {
  return `<WPPreserveNewline />${match}<WPPreserveNewline />`;
}

function replaceAll(str: string, search: string[], replacement: string[]): string {
  return str.replace(new RegExp(search.map(s => `(${s})`).join('|'), 'g'), (match, ...groups) => {
    const index = search.indexOf(groups.find(g => g !== undefined));
    return replacement[index];
  });
}

function wpReplaceInHtmlTags(haystack: string, replacePairs: Record<string, string>): string {
  // Find all elements.
  let textarr = wpHtmlSplit(haystack);
  let changed = false;

  // Optimize when searching for one item.
  if (Object.keys(replacePairs).length === 1) {
      // Extract needle and replace.
      let needle: string = '';
      let replace: string = '';
      
      for (let key in replacePairs) {
        needle = key;
        replace = replacePairs[key];
      }

      // Loop through delimiters (elements) only.
      for (let i = 1, c = textarr.length; i < c; i += 2) {
          if (textarr[i].includes(needle)) {
              textarr[i] = textarr[i].replace(needle, replace);
              changed = true;
          }
      }
  } else {
      // Extract all needles.
      let needles = Object.keys(replacePairs);

      // Loop through delimiters (elements) only.
      for (let i = 1, c = textarr.length; i < c; i += 2) {
          for (let needle of needles) {
              if (textarr[i].includes(needle)) {
                  for (let key in replacePairs) {
                      textarr[i] = textarr[i].replace(new RegExp(key, 'g'), replacePairs[key]);
                  }
                  changed = true;
                  // After one replace break out of the for loop and look at next element.
                  break;
              }
          }
      }
  }

  if (changed) {
      haystack = textarr.join('');
  }

  return haystack;
}


function wpHtmlSplit(input: string) {
  return input.split(getHtmlSplitRegex());
}

function getHtmlSplitRegex() {
  let regex: RegExp;

  const comments: string =
      '!' +
      '(?:' +
      '-(?!->)' +
      '[^\\-]*+' +
      ')*+' +
      '(?:-->)?';

  const cdata: string =
      '!\\[CDATA\\[' +
      '[^\\]]*+' +
      '(?:' +
      '](?!]>)' +
      '[^\\]]*+' +
      ')*+' +
      '(?:]]>)?';

  const escaped: string =
      '(?=' +
      '!--' +
      '|' +
      '!\\[CDATA\\[' +
      ')' +
      '(?(?=!-)' +
      comments +
      '|' +
      cdata +
      ')';

  regex = new RegExp(regexEscape(
      '(' +
      '<' +
      '(?' +
      escaped +
      '|' +
      '[^>]*>?' +
      ')' +
      ')'
  ),
      'g'
  );

  return regex;
}


const reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
function regexEscape(input: string) {
  return input.replace(reRegExpChar, '\\$&');
}