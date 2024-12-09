'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SpotifyListeningData } from '@/types/spotify';
import { Music2, Podcast, Clock, Globe2 } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

interface ListeningCardProps {
  data: SpotifyListeningData;
}

export function ListeningCard({ data }: ListeningCardProps) {
  const isEpisode = Boolean(data.episode_name);
  const duration = Math.round(data.ms_played / 1000);

  const formattedDate = formatDistanceToNow(new Date(data.ts), { addSuffix: true });

  return (
    <Card className='w-full border-primary/20 bg-secondary/50'>
      <CardHeader className='flex flex-col sm:flex-row sm:items-center justify-between space-y-0 gap-2 pb-2'>
        <CardTitle className='text-lg font-bold'>
          {isEpisode ? (
            <div className='flex items-center gap-2'>
              <Podcast className='h-5 w-5 text-primary hidden sm:flex' />
              <span>{data.episode_name}</span>
            </div>
          ) : (
            <div className='flex items-center gap-2'>
              <Music2 className='h-5 w-5 text-primary hidden sm:flex' />
              <span >{data.master_metadata_track_name}</span>
            </div>
          )}
        </CardTitle>
        <div className='flex items-center gap-2'>
          <Badge variant={data.skipped ? 'destructive' : 'secondary'} className='font-mono'>
            {data.skipped ? 'Skipped' : 'Completed'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className='grid gap-2'>
          {!isEpisode && (
            <div className='text-sm text-muted-foreground'>
              {data.master_metadata_album_artist_name} • {data.master_metadata_album_album_name}
            </div>
          )}
          {isEpisode && (
            <div className='text-sm text-muted-foreground'>{data.episode_show_name}</div>
          )}
          <div className='flex items-center gap-4 text-sm'>
            <div className='flex items-center gap-1 text-primary'>
              <Clock className='h-4 w-4' />
              <span>
                {Math.floor(duration / 60)}m {duration % 60}s
              </span>
            </div>
            <div className='flex items-center gap-1 text-primary'>
              <Globe2 className='h-4 w-4' />
              <span>{data.conn_country}</span>
            </div>
          </div>
          <div className='flex flex-wrap gap-2 mt-2'>
            {data.shuffle && (
              <Badge variant='outline' className='border-primary/50'>
                Shuffle
              </Badge>
            )}
            {data.offline && (
              <Badge variant='outline' className='border-primary/50'>
                Offline
              </Badge>
            )}
            {data.incognito_mode && (
              <Badge variant='outline' className='border-primary/50'>
                Incognito
              </Badge>
            )}
          </div>
          <div className='text-xs text-muted-foreground mt-2'>
            Played {formattedDate} ({format(new Date(data.ts), 'PPpp')})
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
