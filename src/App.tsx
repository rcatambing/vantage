import { Classes } from "@blueprintjs/core";
import { BrowserRouter, Routes, Route } from "react-router";
import { AppProvider } from "./context/AppContext";
import { useApp } from "./context/useApp";
import TopNavbar from "./components/TopNavbar";
import Sidebar from "./components/Sidebar";
import ComponentGallery from "./components/ComponentGallery";
import CampaignDashboard from "./screens/CampaignDashboard";
import VoterWorkbench from "./screens/VoterWorkbench";
import CampaignDetail from "./screens/CampaignDetail";
import FieldOpsReport from "./screens/FieldOpsReport";
import LoginPage from "./screens/LoginPage";
import KanbanPage from "./features/kanban/components/KanbanPage";
import TeamsPage from "./features/teams/components/TeamsPage";
import CampaignsPage from "./features/campaigns/components/CampaignsPage";
import CampaignDetailPage from "./features/campaigns/components/CampaignDetailPage";
import CommunityLeadersPage from "./features/accounts/components/CommunityLeadersPage";
import LeaderDetailPage from "./features/accounts/components/LeaderDetailPage";
import CustomerAccountsPage from "./features/accounts/components/CustomerAccountsPage";
import CustomerDetailPage from "./features/accounts/components/CustomerDetailPage";
import TicketsPage from "./features/tickets/components/TicketsPage";
import TicketDetailPage from "./features/tickets/components/TicketDetailPage";
import OfficesPage from "./features/offices/components/OfficesPage";
import OfficeDetailPage from "./features/offices/components/OfficeDetailPage";
import ResourcesPage from "./features/resources/components/ResourcesPage";
import ResourceDetailPage from "./features/resources/components/ResourceDetailPage";
import AnalyticsDemo from "./screens/AnalyticsDemo";

function AuthGate() {
  const { isAuthenticated } = useApp();

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
          <Routes>
            <Route path="/" element={<CampaignDashboard />} />
            <Route path="/workbench/voters" element={<VoterWorkbench />} />
            <Route path="/detail/campaign" element={<CampaignDetail />} />
            <Route path="/report/field-ops" element={<FieldOpsReport />} />
            <Route path="/boards" element={<KanbanPage />} />
            <Route path="/teams" element={<TeamsPage />} />
            <Route path="/campaigns" element={<CampaignsPage />} />
            <Route path="/campaigns/:id" element={<CampaignDetailPage />} />
            <Route path="/campaigns/:campaignId/leaders" element={<CommunityLeadersPage />} />
            <Route path="/campaigns/:campaignId/leaders/:id" element={<LeaderDetailPage />} />
            <Route path="/campaigns/:campaignId/accounts" element={<CustomerAccountsPage />} />
            <Route path="/campaigns/:campaignId/accounts/:id" element={<CustomerDetailPage />} />
            <Route path="/tickets" element={<TicketsPage />} />
            <Route path="/tickets/:id" element={<TicketDetailPage />} />
            <Route path="/campaigns/:campaignId/tickets" element={<TicketsPage />} />
            <Route path="/offices" element={<OfficesPage />} />
            <Route path="/offices/:id" element={<OfficeDetailPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/resources/:id" element={<ResourceDetailPage />} />
            <Route path="/analytics/demo" element={<AnalyticsDemo />} />
          </Routes>
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
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/*" element={<AuthGate />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}
