import { apiClient } from "@/app/api-client";

export interface AIChatResponse {
  message: string;
  response: string;
}

export const aiApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    chatWithAi: builder.mutation<AIChatResponse, { message: string }>({
      query: (body) => ({
        url: "/ai/chat",
        method: "POST",
        body,
      }),
      invalidatesTags: ["ai"],
    }),
  }),
});

export const { useChatWithAiMutation } = aiApi;
