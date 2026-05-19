import readingTime from 'reading-time';

export function minutesOf(body: string): number {
  if (!body) return 1;
  const stat = readingTime(body);
  return Math.max(1, Math.round(stat.minutes));
}
