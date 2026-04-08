import { apiClient } from "@/app/api-client";

export interface IBudget {
  _id: string;
  category: string;
  amount: number;
  totalSpent: number;
  usagePercentage: number;
}

export const budgetApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    getBudgets: builder.query<{ message: string; budgets: IBudget[] }, void>({
      query: () => ({
        url: "/budget",
        method: "GET",
      }),
      providesTags: ["budgets"],
    }),

    upsertBudget: builder.mutation<void, { category: string; amount: number }>({
      query: (body) => ({
        url: "/budget",
        method: "POST",
        body,
      }),
      invalidatesTags: ["budgets"],
    }),

    deleteBudget: builder.mutation<void, string>({
      query: (id) => ({
        url: `/budget/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["budgets"],
    }),
  }),
});

export const {
  useGetBudgetsQuery,
  useUpsertBudgetMutation,
  useDeleteBudgetMutation,
} = budgetApi;
