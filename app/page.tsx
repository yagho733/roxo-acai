'use client'

import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { ArrowDown, ArrowUpRight, Check, ChevronDown, Minus, Plus, ShoppingBag, X } from 'lucide-react'

type Product = {
  id: string
  name: string
  description: string
  price: number
  image?: string
  imagePosition?: string
  category: 'Açaí' | 'Combos' | 'Bebidas'
}

type CartItem = Product & { quantity: number }
type Option = { name: string; extra: number }

const PHOTOS = {
  hero: 'https://images.pexels.com/photos/28935593/pexels-photo-28935593/free-photo-of-vibrant-acai-bowl-with-fresh-strawberries.jpeg?auto=compress&cs=tinysrgb&w=1800',
  classic: 'https://images.pexels.com/photos/6637835/pexels-photo-6637835.jpeg?auto=compress&cs=tinysrgb&w=1500',
  ninho: 'https://images.pexels.com/photos/12118810/pexels-photo-12118810.jpeg?auto=compress&cs=tinysrgb&w=1500',
  pacoca: 'https://images.pexels.com/photos/5150303/pexels-photo-5150303.jpeg?auto=compress&cs=tinysrgb&w=1500',
  duo: 'https://images.pexels.com/photos/4099234/pexels-photo-4099234.jpeg?auto=compress&cs=tinysrgb&w=1800',
  combo: 'https://images.pexels.com/photos/4553027/pexels-photo-4553027.jpeg?auto=compress&cs=tinysrgb&w=1600',
  impact: 'https://images.pexels.com/photos/5232939/pexels-photo-5232939.jpeg?auto=compress&cs=tinysrgb&w=1800',
  final: 'https://images.pexels.com/photos/37489232/pexels-photo-37489232.jpeg?auto=compress&cs=tinysrgb&w=1800',
}

const sizes: Option[] = [
  { name: '300 ml', extra: 14.9 },
  { name: '500 ml', extra: 18.9 },
  { name: '700 ml', extra: 22.9 },
]

const fruits: Option[] = ['Banana', 'Morango', 'Kiwi'].map(name => ({ name, extra: 0 }))
const toppings: Option[] = ['Granola', 'Paçoca', 'Leite em pó', 'Gotas de chocolate'].map(name => ({ name, extra: 1.5 }))
const creams: Option[] = ['Creme de Ninho', 'Creme de paçoca', 'Creme de chocolate'].map(name => ({ name, extra: 2.5 }))

const featured: Product[] = [
  {
    id: 'classico',
    name: 'Clássico 53',
    description: 'Açaí, banana, morango, granola e leite em pó.',
    price: 19.9,
    image: PHOTOS.classic,
    imagePosition: 'center',
    category: 'Açaí',
  },
  {
    id: 'ninho',
    name: 'Ninho & Morango',
    description: 'Açaí cremoso, morango e finalização clara e suave.',
    price: 22.9,
    image: PHOTOS.ninho,
    imagePosition: 'center',
    category: 'Açaí',
  },
  {
    id: 'pacoca',
    name: 'Paçoca Crunch',
    description: 'Açaí, banana, granola e crocância de amendoim.',
    price: 21.9,
    image: PHOTOS.pacoca,
    imagePosition: 'center',
    category: 'Açaí',
  },
]

const combos: Product[] = [
  {
    id: 'duo',
    name: 'Combo Duo',
    description: '2 açaís 500 ml',
    price: 35.9,
    image: PHOTOS.duo,
    imagePosition: 'center',
    category: 'Combos',
  },
  {
    id: 'combo53',
    name: 'Combo 53',
    description: 'Açaí 500 ml + bebida',
    price: 23.9,
    image: PHOTOS.combo,
    imagePosition: 'center',
    category: 'Combos',
  },
]

const drinks: Product[] = [
  { id: 'agua', name: 'Água mineral', description: 'Com ou sem gás.', price: 4.9, category: 'Bebidas' },
  { id: 'mate', name: 'Mate gelado', description: 'Mate natural, 300 ml.', price: 7.9, category: 'Bebidas' },
]

const money = (value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`

function FoodPhoto({ src, alt, position = 'center', eager = false, className = '' }: { src: string; alt: string; position?: string; eager?: boolean; className?: string }) {
  return (
    <img
      src={src}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={eager ? 'high' : 'auto'}
      decoding="async"
      className={`h-full w-full object-cover ${className}`}
      style={{ objectPosition: position }}
    />
  )
}

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
  const visibleMenu = useMemo(() => menu.filter(item => item.category === category), [category])

  useEffect(() => {
    const onScroll = () => setShowMobileBar(window.scrollY > 560)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = drawer ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawer])

  const addToCart = (product: Product) => setCart(current => {
    const found = current.find(item => item.id === product.id)
    return found
      ? current.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      : [...current, { ...product, quantity: 1 }]
  })

  const addCustom = () => {
    const ingredients = selected.map(item => item.name)
    addToCart({
      id: `custom-${size.name}-${ingredients.join('-')}`,
      name: `Açaí ${size.name}`,
      description: ingredients.length ? ingredients.join(', ') : 'Açaí puro',
      price: customPrice,
      category: 'Açaí',
    })
  }

  const changeQuantity = (id: string, amount: number) => setCart(current => current.flatMap(item => {
    if (item.id !== id) return [item]
    const next = item.quantity + amount
    return next > 0 ? [{ ...item, quantity: next }] : []
  }))

  const toggleOption = (option: Option) => setSelected(current =>
    current.some(item => item.name === option.name)
      ? current.filter(item => item.name !== option.name)
      : [...current, option],
  )

  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-primary/10 bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex h-[68px] max-w-[1480px] items-center justify-between px-5 lg:h-[78px] lg:px-10 xl:px-14">
          <a href="#top" aria-label="ROXO 53 início" className="leading-none">
            <span className="font-display text-xl font-bold lg:text-2xl">ROXO 53</span>
            <span className="mt-1 block font-mono text-[9px] tracking-[.24em] text-primary/55">AÇAÍ & BOWLS</span>
          </a>

          <nav className="hidden items-center gap-8 text-[11px] font-bold uppercase tracking-[.14em] lg:flex xl:gap-10">
            <a className="nav-link" href="#pedidos">Favoritos</a>
            <a className="nav-link" href="#monte">Monte o teu</a>
            <a className="nav-link" href="#cardapio">Cardápio</a>
            <a className="nav-link" href="#local">Como pedir</a>
          </nav>

          <div className="flex items-center gap-2">
            <button onClick={() => setDrawer(true)} className="relative flex min-h-11 items-center gap-2 bg-primary px-4 text-xs font-bold uppercase tracking-wider text-primary-foreground transition hover:bg-berry lg:px-5">
              <ShoppingBag size={16} />
              <span>Pedir</span>
              {totalItems > 0 && <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] text-primary">{totalItems}</span>}
            </button>
            <button onClick={() => setMenuOpen(value => !value)} className="flex min-h-11 w-11 items-center justify-center border border-primary/20 lg:hidden" aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}>
              {menuOpen ? <X size={18} /> : <span className="space-y-1"><i className="block h-px w-4 bg-current" /><i className="block h-px w-4 bg-current" /></span>}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="border-t border-primary/10 bg-background px-5 py-5 lg:hidden">
            <div className="flex flex-col gap-4 text-xs font-bold uppercase tracking-wider">
              <a href="#pedidos" onClick={() => setMenuOpen(false)}>Favoritos</a>
              <a href="#monte" onClick={() => setMenuOpen(false)}>Monte o teu</a>
              <a href="#cardapio" onClick={() => setMenuOpen(false)}>Cardápio</a>
              <a href="#local" onClick={() => setMenuOpen(false)}>Como pedir</a>
            </div>
          </nav>
        )}
      </header>

      <section id="top" className="hero-section mx-auto max-w-[1480px] px-5 pb-14 pt-5 lg:px-10 lg:pb-20 lg:pt-8 xl:px-14">
        <div className="grid items-stretch gap-8 lg:min-h-[calc(100svh-110px)] lg:grid-cols-[1.08fr_.92fr] lg:gap-12 xl:gap-16">
          <div className="order-2 flex flex-col justify-center lg:order-1 lg:py-12">
            <div className="mb-5 flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[.26em] text-berry lg:mb-7">
              <span className="h-px w-8 bg-berry" />
              Projeto demonstrativo · Pelotas, RS
            </div>
            <h1 className="hero-title max-w-[880px] font-display text-[clamp(3.25rem,13vw,5.2rem)] font-bold leading-[.84] tracking-[-.07em] lg:text-[clamp(5.3rem,7.2vw,8rem)]">
              DO TEU<br />
              <span className="text-berry">JEITO.</span><br />
              ATÉ A ÚLTIMA<br />
              COLHERADA.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-primary/65 lg:mt-8 lg:text-lg">
              Escolhe o tamanho, combina os complementos e fecha o pedido sem complicação.
            </p>
            <div className="mt-7 flex flex-wrap gap-3 lg:mt-9">
              <a href="#monte" className="inline-flex min-h-13 items-center gap-3 bg-primary px-5 text-xs font-bold uppercase tracking-wider text-primary-foreground transition hover:bg-berry lg:px-6">
                Montar meu açaí <ArrowDown size={15} />
              </a>
              <a href="#cardapio" className="inline-flex min-h-13 items-center border border-primary/25 px-5 text-xs font-bold uppercase tracking-wider transition hover:border-primary hover:bg-primary hover:text-primary-foreground lg:px-6">
                Ver cardápio
              </a>
            </div>
            <div className="mt-9 hidden max-w-xl grid-cols-3 border-t border-primary/15 pt-5 lg:grid">
              <div><span className="font-mono text-[9px] uppercase tracking-[.18em] text-primary/45">01</span><p className="mt-2 text-sm font-semibold">Escolhe</p></div>
              <div><span className="font-mono text-[9px] uppercase tracking-[.18em] text-primary/45">02</span><p className="mt-2 text-sm font-semibold">Personaliza</p></div>
              <div><span className="font-mono text-[9px] uppercase tracking-[.18em] text-primary/45">03</span><p className="mt-2 text-sm font-semibold">Pede</p></div>
            </div>
          </div>

          <div className="order-1 relative min-h-[390px] overflow-visible lg:order-2 lg:min-h-[640px]">
            <div className="relative h-full min-h-[390px] overflow-hidden bg-accent lg:min-h-[640px]">
              <FoodPhoto src={PHOTOS.hero} alt="Bowl de açaí com morangos e granola" eager className="transition duration-700 lg:hover:scale-[1.015]" />
            </div>
            <div className="absolute -bottom-3 left-0 bg-berry px-4 py-3 font-display text-base font-bold text-primary-foreground lg:-bottom-4 lg:-left-4 lg:px-6 lg:py-4 lg:text-xl">
              monta. mistura. pede.<span className="ml-2 text-accent">*</span>
            </div>
          </div>
        </div>
      </section>

      <section id="pedidos" className="bg-primary px-5 py-16 text-primary-foreground lg:px-10 lg:py-28 xl:px-14">
        <div className="mx-auto max-w-[1480px]">
          <div className="mb-10 flex flex-col justify-between gap-7 lg:mb-14 lg:flex-row lg:items-end">
            <div>
              <p className="mb-4 font-mono text-[10px] uppercase tracking-[.3em] text-accent">01 · favoritos da casa</p>
              <h2 className="font-display text-5xl font-bold leading-[.88] tracking-[-.06em] sm:text-6xl lg:text-8xl">ESCOLHE<br /><span className="text-accent">O TEU.</span></h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-primary-foreground/60 lg:pb-2 lg:text-base">Três combinações diretas para quem já sabe que hoje não vai economizar na colherada.</p>
          </div>

          <div className="grid gap-10 md:grid-cols-3 md:gap-6 lg:gap-8">
            {featured.map((item, index) => (
              <article key={item.id} className={index === 1 ? 'md:pt-14' : ''}>
                <button onClick={() => addToCart(item)} className="group block w-full text-left" aria-label={`Adicionar ${item.name} ao pedido`}>
                  <div className="relative aspect-[4/5] overflow-hidden bg-cream md:aspect-[.92] lg:aspect-[4/5]">
                    <FoodPhoto src={item.image!} alt={item.name} position={item.imagePosition} className="transition duration-500 group-hover:scale-[1.025]" />
                    <span className="absolute bottom-0 right-0 flex h-12 w-12 items-center justify-center bg-accent text-primary transition group-hover:bg-berry group-hover:text-primary-foreground"><Plus size={18} /></span>
                  </div>
                  <div className="flex items-start justify-between gap-4 pt-5">
                    <div className="min-w-0">
                      <h3 className="font-display text-2xl font-bold uppercase lg:text-3xl">{item.name}</h3>
                      <p className="mt-2 max-w-sm text-sm leading-relaxed text-primary-foreground/62">{item.description}</p>
                    </div>
                    <span className="whitespace-nowrap pt-1 font-mono text-sm text-accent">{money(item.price)}</span>
                  </div>
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream px-5 py-16 lg:px-10 lg:py-28 xl:px-14">
        <div className="mx-auto max-w-[1480px]">
          <div className="mb-10 flex items-end justify-between lg:mb-14">
            <div>
              <p className="mb-4 font-mono text-[10px] uppercase tracking-[.3em] text-berry">02 · pra compartilhar</p>
              <h2 className="font-display text-5xl font-bold leading-[.88] tracking-[-.06em] text-primary sm:text-6xl lg:text-8xl">PRA DIVIDIR.<br /><span className="text-berry">OU NÃO.</span></h2>
            </div>
            <ArrowUpRight className="hidden text-berry lg:block" size={42} />
          </div>
          <div className="grid gap-5 lg:grid-cols-[1.25fr_.75fr] lg:items-end lg:gap-7">
            <ComboCard product={combos[0]} onAdd={() => addToCart(combos[0])} large />
            <ComboCard product={combos[1]} onAdd={() => addToCart(combos[1])} />
          </div>
        </div>
      </section>

      <section id="monte" className="bg-background px-5 py-16 lg:px-10 lg:py-28 xl:px-14">
        <div className="mx-auto grid max-w-[1380px] gap-12 lg:grid-cols-[.72fr_1.28fr] lg:gap-20 xl:grid-cols-[.65fr_1.35fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="mb-4 font-mono text-[10px] font-bold uppercase tracking-[.3em] text-berry">03 · personaliza</p>
            <h2 className="font-display text-6xl font-bold leading-[.86] tracking-[-.07em] text-primary sm:text-7xl lg:text-8xl xl:text-9xl">MONTE<br />O TEU.</h2>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-primary/65 lg:text-base">O preço muda na hora e cada adicional aparece antes de tu escolher. Sem surpresa no final.</p>
            <div className="mt-8 hidden border-t border-primary/15 pt-5 lg:block">
              <p className="font-mono text-[9px] uppercase tracking-[.18em] text-primary/45">base atual</p>
              <div className="mt-2 flex items-end justify-between gap-5"><strong className="font-display text-4xl text-primary">{size.name}</strong><span className="font-mono text-sm text-berry">{money(size.extra)}</span></div>
            </div>
          </div>

          <div className="space-y-10 lg:rounded-none lg:border-l lg:border-primary/15 lg:pl-12 xl:pl-16">
            <OptionGroup title="Escolhe o tamanho" step="01">
              <div className="grid grid-cols-3 gap-2 lg:gap-3">
                {sizes.map(item => (
                  <button key={item.name} onClick={() => setSize(item)} aria-pressed={size.name === item.name} className={`min-h-[92px] border p-3 text-left transition lg:min-h-[112px] lg:p-4 ${size.name === item.name ? 'border-primary bg-primary text-primary-foreground' : 'border-primary/20 hover:border-primary/55'}`}>
                    <span className="block font-display text-lg font-bold lg:text-2xl">{item.name}</span>
                    <span className="mt-2 block font-mono text-xs">{money(item.extra)}</span>
                  </button>
                ))}
              </div>
            </OptionGroup>

            <OptionGroup title="Escolhe as frutas" step="02"><ChoiceList items={fruits} selected={selected} toggle={toggleOption} /></OptionGroup>
            <OptionGroup title="Vai um complemento?" step="03"><ChoiceList items={toppings} selected={selected} toggle={toggleOption} /></OptionGroup>
            <OptionGroup title="Finaliza com creme" step="04"><ChoiceList items={creams} selected={selected} toggle={toggleOption} /></OptionGroup>

            <div className="border-t border-primary/15 pt-7 lg:pt-9">
              <div className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-end">
                <div>
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[.2em] text-primary/50">Seu açaí · {size.name}</p>
                  <div className="mt-3 flex max-w-2xl flex-wrap gap-2">
                    {selected.length
                      ? selected.map(item => <span key={item.name} className="border border-primary/12 bg-primary/[.05] px-2.5 py-1.5 text-xs text-primary">{item.name}</span>)
                      : <span className="text-sm text-primary/55">Sem adicionais por enquanto.</span>}
                  </div>
                </div>
                <strong className="font-display text-4xl text-primary lg:text-5xl">{money(customPrice)}</strong>
              </div>
              <button onClick={addCustom} className="mt-6 flex min-h-14 w-full items-center justify-center gap-3 bg-primary px-5 text-xs font-bold uppercase tracking-wider text-primary-foreground transition hover:bg-berry lg:max-w-md lg:justify-between lg:px-6">
                Adicionar ao pedido <Plus size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="relative min-h-[48vh] overflow-hidden bg-primary lg:min-h-[76vh]">
        <FoodPhoto src={PHOTOS.impact} alt="Açaí com frutas em destaque" className="absolute inset-0 opacity-70" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(42,18,51,.82),rgba(42,18,51,.18))]" />
        <div className="relative mx-auto flex min-h-[48vh] max-w-[1480px] items-end px-5 py-10 lg:min-h-[76vh] lg:px-10 lg:py-16 xl:px-14">
          <h2 className="font-display text-7xl font-bold leading-[.82] tracking-[-.07em] text-cream sm:text-8xl lg:text-[clamp(8rem,14vw,13rem)]">CAMADA<br />POR<br /><span className="text-accent">CAMADA.</span></h2>
        </div>
      </section>

      <section id="cardapio" className="px-5 py-16 lg:px-10 lg:py-28 xl:px-14">
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-10 flex flex-col gap-7 lg:mb-14 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-4 font-mono text-[10px] uppercase tracking-[.3em] text-berry">04 · cardápio</p>
              <h2 className="font-display text-6xl font-bold leading-[.86] tracking-[-.07em] lg:text-8xl">ESCOLHE<br />E PEDE.</h2>
            </div>
            <div className="flex overflow-x-auto border-b border-primary/20">
              {(['Açaí', 'Combos', 'Bebidas'] as const).map(item => (
                <button key={item} onClick={() => setCategory(item)} className={`min-h-12 whitespace-nowrap px-4 text-xs font-bold uppercase tracking-wider transition lg:px-5 ${category === item ? 'border-b-2 border-berry text-berry' : 'text-primary/45 hover:text-primary'}`}>{item}</button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-primary/15 border-y border-primary/15">
            {visibleMenu.map((item, index) => (
              <div key={item.id} className="grid grid-cols-[1fr_auto] items-center gap-4 py-5 lg:grid-cols-[70px_1fr_auto] lg:gap-7 lg:py-7">
                <span className="hidden font-mono text-xs text-primary/35 lg:block">0{index + 1}</span>
                <div className="min-w-0">
                  <h3 className="font-display text-xl font-bold uppercase lg:text-3xl">{item.name}</h3>
                  <p className="mt-1 max-w-2xl text-sm leading-relaxed text-primary/60 lg:text-base">{item.description}</p>
                </div>
                <div className="flex items-center gap-3 lg:gap-5">
                  <span className="whitespace-nowrap font-mono text-sm font-bold lg:text-base">{money(item.price)}</span>
                  <button onClick={() => addToCart(item)} className="flex h-11 w-11 shrink-0 items-center justify-center bg-accent text-primary transition hover:bg-berry hover:text-primary-foreground lg:h-12 lg:w-12" aria-label={`Adicionar ${item.name}`}><Plus size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="local" className="border-t border-primary/10 bg-cream px-5 py-16 lg:px-10 lg:py-28 xl:px-14">
        <div className="mx-auto grid max-w-[1380px] gap-8 lg:grid-cols-[1.1fr_.9fr] lg:gap-12">
          <div className="lg:pr-10">
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[.3em] text-berry">05 · sem complicar</p>
            <h2 className="font-display text-6xl font-bold leading-[.86] tracking-[-.07em] text-primary lg:text-8xl">COMO<br />PEDIR.</h2>
            <div className="mt-10 grid gap-0 lg:mt-14">
              {[
                ['01', 'MONTA', 'Escolhe tamanho, fruta, complemento e creme.'],
                ['02', 'CONFERE', 'Revê os itens, quantidades e o valor total.'],
                ['03', 'PEDE', 'Continua pelo canal de pedidos usado pela loja.'],
              ].map(([number, title, text]) => (
                <div key={number} className="grid grid-cols-[46px_1fr] gap-4 border-t border-primary/15 py-5 lg:grid-cols-[70px_1fr] lg:py-6">
                  <span className="font-mono text-xs text-berry">{number}</span>
                  <div><h3 className="font-display text-xl font-bold text-primary lg:text-2xl">{title}</h3><p className="mt-1 max-w-lg text-sm leading-relaxed text-primary/65 lg:text-base">{text}</p></div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex min-h-[380px] flex-col justify-end bg-primary p-7 text-primary-foreground lg:min-h-[520px] lg:p-10 xl:p-12">
            <p className="font-mono text-[10px] uppercase tracking-[.3em] text-accent">onde encontrar</p>
            <h3 className="mt-auto pt-16 font-display text-5xl font-bold leading-[.88] lg:text-7xl">PELOTAS<br /><span className="text-accent">— RS</span></h3>
            <div className="mt-10 border-t border-primary-foreground/20 pt-5 lg:mt-14">
              <p className="font-mono text-[10px] uppercase tracking-[.2em] text-primary-foreground/55">Informações demonstrativas</p>
              <p className="mt-3 font-display text-2xl font-bold lg:text-3xl">18H — 23H</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-berry px-5 py-16 text-primary lg:px-10 lg:py-24 xl:px-14">
        <div className="mx-auto grid max-w-[1480px] overflow-hidden bg-cream lg:min-h-[620px] lg:grid-cols-[.9fr_1.1fr]">
          <div className="relative min-h-[360px] lg:min-h-[620px]">
            <FoodPhoto src={PHOTOS.final} alt="Açaí com frutas e complementos" />
          </div>
          <div className="flex flex-col justify-between p-7 lg:p-12 xl:p-16">
            <span className="font-mono text-[10px] uppercase tracking-[.28em] text-berry">fim da dúvida</span>
            <div className="py-12 lg:py-0">
              <h2 className="font-display text-6xl font-bold leading-[.84] tracking-[-.07em] sm:text-7xl lg:text-8xl xl:text-9xl">JÁ SABE<br />O QUE VAI?</h2>
              <button onClick={() => setDrawer(true)} className="mt-8 inline-flex min-h-14 items-center gap-4 bg-primary px-6 text-xs font-bold uppercase tracking-wider text-primary-foreground transition hover:bg-berry lg:mt-10">
                Fazer pedido <ArrowUpRight size={17} />
              </button>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-primary/55">No projeto real, esse botão aponta para WhatsApp, iFood, MandaPedido ou o sistema que a loja já utiliza.</p>
          </div>
        </div>
      </section>

      <footer className="bg-primary px-5 py-9 text-primary-foreground lg:px-10 lg:py-11 xl:px-14">
        <div className="mx-auto grid max-w-[1480px] gap-8 lg:grid-cols-[1fr_1.4fr_auto] lg:items-end">
          <div><div className="font-display text-xl font-bold lg:text-2xl">ROXO 53</div><div className="mt-1 font-mono text-[9px] tracking-[.24em] text-primary-foreground/60">AÇAÍ & BOWLS</div></div>
          <p className="max-w-lg text-xs leading-relaxed text-primary-foreground/55">Projeto demonstrativo. Marca, produtos, preços, fotos, horários e canais de pedido são personalizados para cada negócio.</p>
          <p className="font-mono text-[9px] uppercase tracking-[.2em] text-primary-foreground/40">Desenvolvido por Yagho</p>
        </div>
      </footer>

      {showMobileBar && (
        <div className="fixed inset-x-0 bottom-0 z-30 px-4 pb-[calc(.75rem+env(safe-area-inset-bottom))] lg:hidden">
          <div className="flex items-center justify-between bg-primary px-4 py-3 text-primary-foreground shadow-2xl">
            <span className="font-mono text-[10px] uppercase tracking-[.16em]">{totalItems ? `${totalItems} ${totalItems === 1 ? 'item' : 'itens'}` : 'pronto para pedir?'}</span>
            <button onClick={() => setDrawer(true)} className="flex min-h-11 items-center gap-2 bg-accent px-4 text-xs font-bold uppercase text-primary"><ShoppingBag size={16} /> Pedir</button>
          </div>
        </div>
      )}

      {drawer && (
        <CartDrawer
          cart={cart}
          total={cartTotal}
          changeQuantity={changeQuantity}
          close={() => setDrawer(false)}
          onAdd={() => {
            setDrawer(false)
            document.getElementById('monte')?.scrollIntoView({ behavior: 'smooth' })
          }}
        />
      )}
    </main>
  )
}

function ComboCard({ product, onAdd, large = false }: { product: Product; onAdd: () => void; large?: boolean }) {
  return (
    <article className={`group relative overflow-hidden bg-primary text-primary-foreground ${large ? 'min-h-[420px] lg:min-h-[620px]' : 'min-h-[350px] lg:min-h-[480px]'}`}>
      <FoodPhoto src={product.image!} alt={product.name} position={product.imagePosition} className="absolute inset-0 opacity-85 transition duration-500 group-hover:scale-[1.02]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(42,18,51,.04),rgba(42,18,51,.84))]" />
      <div className="relative flex min-h-[inherit] flex-col justify-end p-5 lg:p-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[.2em] text-accent">{product.description}</p>
            <h3 className="mt-2 font-display text-4xl font-bold uppercase leading-none sm:text-5xl lg:text-6xl">{product.name}</h3>
          </div>
          <div className="shrink-0 text-right">
            <p className="font-mono text-lg text-accent lg:text-xl">{money(product.price)}</p>
            <button onClick={onAdd} className="mt-3 flex h-11 w-11 items-center justify-center bg-accent text-primary transition hover:bg-berry hover:text-primary-foreground lg:h-12 lg:w-12" aria-label={`Adicionar ${product.name}`}><Plus size={18} /></button>
          </div>
        </div>
      </div>
    </article>
  )
}

function OptionGroup({ title, step, children }: { title: string; step: string; children: ReactNode }) {
  return (
    <div>
      <div className="mb-4 flex items-center gap-3 lg:mb-5">
        <span className="font-mono text-[10px] text-berry">{step}</span>
        <h3 className="font-display text-xl font-bold text-primary lg:text-2xl">{title}</h3>
      </div>
      {children}
    </div>
  )
}

function ChoiceList({ items, selected, toggle }: { items: Option[]; selected: Option[]; toggle: (item: Option) => void }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap lg:gap-3">
      {items.map(item => {
        const active = selected.some(current => current.name === item.name)
        return (
          <button key={item.name} onClick={() => toggle(item)} aria-pressed={active} className={`inline-flex min-h-12 items-center justify-between gap-2 border px-3 text-left text-sm transition lg:min-h-13 lg:px-4 ${active ? 'border-berry bg-berry text-primary' : 'border-primary/20 text-primary hover:border-primary/55'}`}>
            <span className="inline-flex items-center gap-2">{active && <Check size={14} />}<span>{item.name}</span></span>
            {item.extra > 0 && <small className="whitespace-nowrap font-mono text-[10px]">+ {money(item.extra)}</small>}
          </button>
        )
      })}
    </div>
  )
}

function CartDrawer({ cart, total, changeQuantity, close, onAdd }: { cart: CartItem[]; total: number; changeQuantity: (id: string, amount: number) => void; close: () => void; onAdd: () => void }) {
  return (
    <div className="fixed inset-0 z-50">
      <button className="absolute inset-0 bg-primary/60 backdrop-blur-[2px]" onClick={close} aria-label="Fechar pedido" />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-[460px] flex-col bg-cream text-primary shadow-2xl">
        <div className="flex items-center justify-between border-b border-primary/15 px-5 py-5 lg:px-6">
          <button onClick={close} className="flex min-h-10 items-center gap-2 text-xs font-bold uppercase tracking-wider"><ChevronDown className="rotate-90" size={16} /> Voltar</button>
          <span className="font-mono text-[10px] uppercase tracking-[.2em]">Seu pedido</span>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6 lg:px-6">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <ShoppingBag className="mb-5 text-berry" size={30} />
              <h3 className="font-display text-3xl font-bold">Ainda está vazio.</h3>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-primary/60">Monta teu açaí ou escolhe um dos favoritos da casa.</p>
              <button onClick={onAdd} className="mt-6 bg-primary px-5 py-3 text-xs font-bold uppercase tracking-wider text-primary-foreground">Montar agora</button>
            </div>
          ) : (
            <div className="space-y-5">
              {cart.map(item => (
                <div key={item.id} className="border-b border-primary/10 pb-5">
                  <div className="flex justify-between gap-3">
                    <div className="min-w-0"><h3 className="font-display text-lg font-bold uppercase">{item.name}</h3><p className="mt-1 line-clamp-2 text-xs leading-relaxed text-primary/55">{item.description}</p></div>
                    <button onClick={() => changeQuantity(item.id, -item.quantity)} className="h-8 w-8 shrink-0" aria-label={`Remover ${item.name}`}><X size={15} /></button>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button onClick={() => changeQuantity(item.id, -1)} className="flex h-8 w-8 items-center justify-center border border-primary/20" aria-label={`Diminuir ${item.name}`}><Minus size={14} /></button>
                      <span className="min-w-4 text-center font-mono text-sm">{item.quantity}</span>
                      <button onClick={() => changeQuantity(item.id, 1)} className="flex h-8 w-8 items-center justify-center bg-accent" aria-label={`Aumentar ${item.name}`}><Plus size={14} /></button>
                    </div>
                    <span className="font-mono text-sm font-bold">{money(item.price * item.quantity)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-primary/15 p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] lg:p-6">
            <div className="flex items-center justify-between"><span className="font-mono text-xs uppercase tracking-wider">Total</span><strong className="font-display text-3xl">{money(total)}</strong></div>
            <button onClick={() => alert('Demonstração: no projeto real, este botão é conectado ao canal de pedidos da loja.')} className="mt-5 min-h-14 w-full bg-primary px-5 text-xs font-bold uppercase tracking-wider text-primary-foreground transition hover:bg-berry">Finalizar pedido</button>
          </div>
        )}
      </aside>
    </div>
  )
}
