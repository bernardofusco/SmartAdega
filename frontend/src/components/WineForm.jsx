import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const wineSchema = z.object({
  name: z.string().min(1, 'Nome e obrigatorio'),
  grape: z.string().min(1, 'Uva e obrigatoria'),
  region: z.string().min(1, 'Regiao e obrigatoria'),
  year: z.coerce.number().int().min(1900, 'Ano invalido').max(new Date().getFullYear() + 1, 'Ano invalido'),
  price: z.coerce.number().positive('Preco deve ser positivo'),
  rating: z.coerce.number().min(0, 'Rating minimo e 0').max(5, 'Rating maximo e 5'),
  quantity: z.coerce.number().int().min(0, 'Quantidade nao pode ser negativa')
})

const WineForm = ({ wine, onSubmit, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(wineSchema),
    defaultValues: wine || {
      name: '',
      grape: '',
      region: '',
      year: new Date().getFullYear(),
      price: 0,
      rating: 0,
      quantity: 0
    }
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="label">
          Nome do Vinho
        </label>
        <input
          id="name"
          type="text"
          className="input"
          placeholder="Ex: Chateau Margaux"
          {...register('name')}
        />
        {errors.name && (
          <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="grape" className="label">
            Uva
          </label>
          <input
            id="grape"
            type="text"
            className="input"
            placeholder="Ex: Cabernet Sauvignon"
            {...register('grape')}
          />
          {errors.grape && (
            <p className="text-red-600 text-sm mt-1">{errors.grape.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="region" className="label">
            Regiao
          </label>
          <input
            id="region"
            type="text"
            className="input"
            placeholder="Ex: Bordeaux"
            {...register('region')}
          />
          {errors.region && (
            <p className="text-red-600 text-sm mt-1">{errors.region.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="year" className="label">
            Ano
          </label>
          <input
            id="year"
            type="number"
            className="input"
            placeholder="2020"
            {...register('year')}
          />
          {errors.year && (
            <p className="text-red-600 text-sm mt-1">{errors.year.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="price" className="label">
            Preco (R$)
          </label>
          <input
            id="price"
            type="number"
            step="0.01"
            className="input"
            placeholder="199.90"
            {...register('price')}
          />
          {errors.price && (
            <p className="text-red-600 text-sm mt-1">{errors.price.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="quantity" className="label">
            Quantidade
          </label>
          <input
            id="quantity"
            type="number"
            className="input"
            placeholder="6"
            {...register('quantity')}
          />
          {errors.quantity && (
            <p className="text-red-600 text-sm mt-1">{errors.quantity.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="rating" className="label">
          Avaliacao (0 a 5)
        </label>
        <input
          id="rating"
          type="number"
          step="0.1"
          min="0"
          max="5"
          className="input"
          placeholder="4.5"
          {...register('rating')}
        />
        {errors.rating && (
          <p className="text-red-600 text-sm mt-1">{errors.rating.message}</p>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary flex-1"
        >
          {isLoading ? 'Salvando...' : wine ? 'Atualizar' : 'Criar'}
        </button>
      </div>
    </form>
  )
}

export default WineForm

