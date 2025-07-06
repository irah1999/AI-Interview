import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import InterviewCompletedMessage from "@/components/InterviewCompletedMessage";

const queryClient = new QueryClient();

const App = () => {
  const [currentView, setCurrentView] = useState<"home" | "candidate-info" | "ai-agreement" | "device-check" | "interview" | "feedback" | "thank-you" | "completed">("home");
  const handleBackToHome = () => {
    setCurrentView("home");
  };
  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/call/:interviewType" element={<Index />} />
          <Route path="/alreadySubmit" element={<InterviewCompletedMessage onBackToHome={handleBackToHome}/>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
)};

export default App;
