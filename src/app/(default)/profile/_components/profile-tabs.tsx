'use client';

import { CheckCircle2, House, MapPin, Package, Phone, Plus, Truck, UserRound } from 'lucide-react';
import { Activity, useState, type ReactNode } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { TextField } from '@/components/ui/fields/text-field';
import { Form } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/toast';

type AddressFormValues = {
  title: string;
  recipient: string;
  phone: string;
  postalCode: string;
  address: string;
};

const addresses = [
  {
    id: 'home',
    title: 'خانه',
    recipient: 'نیلوفر احمدی',
    phone: '09123456789',
    postalCode: '1998712345',
    address: 'تهران، سعادت‌آباد، خیابان علامه شمالی، کوچه بیستم، پلاک ۲۱، واحد ۸',
    primary: true,
  },
  {
    id: 'work',
    title: 'محل کار',
    recipient: 'نیلوفر احمدی',
    phone: '02188776655',
    postalCode: '1516718091',
    address: 'تهران، میدان ونک، خیابان ملاصدرا، خیابان پردیس، پلاک ۱۴، طبقه ۳',
    primary: false,
  },
] as const;

function AddAddressDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="lg" />}>
        <Plus data-icon="inline-start" aria-hidden="true" />
        افزودن نشانی
      </DialogTrigger>
      <DialogContent size="lg" className="tw:max-h-[calc(100svh-2rem)] tw:overflow-y-auto">
        <DialogHeader>
          <DialogTitle>افزودن نشانی جدید</DialogTitle>
          <DialogDescription>مشخصات گیرنده و نشانی کامل محل تحویل را وارد کنید.</DialogDescription>
        </DialogHeader>
        <Form<AddressFormValues>
          options={{
            defaultValues: { title: '', recipient: '', phone: '', postalCode: '', address: '' },
          }}
          handleSubmit={() => {
            setOpen(false);
            toast.add({
              title: 'نشانی جدید ثبت شد',
              description: 'نشانی به فهرست محل‌های تحویل شما اضافه شد.',
              type: 'success',
            });
          }}
        >
          {({ formState: { isSubmitting } }) => (
            <>
              <div className="tw:grid tw:items-start tw:gap-4 tw:sm:grid-cols-2">
                <TextField<AddressFormValues>
                  name="title"
                  label="عنوان نشانی"
                  placeholder="مثلاً خانه"
                  prefixIcon={<House />}
                />
                <TextField<AddressFormValues>
                  name="recipient"
                  label="نام گیرنده"
                  prefixIcon={<UserRound />}
                />
                <TextField<AddressFormValues>
                  name="phone"
                  label="شماره تماس"
                  prefixIcon={<Phone />}
                  type="tel"
                  inputMode="tel"
                />
                <TextField<AddressFormValues>
                  name="postalCode"
                  label="کد پستی"
                  prefixIcon={<MapPin />}
                  inputMode="numeric"
                  dir="ltr"
                />
                <div className="tw:sm:col-span-2">
                  <TextField<AddressFormValues>
                    name="address"
                    label="نشانی کامل"
                    prefixIcon={<MapPin />}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" isLoading={isSubmitting} loadingText="در حال ثبت">
                  ثبت نشانی
                </Button>
              </DialogFooter>
            </>
          )}
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function AddressesPanel() {
  return (
    <section className="tw:flex tw:flex-col tw:gap-4" aria-labelledby="addresses-heading">
      <div className="tw:flex tw:flex-col tw:items-start tw:justify-between tw:gap-4 tw:sm:flex-row tw:sm:items-end">
        <div className="tw:flex tw:flex-col tw:gap-1">
          <h2 id="addresses-heading" className="tw:text-title-l">
            نشانی‌های من
          </h2>
          <p className="tw:text-body-m tw:text-muted-foreground">
            محل‌های تحویل سفارش را مشاهده یا مدیریت کنید.
          </p>
        </div>
        <AddAddressDialog />
      </div>

      <div className="tw:grid tw:gap-4 tw:md:grid-cols-2">
        {addresses.map((address) => (
          <Card key={address.id} variant="outlined" size="md">
            <CardHeader>
              <CardTitle className="tw:flex tw:items-center tw:gap-2">
                <span className="tw:flex tw:size-9 tw:items-center tw:justify-center tw:rounded-xl tw:bg-primary-muted tw:text-primary-muted-foreground">
                  {address.id === 'home' ? (
                    <House className="tw:size-4.5" aria-hidden="true" />
                  ) : (
                    <MapPin className="tw:size-4.5" aria-hidden="true" />
                  )}
                </span>
                {address.title}
              </CardTitle>
              {address.primary && (
                <CardAction>
                  <Badge variant="tonal" color="primary">
                    نشانی پیش‌فرض
                  </Badge>
                </CardAction>
              )}
            </CardHeader>
            <CardContent className="tw:flex tw:flex-col tw:gap-4">
              <p className="tw:text-body-m tw:leading-8">{address.address}</p>
              <dl className="tw:grid tw:gap-2 tw:text-body-s tw:text-muted-foreground tw:sm:grid-cols-2">
                <div className="tw:flex tw:items-center tw:gap-2">
                  <UserRound className="tw:size-4 tw:shrink-0" aria-hidden="true" />
                  <dt className="tw:sr-only">گیرنده</dt>
                  <dd>{address.recipient}</dd>
                </div>
                <div className="tw:flex tw:items-center tw:gap-2">
                  <Phone className="tw:size-4 tw:shrink-0" aria-hidden="true" />
                  <dt className="tw:sr-only">شماره تماس</dt>
                  <dd>
                    <bdi dir="ltr">{address.phone}</bdi>
                  </dd>
                </div>
                <div className="tw:flex tw:items-center tw:gap-2 tw:sm:col-span-2">
                  <Truck className="tw:size-4 tw:shrink-0" aria-hidden="true" />
                  <dt>کد پستی:</dt>
                  <dd>
                    <bdi dir="ltr">{address.postalCode}</bdi>
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

export function ProfileTabs({
  orders,
  personalInfo,
}: {
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
        <Activity mode={activeTab === 'addresses' ? 'visible' : 'hidden'}>
          <AddressesPanel />
        </Activity>
      </TabsContent>
      <TabsContent value="personal" keepMounted>
        <Activity mode={activeTab === 'personal' ? 'visible' : 'hidden'}>{personalInfo}</Activity>
      </TabsContent>
    </Tabs>
  );
}
