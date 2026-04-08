# Implementation Plan - Smart Budgeting & FinAI Chatbot

This plan outlines the steps to add budget tracking with automated email alerts and an AI-powered financial assistant using Google Gemini.

## User Review Required

> [!IMPORTANT]
> - **Budget Logic**: Budgets will be calculated monthly.
> - **AI Context**: The chatbot will have access to the user's transaction titles, categories, and amounts to provide accurate answers.
> - **Email Alerts**: Emails will be sent via Resend. Ensure your `RESEND_API_KEY` is valid.

## Proposed Changes

---

### Phase 1: Backend Foundations

#### [NEW] [budget.model.ts](file:///c:/Users/Aashish/OneDrive/Desktop/Youtube%20tutotrials/TechWithEmmaYT/FinSight_AI/backend/src/models/budget.model.ts)
- Create a Mongoose schema for `Budget`.
- Fields: `userId`, `category`, `amount` (in cents), `period` (Monthly).

#### [NEW] [budget.service.ts](file:///c:/Users/Aashish/OneDrive/Desktop/Youtube%20tutotrials/TechWithEmmaYT/FinSight_AI/backend/src/services/budget.service.ts)
- Logic to calculate spending vs. budget.
- Logic to check if a new transaction pushes a category over 80% or 100% of its budget.

#### [NEW] [ai.service.ts](file:///c:/Users/Aashish/OneDrive/Desktop/Youtube%20tutotrials/TechWithEmmaYT/FinSight_AI/backend/src/services/ai.service.ts)
- Integrate Gemini for chat.
- Logic to gather user data and format it into a financial advice prompt.

#### [MODIFY] [transaction.controller.ts](file:///c:/Users/Aashish/OneDrive/Desktop/Youtube%20tutotrials/TechWithEmmaYT/FinSight_AI/backend/src/controllers/transaction.controller.ts)
- Inject budget check logic after transaction creation.

---

### Phase 2: API Endpoints

#### [NEW] [budget.route.ts](file:///c:/Users/Aashish/OneDrive/Desktop/Youtube%20tutotrials/TechWithEmmaYT/FinSight_AI/backend/src/routes/budget.route.ts)
- `GET /budget`: Fetch all budgets with current usage.
- `POST /budget`: Upsert budget for a category.
- `DELETE /budget/:id`: Remove budget.

#### [NEW] [ai.route.ts](file:///c:/Users/Aashish/OneDrive/Desktop/Youtube%20tutotrials/TechWithEmmaYT/FinSight_AI/backend/src/routes/ai.route.ts)
- `POST /ai/chat`: Handle chat messages.

---

### Phase 3: Frontend Implementation

#### [NEW] [budget.api.ts](file:///c:/Users/Aashish/OneDrive/Desktop/Youtube%20tutotrials/TechWithEmmaYT/FinSight_AI/frontend/src/features/budget/budget.api.ts)
- Define RTK Query endpoints for budgets.

#### [NEW] [ai.api.ts](file:///c:/Users/Aashish/OneDrive/Desktop/Youtube%20tutotrials/TechWithEmmaYT/FinSight_AI/frontend/src/features/ai/ai.api.ts)
- Define RTK Query endpoint for chat.

#### [NEW] [BudgetTracker.tsx](file:///c:/Users/Aashish/OneDrive/Desktop/Youtube%20tutotrials/TechWithEmmaYT/FinSight_AI/frontend/src/components/dashboard/BudgetTracker.tsx)
- Reusable progress bar component for the dashboard.

#### [NEW] [ChatAssistant.tsx](file:///c:/Users/Aashish/OneDrive/Desktop/Youtube%20tutotrials/TechWithEmmaYT/FinSight_AI/frontend/src/components/ai/ChatAssistant.tsx)
- Floating chat bubble and message window.

#### [NEW] [BudgetsPage.tsx](file:///c:/Users/Aashish/OneDrive/Desktop/Youtube%20tutotrials/TechWithEmmaYT/FinSight_AI/frontend/src/pages/budgets/BudgetsPage.tsx)
- Page to manage category-wise budget limits.

---

## Verification Plan

### Automated Tests
- Postman/Insomnia: Test `/api/budget` CRUD and `/api/ai/chat`.
- Check Resend logs for triggered emails when a budget is exceeded in tests.

### Manual Verification
1. Create a budget of $100 for "Food".
2. Add a $90 expense. Verify the Dashboard shows a 90% progress bar.
3. Check email for the "80% threshold reached" notification.
4. Open the Chat bubble and ask "How many times did I eat out this month?". Verify the AI correctly counts "Food" transactions.
