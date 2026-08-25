'use client';

import {
  AtSign,
  CalendarDays,
  CheckCircle2,
  CircleX,
  Clock3,
  FileText,
  House,
  MapPin,
  Package,
  PackageCheck,
  Phone,
  Plus,
  Save,
  Truck,
  UserRound,
} from 'lucide-react';
import { useState } from 'react';

import { Badge, type BadgeProps } from '@/components/ui/badge';
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

type ProfileFormValues = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  birthDate: string;
};

type AddressFormValues = {
  title: string;
  recipient: string;
  phone: string;
  postalCode: string;
  address: string;
};

type Order = {
  id: string;
  date: string;
  total: string;
  itemCount: number;
  status: 'delivered' | 'processing' | 'cancelled';
  statusLabel: string;
  products: readonly string[];
  address: string;
};

const orders: readonly Order[] = [
  {
    id: 'PH-1405-2841',
    date: '۱۸ مرداد ۱۴۰۵',
    total: '۲٬۴۸۰٬۰۰۰ تومان',
    itemCount: 3,
    status: 'delivered',
    statusLabel: 'تحویل‌شده',
    products: ['غذای خشک گربه رویال کنین', 'خاک گربه کربن‌دار', 'اسباب‌بازی توپ زنگوله‌ای'],
    address: 'تهران، سعادت‌آباد، خیابان علامه شمالی، پلاک ۲۱، واحد ۸',
  },
  {
    id: 'PH-1405-2716',
    date: '۱۲ مرداد ۱۴۰۵',
    total: '۱٬۳۲۰٬۰۰۰ تومان',
    itemCount: 2,
    status: 'processing',
    statusLabel: 'در حال آماده‌سازی',
    products: ['تشک طبی سگ سایز متوسط', 'شامپو پوست حساس'],
    address: 'تهران، سعادت‌آباد، خیابان علامه شمالی، پلاک ۲۱، واحد ۸',
  },
  {
    id: 'PH-1405-2559',
    date: '۳ مرداد ۱۴۰۵',
    total: '۸۶۵٬۰۰۰ تومان',
    itemCount: 1,
    status: 'cancelled',
    statusLabel: 'لغوشده',
    products: ['باکس حمل حیوان خانگی'],
    address: 'تهران، خیابان ولیعصر، بالاتر از پارک ملت، پلاک ۱۲۳',
  },
];

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

const statusAppearance: Record<
  Order['status'],
  { color: NonNullable<BadgeProps['color']>; icon: typeof CheckCircle2 }
> = {
  delivered: { color: 'success', icon: CheckCircle2 },
  processing: { color: 'warning', icon: Clock3 },
  cancelled: { color: 'error', icon: CircleX },
};

function PersonalInformationPanel() {
  return (
    <Card variant="outlined" size="lg">
      <CardHeader>
        <CardTitle>اطلاعات شخصی</CardTitle>
        <CardDescription>اطلاعات تماس و مشخصات حساب کاربری خود را ویرایش کنید.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form<ProfileFormValues>
          options={{
            defaultValues: {
              firstName: 'نیلوفر',
              lastName: 'احمدی',
              phone: '09123456789',
              email: 'niloofar.ahmadi@example.com',
              birthDate: '۱۳۷۴/۰۶/۱۸',
            },
          }}
          handleSubmit={() =>
            toast.add({
              title: 'اطلاعات پروفایل ذخیره شد',
              description: 'تغییرات حساب کاربری شما با موفقیت ثبت شد.',
              type: 'success',
            })
          }
        >
          {({ formState: { isSubmitting } }) => (
            <>
              <div className="tw:grid tw:items-start tw:gap-4 tw:md:grid-cols-2">
                <TextField<ProfileFormValues>
                  name="firstName"
                  label="نام"
                  prefixIcon={<UserRound />}
                  size="lg"
                />
                <TextField<ProfileFormValues>
                  name="lastName"
                  label="نام خانوادگی"
                  prefixIcon={<UserRound />}
                  size="lg"
                />
                <TextField<ProfileFormValues>
                  name="phone"
                  label="شماره موبایل"
                  prefixIcon={<Phone />}
                  type="tel"
                  inputMode="tel"
                  size="lg"
                />
                <TextField<ProfileFormValues>
                  name="email"
                  label="ایمیل"
                  prefixIcon={<AtSign />}
                  type="email"
                  dir="ltr"
                  size="lg"
                />
                <TextField<ProfileFormValues>
                  name="birthDate"
                  label="تاریخ تولد"
                  prefixIcon={<CalendarDays />}
                  hint="نمونه: ۱۳۷۴/۰۶/۱۸"
                  size="lg"
                  className="tw:md:max-w-sm"
                />
              </div>
              <div className="tw:flex tw:justify-end">
                <Button type="submit" size="lg" isLoading={isSubmitting} loadingText="در حال ذخیره">
                  <Save data-icon="inline-start" aria-hidden="true" />
                  ذخیره تغییرات
                </Button>
              </div>
            </>
          )}
        </Form>
      </CardContent>
    </Card>
  );
}

function OrderStatusBadge({ order }: { order: Order }) {
  const appearance = statusAppearance[order.status];
  const StatusIcon = appearance.icon;

  return (
    <Badge variant="tonal" color={appearance.color} size="lg">
      <StatusIcon aria-hidden="true" />
      {order.statusLabel}
    </Badge>
  );
}

function OrderDetailDialog({ order }: { order: Order }) {
  return (
    <Dialog>
      <DialogTrigger
        render={<Button block variant="outlined" size="md" className="tw:lg:w-auto" />}
      >
        <FileText data-icon="inline-start" aria-hidden="true" />
        جزئیات سفارش
      </DialogTrigger>
      <DialogContent size="xl" className="tw:max-h-[calc(100svh-2rem)] tw:overflow-y-auto">
        <DialogHeader>
          <div className="tw:flex tw:flex-wrap tw:items-center tw:gap-2 tw:pe-10">
            <DialogTitle>جزئیات سفارش</DialogTitle>
            <OrderStatusBadge order={order} />
          </div>
          <DialogDescription>
            سفارش شماره <bdi dir="ltr">{order.id}</bdi> در تاریخ {order.date}
          </DialogDescription>
        </DialogHeader>

        <div className="tw:grid tw:gap-4 tw:sm:grid-cols-2">
          <div className="tw:flex tw:flex-col tw:gap-1 tw:rounded-2xl tw:bg-muted tw:p-4">
            <span className="tw:text-label-m tw:text-muted-foreground">مبلغ پرداخت‌شده</span>
            <strong className="tw:text-title-m tw:text-foreground">{order.total}</strong>
          </div>
          <div className="tw:flex tw:flex-col tw:gap-1 tw:rounded-2xl tw:bg-muted tw:p-4">
            <span className="tw:text-label-m tw:text-muted-foreground">تعداد کالا</span>
            <strong className="tw:text-title-m tw:text-foreground">{order.itemCount} کالا</strong>
          </div>
        </div>

        <section className="tw:flex tw:flex-col tw:gap-3" aria-labelledby={`products-${order.id}`}>
          <h3 id={`products-${order.id}`} className="tw:text-title-s">
            کالاهای سفارش
          </h3>
          <ul className="tw:flex tw:flex-col tw:gap-2">
            {order.products.map((product) => (
              <li
                key={product}
                className="tw:flex tw:items-center tw:gap-3 tw:rounded-2xl tw:border tw:border-border tw:bg-card tw:p-3"
              >
                <span className="tw:flex tw:size-10 tw:shrink-0 tw:items-center tw:justify-center tw:rounded-xl tw:bg-primary-muted tw:text-primary-muted-foreground">
                  <Package className="tw:size-5" aria-hidden="true" />
                </span>
                <span className="tw:text-body-m">{product}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="tw:flex tw:flex-col tw:gap-2" aria-labelledby={`address-${order.id}`}>
          <h3 id={`address-${order.id}`} className="tw:text-title-s">
            نشانی تحویل
          </h3>
          <p className="tw:flex tw:items-start tw:gap-2 tw:rounded-2xl tw:bg-info-muted tw:p-4 tw:text-body-m tw:text-info-muted-foreground">
            <MapPin className="tw:mt-1 tw:size-4 tw:shrink-0" aria-hidden="true" />
            {order.address}
          </p>
        </section>

        <DialogFooter>
          <Button variant="tonal" color="primary">
            <PackageCheck data-icon="inline-start" aria-hidden="true" />
            پیگیری سفارش
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function OrdersPanel() {
  return (
    <section className="tw:flex tw:flex-col tw:gap-4" aria-labelledby="orders-heading">
      <div className="tw:flex tw:flex-col tw:gap-1">
        <h2 id="orders-heading" className="tw:text-title-l">
          سفارش‌های من
        </h2>
        <p className="tw:text-body-m tw:text-muted-foreground">
          وضعیت سفارش‌ها را ببینید و جزئیات ارسال را بررسی کنید.
        </p>
      </div>
      <div className="tw:grid tw:gap-4 tw:lg:grid-cols-2">
        {orders.map((order) => (
          <Card key={order.id} variant="outlined" size="md">
            <CardHeader>
              <CardTitle className="tw:flex tw:flex-wrap tw:items-center tw:gap-2">
                سفارش <bdi dir="ltr">{order.id}</bdi>
              </CardTitle>
              <CardDescription>{order.date}</CardDescription>
              <CardAction>
                <OrderStatusBadge order={order} />
              </CardAction>
            </CardHeader>
            <CardContent>
              <dl className="tw:grid tw:grid-cols-2 tw:gap-3">
                <div className="tw:flex tw:flex-col tw:gap-1">
                  <dt className="tw:text-label-m tw:text-muted-foreground">مبلغ سفارش</dt>
                  <dd className="tw:text-title-s">{order.total}</dd>
                </div>
                <div className="tw:flex tw:flex-col tw:gap-1">
                  <dt className="tw:text-label-m tw:text-muted-foreground">تعداد کالا</dt>
                  <dd className="tw:text-title-s">{order.itemCount} کالا</dd>
                </div>
              </dl>
            </CardContent>
            <CardFooter className="tw:justify-end tw:border-t tw:border-border/70 tw:pt-4">
              <OrderDetailDialog order={order} />
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}

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

export function ProfileTabs() {
  return (
    <Tabs defaultValue="personal" size="lg" className="tw:gap-5">
      <div className="tw:min-w-0 tw:pb-1">
        <TabsList variant="line" aria-label="بخش‌های پروفایل" className="tw:w-full">
          <TabsTrigger value="personal" className="tw:min-w-0 tw:px-2 tw:sm:px-4">
            <UserRound aria-hidden="true" />
            اطلاعات شخصی
          </TabsTrigger>
          <TabsTrigger value="orders" className="tw:min-w-0 tw:px-2 tw:sm:px-4">
            <Package aria-hidden="true" />
            سفارش‌ها
          </TabsTrigger>
          <TabsTrigger value="addresses" className="tw:min-w-0 tw:px-2 tw:sm:px-4">
            <MapPin aria-hidden="true" />
            نشانی‌ها
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="personal">
        <PersonalInformationPanel />
      </TabsContent>
      <TabsContent value="orders">
        <OrdersPanel />
      </TabsContent>
      <TabsContent value="addresses">
        <AddressesPanel />
      </TabsContent>
    </Tabs>
  );
}
