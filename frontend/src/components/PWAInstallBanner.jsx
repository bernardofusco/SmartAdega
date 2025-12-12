import { useState, useEffect } from 'react'
import { usePWAInstall } from '../hooks/usePWAInstall'

/**
 * Banner de instalação do PWA
 * Aparece sempre que o usuário acessar via mobile (não instalado)
 * Suporta Android (prompt nativo) e iOS (instruções manuais)
 */
export function PWAInstallBanner() {
  const { showInstallPrompt, isIOS, installPWA, dismissPrompt } = usePWAInstall()
  const [isVisible, setIsVisible] = useState(false)
  const [isInstalling, setIsInstalling] = useState(false)
  const [showIOSInstructions, setShowIOSInstructions] = useState(false)

  // Animação de entrada (slide up)
  useEffect(() => {
    if (showInstallPrompt) {
      // Pequeno delay para animação
      const timer = setTimeout(() => setIsVisible(true), 300)
      return () => clearTimeout(timer)
    }
  }, [showInstallPrompt])

  // Não renderiza se não deve mostrar
  if (!showInstallPrompt) {
    return null
  }

  /**
   * Handle do clique no botão instalar
   */
  const handleInstall = async () => {
    if (isIOS) {
      // Para iOS, mostra instruções
      setShowIOSInstructions(true)
    } else {
      // Para Android/Chrome, instala diretamente
      setIsInstalling(true)
      try {
        const result = await installPWA()
        if (result.outcome === 'accepted') {
          setIsVisible(false)
        }
      } finally {
        setIsInstalling(false)
      }
    }
  }

  /**
   * Handle do clique em "Agora não"
   */
  const handleDismiss = () => {
    setIsVisible(false)
    setTimeout(() => {
      dismissPrompt()
    }, 300) // Aguarda animação de saída
  }

  /**
   * Fecha instruções do iOS
   */
  const closeIOSInstructions = () => {
    setShowIOSInstructions(false)
    handleDismiss()
  }

  return (
    <>
      {/* Banner Principal */}
      <div
        className={`
          fixed bottom-0 left-0 right-0 z-50 
          transform transition-transform duration-300 ease-out
          ${isVisible ? 'translate-y-0' : 'translate-y-full'}
        `}
      >
        <div className="bg-gradient-to-r from-[#8d1d45] to-[#6d1535] text-white shadow-2xl">
          {/* Container do conteúdo */}
          <div className="max-w-md mx-auto px-4 py-4">
            <div className="flex items-start gap-3">
              {/* Ícone do app */}
              <div className="flex-shrink-0 mt-1">
                <div className="w-12 h-12 bg-white rounded-xl p-1.5 shadow-lg">
                  <img 
                    src="/icons/icon-192.png" 
                    alt="SmartAdega" 
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>
              </div>

              {/* Conteúdo */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base mb-1">
                  Instalar SmartAdega
                </h3>
                <p className="text-sm text-white/90 leading-snug mb-3">
                  Acesso rápido à sua adega, mesmo offline!
                </p>

                {/* Botões de ação */}
                <div className="flex gap-2">
                  <button
                    onClick={handleInstall}
                    disabled={isInstalling}
                    className="
                      flex-1 bg-white text-[#8d1d45] font-semibold 
                      px-4 py-2.5 rounded-lg text-sm
                      hover:bg-white/95 active:bg-white/90
                      transition-colors duration-200
                      disabled:opacity-50 disabled:cursor-not-allowed
                      shadow-md
                    "
                  >
                    {isInstalling ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle 
                            className="opacity-25" 
                            cx="12" 
                            cy="12" 
                            r="10" 
                            stroke="currentColor" 
                            strokeWidth="4"
                            fill="none"
                          />
                          <path 
                            className="opacity-75" 
                            fill="currentColor" 
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Instalando...
                      </span>
                    ) : isIOS ? (
                      '📱 Ver instruções'
                    ) : (
                      '⚡ Instalar agora'
                    )}
                  </button>

                  <button
                    onClick={handleDismiss}
                    className="
                      px-4 py-2.5 rounded-lg text-sm font-medium
                      text-white/90 hover:text-white
                      hover:bg-white/10 active:bg-white/20
                      transition-colors duration-200
                    "
                  >
                    Agora não
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Instruções iOS */}
      {showIOSInstructions && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4"
          onClick={closeIOSInstructions}
        >
          <div 
            className="bg-white rounded-t-2xl sm:rounded-2xl max-w-md w-full p-6 shadow-2xl animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                Como instalar no iOS
              </h3>
              <button
                onClick={closeIOSInstructions}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Instruções passo a passo */}
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-[#8d1d45] text-white rounded-full flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <p className="text-gray-700">
                    Toque no botão <strong>Compartilhar</strong> 
                    <svg className="inline w-5 h-5 mx-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
                    </svg>
                    na barra inferior do Safari
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-[#8d1d45] text-white rounded-full flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div>
                  <p className="text-gray-700">
                    Role para baixo e selecione <strong>"Adicionar à Tela de Início"</strong>
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-[#8d1d45] text-white rounded-full flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div>
                  <p className="text-gray-700">
                    Toque em <strong>"Adicionar"</strong> no canto superior direito
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  💡 <strong>Dica:</strong> Após instalar, o app abrirá em tela cheia como um app nativo!
                </p>
              </div>
            </div>

            {/* Botão de fechar */}
            <button
              onClick={closeIOSInstructions}
              className="
                w-full mt-6 bg-[#8d1d45] text-white font-semibold
                px-6 py-3 rounded-lg
                hover:bg-[#6d1535] active:bg-[#5d1125]
                transition-colors duration-200
              "
            >
              Entendi
            </button>
          </div>
        </div>
      )}
    </>
  )
}
