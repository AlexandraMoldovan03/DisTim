import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { passportStorage, getRandomArtist } from "@/lib/passportStorage";
import { QrCode, Award, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

// Sample locations for the prototype
const SAMPLE_LOCATIONS = [
  { id: "loc-1", name: "Stația Operei" },
  { id: "loc-2", name: "Stația Catedralei" },
  { id: "loc-3", name: "Stația Universității" },
  { id: "loc-4", name: "Stația Pieței Victoriei" },
  { id: "loc-5", name: "Stația Parcului Central" },
  { id: "loc-6", name: "Stația Muzeului de Artă" },
  { id: "loc-7", name: "Stația Teatrului Național" },
  { id: "loc-8", name: "Stația Bastionului" },
];

const QRScanner = () => {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [scannedArtist, setScannedArtist] = useState<{
    name: string;
    bio: string;
    category: string;
    location: string;
  } | null>(null);

  const handleSimulateScan = () => {
    setScanning(true);

    // Simulate scanning delay
    setTimeout(() => {
      // Get random location
      const location = SAMPLE_LOCATIONS[Math.floor(Math.random() * SAMPLE_LOCATIONS.length)];

      // Check if badge already collected
      if (passportStorage.hasBadge(location.id)) {
        toast.info("Ai colectat deja insigna de la această locație!");
        setScanning(false);
        return;
      }

      // Get random artist
      const artist = getRandomArtist();

      // Add badge to storage
      passportStorage.addBadge({
        id: location.id,
        locationName: location.name,
        artistName: artist.name,
        artistBio: artist.bio,
        collectedAt: new Date().toISOString(),
        category: artist.category,
      });

      // Show result
      setScannedArtist({
        name: artist.name,
        bio: artist.bio,
        category: artist.category,
        location: location.name,
      });

      setScanning(false);
      toast.success("Insignă nouă colectată! 🎉");
    }, 1500);
  };

  const handleViewPassport = () => {
    navigate("/passport");
  };

  const handleScanAnother = () => {
    setScannedArtist(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header showBack title="Scanează QR" />

      <main className="container max-w-2xl mx-auto px-4 py-8">
        {!scannedArtist ? (
          <>
            {/* Scanner Section */}
            <section className="text-center mb-8 py-12 px-6 rounded-2xl bg-gradient-to-br from-accent/40 to-secondary/60">
              <div className="flex justify-center mb-6">
                <div className={`p-6 bg-primary/10 rounded-full ${scanning ? 'animate-pulse' : ''}`}>
                  <QrCode className="w-16 h-16 text-primary" />
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight text-foreground">
                {scanning ? "Se scanează..." : "Scanează Cod QR"}
              </h1>
              <p className="text-base md:text-lg text-foreground/70 max-w-lg mx-auto mb-6">
                {scanning 
                  ? "Așteptăm să detectăm codul QR..." 
                  : "Poziționează camera către codul QR de la totemul cultural"}
              </p>
            </section>

            {/* Prototype Button */}
            <section className="mb-8">
              <div className="p-6 bg-card rounded-xl border border-border space-y-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    <strong>Prototip:</strong> În versiunea finală, vei putea scana coduri QR reale cu camera.
                    Pentru demonstrație, apasă butonul de mai jos pentru a simula scanarea.
                  </p>
                  <Button 
                    onClick={handleSimulateScan} 
                    disabled={scanning}
                    className="w-full gap-2 h-14 text-lg"
                    size="lg"
                  >
                    {scanning ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Se scanează...
                      </>
                    ) : (
                      <>
                        <QrCode className="w-5 h-5" />
                        Simulează scanare QR
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </section>

            {/* Instructions */}
            <section className="p-6 bg-secondary/50 rounded-xl">
              <h3 className="font-semibold mb-3">Instrucțiuni</h3>
              <ol className="text-sm text-foreground/80 space-y-2 list-decimal list-inside">
                <li>Găsește un totem cultural într-o stație de transport public</li>
                <li>Deschide această pagină pe telefonul tău</li>
                <li>Scanează codul QR de pe totem</li>
                <li>Descoperă artistul și colectează insigna</li>
              </ol>
            </section>
          </>
        ) : (
          <>
            {/* Success Section */}
            <section className="text-center mb-8 py-12 px-6 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-600/30">
              <div className="flex justify-center mb-6">
                <div className="p-6 bg-green-500/20 rounded-full">
                  <CheckCircle2 className="w-16 h-16 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight text-foreground">
                Insignă Colectată!
              </h1>
              <p className="text-base md:text-lg text-foreground/70 max-w-lg mx-auto">
                Ai descoperit un nou artist local
              </p>
            </section>

            {/* Artist Info */}
            <section className="mb-8">
              <div className="content-card p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="px-3 py-1 rounded-full text-sm font-medium bg-primary text-primary-foreground">
                    {scannedArtist.category}
                  </div>
                  <Award className="w-6 h-6 text-primary" />
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Locație</p>
                    <p className="font-semibold text-lg">{scannedArtist.location}</p>
                  </div>

                  <div className="pt-3 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-1">Artist</p>
                    <p className="font-bold text-xl text-foreground mb-2">{scannedArtist.name}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {scannedArtist.bio}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Actions */}
            <section className="space-y-3">
              <Button 
                onClick={handleViewPassport}
                className="w-full gap-2 h-12"
                size="lg"
              >
                <Award className="w-5 h-5" />
                Vezi Pașaportul
              </Button>
              <Button 
                onClick={handleScanAnother}
                variant="outline"
                className="w-full gap-2 h-12"
                size="lg"
              >
                <QrCode className="w-5 h-5" />
                Scanează Alt Cod
              </Button>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default QRScanner;