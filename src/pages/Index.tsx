import { useState, useEffect } from "react";
import Header from "@/components/Header";
import CategoryCard from "@/components/CategoryCard";
import HowItWorksModal from "@/components/HowItWorksModal";
import TimisoaraMapLeaflet from "@/components/TimisoaraMapLeaflet";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { NavLink } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
  colorClass: string;
}

const CATEGORIES_TEMPLATE = [
  { id: "literatura", name: "Literatură", icon: "📖", colorClass: "border-literatura" },
  { id: "poezie", name: "Poezie", icon: "✍️", colorClass: "border-poezie" },
  { id: "muzica", name: "Muzică", icon: "🎵", colorClass: "border-muzica" },
  { id: "arte", name: "Arte Vizuale", icon: "🎨", colorClass: "border-arte" },
];

const Index = () => {
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [categories, setCategories] = useState<Category[]>(
    CATEGORIES_TEMPLATE.map((cat) => ({ ...cat, count: 0 }))
  );
  const [isLoadingCounts, setIsLoadingCounts] = useState(true);

  // Load category counts from Supabase
  useEffect(() => {
    const loadCategoryCounts = async () => {
      setIsLoadingCounts(true);

      try {
        // Fetch all contents with their categories
        const { data, error } = await supabase
          .from("contents")
          .select("category");

        if (error) {
          console.error("Error loading category counts:", error);
          console.error("Error details:", error.message);
          return;
        }

        console.log("Fetched contents:", data); // Debug log

        // Count contents per category
        const counts: Record<string, number> = {
          literatura: 0,
          poezie: 0,
          muzica: 0,
          arte: 0,
        };

        data?.forEach((content) => {
          const category = content.category?.toLowerCase().trim();
          console.log("Processing category:", category); // Debug log

          // Handle different possible category values
          if (category === "literatura" || category === "literatură") {
            counts.literatura++;
          } else if (category === "poezie") {
            counts.poezie++;
          } else if (category === "muzica" || category === "muzică") {
            counts.muzica++;
          } else if (
            category === "arte" ||
            category === "arte vizuale" ||
            category === "arte-vizuale"
          ) {
            counts.arte++;
          }
        });

        console.log("Final counts:", counts); // Debug log

        // Update categories with real counts
        const updatedCategories = CATEGORIES_TEMPLATE.map((cat) => ({
          ...cat,
          count: counts[cat.id] || 0,
        }));

        setCategories(updatedCategories);
      } catch (err) {
        console.error("Unexpected error loading counts:", err);
      } finally {
        setIsLoadingCounts(false);
      }
    };

    loadCategoryCounts();
  }, []);

  useEffect(() => {
    // Show modal for first-time visitors
    const hasVisited = localStorage.getItem("hasVisited");
    if (!hasVisited) {
      setShowHowItWorks(true);
      localStorage.setItem("hasVisited", "true");
    }
  }, []);

  return (
    <div className="min-h-screen">
      <Header onHelpClick={() => setShowHowItWorks(true)} />

      <main className="container max-w-2xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-12 py-12 px-8 rounded-2xl bg-card/90 backdrop-blur-sm border border-border/50 shadow-xl">
          <div className="flex justify-center mb-6">
            <img
              src="/logo-full.png"
              alt="DisTim Logo"
              className="h-20 w-auto object-contain"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight text-foreground">
            Descoperă cultura Timișoarei în tranzit
          </h1>
          <p className="text-lg md:text-xl text-foreground/70 max-w-lg mx-auto leading-relaxed">
            Opere literare, poezii, muzică și artă - direct în stația ta
          </p>
        </section>

        {/* Interactive Map Section */}
        <section className="mb-16">
          <div className="bg-card/90 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-lg">
            <div className="mb-6" />
            <TimisoaraMapLeaflet />
          </div>
        </section>

        {/* ✨ AI Storyline CTA – Google Gemini */}
        <section className="mb-16 bg-card/90 backdrop-blur-sm border border-border/50 rounded-2xl p-8 text-center shadow-lg">
          <h2 className="text-2xl font-bold mb-3 text-foreground">
            Lasă-l pe AI să-ți spună povestea
          </h2>
          <p className="text-base mb-6 text-foreground/70">
            Folosim Google Gemini ca să generăm, pe loc, o poveste personalizată
            despre traseul tău prin Timișoara – inspirată de locurile pe care le-ai descoperit.
          </p>
          <NavLink to="/story">
            <Button className="gap-2 h-12 px-8 text-base" size="lg">
              Vezi povestea generată de AI
              <ArrowRight className="w-4 h-4" />
            </Button>
          </NavLink>
        </section>

        {/* Categories Grid */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-foreground">
            Explorează categorii
          </h2>
          <div className="grid grid-cols-2 gap-6">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                {...category}
                isLoading={isLoadingCounts}
              />
            ))}
          </div>
        </section>

        {/* Artist CTA */}
        <section className="bg-card/90 backdrop-blur-sm border border-border/50 rounded-2xl p-8 text-center shadow-lg">
          <h3 className="text-2xl font-bold mb-3 text-foreground">
            Ești artist?
          </h3>
          <p className="text-base mb-6 text-foreground/70">
            Contribuie cu opera ta și fă parte din comunitatea culturală a Timișoarei
          </p>
          <NavLink to="/submit">
            <Button className="gap-2 h-12 px-8 text-base" size="lg">
              Contribuie
              <ArrowRight className="w-4 h-4" />
            </Button>
          </NavLink>
        </section>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-border/50 text-center">
          <div className="flex justify-center gap-8 mb-4">
            <NavLink
              to="/about"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              Despre proiect
            </NavLink>
            <NavLink
              to="/contact"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              Contact
            </NavLink>
            <NavLink
              to="/artists"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              Artiști
            </NavLink>
          </div>
          <p className="text-xs text-muted-foreground/70">
            © 2025 DisTim - Discover Timișoara
          </p>
        </footer>
      </main>

      <HowItWorksModal open={showHowItWorks} onOpenChange={setShowHowItWorks} />
    </div>
  );
};

export default Index;
