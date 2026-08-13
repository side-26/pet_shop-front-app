'use client';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ShowcaseSection } from './showcase-section';

export function CollapsibleShowcase() {
  return (
    <ShowcaseSection
      id="collapsibles"
      title="Collapsible"
      description="محتوای بازشونده Base UI با انیمیشن ارتفاع و شفافیت Framer Motion و احترام به reduced motion."
    >
      <div className="tw:grid tw:max-w-xl tw:gap-3">
        {['جزئیات واکسیناسیون', 'شرایط ارسال'].map((label, index) => (
          <Collapsible
            key={label}
            defaultOpen={index === 0}
            className="tw:rounded-2xl tw:border tw:border-border tw:bg-background/75 tw:p-2"
          >
            <CollapsibleTrigger
              render={
                <Button
                  variant="flat"
                  color={index ? 'secondary' : 'primary'}
                  className="tw:w-full tw:justify-between"
                />
              }
            >
              <span>{label}</span>
              <ChevronDown
                data-icon="inline-end"
                className="tw:transition-transform tw:group-aria-expanded/button:rotate-180"
              />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="tw:px-4 tw:pb-4 tw:pt-2 tw:text-body-s tw:text-muted-foreground">
                این بخش با حفظ ساختار دسترس‌پذیر، نرم باز و بسته می‌شود.
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </ShowcaseSection>
  );
}
