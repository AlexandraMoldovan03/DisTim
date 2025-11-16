//interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

export const Button: React.FC<ButtonProps> = ({ children, ...props }) => (
  <button
    {...props}
    className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
  >
    {children}
  </button>
);
