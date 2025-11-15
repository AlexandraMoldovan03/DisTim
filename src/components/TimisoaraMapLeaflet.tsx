// src/components/TimisoaraMapLeaflet.tsx
import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import { MapPin } from "lucide-react";
import "../leafletIconsFix";
import { supabase } from "@/lib/supabaseClient";
import { NavLink } from "react-router-dom";

interface TotemLocation {
  id: string;
  name: string;
  description: string | null;
  latitude: number;
  longitude: number;
}

// punct de ambrozie din view-ul ambrosia_monthly
interface AmbrosiaPoint {
  location_name: string;
  latitude: number;
  longitude: number;
  month: number; // înainte era month_int
  avg_value: number;
}

const TIMISOARA_CENTER: LatLngExpression = [45.75372, 21.22571];

const MONTHS = [
  { value: 1, label: "Ian" },
  { value: 2, label: "Feb" },
  { value: 3, label: "Mar" },
  { value: 4, label: "Apr" },
  { value: 5, label: "Mai" },
  { value: 6, label: "Iun" },
  { value: 7, label: "Iul" },
  { value: 8, label: "Aug" },
  { value: 9, label: "Sep" },
  { value: 10, label: "Oct" },
  { value: 11, label: "Nov" },
  { value: 12, label: "Dec" },
];

function RecenterOnSelect({ center }: { center: LatLngExpression }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(center, 14, { duration: 0.8 });
  }, [center, map]);

  return null;
}

const TimisoaraMapLeaflet = () => {
  const [totems, setTotems] = useState<TotemLocation[]>([]);
  const [selectedLocation, setSelectedLocation] =
    useState<TotemLocation | null>(null);
  const [mapCenter, setMapCenter] =
    useState<LatLngExpression>(TIMISOARA_CENTER);
  const [userLocation, setUserLocation] =
    useState<LatLngExpression | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);

  // --- starea pentru heatmap ambrozie ---
  const [selectedMonth, setSelectedMonth] = useState<number>(8); // implicit: august
  const [heatEnabled, setHeatEnabled] = useState<boolean>(false);
  const [ambrosiaPoints, setAmbrosiaPoints] = useState<AmbrosiaPoint[]>([]);
  const [ambrosiaLoading, setAmbrosiaLoading] = useState<boolean>(false);
  const [ambrosiaError, setAmbrosiaError] = useState<string | null>(null);

  // încărcăm totemurile din Supabase
  useEffect(() => {
    const loadTotems = async () => {
      const { data, error } = await supabase
        .from("totems")
        .select("id, name, description, latitude, longitude");

      if (error) {
        console.error("Eroare la încărcarea totemurilor:", error);
        return;
      }

      setTotems((data || []) as TotemLocation[]);
    };

    loadTotems();
  }, []);

  // încărcăm media lunară de ambrozie pentru luna selectată (toți anii)
  useEffect(() => {
    const loadAmbrosia = async () => {
      setAmbrosiaLoading(true);
      setAmbrosiaError(null);

      try {
        const { data, error } = await supabase
          .from("ambrosia_monthly")
          .select("location_name, latitude, longitude, month, avg_value")
          .eq("month", selectedMonth); // doar luna aleasă, fără an

        if (error) {
          console.error("Eroare la încărcarea ambrosia_monthly:", error);
          setAmbrosiaError("Nu am putut încărca datele de ambrozie.");
          setAmbrosiaPoints([]);
        } else {
          setAmbrosiaPoints((data || []) as AmbrosiaPoint[]);
        }
      } catch (e) {
        console.error(e);
        setAmbrosiaError(
          "A apărut o eroare necunoscută la încărcarea datelor."
        );
        setAmbrosiaPoints([]);
      } finally {
        setAmbrosiaLoading(false);
      }
    };

    // încărcăm de fiecare dată când se schimbă luna
    loadAmbrosia();
  }, [selectedMonth]);

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setGeoError("Browserul nu suportă geolocalizare.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: LatLngExpression = [
          pos.coords.latitude,
          pos.coords.longitude,
        ];
        setUserLocation(coords);
        setMapCenter(coords);
        setGeoError(null);
      },
      () => {
        setGeoError(
          "Nu am putut obține locația. Verifică permisiunile de locație."
        );
      }
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Harta totemurilor din Timișoara
            </h2>
            <p className="text-sm text-muted-foreground">
              Deplasează-te pe hartă, dă zoom și apasă pe markere pentru
              detalii.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLocateMe}
            className="inline-flex items-center gap-2 rounded-full border border-primary/60 bg-primary/10 px-4 py-2 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
          >
            <span>Centrează pe locația mea</span>
          </button>
        </div>

        {/* controale pentru heatmap */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">
              Lună (medie pe toți anii):
            </span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="h-8 rounded-md border border-input bg-background px-2 text-xs"
            >
              {MONTHS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={heatEnabled}
              onChange={(e) => setHeatEnabled(e.target.checked)}
              className="h-3 w-3"
            />
            <span>Arată heatmap Ambrosia</span>
          </label>

          {heatEnabled && (
            <span className="text-[11px] text-muted-foreground">
              Cercurile colorate arată <strong>concentrația medie</strong> de
              polen Ambrosia pentru luna selectată (valorile de iarnă sunt 0).
            </span>
          )}
        </div>
      </div>

      {/* Harta propriu-zisă */}
      <div className="relative rounded-2xl border border-border/60 overflow-hidden shadow-xl">
        <MapContainer
          center={TIMISOARA_CENTER}
          zoom={13}
          scrollWheelZoom={true}
          className="w-full h-[420px] sm:h-[480px]"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Recentrare când se schimbă centrul */}
          <RecenterOnSelect center={mapCenter} />

          {/* Marker-ele pentru totemuri din Supabase */}
          {totems.map((loc) => (
            <Marker
              key={loc.id}
              position={[loc.latitude, loc.longitude]}
              eventHandlers={{
                click: () => {
                  setSelectedLocation(loc);
                  setMapCenter([loc.latitude, loc.longitude]);
                },
              }}
            >
              <Popup>
                <strong>{loc.name}</strong>
                <br />
                <span className="text-xs">
                  {loc.description ?? "Totem cultural în Timișoara"}
                </span>
              </Popup>
            </Marker>
          ))}

          {/* Heatmap Ambrosia – cercuri scalate după avg_value */}
          {heatEnabled &&
            ambrosiaPoints
              .filter((p) => p.avg_value > 0) // nu desenăm cercuri pentru 0
              .map((p) => {
                // normalizare: presupunem că 0–15 e range-ul uzual
                const intensity = Math.min(p.avg_value / 15, 1);

                // radius mai mare ca să fie clar vizibil
                const radius = 80 + p.avg_value * 30;

                return (
                  <Circle
                    key={`heat-${p.location_name}-${p.month}`}
                    center={[p.latitude, p.longitude]}
                    radius={radius}
                    pathOptions={{
                      color: "transparent",
                      fillColor: "#ef4444",
                      fillOpacity: 0.2 + 0.6 * intensity,
                    }}
                  />
                );
              })}

          {/* Locația utilizatorului (dacă e disponibilă) */}
          {userLocation && (
            <>
              <Marker position={userLocation}>
                <Popup>
                  <strong>Tu ești aici</strong>
                </Popup>
              </Marker>
              <Circle
                center={userLocation}
                radius={80}
                pathOptions={{
                  color: "#22c55e",
                  fillColor: "#22c55e",
                  fillOpacity: 0.15,
                }}
              />
            </>
          )}
        </MapContainer>
      </div>

      {/* Panou de detalii sub hartă */}
      <div className="rounded-2xl border border-border/60 bg-card p-4 space-y-2">
        {selectedLocation ? (
          <>
            <div className="flex items-center justify-between gap-2">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-foreground">
                  {selectedLocation.name}
                </h3>
              </div>
              <span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium">
                Stație QR
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {selectedLocation.description ??
                "Totem cultural care va găzdui materiale artistice locale."}
            </p>
            <p className="text-xs text-muted-foreground">
              Aici poți monta totemul sau panoul cu cod QR. La scanare,
              aplicația poate deschide automat materialele artistice legate de
              această locație.
            </p>

            <NavLink
              to={`/totem/${selectedLocation.id}`}
              className="inline-flex items-center gap-2 mt-2 text-xs font-medium text-primary hover:underline"
            >
              Deschide pagina totemului
            </NavLink>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            Selectează un marker de pe hartă pentru a vedea detalii despre
            totem.
          </p>
        )}

        {geoError && (
          <p className="text-xs text-red-400 mt-1">{geoError}</p>
        )}

        {ambrosiaError && (
          <p className="text-xs text-red-400 mt-1">{ambrosiaError}</p>
        )}

        {heatEnabled && ambrosiaLoading && (
          <p className="text-xs text-muted-foreground mt-1">
            Se încarcă datele de ambrozie pentru luna selectată…
          </p>
        )}

        {heatEnabled && !ambrosiaLoading && ambrosiaPoints.length === 0 && (
          <p className="text-xs text-muted-foreground mt-1">
            Nu avem încă date de ambrozie pentru luna selectată.
          </p>
        )}

        <p className="text-xs text-muted-foreground mt-2">
          {totems.length} locații configurate în Timișoara (date încărcate din
          Supabase).
        </p>
      </div>
    </div>
  );
};

export default TimisoaraMapLeaflet;
