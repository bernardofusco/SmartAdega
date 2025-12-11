const WineSortSelect = ({ value, onChange }) => {
  const sortOptions = [
    { value: 'name_asc', label: 'Ordem alfabetica: A-Z' },
    { value: 'name_desc', label: 'Ordem alfabetica: Z-A' },
    { value: 'price_asc', label: 'Preco: menor para maior' },
    { value: 'price_desc', label: 'Preco: maior para menor' },
    { value: 'year_desc', label: 'Safra: mais nova para mais antiga' },
    { value: 'year_asc', label: 'Safra: mais antiga para mais nova' }
  ]

  return (
    <div className="flex items-center gap-3">
      <label htmlFor="sort-select" className="text-sm font-inter text-text-muted whitespace-nowrap">
        Ordenar por:
      </label>
      <select
        id="sort-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 min-w-[200px] px-3 py-2 pr-8 border border-gray-300 rounded-md text-sm font-inter text-text-primary bg-white focus:outline-none focus:ring-2 focus:ring-wine-700 focus:border-transparent transition-all"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default WineSortSelect
