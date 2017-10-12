import isFunction from 'lodash/isFunction';
import isSymbol from 'lodash/isSymbol';

const symbolToString = Symbol.prototype.toString;

const SYMBOL_REGEXP = /^Symbol\((.*)\)(.*)$/;

function printNumber(val) {
  if (val !== +val) {
    return 'NaN';
  }
  const isNegativeZero = val === 0 && 1 / val < 0;
  return isNegativeZero ? '-0' : `${val}`;
}

function printFunction(val) {
  return `[Function ${val.name || 'anonymous'}]`;
}

function printSymbol(val) {
  return symbolToString.call(val).replace(SYMBOL_REGEXP, 'Symbol($1)');
}

function printError(val) {
  return `[${Error.prototype.toString.call(val)}]`;
}

function printSimpleValue(val, quoteStrings = false) {
  if (val === true || val === false) return `${val}`;
  if (val === undefined) return 'undefined';
  if (val === null) return 'null';

  const typeOf = typeof val;

  if (typeOf === 'number') return printNumber(val);
  if (typeOf === 'string') return quoteStrings ? `"${val}"` : val;
  if (isFunction(val)) return printFunction(val);
  if (isSymbol(val)) return printSymbol(val);

  const tag = Object.prototype.toString.call(val);
  if (tag === '[object Date]') {
    return Number.isNaN(Number(val.getTime())) ?
      String(val) :
      Date.prototype.toISOString.call(val);
  }
  if (tag === '[object Error]' || val instanceof Error) {
    return printError(val);
  }
  if (tag === '[object RegExp]') {
    return RegExp.prototype.toString.call(val);
  }

  return null;
}

export default function printValue(value, quoteStrings) {
  const result = printSimpleValue(value, quoteStrings);
  if (result !== null) {
    return result;
  }

  return JSON.stringify(value, function format(key, val) {
    const formatted = printSimpleValue(this[key], quoteStrings);
    if (formatted !== null) {
      return formatted;
    }
    return val;
  }, 2);
}
