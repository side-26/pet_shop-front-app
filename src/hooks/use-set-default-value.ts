'use client';

import { useEffect, useState } from 'react';

export function useSetDefaultValue<T>(value: T, delay = 350) {
  const [defaultValue, setDefaultValue] = useState(value);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDefaultValue(value), delay);

    return () => window.clearTimeout(timeoutId);
  }, [delay, value]);

  return defaultValue;
}
