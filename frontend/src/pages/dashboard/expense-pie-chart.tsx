import { Label, Pie, PieChart, Cell } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { DateRangeType } from "@/components/date-range-select";
import { formatCurrency } from "@/lib/format-currency";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPercentage } from "@/lib/format-percentage";
import { EmptyState } from "@/components/empty-state";
import { useExpensePieChartBreakdownQuery } from "@/features/analytics/analyticsAPI";

const COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
];

// Create chart config for shadcn UI chart
const chartConfig = {
  amount: {
    label: "Amount",
  },
} satisfies ChartConfig;

const ExpensePieChart = (props: { dateRange?: DateRangeType }) => {
  const { dateRange } = props;

  const { data, isFetching } = useExpensePieChartBreakdownQuery({
    preset: dateRange?.value,
  });
  const categories = data?.data?.breakdown || [];
  const totalSpent = data?.data?.totalSpent || 0;

  if (isFetching) {
    return <PieChartSkeleton />;
  }
  
  // Custom legend component
  const CustomLegend = () => {
    return (
      <div className="grid grid-cols-1 gap-y-3 mt-8">
        {categories.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center gap-3 group transition-all">
            <div
              className="h-2 w-2 rounded-full shrink-0 shadow-sm"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            ></div>
            <div className="flex justify-between w-full items-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">
                {entry.name}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold tabular-nums text-foreground">
                  {formatCurrency(entry.value)}
                </span>
                <span className="text-[10px] tabular-nums text-muted-foreground bg-accent/50 px-1.5 py-0.5 rounded border border-border/50">
                  {formatPercentage(entry.percentage, { decimalPlaces: 0 })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="border border-border shadow-sm flex flex-col">
      <CardHeader className="pb-4 border-b border-border bg-accent/5">
        <CardTitle className="text-lg font-semibold tracking-tight">Expenses Breakdown</CardTitle>
        <CardDescription className="text-xs">Distribution across categories {dateRange?.label}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pt-8 pb-6 overflow-y-auto">
        <div className="w-full">
          {categories?.length === 0 ? (
            <div className="min-h-[200px] flex items-center justify-center">
              <EmptyState
                title="No expenses found"
                description="There are no expenses recorded for this period."
              />
            </div>
          ) : (
            <>
              <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square h-[220px] w-full"
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent className="bg-background border border-border shadow-xl rounded-lg" />}
                  />

                  <Pie
                    data={categories}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={4}
                    strokeWidth={0}
                  >
                    {categories.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        className="transition-opacity hover:opacity-80 outline-none"
                      />
                    ))}

                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              <tspan
                                x={viewBox.cx}
                                y={viewBox.cy}
                                className="fill-foreground text-3xl font-bold tracking-tighter"
                              >
                                {formatCurrency(totalSpent, { compact: true })}
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 20}
                                className="fill-muted-foreground text-[10px] font-bold uppercase tracking-widest"
                              >
                                Total Spent
                              </tspan>
                            </text>
                          );
                        }
                      }}
                    />
                  </Pie>
                </PieChart>
              </ChartContainer>
              <CustomLegend />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const PieChartSkeleton = () => (
  <Card className="border border-border shadow-sm">
    <CardHeader className="pb-4 border-b border-border bg-accent/5">
      <Skeleton className="h-6 w-48 mb-1" />
      <Skeleton className="h-3 w-32" />
    </CardHeader>
    <CardContent className="py-8">
      <div className="w-full flex items-center justify-center mb-8">
        <div className="relative w-[180px] h-[180px]">
          <Skeleton className="rounded-full w-full h-full opacity-20" />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Skeleton className="h-8 w-24 mb-2" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-2 w-2 rounded-full" />
              <Skeleton className="h-3 w-24" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-10 rounded" />
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default ExpensePieChart;
