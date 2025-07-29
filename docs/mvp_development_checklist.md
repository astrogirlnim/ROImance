MVP Development Checklist
=========================

Template Overview
-----------------
This checklist translates the R.O.I.mance PRD into a phased, dependency-aware implementation plan. Each feature is expressed in complete sentences and broken into independently testable sub-features.

Phases Overview
---------------
[ ] **Phase 1: Foundation**  
[ ] **Phase 2: Data Layer**  
[ ] **Phase 3: Interface Layer**  
[ ] **Phase 4: Implementation Layer**

---
### Phase 1 – Foundation
*Criteria: Essential scaffolding the application cannot function without. Features here have no cross-dependencies.*

[~] **Feature 1 – Initialise full-stack monorepo**  
  [ ] Create a Git repository with root ESLint/Prettier configuration.  
  [x] Scaffold a Vite + React-TypeScript frontend.  
  [ ] Scaffold an Express-TypeScript backend in a separate folder.  
  [ ] Add shared `npm` scripts for dev, build, and lint in the root `package.json`.

[ ] **Feature 2 – Configure database & environment**  
  [ ] Add a Docker Compose file that starts a Postgres instance.  
  [ ] Create `.env.example` documenting DB connection variables.  
  [ ] Introduce a migration tool (e.g. Prisma or Knex) and initialise the migration folder.  
  [ ] Verify backend connects to Postgres using env vars at server start-up.

[ ] **Feature 3 – Fake username-only authentication**  
  [ ] Implement a `/login` endpoint that accepts a plain username and issues a signed cookie session.  
  [ ] Add middleware that attaches the current user object to `req`.  
  [ ] Provide a logout route that clears the session cookie.  
  [ ] Write minimal in-memory user repository (no persistent users required).

[~] **Feature 4 – Global UI baseline**  
  [ ] Install ShadCN component library and configure theme tokens.  
  [ ] Set up React Router with routes for Hero, Portfolio, Stock View, and Profile pages.  
  [x] Implement a responsive top-nav layout shell used by all pages.  
  [x] Add global CSS (+reset) and colour palette aligning with the "pastel base with bold chart colours" aesthetic.

---
### Phase 2 – Data Layer
*Criteria: Schemas, queries, and endpoints for storing and retrieving application data. Each feature depends on Phase 1 completion.*

[ ] **Feature 1 – Transaction data model & API**  
  [ ] Add a `transactions` table: `id`, `relationship_id`, `amount_ec`, `is_credit`, `note`, `timestamp`.  
  [ ] Create CRUD Express routes under `/api/transactions`.  
  [ ] Write unit tests asserting create, read, and list behaviours.  
  [ ] Document request/response JSON in inline JSDoc.

[ ] **Feature 2 – Relationship & metrics model**  
  [ ] Add `relationships` table: `id`, `name`, `created_at`.  
  [ ] Store daily EC price snapshots in `relationship_prices` table.  
  [ ] Implement server-side functions to compute APH, CCR, and DNII metrics.  
  [ ] Expose `/api/relationships/:id/metrics` endpoint returning latest metrics & history.

[ ] **Feature 3 – Market order model & API**  
  [ ] Add `orders` table: `id`, `relationship_id`, `user`, `side`, `shares`, `price`, `timestamp`.  
  [ ] Provide endpoints `/api/orders` for placing and listing buy/sell orders.  
  [ ] Persist completed trades in `trades` table with matcher stub (matching logic implemented later).  
  [ ] Return order-book snapshot aggregated by price level.

[ ] **Feature 4 – Public profile & leaderboard data**  
  [ ] Expose `/api/relationships/public` returning all relationships with latest EC value.  
  [ ] Implement `/api/leaderboard` that ranks relationships by EC growth over configurable window.  
  [ ] Add simple caching layer (in-memory) for leaderboard responses.  
  [ ] Ensure all endpoints respect “all data public” rule; no auth checks required for GET.

---
### Phase 3 – Interface Layer
*Criteria: Visible components and user interactions. Features depend on Phases 1 & 2.*

[ ] **Feature 1 – Hero / Login page UI**  
  [ ] Build a landing section explaining the premise with a prominent username login form.  
  [ ] On successful login, store session in `localStorage` and redirect to Portfolio.  
  [ ] Display disclaimer banner that all entered data is public.  
  [ ] Add subtle comic tone while maintaining professional styling.

[~] **Feature 2 – Portfolio dashboard UI**  
  [x] Render EC price history using ChartJS line chart.  
  [ ] Show computed APH, CCR, DNII metrics in a ShadCN card grid.  
  [ ] Provide “Log transaction” button that opens a modal form.  
  [x] Ensure layout is mobile-first responsive.

[ ] **Feature 3 – Stock View page UI**  
  [ ] Display real-time order book depth chart (ChartJS bar chart).  
  [ ] Include buy/sell order entry form with validation.  
  [ ] Show user’s P/L summary beneath the chart.  
  [ ] Present leaderboard sidebar with top relationships.

[ ] **Feature 4 – Public profile page UI**  
  [ ] List all relationships with avatar, EC trend sparkline, and growth ranking.  
  [ ] Clicking a relationship opens its Stock View page.  
  [ ] Provide filter controls (search, sort by growth).  
  [ ] Maintain consistent pastel/bold aesthetic.

---
### Phase 4 – Implementation Layer
*Criteria: Business logic wiring that delivers full application value. Features depend on completion of Phases 1-3.*

[ ] **Feature 1 – End-to-end transaction logging flow**  
  [ ] Connect the “Log transaction” modal to POST `/api/transactions`.  
  [ ] On success, refresh dashboard chart and metrics in real time.  
  [ ] Emit a toast confirmation using ShadCN.  
  [ ] Persist EC snapshot for the affected relationship.

[ ] **Feature 2 – Market mechanics flow**  
  [ ] Implement basic order-matching engine that clears opposing orders by price/time priority.  
  [ ] Update order book and trade history websockets to push live updates to clients.  
  [ ] Recompute and expose user P/L after every trade.  
  [ ] Charge a configurable transaction fee on each executed trade.

[ ] **Feature 3 – Social comparison & leaderboard logic**  
  [ ] Schedule a daily job that recalculates EC growth for all relationships.  
  [ ] Refresh `/api/leaderboard` cache after job completion.  
  [ ] Update leaderboard component via websocket or SWR revalidation.  
  [ ] Highlight top performers with crown iconography.

[ ] **Feature 4 – Gamification & compliance features**  
  [ ] Award achievement badges (streaks, high ROI, etc.) when server-side rules trigger.  
  [ ] Display earned badges on Portfolio and Profile pages.  
  [ ] Render persistent disclaimer banner on all pages that data is public.  
  [ ] Provide toggle to hide own username from public lists (still public but obfuscated).

---
Implementation Guidelines
------------------------
* **Phase Criteria Definitions** – Phases must be executed in order; Phase 2 and 3 tasks may run in parallel once Phase 1 completes.
* **Feature Independence** – Every sub-feature is self-contained, testable in isolation, and can be safely rolled back.
* **Priority Classification** – All items listed are *Critical Importance* unless explicitly noted otherwise.

Status Tracking Legend
----------------------
[ ] Not Started   [~] In Progress   [x] Completed   [!] Blocked

---
*End of checklist.* 