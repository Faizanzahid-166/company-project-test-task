# Zyra — Counselor Student Action Center

A production-quality full-stack dashboard helping school counselors quickly triage student priorities, open tasks, unread messages, and urgency levels.

---

## Project Overview

The Action Center gives a counselor a single pane of glass view for each student, surfacing:

- **Urgency level** — auto-calculated from overdue tasks, unread message volume, and task criticality
- **Task management** — full CRUD-style status updates with optimistic UI and rollback
- **Unread messages** — threaded view of messages from students, parents, and teachers
- **Statistics** — at-a-glance task completion and message metrics

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────┐
│                    Browser                        │
│                                                   │
│  ┌────────────────────────────────────────────┐  │
│  │  React + Vite + TypeScript                  │  │
│  │                                              │  │
│  │  TanStack Query ──▶ API Client (Axios)      │  │
│  │       │                    │                 │  │
│  │  Zustand Store      MSW (test only)          │  │
│  └────────────────────┬───────────────────────┘  │
└───────────────────────┼─────────────────────────┘
                        │ HTTP / REST
┌───────────────────────┼─────────────────────────┐
│  Express + TypeScript  │                          │
│                        ▼                          │
│  Middleware ──▶ Routes ──▶ Controllers            │
│                              │                    │
│                         Services                  │
│                   (StudentService,                │
│                    TaskService,                   │
│                    UrgencyService)                │
│                              │                    │
│                      In-Memory Store              │
│                   (→ MongoDB-ready)               │
└───────────────────────────────────────────────────┘
```

---

## Folder Structure

```
/
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI
├── backend/
│   ├── src/
│   │   ├── controllers/        # Thin HTTP handlers
│   │   ├── data/               # Mock data store
│   │   ├── middleware/         # Logger, error handler, 404
│   │   ├── routes/             # Express router
│   │   ├── services/           # Business logic
│   │   │   ├── StudentService.ts
│   │   │   ├── TaskService.ts
│   │   │   └── UrgencyService.ts
│   │   ├── tests/              # Supertest integration tests
│   │   ├── types/              # Shared domain types
│   │   ├── utils/              # AppError
│   │   └── index.ts            # Express app entry
│   ├── package.json
│   ├── tsconfig.json
│   └── vitest.config.ts
├── frontend/
│   ├── src/
│   │   ├── api/                # Axios client
│   │   ├── components/
│   │   │   └── ui/             # Badge, Card, Select, Skeleton
│   │   ├── features/
│   │   │   └── dashboard/
│   │   │       ├── components/ # Presentational components
│   │   │       ├── hooks/      # React Query hooks
│   │   │       └── Dashboard.tsx
│   │   ├── lib/                # utils, cn helper
│   │   ├── store/              # Zustand store
│   │   ├── tests/              # Vitest + RTL + MSW
│   │   ├── types/              # Domain types (mirrors backend)
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vitest.config.ts
├── docs/
│   └── architecture.md
├── package.json                # Root scripts
└── README.md
```

---

## Setup Instructions

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Install all dependencies

```bash
# From repo root
npm install
cd backend && npm install
cd ../frontend && npm install
```

---

## Running the Backend

```bash
cd backend
npm run dev
# Server starts on http://localhost:4000
```

---

## Running the Frontend

```bash
cd frontend
npm run dev
# App starts on http://localhost:5173
```

The Vite dev server proxies `/api` requests to `http://localhost:4000`, so no CORS configuration is needed in development.

---

## Running Tests

### All tests (from repo root)

```bash
npm test
```

### Backend only

```bash
cd backend
npm test
```

### Frontend only

```bash
cd frontend
npm test
```

---

## API Contract

### `GET /api/students/:id/action-center`

Returns the full action center payload for a student.

**Response 200**

```json
{
  "success": true,
  "data": {
    "student": {
      "id": "student-001",
      "firstName": "Maya",
      "lastName": "Johnson",
      "email": "maya.johnson@school.edu",
      "grade": "11th",
      "status": "at_risk",
      "counselorName": "Dr. Sarah Chen",
      "gpa": 2.4
    },
    "tasks": [
      {
        "id": "task-001",
        "title": "Submit college application essays",
        "status": "pending",
        "priority": "critical",
        "dueDate": "2024-01-15T00:00:00.000Z"
      }
    ],
    "unreadMessages": [...],
    "urgencyLevel": "high",
    "stats": {
      "totalTasks": 4,
      "completedTasks": 1,
      "pendingTasks": 2,
      "inProgressTasks": 1,
      "overdueTasks": 1,
      "unreadMessageCount": 5
    }
  }
}
```

**Response 404**

```json
{
  "success": false,
  "error": {
    "requestId": "uuid",
    "message": "Student with id \"xyz\" not found",
    "code": "NOT_FOUND"
  }
}
```

---

### `PATCH /api/tasks/:taskId/status`

Updates the status of a task.

**Request body**

```json
{ "status": "in_progress" }
```

Valid values: `pending` | `in_progress` | `completed`

**Response 200**

```json
{
  "success": true,
  "data": {
    "id": "task-001",
    "status": "in_progress",
    "updatedAt": "2024-01-16T10:30:00.000Z"
  }
}
```

**Response 400** — invalid status value

**Response 404** — task not found

---

## Design Decisions

| Decision | Rationale |
|----------|-----------|
| TanStack React Query for server state | Caching, background sync, optimistic mutations, and loading/error states are all built-in |
| Zustand for UI state | Minimal API, easy `localStorage` persistence via middleware, no boilerplate |
| MSW for frontend tests | Intercepts at the network level — tests are identical regardless of implementation detail changes |
| Service/Controller separation | Business logic (urgency calculation, stats) is independently testable without HTTP |
| Zod for input validation | Schema validation co-located with the route, TypeScript-native |
| AppError utility class | Consistent error format across all endpoints, clear distinction between operational and unexpected errors |
| Feature-based folder structure | All dashboard concerns live in `features/dashboard/` for cohesion and portability |

---

## Tradeoffs

- **In-memory store**: Data is lost on server restart. Chosen for simplicity; the migration path to MongoDB is documented in `docs/architecture.md`. Each service method maps 1:1 to a Mongoose call.
- **No authentication**: The API has no auth layer. In production, middleware would validate a JWT and scope data to the authenticated counselor.
- **Mock students in Navbar**: The student switcher uses a hardcoded list. In production this would be fetched from a `/counselors/:id/students` endpoint.
- **Frontend tests vs E2E**: Component and integration tests cover most behaviour. Cypress/Playwright E2E tests would be added before production launch.

---

## Performance Decisions

- `staleTime: 30_000` ms in React Query — prevents redundant fetches on rapid navigation
- Optimistic updates in `useUpdateTaskStatus` — zero-latency UI feedback with automatic rollback
- Skeleton loaders — layout structure shown immediately, avoiding layout shift on data arrival
- `partialize` in Zustand persist — only two fields written to `localStorage`

---

## Future Improvements

- [ ] MongoDB integration with Mongoose repositories
- [ ] WebSocket support for real-time task/message updates
- [ ] JWT authentication + per-counselor data scoping
- [ ] Pagination for task and message lists
- [ ] Full-text search across tasks and messages
- [ ] E2E tests with Playwright
- [ ] Rate limiting and request throttling on the API
- [ ] Student bulk view (counselor sees all students in a single grid)
- [ ] Email/push notification triggers when urgency level changes

---

## Screenshots

> Start the app (`npm run dev` in both `backend/` and `frontend/`) and navigate to `http://localhost:5173`.

The dashboard renders with:

- A profile card showing student name, grade, GPA, status, and counselor
- A colour-coded urgency banner (red/amber/green)
- A 6-tile stats grid with overdue task highlighting
- A task list with inline status dropdowns and optimistic updates
- A collapsible unread messages panel
- Dark mode toggle in the top-right navbar
