import { render, screen } from '@testing-library/react';
import { useRef } from 'react';
import { describe, expect, it } from 'vitest';

import type { FormHandle } from '@/components/ui/form';

import { CreateNewAddressLocationFormBody } from './create-new-address-dialog-content-wrapper';

function SkeletonFormBody() {
  const formRef = useRef<FormHandle<{ lngLat: readonly [number, number] }>>(null);

  return (
    <CreateNewAddressLocationFormBody formRef={formRef} handleSubmit={() => undefined} isSkeleton />
  );
}

describe('CreateNewAddressLocationFormBody', () => {
  it('uses the shared Form renderer for an accessible, disabled skeleton fallback', () => {
    const { container } = render(<SkeletonFormBody />);

    const form = screen.getByRole('form', { name: 'انتخاب موقعیت نشانی' });
    expect(form.getAttribute('aria-busy')).toBe('true');
    expect(form.className).toContain('skeleton');
    expect(form.className).toContain('tw:pointer-events-none');
    expect(container.querySelector('fieldset')?.hasAttribute('disabled')).toBe(true);
  });
});
