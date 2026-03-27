# Project Improvement Plan: Jubotara News

This document tracks the strategic improvements for performance and user experience.

## Phase 1: High-Impact Performance (Speed & Core Web Vitals)

### 1.1 Database Optimization

- [x] **Indexing:** Add indexes to `models/News.js` for `category`, `status`, and `publishedAt` to speed up homepage queries.
- [x] **Consistent Lean Queries:** Audit all data-fetching functions in `lib/localData.js` to ensure `.lean()` is used for read-only operations.
- [x] **Query Projection:** Update queries to only fetch necessary fields (e.g., exclude `content` when fetching lists for the homepage).

### 1.2 Image & Assets

- [x] **LQP (Low Quality Placeholders):** Implement `blurDataURL` in `next/image` for news thumbnails to improve perceived load speed.
- [x] **Cloudinary Optimization:** Configure automatic format (f_auto) and quality (q_auto) for all images served via Cloudinary.
- [x] **Font Loading:** Optimize `public/fonts/SolaimanLipi.ttf` using `next/font/local` to prevent Layout Shift (CLS).

### 1.3 Code Splitting

- [ ] **Dynamic Imports:** Use `next/dynamic` for heavy client-side components like `FacebookComments`, `VideoSection`, and `EPaperViewer`.
- [ ] **Bundle Analysis:** Run a build analysis to identify and split large third-party libraries.

---

## Phase 2: Essential UX Enhancements (Engagement & Retention)

### 2.1 Visual Feedback

- [x] **Global Skeleton System:** Replace current loading spinners with page-specific Skeleton screens (especially for the News Detail and Category pages).
- [x] **Reading Progress Bar:** Add a subtle animated progress bar at the top of the `app/(public)/news/[slug]/page.js` article view.

### 2.2 Navigation & Search

- [ ] **Instant Search:** Implement a debounced search in `components/common/Search.js` that shows results in a dropdown as the user types.
- [ ] **Dark Mode:** Implement `next-themes` and update `globals.css` with a dark color palette for late-night reading comfort.

### 2.3 Interactive Features

- [ ] **E-Paper "Quick View":** Enhance `HotspotModal.jsx` to show article text directly when clicking a hotspot, rather than just zooming or linking.
- [ ] **Save for Later:** Add a "Bookmark" button to news cards using Redux for local storage persistence (and MongoDB for logged-in users).

---

## Phase 3: Infrastructure & Technical Integrity

### 3.1 Resilience

- [ ] **Global Error Boundary:** Create a custom `error.js` for the `(public)` route group to handle data-fetching failures gracefully.
- [ ] **API Rate Limiting:** Implement basic rate limiting for API routes to protect the database from bot scraping.

### 3.2 Type Safety & Refactoring

- [ ] **TypeScript Migration:** Systematically rename `.js` files to `.ts/.tsx` and define interfaces for `News`, `Category`, and `User`.
- [ ] **Centralized API Client:** Refactor `lib/api-client.js` to handle global headers, error logging, and retry logic.

---

## Phase 4: Monitoring & Analytics

- [ ] **Vercel Analytics Setup:** Ensure `@vercel/analytics` and `@vercel/speed-insights` are correctly reporting real-world performance data.
- [ ] **Custom Events:** Track "Search" and "Bookmark" interactions to understand user behavior.

---

## How to use this plan:

1.  **Select a task:** Pick an item from the list above.
2.  **Execute:** Implement the change using the **Plan -> Act -> Validate** cycle.
3.  **Update:** Change `[ ]` to `[x]` in this file and commit the update.
