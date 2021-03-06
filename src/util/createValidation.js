/* eslint-disable no-param-reassign */
import mapValues from 'lodash/mapValues';

import getPromise from './getPromise';
import Ref from '../Reference';
import ValidationError from '../ValidationError';

const { formatError } = ValidationError;

const thenable = p =>
  p && typeof p.then === 'function' && typeof p.catch === 'function';

function runTest(testFn, ctx, value, sync) {
  const result = testFn.call(ctx, value);

  if (sync && thenable(result)) {
    throw new Error(
      `Validation test of type: "${ctx.type}" ` +
        'returned a Promise during a synchronous validate. ' +
        'This test will finish after the validate call has returned',
    );
  }

  return getPromise(sync).resolve(result);
}

function resolveParams(oldParams, newParams, resolve) {
  return mapValues({ ...oldParams, ...newParams }, resolve);
}

function createErrorFactory({ value, label, resolve, originalValue, ...opts }) {
  return function createError({
    path = opts.path,
    message = opts.message,
    type = opts.name,
    params,
  } = {}) {
    params = {
      path,
      value,
      originalValue,
      label,
      ...resolveParams(opts.params, params, resolve),
    };

    return Object.assign(
      new ValidationError(formatError(message, params), value, path, type),
      { params },
    );
  };
}

export default function createValidation(options) {
  const { name, message, test, params } = options;

  function validate({
    value,
    path,
    label,
    options: validateOptions,
    sync: validateSync,
    originalValue,
    ...rest
  }) {
    const sync = options.sync || validateSync;
    const { parent } = validateOptions;
    const resolve = val =>
      Ref.isRef(val) ? val.getValue(parent, validateOptions.context) : val;

    const createError = createErrorFactory({
      message,
      path,
      value,
      originalValue,
      params,
      label,
      resolve,
      name,
    });

    const ctx = {
      path,
      parent,
      type: name,
      createError,
      resolve,
      options: validateOptions,
      ...rest,
    };

    return runTest(test, ctx, value, sync).then(validOrError => {
      if (ValidationError.isError(validOrError)) {
        throw validOrError;
      } else if (!validOrError) {
        throw createError();
      }
    });
  }

  validate.TEST_NAME = name;
  validate.TEST_FN = test;
  validate.TEST = options;

  return validate;
}

module.exports.createErrorFactory = createErrorFactory;
