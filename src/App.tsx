import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/auth/AuthPage";
import { AssessmentPage } from "./pages/assessment/AssessmentPage";
import { AssessmentResults } from "./components/assessment/AssessmentResults";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Auth page is public */}
          <Route path="/auth" element={<AuthPage />} />
          
          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assessment"
            element={
              <ProtectedRoute>
                <AssessmentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assessment/results"
            element={
              <ProtectedRoute>
                <AssessmentResults 
                  totalScore={0}
                  pillarScores={{
                    selfAwareness: 0,
                    selfRegulation: 0,
                    motivation: 0,
                    empathy: 0,
                    socialSkills: 0
                  }}
                  onContinue={() => {
                    window.location.href = "/";
                  }}
                />
              </ProtectedRoute>
            }
          />
          
          {/* Redirect all other routes to home */}
          <Route
            path="*"
            element={
              <Navigate to="/" replace />
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;