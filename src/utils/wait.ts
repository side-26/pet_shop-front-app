export function wait(durationMs: number): Promise<void> {
  return new Promise((resolve) => {
    const timeoutId = setTimeout(() => {
      clearTimeout(timeoutId);
      resolve();
    }, durationMs);
  });
}
