import { mixed, number, object, string, type InferType } from 'yup';

export const DASHBOARD_GROUP_BY = ['day', 'week', 'month'] as const;

export type DashboardGroupBy = (typeof DASHBOARD_GROUP_BY)[number];

const isoDateTimeSchema = string()
  .trim()
  .test(
    'iso-date-time',
    'تاریخ باید در قالب ISO 8601 باشد.',
    (value) => value == null || !Number.isNaN(Date.parse(value)),
  );

export const dashboardMetricsQuerySchema = object({
  fromDate: isoDateTimeSchema.optional(),
  toDate: isoDateTimeSchema.optional(),
  groupBy: mixed<DashboardGroupBy>().oneOf(DASHBOARD_GROUP_BY).default('day').required(),
  lowStockThreshold: number().integer().min(0).max(1000).default(5).required(),
  topLimit: number().integer().min(1).max(20).default(5).required(),
  lowStockLimit: number().integer().min(1).max(20).default(5).required(),
  recentLimit: number().integer().min(1).max(20).default(5).required(),
}).test(
  'date-range',
  'تاریخ شروع نباید بعد از تاریخ پایان باشد.',
  (value) =>
    !value?.fromDate || !value.toDate || Date.parse(value.fromDate) <= Date.parse(value.toDate),
);

export type DashboardMetricsQueryInput = InferType<typeof dashboardMetricsQuerySchema>;
