'use client';

import { MapPin, Package, UserRound } from 'lucide-react';
import { Activity, useRef, useState, type CSSProperties, type ReactNode } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const profileTabDefinitions = [
  { value: 'orders', label: 'سفارش‌ها', Icon: Package, eager: false },
  { value: 'addresses', label: 'نشانی‌ها', Icon: MapPin, eager: false },
  { value: 'personal', label: 'اطلاعات شخصی', Icon: UserRound, eager: true },
] as const;

type ProfileTabValue = (typeof profileTabDefinitions)[number]['value'];

function isProfileTabValue(value: string): value is ProfileTabValue {
  return profileTabDefinitions.some((tab) => tab.value === value);
}

export function ProfileTabs({
  addresses,
  orders,
  personalInfo,
}: {
  addresses: ReactNode;
  orders: ReactNode;
  personalInfo: ReactNode;
}) {
  const [activeTab, setActiveTab] = useState('personal');
  const [mountedTabs, setMountedTabs] = useState<ReadonlySet<ProfileTabValue>>(
    () => new Set(profileTabDefinitions.filter((tab) => tab.eager).map((tab) => tab.value)),
  );
  const [contentMinHeight, setContentMinHeight] = useState<number>();
  const activeContentRef = useRef<HTMLDivElement>(null);
  const contentByTab: Record<ProfileTabValue, ReactNode> = {
    addresses,
    orders,
    personal: personalInfo,
  };

  function handleTabChange(nextTab: string) {
    if (!isProfileTabValue(nextTab)) return;

    const currentHeight = activeContentRef.current?.getBoundingClientRect().height;

    if (currentHeight) setContentMinHeight(currentHeight);

    setMountedTabs((currentTabs) => {
      if (currentTabs.has(nextTab)) return currentTabs;

      return new Set(currentTabs).add(nextTab);
    });
    setActiveTab(nextTab);
  }

  const contentStyle: CSSProperties | undefined = contentMinHeight
    ? { minHeight: contentMinHeight }
    : undefined;

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} size="lg" className="tw:gap-5">
      <div className="tw:min-w-0 tw:pb-1">
        <TabsList variant="line" aria-label="بخش‌های پروفایل" className="tw:w-full">
          {profileTabDefinitions.map(({ Icon, label, value }) => (
            <TabsTrigger key={value} value={value} className="tw:min-w-0 tw:px-2 tw:sm:px-4">
              <Icon aria-hidden="true" className="tw:hidden tw:sm:block" />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {profileTabDefinitions.map(({ value }) =>
        mountedTabs.has(value) ? (
          <TabsContent key={value} value={value} keepMounted style={contentStyle}>
            <div ref={activeTab === value ? activeContentRef : undefined}>
              <Activity mode={activeTab === value ? 'visible' : 'hidden'}>
                {contentByTab[value]}
              </Activity>
            </div>
          </TabsContent>
        ) : null,
      )}
    </Tabs>
  );
}
