// src/pages/VirtualPassport.tsx
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Header from "@/components/Header";
import BadgeCard from "@/components/BadgeCard";
import { Button } from "@/components/ui/button";
import { passportStorage, Badge } from "@/lib/passportStorage";
import { QrCode, Award, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import StampBook from "@/components/StampBook"; // 👈 nou

const VirtualPassport = () => {
  const [badges, setBadges] = useState<Badge[]>([]);

  useEffect(() => {
    loadBadges();
  }, []);

  const loadBadges = () => {
    const storedBadges = passportStorage.getBadges();
    setBadges(storedBadges);
  };

  const handleClearBadges = () => {
    passportStorage.clearBadges();
    setBadges([]);
  };

  return (
    <div className="min-h-screen">
      <Header showBack title="Pașaport Virtual" />

      <main className="container max-w-2xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-8 py-8 px-6 rounded-2xl bg-gradient-to-br from-accent/40 to-secondary/60">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary/10 rounded-full">
              <Award className="w-12 h-12 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight text-foreground">
            Pașaportul Tău Cultural
          </h1>
          <p className="text-base md:text-lg text-foreground/70 max-w-lg mx-auto mb-4">
            Colectează insigne din fiecare locație culturală pe care o vizitezi
          </p>
          <div className="flex items-center justify-center gap-2 text-2xl font-bold text-primary">
            <Award className="w-6 h-6" />
            <span>{badges.length}</span>
            <span className="text-base font-normal text-foreground/70">
              {badges.length === 1
                ? "insignă colectată"
                : "insigne colectate"}
            </span>
          </div>
        </section>

        {/* Scan Button */}
        <section className="mb-8">
          <NavLink to="/scan" className="block">
            <Button className="w-full gap-2 h-14 text-lg" size="lg">
              <QrCode className="w-5 h-5" />
              Scanează cod QR
            </Button>
          </NavLink>
        </section>

        {/* 📖 Cartea cu ștampile (doar totemurile vizitate) */}
        <StampBook badges={badges} />

        {/* Badges Grid */}
        {badges.length > 0 ? (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Insignele Tale</h2>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Trash2 className="w-4 h-4" />
                    Șterge toate
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Ești sigur?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Această acțiune va șterge toate insignele colectate.
                      Această acțiune nu poate fi anulată.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Anulează</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClearBadges}>
                      Șterge toate
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <div className="grid gap-4">
              {badges.map((badge) => (
                <BadgeCard key={badge.id} badge={badge} />
              ))}
            </div>
          </section>
        ) : (
          <section className="text-center py-12">
            <div className="mb-4 opacity-50">
              <Award className="w-16 h-16 mx-auto text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Nicio insignă încă</h3>
            <p className="text-muted-foreground mb-6">
              Scanează coduri QR din stațiile culturale pentru a colecta
              insigne
            </p>
            <NavLink to="/scan">
              <Button className="gap-2">
                <QrCode className="w-4 h-4" />
                Începe să colectezi
              </Button>
            </NavLink>
          </section>
        )}

        {/* Info Section */}
        <section className="mt-12 p-6 bg-secondary/50 rounded-xl">
          <h3 className="font-semibold mb-2">Cum funcționează?</h3>
          <ul className="text-sm text-foreground/80 space-y-2">
            <li>• Vizitează stațiile de transport public din Timișoara</li>
            <li>• Scanează codurile QR de la totemurile culturale</li>
            <li>• Colectează insigne și descoperă artiști locali</li>
            <li>• Construiește-ți colecția culturală personală</li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default VirtualPassport;
