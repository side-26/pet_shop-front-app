'use client';

import { MapPin, Package, UserRound } from 'lucide-react';
import { Activity, useState, type ReactNode } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} size="lg" className="tw:gap-5">
      <div className="tw:min-w-0 tw:pb-1">
        <TabsList variant="line" aria-label="بخش‌های پروفایل" className="tw:w-full">
          <TabsTrigger value="orders" className="tw:min-w-0 tw:px-2 tw:sm:px-4">
            <Package aria-hidden="true" className="tw:hidden tw:sm:block" />
            سفارش‌ها
          </TabsTrigger>
          <TabsTrigger value="addresses" className="tw:min-w-0 tw:px-2 tw:sm:px-4">
            <MapPin aria-hidden="true" className="tw:hidden tw:sm:block" />
            نشانی‌ها
          </TabsTrigger>
          <TabsTrigger value="personal" className="tw:min-w-0 tw:px-2 tw:sm:px-4">
            <UserRound aria-hidden="true" className="tw:hidden tw:sm:block" />
            اطلاعات شخصی
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="orders" keepMounted>
        <Activity mode={activeTab === 'orders' ? 'visible' : 'hidden'}>{orders}</Activity>
      </TabsContent>
      <TabsContent value="addresses" keepMounted>
        <Activity mode={activeTab === 'addresses' ? 'visible' : 'hidden'}>{addresses}</Activity>
      </TabsContent>
      <TabsContent value="personal" keepMounted>
        <Activity mode={activeTab === 'personal' ? 'visible' : 'hidden'}>{personalInfo}</Activity>
      </TabsContent>
    </Tabs>
  );
}
