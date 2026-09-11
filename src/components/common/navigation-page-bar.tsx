'use client';

import NextTopLoader from 'nextjs-toploader';

/**
 * Global route-progress feedback. The root document supplies RTL direction;
 * the loader spans the full viewport and therefore remains direction-neutral.
 */
export function NavigationPageBar() {
  return (
    <div dir="rtl">
      <NextTopLoader color="var(--primary)" showSpinner={false} height={3} />
    </div>
  );
}
