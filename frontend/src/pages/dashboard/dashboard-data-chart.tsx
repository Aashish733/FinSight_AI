import * as React from "react";
import { format } from "date-fns";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";
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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { EmptyState } from "@/components/empty-state";
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react";
import { DateRangeType } from "@/components/date-range-select";
import { Skeleton } from "@/components/ui/skeleton";
import { useChartAnalyticsQuery } from "@/features/analytics/analyticsAPI";

interface PropsType {
  dateRange?: DateRangeType;
}

const COLORS = ["var(--primary)", "var(--color-destructive)"];
const TRANSACTION_TYPES = ["income", "expenses"];

const chartConfig = {
  income: {
    label: "Income",
    color: COLORS[0],
  },
  expenses: {
    label: "Expenses",
    color: COLORS[1],
  },
} satisfies ChartConfig;

const DashboardDataChart: React.FC<PropsType> = (props) => {
  const { dateRange } = props;
  const isMobile = useIsMobile();

  const { data, isFetching } = useChartAnalyticsQuery({
    preset: dateRange?.value,
  });
  const chartData = data?.data?.chartData || [];
  const totalExpenseCount = data?.data?.totalExpenseCount || 0;
  const totalIncomeCount = data?.data?.totalIncomeCount || 0;

  if (isFetching) {
    return <ChartSkeleton />;
  }

  return (
    <Card className="border border-border shadow-sm overflow-hidden">
      <CardHeader
        className="flex flex-col items-stretch space-y-0 border-b border-border p-0 pr-1 sm:flex-row bg-accent/5 transition-colors"
      >
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-6 sm:py-0">
          <CardTitle className="text-lg font-semibold tracking-tight">Transaction Overview</CardTitle>
          <CardDescription className="text-xs">
            Showing trends {dateRange?.label}
          </CardDescription>
        </div>
        <div className="flex">
          {TRANSACTION_TYPES.map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <div
                key={chart}
                className="flex flex-1 flex-col justify-center gap-1 px-6 py-4 text-center even:border-l 
                sm:border-l border-border sm:px-8 sm:py-6 min-w-36 transition-colors hover:bg-accent/10"
              >
                <span className="w-full block text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="flex items-center justify-center gap-2 text-xl font-semibold leading-none sm:text-2xl">
                  {key === TRANSACTION_TYPES[0] ? (
                    <TrendingUpIcon className="size-4 text-emerald-500" />
                  ) : (
                    <TrendingDownIcon className="size-4 text-rose-500" />
                  )}
                  {key === TRANSACTION_TYPES[0]
                    ? totalIncomeCount
                    : totalExpenseCount}
                </span>
              </div>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-6 sm:px-6 h-[350px]">
        {chartData?.length === 0 ? (
          <EmptyState
            title="No transaction data"
            description="There are no transactions recorded for this period."
          />
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[320px] w-full"
          >
            <AreaChart data={chartData || []}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={isMobile ? 20 : 25}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                tickFormatter={(value) =>
                  format(new Date(value), isMobile ? "MMM d" : "MMM d")
                }
              />
              <ChartTooltip
                cursor={{
                  stroke: "var(--border)",
                  strokeWidth: 1,
                }}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      format(new Date(value), "MMMM d, yyyy")
                    }
                    indicator="dot"
                    className="bg-background border border-border shadow-xl rounded-lg"
                  />
                }
              />
              <Area
                dataKey="expenses"
                type="monotone"
                fill="url(#expensesGradient)"
                stroke="var(--color-destructive)"
                strokeWidth={2}
                className="drop-shadow-sm"
              />
              <Area
                dataKey="income"
                type="monotone"
                fill="url(#incomeGradient)"
                stroke="var(--color-primary)"
                strokeWidth={2}
                className="drop-shadow-sm"
              />
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-destructive)" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="var(--color-destructive)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <ChartLegend
                className="mt-4"
                content={<ChartLegendContent />}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

const ChartSkeleton = () => (
  <Card className="border border-border shadow-sm overflow-hidden">
    <CardHeader className="flex flex-col items-stretch space-y-0 border-b border-border p-0 pr-1 sm:flex-row">
      <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-6 sm:py-0">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-32 mt-2" />
      </div>
      <div className="flex">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="flex flex-1 flex-col justify-center gap-1 px-6 py-4 text-center even:border-l 
            sm:border-l border-border sm:px-8 sm:py-6 min-w-36"
          >
            <Skeleton className="h-3 w-16 mx-auto" />
            <Skeleton className="h-8 w-20 mx-auto mt-2" />
          </div>
        ))}
      </div>
    </CardHeader>
    <CardContent className="px-6 pt-6 h-[350px]">
      <Skeleton className="h-full w-full rounded-md" />
    </CardContent>
  </Card>
);

export default DashboardDataChart;
