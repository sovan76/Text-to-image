# TextToImage — File Documentation

This document describes the current repository after the payment integration work.

## Repository layout

```text
texttoimage/
├── client/vite-project/       # React + Vite frontend
├── server/                    # Express + MongoDB backend
├── imagify-assets/            # Existing static/project assets
└── docs/                      # Project documentation
```

> `.env` files contain local secrets and are intentionally kept out of the distributable configuration. Use the provided `.env.example` files.

## Frontend

### `client/vite-project/index.html`
Vite HTML entry point. Mounts the React application into `#root` and defines the browser page metadata.

### `client/vite-project/src/main.jsx`
Application bootstrap. Creates the React root, enables `BrowserRouter`, and wraps the application in `AppContextProvider`.

### `client/vite-project/src/App.jsx`
Top-level routing and page shell. Defines routes for home, result, and pricing and renders the navbar/footer and login modal.

### `client/vite-project/src/context/AppContext.jsx`
Global application state and API helpers. Stores the authenticated user, JWT, credit balance, login modal state, backend URL, logout behavior, credit refresh, and image-generation request.

### `client/vite-project/src/pages/Home.jsx`
Home/landing page for the text-to-image product.

### `client/vite-project/src/pages/Result.jsx`
Displays generated-image results and related actions.

### `client/vite-project/src/pages/BuyCredit.jsx`
Credit purchase page. It now loads Razorpay Checkout dynamically, authenticates the user before starting checkout, creates a server-side Razorpay order, opens Checkout with that order, sends the callback to the backend for signature verification, refreshes credits only after successful verification, and handles payment failure/dismissal states.

### `client/vite-project/src/components/Navbar.jsx`
Application navigation/header and authentication/credit UI.

### `client/vite-project/src/components/Login.jsx`
Login/register UI and authentication requests.

### `client/vite-project/src/components/GenerateBtn.jsx`
UI control that starts image generation through the application context.

### `client/vite-project/src/components/Header.jsx`
Hero/header presentation for the landing experience.

### `client/vite-project/src/components/Description.jsx`
Product description/marketing content.

### `client/vite-project/src/components/Steps.jsx`
Explains the product workflow in three visual steps.

### `client/vite-project/src/components/Testimonials.jsx`
Displays testimonial cards using the supplied asset data.

### `client/vite-project/src/components/Footer.jsx`
Site footer and supporting links/content.

### `client/vite-project/src/assets/assets.js`
Central frontend asset registry plus pricing-plan display data. Current plans are Basic (₹10/100 credits), Advanced (₹50/500 credits), and Business (₹250/5000 credits).

### `client/vite-project/src/assets/*`
Logos, icons, sample images, profile images, and other UI assets used by the frontend.

### `client/vite-project/src/index.css`
Global CSS/Tailwind-related styles.

### `client/vite-project/vite.config.js`
Vite build/development configuration.

### `client/vite-project/package.json`
Frontend dependencies and npm scripts.

### `client/vite-project/.env.example`
Safe template for frontend environment variables: `VITE_BACKEND_URL` and `VITE_RAZORPAY_KEY_ID`. The Razorpay secret must never be placed in the frontend.

## Backend

### `server/server.js`
Express application entry point. Loads environment configuration, connects to MongoDB, enables JSON/CORS middleware, mounts user/image routes, and starts the server.

### `server/config/mongodb.js`
MongoDB connection helper.

### `server/middlewares/auth.js`
JWT authentication middleware. Reads the token from the request headers, verifies it, and exposes the authenticated user's ID as `req.user.id`.

### `server/controllers/userController.js`
User and payment business logic. Contains registration, login, credit retrieval, Razorpay order creation, and Razorpay signature verification. Payment amounts/credits are validated server-side and credits are not added until signature verification succeeds.

### `server/models/userModel.js`
MongoDB user schema. Stores name, email, password hash, and credit balance.

### `server/models/transactionModel.js`
MongoDB payment ledger. Stores user, plan, amount, credits, payment status, Razorpay order/payment IDs, signature, and paid timestamp.

### `server/routes/userRoutes.js`
User/auth/payment API routes:
- `POST /api/user/register`
- `POST /api/user/login`
- `GET /api/user/credits`
- `POST /api/user/pay-razor`
- `POST /api/user/verify-payment`

### `server/controllers/imageController.js`
Existing image-generation controller.

### `server/routes/imageRoutes.js`
Existing image-generation API routes.

### `server/package.json`
Backend dependencies and npm scripts. Razorpay is already included.

### `server/.env.example`
Safe backend configuration template for MongoDB, JWT, Razorpay, currency, and port.

## Configuration and security

Do not commit real MongoDB credentials, JWT secrets, or Razorpay secrets. The working package contains blank local `.env` files and `.env.example` templates so credentials must be supplied locally.

For production, use a secret manager/environment configuration rather than storing secrets in source control.



## Complete file inventory

| File | Purpose |
|---|---|
| `client/vite-project/.env` | Local environment configuration; secrets must be supplied locally. |
| `client/vite-project/.env.example` | Safe environment-variable template. |
| `client/vite-project/.gitignore` | Project file. |
| `client/vite-project/README.md` | Project documentation. |
| `client/vite-project/eslint.config.js` | JavaScript configuration, backend, routing, controller, or utility module. |
| `client/vite-project/index.html` | Browser/Vite HTML entry point. |
| `client/vite-project/package-lock.json` | Locked npm dependency versions. |
| `client/vite-project/package.json` | Package metadata, dependencies, and scripts. |
| `client/vite-project/public/favicon.svg` | SVG UI/brand asset. |
| `client/vite-project/src/App.jsx` | React component/page/application module. |
| `client/vite-project/src/assets/assets.js` | JavaScript configuration, backend, routing, controller, or utility module. |
| `client/vite-project/src/assets/credit_star.svg` | SVG UI/brand asset. |
| `client/vite-project/src/assets/cross_icon.svg` | SVG UI/brand asset. |
| `client/vite-project/src/assets/download_icon.svg` | SVG UI/brand asset. |
| `client/vite-project/src/assets/email_icon.svg` | SVG UI/brand asset. |
| `client/vite-project/src/assets/facebook_icon.svg` | SVG UI/brand asset. |
| `client/vite-project/src/assets/instagram_icon.svg` | SVG UI/brand asset. |
| `client/vite-project/src/assets/lock_icon.svg` | SVG UI/brand asset. |
| `client/vite-project/src/assets/logo.svg` | SVG UI/brand asset. |
| `client/vite-project/src/assets/logo_icon.svg` | SVG UI/brand asset. |
| `client/vite-project/src/assets/profile_icon.png` | Image asset used by the frontend/project. |
| `client/vite-project/src/assets/profile_img_1.png` | Image asset used by the frontend/project. |
| `client/vite-project/src/assets/profile_img_2.png` | Image asset used by the frontend/project. |
| `client/vite-project/src/assets/rating_star.svg` | SVG UI/brand asset. |
| `client/vite-project/src/assets/sample_img_1.png` | Image asset used by the frontend/project. |
| `client/vite-project/src/assets/sample_img_2.png` | Image asset used by the frontend/project. |
| `client/vite-project/src/assets/star_group.png` | Image asset used by the frontend/project. |
| `client/vite-project/src/assets/star_icon.svg` | SVG UI/brand asset. |
| `client/vite-project/src/assets/step_icon_1.svg` | SVG UI/brand asset. |
| `client/vite-project/src/assets/step_icon_2.svg` | SVG UI/brand asset. |
| `client/vite-project/src/assets/step_icon_3.svg` | SVG UI/brand asset. |
| `client/vite-project/src/assets/twitter_icon.svg` | SVG UI/brand asset. |
| `client/vite-project/src/components/Description.jsx` | React component/page/application module. |
| `client/vite-project/src/components/Footer.jsx` | React component/page/application module. |
| `client/vite-project/src/components/GenerateBtn.jsx` | React component/page/application module. |
| `client/vite-project/src/components/Header.jsx` | React component/page/application module. |
| `client/vite-project/src/components/Login.jsx` | React component/page/application module. |
| `client/vite-project/src/components/Navbar.jsx` | React component/page/application module. |
| `client/vite-project/src/components/Steps.jsx` | React component/page/application module. |
| `client/vite-project/src/components/Testimonials.jsx` | React component/page/application module. |
| `client/vite-project/src/context/AppContext.jsx` | React component/page/application module. |
| `client/vite-project/src/index.css` | Frontend styling. |
| `client/vite-project/src/main.jsx` | React component/page/application module. |
| `client/vite-project/src/pages/BuyCredit.jsx` | React component/page/application module. |
| `client/vite-project/src/pages/Home.jsx` | React component/page/application module. |
| `client/vite-project/src/pages/Result.jsx` | React component/page/application module. |
| `client/vite-project/vite.config.js` | JavaScript configuration, backend, routing, controller, or utility module. |
| `imagify-assets/assets/assets.js` | JavaScript configuration, backend, routing, controller, or utility module. |
| `imagify-assets/assets/credit_star.svg` | SVG UI/brand asset. |
| `imagify-assets/assets/cross_icon.svg` | SVG UI/brand asset. |
| `imagify-assets/assets/download_icon.svg` | SVG UI/brand asset. |
| `imagify-assets/assets/email_icon.svg` | SVG UI/brand asset. |
| `imagify-assets/assets/facebook_icon.svg` | SVG UI/brand asset. |
| `imagify-assets/assets/favicon.svg` | SVG UI/brand asset. |
| `imagify-assets/assets/instagram_icon.svg` | SVG UI/brand asset. |
| `imagify-assets/assets/lock_icon.svg` | SVG UI/brand asset. |
| `imagify-assets/assets/logo.svg` | SVG UI/brand asset. |
| `imagify-assets/assets/logo_icon.svg` | SVG UI/brand asset. |
| `imagify-assets/assets/profile_icon.png` | Image asset used by the frontend/project. |
| `imagify-assets/assets/profile_img_1.png` | Image asset used by the frontend/project. |
| `imagify-assets/assets/profile_img_2.png` | Image asset used by the frontend/project. |
| `imagify-assets/assets/rating_star.svg` | SVG UI/brand asset. |
| `imagify-assets/assets/sample_img_1.png` | Image asset used by the frontend/project. |
| `imagify-assets/assets/sample_img_2.png` | Image asset used by the frontend/project. |
| `imagify-assets/assets/star_group.png` | Image asset used by the frontend/project. |
| `imagify-assets/assets/star_icon.svg` | SVG UI/brand asset. |
| `imagify-assets/assets/step_icon_1.svg` | SVG UI/brand asset. |
| `imagify-assets/assets/step_icon_2.svg` | SVG UI/brand asset. |
| `imagify-assets/assets/step_icon_3.svg` | SVG UI/brand asset. |
| `imagify-assets/assets/twitter_icon.svg` | SVG UI/brand asset. |
| `server/.env` | Local environment configuration; secrets must be supplied locally. |
| `server/.env.example` | Safe environment-variable template. |
| `server/.gitignore` | Project file. |
| `server/config/mongodb.js` | JavaScript configuration, backend, routing, controller, or utility module. |
| `server/controllers/imageController.js` | JavaScript configuration, backend, routing, controller, or utility module. |
| `server/controllers/userController.js` | JavaScript configuration, backend, routing, controller, or utility module. |
| `server/middlewares/auth.js` | JavaScript configuration, backend, routing, controller, or utility module. |
| `server/models/transactionModel.js` | JavaScript configuration, backend, routing, controller, or utility module. |
| `server/models/userModel.js` | JavaScript configuration, backend, routing, controller, or utility module. |
| `server/package-lock.json` | Locked npm dependency versions. |
| `server/package.json` | Package metadata, dependencies, and scripts. |
| `server/routes/imageRoutes.js` | JavaScript configuration, backend, routing, controller, or utility module. |
| `server/routes/userRoutes.js` | JavaScript configuration, backend, routing, controller, or utility module. |
| `server/server.js` | JavaScript configuration, backend, routing, controller, or utility module. |
