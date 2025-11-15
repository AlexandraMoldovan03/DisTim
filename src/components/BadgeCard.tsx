import { Badge } from "@/lib/passportStorage";
import { Calendar, MapPin, User } from "lucide-react";

interface BadgeCardProps {
  badge: Badge;
}

const BadgeCard = ({ badge }: BadgeCardProps) => {
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "literatură":
        return "bg-[hsl(188,35%,32%)] text-white";
      case "poezie":
        return "bg-[hsl(176,30%,45%)] text-white";
      case "muzică":
        return "bg-[hsl(47,88%,70%)] text-foreground";
      case "arte vizuale":
        return "bg-[hsl(47,88%,84%)] text-foreground";
      default:
        return "bg-primary text-primary-foreground";
    }
  };

  return (
    <div className="content-card card-interactive p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(badge.category)}`}>
          {badge.category}
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="w-3 h-3" />
          {new Date(badge.collectedAt).toLocaleDateString("ro-RO")}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span className="font-medium">{badge.locationName}</span>
        </div>

        <div className="pt-2 border-t border-border">
          <div className="flex items-center gap-2 mb-2">
            <User className="w-4 h-4 text-primary" />
            <span className="font-bold text-foreground">{badge.artistName}</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {badge.artistBio}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BadgeCard;