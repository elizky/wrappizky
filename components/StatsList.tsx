/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface StatsListProps {
  items: any[];
  renderItem: (item: any) => React.ReactNode;
  initialCount?: number;
}

export function StatsList({ items, renderItem, initialCount = 5 }: StatsListProps) {
  const [currentPage, setCurrentPage] = useState(0);

  const displayCount = initialCount;
  const startIndex = currentPage * displayCount;
  const displayedItems = items.slice(startIndex, startIndex + displayCount);

  return (
    <div className='space-y-4'>
      <ul className={cn('space-y-2', displayedItems.length < items.length && 'mb-4')}>
        {displayedItems.map((item, index) => (
          <li key={startIndex + index}>{renderItem(item)}</li>
        ))}
      </ul>
      <div className={`flex ${currentPage === 0 ? 'justify-end' : 'justify-between'}`}>
        {currentPage > 0 && (
          <Button
            variant='outline'
            size='sm'
            className='w-1/3'
            onClick={() => setCurrentPage(currentPage - 1)}
            >
            Show Less
          </Button>
        )}
        {startIndex + displayCount < items.length && (
          <Button
            variant='outline'
            size='sm'
            className='w-1/3'
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            {`See More`}
          </Button>
        )}
      </div>
    </div>
  );
}
