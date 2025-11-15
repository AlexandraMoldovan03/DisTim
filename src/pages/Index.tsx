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
    <div className="min-h-screen">
      <Header onHelpClick={() => setShowHowItWorks(true)} />
      
      <main className="container max-w-2xl mx-auto px-4 py-12"> 
        {/* Hero Section */}
         <section className="text-center mb-12 py-12 px-8 rounded-2xl bg-card/90 backdrop-blur-sm border border-border/50 shadow-xl">
          <div className="flex justify-center mb-6">
            <img 
              src="/assets/logo-full.png" 
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
          <TimisoaraMapLeaflet />
        </section>

        {/* Categories Grid */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-foreground">Explorează categorii</h2>
          <div className="grid grid-cols-2 gap-6">
            {CATEGORIES.map((category) => (
              <CategoryCard key={category.id} {...category} />
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
            <NavLink to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">
              Despre proiect
            </NavLink>
            <NavLink to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">
              Contact
            </NavLink>
            <NavLink to="/artists" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">
              Artiști
            </NavLink>
          </div>
          <p className="text-xs text-muted-foreground/70">
            © 2024 DisTim - Cultura în Transit
          </p>
        </footer>
      </main>

      <HowItWorksModal open={showHowItWorks} onOpenChange={setShowHowItWorks} />
    </div>
  );
};

export default Index;
