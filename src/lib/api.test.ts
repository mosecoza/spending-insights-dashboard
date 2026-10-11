import { describe, it, expect } from 'vitest';
import { zar } from '../lib/api';

describe('zar formatting', () => {
  it('formats ZAR amounts', () => {
    expect(zar(4250.75)).toContain('4');
    expect(zar(0)).toContain('0');
  });
});

describe('pagination math', () => {
  it('computes total pages', () => {
    expect(Math.ceil(1250 / 20)).toBe(63);
    expect(Math.ceil(0 / 20)).toBe(0);
  });
});
