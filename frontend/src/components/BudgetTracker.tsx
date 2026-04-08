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
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Monthly Budgets</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.budgets.map((budget) => (
          <Card key={budget._id}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {budget.category}
              </CardTitle>
              <Badge variant={budget.usagePercentage >= 100 ? "destructive" : budget.usagePercentage >= 80 ? "outline" : "secondary"}>
                {budget.usagePercentage.toFixed(0)}%
              </Badge>
            </CardHeader>
            <CardContent>
              <Progress value={Math.min(budget.usagePercentage, 100)} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                ${(budget.totalSpent / 100).toFixed(2)} spent of ${(budget.amount / 100).toFixed(2)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
