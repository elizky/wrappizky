import { SpotifyListeningData } from '@/types/spotify';

export function getAvailableDates(data: SpotifyListeningData[]): Date[] {
  const uniqueDates = new Set<string>();

  data.forEach((entry) => {
    const date = new Date(entry.ts);
    uniqueDates.add(date.toISOString().split('T')[0]);
  });

  return Array.from(uniqueDates).map((dateStr) => new Date(dateStr));
}

export function isDateDisabled(date: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Disable future dates
  if (date > today) {
    return true;
  }
}
