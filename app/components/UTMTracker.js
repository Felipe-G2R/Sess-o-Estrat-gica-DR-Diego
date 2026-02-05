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

    // Lista das UTMs
    const utms = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']

    // Captura e armazena UTMs
    utms.forEach((utm) => {
      const value = getParameterByName(utm)
      if (value) {
        localStorage.setItem(utm, value)
      }

      // Preenche campos ocultos se existirem
      const input = document.querySelector(`input[name='${utm}']`)
      if (input) {
        input.value = localStorage.getItem(utm) || ''
      }
    })

    // Também preenche campos de formulários carregados dinamicamente
    const observer = new MutationObserver(() => {
      utms.forEach((utm) => {
        const input = document.querySelector(`input[name='${utm}']`)
        if (input && !input.value) {
          input.value = localStorage.getItem(utm) || ''
        }
      })
    })

    observer.observe(document.body, { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [])

  return null
}
