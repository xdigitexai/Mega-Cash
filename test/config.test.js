import test from 'node:test';import assert from 'node:assert/strict';import { normalizeUgandaPhone } from '../src/config.js';
test('Uganda phone formats normalize consistently',()=>{for(const value of ['0700123456','256700123456','+256 700 123 456'])assert.equal(normalizeUgandaPhone(value),'+256700123456');assert.throws(()=>normalizeUgandaPhone('123'))});
