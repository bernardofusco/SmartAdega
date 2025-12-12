import { useAuthStore } from '../stores/authStore'

const SettingsPage = () => {
  const user = useAuthStore((state) => state.user)

  return (
    <div>
      <h1 className="font-poppins text-2xl text-wine-700 dark:text-dark-wine-primary mb-6">
        Configurações
      </h1>

      <div className="bg-white dark:bg-dark-surface-primary shadow-soft dark:shadow-dark-card rounded-lg p-6 mb-4 dark:border dark:border-dark-surface-border">
        <h2 className="font-poppins text-lg text-text-main dark:text-dark-text-primary mb-4">
          Informações da Conta
        </h2>
        
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-dark-text-secondary">
              E-mail
            </label>
            <p className="text-gray-900 dark:text-dark-text-primary">
              {user?.email}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-surface-primary shadow-soft dark:shadow-dark-card rounded-lg p-6 dark:border dark:border-dark-surface-border">
        <h2 className="font-poppins text-lg text-text-main dark:text-dark-text-primary mb-4">
          Sobre o SmartAdega
        </h2>
        <p className="text-text-muted dark:text-dark-text-muted mb-2">
          Versão: 1.0.0
        </p>
        <p className="text-text-muted dark:text-dark-text-muted">
          Sistema de gerenciamento de coleção de vinhos
        </p>
      </div>
    </div>
  )
}

export default SettingsPage

