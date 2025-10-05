import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Index from "./pages/Index";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import Candidates from "./pages/Candidates";
import CandidateDetail from "./pages/CandidateDetail";
import CandidatesKanban from "./pages/CandidatesKanban";
import Assessments from "./pages/Assessments";
import AssessmentBuilder from "./pages/AssessmentBuilder";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/jobs" element={<Layout><Jobs /></Layout>} />
          <Route path="/jobs/:id" element={<Layout><JobDetail /></Layout>} />
          <Route path="/candidates" element={<Layout><Candidates /></Layout>} />
          <Route path="/candidates/:id" element={<Layout><CandidateDetail /></Layout>} />
          <Route path="/candidates/kanban" element={<Layout><CandidatesKanban /></Layout>} />
          <Route path="/assessments" element={<Layout><Assessments /></Layout>} />
          <Route path="/assessments/:jobId" element={<Layout><AssessmentBuilder /></Layout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
