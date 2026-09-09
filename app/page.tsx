'use client'

import { useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  ArrowDown,
  ArrowRight,
  Check,
  ChevronRight,
  Clock3,
  MapPin,
  Menu,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  Star,
  X,
} from 'lucide-react'

type Category = 'Favoritos' | 'Combos' | 'Bebidas'
type Product = {
  id: string
  name: string
  kicker: string
  description: string
  price: number
  image: string
  category: Category
  badge?: string
  position?: string
}

type CartItem = Product & { quantity: number }
type Choice = { name: string; extra: number }

const money = (value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`

const products: Product[] = [
  {
    id: 'classico-53',
    name: 'Clássico 53',
    kicker: 'o mais pedido',
    description: 'Açaí cremoso, banana, morango, granola e sementes de chia.',
    price: 19.9,
    image: 'https://images.pexels.com/photos/17597421/pexels-photo-17597421.jpeg?auto=compress&cs=tinysrgb&w=1400',
    category: 'Favoritos',
    badge: 'BEST-SELLER',
    position: 'center',
  },
  {
    id: 'morango-coco',
    name: 'Morango & Coco',
    kicker: 'frutado + leve',
    description: 'Açaí, morango fresco, mirtilo, granola e coco em flocos.',
    price: 22.9,
    image: 'https://images.pexels.com/photos/5232938/pexels-photo-5232938.jpeg?auto=compress&cs=tinysrgb&w=1400',
    category: 'Favoritos',
    badge: 'FRESCO',
    position: 'center',
  },
  {
    id: 'banana-crunch',
    name: 'Banana Crunch',
    kicker: 'cremoso + crocante',
    description: 'Açaí, banana, frutas frescas, granola, castanhas e creme de amendoim.',
    price: 21.9,
    image: 'https://images.pexels.com/photos/8230032/pexels-photo-8230032.jpeg?auto=compress&cs=tinysrgb&w=1400',
    category: 'Favoritos',
    badge: 'CROCANTE',
    position: 'center',
  },
  {
    id: 'duo-53',
    name: 'Duo 53',
    kicker: 'pra dividir. ou não.',
    description: 'Dois bowls de açaí com frutas, granola e chia.',
    price: 35.9,
    image: 'https://images.pexels.com/photos/4099234/pexels-photo-4099234.jpeg?auto=compress&cs=tinysrgb&w=1400',
    category: 'Combos',
    badge: '2 BOWLS',
    position: 'center',
  },
  {
    id: 'combo-53',
    name: 'Combo 53',
    kicker: 'pedido completo',
    description: 'Bowl de açaí com frutas + bebida gelada para acompanhar.',
    price: 23.9,
    image: 'https://images.pexels.com/photos/4553027/pexels-photo-4553027.jpeg?auto=compress&cs=tinysrgb&w=1400',
    category: 'Combos',
    badge: 'COMBO',
    position: 'center',
  },
  {
    id: 'mate',
    name: 'Mate Gelado',
    kicker: 'pra refrescar',
    description: 'Chá mate gelado com gelo, limão e hortelã.',
    price: 7.9,
    image: 'https://images.pexels.com/photos/13293872/pexels-photo-13293872.jpeg?auto=compress&cs=tinysrgb&w=1200',
    category: 'Bebidas',
    position: 'center',
  },
]

const sizes: Choice[] = [
  { name: '300 ml', extra: 14.9 },
  { name: '500 ml', extra: 18.9 },
  { name: '700 ml', extra: 22.9 },
]
const fruits: Choice[] = ['Banana', 'Morango', 'Kiwi'].map((name) => ({ name, extra: 0 }))
const crunch: Choice[] = ['Granola', 'Paçoca', 'Leite em pó', 'Gotas de chocolate'].map((name) => ({ name, extra: 1.5 }))
const creams: Choice[] = ['Creme de Ninho', 'Creme de paçoca', 'Creme de chocolate'].map((name) => ({ name, extra: 2.5 }))

export default function Page() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [category, setCategory] = useState<Category>('Favoritos')
  const [size, setSize] = useState<Choice>(sizes[1])
  const [choices, setChoices] = useState<Choice[]>([])
  const [checkoutReady, setCheckoutReady] = useState(false)

  const visibleProducts = useMemo(() => products.filter((product) => product.category === category), [category])
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const customTotal = size.extra + choices.reduce((sum, item) => sum + item.extra, 0)

  useEffect(() => {
    document.body.style.overflow = drawerOpen || menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [drawerOpen, menuOpen])

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -7% 0px' },
    )
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  const scrollTo = (id: string) => {
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const addToCart = (product: Product, open = true) => {
    setCheckoutReady(false)
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id)
      return existing
        ? current.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
        : [...current, { ...product, quantity: 1 }]
    })
    if (open) setDrawerOpen(true)
  }

  const addCustom = () => {
    const product: Product = {
      id: `custom-${size.name}-${choices.map((item) => item.name).sort().join('-') || 'puro'}`,
      name: `Roxo do teu jeito · ${size.name}`,
      kicker: 'montado por você',
      description: choices.length ? choices.map((item) => item.name).join(' · ') : 'Açaí puro',
      price: customTotal,
      image: '/images/acai-bowl.png',
      category: 'Favoritos',
      badge: 'PERSONALIZADO',
    }
    addToCart(product)
  }

  const updateQuantity = (id: string, amount: number) => {
    setCheckoutReady(false)
    setCart((current) =>
      current.flatMap((item) => {
        if (item.id !== id) return [item]
        const quantity = item.quantity + amount
        return quantity > 0 ? [{ ...item, quantity }] : []
      }),
    )
  }

  const toggleChoice = (choice: Choice) => {
    setChoices((current) =>
      current.some((item) => item.name === choice.name)
        ? current.filter((item) => item.name !== choice.name)
        : [...current, choice],
    )
  }

  return (
    <main className="site">
      <header className="topbar">
        <div className="shell topbar-inner">
          <button className="brand" onClick={() => scrollTo('inicio')} aria-label="Voltar ao início">
            <span className="brand-mark">53</span>
            <span className="brand-name"><strong>ROXO</strong><small>AÇAÍ & BOWLS</small></span>
          </button>

          <nav className="desktop-nav" aria-label="Navegação principal">
            <button onClick={() => scrollTo('favoritos')}>Favoritos</button>
            <button onClick={() => scrollTo('monte')}>Monte o teu</button>
            <button onClick={() => scrollTo('cardapio')}>Cardápio</button>
            <button onClick={() => scrollTo('loja')}>Loja</button>
          </nav>

          <div className="header-actions">
            <button className="cart-pill" onClick={() => setDrawerOpen(true)}>
              <ShoppingBag size={17} />
              <span>Pedido</span>
              <b>{cartCount}</b>
            </button>
            <button className="menu-toggle" onClick={() => setMenuOpen((value) => !value)} aria-label="Abrir menu">
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-copy">AÇAÍ CREMOSO, FRUTA FRESCA E CAMADAS DO TEU JEITO.</div>
          {[
            ['favoritos', 'Favoritos'],
            ['monte', 'Monte o teu'],
            ['cardapio', 'Cardápio'],
            ['loja', 'Loja'],
          ].map(([id, label], index) => (
            <button key={id} onClick={() => scrollTo(id)}>
              <span>0{index + 1}</span>{label}<ChevronRight size={22} />
            </button>
          ))}
        </div>
      )}

      <section id="inicio" className="hero">
        <div className="hero-media" aria-hidden="true">
          <img src="/images/acai-hero.png" alt="" />
          <div className="hero-scrim" />
        </div>
        <div className="shell hero-content" data-reveal>
          <div className="hero-eyebrow"><span /> PELOTAS · RS <span>FEITO NA HORA</span></div>
          <h1>
            NÃO É SÓ AÇAÍ.<br />
            <em>É O TEU ROXO.</em>
          </h1>
          <p>Açaí cremoso, frutas frescas e combinações feitas do teu jeito. Escolhe as camadas e monta o teu em poucos cliques.</p>
          <div className="hero-actions">
            <button className="btn btn-lime" onClick={() => scrollTo('monte')}>
              Montar meu açaí <ArrowDown size={17} />
            </button>
            <button className="btn btn-glass" onClick={() => scrollTo('favoritos')}>
              Ver os favoritos
            </button>
          </div>
          <div className="hero-proof">
            <div><strong>A partir de</strong><b>R$ 14,90</b></div>
            <div><strong>Você escolhe</strong><b>cada camada</b></div>
            <div><strong>Preparado</strong><b>na hora</b></div>
          </div>
        </div>
        <div className="hero-tag">ROXO 53 · AÇAÍ & BOWLS · ROXO 53 · AÇAÍ & BOWLS ·</div>
      </section>

      <section className="brand-strip" aria-label="Diferenciais">
        <div className="brand-strip-track">
          {['AÇAÍ CREMOSO', 'FRUTA FRESCA', 'CROCÂNCIA', 'CREMES', 'DO TEU JEITO', 'FEITO NA HORA'].map((item) => (
            <span key={item}>{item}<i>53</i></span>
          ))}
        </div>
      </section>

      <section id="favoritos" className="section dark-section">
        <div className="shell">
          <div className="section-head" data-reveal>
            <div>
              <span className="section-number">01 · FAVORITOS DA CASA</span>
              <h2>Começa pelos<br /><em>que não falham.</em></h2>
            </div>
            <p>Três combinações equilibradas para pedir rápido: fruta fresca, textura cremosa e crocância na medida.</p>
          </div>

          <div className="featured-grid">
            {products.slice(0, 3).map((product, index) => (
              <article className={`featured-card featured-card-${index + 1}`} key={product.id} data-reveal>
                <div className="featured-image">
                  <img src={product.image} alt={product.name} style={{ objectPosition: product.position || 'center' }} />
                  <span className="product-badge">{product.badge}</span>
                  <span className="product-index">0{index + 1}</span>
                </div>
                <div className="featured-copy">
                  <span>{product.kicker}</span>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <div>
                    <strong>{money(product.price)}</strong>
                    <button onClick={() => addToCart(product)} aria-label={`Adicionar ${product.name}`}><Plus size={20} /></button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="editorial" data-reveal>
        <div className="editorial-photo">
          <img src="/images/acai-closeup.png" alt="Açaí em camadas com frutas e creme" />
        </div>
        <div className="editorial-panel">
          <span className="section-number">02 · CAMADA POR CAMADA</span>
          <h2>Cremoso.<br />Fresco.<br /><em>Irresistível.</em></h2>
          <p>Da base de açaí aos complementos, cada camada entra para equilibrar sabor, textura e aquela vontade de repetir.</p>
          <div className="editorial-signature">ROXO / 53</div>
        </div>
      </section>

      <section id="monte" className="section builder-section">
        <div className="shell">
          <div className="section-head light-head" data-reveal>
            <div>
              <span className="section-number">03 · ROXO LAB</span>
              <h2>Monte o teu.<br /><em>Do teu jeito.</em></h2>
            </div>
            <p>Escolhe o tamanho, combina frutas, crocâncias e cremes, e acompanha o valor enquanto monta.</p>
          </div>

          <div className="builder" data-reveal>
            <div className="builder-options">
              <BuilderGroup number="01" title="Tamanho">
                <div className="size-grid">
                  {sizes.map((item) => (
                    <button key={item.name} className={size.name === item.name ? 'size-card active' : 'size-card'} onClick={() => setSize(item)}>
                      <span>{item.name}</span><strong>{money(item.extra)}</strong>
                    </button>
                  ))}
                </div>
              </BuilderGroup>

              <BuilderGroup number="02" title="Frutas">
                <ChoiceGrid items={fruits} selected={choices} onToggle={toggleChoice} />
              </BuilderGroup>

              <BuilderGroup number="03" title="Crocância">
                <ChoiceGrid items={crunch} selected={choices} onToggle={toggleChoice} />
              </BuilderGroup>

              <BuilderGroup number="04" title="Cremes">
                <ChoiceGrid items={creams} selected={choices} onToggle={toggleChoice} />
              </BuilderGroup>
            </div>

            <aside className="builder-summary">
              <div className="summary-top">
                <span>SEU ROXO</span>
                <Sparkles size={20} />
              </div>
              <div className="summary-visual">
                <img src="/images/acai-bowl.png" alt="Bowl de açaí" />
                <div className="summary-size">{size.name}</div>
              </div>
              <div className="summary-price">
                <span>Total</span><strong>{money(customTotal)}</strong>
              </div>
              <div className="summary-list">
                <span>SUAS CAMADAS</span>
                {choices.length ? (
                  <div>{choices.map((item) => <b key={item.name}>{item.name}</b>)}</div>
                ) : (
                  <p>Escolhe frutas, crocâncias e cremes para personalizar.</p>
                )}
              </div>
              <button className="btn btn-dark full" onClick={addCustom}>Adicionar ao pedido <ShoppingBag size={17} /></button>
              <small>O total é atualizado conforme as escolhas do teu bowl.</small>
            </aside>
          </div>
        </div>
      </section>

      <section id="cardapio" className="section menu-section">
        <div className="shell">
          <div className="section-head menu-head" data-reveal>
            <div>
              <span className="section-number">04 · CARDÁPIO</span>
              <h2>Escolhe fácil.<br /><em>Pede melhor.</em></h2>
            </div>
            <div className="menu-tabs" role="tablist">
              {(['Favoritos', 'Combos', 'Bebidas'] as Category[]).map((item) => (
                <button role="tab" aria-selected={category === item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)} key={item}>{item}</button>
              ))}
            </div>
          </div>

          <div className="menu-cards" data-reveal>
            {visibleProducts.map((product) => (
              <article className="menu-card" key={product.id}>
                <div className="menu-card-photo"><img src={product.image} alt={product.name} style={{ objectPosition: product.position || 'center' }} loading="lazy" /></div>
                <div className="menu-card-copy">
                  <span>{product.kicker}</span>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <div><strong>{money(product.price)}</strong><button onClick={() => addToCart(product)}>Adicionar <Plus size={16} /></button></div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="experience-section">
        <div className="shell experience-grid">
          <div className="experience-copy" data-reveal>
            <span className="section-number">05 · DO CLIQUE À COLHER</span>
            <h2>Seu pedido<br />sem<br /><em>complicação.</em></h2>
            <div className="steps">
              <Step number="01" title="Escolhe" text="Vai nos favoritos ou monta o teu do zero." />
              <Step number="02" title="Confere" text="Revê os itens, quantidades e o total do pedido." />
              <Step number="03" title="Finaliza" text="Deixa tudo pronto para seguir pelo canal de atendimento da loja." />
            </div>
          </div>
          <div className="experience-photo" data-reveal>
            <img src="https://images.pexels.com/photos/12273052/pexels-photo-12273052.jpeg?auto=compress&cs=tinysrgb&w=1500" alt="Bowl de açaí com frutas e granola" />
            <div className="floating-note"><Star size={15} fill="currentColor" /> fruta fresca + textura cremosa</div>
          </div>
        </div>
      </section>

      <section id="loja" className="store-section">
        <div className="shell store-grid" data-reveal>
          <div className="store-card">
            <span className="section-number">PELOTAS · RS</span>
            <h2>ROXO 53</h2>
            <p>Açaí preparado na hora, combinações da casa e liberdade para montar cada camada do teu jeito.</p>
            <div className="store-info">
              <div><MapPin size={20} /><span>Pelotas, Rio Grande do Sul<small>Retirada + delivery</small></span></div>
              <div><Clock3 size={20} /><span>18h — 23h<small>Todos os dias</small></span></div>
            </div>
            <button className="btn btn-lime" onClick={() => setDrawerOpen(true)}>Começar pedido <ArrowRight size={17} /></button>
          </div>
          <div className="store-poster">
            <span>53</span>
            <p>DO TEU JEITO.<br />ATÉ A ÚLTIMA<br /><strong>COLHERADA.</strong></p>
          </div>
        </div>
      </section>

      <section className="final-cta" data-reveal>
        <div className="final-image"><img src="/images/acai-bowl.png" alt="Açaí ROXO 53" /></div>
        <div className="final-text">
          <span>FOME DECIDIDA?</span>
          <h2>Então vai<br /><em>de roxo.</em></h2>
          <button className="btn btn-dark" onClick={() => setDrawerOpen(true)}>Fazer pedido <ArrowRight size={17} /></button>
        </div>
      </section>

      <footer>
        <div className="shell footer-grid">
          <div className="footer-brand"><strong>ROXO 53</strong><span>AÇAÍ & BOWLS</span></div>
          <p>Açaí cremoso, frutas frescas e combinações feitas do teu jeito. Do primeiro clique à última colherada.</p>
          <div className="footer-credit">DESENVOLVIDO POR YAGHO</div>
        </div>
      </footer>

      <button className={cartCount ? 'floating-cart visible' : 'floating-cart'} onClick={() => setDrawerOpen(true)}>
        <ShoppingBag size={18} /><span>{cartCount} {cartCount === 1 ? 'item' : 'itens'}</span><strong>{money(cartTotal)}</strong>
      </button>

      {drawerOpen && (
        <CartDrawer
          items={cart}
          total={cartTotal}
          ready={checkoutReady}
          onClose={() => setDrawerOpen(false)}
          onQuantity={updateQuantity}
          onCheckout={() => setCheckoutReady(true)}
          onContinue={() => {
            setDrawerOpen(false)
            requestAnimationFrame(() => scrollTo('cardapio'))
          }}
        />
      )}
    </main>
  )
}

function BuilderGroup({ number, title, children }: { number: string; title: string; children: ReactNode }) {
  return (
    <section className="builder-group">
      <div className="builder-group-title"><span>{number}</span><h3>{title}</h3></div>
      {children}
    </section>
  )
}

function ChoiceGrid({ items, selected, onToggle }: { items: Choice[]; selected: Choice[]; onToggle: (item: Choice) => void }) {
  return (
    <div className="choice-grid">
      {items.map((item) => {
        const active = selected.some((choice) => choice.name === item.name)
        return (
          <button key={item.name} className={active ? 'choice active' : 'choice'} onClick={() => onToggle(item)}>
            <span className="choice-check">{active ? <Check size={14} /> : <Plus size={14} />}</span>
            <span>{item.name}</span>
            <small>{item.extra ? `+ ${money(item.extra)}` : 'incluso'}</small>
          </button>
        )
      })}
    </div>
  )
}

function Step({ number, title, text }: { number: string; title: string; text: string }) {
  return (
    <div className="step">
      <span>{number}</span>
      <div><h3>{title}</h3><p>{text}</p></div>
    </div>
  )
}

function CartDrawer({
  items,
  total,
  ready,
  onClose,
  onQuantity,
  onCheckout,
  onContinue,
}: {
  items: CartItem[]
  total: number
  ready: boolean
  onClose: () => void
  onQuantity: (id: string, amount: number) => void
  onCheckout: () => void
  onContinue: () => void
}) {
  return (
    <div className="drawer-layer" role="dialog" aria-modal="true" aria-label="Seu pedido">
      <button className="drawer-backdrop" onClick={onClose} aria-label="Fechar carrinho" />
      <aside className="drawer">
        <div className="drawer-head">
          <div><span>ROXO 53</span><h2>Seu pedido</h2></div>
          <button onClick={onClose} aria-label="Fechar"><X size={22} /></button>
        </div>

        <div className="drawer-body">
          {items.length === 0 ? (
            <div className="empty-cart">
              <div><ShoppingBag size={28} /></div>
              <h3>Ainda tá vazio.</h3>
              <p>Escolhe um favorito ou monta teu açaí do zero.</p>
              <button className="btn btn-dark" onClick={onContinue}>Ver cardápio <ArrowRight size={16} /></button>
            </div>
          ) : (
            <>
              <div className="cart-list">
                {items.map((item) => (
                  <article className="cart-item" key={item.id}>
                    <div className="cart-thumb"><img src={item.image} alt="" /></div>
                    <div className="cart-copy">
                      <span>{item.kicker}</span>
                      <h3>{item.name}</h3>
                      <p>{item.description}</p>
                      <strong>{money(item.price)}</strong>
                    </div>
                    <div className="quantity">
                      <button onClick={() => onQuantity(item.id, -1)} aria-label="Diminuir"><Minus size={14} /></button>
                      <span>{item.quantity}</span>
                      <button onClick={() => onQuantity(item.id, 1)} aria-label="Aumentar"><Plus size={14} /></button>
                    </div>
                  </article>
                ))}
              </div>

              <div className="drawer-total"><span>Total</span><strong>{money(total)}</strong></div>

              {ready ? (
                <div className="checkout-note">
                  <Check size={18} />
                  <div><strong>Pedido revisado.</strong><p>Os itens estão organizados e prontos para seguir pelo canal de atendimento da loja.</p></div>
                </div>
              ) : (
                <button className="btn btn-dark full" onClick={onCheckout}>Revisar pedido <ArrowRight size={17} /></button>
              )}
              <button className="continue-link" onClick={onContinue}>Continuar escolhendo</button>
            </>
          )}
        </div>
      </aside>
    </div>
  )
}