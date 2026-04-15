# Vantage — Project Context

> **Auto-maintained by the Architect agent.** Updated after each design session.
> Last updated: 2026-04-01

## Features Inventory

| Feature | Location | Status |
|---------|----------|--------|
| Login Page | `src/screens/LoginPage.tsx` | Complete |
| Feed | `src/components/Feed*`, `src/data/feed.ts` | In progress |
| Feed Item Actions | `src/components/actions/Action*.tsx`, `ShareDialog.tsx`, `RateDialog.tsx` | Complete |
| Campaign Dashboard | `src/screens/CampaignDashboard.tsx` | In progress |
| Campaign Detail | `src/screens/CampaignDetail.tsx` | In progress |
| Voter Workbench | `src/screens/VoterWorkbench.tsx` | In progress |
| Field Ops Report | `src/screens/FieldOpsReport.tsx` | In progress |
| Component Gallery | `src/components/ComponentGallery.tsx` | In progress |
| **Kanban Board** | `src/features/kanban/` | **In progress** |

## Component Tree

```
Routes
├── /login → LoginPage (standalone, no Shell chrome)
└── /* → AuthGate (renders LoginPage if !isAuthenticated, else Shell)
    └── Shell
    ├── TopNavbar
    ├── Sidebar (added "Boards" section → /boards)
    ├── Panel (main content area)
    │   ├── CampaignDashboard
    │   │   ├── KpiCard
    │   │   ├── BarChart
    │   │   ├── DonutChart
    │   │   ├── DataTable
    │   │   ├── MapView
    │   │   └── Timeline
    │   ├── CampaignDetail
    │   ├── VoterWorkbench
    │   ├── FieldOpsReport
    │   ├── Feed
    │   │   ├── FeedItem
    │   │   │   ├── FeedItemHeader
    │   │   │   ├── FeedItemContent
    │   │   │   ├── FeedItemActions
    │   │   │   │   └── ActionButton
    │   │   │   ├── ActionDialog (Investigate / TaskPersonnel / Watch)
    │   │   │   ├── ShareDialog
    │   │   │   ├── RateDialog
    │   │   │   └── CommentThread
    │   │   │       ├── CommentItem
    │   │   │       └── CommentInput
    │   │   └── ActivityFeed (widget)
    │   ├── KanbanPage (/boards)
    │   │   ├── KanbanHeader (board title, key, member avatars)
    │   │   ├── KanbanBoard (DragDropContext)
    │   │   │   ├── KanbanColumn (Droppable × N)
    │   │   │   │   ├── ColumnHeader (title, count, menu)
    │   │   │   │   ├── KanbanCard (Draggable × N)
    │   │   │   │   │   ├── PriorityIcon
    │   │   │   │   │   └── ProgressBar (compact)
    │   │   │   │   └── "Add a card" button
    │   │   │   └── AddColumnButton
    │   │   ├── KanbanCardDetail (Dialog)
    │   │   │   ├── Markdown description (react-markdown)
    │   │   │   ├── MilestoneList (checkboxes)
    │   │   │   ├── ProgressBar (full)
    │   │   │   ├── Priority / Assignee / Column sidebar
    │   │   │   └── TaskCommentThread
    │   │   └── ColumnSettings (Dialog)
    │   └── ComponentGallery
    └── ScreenLayout (template)
```

## Data Flow Map

- **AppContext** (`src/context/AppContext.tsx`) — global application state
- **appState** (`src/context/appState.ts`) — state shape/defaults
- **useApp** (`src/context/useApp.ts`) — context consumer hook
- **KanbanContext** (`src/features/kanban/context/KanbanContext.tsx`) — board-scoped state (board, columns, tasks, members; moveTask, addColumn, removeColumn, renameColumn, addTask, updateTask, deleteTask)
- **Toaster** (`src/toaster.ts`) — singleton `OverlayToaster.createAsync` for app-wide toast notifications
- **Data files** — `src/data/feed.ts`, `src/data/gallery.ts`, `src/data/screens.ts` (static/mock data), `src/features/kanban/data/demoBoard.ts` (static Kanban demo data)
- **API integration** — Kanban API layer created (`src/features/kanban/api/`), not yet wired to components; other features not yet wired; all consume kampanya-360 REST API (`/api/*`)
- **Auth flow** — `isAuthenticated` boolean in AppContext; `AuthGate` component renders `LoginPage` when false, `Shell` when true. `LoginPage` validates credentials against a dummy account (`riemann` / `Zulu1234`) and calls `setAuthenticated(true)` on success. No real auth backend wired yet.

## Directory Layout

```
src/
├── components/       # Shared components (Feed, Comments, Nav, Sidebar, Panel)
│   └── actions/      # Action dialogs (ActionDialog, InvestigatePanel, TaskPersonnelPanel, WatchPanel, ShareDialog, RateDialog)
├── context/          # Global app context (AppContext, appState, useApp)
├── data/             # Static/mock data
├── features/         # Feature-based modules (NEW — first feature: kanban)
│   └── kanban/
│       ├── api/      # API modules (boardApi, columnApi, taskApi, milestoneApi, commentApi, client)
│       ├── components/ # All Kanban UI components (12 files)
│       ├── context/  # KanbanContext (board-scoped state)
│       ├── data/     # Demo/static data (demoBoard.ts)
│       ├── types.ts  # Board, Column, Task, Milestone, Comment types
│       └── kanban.css # Atlassian-style Kanban CSS
├── screens/          # Top-level route views (LoginPage, CampaignDashboard, etc.)
├── templates/        # Layout wrappers (ScreenLayout)
├── widgets/          # Reusable dashboard widgets (KpiCard, BarChart, etc.)
├── assets/           # Static assets
├── toaster.ts        # Singleton app toaster
├── types.ts          # Shared type definitions
├── App.tsx           # Root component with routing
└── main.tsx          # Entry point
```

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-03-28 | Initial PROJECT_CONTEXT.md created | Establish architectural source of truth |
| — | Blueprint UI as sole component library | Consistent design language, rich component set, enterprise-grade |
| — | Feature-based directory target structure | Colocation of related code reduces coupling, improves discoverability |
| 2026-03-28 | Singleton toaster (`src/toaster.ts`) | Prevents per-component DOM node leaks with Blueprint `OverlayToaster` |
| 2026-03-28 | Portaled dialogs get explicit `Classes.DARK` | Blueprint portals render outside app dark-mode wrapper |
| 2026-03-28 | Unified ActionDialog (selection + form in one dialog) | Reduces component count, avoids nested popover/dialog issues |
| 2026-03-28 | LoginPage renders outside Shell (no TopNavbar/Sidebar) | Login is a standalone pre-auth view; authenticated chrome shouldn't show |
| 2026-03-28 | Mock auth in LoginPage (800ms delay, no real backend) | Placeholder until kampanya-360 auth endpoints are wired |
| 2026-03-29 | `isAuthenticated` + `setAuthenticated` added to AppContext | Centralized auth state so any component can check/set auth |
| 2026-03-29 | AuthGate wraps `/*` route; renders LoginPage or Shell | Unauthenticated users always see login, no Shell chrome leaks |
| 2026-03-29 | Dummy credentials `riemann` / `Zulu1234` for dev login | Hardcoded placeholder until kampanya-360 `/api/auth/login` is integrated |
| 2026-04-01 | Kanban Board is first `src/features/` module | Validates the feature-based directory structure; all Kanban code co-located |
| 2026-04-01 | Board → Campaign is optional (not required) | Boards can exist independently; Campaign link is a reference only |
| 2026-04-01 | Board → Objective is optional reference | Objectives can be referenced from a board but not structurally required |
| 2026-04-01 | Board key is user-provided, not auto-generated | Simpler initial implementation; can add auto-generation later |
| 2026-04-01 | `@hello-pangea/dnd` for drag-and-drop | Maintained fork of react-beautiful-dnd; simplest API for kanban list-to-list transfers |
| 2026-04-01 | `react-markdown` + `remark-gfm` for Markdown rendering | Task descriptions and comments support rich text formatting |
| 2026-04-01 | Column deletion blocked when tasks exist | User must move tasks to another column before deleting — prevents data loss |
| 2026-04-01 | TaskComment.edit_history stored as JSONB array | Tracks comment edit history without extra tables; `[{content, edited_at}]` |
| 2026-04-01 | Milestone progress computed server-side | `GET /boards/:id` returns `progress_percent` per task as `(completed/total) × 100` |
| 2026-04-01 | KanbanContext provides board-scoped state | Avoids prop drilling; all Kanban components access board data via context |
| 2026-04-01 | Demo page uses static data at `/boards` route | Fulfills spec requirement for demo page; will swap for API calls when wiring |
