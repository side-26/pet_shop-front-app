import { beforeEach, describe, expect, it, vi } from 'vitest';
import { USER_ROLES } from '@/configs/user-role';
import { getSession } from '@/utils/session';
import {
  createProductAction,
  deleteProductAction,
  getCustomerProductsAction,
  getManagementProductsAction,
  getProductMainInfoAction,
  updateProductPriceAction,
} from './products.actions';
import * as service from './products.service';
vi.mock('@/utils/session', () => ({ getSession: vi.fn() }));
vi.mock('./products.service', () => ({
  createProduct: vi.fn(),
  deleteProduct: vi.fn(),
  getCustomerProducts: vi.fn(),
  getManagementProducts: vi.fn(),
  updateProductPrice: vi.fn(),
  getCustomerProduct: vi.fn(),
  getManagementProduct: vi.fn(),
  getProductImages: vi.fn(),
  getProductMainInfo: vi.fn(),
  getProductPrice: vi.fn(),
  updateProductBaseInfo: vi.fn(),
  updateProductImages: vi.fn(),
  enableProduct: vi.fn(),
  disableProduct: vi.fn(),
}));
const session = vi.mocked(getSession);
const id = '507f1f77bcf86cd799439010';
const category = '507f1f77bcf86cd799439011';
const description = { type: 'doc' as const, content: [] };
const image = new File(['x'], 'product.webp', { type: 'image/webp' });
const ok = { isSuccess: true as const, message: 'ok', data: {} as never };
describe('product actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    session.mockResolvedValue({ role: USER_ROLES.ADMIN } as never);
  });
  it('allows public product queries without a session', async () => {
    session.mockResolvedValue(null);
    vi.mocked(service.getCustomerProducts).mockResolvedValue(ok);
    await expect(getCustomerProductsAction({ category })).resolves.toBe(ok);
    expect(service.getCustomerProducts).toHaveBeenCalledWith({
      category,
      page: 1,
      limit: 10,
      sort: 'createdAt',
    });
  });
  it('validates management creation and price updates before invoking services', async () => {
    vi.mocked(service.createProduct).mockResolvedValue(ok);
    vi.mocked(service.updateProductPrice).mockResolvedValue(ok);
    await createProductAction({
      title: ' غذا ',
      description,
      category,
      images: { images: [image], mainImageIndex: 0 },
    });
    await updateProductPriceAction({ id, price: 10 });
    expect(service.createProduct).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'غذا', quantity: 0 }),
    );
    expect(service.updateProductPrice).toHaveBeenCalledWith(id, { price: 10 });
  });
  it('authorizes and validates main-information section reads', async () => {
    vi.mocked(service.getProductMainInfo).mockResolvedValue(ok);
    await expect(getProductMainInfoAction({ id })).resolves.toBe(ok);
    expect(service.getProductMainInfo).toHaveBeenCalledWith(id);

    session.mockResolvedValue({ role: USER_ROLES.CUSTOMER } as never);
    await expect(getProductMainInfoAction({ id })).resolves.toMatchObject({ isSuccess: false });
    expect(service.getProductMainInfo).toHaveBeenCalledTimes(1);
  });
  it('rejects customer management and non-admin deletion', async () => {
    session.mockResolvedValue({ role: USER_ROLES.CUSTOMER } as never);
    await expect(getManagementProductsAction()).resolves.toMatchObject({ isSuccess: false });
    await expect(deleteProductAction({ id })).resolves.toMatchObject({ isSuccess: false });
    expect(service.getManagementProducts).not.toHaveBeenCalled();
  });
});
