// src/lib/passportStorage.ts

// 👇 UN SINGUR tip Badge – îl folosim și pentru pașaport, și pentru unlock
export interface Badge {
  // id = id-ul totemului (ex: "catedrala", "piata-unirii")
  id: string;
  locationName: string;

  // info artist inventat / asociat
  artistName: string;
  artistBio: string;
  category: string;

  // când am „colectat” ștampila
  collectedAt: string;

  // opțional: poți folosi emoji pentru ștampilă
  stampEmoji?: string | null;
}

const STORAGE_KEY = "distim_passport_badges";

export const passportStorage = {
  getBadges(): Badge[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error reading badges from storage:", error);
      return [];
    }
  },

  addBadge(badge: Badge): void {
    try {
      const badges = passportStorage.getBadges();
      // nu duplicăm – un singur badge per totem (id)
      const exists = badges.some((b) => b.id === badge.id);
      if (!exists) {
        badges.push(badge);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(badges));
      }
    } catch (error) {
      console.error("Error saving badge to storage:", error);
    }
  },

  // 👉 asta o folosim pentru "totemul e deja deblocat?"
  hasBadge(totemId: string): boolean {
    const badges = passportStorage.getBadges();
    return badges.some((b) => b.id === totemId);
  },

  clearBadges(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing badges:", error);
    }
  },
};

// --- artiști sample pentru pașaport (rămâne cum aveai) ---

export const SAMPLE_ARTISTS = [
  {
    name: "Maria Popescu",
    bio: "Poetă și scriitoare timișoreană, laureată a premiului național de poezie 2022.",
    category: "Poezie",
  },
  {
    name: "Ion Marinescu",
    bio: "Compozitor și muzician, cunoscut pentru fuziunea dintre jazz și muzica tradițională.",
    category: "Muzică",
  },
  {
    name: "Elena Dumitrescu",
    bio: "Artist vizual specializat în artă urbană și instalații interactive.",
    category: "Arte Vizuale",
  },
  {
    name: "Andrei Constantinescu",
    bio: "Scriitor de proză scurtă, finalist la concursul național de literatură 2023.",
    category: "Literatură",
  },
  {
    name: "Sofia Rădulescu",
    bio: "Cântăreață de operă și profesoară la Conservatorul de Muzică din Timișoara.",
    category: "Muzică",
  },
  {
    name: "Mihai Georgescu",
    bio: "Pictor și sculptor, cu expoziții în galerii din toată Europa.",
    category: "Arte Vizuale",
  },
  {
    name: "Ana Stoica",
    bio: "Poetă contemporană, cunoscută pentru versurile sale despre viața urbană.",
    category: "Poezie",
  },
  {
    name: "Cristian Popa",
    bio: "Romancier și eseist, autor al trilogiei 'Timișoara Modernă'.",
    category: "Literatură",
  },
];

export const getRandomArtist = () => {
  return SAMPLE_ARTISTS[Math.floor(Math.random() * SAMPLE_ARTISTS.length)];
};
