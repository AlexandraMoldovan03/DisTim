import { useState } from "react";
import { MapPin } from "lucide-react";

interface QRLocation {
  id: string;
  name: string;
  x: number; // percentage position
  y: number; // percentage position
}

const QR_LOCATIONS: QRLocation[] = [
  { id: "piata-unirii", name: "Piața Unirii", x: 50, y: 45 },
  { id: "gara-nord", name: "Gara de Nord", x: 65, y: 30 },
  { id: "opera", name: "Opera Română", x: 42, y: 52 },
  { id: "piata-victoriei", name: "Piața Victoriei", x: 58, y: 48 },
  { id: "catedrala", name: "Catedrala Mitropolitană", x: 48, y: 38 },
  { id: "bega", name: "Podul Decebal", x: 55, y: 60 },
];

const TimisoaraMap = () => {
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-foreground mb-1">
          Harta QR Codurilor
        </h2>
        <p className="text-sm text-muted-foreground">
          Scanează codul din stațiile marcate pe hartă
        </p>
      </div>

      {/* Map Container */}
      <div className="relative aspect-[4/3] bg-[hsl(var(--map-land))] rounded-2xl border-2 border-primary/20 shadow-lg overflow-hidden">
        {/* Simplified Timișoara illustration */}
        {/* River Bega */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 400 300"
          preserveAspectRatio="none"
        >
          {/* Bega River path - simplified curve through the city */}
          <path
            d="M 0 180 Q 100 160, 200 170 T 400 180 L 400 200 Q 300 190, 200 185 T 0 200 Z"
            fill="hsl(var(--map-water))"
            opacity="0.6"
          />
          
          {/* Main streets - subtle lines */}
          <line
            x1="50"
            y1="100"
            x2="350"
            y2="140"
            stroke="hsl(var(--border))"
            strokeWidth="2"
            opacity="0.3"
          />
          <line
            x1="180"
            y1="50"
            x2="220"
            y2="250"
            stroke="hsl(var(--border))"
            strokeWidth="2"
            opacity="0.3"
          />
          
          {/* City center circle */}
          <circle
            cx="200"
            cy="135"
            r="30"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            strokeDasharray="5,5"
            opacity="0.4"
          />
        </svg>

        {/* QR Location Markers */}
        {QR_LOCATIONS.map((location) => (
          <div
            key={location.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 group"
            style={{ left: `${location.x}%`, top: `${location.y}%` }}
            onMouseEnter={() => setHoveredLocation(location.id)}
            onMouseLeave={() => setHoveredLocation(null)}
          >
            {/* Marker dot */}
            <div className="relative">
              <div className="w-4 h-4 bg-[hsl(var(--map-marker))] rounded-full border-2 border-background shadow-lg group-hover:scale-125 transition-transform" />
              
              {/* Pulse animation */}
              <div className="absolute inset-0 w-4 h-4 bg-[hsl(var(--map-marker))] rounded-full animate-ping opacity-75" />
              
              {/* Map pin icon on hover */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <MapPin className="w-6 h-6 text-[hsl(var(--map-marker))]" />
              </div>
            </div>

            {/* Location name tooltip */}
            {hoveredLocation === location.id && (
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-foreground text-background px-3 py-1.5 rounded-lg text-sm font-medium shadow-lg z-10 animate-in fade-in slide-in-from-bottom-2 duration-200">
                {location.name}
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-foreground rotate-45" />
              </div>
            )}
          </div>
        ))}

        {/* Legend */}
        <div className="absolute bottom-3 left-3 bg-background/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md border border-border/50">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 bg-[hsl(var(--map-marker))] rounded-full" />
            <span className="text-foreground/80">Locații QR Code</span>
          </div>
        </div>

        {/* Interactive hint */}
        <div className="absolute top-3 right-3 bg-secondary/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium text-secondary-foreground">
          Hover pe puncte
        </div>
      </div>

      {/* Stats footer */}
      <div className="mt-4 text-center">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{QR_LOCATIONS.length}</span> locații active în Timișoara
        </p>
      </div>
    </div>
  );
};

export default TimisoaraMap;
