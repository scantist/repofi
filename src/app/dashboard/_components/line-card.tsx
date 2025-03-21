"use client"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "~/components/ui/chart"

import CardWrapper from "~/components/card-wrapper"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

const LineCard = () => {
  const chartData = [
    { month: "January", desktop: 186 },
    { month: "February", desktop: 305 },
    { month: "March", desktop: 237 },
    { month: "April", desktop: 73 },
    { month: "May", desktop: 209 },
    { month: "June", desktop: 214 }
  ]

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "var(--chart-1)"
    }
  } satisfies ChartConfig

  return (
    <CardWrapper borderClassName={"-top-1 h-full"} contentClassName={"h-full"} className={"h-full"}>
      <div className={"p-4 rounded-lg bg-black/60   flex flex-col"}>
        <div className={"font-medium text-2xl"}>Tokenized lP Value</div>
        <ChartContainer config={chartConfig} className={"mt-8"}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value: string) => value.slice(0, 3)} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Line dataKey="desktop" type="natural" stroke="var(--color-desktop)" strokeWidth={2} dot={false} />
          </LineChart>
        </ChartContainer>
      </div>
    </CardWrapper>
  )
}

export default LineCard
