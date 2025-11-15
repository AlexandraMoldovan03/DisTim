import { Dialog } from "@headlessui/react";
import { Button } from "./ui/button";
import { X } from "lucide-react";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LoginModal = ({ open, onOpenChange }: LoginModalProps) => {
  return (
    <Dialog open={open} onClose={() => onOpenChange(false)} className="relative z-50">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />

      {/* Centered modal */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-2xl bg-card p-6 shadow-lg border border-border">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-bold text-foreground">Login</Dialog.Title>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-5 w-5 text-foreground" />
            </Button>
          </div>

          {/* Form */}
          <form className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Username"
              className="border border-border rounded-md p-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="password"
              placeholder="Password"
              className="border border-border rounded-md p-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button type="submit" className="w-full mt-2">Login</Button>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default LoginModal;
