# BigVora Store — Customer Marketplace

> **"Find · Buy · Build"**  
> Premium digital marketplace for ready-made Android applications, website platforms, and custom software engineering services.

---

## 1. Overview & Architecture

BigVora Store is built with a **Dark Premium** design system (deep navy `#070A12`, neon-violet gradients, and zero-pill typography), delivering a production customer marketplace with:

- **Ready-Made Android Apps**: Native Kotlin & Jetpack Compose projects with signed APKs and architecture documentation.
- **Ready-Made Websites**: Next.js 15, React 19, and Tailwind CSS codebases with interactive live demo previews.
- **Server-Authoritative SOLD OUT System**: Concurrency reservation locks, single-license sole ownership enforcement, and live stock decrements.
- **Digital Delivery Engine**: Authenticated, time-limited download links (`/api/downloads/:token`), format details, and setup guides.
- **Custom App & Website Development**: Multi-step specification wizards, fixed-price packages, and milestone quote approvals.
- **In-App Messaging**: Real-time communication with customer support and assigned project leads.
- **Device Viewport Toggle**: Switch between an authentic Android phone frame (390px with camera punch-hole), Tablet frame (768px), or Responsive desktop.

---

## 2. Technology Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, Lucide Icons, Canvas Confetti.
- **Backend**: Express (TypeScript/tsx) running on port 3000 with REST API endpoints under `/api/*`.
- **Database Schema**: Documented PostgreSQL DDL with indexes, relational tables, and foreign keys.
- **Testing**: Dedicated unit test suite validating inventory state machine, single-license exhaustion, and idempotency.

---

## 3. Running the Project

### Development Server
```bash
npm run dev
# Starts full-stack Express server + Vite middlewares at http://localhost:3000
```

### Running Unit Tests
```bash
npm test
# Executes the BigVora core inventory, idempotency, and download token tests
```

### Production Build
```bash
npm run build
npm start
```

---

## 4. Key Endpoints & API Contracts

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/products` | Lists filtered Android apps and websites with live stock |
| `GET` | `/api/products/:id` | Returns complete product specifications and reviews |
| `POST` | `/api/inventory/reserve` | 10-minute transactional reservation lock |
| `POST` | `/api/orders` | Idempotent verified order placement |
| `GET` | `/api/downloads/:token` | Authenticated download of purchased ZIP archives |
| `POST` | `/api/auth/send-otp` | Initiates mobile OTP verification |
| `POST` | `/api/auth/verify-otp` | Validates OTP and issues session |
| `POST` | `/api/requests` | Submits custom app / website development brief |
| `PATCH` | `/api/requests/:id/approve` | Approves milestone quote and advances status |
| `GET` | `/api/conversations` | Fetches user messaging threads |
| `POST` | `/api/conversations/:id/messages` | Sends message with attachments |
| `GET` | `/api/docs` | OpenAPI specification for future Admin and Developer apps |

---

## 5. SOLD OUT System Specification

- **AVAILABLE**: Item has unreserved inventory. Buy Now and Add to Cart are active.
- **RESERVED**: All available stock is held by pending checkouts (10-minute lease).
- **SOLD_OUT**: When a `SINGLE_LICENSE` product is purchased, or `LIMITED_STOCK` reaches 0, the server marks the listing `SOLD_OUT`. The frontend badge reflects backend state, Buy Now is disabled, and checkout is rejected at the API layer.
