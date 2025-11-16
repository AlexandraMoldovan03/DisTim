// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";

import Index from "./pages/Index";
import CategoryList from "./pages/CategoryList";
import ContentDetail from "./pages/ContentDetail";
import SubmitArt from "./pages/SubmitArt";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import TotemPage from "./pages/TotemPage";
import VirtualPassport from "./pages/VirtualPassport";
import QRScanner from "./pages/QRScanner";
import ScrollToTop from "./components/ScrollToTop";
import StampBar from "./components/StampBar";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthPage from "./pages/AuthPage";

import PrivateAdminRoute from "@/components/PrivateAdminRoute";
import AdminPage from "./pages/AdminPage";

const queryClient = new QueryClient();

const App = () => (
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            {/* bara cu ștampile are nevoie de AuthProvider, deci e bine aici */}
            <StampBar />

            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/category/:categoryId" element={<CategoryList />} />
              <Route path="/content/:contentId" element={<ContentDetail />} />
              <Route path="/submit" element={<SubmitArt />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<About />} />
              <Route path="/artists" element={<About />} />
              <Route path="/passport" element={<VirtualPassport />} />
              <Route path="/scan" element={<QRScanner />} />
              <Route path="/totem/:totemId" element={<TotemPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="*" element={<NotFound />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route
                  path="/admin"
                  element={
                    <PrivateAdminRoute>
                      <AdminPage />
                    </PrivateAdminRoute>
                  }
                />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </AuthProvider>
);

export default App;


///

// Inside <Routes>:


