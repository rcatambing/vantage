## Project Overview

**Vantage** is the frontend application for the Kampanya platform — a political campaign management and election operations system. It consumes the **kampanya-360** REST API to render dashboards, workbenches, and management UIs for campaigns, voters, polling, staff, intelligence, and more.

## Tech Stack

| Layer        | Technology                                              |
| ------------ | ------------------------------------------------------- |
| Framework    | React 19 with TypeScript (strict mode)                  |
| Build        | Vite 8, ESBuild                                         |
| UI Library   | **Blueprint UI** (`@blueprintjs/core`, `@blueprintjs/icons`) |
| Routing      | React Router 7                                          |
| Styling      | Blueprint CSS + project CSS (normalize.css base)        |
| Lint         | ESLint 9 + typescript-eslint + react-hooks + react-refresh |
| TypeScript   | 5.9, strict, ES2023 target, bundler module resolution   |

### Key Dependencies
* `@blueprintjs/core` — all UI controls (Button, Card, Dialog, Drawer, InputGroup, Menu, Navbar, Tabs, Tag, Tree, etc.)
* `@blueprintjs/icons` — 500+ icons via `<Icon icon="..." />` or Blueprint component `icon` props
* `react-router` — client-side routing

### CSS Import Order (in `src/main.tsx`)
1. `normalize.css`
2. `@blueprintjs/core/lib/css/blueprint.css`
3. `@blueprintjs/icons/lib/css/blueprint-icons.css`
4. `./index.css` (project overrides — loaded last so they take precedence)

## Architecture

### Backend: kampanya-360
* **Stack:** FastAPI + SQLAlchemy + PostgreSQL, Pydantic validation, Uvicorn ASGI server
* **Location:** `/home/ryanc/projects/kampanya/kampanya-360`
* **API base:** All endpoints are under `/api`, docs at `/docs`
* **Key domain modules (16 services):**
  - **Campaigns** — create/manage campaigns (ELECTION, OPERATIONS, SPECIAL_PROJECT), objectives, and tasks with status tracking
  - **Voters** — voter profiles with demographics, geographic indexing (Region → Province → City → Barangay), sentiment scores
  - **Staff** — staff profiles linked 1:1 to users, types (POLITICAL_OFFICER, VOLUNTEER, CONTRACTOR, FULL_TIME_STAFF), area assignments (PRIMARY/SECONDARY/TEMPORARY), evaluations
  - **Polling** — surveys with question types (LIKERT, BOOLEAN, MULTIPLE_CHOICE, TEXT, SEMANTIC_DIFFERENTIAL, VISUAL_ANALOG), sessions, participants, response integrity checksums
  - **Intel** — field intelligence anecdotes with multimedia attachments (images, video, PDF), file hash deduplication
  - **Feed** — social-style posts with location tagging, threaded comments (2-level), star ratings, user mentions, data classification (PUBLIC → SECRET)
  - **Districts** — hierarchical electoral districts (Province → City → Barangay), population stats, voter distribution
  - **Tasks / Objectives** — granular task management under campaign objectives, assignable to staff
  - **Users** — accounts with status lifecycle, encrypted PII (email/mobile via RSA), OTP support
  - **Devices, Audit, Notifications, Participants, Area Assignments, Health**
* **Security:** RSA-encrypted contact data, search hashes for dedup, audit trail on all CRUD ops
* **Data models:** `users` ↔ `staff_profiles`, `campaigns` → `objectives` → `tasks`, `polls` → `questions` → `sessions`, `posts` → `comments`/`ratings`/`images`, `voters` (geo-indexed), `electoral_districts` (self-referential hierarchy)

### Frontend: vantage (this project)
* Consumes kampanya-360 REST APIs to render dashboards, workbenches, and management UIs
* Key views: campaign dashboards, voter lists & demographics, poll/survey results, staff management, intelligence feeds, task boards

## Coding Rules

* Use Blueprint components exclusively for all UI controls — do **not** introduce Tailwind CSS, shadcn/ui, Material UI, or other design systems.
* Apply Blueprint's [dark theme](https://blueprintjs.com/docs/#core/classes) via the `Classes.DARK` class on a root container when dark mode is active.
* Always import Blueprint components from their top-level package entry (e.g., `import { Button, Intent } from "@blueprintjs/core"`).
* Use Blueprint's `Intent` enum (`PRIMARY`, `SUCCESS`, `WARNING`, `DANGER`, `NONE`) for semantic color feedback — do not hard-code color values.
* Use Blueprint's `Icon` component or the `icon` / `rightIcon` props on components instead of raw SVGs or third-party icon libraries.
* Prefer Blueprint's `Classes` constants (e.g., `Classes.ELEVATION_2`, `Classes.TEXT_MUTED`) over hand-written CSS class strings.
* Keep custom CSS minimal. Leverage Blueprint's built-in spacing, elevation, and typography classes first.
* TypeScript strict mode is enforced — no `any` types, no unused locals/parameters.

## Design System

Blueprint UI provides the complete design system. Reference the official docs at https://blueprintjs.com/docs/.

### Component Mapping (common patterns)

| UI Need                | Blueprint Component(s)                                   |
| ---------------------- | -------------------------------------------------------- |
| Top navigation bar     | `Navbar`, `NavbarGroup`, `NavbarHeading`, `NavbarDivider` |
| Side navigation        | `Tree` or stacked `Menu` inside a collapsible panel       |
| Page-level search      | `InputGroup` with `leftIcon="search"`, or `OmniBar`      |
| Primary actions        | `Button` with `intent={Intent.PRIMARY}`                   |
| Cards / panels         | `Card` with `elevation={Elevation.TWO}` and `interactive` |
| Data tables            | `HTMLTable` (striped, interactive, bordered)               |
| Dialogs / modals       | `Dialog` / `MultistepDialog`                              |
| Side drawers           | `Drawer` with `position="left"` or `position="right"`    |
| Dropdown menus         | `Menu`, `MenuItem`, wrapped in `Popover`                  |
| Tabs                   | `Tabs`, `Tab`                                             |
| Tags / badges          | `Tag` with `intent` and `minimal` / `round`               |
| Form inputs            | `FormGroup` + `InputGroup`, `TextArea`, `Switch`, `Checkbox`, `RadioGroup` |
| Select / autocomplete  | `Select` / `Suggest` from `@blueprintjs/select` (install when needed) |
| Date/time pickers      | `DatePicker` / `DateRangeInput` from `@blueprintjs/datetime2` (install when needed) |
| Toast notifications    | `OverlayToaster.create()`, then `toaster.show()`         |
| Loading states         | `Spinner`, `ProgressBar`, or `Skeleton`                   |
| Tooltips               | `Tooltip` wrapping any element                            |
| Breadcrumbs            | `Breadcrumbs` with `BreadcrumbProps[]`                    |
| Trees / hierarchies    | `Tree` with `TreeNodeInfo[]`                              |
| File upload            | `FileInput`                                               |
| Callouts / alerts      | `Callout` with `intent` and optional `icon`               |

### Optional Blueprint Packages (install as needed)
* `@blueprintjs/select` — Select, Suggest, MultiSelect, Omnibar
* `@blueprintjs/datetime2` — DatePicker, DateRangeInput, TimePicker
* `@blueprintjs/table` — high-performance spreadsheet-style table

## Components

**1. Global App Shell & Common Components:**
* **Top Header:** A persistent sticky `Navbar` (height ~50px) containing the app logo via `NavbarHeading`, a global `InputGroup` search bar (`leftIcon="search"`), and a user `Popover` profile dropdown on the right `NavbarGroup`.
* **Main Navigation (Side Drawer):** A collapsible left-side panel using Blueprint `Tree` or `Menu` for primary navigation (switching between Dashboards, Workbenches, etc.). On mobile, collapse into a `Drawer` triggered by a hamburger `Button` (`icon="menu"`).
* **Component Gallery (Right Drawer):** Use Blueprint `Drawer` (`position="right"`, `size="400px"`) to slide out from the right side of the screen. This allows users to browse and select components without losing sight of their active dashboard layout.

**2. Main Content Area & Fluid Grid System:**
The main workspace (for both Dashboards and Workbenches) must be fluid and dynamic, expanding to fill the viewport safely.
* Implement a CSS Grid that scales dynamically: 1 column on mobile (<768px), 4 columns on tablet (768px–1280px), and a maximum of 6 columns on large desktop screens (>1280px).
* Use a consistent gap of 16px (`gap: 16px`) or 24px.
* Components should flow naturally to the next row using CSS Grid auto-placement when a row is filled.

**3. Component Vertical Sizing (Semantic Scale):**
Component heights should generally hug their internal content, but apply standard minimum heights to maintain design rhythm:
* **Short (sm):** ~128px min-height. For compact summary cards or KPI metrics.
* **Standard (md):** ~256px min-height. For standard forms, charts, or media. Use flexbox column layout internally.
* **Tall (lg):** ~384px min-height, up to ~600px max-height. For scrollable feeds or tables. Handle internal overflow with `overflow-y: auto`.
* **Full View (fluid):** `min-height: calc(100vh - 50px)`. For main canvas areas (subtract Navbar height).

**4. Component Design & Panel Anatomy:**
Every component placed on the grid must be housed in a standardized Panel using Blueprint `Card` (`elevation={Elevation.TWO}`).
* **Panel Header:** Must display the component's Name (up to 255 chars, truncate with `Classes.TEXT_OVERFLOW_ELLIPSIS` if needed), the 7-letter alphanumeric ID as a `Tag` (`minimal`, `round`), and a top-right `Popover` action menu with `Menu`/`MenuItem` entries (e.g., "Remove", "Settings").
* **Sizes (Span Mapping):**
  a) small: 1 col on mobile, 2 on tablet, 1 on desktop — height: short
  b) medium: 1 col on mobile, 2 on tablet, 2 on desktop — height: standard
  c) large: 1 col on mobile, 4 on tablet, 4 on desktop — height: tall
  d) wide-small: 1 col on mobile, 4 on tablet, 2 on desktop — height: short
  e) wide-medium: 1 col on mobile, 4 on tablet, 4 on desktop — height: standard
  f) wide-large: 1 col on mobile, 4 on tablet, 6 on desktop — height: tall

**5. View Types:**
- **Dashboards:** Intended for monitoring. Displays static/live visualizations (tables, charts, KPIs, feeds). Contains a unique 6-char ID, a Name, and a Description. Include a "Save Layout" button that mocks an API call to a web service to store the configuration.
- **Workbenches:** Similar underlying grid infrastructure to dashboards, but visually distinct (e.g., different header styling or background hue). Intended for technical users executing predefined tasks. Also contains a unique 6-char ID, Name, and Description, with save capabilities via web service.
- **Detail & Config Screens** Screens for configuring components and showing detailed information.
- **Reporting Screens** Screens for providing summary and detailed, static and analytic reports.
- **Gallery Interaction:** The Right Drawer gallery displays image previews, names, descriptions, and codes of available components. Includes a web-service-backed search bar and filter chips (by group/type). Clicking an "Add" button on a gallery item should mock appending it to the currently active Dashboard/Workbench grid.