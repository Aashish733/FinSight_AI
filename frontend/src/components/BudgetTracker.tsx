import React from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGetBudgetsQuery } from "@/features/budget/budgetAPI";

export const BudgetTracker: React.FC = () => {
  const { data, isLoading } = useGetBudgetsQuery();

  if (isLoading) return <div>Loading budgets...</div>;
  if (!data?.budgets || data.budgets.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-6 lg:px-0">
        <h2 className="text-xl font-semibold tracking-tight">Monthly Budgets</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 lg:px-0">
        {data.budgets.map((budget) => (
          <Card key={budget._id} className="border border-border shadow-sm hover:bg-accent/5 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                {budget.category}
              </CardTitle>
              <Badge variant={budget.usagePercentage >= 100 ? "destructive" : budget.usagePercentage >= 80 ? "outline" : "secondary"} className="font-bold">
                {budget.usagePercentage.toFixed(0)}%
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <Progress value={Math.min(budget.usagePercentage, 100)} className="h-2 bg-muted transition-all" />
              <div className="flex justify-between items-center text-[11px] font-medium">
                 <span className="text-foreground">
                    ${(budget.totalSpent / 100).toFixed(2)} <span className="text-muted-foreground">spent</span>
                 </span>
                 <span className="text-muted-foreground/80 lowercase">
                    of ${(budget.amount / 100).toFixed(2)} goal
                 </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
