export const metadata = {
  title: 'سفارش',
  description: 'نتیجه سفارش کاربر',
};

export default async function Page({ params }: { params: Promise<{ authority: string }> }) {
  const { authority } = await params;

  // const
  return (
    <main className="tw:h-dvh tw:flex tw-items-center tw-justify-center tw:bg-gray-100 tw:p-4 tw:lg:p-6 tw:max-w-360 tw:mx-auto"></main>
  );
}
