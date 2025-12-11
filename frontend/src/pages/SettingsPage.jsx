import { useState } from 'react'
import { useUserStore } from '../stores/userStore'
import { useToastStore } from '../stores/toastStore'
import Input from '../components/Input'
import Button from '../components/Button'

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
    <div>
      <h1 className="font-poppins text-2xl text-wine-700 dark:text-dark-wine-primary mb-6">
        Configurações
      </h1>

      <div className="bg-white dark:bg-dark-surface-primary shadow-soft dark:shadow-dark-card rounded-lg p-6 mb-4 dark:border dark:border-dark-surface-border">
        <h2 className="font-poppins text-lg text-text-main dark:text-dark-text-primary mb-4">
          Identificacao de Usuario
        </h2>
        
        <div className="mb-4">
          <Input
            label="ID do Usuario"
            type="text"
            placeholder="Digite seu ID de usuario"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <p className="text-sm text-text-muted dark:text-dark-text-muted mt-2">
            Este ID e usado para identificar seus vinhos na API
          </p>
        </div>

        <Button onClick={handleSave} variant="primary">
          Salvar Configuracoes
        </Button>
      </div>

      <div className="bg-white dark:bg-dark-surface-primary shadow-soft dark:shadow-dark-card rounded-lg p-6 dark:border dark:border-dark-surface-border">
        <h2 className="font-poppins text-lg text-text-main dark:text-dark-text-primary mb-4">
          Sobre o SmartAdega
        </h2>
        <p className="text-text-muted dark:text-dark-text-muted mb-2">
          Versao: 1.0.0
        </p>
        <p className="text-text-muted dark:text-dark-text-muted">
          Sistema de gerenciamento de colecao de vinhos
        </p>
      </div>
    </div>
  )
}

export default SettingsPage

