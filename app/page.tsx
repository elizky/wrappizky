import { TopStats } from '@/components/TopStats';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  getMostPlayedTracks,
  getMostPlayedArtists,
  getMostPlayedAlbums,
  getLocationData,
  getTimeData,
  getTimeRangeChartData,
} from '@/lib/analytics';
import { getJSONData } from '@/actions/getData';
import { WhereListenedChart } from '@/components/charts/WhereChart';
import { TimeRangeChart } from '@/components/charts/TimeRangeChart';
import { CalendarView } from '@/components/CalendarView';

export default async function Home() {
  const data = await getJSONData();
  const currentYear = new Date().getFullYear();
  const thisYearData = data.filter((entry) => new Date(entry.ts).getFullYear() === currentYear);

  const topTracks = getMostPlayedTracks(data);
  const topArtists = getMostPlayedArtists(data);
  const topAlbums = getMostPlayedAlbums(data);
  const locationData = getLocationData(data);
  const timeData = getTimeData(data);
  const timeRangeChartData = getTimeRangeChartData(timeData);

  const topTracksThisYear = getMostPlayedTracks(thisYearData);
  const topArtistsThisYear = getMostPlayedArtists(thisYearData);
  const topAlbumsThisYear = getMostPlayedAlbums(thisYearData);

  const locationDataThisYear = getLocationData(thisYearData);
  const timeDataThisYear = getTimeData(thisYearData);
  const timeRangeChartDataThisYear = getTimeRangeChartData(timeDataThisYear);

  return (
    <main className='min-h-screen bg-background p-8'>
      <div className='container mx-auto px-4'>
        <div className='mb-8'>
          <h1 className='text-4xl font-bold tracking-tight'>Wrappizky</h1>
          <p className='text-muted-foreground mt-2'>
            Track your Spotify music and podcast listening activity
          </p>
        </div>

        <Tabs defaultValue='stats' className='space-y-6'>
          <TabsList>
            <TabsTrigger value='stats'>Top Stats</TabsTrigger>
            <TabsTrigger value='calendar'>View Calendar</TabsTrigger>
          </TabsList>

          <TabsContent value='stats' className='space-y-12'>
            <div className='space-y-6 mt-4'>
              <h2 className='text-2xl font-bold tracking-wide'>My Stats for this Year</h2>
              <TopStats
                tracks={topTracksThisYear}
                artists={topArtistsThisYear}
                albums={topAlbumsThisYear}
              />
              <div className='mt-8'>
                <h3 className='text-lg font-semibold tracking-tighter'>Listening Insights</h3>
                <div className='mt-4 grid sm:grid-cols-2 gap-6 sm:gap-12'>
                  <WhereListenedChart data={locationDataThisYear} />
                  <TimeRangeChart data={timeRangeChartDataThisYear} />
                </div>
              </div>
            </div>
            <div className='space-y-6'>
              <h2 className='text-2xl font-bold tracking-wide'>My All Time Stats</h2>
              <TopStats tracks={topTracks} artists={topArtists} albums={topAlbums} />
              <div className='mt-8'>
                <h3 className='text-lg font-semibold tracking-tighter'>Listening Insights</h3>
                <div className='mt-4 grid sm:grid-cols-2 gap-6 sm:gap-12'>
                  <WhereListenedChart data={locationData} />
                  <TimeRangeChart data={timeRangeChartData} />
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value='calendar' className='space-y-12'>
            <CalendarView data={data} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
