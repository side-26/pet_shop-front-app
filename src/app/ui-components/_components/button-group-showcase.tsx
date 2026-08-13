import { Bold, Italic, Underline } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ButtonGroup, ButtonGroupText } from '@/components/ui/button-group';
import { ShowcaseSection } from './showcase-section';

export function ButtonGroupShowcase() {
  return (
    <ShowcaseSection
      id="button-groups"
      title="Button Group"
      description="گروه افقی و عمودی با اتصال منطقی حاشیه‌ها در RTL و پشتیبانی از همه حالت‌های Button."
    >
      <div className="tw:flex tw:flex-wrap tw:items-start tw:gap-6">
        <ButtonGroup aria-label="قالب‌بندی متن">
          {[
            [Bold, 'درشت'],
            [Italic, 'مورب'],
            [Underline, 'زیرخط'],
          ].map(([Icon, label]) => (
            <Button key={label as string} iconOnly aria-label={label as string} variant="outlined">
              <Icon />
            </Button>
          ))}
        </ButtonGroup>
        <ButtonGroup orientation="vertical" aria-label="وضعیت سفارش">
          <Button variant="tonal" color="success">
            تکمیل
          </Button>
          <Button variant="tonal" color="warning">
            انتظار
          </Button>
          <Button variant="tonal" color="error">
            لغو
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <ButtonGroupText>تعداد</ButtonGroupText>
          <Button variant="outlined">−</Button>
          <Button variant="outlined">+</Button>
        </ButtonGroup>
      </div>
    </ShowcaseSection>
  );
}
