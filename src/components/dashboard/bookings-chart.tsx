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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

const chartConfig = {
  workOrders: {
    label: "New Work Orders",
    color: "var(--chart-1)",
  },
  appointments: {
    label: "Appointments",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export type BookingsChartProps = {
  data: DashboardStats["bookings"]
}

export function BookingsChart({ data }: BookingsChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bookings Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <AreaChart
            data={data}
            margin={{ top: 8, left: 0, right: 12, bottom: 0 }}
          >
            <defs>
              <linearGradient id="fillWorkOrders" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0.25}
                />
                <stop
                  offset="100%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient id="fillAppointments" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--chart-2)"
                  stopOpacity={0.25}
                />
                <stop
                  offset="100%"
                  stopColor="var(--chart-2)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              strokeDasharray="4 4"
              className="stroke-border/60"
            />
            <XAxis
              dataKey="week"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
            />
            <YAxis
              width={28}
              tickLine={false}
              axisLine={false}
              tickMargin={4}
            />
            <ChartTooltip cursor content={<ChartTooltipContent />} />
            <Area
              dataKey="workOrders"
              type="monotone"
              stroke="var(--chart-1)"
              strokeWidth={2}
              fill="url(#fillWorkOrders)"
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Area
              dataKey="appointments"
              type="monotone"
              stroke="var(--chart-2)"
              strokeWidth={2}
              fill="url(#fillAppointments)"
              dot={false}
              activeDot={{ r: 4 }}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
