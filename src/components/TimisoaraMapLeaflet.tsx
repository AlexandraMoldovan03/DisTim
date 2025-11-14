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

interface TotemLocation {
  id: string;
  name: string;
  description: string;
  position: LatLngExpression;
}
// coordonate aproximative pentru puncte din Timișoara
const TOTEM_LOCATIONS: TotemLocation[] = [
  {
    id: "piata-unirii",
    name: "Piața Unirii",
    description: "Piață barocă în centrul istoric al Timișoarei.",
    position: [45.75769, 21.22989],
  },
  {
    id: "piata-victoriei",
    name: "Piața Victoriei",
    description:
      "Axa dintre Operă și Catedrală, plină de terase și evenimente.",
    position: [45.75371, 21.22571],
  },
  {
    id: "opera-romana",
    name: "Opera Română",
    description: "Clădire emblematică pentru evenimente culturale.",
    position: [45.75396, 21.22531],
  },
  {
    id: "catedrala",
    name: "Catedrala Mitropolitană",
    description: "Simbol spiritual și arhitectural al orașului.",
    position: [45.75149, 21.22727],
  },
  {
    id: "gara-nord",
    name: "Gara de Nord",
    description: "Gara principală a orașului.",
    position: [45.74892, 21.2086],
  },
  {
    id: "podul-decebal",
    name: "Podul Decebal (Bega)",
    description: "Zona de promenadă și traversare a Begăi.",
    position: [45.75163, 21.24066],
  },
];

const TIMISOARA_CENTER: LatLngExpression = [45.75372, 21.22571];

function RecenterOnSelect({ center }: { center: LatLngExpression }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(center, 14, { duration: 0.8 });
  }, [center, map]);

  return null;
}

const TimisoaraMapLeaflet = () => {
  const [selectedLocation, setSelectedLocation] =
    useState<TotemLocation | null>(null);
  const [mapCenter, setMapCenter] =
    useState<LatLngExpression>(TIMISOARA_CENTER);
  const [userLocation, setUserLocation] =
    useState<LatLngExpression | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);

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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Harta totemurilor din Timișoara
          </h2>
          <p className="text-sm text-muted-foreground">
            Deplasează-te pe hartă, dă zoom și apasă pe markere pentru detalii.
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

          {/* Marker-ele pentru totemuri */}
          {TOTEM_LOCATIONS.map((loc) => (
            <Marker
              key={loc.id}
              position={loc.position}
              eventHandlers={{
                click: () => {
                  setSelectedLocation(loc);
                  setMapCenter(loc.position);
                },
              }}
            >
              <Popup>
                <strong>{loc.name}</strong>
                <br />
                <span className="text-xs">{loc.description}</span>
              </Popup>
            </Marker>
          ))}

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
              {selectedLocation.description}
            </p>
            <p className="text-xs text-muted-foreground">
              Aici poți monta totemul sau panoul cu cod QR. La scanare, aplicația
              poate deschide automat materialele artistice legate de această
              locație.
            </p>
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

        <p className="text-xs text-muted-foreground mt-2">
          {TOTEM_LOCATIONS.length} locații configurate în Timișoara (poți adăuga
          oricând altele în lista <code>TOTEM_LOCATIONS</code>).
        </p>
      </div>
    </div>
  );
};

export default TimisoaraMapLeaflet;
