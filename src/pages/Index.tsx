import { useState, useEffect } from "react";
import Header from "@/components/Header";
import CategoryCard from "@/components/CategoryCard";
import HowItWorksModal from "@/components/HowItWorksModal";
import TimisoaraMapLeaflet from "@/components/TimisoaraMapLeaflet";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { NavLink } from "react-router-dom";

const CATEGORIES = [
  { id: "literatura", name: "Literatură", icon: "📖", count: 12, colorClass: "border-literatura" },
  { id: "poezie", name: "Poezie", icon: "✍️", count: 18, colorClass: "border-poezie" },
  { id: "muzica", name: "Muzică", icon: "🎵", count: 8, colorClass: "border-muzica" },
  { id: "arte", name: "Arte Vizuale", icon: "🎨", count: 15, colorClass: "border-arte" },
];

const Index = () => {
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  useEffect(() => {
    // Show modal for first-time visitors
    const hasVisited = localStorage.getItem("hasVisited");
    if (!hasVisited) {
      setShowHowItWorks(true);
      localStorage.setItem("hasVisited", "true");
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header onHelpClick={() => setShowHowItWorks(true)} />
      
      <main className="container max-w-2xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-8 py-8 px-6 rounded-2xl bg-gradient-to-br from-accent/40 to-secondary/60">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight text-foreground">
            Descoperă cultura Timișoarei în tranzit
          </h1>
          <p className="text-base md:text-lg text-foreground/70 max-w-lg mx-auto">
            Opere literare, poezii, muzică și artă - direct în stația ta
          </p>
        </section>

        {/* Interactive Map Section */}
        <section className="mb-12">
          <TimisoaraMapLeaflet />
        </section>

        {/* Categories Grid */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Explorează categorii</h2>
          <div className="grid grid-cols-2 gap-4">
            {CATEGORIES.map((category) => (
              <CategoryCard key={category.id} {...category} />
            ))}
          </div>
        </section>

        {/* Artist CTA */}
        <section className="bg-secondary rounded-xl p-6 text-center">
          <p className="text-base mb-4 font-medium">
            Ești artist? Contribuie cu opera ta
          </p>
          <NavLink to="/submit">
            <Button className="gap-2">
              Contribuie
              <ArrowRight className="w-4 h-4" />
            </Button>
          </NavLink>
        </section>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <div className="flex justify-center gap-6">
            <NavLink to="/about" className="hover:text-foreground transition-colors">
              Despre proiect
            </NavLink>
            <NavLink to="/contact" className="hover:text-foreground transition-colors">
              Contact
            </NavLink>
            <NavLink to="/artists" className="hover:text-foreground transition-colors">
              Artiști
            </NavLink>
          </div>
        </footer>
      </main>

      <HowItWorksModal open={showHowItWorks} onOpenChange={setShowHowItWorks} />
    </div>
  );
};

export default Index;
