import { DateRangeSelect, DateRangeType } from "@/components/date-range-select";
import AddTransactionDrawer from "@/components/transaction/add-transaction-drawer";

interface Props {
  title: string;
  subtitle: string;
  dateRange?: DateRangeType;
  setDateRange?: (range: DateRangeType) => void;
}

const DashboardHeader = ({ title, subtitle, dateRange, setDateRange }: Props) => {
  return (
    <div className="flex flex-col lg:flex-row items-start justify-between space-y-7">
      <div className="space-y-1.5 px-6 lg:px-0">
        <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight">{title}</h2>
        <p className="text-muted-foreground text-sm font-medium">{subtitle}</p>
      </div>
      <div className="flex flex-wrap items-center justify-end gap-3 px-6 lg:px-0">
        <DateRangeSelect dateRange={dateRange || null} setDateRange={(range) => setDateRange?.(range)} />
        <AddTransactionDrawer />
      </div>
    </div>
  );
};

export default DashboardHeader;
