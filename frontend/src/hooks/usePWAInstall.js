import { useState, useEffect } from 'react'

/**
 * Hook customizado para gerenciar instalação de PWA
 * 
 * Funcionalidades:
 * - Detecta dispositivos móveis
 * - Captura evento beforeinstallprompt
 * - Exibe banner sempre que acessar via mobile (sem restrição de primeira visita)
 * - Suporta Android (prompt nativo) e iOS (instruções)
 * - Não exibe se app já está instalado (standalone mode)
 */
export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  // Chave do localStorage apenas para detectar instalação
  const STORAGE_INSTALLED_KEY = 'pwa_installed'

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
   * Agora aparece sempre em mobile, exceto se já instalado
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

    // Mostrar em todos os outros casos (sempre em mobile)
    return true
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
      }
    }

    // Detecta iOS
    setIsIOS(isIOSDevice())
    
    // Detecta standalone mode
    setIsStandalone(isInStandaloneMode())

    // Para iOS, mostra diretamente se deve
    if (isIOSDevice() && shouldShowPrompt()) {
      setShowInstallPrompt(true)
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
   * Banner reaparecerá no próximo reload/acesso
   */
  const dismissPrompt = () => {
    console.log('❌ Usuário fechou o prompt de instalação')
    setShowInstallPrompt(false)
  }

  /**
   * Reseta flags (útil para testes)
   */
  const resetInstallPrompt = () => {
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
