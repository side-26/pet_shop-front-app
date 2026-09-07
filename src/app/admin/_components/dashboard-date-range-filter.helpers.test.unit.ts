import { describe, expect, it } from 'vitest';

import {
  parseDashboardDateRangeSearchParams,
  toDashboardDateRangeSearchParams,
  toDashboardMetricsQuery,
} from './dashboard-date-range-filter.helpers';

const range = {
  fromDate: '2026-09-01T00:00:00.000Z',
  toDate: '2026-09-07T23:59:59.000Z',
};

describe('dashboard date-range query helpers', () => {
  it('accepts a complete ordered ISO range and serializes only its request-driving keys', () => {
    expect(parseDashboardDateRangeSearchParams(range)).toEqual(range);
    expect(toDashboardMetricsQuery(range)).toEqual(range);
    expect(toDashboardDateRangeSearchParams(range).toString()).toBe(
      'fromDate=2026-09-01T00%3A00%3A00.000Z&toDate=2026-09-07T23%3A59%3A59.000Z',
    );
  });

  it('drops incomplete, malformed, and inverted ranges', () => {
    expect(parseDashboardDateRangeSearchParams({ fromDate: range.fromDate })).toEqual({
      fromDate: '',
      toDate: '',
    });
    expect(toDashboardMetricsQuery({ fromDate: range.toDate, toDate: range.fromDate })).toEqual({});
    expect(
      toDashboardDateRangeSearchParams({ fromDate: 'not-a-date', toDate: range.toDate }).toString(),
    ).toBe('');
  });
});
