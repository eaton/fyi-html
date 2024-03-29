import { PipeFn, getScope } from 'cheerio-json-mapper';
import { toText, textPresets } from '../text/to-text.js';

function isNumericString(input: unknown): input is string {
  return (typeof input === 'string') && input.trim().length > 0 && !Number.isNaN(Number(input.trim()));
}

export const split: PipeFn = ({ value, args }) => {
  if (value !== null && value !== void 0) {
    const [arg1] = args ?? [];
    const joiner = arg1?.toString() ?? ' ';
    return value
      .toString()
      .split(joiner)
      .map((value) => value.trim());
  } else {
    return void 0;
  }
};

export const join: PipeFn = ({ value, args }) => {
  if (Array.isArray(value)) {
    const [arg1] = args ?? [];
    const joiner = arg1?.toString() ?? ' ';
    return value.map((v) => v.toString().trim()).join(joiner);
  } else {
    return void 0;
  }
};

export const count: PipeFn = ({ value }) =>
  Array.isArray(value) || typeof value === 'string' ? value.length : void 0;

export const first: PipeFn = ({ value }) =>
  Array.isArray(value) ? value[0] : void 0;

export const last: PipeFn = ({ value }) =>
  Array.isArray(value) ? value[value.length - 1] : void 0;

export const index: PipeFn = ({ value, args }) => {
  if (Array.isArray(value)) {
    const [idx] = args ?? [];
    if (isNumericString(idx)) {
      return value[Number.parseInt(idx)];
    }
    return void 0;
  }
  return void 0;
};

export const outerHtml: PipeFn = ({
  $scope,
  selector,
  opts,
}) => getScope($scope, selector, opts).toString();

export const html = outerHtml;

export const clean: PipeFn = ({
  $scope,
  selector,
  opts,
  args,
}) => {
  const [preset] = args ?? [];
  const html = getScope($scope, selector, opts).html() ?? '';
  return toText(html, preset ?? undefined);
}

export const pad: PipeFn = ({
  $scope,
  selector,
  opts,
  args
}) => getScope($scope, selector, opts).contents().append(args?.[0]?.toString() ?? ' ');



export const pipeFnMap = {
  split, join, count, first, last, index, html, outerHtml, pad
}

