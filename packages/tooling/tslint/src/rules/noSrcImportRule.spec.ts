import { expect } from 'chai';
import { helper } from '../lintRunner';
import { Rule } from './noSrcImportRule';

const rule = 'no-src-import';

describe('noSrcImport Rule', () => {
  it(`should not fail on * as import`, () => {
    const src = `import * as express from 'express';`;
    const result = helper({ src, rule });
    expect(result.errorCount).to.eq(0);
  });

  it(`should fail for ../src/index`, () => {
    const src = `import {Event} from '../src/index';`;
    const failure = helper({ src, rule }).failures[0];

    expect(failure.getFailure()).to.eq(Rule.FAILURE_STRING);
  });

  it(`should fail for ../src`, () => {
    const src = `import {Event} from '../src';`;
    const failure = helper({ src, rule }).failures[0];

    expect(failure.getFailure()).to.eq(Rule.FAILURE_STRING);
  });

  it(`should fail for ../core/src`, () => {
    const src = `import {Event} from '../core/src';`;
    const failure = helper({ src, rule }).failures[0];

    expect(failure.getFailure()).to.eq(Rule.FAILURE_STRING);
  });
});
