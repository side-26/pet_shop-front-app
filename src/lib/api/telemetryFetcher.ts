'use client';

type TelemetryFetcherOptions = Readonly<{
  body: unknown;
  url: string;
}>;

/**
 * Sends best-effort browser telemetry without entering normal application
 * fetchers, whose own failure reporting would otherwise recurse.
 */
export function telemetryFetcher({ body, url }: TelemetryFetcherOptions): void {
  try {
    void fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
      keepalive: true,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).catch(() => undefined);
  } catch {
    // Telemetry transport failures must not affect the user operation.
  }
}
