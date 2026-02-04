'use client'

import { useEffect, useRef, useState } from 'react'

export default function FormModal({ isOpen, onClose }) {
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const modalRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      // Focus trap
      modalRef.current?.focus()
    } else {
      document.body.style.overflow = ''
      setIframeLoaded(false)
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div
      className={`modal-overlay ${isOpen ? 'active' : ''}`}
      onClick={handleBackdropClick}
      ref={modalRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal-content">
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Fechar formulário"
        >
          &times;
        </button>

        <div className="form-header-attention">
          <h2 id="modal-title">
            <span className="warning-icon" aria-hidden="true">⚠️</span>
            ATENÇÃO
            <span className="warning-icon" aria-hidden="true">⚠️</span>
          </h2>
        </div>

        <div className="form-subheader">
          <p>
            Complete todo o <strong>FORMULÁRIO</strong> para<br />
            finalizar o agendamento corretamente!
          </p>
        </div>

        {!iframeLoaded && (
          <div
            style={{
              height: '400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#666'
            }}
          >
            Carregando formulário...
          </div>
        )}

        <iframe
          src="https://api.leadconnectorhq.com/widget/form/tQoEPlFkFUlyAvfpAHqZ"
          style={{
            width: '100%',
            height: iframeLoaded ? '1216px' : '0',
            border: 'none',
            borderRadius: '3px',
            opacity: iframeLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease'
          }}
          title="Formulário de Agendamento - Sessão Estratégica"
          loading="lazy"
          onLoad={() => setIframeLoaded(true)}
        />
      </div>
    </div>
  )
}
