import { Expose, Transform, Type } from 'class-transformer';

import type { OrderDTO } from '@/entities/orders/orders.dto';

function userFullName(user: OrderDTO['user']) {
  if (!user || typeof user === 'string') return '—';
  return `${user.firstName} ${user.lastName}`.trim() || '—';
}

export class OrderTableRow {
  @Expose({ name: '_id' })
  declare id: string;

  @Expose()
  declare orderNumber: string;

  @Expose()
  declare trackingCode: string;

  @Expose()
  @Transform(({ obj }) => userFullName(obj.user), { toClassOnly: true })
  declare userFullName: string;

  @Expose()
  declare totalPrice: number;

  @Expose()
  declare paymentStatus: OrderDTO['paymentStatus'];

  @Expose()
  declare deliveryState: number;
}

export class OrdersTableViewModel {
  @Expose({ name: 'result' })
  @Type(() => OrderTableRow)
  declare orders: OrderTableRow[];

  @Expose()
  @Transform(({ obj }) => Math.max(1, obj.pagination?.currentPage ?? 1), { toClassOnly: true })
  declare page: number;

  @Expose()
  @Transform(({ obj }) => Math.max(1, obj.pagination?.totalPages ?? 1), { toClassOnly: true })
  declare pageCount: number;

  @Expose()
  @Transform(({ obj }) => Math.max(0, obj.pagination?.totalItems ?? 0), { toClassOnly: true })
  declare total: number;
}
