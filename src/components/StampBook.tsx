// src/components/StampBook.tsx

// Nu mai importăm Badge direct ca să nu ne certăm pe tipuri
// import type { Badge } from "@/lib/passportStorage";

type StampBookBadge = {
  id: string;
  totem_id?: string | null;
  stamp_label?: string | null;
  stamp_emoji?: string | null;
  unlocked_at?: string | Date | null;
};

interface StampBookProps {
  badges: StampBookBadge[];
}

// dacă imaginile sunt în public/stamps/piata-unirii.png etc.
const getStampImage = (totemId: string) => `/${totemId}.png`;

const StampBook = ({ badges }: StampBookProps) => {
  // dacă nu ai niciun totem vizitat, nu arătăm cartea deloc
  if (!badges || badges.length === 0) return null;

  return (
    <section className="mb-10 rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Cartea cu ștampile
      </h2>
      <p className="text-sm text-muted-foreground text-center mb-6">
        Aici apar doar ștampilele pentru totemurile pe care le-ai vizitat.
      </p>

      {/* „Cartea” – două coloane ca două pagini */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {badges.map((badge) => {
          // folosim totem_id dacă există, altfel id-ul ca fallback
          const imageId = (badge.totem_id || badge.id).toString();
          const label = badge.stamp_label || imageId;

          return (
            <div
              key={badge.id}
              className="flex flex-col items-center gap-2 rounded-xl bg-background/80 border border-border/60 px-4 py-3"
            >
              <div className="w-16 h-16 rounded-full overflow-hidden border border-border/60 bg-muted flex items-center justify-center">
                <img
                  src={getStampImage(imageId)}
                  alt={label}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // dacă nu găsește poza, măcar ascundem img
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                {badge.stamp_emoji && (
                  <span className="text-3xl">{badge.stamp_emoji}</span>
                )}
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold">{label}</p>
                {badge.unlocked_at && (
                  <p className="text-[11px] text-muted-foreground">
                    Vizitat la{" "}
                    {new Date(badge.unlocked_at).toLocaleDateString("ro-RO", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default StampBook;
