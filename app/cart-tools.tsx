'use client'

import { useEffect } from 'react'

const BUTTON_CLASS = 'clear-cart-action'

function installClearCartButton() {
  const drawer = document.querySelector<HTMLElement>('.drawer')
  if (!drawer) return

  const existing = drawer.querySelector<HTMLButtonElement>(`.${BUTTON_CLASS}`)
  const hasItems = Boolean(drawer.querySelector('.cart-list .cart-item'))
  const isConfirmed = Boolean(drawer.querySelector('.confirmed-actions'))

  if (!hasItems || isConfirmed) {
    existing?.remove()
    return
  }

  if (existing) return

  const total = drawer.querySelector<HTMLElement>('.drawer-total')
  if (!total) return

  const button = document.createElement('button')
  button.type = 'button'
  button.className = BUTTON_CLASS
  button.textContent = 'Esvaziar carrinho'
  button.setAttribute('aria-label', 'Esvaziar todos os itens do carrinho')

  button.addEventListener('click', () => {
    const approved = window.confirm('Esvaziar todos os itens do carrinho?')
    if (!approved) return

    const items = Array.from(drawer.querySelectorAll<HTMLElement>('.cart-item'))

    items.forEach((item) => {
      const quantity = Number.parseInt(item.querySelector('.quantity span')?.textContent || '0', 10)
      const minus = item.querySelector<HTMLButtonElement>('.quantity button:first-child')
      if (!minus || !Number.isFinite(quantity)) return

      for (let count = 0; count < quantity; count += 1) minus.click()
    })
  })

  total.insertAdjacentElement('beforebegin', button)
}

export default function CartTools() {
  useEffect(() => {
    const observer = new MutationObserver(installClearCartButton)
    observer.observe(document.body, { childList: true, subtree: true })
    installClearCartButton()
    return () => observer.disconnect()
  }, [])

  return null
}
