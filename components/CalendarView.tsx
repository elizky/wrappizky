'use client';

import { useState, useMemo } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { SpotifyListeningData } from '@/types/spotify';
import { ListeningCard } from '@/components/ListeningCard';
import { getListeningHistoryByDate } from '@/lib/analytics';
import { getAvailableDates, isDateDisabled } from '@/lib/date-utils';
import { CalendarX2 } from 'lucide-react';

interface CalendarViewProps {
  data: SpotifyListeningData[];
}

export function CalendarView({ data }: CalendarViewProps) {
  const availableDates = useMemo(() => getAvailableDates(data), [data]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(() => {
    // Find the most recent available date that isn't in the future
    const today = new Date();
    return availableDates
      .filter((date) => date <= today)
      .sort((a, b) => b.getTime() - a.getTime())[0];
  });

  const dailyHistory = selectedDate ? getListeningHistoryByDate(data, selectedDate) : [];

  return (
    <div className='grid gap-6 md:grid-cols-[300px_1fr]'>
      <Card className='border-none'>
        <CardContent className='p-4'>
          <Calendar
            mode='single'
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={(date) => isDateDisabled(date) as boolean}
            className='rounded-md border'
          />
          <div className='mt-4 text-sm text-muted-foreground'>
            <p className='flex items-center gap-2'>
              <CalendarX2 className='h-4 w-4' />
              Dates without listening data are disabled
            </p>
          </div>
        </CardContent>
      </Card>

      <div className='space-y-4'>
        {selectedDate && (
          <h3 className='text-lg font-semibold capitalize'>
            {selectedDate.toLocaleDateString(undefined, {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </h3>
        )}
        {dailyHistory.length === 0 ? (
          <p className='text-muted-foreground'>No listening history for this date.</p>
        ) : (
          <div className='grid gap-4 lg:grid-cols-2'>
            {dailyHistory.map((entry, index) => (
              <ListeningCard key={`${entry.ts}-${index}`} data={entry} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
