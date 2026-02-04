'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import LoadingSkeleton from './LoadingSkeleton'

export default function ContentLoader({ onButtonClick }) {
  const [html, setHtml] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const containerRef = useRef(null)
  const initialized = useRef(false)

  useEffect(() => {
    const controller = new AbortController()

    const loadContent = async () => {
      try {
        const res = await fetch('/content.html', {
          signal: controller.signal,
          // Cache the HTML
          cache: 'force-cache'
        })

        if (!res.ok) throw new Error('Failed to load content')

        const data = await res.text()

        // Extract only the body content and clean it
        const bodyMatch = data.match(/<body[^>]*>([\s\S]*)<\/body>/i)
        let content = bodyMatch ? bodyMatch[1] : data

        // Remove browser extension artifacts
        content = content.replace(/<plasmo-csui[\s\S]*?<\/plasmo-csui>/gi, '')
        content = content.replace(/<div[^>]*monica[^>]*>[\s\S]*?<\/div>/gi, '')
        content = content.replace(/<div[^>]*translate="no"[\s\S]*?<\/div>/gi, '')

        // Remove the existing modal and scripts (we handle them in React)
        content = content.replace(/<div id="formModal"[\s\S]*?<\/div>\s*<\/div>/gi, '')
        content = content.replace(/<script[\s\S]*?<\/script>/gi, '')

        setHtml(content)
        setIsLoading(false)
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message)
          setIsLoading(false)
        }
      }
    }

    loadContent()

    return () => controller.abort()
  }, [])

  // Setup button click handlers
  useEffect(() => {
    if (!html || !containerRef.current || initialized.current) return

    initialized.current = true

    // Use event delegation for better performance
    const handleClick = (e) => {
      const button = e.target.closest('a.elementor-button')
      if (button) {
        e.preventDefault()
        e.stopPropagation()
        onButtonClick?.()
      }
    }

    containerRef.current.addEventListener('click', handleClick)

    return () => {
      containerRef.current?.removeEventListener('click', handleClick)
    }
  }, [html, onButtonClick])

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <p>Erro ao carregar o conteúdo.</p>
        <button
          onClick={() => window.location.reload()}
          className="elementor-button"
        >
          Tentar novamente
        </button>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="content-wrapper"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
