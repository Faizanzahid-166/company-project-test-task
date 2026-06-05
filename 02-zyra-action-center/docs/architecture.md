# Architecture Documentation

## Overview

The Zyra Counselor Action Center is a full-stack monorepo built for counselors to quickly triage student needs. This document explains the technical decisions made across the stack.

---

## Frontend Architecture

### Why TanStack React Query?

React Query was chosen for all server state management because it provides:

- **Automatic caching** — responses are cached by query key and reused without re-fetching until stale
- **Background refetching** — data stays fresh without manual refresh logic
- **Optimistic mutations** — the `onMutate` / `onError` / `onSuccess` lifecycle makes rollback trivial and predictable
- **Loading/error states** — `isLoading`, `isError`, `isFetching` are colocated with the data, eliminating global loading reducers
- **Query invalidation** — after a mutation succeeds, invalidating `['actionCenter', studentId]` triggers an automatic background refetch

Alternatives considered: SWR (less mutation support), Redux Toolkit Query (heavier setup, unnecessary for this use case).

### Why Zustand?

Zustand manages **client-only UI state** that doesn't belong in React Query:

- Dark mode preference (persisted to `localStorage`)
- Active student selection
- Task status filter
- Messages panel open/closed state

Its minimal API (`create`, `persist`) avoids boilerplate while still supporting middleware. The `partialize` option ensures only relevant slices are persisted.

### Feature-Based Structure

Components and hooks are co-located under `features/dashboard/` rather than a flat `components/` tree. This makes the boundary of the feature explicit and allows the whole feature to be moved, duplicated, or deleted as a unit.

```
features/
  dashboard/
    components/   ← UI only, no data fetching
    hooks/        ← data fetching and mutations
    Dashboard.tsx ← composition root
```

### Component Design Principles

- **Dumb components receive data via props** — `StudentProfileCard`, `UrgencyBanner`, `StatsGrid` are purely presentational
- **Smart hooks own data** — `useActionCenter` and `useUpdateTaskStatus` handle all network concerns
- **Dashboard.tsx is the boundary** — it wires store state, query data, and component props together

---

## Backend Architecture

### Service / Controller / Route Separation

```
Routes     → parse HTTP, call controller
Controller → validate input, call service, format response
Service    → business logic, data access
```

Business logic (urgency calculation, stats aggregation) lives exclusively in service classes. Controllers are thin: validate → call service → respond. This makes services independently testable without spinning up an HTTP server.

### UrgencyService

The urgency algorithm is encapsulated and independently unit-testable. Rules:

| Condition | Level |
|-----------|-------|
| Overdue tasks OR critical pending tasks OR unread > 5 | `high` |
| Pending/in-progress tasks OR unread > 2 | `medium` |
| None of the above | `low` |

Thresholds are declared as named constants at the top of the file, making tuning easy.

### Zod Validation

Input validation uses Zod in the controller layer. An invalid `status` value returns a `400 BAD_REQUEST` before reaching the service. This is the appropriate place — the service always receives trusted, typed data.

### AppError

A custom `AppError` class carries `statusCode`, `code`, and `isOperational`. The error handler middleware checks `instanceof AppError` to produce structured responses. Unknown errors fall through as `500 INTERNAL_ERROR`. Stack traces are included in development only.

### Request Logger

The logger middleware attaches a UUID `requestId` to every request and logs a structured JSON line on response finish including method, path, status code, and duration. This format is directly ingestible by log aggregators (Datadog, CloudWatch, Loki).

---

## Scalability

### Current (Mock Data)

Data lives in an in-memory array (`src/data/mockData.ts`). Mutations are reflected immediately in-process. No persistence between restarts.

### Migration to MongoDB

Each service method maps cleanly to a MongoDB operation:

| Current | MongoDB equivalent |
|---------|-------------------|
| `students.find(s => s.id === id)` | `Student.findById(id)` |
| `tasks.filter(t => t.studentId === id)` | `Task.find({ studentId: id })` |
| `tasks[index] = updated` | `Task.findByIdAndUpdate(id, update)` |

The service interface stays identical — only the implementation changes. Recommended: introduce a repository pattern (e.g. `IStudentRepository`) as an abstraction layer before migrating.

### Future WebSocket Support

The action center is a natural candidate for real-time updates (new messages, task status changes by other counselors). The migration path:

1. Add `socket.io` to the Express server
2. Emit events on `TaskService.updateTaskStatus` and new message creation
3. On the frontend, replace `useQuery` polling with a `useEffect` WebSocket subscription that calls `queryClient.setQueryData` directly

React Query's cache is already the single source of truth for the UI — WebSocket updates simply become another write path into the same cache.

---

## Testing Strategy

### Backend

Integration tests use Supertest to test the full Express middleware stack including routing, validation, error handling, and service logic. Each test is isolated — the in-memory data store is reset between test runs via Vitest's module isolation.

### Frontend

- **MSW** intercepts all network requests at the `fetch` level, so tests run against realistic API behaviour without a running server
- **Component tests** verify rendering, accessibility attributes, and user interactions
- **Dashboard integration tests** verify the full loading → data → error state machine

### What Is Not Tested (Tradeoffs)

- Dark mode CSS class toggling — verified by Zustand store unit tests + visual inspection
- Toast notifications — side effects of mutations, covered by the mutation hook contract
- Stale/background refetch timing — React Query's own test suite covers this behaviour

---

## Performance Decisions

- `staleTime: 30_000` — action center data is considered fresh for 30 seconds, preventing redundant fetches during normal navigation
- Optimistic updates — task status changes are reflected instantly in the UI; rollback is automatic on error
- `partialize` in Zustand persist — only `isDarkMode` and `activeStudentId` hit `localStorage`, avoiding unnecessary serialization
- Skeleton loaders instead of spinners — reduces perceived load time by showing layout structure immediately
