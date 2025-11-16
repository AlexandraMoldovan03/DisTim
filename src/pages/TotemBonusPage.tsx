// src/pages/TotemBonusPage.tsx
import { useEffect, useState } from "react";
import { useParams, useSearchParams, NavLink } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { supabase } from "@/lib/supabaseClient";
import Header from "@/components/Header";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

interface TotemBonusData {
  id: string;
  name: string;
  qr_slug: string | null;
  bonus_title: string | null;
  bonus_body: string | null;
}

const TotemBonusPage = () => {
  const { totemId } = useParams<{ totemId: string }>();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, isLoading, user, loginWithRedirect } = useAuth0();

  const [totem, setTotem] = useState<TotemBonusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasDbUnlock, setHasDbUnlock] = useState(false);
  const [saving, setSaving] = useState(false);

  const qrParam = searchParams.get("qr");

  useEffect(() => {
    if (!totemId) return;

    const loadData = async () => {
      setLoading(true);
      try {
        // 1. luăm info despre totem + câmpurile bonus
        const { data: tData, error: tError } = await supabase
          .from("totems")
          .select("id, name, qr_slug, bonus_title, bonus_body")
          .eq("id", totemId)
          .single();

        if (tError || !tData) {
          console.error("Eroare la încărcarea totemului bonus:", tError);
          setLoading(false);
          return;
        }

        setTotem(tData as TotemBonusData);

        // 2. dacă userul e logat, vedem dacă are deja deblocarea în DB
        if (user?.sub) {
          const { data: unlocks, error: uError } = await supabase
            .from("totem_unlocks")
            .select("id")
            .eq("auth0_sub", user.sub)
            .eq("totem_id", totemId);

          if (uError) {
            console.error("Eroare la verificarea deblocării:", uError);
          } else if (unlocks && unlocks.length > 0) {
            setHasDbUnlock(true);
          } else {
            setHasDbUnlock(false);
          }
        } else {
          setHasDbUnlock(false);
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [totemId, user?.sub]);

  // avem acces la conținut dacă:
  // - venim cu qr corect + suntem logați, SAU
  // - avem deja în DB deblocarea
  const qrMatches = !!totem?.qr_slug && qrParam === totem.qr_slug;
  const canSeeContent = (qrMatches && isAuthenticated) || hasDbUnlock;

  const handleConfirmVisit = async () => {
    if (!totemId || !user?.sub) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("totem_unlocks")
        .upsert(
          { auth0_sub: user.sub, totem_id: totemId },
          { onConflict: "auth0_sub,totem_id" }
        );

      if (error) {
        console.error("Eroare la salvarea deblocării:", error);
        return;
      }
      setHasDbUnlock(true);
    } finally {
      setSaving(false);
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container max-w-2xl mx-auto px-4 py-12">
          <p className="text-sm text-muted-foreground">
            Se încarcă bonusul pentru acest totem...
          </p>
        </main>
      </div>
    );
  }

  if (!totem) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container max-w-2xl mx-auto px-4 py-12">
          <p className="text-sm text-muted-foreground">
            Totemul nu a fost găsit.
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container max-w-2xl mx-auto px-4 py-8 space-y-6">
        <NavLink
          to={`/totem/${totem.id}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Înapoi la pagina totemului
        </NavLink>

        <section className="rounded-2xl bg-card/90 border border-border/60 p-6 shadow-lg space-y-4">
          <h1 className="text-2xl font-bold">
            Bonus: {totem.bonus_title || totem.name}
          </h1>

          {!isAuthenticated && (
            <div className="rounded-xl border border-yellow-500/50 bg-yellow-500/10 p-3 text-sm">
              <p className="mb-2">
                Pentru a accesa bonusul, trebuie să te autentifici.
              </p>
              <button
                onClick={() => loginWithRedirect()}
                className="px-3 py-1 text-xs font-medium rounded-md border bg-background hover:bg-secondary"
              >
                Autentifică-te
              </button>
            </div>
          )}

          {isAuthenticated && !canSeeContent && (
            <div className="rounded-xl border border-red-500/50 bg-red-500/10 p-3 text-sm">
              <p>
                Pentru primul acces la acest conținut bonus trebuie să scanezi
                codul QR fizic din stație.
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Dacă ai ajuns aici din greșeală, revino pe pagina principală și
                scanează codul QR.
              </p>
            </div>
          )}

          {canSeeContent && (
            <div className="space-y-4">
              <div className="rounded-xl bg-background/80 border border-border/60 p-4">
                <p className="text-sm whitespace-pre-line">
                  {totem.bonus_body ||
                    "Aici va fi textul tău secret / povestea bonus despre monument."}
                </p>
              </div>

              {!hasDbUnlock && qrMatches && isAuthenticated && (
                <div className="rounded-xl border border-border/60 bg-background/60 p-4 flex flex-col gap-3 text-sm">
                  <p className="font-medium">
                    Ai vizitat acest monument și ai citit conținutul bonus?
                  </p>
                  <button
                    disabled={saving}
                    onClick={handleConfirmVisit}
                    className="inline-flex items-center gap-2 self-start px-3 py-2 rounded-md border bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 disabled:opacity-60"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Da, marchează monumentul ca vizitat
                  </button>
                  <p className="text-[11px] text-muted-foreground">
                    După ce confirmi, vei putea reveni la acest bonus direct din
                    pagina totemului, fără cod QR.
                  </p>
                </div>
              )}

              {hasDbUnlock && (
                <p className="text-xs text-emerald-500 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Ai marcat acest monument ca vizitat. Bonusul rămâne deblocat
                  pentru acest cont.
                </p>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default TotemBonusPage;
