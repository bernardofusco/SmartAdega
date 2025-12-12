import { useState, useEffect } from 'react'

/**
 * Hook customizado para gerenciar instalação de PWA
 * 
 * Funcionalidades:
 * - Detecta dispositivos móveis
 * - Captura evento beforeinstallprompt
 * - Controla exibição do prompt (apenas primeira visita)
 * - Persiste estado no localStorage
 * - Suporta Android (prompt nativo) e iOS (instruções)
 */
export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  // Chaves do localStorage
  const STORAGE_KEY = 'pwa_install_prompt_shown'
  const STORAGE_DISMISSED_KEY = 'pwa_install_prompt_dismissed_at'
  const STORAGE_INSTALLED_KEY = 'pwa_installed'

  // Número de dias para reexibir após dismissal (0 = nunca mais)
  const DAYS_TO_RESHOW = 0

  /**
   * Detecta se é dispositivo móvel
   */
  const isMobileDevice = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera
    
    // Check comum para mobile
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
    if (mobileRegex.test(userAgent)) {
      return true
    }

    // Check adicional para tablets
    if ('maxTouchPoints' in navigator && navigator.maxTouchPoints > 2) {
      return true
    }

    // Check por media query
    if (window.matchMedia('(max-width: 768px)').matches) {
      return true
    }

    return false
  }

  /**
   * Detecta se é iOS
   */
  const isIOSDevice = () => {
    const userAgent = window.navigator.userAgent.toLowerCase()
    return /iphone|ipad|ipod/.test(userAgent)
  }

  /**
   * Detecta se app já está instalado (modo standalone)
   */
  const isInStandaloneMode = () => {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true ||
      document.referrer.includes('android-app://')
    )
  }

  /**
   * Verifica se deve mostrar o prompt
   */
  const shouldShowPrompt = () => {
    // Não mostrar em desktop
    if (!isMobileDevice()) {
      return false
    }

    // Não mostrar se já está instalado
    if (isInStandaloneMode()) {
      return false
    }

    // Não mostrar se usuário já instalou antes
    if (localStorage.getItem(STORAGE_INSTALLED_KEY) === 'true') {
      return false
    }

    // Verificar se já foi mostrado antes
    const wasShown = localStorage.getItem(STORAGE_KEY)
    if (!wasShown) {
      return true // Primeira visita
    }

    // Se foi dismissed, verificar se deve reexibir
    const dismissedAt = localStorage.getItem(STORAGE_DISMISSED_KEY)
    if (dismissedAt && DAYS_TO_RESHOW > 0) {
      const dismissedDate = new Date(parseInt(dismissedAt, 10))
      const daysSince = (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24)
      
      if (daysSince >= DAYS_TO_RESHOW) {
        return true // Tempo passou, pode reexibir
      }
    }

    return false // Já foi mostrado e não deve reexibir
  }

  /**
   * Captura o evento beforeinstallprompt
   */
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Previne prompt automático do navegador
      e.preventDefault()
      
      // Salva o evento para uso posterior
      setDeferredPrompt(e)
      
      console.log('✅ PWA: beforeinstallprompt capturado')

      // Verifica se deve mostrar o prompt
      if (shouldShowPrompt()) {
        setShowInstallPrompt(true)
        // Marca que foi mostrado
        localStorage.setItem(STORAGE_KEY, 'true')
      }
    }

    // Detecta iOS
    setIsIOS(isIOSDevice())
    
    // Detecta standalone mode
    setIsStandalone(isInStandaloneMode())

    // Para iOS, mostra diretamente se deve
    if (isIOSDevice() && shouldShowPrompt()) {
      setShowInstallPrompt(true)
      localStorage.setItem(STORAGE_KEY, 'true')
    }

    // Adiciona listener para Android/Chrome
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Listener para detectar se foi instalado
    window.addEventListener('appinstalled', () => {
      console.log('✅ PWA instalado com sucesso!')
      localStorage.setItem(STORAGE_INSTALLED_KEY, 'true')
      setShowInstallPrompt(false)
      setDeferredPrompt(null)
    })

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  /**
   * Instala o PWA (Android/Chrome)
   */
  const installPWA = async () => {
    if (!deferredPrompt) {
      console.warn('⚠️ PWA: Prompt não disponível')
      return { outcome: 'unavailable' }
    }

    try {
      // Mostra o prompt nativo
      await deferredPrompt.prompt()
      
      // Aguarda escolha do usuário
      const choiceResult = await deferredPrompt.userChoice
      
      console.log(`👤 Usuário ${choiceResult.outcome === 'accepted' ? 'aceitou' : 'recusou'} instalar`)

      if (choiceResult.outcome === 'accepted') {
        localStorage.setItem(STORAGE_INSTALLED_KEY, 'true')
      }

      // Limpa o prompt
      setDeferredPrompt(null)
      setShowInstallPrompt(false)

      return choiceResult
    } catch (error) {
      console.error('❌ Erro ao instalar PWA:', error)
      return { outcome: 'error', error }
    }
  }

  /**
   * Fecha o prompt sem instalar
   */
  const dismissPrompt = () => {
    console.log('❌ Usuário fechou o prompt de instalação')
    
    // Marca timestamp do dismissal
    localStorage.setItem(STORAGE_DISMISSED_KEY, Date.now().toString())
    
    setShowInstallPrompt(false)
  }

  /**
   * Reseta flags (útil para testes)
   */
  const resetInstallPrompt = () => {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(STORAGE_DISMISSED_KEY)
    localStorage.removeItem(STORAGE_INSTALLED_KEY)
    setShowInstallPrompt(shouldShowPrompt())
  }

  return {
    // Estados
    showInstallPrompt,
    isIOS,
    isStandalone,
    canInstall: !!deferredPrompt || isIOS,
    
    // Ações
    installPWA,
    dismissPrompt,
    resetInstallPrompt, // Apenas para debug/testes
  }
}
