// src/pages/TotemBonusPage.tsx
import { useEffect, useState } from "react";
import { NavLink, useParams, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import { supabase } from "@/lib/supabaseClient";
import { passportStorage, getRandomArtist } from "@/lib/passportStorage";
import { ArrowLeft, Lock, Unlock, CheckSquare } from "lucide-react";

interface TotemBonusData {
  id: string;
  name: string;
  bonus_text: string | null;   // folosește locked_text din DB
  qr_slug: string | null;
  stamp_label: string | null;
  stamp_emoji: string | null;
}

const TotemBonusPage = () => {
  const { totemId } = useParams<{ totemId: string }>();
  const [searchParams] = useSearchParams();

  const [totem, setTotem] = useState<TotemBonusData | null>(null);
  const [loading, setLoading] = useState(true);

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // 1. încărcăm info despre totem
  useEffect(() => {
    if (!totemId) return;

    const loadTotem = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("totems")
        .select("id, name, locked_text, qr_slug, stamp_label, stamp_emoji")
        .eq("id", totemId)
        .single();

      if (error || !data) {
        console.error("Eroare la încărcarea bonusului pentru totem:", error);
        setTotem(null);
        setLoading(false);
        return;
      }

      const mapped: TotemBonusData = {
        id: data.id,
        name: data.name,
        bonus_text: data.locked_text,
        qr_slug: data.qr_slug,
        stamp_label: data.stamp_label,
        stamp_emoji: data.stamp_emoji,
      };

      setTotem(mapped);

      // verificăm dacă e deja deblocat pe acest device
      const alreadyUnlocked = passportStorage.hasBadge(data.id);
      setIsUnlocked(alreadyUnlocked);

      setLoading(false);
    };

    loadTotem();
  }, [totemId]);

 const qrParam = searchParams.get("qr");
const hasValidQr = !!(qrParam && totem && qrParam === totem.id);


  // 2. handler pentru „Confirm vizita” + „Activează ștampila”
  const handleActivateStamp = () => {
    if (!totem) return;

    setErrorMessage(null);
    setSuccessMessage(null);

    // verificăm QR-ul
    if (!hasValidQr) {
      setErrorMessage(
        "Acest link nu conține un cod QR valid pentru acest totem."
      );
      return;
    }

    // verificăm checkbox-ul
    if (!checkboxChecked) {
      setErrorMessage("Te rugăm să bifezi căsuța pentru a confirma că ești la totem.");
      return;
    }

    setSaving(true);

    // salvăm ștampila în localStorage (pașaport local)
    const artist = getRandomArtist();

    try {
      passportStorage.addBadge({
        id: totem.id,
        locationName: totem.name,
        artistName: artist.name,
        artistBio: artist.bio,
        category: artist.category,
        collectedAt: new Date().toISOString(),
        // dacă ai extins tipul Badge cu emoji, îl poți trimite aici:
        stampEmoji: totem.stamp_emoji ?? null,
      } as any); // dacă încă ai tipul vechi de Badge, poți scoate stampEmoji

      setIsUnlocked(true);
      setSuccessMessage(
        "Ștampila a fost activată și salvată în pașaportul tău cultural 🎉"
      );
    } catch (e) {
      console.error("Eroare la salvarea ștampilei în localStorage:", e);
      setErrorMessage("A apărut o eroare la salvarea ștampilei.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header showBack />
        <main className="container max-w-3xl mx-auto px-4 py-10">
          <p className="text-sm text-muted-foreground">
            Se încarcă povestea bonus…
          </p>
        </main>
      </div>
    );
  }

  if (!totem) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header showBack />
        <main className="container max-w-3xl mx-auto px-4 py-10">
          <p className="text-sm text-muted-foreground">
            Totemul nu a fost găsit.
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header showBack />

      <main className="container max-w-3xl mx-auto px-4 py-10 space-y-6">
        <NavLink
          to={`/totem/${totem.id}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Înapoi la pagina totemului
        </NavLink>

        <section className="rounded-3xl bg-card/95 border border-border/70 shadow-xl p-6 md:p-8 space-y-4">
          <h1 className="text-2xl md:text-3xl font-bold leading-tight">
            Bonus: Povestea {totem.name}
          </h1>

          {/* Bloc de stare / mesaje */}
          <div className="space-y-3 mt-2">
            {!isUnlocked && (
              <div className="rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-900 flex items-start gap-2">
                <Lock className="w-4 h-4 mt-0.5" />
                <div>
                  <p className="font-medium">
                    Pentru a primi ștampila la acest totem:
                  </p>
                  <ul className="list-disc list-inside text-xs mt-1 space-y-1">
                    <li>Scanează codul QR din stație (link-ul trebuie să fie cel corect).</li>
                    <li>Bifează căsuța că ești fizic la acest totem.</li>
                    <li>Apasă pe „Activează ștampila”.</li>
                  </ul>
                </div>
              </div>
            )}

            {isUnlocked && (
              <div className="rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-900 flex items-start gap-2">
                <Unlock className="w-4 h-4 mt-0.5" />
                <div>
                  <p className="font-medium">
                    Ștampila ta pentru acest totem este activă 🎉
                  </p>
                  <p className="text-xs mt-1">
                    O poți vedea în „Pașaportul” tău cultural, iar de acum
                    poți accesa această poveste bonus direct din pagina
                    totemului.
                  </p>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-900">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-900">
                {successMessage}
              </div>
            )}
          </div>

          {/* Formularul de confirmare – doar dacă încă nu e unlocked */}
          {!isUnlocked && (
            <div className="mt-4 space-y-3">
              <label className="flex items-start gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-border"
                  checked={checkboxChecked}
                  onChange={(e) => setCheckboxChecked(e.target.checked)}
                />
                <span>
                  Confirm că sunt fizic la acest totem și am scanat codul QR din
                  stație.
                </span>
              </label>

              <button
                type="button"
                onClick={handleActivateStamp}
                disabled={saving}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <CheckSquare className="w-4 h-4" />
                {saving ? "Se salvează ștampila…" : "Activează ștampila"}
              </button>

              {!hasValidQr && (
                <p className="text-xs text-muted-foreground">
                  * Acest link nu pare să conțină codul QR corect pentru acest totem.
                  Verifică să fi scanat QR-ul din stație, nu un screenshot vechi.
                </p>
              )}
            </div>
          )}

          {/* Povestea bonus (vizibilă întotdeauna, sau doar când vrei tu) */}
          {totem.bonus_text && (
            <div className="mt-6 prose prose-sm md:prose-base max-w-none">
              <p className="whitespace-pre-line">{totem.bonus_text}</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default TotemBonusPage;
