'use client';

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface TimeRangeData {
  range: string;
  listens: number;
  topTrack: string;
  topArtist: string;
}

interface TimeRangeChartProps {
  data: TimeRangeData[];
}

const chartConfig = {
  listens: {
    label: 'Listens',
    color: 'hsl(var(--chart-1))',
  },
  label: {
    color: 'hsl(var(--background))',
  },
};

export function TimeRangeChart({ data }: TimeRangeChartProps) {
  const sortedData = [...data].sort((a, b) => b.listens - a.listens);

  return (
    <Card>
      <CardHeader>
        <CardTitle>When you listened?</CardTitle>
        <CardDescription>Distribution of listens during different time ranges</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className='mx-auto max-sm:aspect-square max-h-[350px]'>
          <BarChart
            accessibilityLayer
            data={sortedData}
            layout='vertical'
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey='range'
              type='category'
              tickLine={false}
              tickMargin={10}
              hide
              axisLine={false}
              width={100}
            />
            <XAxis type='number' hide />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator='line' />} />
            <Bar dataKey='listens' fill='var(--color-listens)' radius={4}>
              <LabelList
                dataKey='range'
                position='insideLeft'
                offset={8}
                className='fill-foreground'
                fontSize={12}
              />
              <LabelList
                dataKey='listens'
                position='right'
                offset={8}
                className='fill-foreground'
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
