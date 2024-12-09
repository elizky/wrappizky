'use client';

import React, { useMemo } from 'react';
import { Pie, PieChart, Label } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

interface LocationData {
  location: string;
  listens: number;
}

interface WhereListenedChartProps {
  data: LocationData[];
}

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

const chartConfig = {
  listens: {
    label: 'Listens',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export function WhereListenedChart({ data }: WhereListenedChartProps) {
  const sortedData = useMemo(() => {
    return [...data]
      .sort((a, b) => b.listens - a.listens)
      .slice(0, 5) // Show top 5 locations
      .map((item, index) => ({
        ...item,
        fill: COLORS[index % COLORS.length],
      }));
  }, [data]);

  const totalListens = useMemo(() => {
    return data.reduce((sum, item) => sum + item.listens, 0);
  }, [data]);

  const otherListens = useMemo(() => {
    return data.slice(5).reduce((sum, item) => sum + item.listens, 0);
  }, [data]);

  const chartData = useMemo(() => {
    if (otherListens > 0) {
      return [
        ...sortedData,
        { location: 'Other', listens: otherListens, fill: 'hsl(var(--chart-6))' },
      ];
    }
    return sortedData;
  }, [sortedData, otherListens]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Where you listened?</CardTitle>
        <CardDescription>See where you have listened to your songs.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className='mx-auto max-sm:aspect-square max-h-[350px]'>
          <PieChart>
            <Pie
              data={chartData}
              dataKey='listens'
              nameKey='location'
              cx='50%'
              cy='50%'
              innerRadius={60}
              strokeWidth={5}
              label={({ location, listens }) => `${location}: ${listens}`}
              labelLine={false}
            >
              <Label
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                content={({ viewBox }: any) => {
                  const { cx, cy } = viewBox;
                  return (
                    <text x={cx} y={cy} fill='white' textAnchor='middle' dominantBaseline='central'>
                      <tspan x={cx} dy='-0.5em' fontSize='24' fontWeight='bold'>
                        {totalListens}
                      </tspan>
                      <tspan x={cx} dy='1.5em' fontSize='12'>
                        Total Listens
                      </tspan>
                    </text>
                  );
                }}
              />
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
