'use client';
import { useRouter } from 'nextjs-toploader/app';
import { Switch } from '@/components/ui/fields/switch';
import { useBrandStatus } from '@/entities/brands/brands.client';
import type { BrandTableRow } from './brands-table.types';
export function BrandEnabledSwitch({
  brand,
  disabled = false,
}: {
  brand: BrandTableRow;
  disabled?: boolean;
}) {
  const router = useRouter();
  const { isPending, update } = useBrandStatus(router.refresh);

  return (
    <Switch
      checked={brand.isEnable}
      loading={isPending}
      disabled={disabled}
      size="sm"
      checkedColor="success"
      uncheckedColor="error"
      aria-label={`${brand.title}: ${brand.isEnable ? 'فعال' : 'غیرفعال'}`}
      onCheckedChange={(checked) => update(brand.id, checked)}
    />
  );
}
