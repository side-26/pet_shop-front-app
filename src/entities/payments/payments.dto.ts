import type { PaginateDataDTO } from '@/entities/pagination/pagination.dto';

import type {
  CreatePaymentInput,
  GetPaymentsInput,
  PaymentIdInput,
  RequestPaymentInput,
  UpdatePaymentStatusInput,
} from './payments.schema';

export type PaymentStatus = 'pending' | 'paid' | 'failed';

export type PaymentUserDTO = {
  _id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  role: string;
};

export type PaymentDTO = {
  _id: string;
  /** A prepared, stock-reserved order owned by the payment attempt. */
  order: string;
  user: string | PaymentUserDTO;
  amount: number;
  authority: string;
  status: PaymentStatus;
  gatewayReferenceId: string | null;
  expiresAt: string;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PaymentRequestDTO = {
  paymentId: string;
  authority: string;
  gatewayUrl: string;
};

export type GatewayPaymentDTO = {
  status: PaymentStatus;
  finalPrice: number;
  companyName: string;
  appUrl: string;
};

export type GatewayPaymentResultDTO = { success: true; callbackUrl: string };
export type PaymentsPageDTO = PaginateDataDTO<PaymentDTO>;
export type PaymentIdDTO = PaymentIdInput;
export type CreatePaymentDTO = CreatePaymentInput;
export type RequestPaymentDTO = RequestPaymentInput;
export type GetPaymentsQueryDTO = GetPaymentsInput;
export type GetPaymentsParams = Partial<GetPaymentsInput>;
export type UpdatePaymentStatusDTO = UpdatePaymentStatusInput;
