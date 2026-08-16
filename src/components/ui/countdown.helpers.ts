export type CountdownParts = Readonly<{
  hours: string | null;
  minutes: string;
  seconds: string;
}>;

export function normalizeCountdownSeconds(seconds: number) {
  if (!Number.isFinite(seconds)) return 0;

  return Math.max(0, Math.floor(seconds));
}

export function getCountdownParts(seconds: number): CountdownParts {
  const totalSeconds = normalizeCountdownSeconds(seconds);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remainingSeconds = totalSeconds % 60;

  return {
    hours: hours > 0 ? String(hours).padStart(2, '0') : null,
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(remainingSeconds).padStart(2, '0'),
  };
}

export function formatCountdown(seconds: number) {
  const { hours, minutes, seconds: remainingSeconds } = getCountdownParts(seconds);

  return hours === null
    ? `${minutes}:${remainingSeconds}`
    : `${hours}:${minutes}:${remainingSeconds}`;
}
