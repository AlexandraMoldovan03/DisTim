import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Heart, Share2, Clock } from "lucide-react";
import { useState } from "react";

// Mock data - will be replaced with actual data
const MOCK_CONTENT_DETAIL = {
  "lit-001": {
    id: "lit-001",
    title: "Amintiri din Timișoara Veche",
    category: "Literatură",
    categoryIcon: "📖",
    artist: {
      name: "Ion Popescu",
      bio: "Scriitor timișorean pasionat de istoria urbană. A publicat trei romane și numeroase povestiri scurte.",
    },
    readingTime: 3,
    favorites: 24,
    content: `Străzile Timișoarei vechi miros a poveste. Fiecare pavaj poartă amprenta sutelor de ani de istorie, iar fiecare colț al orașului ascunde amintiri ce așteaptă să fie descoperite.

În copilărie, obișnuiam să mă plimb pe Corso, privind în sus la ferestrele clădirilor vechi, imaginându-mi viețile celor care locuiseră acolo. Piața Unirii era inima orașului, locul unde se întâlneau destinele oamenilor, unde se născeau povești de dragoste și se spuneau ultimele rămasuri bune.

Timișoara nu este doar un oraș - este o colecție de momente înghețate în timp, o carte deschisă pentru cei care știu să citească între rânduri. Fiecare stradă are povestea ei, fiecare clădire păstrează secrete vechi de secole.

Azi, când traversez aceleași străzi, simt cum istoria pulsează sub pașii mei. Orașul s-a schimbat, dar esența lui rămâne aceeași - un loc unde trecutul și prezentul dansează împreună într-un vals nesfârșit.`,
    isFavorited: false,
  },
  "lit-002": {
    id: "lit-002",
    title: "Scrisoare către orașul meu",
    category: "Literatură",
    categoryIcon: "📖",
    artist: {
      name: "Maria Ionescu",
      bio: "Poetă și prozatoare timișoreancă. Câștigătoare a mai multor premii literare naționale.",
    },
    readingTime: 5,
    favorites: 12,
    content: `Dragă Timișoara,

Te scriu aceste rânduri din trenul care mă duce departe de tine, dar inima mea rămâne ancorat în Piața Victoriei, acolo unde ne-am cunoscut mai întâi.

Îmi amintesc parfumul toamnei tale, cum frunzele galbene cădeau pe Bega, transformând malurile într-o fâșie de aur. Îmi amintesc serile petrecute în cafenelele tale vechi, unde timpul parca se mișca mai încet.

Tu m-ai învățat că un oraș nu este doar clădiri și străzi. Este o entitate vie, care respiră prin oamenii săi, care crește și se transformă păstrându-și totodată sufletul.

O să mă întorc, știi tu bine. Pentru că parte din mine va rămâne mereu pe străzile tale pavate, în umbrele catedralelor tale, în ecoul pașilor mei pe Corso.

Cu drag veșnic,
Maria`,
    isFavorited: false,
  },
  "poe-001": {
    id: "poe-001",
    title: "Bega în Amurg",
    category: "Poezie",
    categoryIcon: "✍️",
    artist: {
      name: "Ana Moldovan",
      bio: "Poetă contemporană, colaboratoare la mai multe reviste literare. Pasionată de versul liber și imagini urbane.",
    },
    readingTime: 2,
    favorites: 18,
    content: `Bega în amurg -
un șuvoi de lumină lichidă
se scurge printre ziduri vechi.

Pe maluri, oamenii trec grăbiți,
fiecare purtându-și propria poveste
în buzunare.

Lebedele albe plutesc liniștite,
indiferente la agitația umană,
stăpâne ale propriului timp.

Și eu stau pe bancă,
privind cum soarele își varsă
ultimele raze aurii
peste orașul meu.

În clipa asta,
Timișoara este perfectă -
un tablou neterminat
care nu va fi niciodată gata.`,
    isFavorited: false,
  },
  "art-001": {
    id: "art-001",
    title: "Timișoara în Culori",
    category: "Arte Vizuale",
    categoryIcon: "🎨",
    artist: {
      name: "Andra Mureșan",
      bio: "Ilustrator și graphic designer. Pasionată de urban sketching și aquarelle.",
    },
    favorites: 31,
    description: "Serie de ilustrații digitale inspirate din arhitectura și energia Timișoarei. Fiecare imagine captează un landmark iconic prin prisma culorilor și emoțiilor mele.",
    images: [
      { id: 1, alt: "Piața Unirii cu Catedrala în culori vibrante" },
      { id: 2, alt: "Strada pietonală Corso la apus" },
    ],
    isFavorited: false,
  },
};

const ContentDetail = () => {
  const { contentId } = useParams<{ contentId: string }>();
  const [isFavorited, setIsFavorited] = useState(false);
  
  const content = contentId && MOCK_CONTENT_DETAIL[contentId as keyof typeof MOCK_CONTENT_DETAIL];

  if (!content) {
    return (
      <div className="min-h-screen bg-background">
        <Header showBack />
        <div className="container max-w-2xl mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Conținut negăsit</h2>
          <p className="text-muted-foreground">Opera pe care o cauți nu există sau a fost ștearsă.</p>
        </div>
      </div>
    );
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: content.title,
          text: `${content.title} de ${content.artist.name} - Descoperit în transportul public din Timișoara`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share canceled");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copiat!");
    }
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  const isGallery = "images" in content;

  return (
    <div className="min-h-screen bg-background">
      {/* Floating action buttons */}
      <div className="fixed top-20 right-4 z-40 flex flex-col gap-2">
        <Button
          size="icon"
          variant="secondary"
          className="rounded-full shadow-lg"
          onClick={handleFavorite}
        >
          <Heart className={`w-5 h-5 ${isFavorited ? "fill-current text-primary" : ""}`} />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          className="rounded-full shadow-lg"
          onClick={handleShare}
        >
          <Share2 className="w-5 h-5" />
        </Button>
      </div>

      <Header showBack />
      
      <main className="container max-w-2xl mx-auto pb-12">
        {/* Hero/Cover Section */}
        <div className="bg-gradient-to-br from-accent/30 to-secondary h-64 flex items-center justify-center text-6xl">
          {content.categoryIcon}
        </div>

        {/* Content Body */}
        <article className="px-4">
          {/* Metadata */}
          <div className="py-6 border-b border-border">
            <h1 className="text-3xl font-bold mb-3 leading-tight">
              {content.title}
            </h1>
            <p className="text-lg text-muted-foreground mb-2">
              de {content.artist.name}
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{content.category}</span>
              {"readingTime" in content && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {content.readingTime} min
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Main Content */}
          {isGallery ? (
            <div className="py-8">
              <p className="text-base leading-relaxed mb-6">
                {content.description}
              </p>
              <div className="space-y-4">
                {content.images.map((img) => (
                  <div key={img.id} className="bg-secondary rounded-xl h-64 flex items-center justify-center text-4xl">
                    🎨
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-8 reading-content text-base md:text-lg whitespace-pre-line">
              {content.content}
            </div>
          )}

          {/* Artist Card */}
          <div className="mt-8 bg-secondary rounded-xl p-6">
            <h2 className="text-xl font-bold mb-3">Despre artist</h2>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-xl flex-shrink-0">
                {content.artist.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold mb-1">{content.artist.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {content.artist.bio}
                </p>
              </div>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
};

export default ContentDetail;
