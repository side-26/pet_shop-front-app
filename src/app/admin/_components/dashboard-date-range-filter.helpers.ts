import type { DashboardMetricsQueryInput } from '@/entities/dashboard/dashboard.schema';

export type DashboardDateRangeFilterValues = {
  fromDate: string;
  toDate: string;
};

export type DashboardSearchParams = Record<string, string | string[] | undefined>;

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function isIsoDateTime(value: string | undefined): value is string {
  return value !== undefined && value !== '' && !Number.isNaN(Date.parse(value));
}

export function parseDashboardDateRangeSearchParams(
  searchParams: DashboardSearchParams,
): DashboardDateRangeFilterValues {
  const fromDate = firstValue(searchParams.fromDate);
  const toDate = firstValue(searchParams.toDate);

  if (
    !isIsoDateTime(fromDate) ||
    !isIsoDateTime(toDate) ||
    Date.parse(fromDate) > Date.parse(toDate)
  ) {
    return { fromDate: '', toDate: '' };
  }

  return { fromDate, toDate };
}

export function toDashboardMetricsQuery(
  values: DashboardDateRangeFilterValues,
): Pick<DashboardMetricsQueryInput, 'fromDate' | 'toDate'> {
  if (
    !isIsoDateTime(values.fromDate) ||
    !isIsoDateTime(values.toDate) ||
    Date.parse(values.fromDate) > Date.parse(values.toDate)
  ) {
    return {};
  }

  return { fromDate: values.fromDate, toDate: values.toDate };
}

export function toDashboardDateRangeSearchParams(values: DashboardDateRangeFilterValues) {
  const query = toDashboardMetricsQuery(values);
  const params = new URLSearchParams();

  if (query.fromDate && query.toDate) {
    params.set('fromDate', query.fromDate);
    params.set('toDate', query.toDate);
  }

  return params;
}
