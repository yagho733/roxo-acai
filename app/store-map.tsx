'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { ExternalLink, MapPin } from 'lucide-react'

const MAP_QUERY = 'Pelotas, Rio Grande do Sul'
const MAP_EMBED = `https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&output=embed`
const MAP_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`

export default function StoreMap() {
  const [target, setTarget] = useState<HTMLElement | null>(null)

  useEffect(() => {
    setTarget(document.querySelector<HTMLElement>('.store-card'))
  }, [])

  if (!target) return null

  return createPortal(
    <div className="store-map-wrap">
      <div className="store-map-frame">
        <iframe
          src={MAP_EMBED}
          title="Mapa da ROXO 53 em Pelotas"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <div className="store-map-overlay">
          <span><MapPin size={14} /> Pelotas, RS</span>
          <a href={MAP_LINK} target="_blank" rel="noreferrer">
            Abrir no Google Maps <ExternalLink size={13} />
          </a>
        </div>
      </div>
      <p className="store-map-note">Mapa centralizado em Pelotas até o endereço exato da loja ser definido.</p>
    </div>,
    target,
  )
}
