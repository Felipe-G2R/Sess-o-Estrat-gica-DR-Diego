'use client'

import { useEffect, useState, useRef } from 'react'

export default function Home() {
  const [html, setHtml] = useState('')
  const containerRef = useRef(null)
  const scriptsLoaded = useRef(false)

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
    if (html && containerRef.current && !scriptsLoaded.current) {
      scriptsLoaded.current = true

      const container = containerRef.current
      const scripts = container.querySelectorAll('script')

      scripts.forEach((oldScript) => {
        const newScript = document.createElement('script')

        Array.from(oldScript.attributes).forEach(attr => {
          newScript.setAttribute(attr.name, attr.value)
        })

        if (oldScript.textContent) {
          newScript.textContent = oldScript.textContent
        }

        if (oldScript.parentNode) {
          oldScript.parentNode.replaceChild(newScript, oldScript)
        } else {
          document.body.appendChild(newScript)
        }
      })

      // Carregar script do formulário LeadConnector
      const formScript = document.createElement('script')
      formScript.src = 'https://link.msgsndr.com/js/form_embed.js'
      formScript.async = true
      document.body.appendChild(formScript)
    }
  }, [html])

  return (
    <div ref={containerRef} dangerouslySetInnerHTML={{ __html: html }} />
  )
}
