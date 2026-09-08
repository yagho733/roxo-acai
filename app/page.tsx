'use client'

import { useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Menu,
  Minus,
  Plus,
  ShoppingBag,
  X,
} from 'lucide-react'

type Product = {
  id: string
  name: string
  description: string
  price: number
  image?: string
  category: 'Açaí' | 'Combos' | 'Bebidas'
  imagePosition?: string
}

type CartItem = Product & { quantity: number }
type Option = { name: string; extra: number }

const PHOTOS = {
  hero: 'https://images.unsplash.com/photo-1771371000586-33abd2ce9e23?auto=format&fit=crop&w=1800&q=88',
  classico: 'https://images.unsplash.com/photo-1672959202028-51e3b71255bd?auto=format&fit=crop&w=1500&q=84',
  ninho: 'https://images.unsplash.com/photo-1490324028530-3df5a9af0637?auto=format&fit=crop&w=1500&q=84',
  pacoca: 'https://images.unsplash.com/photo-1641579719214-534970165dc9?auto=format&fit=crop&w=1500&q=84',
  duo: 'https://images.unsplash.com/photo-1627308594190-a057cd4bfac8?auto=format&fit=crop&w=1800&q=86',
  combo: '/images/acai-hero.png',
  final: '/images/acai-bowl.png',
} as const

const sizes: Option[] = [
  { name: '300 ml', extra: 14.9 },
  { name: '500 ml', extra: 18.9 },
  { name: '700 ml', extra: 22.9 },
]
const fruits: Option[] = ['Banana', 'Morango', 'Kiwi'].map((name) => ({ name, extra: 0 }))
const toppings: Option[] = ['Granola', 'Paçoca', 'Leite em pó', 'Gotas de chocolate'].map((name) => ({
  name,
  extra: 1.5,
}))
const creams: Option[] = ['Creme de Ninho', 'Creme de paçoca', 'Creme de chocolate'].map((name) => ({
  name,
  extra: 2.5,
}))

const featured: Product[] = [
  {
    id: 'classico',
    name: 'Clássico 53',
    description: 'Açaí, banana, morango, granola e leite em pó.',
    price: 19.9,
    image: PHOTOS.classico,
    category: 'Açaí',
    imagePosition: 'center 55%',
  },
  {
    id: 'ninho',
    name: 'Ninho & Morango',
    description: 'Açaí, creme de Ninho, morango e leite em pó.',
    price: 22.9,
    image: PHOTOS.ninho,
    category: 'Açaí',
    imagePosition: 'center',
  },
  {
    id: 'pacoca',
    name: 'Paçoca Crunch',
    description: 'Açaí, creme de paçoca, banana e granola.',
    price: 21.9,
    image: PHOTOS.pacoca,
    category: 'Açaí',
    imagePosition: 'center',
  },
]

const combos: Product[] = [
  {
    id: 'duo',
    name: 'Combo Duo',
    description: '2 açaís 500 ml',
    price: 35.9,
    image: PHOTOS.duo,
    category: 'Combos',
    imagePosition: 'center',
  },
  {
    id: 'combo53',
    name: 'Combo 53',
    description: 'Açaí 500 ml + bebida',
    price: 23.9,
    image: PHOTOS.combo,
    category: 'Combos',
    imagePosition: 'center 46%',
  },
]

const drinks: Product[] = [
  { id: 'agua', name: 'Água mineral', description: 'Com ou sem gás.', price: 4.9, category: 'Bebidas' },
  { id: 'mate', name: 'Mate gelado', description: 'Mate natural, 300 ml.', price: 7.9, category: 'Bebidas' },
]

const money = (value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`

export default function Page() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [drawer, setDrawer] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [size, setSize] = useState(sizes[1])
  const [selected, setSelected] = useState<Option[]>([])
  const [category, setCategory] = useState<'Açaí' | 'Combos' | 'Bebidas'>('Açaí')
  const [showMobileBar, setShowMobileBar] = useState(false)

  const customPrice = size.extra + selected.reduce((sum, item) => sum + item.extra, 0)
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const menu = [...featured, ...combos, ...drinks]
  const visibleMenu = useMemo(() => menu.filter((item) => item.category === category), [category])

  useEffect(() => {
    const onScroll = () => setShowMobileBar(window.scrollY > 500)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = drawer || menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [drawer, menuOpen])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDrawer(false)
        setMenuOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    document.documentElement.classList.add('reveal-ready')
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            ;(entry.target as HTMLElement).classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -5% 0px' },
    )
    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  const addToCart = (product: Product, openDrawer = true) => {
    setCart((current) => {
      const found = current.find((item) => item.id === product.id)
      return found
        ? current.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
        : [...current, { ...product, quantity: 1 }]
    })
    if (openDrawer) setDrawer(true)
  }

  const addCustom = () => {
    const custom: Product = {
      id: `custom-${size.name}-${selected.map((item) => item.name).sort().join('-') || 'puro'}`,
      name: `Açaí ${size.name}`,
      description: selected.length ? selected.map((item) => item.name).join(' · ') : 'Açaí puro',
      price: customPrice,
      category: 'Açaí',
      image: PHOTOS.hero,
    }
    addToCart(custom, true)
  }

  const changeQuantity = (id: string, amount: number) =>
    setCart((current) =>
      current.flatMap((item) =>
        item.id === id ? (item.quantity + amount > 0 ? [{ ...item, quantity: item.quantity + amount }] : []) : [item],
      ),
    )

  const toggleOption = (option: Option) =>
    setSelected((current) =>
      current.some((item) => item.name === option.name)
        ? current.filter((item) => item.name !== option.name)
        : [...current, option],
    )

  const scrollTo = (id: string) => {
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <header className="site-header">
        <div className="section-shell flex min-h-[72px] items-center justify-between gap-4">
          <button onClick={() => scrollTo('top')} className="brand-lockup text-left" aria-label="ROXO 53 início">
            <span className="font-display text-[1.35rem] font-bold leading-none tracking-[-.055em]">ROXO 53</span>
            <span className="mt-1.5 block font-mono text-[8px] uppercase tracking-[.28em] text-primary/55">AÇAÍ & BOWLS</span>
          </button>

          <nav className="hidden items-center gap-8 lg:flex">
            {[
              ['pedidos', 'Favoritos'],
              ['monte', 'Monte o teu'],
              ['cardapio', 'Cardápio'],
              ['local', 'Onde encontrar'],
            ].map(([id, label]) => (
              <button key={id} onClick={() => scrollTo(id)} className="nav-link">
                {label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button onClick={() => setDrawer(true)} className="header-order">
              <ShoppingBag size={15} strokeWidth={1.8} />
              <span>Pedir</span>
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </button>
            <button
              onClick={() => setMenuOpen((value) => !value)}
              className="mobile-menu-button lg:hidden"
              aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-cream pt-[72px] lg:hidden">
          <div className="flex h-full flex-col justify-between px-5 pb-8 pt-10">
            <nav className="flex flex-col">
              {[
                ['pedidos', 'Favoritos'],
                ['monte', 'Monte o teu'],
                ['cardapio', 'Cardápio'],
                ['local', 'Onde encontrar'],
              ].map(([id, label], index) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className="flex items-center justify-between border-b border-primary/15 py-5 text-left font-display text-4xl font-bold tracking-[-.05em]"
                >
                  {label}
                  <span className="font-mono text-[10px] font-normal tracking-normal text-berry">0{index + 1}</span>
                </button>
              ))}
            </nav>
            <p className="max-w-xs text-sm leading-relaxed text-primary/55">Projeto demonstrativo para marcas de açaí e food delivery.</p>
          </div>
        </div>
      )}

      <section id="top" className="hero-section">
        <div className="section-shell hero-grid">
          <div className="hero-copy" data-reveal>
            <p className="eyebrow text-berry">Pelotas — RS · feito na hora</p>
            <h1 className="hero-title">
              DO TEU <span className="text-berry">JEITO.</span>
              <br />
              ATÉ A ÚLTIMA
              <br />
              COLHERADA.
            </h1>
            <p className="hero-description">
              Escolhe o tamanho, combina os complementos e monta um açaí que tem a tua cara.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button onClick={() => scrollTo('monte')} className="button-primary">
                Montar meu açaí <ArrowDown size={15} />
              </button>
              <button onClick={() => scrollTo('cardapio')} className="button-secondary">
                Ver cardápio
              </button>
            </div>
          </div>

          <div className="hero-media" data-reveal>
            <FoodImage src={PHOTOS.hero} alt="Bowl real de açaí com banana" priority position="center" />
            <div className="hero-stamp">
              <span className="font-mono text-[9px] uppercase tracking-[.18em]">Base cremosa</span>
              <strong className="font-display text-lg leading-none">Fruta. Crocância. Creme.</strong>
            </div>
            <span className="hero-index">53</span>
          </div>
        </div>

        <div className="ingredient-strip" aria-hidden="true">
          <div className="section-shell flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-4">
            {['AÇAÍ', 'FRUTA', 'CREME', 'CROCÂNCIA', 'DO TEU JEITO'].map((item, index) => (
              <span key={item} className="flex items-center gap-6 font-mono text-[9px] font-medium tracking-[.24em] text-primary/55">
                {item}
                {index < 4 && <i className="hidden h-1.5 w-1.5 rounded-full bg-berry sm:block" />}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="pedidos" className="bg-primary text-primary-foreground">
        <div className="section-shell py-16 lg:py-28">
          <div className="mb-12 grid gap-8 lg:grid-cols-[.75fr_1.25fr] lg:items-end" data-reveal>
            <div>
              <p className="eyebrow text-accent">01 · favoritos da casa</p>
              <h2 className="section-title text-primary-foreground">
                ESCOLHE
                <br />
                <span className="text-accent">O TEU.</span>
              </h2>
            </div>
            <p className="max-w-md text-base leading-relaxed text-primary-foreground/58 lg:justify-self-end lg:text-right">
              Três combinações prontas para quem quer pedir rápido. O resto tu monta como quiser.
            </p>
          </div>

          <div className="featured-editorial">
            {featured.map((item, index) => (
              <article key={item.id} className={`featured-product featured-product-${index + 1}`} data-reveal>
                <div className="featured-photo">
                  <FoodImage src={item.image!} alt={item.name} position={item.imagePosition} />
                  <span className="photo-number">0{index + 1}</span>
                </div>
                <div className="featured-info">
                  <p className="font-mono text-[10px] uppercase tracking-[.2em] text-accent">{money(item.price)}</p>
                  <h3 className="mt-2 font-display text-[clamp(2rem,4vw,4.8rem)] font-bold uppercase leading-[.86] tracking-[-.06em]">
                    {item.name}
                  </h3>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-primary-foreground/60">{item.description}</p>
                  <button onClick={() => addToCart(item)} className="product-add">
                    Adicionar ao pedido <ArrowRight size={15} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream">
        <div className="section-shell py-16 lg:py-28">
          <div className="mb-12 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between" data-reveal>
            <div>
              <p className="eyebrow text-berry">02 · quando bate a fome em dobro</p>
              <h2 className="section-title text-primary">
                PRA DIVIDIR.
                <br />
                <span className="text-berry">OU NÃO.</span>
              </h2>
            </div>
            <ArrowUpRight className="hidden text-berry lg:block" size={38} strokeWidth={1.4} />
          </div>

          <div className="combo-grid">
            {combos.map((product, index) => (
              <article key={product.id} className={`combo-panel combo-panel-${index + 1}`} data-reveal>
                <FoodImage src={product.image!} alt={product.name} position={product.imagePosition} />
                <div className="combo-shade" />
                <div className="combo-content">
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[.22em] text-accent">{product.description}</p>
                    <h3 className="mt-2 font-display text-4xl font-bold uppercase leading-[.9] tracking-[-.055em] lg:text-6xl">
                      {product.name}
                    </h3>
                  </div>
                  <div className="flex items-end justify-between gap-4">
                    <strong className="font-mono text-sm text-accent">{money(product.price)}</strong>
                    <button onClick={() => addToCart(product)} className="square-add" aria-label={`Adicionar ${product.name}`}>
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="monte" className="builder-section">
        <div className="section-shell builder-grid">
          <div className="builder-intro" data-reveal>
            <p className="eyebrow text-berry">03 · tua combinação</p>
            <h2 className="section-title text-primary">
              MONTE
              <br />
              O TEU.
            </h2>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-primary/58">
              Começa pelo tamanho. Depois escolhe fruta, crocância e creme. O total muda na hora, sem surpresa no fim.
            </p>
            <div className="builder-note">
              <span className="font-mono text-[9px] uppercase tracking-[.18em] text-primary/45">Como funciona</span>
              <p className="mt-2 font-display text-xl font-bold leading-tight">Escolhe. Confere. Adiciona ao pedido.</p>
            </div>
          </div>

          <div className="builder-workspace" data-reveal>
            <div className="builder-options">
              <OptionGroup title="Tamanho" step="01">
                <div className="grid grid-cols-3 gap-2">
                  {sizes.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => setSize(item)}
                      className={`size-option ${size.name === item.name ? 'is-active' : ''}`}
                    >
                      <span className="font-display text-lg font-bold">{item.name}</span>
                      <span className="font-mono text-[10px]">{money(item.extra)}</span>
                    </button>
                  ))}
                </div>
              </OptionGroup>

              <OptionGroup title="Frutas" step="02">
                <ChoiceList items={fruits} selected={selected} toggle={toggleOption} />
              </OptionGroup>

              <OptionGroup title="Complementos" step="03">
                <ChoiceList items={toppings} selected={selected} toggle={toggleOption} />
              </OptionGroup>

              <OptionGroup title="Cremes" step="04">
                <ChoiceList items={creams} selected={selected} toggle={toggleOption} />
              </OptionGroup>
            </div>

            <aside className="order-summary">
              <div>
                <p className="eyebrow text-primary/45">Seu açaí</p>
                <div className="mt-5 flex items-end justify-between gap-4 border-b border-primary/15 pb-5">
                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-[.18em] text-primary/45">Tamanho</span>
                    <p className="mt-1 font-display text-3xl font-bold tracking-[-.05em]">{size.name}</p>
                  </div>
                  <strong className="font-display text-4xl tracking-[-.055em]">{money(customPrice)}</strong>
                </div>

                <div className="mt-5 min-h-28">
                  <p className="font-mono text-[9px] uppercase tracking-[.18em] text-primary/45">Escolhas</p>
                  {selected.length ? (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {selected.map((item) => (
                        <span key={item.name} className="summary-chip">
                          {item.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-3 text-sm leading-relaxed text-primary/48">Escolhe os ingredientes para ver o teu açaí tomando forma.</p>
                  )}
                </div>
              </div>

              <button onClick={addCustom} className="button-primary mt-7 w-full justify-center">
                Adicionar ao pedido <ShoppingBag size={15} />
              </button>
            </aside>
          </div>
        </div>
      </section>

      <section className="impact-section" data-reveal>
        <FoodImage src="/images/acai-closeup.png" alt="Camadas de açaí com frutas e creme" position="center" />
        <div className="impact-overlay" />
        <div className="section-shell relative flex min-h-[64vh] items-end py-12 lg:min-h-[82vh] lg:py-20">
          <h2 className="impact-title">
            CAMADA
            <br />
            POR
            <br />
            <span>CAMADA.</span>
          </h2>
        </div>
      </section>

      <section id="cardapio" className="bg-background">
        <div className="section-shell py-16 lg:py-28">
          <div className="menu-heading" data-reveal>
            <div>
              <p className="eyebrow text-berry">04 · cardápio</p>
              <h2 className="section-title text-primary">
                ESCOLHE
                <br />
                E PEDE.
              </h2>
            </div>

            <div className="menu-tabs" role="tablist" aria-label="Categorias do cardápio">
              {(['Açaí', 'Combos', 'Bebidas'] as const).map((item) => (
                <button
                  key={item}
                  role="tab"
                  aria-selected={category === item}
                  onClick={() => setCategory(item)}
                  className={category === item ? 'is-active' : ''}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="menu-list" data-reveal>
            {visibleMenu.map((item, index) => (
              <article key={item.id} className="menu-row">
                <div className="menu-row-index">0{index + 1}</div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-2xl font-bold uppercase tracking-[-.04em] lg:text-3xl">{item.name}</h3>
                  <p className="mt-1 max-w-2xl text-sm leading-relaxed text-primary/55">{item.description}</p>
                </div>
                <strong className="font-mono text-xs lg:text-sm">{money(item.price)}</strong>
                <button onClick={() => addToCart(item)} className="square-add" aria-label={`Adicionar ${item.name}`}>
                  <Plus size={18} />
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="local" className="bg-cream">
        <div className="section-shell location-grid py-16 lg:py-28">
          <div data-reveal>
            <p className="eyebrow text-berry">05 · sem enrolação</p>
            <h2 className="section-title text-primary">
              DO CLIQUE
              <br />
              <span className="text-berry">À COLHER.</span>
            </h2>
            <div className="mt-10">
              {[
                ['01', 'MONTA', 'Escolhe tamanho e complementos.'],
                ['02', 'CONFERE', 'Revê o pedido e as quantidades.'],
                ['03', 'PEDE', 'Continua pelo canal que a loja já usa.'],
              ].map(([number, title, text]) => (
                <div key={number} className="step-row">
                  <span>{number}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="location-card" data-reveal>
            <div>
              <p className="eyebrow text-accent">Onde encontrar</p>
              <h3 className="mt-6 font-display text-[clamp(3.6rem,7vw,7rem)] font-bold leading-[.82] tracking-[-.07em]">
                PELOTAS
                <br />
                <span className="text-accent">— RS</span>
              </h3>
            </div>
            <div className="border-t border-primary-foreground/20 pt-5">
              <p className="font-mono text-[9px] uppercase tracking-[.2em] text-primary-foreground/45">Informações demonstrativas</p>
              <div className="mt-3 flex items-end justify-between gap-4">
                <p className="font-display text-3xl font-bold">18H — 23H</p>
                <span className="font-mono text-[9px] uppercase tracking-[.16em] text-primary-foreground/45">todos os dias</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="final-cta" data-reveal>
        <div className="final-photo">
          <FoodImage src={PHOTOS.final} alt="Açaí com frutas servido em bowl" position="center" />
        </div>
        <div className="final-copy">
          <p className="eyebrow text-primary/45">Tá decidido?</p>
          <h2 className="font-display text-[clamp(4rem,9vw,9rem)] font-bold leading-[.79] tracking-[-.075em] text-primary">
            JÁ SABE
            <br />
            O QUE VAI?
          </h2>
          <button onClick={() => setDrawer(true)} className="button-primary mt-8">
            Fazer pedido <ArrowUpRight size={16} />
          </button>
        </div>
      </section>

      <footer className="bg-primary text-primary-foreground">
        <div className="section-shell grid gap-8 py-9 md:grid-cols-[.7fr_1.3fr_.7fr] md:items-end">
          <div>
            <div className="font-display text-xl font-bold tracking-[-.04em]">ROXO 53</div>
            <div className="mt-1 font-mono text-[8px] uppercase tracking-[.24em] text-primary-foreground/45">AÇAÍ & BOWLS</div>
          </div>
          <p className="max-w-lg text-xs leading-relaxed text-primary-foreground/48">
            Projeto demonstrativo. Marca, produtos, preços, fotos, horários e canais de pedido são personalizados para cada negócio.
          </p>
          <p className="font-mono text-[8px] uppercase tracking-[.2em] text-primary-foreground/38 md:text-right">Desenvolvido por Yagho</p>
        </div>
      </footer>

      {showMobileBar && (
        <div className="mobile-order-bar lg:hidden">
          <button onClick={() => scrollTo('cardapio')} className="flex min-h-12 flex-1 items-center justify-between px-4 text-left">
            <span>
              <small className="block font-mono text-[8px] uppercase tracking-[.18em] text-primary-foreground/55">Pedido</small>
              <strong className="font-display text-lg">{totalItems ? `${totalItems} item${totalItems > 1 ? 's' : ''}` : 'Escolher agora'}</strong>
            </span>
            <ArrowRight size={17} />
          </button>
          <button onClick={() => setDrawer(true)} className="mobile-cart-button" aria-label="Abrir carrinho">
            <ShoppingBag size={17} />
            {totalItems > 0 && <span>{totalItems}</span>}
          </button>
        </div>
      )}

      {drawer && (
        <CartDrawer
          cart={cart}
          total={cartTotal}
          changeQuantity={changeQuantity}
          close={() => setDrawer(false)}
          onContinue={() => {
            setDrawer(false)
            requestAnimationFrame(() => scrollTo('monte'))
          }}
        />
      )}
    </main>
  )
}

function FoodImage({
  src,
  alt,
  position = 'center',
  priority = false,
}: {
  src: string
  alt: string
  position?: string
  priority?: boolean
}) {
  return (
    <img
      src={src}
      alt={alt}
      className="absolute inset-0 h-full w-full object-cover"
      style={{ objectPosition: position }}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
    />
  )
}

function OptionGroup({ title, step, children }: { title: string; step: string; children: ReactNode }) {
  return (
    <section className="option-group">
      <div className="mb-3 flex items-center gap-3">
        <span className="font-mono text-[9px] text-berry">{step}</span>
        <h3 className="font-display text-xl font-bold tracking-[-.03em] text-primary">{title}</h3>
      </div>
      {children}
    </section>
  )
}

function ChoiceList({
  items,
  selected,
  toggle,
}: {
  items: Option[]
  selected: Option[]
  toggle: (item: Option) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => {
        const active = selected.some((current) => current.name === item.name)
        return (
          <button key={item.name} onClick={() => toggle(item)} className={`choice-pill ${active ? 'is-active' : ''}`}>
            {active && <Check size={13} />}
            <span>{item.name}</span>
            {item.extra > 0 && <small>+ {money(item.extra)}</small>}
          </button>
        )
      })}
    </div>
  )
}

function CartDrawer({
  cart,
  total,
  changeQuantity,
  close,
  onContinue,
}: {
  cart: CartItem[]
  total: number
  changeQuantity: (id: string, amount: number) => void
  close: () => void
  onContinue: () => void
}) {
  return (
    <div className="fixed inset-0 z-[80]">
      <button className="absolute inset-0 bg-primary/60 backdrop-blur-[2px]" onClick={close} aria-label="Fechar pedido" />
      <aside className="cart-drawer" role="dialog" aria-modal="true" aria-label="Seu pedido">
        <div className="cart-head">
          <button onClick={close} className="cart-back">
            <ChevronDown className="rotate-90" size={16} /> Voltar
          </button>
          <span className="font-mono text-[9px] uppercase tracking-[.2em]">Seu pedido</span>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6 lg:px-7">
          {cart.length === 0 ? (
            <div className="flex min-h-full flex-col justify-center py-16">
              <span className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-berry text-cream">
                <ShoppingBag size={20} />
              </span>
              <p className="eyebrow text-primary/45">Ainda vazio</p>
              <h3 className="mt-3 max-w-xs font-display text-5xl font-bold leading-[.88] tracking-[-.06em]">FALTA SÓ ESCOLHER O TEU.</h3>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-primary/55">
                Monta do zero ou escolhe um dos favoritos da casa.
              </p>
              <button onClick={onContinue} className="button-primary mt-7 self-start">
                Montar agora <ArrowRight size={15} />
              </button>
            </div>
          ) : (
            <div className="space-y-0">
              {cart.map((item) => (
                <article key={item.id} className="cart-item">
                  {item.image && (
                    <div className="cart-thumb">
                      <FoodImage src={item.image} alt="" position={item.imagePosition} />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-display text-xl font-bold uppercase tracking-[-.035em]">{item.name}</h3>
                        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-primary/48">{item.description}</p>
                      </div>
                      <button
                        onClick={() => changeQuantity(item.id, -item.quantity)}
                        className="flex h-8 w-8 shrink-0 items-center justify-center border border-primary/15"
                        aria-label={`Remover ${item.name}`}
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-4">
                      <div className="quantity-control">
                        <button onClick={() => changeQuantity(item.id, -1)} aria-label="Diminuir quantidade">
                          <Minus size={13} />
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => changeQuantity(item.id, 1)} aria-label="Aumentar quantidade">
                          <Plus size={13} />
                        </button>
                      </div>
                      <strong className="font-mono text-xs">{money(item.price * item.quantity)}</strong>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[.18em] text-primary/45">Total do pedido</p>
                <strong className="mt-1 block font-display text-4xl tracking-[-.05em]">{money(total)}</strong>
              </div>
              <span className="max-w-[10rem] text-right text-[10px] leading-relaxed text-primary/42">Entrega e taxa são definidas pelo canal da loja.</span>
            </div>
            <button
              onClick={() =>
                alert('Demonstração: na versão do cliente, este botão abre WhatsApp, iFood, MandaPedido ou o checkout usado pela loja.')
              }
              className="button-primary mt-5 w-full justify-center"
            >
              Finalizar pedido <ArrowUpRight size={15} />
            </button>
          </div>
        )}
      </aside>
    </div>
  )
}
