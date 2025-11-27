import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { version } from './version.ts';
import pkg from '../../package.json' assert { type: 'json' };

describe('Version', () => {
  it('should be the same as the version in package.json', () => {
    assert.strictEqual(version, pkg.version);
  });
});
