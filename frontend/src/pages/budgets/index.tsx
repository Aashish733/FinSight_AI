import React, { useState } from "react";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGetBudgetsQuery, useUpsertBudgetMutation, useDeleteBudgetMutation } from "@/features/budget/budgetAPI";
import PageHeader from "@/components/page-header";
import { toast } from "sonner";

const BudgetsPage: React.FC = () => {
  const { data, isLoading } = useGetBudgetsQuery();
  const [upsertBudget] = useUpsertBudgetMutation();
  const [deleteBudget] = useDeleteBudgetMutation();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");

  const handleSave = async () => {
    if (!category || !amount) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await upsertBudget({ category, amount: Number(amount) * 100 }).unwrap();
      toast.success("Budget saved successfully");
      setIsDialogOpen(false);
      setCategory("");
      setAmount("");
    } catch (error) {
      toast.error("Failed to save budget");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBudget(id).unwrap();
      toast.success("Budget deleted successfully");
    } catch (error) {
      toast.error("Failed to delete budget");
    }
  };

  if (isLoading) return <div className="p-8">Loading budgets...</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <PageHeader title="Manage Budgets" subtitle="Set and track spending limits by category." />

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Budget
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Set Category Budget</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category (e.g., Food, Transport)</Label>
                <Input
                  id="category"
                  placeholder="Enter category name"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Monthly Budget Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}>Save Budget</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.budgets.map((budget) => (
          <Card key={budget._id}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-bold">
                {budget.category}
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => {
                  setCategory(budget.category);
                  setAmount((budget.amount / 100).toString());
                  setIsDialogOpen(true);
                }}>
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(budget._id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Used: ${(budget.totalSpent / 100).toFixed(2)}</span>
                <span className="text-muted-foreground">Limit: ${(budget.amount / 100).toFixed(2)}</span>
              </div>
              <Progress value={Math.min(budget.usagePercentage, 100)} className="h-3" />
              <div className="flex justify-between items-center">
                <Badge variant={budget.usagePercentage >= 100 ? "destructive" : budget.usagePercentage >= 80 ? "outline" : "secondary"}>
                  {budget.usagePercentage.toFixed(0)}% Utilized
                </Badge>
                {budget.usagePercentage >= 100 && (
                  <span className="text-xs text-destructive font-semibold">Over Budget!</span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {data?.budgets.length === 0 && (
        <Card className="p-12 text-center text-muted-foreground">
          No budgets set yet. Click "Add Budget" to start tracking your spending by category.
        </Card>
      )}
    </div>
  );
};

export default BudgetsPage;
