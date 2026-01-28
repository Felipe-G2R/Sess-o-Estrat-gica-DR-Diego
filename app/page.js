'use client'

import { useEffect, useState, useRef } from 'react'

export default function Home() {
  const [html, setHtml] = useState('')
  const containerRef = useRef(null)
  const initialized = useRef(false)

  useEffect(() => {
    fetch('/content.html')
      .then(res => res.text())
      .then(data => {
        const bodyMatch = data.match(/<body[^>]*>([\s\S]*)<\/body>/i)
        if (bodyMatch) {
          setHtml(bodyMatch[1])
        } else {
          setHtml(data)
        }
      })
  }, [])

  useEffect(() => {
    if (html && containerRef.current && !initialized.current) {
      initialized.current = true

      // Carregar script do formulário LeadConnector
      const formScript = document.createElement('script')
      formScript.src = 'https://link.msgsndr.com/js/form_embed.js'
      formScript.async = true
      document.body.appendChild(formScript)

      // Configurar botões para abrir o modal
      setTimeout(() => {
        const buttons = document.querySelectorAll('a.elementor-button')
        const formModal = document.getElementById('formModal')

        if (formModal) {
          buttons.forEach(btn => {
            btn.onclick = function(e) {
              e.preventDefault()
              e.stopPropagation()
              formModal.style.display = 'block'
              return false
            }
          })

          formModal.onclick = function(e) {
            if (e.target === formModal) {
              formModal.style.display = 'none'
            }
          }
        }
      }, 500)
    }
  }, [html])

  return (
    <div ref={containerRef} dangerouslySetInnerHTML={{ __html: html }} />
  )
}
