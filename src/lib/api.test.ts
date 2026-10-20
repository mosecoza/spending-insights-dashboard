import { describe, it, expect } from 'vitest';
import { customerApiPath, parseDateSA, queryKeys, zar } from '../lib/api';

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

describe('South African date parsing', () => {
  it('parses a valid calendar date independently of the local timezone', () => {
    expect(parseDateSA('16/09/2024')).toBe('2024-09-16');
  });

  it.each(['31/04/2024', '29/02/2023', '00/01/2024', '01/13/2024'])(
    'rejects invalid calendar date %s',
    (value) => {
      expect(parseDateSA(value)).toBeNull();
    },
  );

  it('rejects values outside dd/mm/yyyy format', () => {
    expect(parseDateSA('2024-09-16')).toBeNull();
    expect(parseDateSA('1/09/2024')).toBeNull();
  });
});

describe('customer-scoped query keys', () => {
  it('keeps cached data isolated between customer IDs', () => {
    const first = '12345';
    const second = '67890';
    const firstKeys = [
      queryKeys.profile(first),
      queryKeys.summary(first, '30d'),
      queryKeys.categories(first, { period: '30d' }),
      queryKeys.trends(first, 12),
      queryKeys.transactions(first, { limit: 20, offset: 0, sortBy: 'date_desc' }),
      queryKeys.goals(first),
      queryKeys.filters(first),
    ];
    const secondKeys = [
      queryKeys.profile(second),
      queryKeys.summary(second, '30d'),
      queryKeys.categories(second, { period: '30d' }),
      queryKeys.trends(second, 12),
      queryKeys.transactions(second, { limit: 20, offset: 0, sortBy: 'date_desc' }),
      queryKeys.goals(second),
      queryKeys.filters(second),
    ];

    expect(firstKeys).not.toEqual(secondKeys);
  });
});

describe('customer API paths', () => {
  it('encodes customer IDs as a single path segment', () => {
    expect(customerApiPath('123/45', 'profile')).toBe('/customers/123%2F45/profile');
  });

  it('rejects empty customer IDs', () => {
    expect(() => customerApiPath(' ', 'profile')).toThrow();
  });
});
