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
        relative content-card card-interactive p-6 aspect-square
        flex flex-col items-center justify-center gap-3
        border-2 hover:border-current transition-colors
        ${colorClass}
      `}
    >
      <span className="text-5xl" role="img" aria-label={name}>
        {icon}
      </span>
      <h3 className="text-lg font-bold text-center text-foreground">{name}</h3>
      <span className="absolute top-3 right-3 text-xs bg-secondary px-2 py-1 rounded-full text-muted-foreground">
        {count} opere
      </span>
    </NavLink>
  );
};

export default CategoryCard;
