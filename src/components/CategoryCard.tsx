import { NavLink } from "react-router-dom";

interface CategoryCardProps {
  id: string;
  name: string;
  icon: string;
  count: number;
  colorClass: string;
}

const CategoryCard = ({ id, name, icon, count, colorClass }: CategoryCardProps) => {
  return (
    <NavLink
      to={`/category/${id}`}
      className={`
        relative content-card p-8 aspect-square
        flex flex-col items-center justify-center gap-4
        border border-border/50 hover:border-primary/50
        transition-all duration-300 hover:shadow-xl hover:-translate-y-1
        bg-card/80 backdrop-blur-sm
        group
      `}
    >
      <span className="text-6xl transition-transform duration-300 group-hover:scale-110" role="img" aria-label={name}>
        {icon}
      </span>
      <h3 className="text-lg font-bold text-center text-foreground">{name}</h3>
      <span className="absolute top-4 right-4 text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full font-medium">
        {count}
      </span>
    </NavLink>
  );
};

export default CategoryCard;
