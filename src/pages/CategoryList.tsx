// src/pages/CategoryList.tsx
import { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Music2,
  BookOpenText,
  PenLine,
  Palette,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

type ContentCategory = "literatura" | "poezie" | "muzica" | "arte";

interface ContentItem {
  id: string;
  totem_id: string | null;
  category: ContentCategory;
  title: string;
  artist: string | null;
  snippet: string | null;
  totem_name?: string | null;
  views: number; // 👈 nou
}

const CATEGORY_LABELS: Record<ContentCategory, string> = {
  literatura: "Literatură",
  poezie: "Poezie",
  muzica: "Muzică",
  arte: "Arte vizuale",
};

const CATEGORY_ICONS: Record<ContentCategory, JSX.Element> = {
  literatura: <BookOpenText className="w-4 h-4" />,
  poezie: <PenLine className="w-4 h-4" />,
  muzica: <Music2 className="w-4 h-4" />,
  arte: <Palette className="w-4 h-4" />,
};

const CategoryList = () => {
  const { categoryId } = useParams<{ categoryId: ContentCategory }>();
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const isValidCategory =
    categoryId === "literatura" ||
    categoryId === "poezie" ||
    categoryId === "muzica" ||
    categoryId === "arte";

  useEffect(() => {
    if (!isValidCategory || !categoryId) return;

    const loadData = async () => {
      setLoading(true);

      // luăm conținutul + numele totemului asociat + views
      const { data, error } = await supabase
        .from("contents")
        .select(
          "id, totem_id, category, title, artist, snippet, views, totems ( name )"
        )
        .eq("category", categoryId)
        .order("views", { ascending: false }) // top materiale
        .order("created_at", { ascending: true });

      if (error) {
        console.error(
          "Eroare la încărcarea conținutului pe categorie:",
          error
        );
        setLoading(false);
        return;
      }

      const mapped =
        (data || []).map((row: any) => ({
          id: row.id,
          totem_id: row.totem_id,
          category: row.category as ContentCategory,
          title: row.title,
          artist: row.artist,
          snippet: row.snippet,
          totem_name: row.totems?.name ?? null,
          views: row.views ?? 0,
        })) as ContentItem[];

      setItems(mapped);
      setLoading(false);
    };

    loadData();
  }, [categoryId, isValidCategory]);

  if (!categoryId || !isValidCategory) {
    return (
      <div className="min-h-screen text-foreground flex items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Categoria nu este validă.
        </p>
      </div>
    );
  }

  const label = CATEGORY_LABELS[categoryId];
  const icon = CATEGORY_ICONS[categoryId];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container max-w-3xl mx-auto px-4 py-8 space-y-8">
        {/* back link */}
        <NavLink
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Înapoi la pagina principală
        </NavLink>

        {/* header categorie */}
        <section className="rounded-2xl bg-gradient-to-br from-accent/40 to-secondary/60 p-6 space-y-3">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-background/80 p-2 flex items-center justify-center">
              {icon}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold leading-tight">
                {label}
              </h1>
              <p className="text-sm text-foreground/70">
                Toate materialele din această categorie, din totemurile din
                Timișoara.
              </p>
            </div>
          </div>
        </section>

        {/* lista de materiale */}
        <section className="space-y-4">
          {loading ? (
            <p className="text-sm text-muted-foreground">
              Se încarcă materialele...
            </p>
          ) : items.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nu există încă materiale în această categorie.
            </p>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="rounded-xl border border-border/60 bg-card p-4 space-y-2"
                >
                  <h3 className="text-base font-semibold text-foreground">
                    {item.title}
                  </h3>

                  {item.artist && (
                    <p className="text-xs text-muted-foreground">
                      {item.artist}
                    </p>
                  )}

                  {item.snippet && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.snippet}
                    </p>
                  )}

                  {/* stația / totemul */}
                  {item.totem_name && (
                    <NavLink
                      to={`/totem/${item.totem_id}`}
                      className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground mt-1"
                    >
                      <MapPin className="w-3 h-3" />
                      {item.totem_name}
                    </NavLink>
                  )}

                  {/* link + views */}
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <NavLink
                      to={`/content/${item.id}`}
                      className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                    >
                      Deschide materialul
                    </NavLink>

                    <span className="text-[11px] text-muted-foreground">
                      {item.views} vizualizări
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default CategoryList;
