# Documentation Index

- [`FILE_DOCUMENTATION.md`](./FILE_DOCUMENTATION.md) — file-by-file repository documentation and payment implementation details.
- [`FEATURES_AND_ROADMAP.md`](./FEATURES_AND_ROADMAP.md) — implemented features, current payment flow, plan catalog, and future feature suggestions.

## Payment configuration

1. Copy `server/.env.example` to `server/.env` and add your MongoDB/JWT/Razorpay server secrets.
2. Copy `client/vite-project/.env.example` to `client/vite-project/.env` and set the backend URL plus Razorpay key ID.
3. Use Razorpay test keys while developing.
4. Never expose `RAZORPAY_KEY_SECRET` in the frontend.
