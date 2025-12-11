export default function Input({ label, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-text-muted text-sm font-inter">{label}</label>
      )}

      <input
        className="
          bg-base-surface border border-gold-300 rounded-md h-11 px-3
          focus:outline-none focus:border-wine-700
          focus:ring-2 focus:ring-wine-700/20
          font-inter
        "
        {...props}
      />
    </div>
  );
}
