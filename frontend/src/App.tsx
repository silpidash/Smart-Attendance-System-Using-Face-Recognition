
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import AppLayout from "./components/layouts/AppLayout";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <AppLayout>{children}</AppLayout>;
};

// Public only route - redirects to dashboard if already authenticated
const PublicOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }
  
  return <>{children}</>;
};

// Wrapped App with auth provider
const AppWithAuth = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
          
          {/* Future routes will go here, all protected */}
          <Route path="/attendance" element={<ProtectedRoute><div className="p-4">Attendance Records Page (Coming Soon)</div></ProtectedRoute>} />
          <Route path="/my-attendance" element={<ProtectedRoute><div className="p-4">My Attendance History Page (Coming Soon)</div></ProtectedRoute>} />
          <Route path="/my-timetable" element={<ProtectedRoute><div className="p-4">My Timetable Page (Coming Soon)</div></ProtectedRoute>} />
          <Route path="/my-schedule" element={<ProtectedRoute><div className="p-4">My Schedule Page (Coming Soon)</div></ProtectedRoute>} />
          <Route path="/calendar" element={<ProtectedRoute><div className="p-4">Academic Calendar Page (Coming Soon)</div></ProtectedRoute>} />
          <Route path="/timetables" element={<ProtectedRoute><div className="p-4">Timetables Management Page (Coming Soon)</div></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><div className="p-4">Settings Page (Coming Soon)</div></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><div className="p-4">Profile Page (Coming Soon)</div></ProtectedRoute>} />
          
          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

const App = () => (
  <BrowserRouter>
    <AppWithAuth />
  </BrowserRouter>
);

export default App;
