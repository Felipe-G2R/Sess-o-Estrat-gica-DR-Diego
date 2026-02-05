'use client'

import Script from 'next/script'

// ID do Pixel do Facebook - NextLevel Formed
const FACEBOOK_PIXEL_ID = '402956308839839'

export default function FacebookPixel() {
  return (
    <>
      {/* Script inline para inicializar o fbq antes do SDK carregar */}
      <Script
        id="facebook-pixel-init"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${FACEBOOK_PIXEL_ID}');
            fbq('track', 'PageView');
          `,
        }}
      />
      {/* SDK do Facebook carrega separadamente */}
      <Script
        id="facebook-pixel-sdk"
        strategy="afterInteractive"
        src="https://connect.facebook.net/en_US/fbevents.js"
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${FACEBOOK_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  )
}

// Função auxiliar para disparar eventos do pixel
export function trackFBEvent(eventName, params = {}) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, params)
  }
}

// Eventos comuns pré-definidos
export const fbEvents = {
  // Quando alguém clica no botão de agendar
  scheduleClick: () => trackFBEvent('Schedule'),

  // Quando alguém abre o modal do formulário
  openForm: () => trackFBEvent('Lead', { content_name: 'Formulário Sessão Estratégica' }),

  // Quando alguém completa o formulário
  completeRegistration: () => trackFBEvent('CompleteRegistration'),

  // Evento personalizado
  custom: (eventName, params) => trackFBEvent(eventName, params),
}
