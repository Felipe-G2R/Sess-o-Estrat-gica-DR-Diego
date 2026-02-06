'use client'

import { useEffect } from 'react'

export default function UTMTracker() {
  useEffect(() => {
    // Função para extrair parâmetros da URL
    function getParameterByName(name) {
      const url = window.location.href
      const escapedName = name.replace(/[[\]]/g, '\\$&')
      const regex = new RegExp('[?&]' + escapedName + '(=([^&#]*)|&|#|$)')
      const results = regex.exec(url)
      if (!results) return ''
      if (!results[2]) return ''
      return decodeURIComponent(results[2].replace(/\+/g, ' '))
    }

    // Lista das UTMs + parâmetros HSA do Facebook Ads
    const trackingParams = [
      'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
      'hsa_acc', 'hsa_cam', 'hsa_grp', 'hsa_ad', 'hsa_src', 'hsa_net', 'hsa_ver'
    ]

    // Captura e armazena todos os parâmetros de rastreio
    trackingParams.forEach((param) => {
      const value = getParameterByName(param)
      if (value) {
        localStorage.setItem(param, value)
      }

      // Preenche campos ocultos se existirem
      const input = document.querySelector(`input[name='${param}']`)
      if (input) {
        input.value = localStorage.getItem(param) || ''
      }
    })

    // Também preenche campos de formulários carregados dinamicamente
    const observer = new MutationObserver(() => {
      trackingParams.forEach((param) => {
        const input = document.querySelector(`input[name='${param}']`)
        if (input && !input.value) {
          input.value = localStorage.getItem(param) || ''
        }
      })
    })

    observer.observe(document.body, { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [])

  return null
}
