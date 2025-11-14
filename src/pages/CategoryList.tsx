import { useParams, NavLink } from "react-router-dom";
import Header from "@/components/Header";
import { Clock, Heart } from "lucide-react";

// Mock data - will be replaced with actual data later
const MOCK_CONTENT = {
  literatura: [
    {
      id: "lit-001",
      title: "Amintiri din Timișoara Veche",
      artist: "Ion Popescu",
      thumbnail: null,
      readingTime: 3,
      favorites: 24,
    },
    {
      id: "lit-002",
      title: "Scrisoare către orașul meu",
      artist: "Maria Ionescu",
      thumbnail: null,
      readingTime: 5,
      favorites: 12,
    },
  ],
  poezie: [
    {
      id: "poe-001",
      title: "Bega în Amurg",
      artist: "Ana Moldovan",
      thumbnail: null,
      readingTime: 2,
      favorites: 18,
    },
  ],
  muzica: [],
  arte: [
    {
      id: "art-001",
      title: "Timișoara în Culori",
      artist: "Andra Mureșan",
      thumbnail: null,
      favorites: 31,
    },
  ],
};

const CATEGORY_INFO = {
  literatura: { name: "LITERATURĂ", colorClass: "border-literatura", icon: "📖" },
  poezie: { name: "POEZIE", colorClass: "border-poezie", icon: "✍️" },
  muzica: { name: "MUZICĂ", colorClass: "border-muzica", icon: "🎵" },
  arte: { name: "ARTE VIZUALE", colorClass: "border-arte", icon: "🎨" },
};

const CategoryList = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const category = categoryId && CATEGORY_INFO[categoryId as keyof typeof CATEGORY_INFO];
  const content = categoryId && MOCK_CONTENT[categoryId as keyof typeof MOCK_CONTENT];

  if (!category || !content) {
    return <div>Categorie negăsită</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header showBack title={category.name} />
      
      <main className="container max-w-2xl mx-auto px-4 py-6">
        {content.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-6xl mb-4 block">{category.icon}</span>
            <h2 className="text-xl font-semibold mb-2">În curând</h2>
            <p className="text-muted-foreground mb-6">
              Nu există încă opere în această categorie. Revino curând sau contribuie tu!
            </p>
            <NavLink
              to="/submit"
              className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              Contribuie operă
            </NavLink>
          </div>
        ) : (
          <div className="space-y-4">
            {content.map((item) => (
              <NavLink
                key={item.id}
                to={`/content/${item.id}`}
                className={`
                  block content-card card-interactive p-4 border-l-4 ${category.colorClass}
                `}
              >
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-secondary rounded-lg flex items-center justify-center text-3xl flex-shrink-0">
                    {category.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg mb-1 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      de {item.artist}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {"readingTime" in item && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {item.readingTime} min citire
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3 fill-current text-primary" />
                        {item.favorites}
                      </span>
                    </div>
                  </div>
                </div>
              </NavLink>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CategoryList;
