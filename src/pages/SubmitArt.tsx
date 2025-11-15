// src/pages/SubmitArt.tsx
import { useEffect, useState, FormEvent } from "react";
import { NavLink } from "react-router-dom";
import { MapPin, Send, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type ContentCategory = "literatura" | "poezie" | "muzica" | "arte";

interface TotemOption {
  id: string;
  name: string;
}

const CATEGORY_LABELS: { id: ContentCategory; label: string }[] = [
  { id: "literatura", label: "Literatură" },
  { id: "poezie", label: "Poezie" },
  { id: "muzica", label: "Muzică" },
  { id: "arte", label: "Arte vizuale" },
];

const SubmitArt = () => {
  const [totems, setTotems] = useState<TotemOption[]>([]);
  const [loadingTotems, setLoadingTotems] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // fields
  const [totemId, setTotemId] = useState<string>("");
  const [category, setCategory] = useState<ContentCategory | "">("");
  const [title, setTitle] = useState("");
  const [artistName, setArtistName] = useState("");
  const [artistEmail, setArtistEmail] = useState("");
  const [snippet, setSnippet] = useState("");
  const [fullText, setFullText] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");

  // 1. încărcăm totemurile din Supabase
  useEffect(() => {
    const loadTotems = async () => {
      const { data, error } = await supabase
        .from("totems")
        .select("id, name")
        .order("name", { ascending: true });

      if (error) {
        console.error("Eroare la încărcarea totemurilor:", error);
        toast.error("Nu am putut încărca lista de totemuri.");
      } else {
        setTotems((data || []) as TotemOption[]);
      }

      setLoadingTotems(false);
    };

    loadTotems();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!totemId) {
      toast.error("Te rog alege totemul / stația.");
      return;
    }
    if (!category) {
      toast.error("Te rog alege categoria (literatură, poezie, etc.).");
      return;
    }
    if (!title.trim()) {
      toast.error("Te rog completează titlul.");
      return;
    }

    setSubmitting(true);

    const { error } = await supabase.from("contents").insert({
      totem_id: totemId,
      category,
      title: title.trim(),
      artist: artistName.trim() || null,
      snippet: snippet.trim() || null,
      full_text: fullText.trim() || null,
      media_url: mediaUrl.trim() || null,
      submitter_name: artistName.trim() || null,
      submitter_email: artistEmail.trim() || null,
    });

    setSubmitting(false);

    if (error) {
      console.error("Eroare la salvarea materialului:", error);
      toast.error("A apărut o eroare la salvare. Încearcă din nou.");
      return;
    }

    toast.success("Materialul a fost trimis cu succes! 💫");

    // reset form
    setCategory("");
    setTotemId("");
    setTitle("");
    setArtistName("");
    setArtistEmail("");
    setSnippet("");
    setFullText("");
    setMediaUrl("");
  };

  return (
    <div className="min-h-screen text-foreground">
      <main className="container max-w-2xl mx-auto px-4 py-8 space-y-8">
        {/* back link */}
        <NavLink
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          ← Înapoi la pagina principală
        </NavLink>

        {/* header */}
        <section className="rounded-2xl bg-gradient-to-br from-accent/40 to-secondary/60 p-6 space-y-3">
          <h1 className="text-2xl md:text-3xl font-bold leading-tight">
            Contribuie cu un material artistic
          </h1>
          <p className="text-sm md:text-base text-foreground/80">
            Completează detaliile operei tale și le vom lega de unul dintre
            totemurile culturale din Timișoara. Ulterior, acest material va
            putea fi accesat prin cod QR în stație.
          </p>
          <p className="text-xs text-foreground/70">
            Poți trimite literatură, poezie, muzică sau artă vizuală. Deocamdată,
            te rugăm să adaugi manual link-ul către fișierul audio / imagine / video.
          </p>
        </section>

        {/* form */}
        <section className="rounded-2xl border border-border/60 bg-card p-6">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* totem + categorie */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Totem / Stație</Label>
                <Select
                  value={totemId}
                  onValueChange={(value) => setTotemId(value)}
                  disabled={loadingTotems}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        loadingTotems ? "Se încarcă stațiile..." : "Alege stația"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {totems.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Categorie</Label>
                <Select
                  value={category}
                  onValueChange={(value: ContentCategory) => setCategory(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Alege categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORY_LABELS.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* titlu */}
            <div className="space-y-1.5">
              <Label htmlFor="title">Titlu</Label>
              <Input
                id="title"
                placeholder="Titlul operei tale"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* nume + email */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="artistName">Nume artist</Label>
                <Input
                  id="artistName"
                  placeholder="Numele tău (opțional)"
                  value={artistName}
                  onChange={(e) => setArtistName(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="artistEmail">Email</Label>
                <Input
                  id="artistEmail"
                  type="email"
                  placeholder="Email pentru contact (opțional)"
                  value={artistEmail}
                  onChange={(e) => setArtistEmail(e.target.value)}
                />
              </div>
            </div>

            {/* snippet */}
            <div className="space-y-1.5">
              <Label htmlFor="snippet">Descriere scurtă</Label>
              <Textarea
                id="snippet"
                placeholder="Un scurt context sau descriere pentru cei care scanează codul..."
                value={snippet}
                onChange={(e) => setSnippet(e.target.value)}
              />
            </div>

            {/* full text (mai ales pentru literatură / poezie) */}
            <div className="space-y-1.5">
              <Label htmlFor="fullText">Text complet</Label>
              <Textarea
                id="fullText"
                placeholder="Textul integral (pentru literatură / poezie) sau descriere extinsă."
                value={fullText}
                onChange={(e) => setFullText(e.target.value)}
                className="min-h-[160px]"
              />
            </div>

            {/* media URL */}
            <div className="space-y-1.5">
              <Label htmlFor="mediaUrl">Link media (audio / imagine / video)</Label>
              <Input
                id="mediaUrl"
                placeholder="https://..."
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
              />
              <p className="text-[11px] text-muted-foreground">
                De exemplu: link către un fișier audio (mp3), o imagine (jpg/png/webp), 
                un video sau o pagină externă. Pentru imagini și audio, pagina materialului
                va încerca să le afișeze direct.
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <Button type="submit" disabled={submitting || loadingTotems} className="gap-2">
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Se trimite...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Trimite materialul
                  </>
                )}
              </Button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
};

export default SubmitArt;
