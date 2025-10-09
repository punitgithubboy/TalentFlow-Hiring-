import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { PageTransition } from "./components/PageTransition";
import Index from "./pages/Index";
import JobsBoard from "./pages/jobs/JobsBoard";
import JobDetail from "./pages/JobDetail";
import CandidatesBoard from "./pages/candidates/CandidatesBoard";
import CandidatesKanban from "./pages/candidates/CandidatesKanban";
import CandidateDetail from "./pages/CandidateDetail";
import AssessmentsList from "./pages/assessments/AssessmentsList";
import AssessmentBuilder from "./pages/assessments/AssessmentBuilder";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PageTransition><Index /></PageTransition>} />
          <Route path="/jobs" element={<Layout><PageTransition><JobsBoard /></PageTransition></Layout>} />
          <Route path="/jobs/:id" element={<Layout><PageTransition><JobDetail /></PageTransition></Layout>} />
          <Route path="/candidates" element={<Layout><PageTransition><CandidatesBoard /></PageTransition></Layout>} />
          <Route path="/candidates/kanban" element={<Layout><PageTransition><CandidatesKanban /></PageTransition></Layout>} />
          <Route path="/candidates/:id" element={<Layout><PageTransition><CandidateDetail /></PageTransition></Layout>} />
          <Route path="/assessments" element={<Layout><PageTransition><AssessmentsList /></PageTransition></Layout>} />
          <Route path="/assessments/:jobId" element={<Layout><PageTransition><AssessmentBuilder /></PageTransition></Layout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
