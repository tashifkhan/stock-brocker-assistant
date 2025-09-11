import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import FinancialData from "./pages/FinancialData";
import Editorial from "./pages/Editorial";
import BrokerReports from "./pages/BrokerReports";
import MarketSummary from "./pages/MarketSummary";
import FilingsAlerts from "./pages/FilingsAlerts";
import AdminDashboard from "./pages/AdminDashboard";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/financial-data" element={<FinancialData />} />
            <Route path="/editorial" element={<Editorial />} />
            <Route path="/broker-reports" element={<BrokerReports />} />
            <Route path="/market-summary" element={<MarketSummary />} />
            <Route path="/filings-alerts" element={<FilingsAlerts />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/settings" element={<Settings />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
