# TextToImage — Current Features & Future Roadmap

## Features implemented so far

### 1. Authentication
- User registration.
- Password hashing with bcrypt.
- JWT-based authentication.
- Login/logout flow.
- Authenticated credit retrieval.

### 2. Credit system
- Users have a credit balance.
- Credit balance is loaded after authentication.
- Image generation is connected to the credit-aware application context.
- Pricing page exposes credit packages.

### 3. Text-to-image application flow
- React/Vite frontend.
- Prompt-based image generation request.
- Result page for generated images.
- Existing download/result UI.
- Responsive marketing/landing sections.

### 4. Payment integration — implemented in this version
- Razorpay Checkout integration.
- Server-side order creation.
- Server-side plan/price validation.
- Pending transaction creation before payment.
- Razorpay order ID persisted to the transaction.
- Razorpay HMAC signature verification.
- Credits added only after successful verification.
- Idempotent verification to prevent duplicate crediting.
- Payment failure/dismissal handling on the frontend.
- Transaction status tracking: `created`, `paid`, `failed`.
- Razorpay payment/order/signature metadata stored for auditability.

### Current plans

| Plan | Price | Credits |
|---|---:|---:|
| Basic | ₹10 | 100 |
| Advanced | ₹50 | 500 |
| Business | ₹250 | 5,000 |

The backend is authoritative for these values. The frontend displays the same plan catalog for the UI.

## Important payment flow

```text
User
  │
  ▼
Pricing Page
  │  planId only
  ▼
POST /api/user/pay-razor
  │
  ├── JWT identifies user
  ├── Server validates plan
  ├── Creates pending transaction
  └── Creates Razorpay order
          │
          ▼
    Razorpay Checkout
          │
          ▼
   Payment callback
          │
          ▼
POST /api/user/verify-payment
  │
  ├── Verify transaction belongs to user
  ├── Verify Razorpay HMAC signature
  ├── Reject invalid/replayed payment
  └── Increment credits
          │
          ▼
   Refresh credit balance
```

## Further feature suggestions

### A. Payments and billing
1. **Webhook verification** — add Razorpay webhooks as the server-to-server source of truth for asynchronous payment events.
2. **Refund handling** — support full/partial refunds and reverse the corresponding credits according to a documented refund policy.
3. **Payment history page** — show date, plan, amount, payment status, order ID, and payment ID.
4. **Invoice generation** — generate downloadable invoices/receipts after successful payment.
5. **Failed-payment reconciliation** — scheduled job to reconcile transactions stuck in `created`.
6. **Admin transaction dashboard** — filter transactions by user, plan, date, and status.
7. **Coupon/promo codes** — server-side validation, expiry, usage limits, and audit trail.
8. **GST/tax support** — configurable tax calculation and invoice fields for India if the product becomes commercial.

### B. Credit/account system
9. **Credit ledger** — record every credit addition and deduction instead of relying only on the user's balance.
10. **Atomic credit deduction** — deduct credits with a database condition such as `creditBalance >= cost` to prevent race-condition overspending.
11. **Generation history** — save prompt, model, dimensions, generation time, credit cost, and resulting asset.
12. **Credit expiry policy** — optional expiry for promotional credits, with a separate policy for paid credits.

### C. Image-generation product
13. **Multiple AI models** — expose model selection with model-specific credit pricing.
14. **Aspect ratios/resolutions** — 1:1, 16:9, 9:16, etc.
15. **Negative prompts** — optional negative prompt support where the selected model supports it.
16. **Image-to-image generation** — upload an image and transform it with a prompt.
17. **Inpainting/outpainting** — edit or extend an existing image.
18. **Batch generation** — generate multiple variants with controlled credit consumption.
19. **Generation queue** — asynchronous jobs for expensive generation models.
20. **Gallery** — searchable personal image library with pagination.
21. **Favorites/tags** — organize generated images.
22. **Share links** — optional public/private shareable result URLs.
23. **Content safety layer** — prompt/image moderation before generation and before public sharing.

### D. Engineering and reliability
24. **Central error-handling middleware** — consistent API error shape and logging.
25. **Request validation** — use Zod/Joi/express-validator for body/schema validation.
26. **Rate limiting** — limit authentication, payment, and generation endpoints.
27. **CORS allowlist** — restrict production frontend origins instead of permissive defaults.
28. **Structured logging** — request IDs, transaction IDs, payment IDs, and generation IDs.
29. **Observability** — metrics for generation latency, payment conversion, failures, and credit usage.
30. **Automated tests** — unit/integration tests for authentication, order creation, signature verification, idempotency, and credit accounting.
31. **CI/CD** — lint, test, build, and deploy automatically on protected branches.
32. **Database indexes** — optimize transaction/user history queries as usage grows.

### E. Product/account features
33. **Forgot/reset password** with expiring reset tokens.
34. **Email verification** after registration.
35. **Profile/account settings**.
36. **Usage analytics** — generations, credits consumed, favorite models, and monthly activity.
37. **Subscription plans** — monthly recurring plans if the business model evolves beyond prepaid credits.
38. **Referral system** — controlled bonus credits with fraud protection.
39. **Admin user management** — account status, manual credit adjustments, and support tooling.
40. **Support/ticket system** — attach transaction IDs and generation IDs to support requests.

## Suggested implementation order

### Phase 1 — production safety
- Webhooks
- Atomic credit ledger
- Rate limiting
- Request validation
- Central error handling
- Automated payment tests

### Phase 2 — user experience
- Payment history
- Invoices
- Generation history
- Gallery
- Account settings

### Phase 3 — generation capabilities
- Multiple models
- Resolution/aspect ratio controls
- Image-to-image
- Inpainting/outpainting
- Batch generation

### Phase 4 — scale
- Queue/worker architecture
- Redis
- Object storage (S3-compatible)
- CDN
- Observability
- Horizontal backend scaling

### Phase 5 — monetization
- Coupons
- Subscriptions
- GST/tax invoices
- Referral program
- Admin revenue analytics
