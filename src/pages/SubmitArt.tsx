import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const SubmitArt = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    artistName: "",
    email: "",
    bio: "",
    category: "",
    title: "",
    description: "",
    termsAccepted: false,
  });
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.termsAccepted) {
      toast({
        title: "Termeni neacceptați",
        description: "Trebuie să accepți termenii și condițiile.",
        variant: "destructive",
      });
      return;
    }

    if (!file) {
      toast({
        title: "Fișier lipsă",
        description: "Te rugăm să încarci un fișier.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "✅ Mulțumim!",
        description: "Opera ta a fost trimisă cu succes! Vei primi un email în 1-2 zile când va fi aprobată.",
      });
      
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }, 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file size
      const maxSize = {
        image: 10 * 1024 * 1024,
        audio: 20 * 1024 * 1024,
        text: 5 * 1024 * 1024,
      };

      const fileType = selectedFile.type.startsWith("image/") ? "image" 
        : selectedFile.type.startsWith("audio/") ? "audio" 
        : "text";

      if (selectedFile.size > maxSize[fileType]) {
        toast({
          title: "Fișier prea mare",
          description: `Fișierul depășește limita de ${maxSize[fileType] / (1024 * 1024)}MB`,
          variant: "destructive",
        });
        return;
      }

      setFile(selectedFile);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header showBack title="CONTRIBUIE OPERĂ" />
      
      <main className="container max-w-2xl mx-auto px-4 py-6">
        {/* Intro */}
        <div className="bg-accent rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold mb-2">Încântați să te avem!</h2>
          <p className="text-sm text-muted-foreground mb-3">Procesul nostru:</p>
          <div className="flex items-center gap-2 text-sm">
            <span>1️⃣ Completezi</span>
            <span>→</span>
            <span>2️⃣ Moderăm</span>
            <span>→</span>
            <span>3️⃣ Publicăm (1-2 zile)</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Artist Details */}
          <section className="space-y-4">
            <h3 className="text-lg font-bold">DETALII ARTIST</h3>
            
            <div className="space-y-2">
              <Label htmlFor="artistName">Nume complet *</Label>
              <Input
                id="artistName"
                required
                placeholder="Ex: Maria Popescu"
                value={formData.artistName}
                onChange={(e) => setFormData({ ...formData, artistName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="pentru notificări"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio (opțional)</Label>
              <Textarea
                id="bio"
                rows={3}
                maxLength={200}
                placeholder="Câteva cuvinte despre tine (50-200 caractere)"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />
              <p className="text-xs text-muted-foreground text-right">
                {formData.bio.length}/200
              </p>
            </div>
          </section>

          {/* Artwork Details */}
          <section className="space-y-4">
            <h3 className="text-lg font-bold">DETALII OPERĂ</h3>
            
            <div className="space-y-2">
              <Label htmlFor="category">Categorie *</Label>
              <Select
                required
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Selectează categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="literatura">📖 Literatură</SelectItem>
                  <SelectItem value="poezie">✍️ Poezie</SelectItem>
                  <SelectItem value="muzica">🎵 Muzică</SelectItem>
                  <SelectItem value="arte">🎨 Arte Vizuale</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Titlu operă *</Label>
              <Input
                id="title"
                required
                placeholder="Titlul operei tale"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descriere (opțional)</Label>
              <Textarea
                id="description"
                rows={3}
                maxLength={300}
                placeholder="Context sau inspirație (opțional)"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <p className="text-xs text-muted-foreground text-right">
                {formData.description.length}/300
              </p>
            </div>
          </section>

          {/* File Upload */}
          <section className="space-y-4">
            <h3 className="text-lg font-bold">FIȘIER OPERĂ</h3>
            
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary transition-colors">
              <input
                type="file"
                id="file"
                className="hidden"
                accept=".jpg,.jpeg,.png,.webp,.mp3,.m4a,.txt,.doc,.docx"
                onChange={handleFileChange}
              />
              <Label htmlFor="file" className="cursor-pointer">
                <Upload className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                {file ? (
                  <div className="space-y-1">
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    Drag & drop sau tap pentru selectare
                  </p>
                )}
              </Label>
            </div>
            
            <p className="text-xs text-muted-foreground">
              Acceptăm: JPG, PNG, WEBP (max 10MB) | MP3, M4A (max 20MB) | TXT, DOCX (max 5MB)
            </p>
          </section>

          {/* Terms */}
          <div className="flex items-start gap-3">
            <Checkbox
              id="terms"
              checked={formData.termsAccepted}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, termsAccepted: checked as boolean })
              }
            />
            <Label htmlFor="terms" className="text-sm cursor-pointer">
              Accept termenii și condițiile
            </Label>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full h-14 text-base font-bold uppercase"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Se trimite..." : "TRIMITE SPRE APROBARE"}
          </Button>
        </form>
      </main>
    </div>
  );
};

export default SubmitArt;
