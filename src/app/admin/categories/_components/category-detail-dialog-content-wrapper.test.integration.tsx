import { DirectionProvider } from '@base-ui/react/direction-provider';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { Dialog } from '@/components/ui/dialog';

import { CategoryDetailFormBody } from './category-detail-dialog-content-wrapper';

const category = {
  id: '507f1f77bcf86cd799439012',
  title: 'غذای خشک',
  petType: '507f1f77bcf86cd799439011',
  mainImage: 'https://cdn.example.test/category.webp',
  isEnable: true,
};

afterEach(cleanup);

describe('CategoryDetailFormBody', () => {
  it('does not require a replacement file when the category already has an image URL', () => {
    render(
      <DirectionProvider direction="rtl">
        <Dialog open>
          <CategoryDetailFormBody
            formRef={{ current: null }}
            handleSubmit={() => undefined}
            category={category}
            petTypes={[{ value: category.petType, label: 'سگ' }]}
          />
        </Dialog>
      </DirectionProvider>,
    );

    expect(screen.getByLabelText('انتخاب تصویر اصلی دسته‌بندی').hasAttribute('required')).toBe(
      false,
    );
    expect(screen.queryByText('فعال')).toBeNull();
  });
});
