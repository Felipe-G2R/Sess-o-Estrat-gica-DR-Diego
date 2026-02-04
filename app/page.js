'use client'

import { useState, useCallback, Suspense, lazy } from 'react'
import LoadingSkeleton from './components/LoadingSkeleton'

// Lazy load components for better performance
const ContentLoader = lazy(() => import('./components/ContentLoader'))
const FormModal = lazy(() => import('./components/FormModal'))

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = useCallback(() => {
    setIsModalOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  return (
    <>
      <Suspense fallback={<LoadingSkeleton />}>
        <ContentLoader onButtonClick={openModal} />
      </Suspense>

      <Suspense fallback={null}>
        <FormModal isOpen={isModalOpen} onClose={closeModal} />
      </Suspense>
    </>
  )
}
