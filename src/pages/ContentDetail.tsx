// src/pages/ContentDetail.tsx
import { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Music2,
  BookOpenText,
  PenLine,
  Palette,
  Eye,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

type ContentCategory = "literatura" | "poezie" | "muzica" | "arte";

interface ContentDetailData {
  id: string;
  title: string;
  category: ContentCategory;
  artist: string | null;
  snippet: string | null;
  full_text: string | null;
  media_url: string | null;
  views: number;
  totem_id: string | null;
  totem_name?: string | null;
}

const CATEGORY_ICONS: Record<ContentCategory, JSX.Element> = {
  literatura: <BookOpenText className="w-4 h-4" />,
  poezie: <PenLine className="w-4 h-4" />,
  muzica: <Music2 className="w-4 h-4" />,
  arte: <Palette className="w-4 h-4" />,
};

const CATEGORY_LABELS: Record<ContentCategory, string> = {
  literatura: "Literatură",
  poezie: "Poezie",
  muzica: "Muzică",
  arte: "Arte vizuale",
};

const ContentDetail = () => {
  const { contentId } = useParams<{ contentId: string }>();
  const [content, setContent] = useState<ContentDetailData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!contentId) return;

    const loadAndIncrement = async () => {
      console.log("🔎 ContentDetail – contentId din URL:", contentId);

      // 1. luăm conținutul + numele totemului asociat
      const { data, error } = await supabase
        .from("contents")
        .select(
          "id, title, category, artist, snippet, full_text, media_url, views, totem_id, totems ( name )"
        )
        .eq("id", contentId)
        .single(); // vrem fix un rând

      console.log("📦 Supabase data:", data);
      console.log("⚠️ Supabase error:", error);

      if (error || !data) {
        console.error("Eroare la încărcarea conținutului:", error);
        setLoading(false);
        return;
      }

      const row: any = data;

      const mapped: ContentDetailData = {
        id: row.id,
        title: row.title,
        category: row.category as ContentCategory,
        artist: row.artist,
        snippet: row.snippet,
        full_text: row.full_text,
        media_url: row.media_url,
        views: row.views ?? 0,
        totem_id: row.totem_id,
        totem_name: row.totems?.name ?? null,
      };

      setContent(mapped);
      setLoading(false);

      // 2. incrementăm views (fire & forget)
      const newViews = (mapped.views ?? 0) + 1;
      void supabase
        .from("contents")
        .update({ views: newViews })
        .eq("id", contentId);
    };

    loadAndIncrement();
  }, [contentId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Se încarcă materialul...
        </p>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Materialul nu a fost găsit.
        </p>
      </div>
    );
  }

  const icon = CATEGORY_ICONS[content.category];
  const categoryLabel = CATEGORY_LABELS[content.category];

  const isImage =
    content.media_url && /\.(png|jpe?g|webp|gif)$/i.test(content.media_url);

  const isAudio =
    content.media_url && /\.(mp3|wav|ogg)$/i.test(content.media_url);

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

        {/* header card */}
        <section className="rounded-2xl bg-gradient-to-br from-accent/40 to-secondary/60 p-6 space-y-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-background/80 p-2 flex items-center justify-center">
                {icon}
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold leading-tight">
                  {content.title}
                </h1>
                <p className="text-sm text-foreground/80">
                  {categoryLabel}
                  {content.artist ? ` · ${content.artist}` : ""}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1">
              <div className="inline-flex items-center gap-1 text-xs text-foreground/80">
                <Eye className="w-3 h-3" />
                <span>{content.views + 1} vizualizări</span>
              </div>

              {content.totem_name && content.totem_id && (
                <NavLink
                  to={`/totem/${content.totem_id}`}
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  <MapPin className="w-3 h-3" />
                  {content.totem_name}
                </NavLink>
              )}
            </div>
          </div>

          {content.snippet && (
            <p className="text-sm md:text-base text-foreground/90 mt-2">
              {content.snippet}
            </p>
          )}
        </section>

        {/* content body */}
        <section className="rounded-2xl border border-border/60 bg-card p-6 space-y-4">
          {content.full_text && (
            <div className="prose prose-sm md:prose-base max-w-none text-foreground">
              {content.full_text.split("\n").map((para, idx) => (
                <p key={idx} className="mb-2">
                  {para}
                </p>
              ))}
            </div>
          )}

          {content.media_url && (
            <div className="mt-4 space-y-2">
              {isImage && (
                <img
                  src={content.media_url}
                  alt={content.title}
                  className="w-full rounded-xl border border-border/60"
                />
              )}

              {isAudio && (
                <audio
                  controls
                  src={content.media_url}
                  className="w-full mt-2"
                />
              )}

              {!isImage && !isAudio && (
                <a
                  href={content.media_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  Deschide media externă
                </a>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default ContentDetail;
