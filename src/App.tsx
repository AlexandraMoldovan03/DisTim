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
import AuthPage from "./pages/AuthPage";
import TotemBonusPage from "@/pages/TotemBonusPage";
// dacă vrei și povestea AI, decomentezi astea:
// import TimisoaraStory from "@/components/TimisoaraStory";

const queryClient = new QueryClient();

// dacă vrei ruta /story:
// const StoryRoutePage = () => (
//   <div className="min-h-[calc(100vh-56px)] w-full px-4 py-6 bg-slate-950 text-white">
//     <TimisoaraStory />
//   </div>
// );

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          {/* bara cu ștampile – ok aici */}
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
            <Route path="/totem/:totemId/bonus" element={<TotemBonusPage />} />

            {/* callback-ul de la Auth0 */}
            <Route path="/auth" element={<AuthPage />} />

            {/* dacă vrei și povestea AI */}
            {/* <Route path="/story" element={<StoryRoutePage />} /> */}

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
