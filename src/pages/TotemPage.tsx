// src/pages/TotemPage.tsx
import { useEffect, useState } from "react";
import { NavLink, useParams, useSearchParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import {
  ArrowLeft,
  MapPin,
  Music2,
  BookOpenText,
  PenLine,
  Palette,
  Eye,
  Lock,
  Unlock,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import "../leafletIconsFix";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import { saveStampToStorage, Stamp } from "@/components/StampBar";

type ContentCategory = "literatura" | "poezie" | "muzica" | "arte";

interface TotemData {
  id: string;
  name: string;
  description: string | null;
  teaser_text: string | null;
  locked_text: string | null;
  qr_slug: string | null;
  stamp_label: string | null;
  stamp_emoji: string | null;
  latitude: number | null;
  longitude: number | null;
}

interface ContentItem {
  id: string;
  title: string;
  category: ContentCategory;
  artist: string | null;
  snippet: string | null;
  views: number;
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

const CATEGORIES_ORDER: ContentCategory[] = [
  "literatura",
  "poezie",
  "muzica",
  "arte",
];

function RecenterMap({ center }: { center: LatLngExpression }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 15, { animate: true });
  }, [center, map]);
  return null;
}

const TotemPage = () => {
  const { totemId } = useParams<{ totemId: string }>();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuth0();

  const [totem, setTotem] = useState<TotemData | null>(null);
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [unlocked, setUnlocked] = useState(false);
  const [hasBonusUnlock, setHasBonusUnlock] = useState(false);

  useEffect(() => {
    if (!totemId) return;

    const loadData = async () => {
      setLoading(true);

      // 1. totemul cu câmpurile noi
      const { data: tData, error: tError } = await supabase
        .from("totems")
        .select(
          "id, name, description, teaser_text, locked_text, qr_slug, stamp_label, stamp_emoji, latitude, longitude"
        )
        .eq("id", totemId)
        .single();

      if (tError || !tData) {
        console.error("Eroare la încărcarea totemului:", tError);
        setLoading(false);
        return;
      }

      const mappedTotem: TotemData = {
        id: tData.id,
        name: tData.name,
        description: tData.description,
        teaser_text: tData.teaser_text,
        locked_text: tData.locked_text,
        qr_slug: tData.qr_slug,
        stamp_label: tData.stamp_label,
        stamp_emoji: tData.stamp_emoji,
        latitude: tData.latitude,
        longitude: tData.longitude,
      };
      setTotem(mappedTotem);

      // 2. verificăm dacă userul are bonusul deblocat în DB
      if (user?.sub) {
        const { data: unlocks, error: unlockError } = await supabase
          .from("totem_unlocks")
          .select("id")
          .eq("auth0_sub", user.sub)
          .eq("totem_id", totemId);

        if (unlockError) {
          console.error("Eroare la verificarea bonus unlock:", unlockError);
        } else if (unlocks && unlocks.length > 0) {
          setHasBonusUnlock(true);
        } else {
          setHasBonusUnlock(false);
        }
      } else {
        setHasBonusUnlock(false);
      }

      // 3. materialele pentru acest totem
      const { data: cData, error: cError } = await supabase
        .from("contents")
        .select("id, title, category, artist, snippet, views")
        .eq("totem_id", totemId)
        .order("category", { ascending: true })
        .order("created_at", { ascending: true });

      if (cError) {
        console.error(
          "Eroare la încărcarea materialelor pentru totem:",
          cError
        );
        setLoading(false);
        return;
      }

      const mappedItems: ContentItem[] = (cData || []).map((row: any) => ({
        id: row.id,
        title: row.title,
        category: row.category as ContentCategory,
        artist: row.artist,
        snippet: row.snippet,
        views: row.views ?? 0,
      }));

      setItems(mappedItems);
      setLoading(false);

      // 4. verificăm QR unlock (client-side, pentru locked_text + ștampilă)
      const qrParam = searchParams.get("qr");
      if (qrParam && qrParam === tData.qr_slug) {
        setUnlocked(true);

        // salvăm ștampila local
        if (tData.stamp_label) {
          const stamp: Stamp = {
            totem_id: tData.id,
            stamp_label: tData.stamp_label,
            stamp_emoji: tData.stamp_emoji,
          };
          saveStampToStorage(stamp);
        }
      } else {
        setUnlocked(false);
      }
    };

    loadData();
  }, [totemId, searchParams, user?.sub]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Se încarcă informațiile despre totem...
        </p>
      </div>
    );
  }

  if (!totem) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Totemul nu a fost găsit.
        </p>
      </div>
    );
  }

  const hasLocation =
    typeof totem.latitude === "number" &&
    typeof totem.longitude === "number";

  const center: LatLngExpression = hasLocation
    ? [totem.latitude as number, totem.longitude as number]
    : [45.75372, 21.22571];

  const totalViews = items.reduce((sum, i) => sum + (i.views ?? 0), 0);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* back link */}
        <NavLink
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Înapoi la pagina principală
        </NavLink>

        {/* header totem */}
        <section className="rounded-2xl bg-gradient-to-br from-accent/40 to-secondary/60 p-6 space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-background/80 p-2 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold leading-tight">
                  {totem.name}
                </h1>
                {totem.description && (
                  <p className="text-sm text-foreground/80 mt-1">
                    {totem.description}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col items-end gap-2 text-xs text-foreground/80">
              <span className="inline-flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {totalViews} vizualizări totale
              </span>

              <span className="inline-flex items-center gap-1 rounded-full bg-background/70 px-2 py-1 border border-border/60">
                {unlocked ? (
                  <>
                    <Unlock className="w-3 h-3" />
                    <span>Conținut deblocat prin QR</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3 h-3" />
                    <span>Scanează codul QR din stație pentru bonus</span>
                  </>
                )}
              </span>

              {isAuthenticated && hasBonusUnlock && (
                <NavLink
                  to={`/totem/${totem.id}/bonus`}
                  className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
                >
                  Vezi conținutul bonus despre monument
                  <Unlock className="w-3 h-3" />
                </NavLink>
              )}

              {isAuthenticated && !hasBonusUnlock && (
                <p className="mt-1 text-[11px] text-muted-foreground text-right">
                  După ce scanezi codul QR și marchezi că ai fost la monument,
                  vei putea accesa conținutul bonus de aici.
                </p>
              )}
            </div>
          </div>

          {/* teaser text – vizibil mereu */}
          {totem.teaser_text && (
            <p className="text-sm md:text-base text-foreground/90 mt-2">
              {totem.teaser_text}
            </p>
          )}

          {/* locked text – doar când unlocked e true */}
          {unlocked && totem.locked_text && (
            <div className="mt-3 rounded-xl bg-background/80 border border-border/60 p-3 text-sm text-foreground">
              <p className="font-medium mb-1">
                {totem.stamp_emoji || "🏅"} Poveste bonus
              </p>
              <p className="whitespace-pre-line">{totem.locked_text}</p>
            </div>
          )}
        </section>

        {/* mini-harta */}
        {hasLocation && (
          <section className="rounded-2xl border border-border/60 overflow-hidden shadow-lg">
            <MapContainer
              center={center}
              zoom={15}
              scrollWheelZoom={false}
              className="w-full h-64"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <RecenterMap center={center} />
              <Marker position={center}>
                <Popup>{totem.name}</Popup>
              </Marker>
            </MapContainer>
          </section>
        )}

        {/* materiale grupate pe categorii */}
        <section className="space-y-6">
          {CATEGORIES_ORDER.map((cat) => {
            const catItems = items.filter((i) => i.category === cat);
            if (!catItems.length) return null;

            const label = CATEGORY_LABELS[cat];
            const icon = CATEGORY_ICONS[cat];

            return (
              <div key={cat} className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-card border border-border/60 p-2 flex items-center justify-center">
                    {icon}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">{label}</h2>
                    <p className="text-xs text-muted-foreground">
                      {catItems.length} material
                      {catItems.length > 1 ? "e" : ""} în această categorie.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {catItems.map((item) => (
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

                      <div className="mt-2 flex items-center justify-between gap-2">
                        <NavLink
                          to={`/content/${item.id}`}
                          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                        >
                          Deschide materialul
                        </NavLink>

                        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {item.views} vizualizări
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
};

export default TotemPage;
