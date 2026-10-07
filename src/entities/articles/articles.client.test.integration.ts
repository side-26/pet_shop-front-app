import { beforeEach, describe, expect, it, vi } from 'vitest';

import { toast } from '@/components/ui/toast';
import { globalErrorHandler } from '@/utils/helpers';

import {
  createArticleAction,
  deleteArticleAction,
  updateArticleAction,
  updateArticleMainTextAction,
  replaceArticleTagsAction,
} from './articles.actions';
import {
  submitArticleMainTextUpdate,
  submitCreateArticle,
  submitDeleteArticle,
  submitUpdateArticle,
  submitArticleTagsReplacement,
} from './articles.client';

vi.mock('./articles.actions', () => ({
  createArticleAction: vi.fn(),
  deleteArticleAction: vi.fn(),
  updateArticleAction: vi.fn(),
  updateArticleMainTextAction: vi.fn(),
  replaceArticleTagsAction: vi.fn(),
}));
vi.mock('@/components/ui/toast', () => ({ toast: { add: vi.fn() } }));
vi.mock('@/utils/helpers', () => ({ globalErrorHandler: vi.fn() }));

const id = '507f1f77bcf86cd799439011';
const input = {
  title: 'راهنمای مراقبت از سگ',
  subtitle: 'آنچه برای شروع باید بدانید',
  mainImage: new File(['image'], 'dog.webp', { type: 'image/webp' }),
  mainText: { type: 'doc' as const, content: [] },
};
const failure = {
  isSuccess: false as const,
  message: 'ناموفق',
  data: { messages: {}, details: {} },
};

describe('article client orchestration', () => {
  beforeEach(() => vi.clearAllMocks());

  it('submits each mutation and surfaces the backend success message', async () => {
    const success = { isSuccess: true as const, message: 'موفق', data: {} as never };
    vi.mocked(createArticleAction).mockResolvedValue(success);
    vi.mocked(updateArticleAction).mockResolvedValue(success);
    vi.mocked(updateArticleMainTextAction).mockResolvedValue(success);
    vi.mocked(deleteArticleAction).mockResolvedValue(success);
    vi.mocked(replaceArticleTagsAction).mockResolvedValue(success);

    await expect(submitCreateArticle(input, vi.fn())).resolves.toBe(true);
    await expect(submitUpdateArticle(id, { summary: 'خلاصه تازه' }, vi.fn())).resolves.toBe(true);
    await expect(
      submitArticleMainTextUpdate(id, { mainText: input.mainText }, vi.fn()),
    ).resolves.toBe(true);
    await expect(submitDeleteArticle(id)).resolves.toBe(true);
    await expect(
      submitArticleTagsReplacement(id, { tags: [{ title: 'سگ' }] }, vi.fn()),
    ).resolves.toBe(true);

    expect(updateArticleAction).toHaveBeenCalledWith({ id, summary: 'خلاصه تازه' });
    expect(updateArticleMainTextAction).toHaveBeenCalledWith({ id, mainText: input.mainText });
    expect(deleteArticleAction).toHaveBeenCalledWith({ id });
    expect(replaceArticleTagsAction).toHaveBeenCalledWith({ id, tags: [{ title: 'سگ' }] });
    expect(toast.add).toHaveBeenCalledTimes(5);
  });

  it('forwards complete errors and never reports false successes', async () => {
    const setError = vi.fn();
    vi.mocked(createArticleAction).mockResolvedValue(failure);
    vi.mocked(updateArticleAction).mockResolvedValue(failure);
    vi.mocked(updateArticleMainTextAction).mockResolvedValue(failure);
    vi.mocked(deleteArticleAction).mockResolvedValue(failure);
    vi.mocked(replaceArticleTagsAction).mockResolvedValue(failure);

    await expect(submitCreateArticle(input, setError)).resolves.toBe(false);
    await expect(submitUpdateArticle(id, { summary: 'خلاصه تازه' }, setError)).resolves.toBe(false);
    await expect(
      submitArticleMainTextUpdate(id, { mainText: input.mainText }, setError),
    ).resolves.toBe(false);
    await expect(submitDeleteArticle(id)).resolves.toBe(false);
    await expect(
      submitArticleTagsReplacement(id, { tags: [{ title: 'سگ' }] }, setError),
    ).resolves.toBe(false);

    expect(globalErrorHandler).toHaveBeenNthCalledWith(1, failure, { showErrorFields: setError });
    expect(globalErrorHandler).toHaveBeenNthCalledWith(2, failure, { showErrorFields: setError });
    expect(globalErrorHandler).toHaveBeenNthCalledWith(3, failure, { showErrorFields: setError });
    expect(globalErrorHandler).toHaveBeenNthCalledWith(4, failure);
    expect(globalErrorHandler).toHaveBeenNthCalledWith(5, failure, { showErrorFields: setError });
    expect(toast.add).not.toHaveBeenCalled();
  });
});
