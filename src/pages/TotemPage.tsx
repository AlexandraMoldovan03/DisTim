// src/pages/TotemPage.tsx
import { useEffect, useMemo, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import { MapPin, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

type ContentCategory = "literatura" | "poezie" | "muzica" | "arte";

interface TotemMeta {
  id: string;
  name: string;
  description: string | null;
  latitude: number;
  longitude: number;
}

interface ContentItem {
  id: string;
  category: ContentCategory;
  title: string;
  artist: string | null;
  snippet: string | null;
}

const CATEGORY_LABELS: Record<ContentCategory, string> = {
  literatura: "Literatură",
  poezie: "Poezie",
  muzica: "Muzică",
  arte: "Arte vizuale",
};

const TotemPage = () => {
  const { totemId } = useParams<{ totemId: string }>();
  const [totem, setTotem] = useState<TotemMeta | null>(null);
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!totemId) return;

    const loadData = async () => {
      setLoading(true);

      const [{ data: totemData, error: totemError }, { data: contentData, error: contentError }] =
        await Promise.all([
          supabase
            .from("totems")
            .select("id, name, description, latitude, longitude")
            .eq("id", totemId)
            .maybeSingle(),
          supabase
            .from("contents")
            .select("id, category, title, artist, snippet")
            .eq("totem_id", totemId)
            .order("created_at", { ascending: true }),
        ]);

      if (totemError) {
        console.error("Eroare la totem:", totemError);
      } else {
        setTotem(totemData as TotemMeta | null);
      }

      if (contentError) {
        console.error("Eroare la contents:", contentError);
      } else {
        setContents((contentData || []) as ContentItem[]);
      }

      setLoading(false);
    };

    loadData();
  }, [totemId]);

  const contentByCategory = useMemo(() => {
    const grouped: Record<ContentCategory, ContentItem[]> = {
      literatura: [],
      poezie: [],
      muzica: [],
      arte: [],
    };

    contents.forEach((item) => {
      grouped[item.category].push(item);
    });

    return grouped;
  }, [contents]);

  if (!totemId) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Totemul nu a fost găsit.
        </p>
      </div>
    );
  }

  if (loading && !totem) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Se încarcă stația culturală...
        </p>
      </div>
    );
  }

  if (!totem) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Nu am găsit acest totem în baza de date.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container max-w-3xl mx-auto px-4 py-8 space-y-8">
        {/* back link */}
        <NavLink
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Înapoi la hartă
        </NavLink>

        {/* hero totem */}
        <section className="rounded-2xl bg-gradient-to-br from-accent/40 to-secondary/60 p-6 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-background/80 p-2">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{totem.name}</h1>
              <p className="text-sm text-foreground/70">
                Stație culturală – Cultura în Transit
              </p>
            </div>
          </div>
          <p className="text-sm md:text-base text-foreground/80">
            {totem.description}
          </p>
          <p className="text-xs text-foreground/60">
            Coordonate aproximative: {totem.latitude.toFixed(5)}°,{" "}
            {totem.longitude.toFixed(5)}°
          </p>
        </section>

        {/* conținut per categorie */}
        <section className="space-y-6">
          <h2 className="text-lg font-semibold">
            Materiale artistice pentru acest totem
          </h2>

          {contents.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Încă nu au fost asociate materiale acestui totem.
            </p>
          )}

          {(["literatura", "poezie", "muzica", "arte"] as ContentCategory[]).map(
            (cat) =>
              contentByCategory[cat].length > 0 && (
                <div key={cat} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold">
                      {CATEGORY_LABELS[cat]}
                    </h3>
                    <NavLink
                      to={`/category/${cat}`}
                      className="text-xs text-primary hover:underline"
                    >
                      Vezi mai multe în {CATEGORY_LABELS[cat]}
                    </NavLink>
                  </div>

                  <div className="space-y-2">
                   {contentByCategory[cat].map((item) => (
  <article
    key={item.id}
    className="rounded-xl border border-border/60 bg-card/70 px-4 py-3 hover:border-primary/60 transition-colors"
  >
    <h4 className="text-sm font-semibold">{item.title}</h4>
    {item.artist && (
      <p className="text-xs text-muted-foreground">
        de {item.artist}
      </p>
    )}
    {item.snippet && (
      <p className="text-xs mt-1 text-foreground/80">
        {item.snippet}
      </p>
    )}

    <NavLink
      to={`/content/${item.id}`}
      className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-primary hover:underline"
    >
      Deschide materialul
    </NavLink>
  </article>
))}

                  </div>
                </div>
              )
          )}
        </section>
      </main>
    </div>
  );
};

export default TotemPage;
