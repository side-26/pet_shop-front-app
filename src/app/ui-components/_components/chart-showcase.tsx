import { LineChart } from '@/components/ui/charts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const lineData = [
  { month: 'فروردین', primary: 48, secondary: 36, white: 64, neutral: 28, success: 52 },
  { month: 'اردیبهشت', primary: 62, secondary: 45, white: 58, neutral: 40, success: 68 },
  { month: 'خرداد', primary: 55, secondary: 51, white: 72, neutral: 46, success: 61 },
];

export function ChartShowcase() {
  return (
    <section id="charts" aria-labelledby="charts-title">
      <Card>
        <CardHeader>
          <CardTitle id="charts-title">Chart</CardTitle>
          <CardDescription>
            نمونه نمودار خطی با رنگ‌های معنایی و Tooltip سازگار با پوسته.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LineChart
            ariaLabel="روند رنگ‌های نمودار خطی"
            data={lineData}
            xAxisDataKey="month"
            series={[
              { color: 'primary', dataKey: 'primary', label: 'اصلی' },
              { color: 'secondary', dataKey: 'secondary', label: 'ثانویه' },
              { color: 'white', dataKey: 'white', label: 'سفید' },
              { color: 'neutral', dataKey: 'neutral', label: 'خنثی' },
              { color: 'success', dataKey: 'success', label: 'موفق' },
            ]}
          />
        </CardContent>
      </Card>
    </section>
  );
}
