'use client'

import { useEffect } from 'react'

function copyFallback(text: string) {
  const area = document.createElement('textarea')
  area.value = text
  area.setAttribute('readonly', '')
  area.style.position = 'fixed'
  area.style.opacity = '0'
  document.body.appendChild(area)
  area.select()
  document.execCommand('copy')
  document.body.removeChild(area)
}

export default function SiteRuntime() {
  useEffect(() => {
    const syncLabels = () => {
      document.querySelectorAll<HTMLButtonElement>('.drawer .btn.btn-dark.full').forEach((button) => {
        if (button.textContent?.includes('Revisar pedido')) {
          button.textContent = 'Copiar resumo do pedido'
        }
      })

      const note = document.querySelector<HTMLElement>('.checkout-note')
      if (note && note.dataset.polished !== 'true') {
        note.dataset.polished = 'true'
        const title = note.querySelector('strong')
        const text = note.querySelector('p')
        if (title) title.textContent = 'Resumo copiado.'
        if (text) text.textContent = 'O pedido ficou na área de transferência. Agora é só colar no WhatsApp da loja.'
      }
    }

    const handleClick = async (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest('button') : null
      if (!target || !target.textContent?.includes('Copiar resumo do pedido')) return

      const drawer = target.closest('.drawer')
      if (!drawer) return

      const lines = Array.from(drawer.querySelectorAll('.cart-item')).map((item) => {
        const name = item.querySelector('.cart-copy h3')?.textContent?.trim() || 'Item'
        const description = item.querySelector('.cart-copy p')?.textContent?.trim() || ''
        const quantity = item.querySelector('.quantity span')?.textContent?.trim() || '1'
        const price = item.querySelector('.cart-copy strong')?.textContent?.trim() || ''
        return `${quantity}x ${name} — ${price}${description ? `\n   ${description}` : ''}`
      })

      const total = drawer.querySelector('.drawer-total strong')?.textContent?.trim() || ''
      const summary = `ROXO 53 — MEU PEDIDO\n\n${lines.join('\n\n')}\n\nTotal: ${total}`

      try {
        await navigator.clipboard.writeText(summary)
      } catch {
        copyFallback(summary)
      }

      requestAnimationFrame(() => setTimeout(syncLabels, 0))
    }

    const observer = new MutationObserver(syncLabels)
    observer.observe(document.body, { childList: true, subtree: true })
    document.addEventListener('click', handleClick, true)
    syncLabels()

    return () => {
      observer.disconnect()
      document.removeEventListener('click', handleClick, true)
    }
  }, [])

  return null
}
