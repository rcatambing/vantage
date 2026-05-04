import { lazy, Suspense } from "react";
import { Classes } from "@blueprintjs/core";
import { BrowserRouter, Routes, Route } from "react-router";
import { AppProvider } from "./context/AppContext";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/useAuth";
import TopNavbar from "./components/TopNavbar";
import Sidebar from "./components/Sidebar";
import ComponentGallery from "./components/ComponentGallery";
import CampaignDashboard from "./screens/CampaignDashboard";
import LoginPage from "./screens/LoginPage";

/* ─── Lazy-loaded feature pages ─────────────────────────────────────────── */

const VoterWorkbench = lazy(() => import("./screens/VoterWorkbench"));
const CampaignDetail = lazy(() => import("./screens/CampaignDetail"));
const FieldOpsReport = lazy(() => import("./screens/FieldOpsReport"));
const AnalyticsDemo = lazy(() => import("./screens/AnalyticsDemo"));

const KanbanPage = lazy(() => import("./features/kanban/components/KanbanPage"));
const TeamsPage = lazy(() => import("./features/teams/components/TeamsPage"));
const TeamDetailPage = lazy(() => import("./features/teams/components/TeamDetailPage"));
const StaffRosterPage = lazy(() => import("./features/teams/components/StaffRosterPage"));
const StaffProfilePage = lazy(() => import("./features/teams/components/StaffProfilePage"));
const CampaignsPage = lazy(() => import("./features/campaigns/components/CampaignsPage"));
const CampaignDetailPage = lazy(() => import("./features/campaigns/components/CampaignDetailPage"));
const CommunityLeadersPage = lazy(() => import("./features/accounts/components/CommunityLeadersPage"));
const LeaderDetailPage = lazy(() => import("./features/accounts/components/LeaderDetailPage"));
const CustomerAccountsPage = lazy(() => import("./features/accounts/components/CustomerAccountsPage"));
const CustomerDetailPage = lazy(() => import("./features/accounts/components/CustomerDetailPage"));
const TicketsPage = lazy(() => import("./features/tickets/components/TicketsPage"));
const TicketDetailPage = lazy(() => import("./features/tickets/components/TicketDetailPage"));
const OfficesPage = lazy(() => import("./features/offices/components/OfficesPage"));
const OfficeDetailPage = lazy(() => import("./features/offices/components/OfficeDetailPage"));
const ResourcesPage = lazy(() => import("./features/resources/components/ResourcesPage"));
const ResourceDetailPage = lazy(() => import("./features/resources/components/ResourceDetailPage"));
const CampaignTasksPage = lazy(() => import("./features/tasks/components/CampaignTasksPage"));
const TaskDetailPage = lazy(() => import("./features/tasks/components/TaskDetailPage"));
const DistrictsPage = lazy(() => import("./features/districts/components/DistrictsPage"));
const DistrictDetailPage = lazy(() => import("./features/districts/components/DistrictDetailPage"));
const CalendarPage = lazy(() => import("./features/calendar/components/CalendarPage"));
const NotificationsPage = lazy(() => import("./features/notifications/components/NotificationsPage"));
const JobsPage = lazy(() => import("./features/jobs/components/JobsPage"));

/* ─── Epic 7: Voters & Polls ────────────────────────────────────────────── */

const VotersPage = lazy(() => import("./features/voters/components/VotersPage"));
const VoterDetailPage = lazy(() => import("./features/voters/components/VoterDetailPage"));
const PollsPage = lazy(() => import("./features/polls/components/PollsPage"));
const PollDetailPage = lazy(() => import("./features/polls/components/PollDetailPage"));

/* ─── Epic 8: Field Intelligence ────────────────────────────────────────── */

const FieldIntelPage = lazy(() => import("./features/field-intel/components/FieldIntelPage"));
const AnecdoteDetailPage = lazy(() => import("./features/field-intel/components/AnecdoteDetailPage"));
const CanvassPage = lazy(() => import("./features/field-intel/components/CanvassPage"));

function PageSpinner() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: 64 }}>
      <div className="bp5-spinner">
        <div className="bp5-spinner-animation" />
      </div>
    </div>
  );
}

function AuthGate() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
        <div className="bp5-spinner">
          <div className="bp5-spinner-animation" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <Shell />;
}

function Shell() {
  return (
    <div className={`vantage-app ${Classes.DARK}`}>
      <TopNavbar />
      <div className="vantage-body">
        <Sidebar />
        <main className="vantage-main">
          <Suspense fallback={<PageSpinner />}>
            <Routes>
              <Route path="/" element={<CampaignDashboard />} />
              <Route path="/workbench/voters" element={<VoterWorkbench />} />
              <Route path="/detail/campaign" element={<CampaignDetail />} />
              <Route path="/report/field-ops" element={<FieldOpsReport />} />
              <Route path="/boards" element={<KanbanPage />} />
              <Route path="/teams" element={<TeamsPage />} />
              <Route path="/teams/:teamId" element={<TeamDetailPage />} />
              <Route path="/staff" element={<StaffRosterPage />} />
              <Route path="/staff/:userId" element={<StaffProfilePage />} />
              <Route path="/campaigns" element={<CampaignsPage />} />
              <Route path="/campaigns/:id" element={<CampaignDetailPage />} />
              <Route path="/campaigns/:campaignId/leaders" element={<CommunityLeadersPage />} />
              <Route path="/campaigns/:campaignId/leaders/:id" element={<LeaderDetailPage />} />
              <Route path="/campaigns/:campaignId/accounts" element={<CustomerAccountsPage />} />
              <Route path="/campaigns/:campaignId/accounts/:id" element={<CustomerDetailPage />} />
              <Route path="/tickets" element={<TicketsPage />} />
              <Route path="/tickets/:id" element={<TicketDetailPage />} />
              <Route path="/campaigns/:campaignId/tickets" element={<TicketsPage />} />
              <Route path="/campaigns/:campaignId/tasks" element={<CampaignTasksPage />} />
              <Route path="/tasks/:id" element={<TaskDetailPage />} />
              <Route path="/offices" element={<OfficesPage />} />
              <Route path="/offices/:id" element={<OfficeDetailPage />} />
              <Route path="/resources" element={<ResourcesPage />} />
              <Route path="/resources/:id" element={<ResourceDetailPage />} />
              <Route path="/districts" element={<DistrictsPage />} />
              <Route path="/districts/:id" element={<DistrictDetailPage />} />
              <Route path="/campaigns/:campaignId/calendar" element={<CalendarPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/admin/jobs" element={<JobsPage />} />
              <Route path="/admin/jobs/system" element={<JobsPage category="SYSTEM" />} />
              <Route path="/admin/jobs/metrics" element={<JobsPage category="METRICS" />} />
              <Route path="/analytics/demo" element={<AnalyticsDemo />} />

              {/* Epic 7: Voters & Polls */}
              <Route path="/campaigns/:campaignId/voters" element={<VotersPage />} />
              <Route path="/voters/:id" element={<VoterDetailPage />} />
              <Route path="/campaigns/:campaignId/polls" element={<PollsPage />} />
              <Route path="/polls/:id" element={<PollDetailPage />} />

              {/* Epic 8: Field Intelligence */}
              <Route path="/campaigns/:campaignId/field-intel" element={<FieldIntelPage />} />
              <Route path="/field-intel/:id" element={<AnecdoteDetailPage />} />
              <Route path="/campaigns/:campaignId/field-intel/canvass" element={<CanvassPage />} />
            </Routes>
          </Suspense>
        </main>
      </div>
      <ComponentGallery />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/*" element={<AuthGate />} />
          </Routes>
        </AuthProvider>
      </AppProvider>
    </BrowserRouter>
  );
}
