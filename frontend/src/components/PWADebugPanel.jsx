import { usePWAInstall } from '../hooks/usePWAInstall'

/**
 * Componente de debug para testar instalação PWA
 * Apenas para desenvolvimento - remover ou comentar em produção
 */
export function PWADebugPanel() {
  const { 
    showInstallPrompt, 
    isIOS, 
    isStandalone,
    canInstall,
    installPWA, 
    resetInstallPrompt 
  } = usePWAInstall()

  // Não mostrar em produção
  if (import.meta.env.PROD) {
    return null
  }

  return (
    <div className="fixed bottom-20 right-4 z-[60] max-w-xs">
      <div className="bg-gray-900 text-white rounded-lg shadow-2xl p-4 text-xs">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm">🔧 PWA Debug</h3>
          <span className="text-green-400 text-[10px]">DEV ONLY</span>
        </div>

        {/* Status */}
        <div className="space-y-2 mb-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Prompt visível:</span>
            <span className={showInstallPrompt ? 'text-green-400' : 'text-red-400'}>
              {showInstallPrompt ? '✓ Sim' : '✗ Não'}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Plataforma:</span>
            <span className="text-blue-400">
              {isIOS ? '🍎 iOS' : '🤖 Android/Other'}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-400">Standalone:</span>
            <span className={isStandalone ? 'text-green-400' : 'text-gray-500'}>
              {isStandalone ? '✓ Instalado' : '✗ Navegador'}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-400">Pode instalar:</span>
            <span className={canInstall ? 'text-green-400' : 'text-gray-500'}>
              {canInstall ? '✓ Sim' : '✗ Não'}
            </span>
          </div>
        </div>

        {/* LocalStorage Info */}
        <div className="border-t border-gray-700 pt-3 mb-3">
          <div className="text-gray-400 mb-2 font-semibold">LocalStorage:</div>
          <div className="space-y-1 text-[10px]">
            <div>
              Installed: {localStorage.getItem('pwa_installed') || '❌'}
            </div>
            <div className="text-gray-500 mt-2">
              (Sem controle de "shown" - sempre exibe)
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="space-y-2">
          <button
            onClick={resetInstallPrompt}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-3 rounded text-xs transition-colors"
          >
            🔄 Resetar Flags
          </button>

          {canInstall && !isIOS && (
            <button
              onClick={installPWA}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-3 rounded text-xs transition-colors"
            >
              📲 Forçar Install
            </button>
          )}
        </div>

        {/* Instruções */}
        <div className="mt-3 pt-3 border-t border-gray-700 text-[10px] text-gray-400">
          <p className="mb-1"><strong>Nova lógica:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li>Banner aparece sempre em mobile</li>
            <li>Fechar → reaparece no reload</li>
            <li>Só oculta se instalar ou standalone</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
