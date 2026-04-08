# 🧾 AI Receipt Scanning System - Technical Documentation

> **FinSight** uses Google Gemini AI to analyze receipt images and automatically extract transaction details.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture Flow](#architecture-flow)
- [Step-by-Step Process](#step-by-step-process)
- [File Reference](#file-reference)
- [API Endpoint](#api-endpoint)
- [Data Flow Diagram](#data-flow-diagram)
- [One-Paragraph Explanation](#one-paragraph-explanation)

---

## Overview

This system allows users to upload receipt images and automatically extract transaction information using AI vision capabilities. Instead of traditional OCR (like Tesseract), we use **Google Gemini 2.0 Flash** which provides:

- ✅ Context-aware understanding (not just raw text)
- ✅ Structured JSON output directly
- ✅ Intelligent category detection
- ✅ Built-in validation
- ✅ No library installation needed (cloud-based)

---

## Architecture Flow

```
User uploads receipt image
         ↓
Cloudinary (stores image & returns URL)
         ↓
Base64 encoding (converts image to string)
         ↓
Google Gemini AI (analyzes & extracts data)
         ↓
JSON parsing (extracts transaction fields)
         ↓
Returns structured transaction data
```

---

## Step-by-Step Process

### Step 1: User Uploads Receipt (Frontend)

📍 **File:** `client/src/components/transaction/reciept-scanner.tsx`

- User clicks file input and selects a receipt image (JPG/PNG)
- Frontend validates file type (`image/*`) and size
- Creates `FormData` object with the image:
  ```javascript
  const formData = new FormData();
  formData.append("receipt", file);
  ```
- Shows progress bar animation to user
- Sends HTTP POST request to: `POST /api/transaction/scan-receipt`

---

### Step 2: Backend Receives Request (Route)

📍 **File:** `backend/src/routes/transaction.route.ts`

- Express router catches the `/scan-receipt` endpoint
- **Multer middleware** (`upload.single("receipt")`) processes the file
- File automatically uploads to **Cloudinary** before controller runs

```typescript
transactionRoutes.post(
  "/scan-receipt",
  upload.single("receipt"),    // Cloudinary middleware
  scanReceiptController        // Processing controller
);
```

---

### Step 3: Image Stored on Cloudinary (Middleware)

📍 **File:** `backend/src/config/cloudinary.config.ts`

- Multer uses **CloudinaryStorage** adapter
- Image uploads to Cloudinary cloud storage
- Cloudinary returns:
  - `file.path` = Public URL (e.g., `https://res.cloudinary.com/xxx/image.jpg`)
  - `file.mimetype` = Image type (e.g., `image/jpeg`)

```typescript
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "images",
    allowed_formats: ["jpg", "png", "jpeg"],
    quality: "auto:good"
  }
});
```

---

### Step 4: Controller Calls Service (Controller)

📍 **File:** `backend/src/controllers/transaction.controller.ts`

- Controller extracts `req.file` (Cloudinary processed file)
- Calls `scanReceiptService(file)` for business logic
- Waits for AI analysis result

```typescript
export const scanReceiptController = asyncHandler(
  async (req: Request, res: Response) => {
    const file = req?.file;
    const result = await scanReceiptService(file);
    return res.status(HTTPSTATUS.OK).json({
      message: "Receipt scanned successfully",
      data: result,
    });
  }
);
```

---

### Step 5: Fetch Image from Cloudinary (Service)

📍 **File:** `backend/src/services/transaction.service.ts`

- Service uses Cloudinary URL (`file.path`) to fetch image bytes
- Converts image bytes to **Base64 string**
- Base64 is required format for Gemini AI vision API

```typescript
const responseData = await axios.get(file.path, {
  responseType: "arraybuffer",
});
const base64String = Buffer.from(responseData.data).toString("base64");
```

---

### Step 6: Send Image to Google Gemini AI (Service)

📍 **Files:** `backend/src/services/transaction.service.ts` + `backend/src/utils/prompt.ts`

- Combines:
  - **Prompt** (instructions for what to extract)
  - **Base64 Image** (the receipt photo)
- Sends to Gemini API with settings:
  - `temperature: 0` (consistent results)
  - `responseMimeType: application/json` (structured output)

```typescript
const result = await genAI.models.generateContent({
  model: genAIModel,
  contents: [
    createUserContent([
      receiptPrompt,
      createPartFromBase64(base64String, file.mimetype),
    ]),
  ],
  config: {
    temperature: 0,
    topP: 1,
    responseMimeType: "application/json",
  },
});
```

---

### Step 7: Gemini AI Analyzes Receipt (External)

📍 **External Service:** Google Gemini 2.0 Flash

The AI receives this prompt instruction:

```
You are a financial assistant analyzing receipt images.
Extract transaction details in this EXACT JSON format:
{
  "title": "string",        // Merchant name
  "amount": number,         // Total amount
  "date": "ISO date",       // YYYY-MM-DD
  "description": "string",  // Items summary
  "category": "string",     // dining|groceries|etc
  "paymentMethod": "string" // CARD|BANK_TRANSFER|etc
}
```

AI extracts:
| Field | Description |
|-------|-------------|
| `title` | Store/Merchant name |
| `amount` | Total amount paid |
| `date` | Purchase date |
| `description` | Items bought summary |
| `category` | Transaction category |
| `paymentMethod` | How user paid |

---

### Step 8: Parse & Validate AI Response (Service)

📍 **File:** `backend/src/services/transaction.service.ts`

- Clean the JSON response (remove code blocks if any)
- Parse JSON string to JavaScript object
- **Validate required fields:**
  - ✅ `amount` must exist
  - ✅ `date` must exist
- If validation fails → return error message

```typescript
const data = JSON.parse(cleanedText);

if (!data.amount || !data.date) {
  return { error: "Receipt missing required information" };
}
```

---

### Step 9: Return Transaction Data (Controller → Frontend)

📍 **Files:** Controller → Frontend

Controller sends JSON response:

```json
{
  "message": "Receipt scanned successfully",
  "data": {
    "title": "Starbucks",
    "amount": 8.50,
    "date": "2025-12-29",
    "category": "dining",
    "paymentMethod": "CARD",
    "type": "EXPENSE",
    "description": "Coffee and muffin",
    "receiptUrl": "https://res.cloudinary.com/..."
  }
}
```

Frontend receives response and calls `onScanComplete(data)` to populate transaction form.

---

### Step 10: User Reviews & Saves Transaction (Frontend)

- Form fields auto-fill with AI-extracted data
- User can edit/correct any field if needed
- User clicks save → creates new transaction

---

## File Reference

| Step | File Path | Purpose |
|------|-----------|---------|
| 1 | `client/src/components/transaction/reciept-scanner.tsx` | User selects image, creates FormData |
| 2 | `client/src/features/transaction/transactionAPI.ts` | RTK Query sends POST request |
| 3 | `backend/src/routes/transaction.route.ts` | Route matches, calls Cloudinary middleware |
| 4 | `backend/src/config/cloudinary.config.ts` | Uploads image, returns URL |
| 5 | `backend/src/controllers/transaction.controller.ts` | Passes file to service |
| 6 | `backend/src/services/transaction.service.ts` | Fetches image, converts to Base64, calls AI |
| 7 | `backend/src/config/google-ai.config.ts` | Gemini API client configuration |
| 8 | `backend/src/utils/prompt.ts` | AI instructions for extraction |

---

## API Endpoint

### POST `/api/transaction/scan-receipt`

**Headers:**
```
Content-Type: multipart/form-data
Authorization: Bearer <jwt_token>
```

**Request Body:**
```
FormData {
  receipt: File (JPEG/PNG, max 2MB)
}
```

**Success Response (200):**
```json
{
  "message": "Receipt scanned successfully",
  "data": {
    "title": "Walmart Groceries",
    "amount": 58.43,
    "date": "2025-12-29",
    "description": "Groceries: milk, eggs, bread",
    "category": "groceries",
    "paymentMethod": "CARD",
    "type": "EXPENSE",
    "receiptUrl": "https://res.cloudinary.com/..."
  }
}
```

**Error Response:**
```json
{
  "data": {
    "error": "Receipt missing required information"
  }
}
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER JOURNEY                              │
└─────────────────────────────────────────────────────────────────┘

[1] USER                    [2] FRONTEND                [3] BACKEND ROUTE
 📷 Takes                    📤 Creates                  🛣️ Receives
 receipt photo               FormData &                  POST request
     ↓                       sends POST                      ↓
                                 ↓                            
[4] CLOUDINARY              [5] SERVICE                 [6] GEMINI AI
 ☁️ Stores image             🔄 Fetches image            🤖 Analyzes
 Returns URL                 Converts to Base64          receipt image
     ↓                           ↓                           ↓

[7] PARSE                   [8] VALIDATE                [9] RESPONSE
 📋 Clean JSON               ✅ Check amount             📨 Send JSON
 from AI                     & date exist                to frontend
     ↓                           ↓                           ↓

[10] FORM AUTO-FILL         [11] USER REVIEW            [12] SAVE
 📝 Populate fields          👁️ Check/edit              💾 Create
 with AI data                extracted data              transaction
```

---

## Detailed Architecture Diagram

```
CLIENT                          BACKEND                         EXTERNAL
┌─────────────┐               ┌──────────────┐
│ User selects│               │              │
│ receipt IMG │──────────────→│ Cloudinary   │─→ ☁️ Stores image
└─────────────┘ FormData      │ (Middleware) │←─ Returns URL
                              └──────────────┘
                                     ↓
                              ┌──────────────────┐
                              │ scanReceiptService│
                              │  - Fetch image   │
                              │  - Convert base64│
                              │  - Extract URL   │
                              └──────────────────┘
                                     ↓
                              ┌────────────────────┐
                              │ Google Gemini API  │─→ 🤖 Analyzes receipt
                              │ - receiptPrompt    │    with AI vision
                              │ - Base64 image     │
                              │ - temperature: 0   │←─ Returns JSON
                              └────────────────────┘
                                     ↓
                              ┌──────────────────┐
                              │ JSON Parse        │
                              │ Validate fields   │
                              │ (amount, date)    │
                              └──────────────────┘
                                     ↓
┌─────────────────────────────────────────────────┐
│ {title, amount, date, category,                 │
│  paymentMethod, type, receiptUrl}               │
└─────────────────────────────────────────────────┘
           ↑
           │ JSON Response
       ┌───┴────┐
       │ Client  │ ← onScanComplete(data)
       └─────────┘
```

---

## One-Paragraph Explanation

> When a user uploads a receipt image, the frontend sends it to our backend API as FormData. The image first uploads to Cloudinary cloud storage through Multer middleware, and we get a public URL. Then we fetch that image from Cloudinary, convert it to Base64 format, and send it to Google Gemini AI along with a structured prompt containing instructions about what data to extract. Gemini analyzes the receipt visually using its vision capabilities and returns structured JSON with title, amount, date, category, and payment method. We validate this data (ensuring amount and date exist) and send it back to the frontend, which auto-fills the transaction form. The user can review, edit if needed, and save it as a new transaction.

---

## Environment Variables Required

```env
# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## Technologies Used

| Technology | Purpose |
|------------|---------|
| **Google Gemini 2.0 Flash** | AI vision analysis |
| **Cloudinary** | Image cloud storage |
| **Multer** | File upload handling |
| **Axios** | HTTP requests |
| **Express.js** | Backend framework |
| **React + RTK Query** | Frontend API calls |

---

*Last Updated: December 29, 2025*
