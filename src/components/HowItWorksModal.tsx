import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { QrCode, Search, Heart } from "lucide-react";

interface HowItWorksModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const HowItWorksModal = ({ open, onOpenChange }: HowItWorksModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Cum funcționează?
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="flex gap-4 items-start">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <QrCode className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">1. Scanează QR</h3>
              <p className="text-sm text-muted-foreground">
                Găsește un cod QR în stațiile de transport și scanează-l cu camera telefonului
              </p>
            </div>
          </div>
          
          <div className="flex gap-4 items-start">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Search className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">2. Descoperă</h3>
              <p className="text-sm text-muted-foreground">
                Explorează literatură, poezie, muzică și artă vizuală de la artiști locali
              </p>
            </div>
          </div>
          
          <div className="flex gap-4 items-start">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Heart className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">3. Bucură-te</h3>
              <p className="text-sm text-muted-foreground">
                Citește, ascultă și privește opere culturale în timpul așteptării
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HowItWorksModal;
