import { describe, expect, it } from 'vitest';

import { HTTP_STATUS } from './http-status';

describe('HTTP_STATUS', () => {
  it('is the unique registry of IANA HTTP 2xx through 5xx response codes', () => {
    const statuses = Object.values(HTTP_STATUS);

    expect(statuses).toEqual(expect.arrayContaining([200, 418, 422, 451, 511]));
    expect(new Set(statuses)).toHaveLength(statuses.length);
    expect(Math.min(...statuses)).toBe(200);
    expect(Math.max(...statuses)).toBe(511);
  });
});
