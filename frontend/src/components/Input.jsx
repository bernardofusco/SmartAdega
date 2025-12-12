export default function Input({ label, id, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-text-muted dark:text-dark-text-muted text-sm font-inter">{label}</label>
      )}

      <input
        id={id}
        className="
          bg-base-surface dark:bg-dark-surface-secondary
          border border-gold-300 dark:border-dark-surface-border
          rounded-md h-11 px-3
          text-text-main dark:text-dark-text-primary
          placeholder:text-text-muted dark:placeholder:text-dark-text-muted
          focus:outline-none focus:border-wine-700 dark:focus:border-dark-wine-primary
          focus:ring-2 focus:ring-wine-700/20 dark:focus:ring-dark-wine-primary/30
          font-inter
          transition-colors
        "
        {...props}
      />
    </div>
  );
}
