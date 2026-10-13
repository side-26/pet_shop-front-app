'use client';

import { useDeferredValue, useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay = 500) {
  const deferredValue = useDeferredValue(value);
  const [debouncedValue, setDebouncedValue] = useState(deferredValue);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedValue(deferredValue), delay);

    return () => window.clearTimeout(timeoutId);
  }, [deferredValue, delay]);

  return debouncedValue;
}
