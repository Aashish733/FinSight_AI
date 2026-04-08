import mongoose, { Document, Schema } from "mongoose";

export interface IBudget extends Document {
  userId: mongoose.Types.ObjectId;
  category: string;
  amount: number; // in cents
  period: "Monthly";
}

const budgetSchema = new Schema<IBudget>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    period: {
      type: String,
      enum: ["Monthly"],
      default: "Monthly",
    },
  },
  {
    timestamps: true,
  }
);

// Ensure a user can only have one budget per category
budgetSchema.index({ userId: 1, category: 1 }, { unique: true });

export const BudgetModel = mongoose.model<IBudget>("Budget", budgetSchema);
export default BudgetModel;
