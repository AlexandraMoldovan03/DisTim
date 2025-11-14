import { useState } from "react";
import { MapPin } from "lucide-react";

interface QRLocation {
  id: string;
  name: string;
  x: number; // percentage position
  y: number; // percentage position
  area: string;
  description: string;
}

const QR_LOCATIONS: QRLocation[] = [
  {
    id: "piata-unirii",
    name: "Piața Unirii",
    x: 50,
    y: 45,
    area: "Centru istoric",
    description:
      "Piață emblematică, înconjurată de clădiri baroce și Catedrala Romano-Catolică.",
  },
  {
    id: "gara-nord",
    name: "Gara de Nord",
    x: 65,
    y: 30,
    area: "Cartierul Cetății",
    description:
      "Principalul nod feroviar al orașului, poartă de intrare în Timișoara.",
  },
  {
    id: "opera",
    name: "Opera Română",
    x: 42,
    y: 52,
    area: "Piața Victoriei",
    description:
      "Clădire-simbol, între Operă și Teatrul Național, loc pentru evenimente culturale.",
  },
  {
    id: "piata-victoriei",
    name: "Piața Victoriei",
    x: 58,
    y: 48,
    area: "Centru",
    description:
      "Axa dintre Operă și Catedrală, una dintre cele mai animate zone din oraș.",
  },
  {
    id: "catedrala",
    name: "Catedrala Mitropolitană",
    x: 48,
    y: 38,
    area: "Piața Victoriei",
    description:
      "Unul dintre cele mai cunoscute repere arhitecturale și spirituale ale Timișoarei.",
  },
  {
    id: "bega",
    name: "Podul Decebal",
    x: 55,
    y: 60,
    area: "Bega",
    description:
      "Punct de trecere peste Bega, aproape de promenadă și zonele de agrement.",
  },
];

const TimisoaraMap = () => {
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<QRLocation | null>(
    QR_LOCATIONS[0]
  );

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Titlu */}
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-foreground mb-1">
          Harta punctelor QR din Timișoara
        </h2>
        <p className="text-sm text-muted-foreground">
          Vezi reperele principale și stațiile unde găsești codurile QR.
        </p>
      </div>

      {/* Container hartă */}
      <div className="relative rounded-2xl border border-border/60 shadow-xl overflow-hidden bg-background">
        <div className="relative aspect-[4/3]">
          {/* Imagine de fundal cu harta orașului */}
          <img
            src="/maps/timisoara-map.png"
            alt="Harta Timișoara"
            className="absolute inset-0 w-full h-full object-cover opacity-90"
          />

          {/* Overlay ușor pentru contrast */}
          <div className="absolute inset-0 bg-gradient-to-br from-background/20 via-transparent to-background/30" />

          {/* Markere QR */}
          {QR_LOCATIONS.map((location) => (
            <button
              key={location.id}
              type="button"
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group focus:outline-none"
              style={{ left: `${location.x}%`, top: `${location.y}%` }}
              onMouseEnter={() => setHoveredLocation(location.id)}
              onMouseLeave={() => setHoveredLocation(null)}
              onClick={() => setSelectedLocation(location)}
            >
              <div className="relative flex flex-col items-center gap-1">
                {/* punct + ping */}
                <div className="relative">
                  <div className="w-4 h-4 bg-[hsl(var(--map-marker))] rounded-full border-2 border-background shadow-lg group-hover:scale-125 transition-transform" />
                  <div className="absolute inset-0 w-4 h-4 bg-[hsl(var(--map-marker))] rounded-full animate-ping opacity-60" />
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MapPin className="w-5 h-5 text-[hsl(var(--map-marker))] drop-shadow" />
                  </div>
                </div>

                {/* Etichetă mică lângă marker (vizibilă mereu) */}
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-background/85 text-foreground shadow-sm border border-border/60">
                  {location.name}
                </span>

                {/* Tooltip extra doar pe hover */}
                {hoveredLocation === location.id && (
                  <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-foreground text-background px-3 py-1.5 rounded-lg text-xs font-medium shadow-lg z-10 animate-in fade-in slide-in-from-bottom-2 duration-200">
                    {location.area}
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-foreground rotate-45" />
                  </div>
                )}
              </div>
            </button>
          ))}

          {/* Legendă */}
          <div className="absolute bottom-3 left-3 bg-background/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md border border-border/50 text-xs flex items-center gap-2">
            <div className="w-3 h-3 bg-[hsl(var(--map-marker))] rounded-full" />
            <span className="text-foreground/80">
              Locuri unde găsești coduri QR
            </span>
          </div>

          {/* Hint interactiv */}
          <div className="absolute top-3 right-3 bg-secondary/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium text-secondary-foreground">
            Click pe puncte pentru detalii
          </div>
        </div>

        {/* Card cu detalii sub hartă */}
        {selectedLocation && (
          <div className="border-t border-border/60 bg-background/95 backdrop-blur-sm px-4 py-3 sm:px-6 sm:py-4 flex flex-col gap-1">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-foreground">
                  {selectedLocation.name}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Zonă: {selectedLocation.area}
                </p>
              </div>
              <span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium">
                Stație QR
              </span>
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              {selectedLocation.description}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Scanează codul QR din stația fizică pentru a debloca materialele
              artistice asociate acestei locații în aplicație.
            </p>
          </div>
        )}

        {/* Footer mic cu număr de locații */}
        <div className="px-4 py-2 text-center text-xs text-muted-foreground bg-background/95 border-t border-border/40">
          <span className="font-semibold text-foreground">
            {QR_LOCATIONS.length}
          </span>{" "}
          locații active în Timișoara
        </div>
      </div>
    </div>
  );
};

export default TimisoaraMap;
