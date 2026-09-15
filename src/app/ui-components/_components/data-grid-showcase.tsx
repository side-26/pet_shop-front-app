import { DataGrid, type DataGridRootProps } from '@/components/ui/data-grid';

import { ShowcaseSection } from './showcase-section';

const entries = [
  ['نوع کولر آبی', 'سلولزی قابل حمل'],
  [
    'حجم خنک‌کنندگی',
    <bdi dir="ltr" key="airflow">
      CFM ۲۸۰۰
    </bdi>,
  ],
  [
    'طراحی بدنه کولر',
    <>
      چرخ‌دار
      <br />
      پایدار
    </>,
  ],
  ['ویژگی‌های پوشال', 'قابل شست‌وشو'],
  ['نوع برق مصرفی', 'تک‌فاز (۲۲۰–۲۴۰ ولت)'],
] as const;

function SpecificationGrid(props: DataGridRootProps) {
  return (
    <DataGrid.Root {...props} aria-label="مشخصات محصول">
      {entries.map(([label, value]) => (
        <DataGrid.Item key={label}>
          <DataGrid.Label>{label}</DataGrid.Label>
          <DataGrid.Value>{value}</DataGrid.Value>
        </DataGrid.Item>
      ))}
    </DataGrid.Root>
  );
}

export function DataGridShowcase() {
  return (
    <ShowcaseSection
      id="data-grids"
      title="Data Grid"
      description="فهرست ویژگی‌های دوسطونه و راست‌به‌چپ با ساختار معنایی definition list، جداکننده‌های قابل تنظیم و اندازه‌های هماهنگ."
    >
      <SpecificationGrid />
      <div className="tw:grid tw:gap-4 tw:lg:grid-cols-3">
        <SpecificationGrid borderColor="primary" variant="outlined" size="sm" />
        <SpecificationGrid borderColor="secondary" variant="filled" size="sm" />
        <SpecificationGrid borderColor="neutral" variant="line" size="xs" />
      </div>
    </ShowcaseSection>
  );
}
