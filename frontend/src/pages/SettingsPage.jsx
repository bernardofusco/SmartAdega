import { useState } from 'react'
import { useUserStore } from '../stores/userStore'
import { useToastStore } from '../stores/toastStore'

const SettingsPage = () => {
  const { userId, setUserId } = useUserStore()
  const addToast = useToastStore((state) => state.addToast)
  const [inputValue, setInputValue] = useState(userId || '')

  const handleSave = () => {
    if (!inputValue.trim()) {
      addToast('ID de usuario nao pode estar vazio', 'error')
      return
    }
    setUserId(inputValue.trim())
    addToast('Configuracoes salvas com sucesso!', 'success')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-neutral-900 mb-2">
        Configuracoes
      </h1>
      <p className="text-neutral-600 mb-8">
        Gerencie as configuracoes da sua conta
      </p>

      <div className="card p-6">
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">
          Identificacao de Usuario
        </h2>
        
        <div className="mb-4">
          <label htmlFor="userId" className="label">
            ID do Usuario
          </label>
          <input
            id="userId"
            type="text"
            className="input"
            placeholder="Digite seu ID de usuario"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <p className="text-sm text-neutral-500 mt-2">
            Este ID e usado para identificar seus vinhos na API
          </p>
        </div>

        <button onClick={handleSave} className="btn-primary">
          Salvar Configuracoes
        </button>
      </div>

      <div className="card p-6 mt-6">
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">
          Sobre o SmartAdega
        </h2>
        <p className="text-neutral-600 mb-2">
          Versao: 1.0.0
        </p>
        <p className="text-neutral-600">
          Sistema de gerenciamento de colecao de vinhos
        </p>
      </div>
    </div>
  )
}

export default SettingsPage

