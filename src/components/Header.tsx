import { HelpCircle, ArrowLeft } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

interface HeaderProps {
  showBack?: boolean;
  title?: string;
  onHelpClick?: () => void;
}

const Header = ({ showBack = false, title, onHelpClick }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border shadow-sm">
      <div className="container max-w-2xl mx-auto flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-3">
          {showBack ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="hover:bg-secondary"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          ) : null}
          <NavLink to="/" className="text-lg font-bold tracking-tight">
            {title || "Cultura în Transit"}
          </NavLink>
        </div>
        {onHelpClick && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onHelpClick}
            className="hover:bg-secondary"
          >
            <HelpCircle className="h-5 w-5" />
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
