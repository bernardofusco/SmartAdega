export default function Button({ children, variant = "primary", ...props }) {
  const base =
    "px-4 py-2 h-11 rounded-md font-inter font-medium transition-all";

  const variants = {
    primary:
      "bg-wine-700 text-white hover:bg-wine-500 dark:bg-dark-wine-primary dark:hover:bg-dark-wine-secondary",
    secondary:
      "border border-wine-700 text-wine-700 bg-transparent hover:bg-wine-700 hover:text-white dark:border-dark-wine-primary dark:text-dark-wine-text dark:hover:bg-dark-wine-primary dark:hover:text-white",
    premium:
      "bg-gold-600 text-text-main hover:brightness-110 dark:bg-dark-gold-primary dark:text-dark-text-primary",
  };

  return (
    <button className={`${base} ${variants[variant]}`} {...props}>
      {children}
    </button>
  );
}
