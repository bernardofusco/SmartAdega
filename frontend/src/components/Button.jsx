export default function Button({ children, variant = "primary", ...props }) {
  const base =
    "px-4 py-2 h-11 rounded-md font-inter font-medium transition-all";

  const variants = {
    primary:
      "bg-wine-700 text-white hover:bg-wine-500",
    secondary:
      "border border-wine-700 text-wine-700 bg-transparent hover:bg-wine-700 hover:text-white",
    premium:
      "bg-gold-600 text-text-main hover:brightness-110",
  };

  return (
    <button className={`${base} ${variants[variant]}`} {...props}>
      {children}
    </button>
  );
}
