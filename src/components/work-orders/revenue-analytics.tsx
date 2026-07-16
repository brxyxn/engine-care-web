"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Area, AreaChart, XAxis } from "recharts"

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export type RevenueAnalyticsProps = {
  data: DashboardStats["revenueTrend"]
}

export function RevenueAnalytics({ data }: RevenueAnalyticsProps) {
  const first = data[0]?.revenue ?? 0
  const last = data[data.length - 1]?.revenue ?? 0
  const growthPct = first > 0 ? ((last - first) / first) * 100 : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Analytics</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <ChartContainer config={chartConfig} className="h-36 w-full">
          <AreaChart data={data} margin={{ top: 4, left: 4, right: 4 }}>
            <defs>
              <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="100%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="week"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip cursor content={<ChartTooltipContent />} />
            <Area
              dataKey="revenue"
              type="monotone"
              stroke="var(--chart-1)"
              strokeWidth={2}
              fill="url(#fillRevenue)"
              dot={false}
              activeDot={{ r: 4 }}
            />
          </AreaChart>
        </ChartContainer>
        <div className="flex items-baseline justify-between text-sm">
          <span className="text-muted-foreground">Monthly growth</span>
          <span
            className={growthPct >= 0 ? "text-success font-medium" : "text-destructive font-medium"}
          >
            {growthPct >= 0 ? "+" : ""}
            {growthPct.toFixed(1)}%
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
