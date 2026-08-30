'use client';
import { EyeIcon, MoreHorizontalIcon, Trash2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/fields/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { PetTypeDTO } from '@/entities/pet-types/pet-types.dto';
import { usePetTypeRowActions } from '@/entities/pet-types/pet-types.client';
import { deletePetTypeAction } from '@/entities/pet-types/pet-types.actions';
import { toast } from '@/components/ui/toast';
import { globalErrorHandler } from '@/utils/helpers';
import { useCommonStore } from '@/stores/common.store';
type Props = { petTypes: PetTypeDTO[]; isLoading?: boolean; error?: string | null };
export function PetTypesTable({ petTypes, isLoading = false, error = null }: Props) {
  const router = useRouter();
  const { isPending, enable, disable } = usePetTypeRowActions(router.refresh);
  const showConfirmDialog = useCommonStore((state) => state.showConfirmDialog);
  function confirmDeletion(id: string, title: string) {
    showConfirmDialog({
      title: 'نوع حیوان حذف شود؟',
      message: `نوع حیوان «${title}» به‌صورت دائمی حذف خواهد شد. این عمل قابل بازگشت نیست.`,
      icon: Trash2Icon,
      variant: 'error',
      onSuccess: async () => {
        const result = await deletePetTypeAction({ id });
        if (!result.isSuccess) return globalErrorHandler(result);
        toast.add({ type: 'success', title: result.message });
        router.refresh();
      },
    });
  }
  return (
    <section
      aria-busy={isLoading || undefined}
      className={isLoading ? 'skeleton tw:pointer-events-none' : undefined}
    >
      {error ? (
        <p role="alert">{error}</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>عنوان</TableHead>
              <TableHead>توضیحات</TableHead>
              <TableHead>وضعیت</TableHead>
              <TableHead>عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {petTypes.length ? (
              petTypes.map((petType) => (
                <TableRow key={petType.id}>
                  <TableCell className="tw:font-medium">{petType.title}</TableCell>
                  <TableCell className="tw:max-w-80 tw:truncate">
                    {petType.description || '_'}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={petType.isEnabled}
                      loading={isPending}
                      onCheckedChange={(checked) =>
                        checked ? enable(petType.id) : disable(petType.id)
                      }
                      checkedColor="success"
                      uncheckedColor="error"
                      aria-label={`${petType.title}: ${petType.isEnabled ? 'فعال' : 'غیرفعال'}`}
                    />
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        disabled={isPending}
                        render={
                          <Button
                            type="button"
                            iconOnly
                            size="sm"
                            variant="flat"
                            color="secondary"
                            aria-label={`عملیات ${petType.title}`}
                          />
                        }
                      >
                        <MoreHorizontalIcon aria-hidden="true" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuGroup>
                          <DropdownMenuItem>
                            <EyeIcon aria-hidden="true" />
                            مشاهده و ویرایش
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => confirmDeletion(petType.id, petType.title)}
                          >
                            <Trash2Icon aria-hidden="true" />
                            حذف نوع حیوان
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="tw:text-center tw:text-muted-foreground">
                  نوع حیوانی یافت نشد.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </section>
  );
}
