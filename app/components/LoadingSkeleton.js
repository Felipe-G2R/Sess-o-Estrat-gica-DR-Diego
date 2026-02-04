export default function LoadingSkeleton() {
  return (
    <div className="loading-container" role="status" aria-label="Carregando conteúdo">
      <div className="loading-logo skeleton" aria-hidden="true" />
      <div className="loading-title skeleton" aria-hidden="true" />
      <div className="loading-text skeleton" aria-hidden="true" />
      <div className="loading-text skeleton" style={{ width: '50%' }} aria-hidden="true" />
      <div className="loading-button skeleton" aria-hidden="true" />
      <span className="sr-only">Carregando...</span>
    </div>
  )
}
