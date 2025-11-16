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
import StoryPlayground from "./pages/StoryPlayground";
import GeminiStoryPage from "./pages/GeminiStoryPage";

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

              {/* pagina veche de story playground */}
              <Route path="/story" element={<StoryPlayground />} />

              {/* noul side-track cu Gemini */}
              <Route path="/gemini" element={<GeminiStoryPage />} />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </AuthProvider>
);

export default App;
