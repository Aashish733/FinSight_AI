import { Link } from "react-router-dom";
import TransactionTable from "@/components/transaction/transaction-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PROTECTED_ROUTES } from "@/routes/common/routePath";

const DashboardRecentTransactions = () => {
  return (
    <Card className="border border-border shadow-sm overflow-hidden">
      <CardHeader className="pb-4 bg-accent/5 transition-colors">
        <div className="flex items-center justify-between w-full">
          <div>
            <CardTitle className="text-lg font-semibold tracking-tight">Recent Transactions</CardTitle>
            <CardDescription className="text-xs">Your latest financial activity</CardDescription>
          </div>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-8 text-xs font-semibold"
          >
            <Link to={PROTECTED_ROUTES.TRANSACTIONS}>View all</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <TransactionTable pageSize={10} isShowPagination={false} />
      </CardContent>
    </Card>
  );
};

export default DashboardRecentTransactions;
