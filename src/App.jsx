import { useState, useEffect, useRef } from 'react'
import './App.css'

const SKILLS = {
  Frontend: ['React', 'Vite', 'TypeScript', 'Tailwind', 'Framer Motion'],
  Backend: ['Python', 'FastAPI', 'Django', 'PostgreSQL', 'Redis', 'REST API'],
  'Mini Apps': ['Telegram Bot API', 'Telegram Mini App', 'TWA'],
  DevOps: ['Linux', 'Nginx', 'Docker', 'Cloudflare', 'systemd', 'CI/CD'],
}

const CONTACT = [
  { label: 'GitHub', href: 'https://github.com/acided', icon: 'gh' },
  { label: 'Telegram', href: 'https://t.me/acided1', icon: 'tg' },
  { label: 'Email', href: 'mailto:acided.dev@gmail.com', icon: 'email' },
]

function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return [ref, inView]
}

function Noise() {
  return (
    <svg style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', opacity: 0.025, pointerEvents: 'none', zIndex: 0 }}>
      <filter id="noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noise)" />
    </svg>
  )
}

function AnimatedBg() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let W = canvas.width = window.innerWidth
    let H = canvas.height = window.innerHeight
    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight }
    window.addEventListener('resize', resize)

    const NODES = 60
    const nodes = Array.from({ length: NODES }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.5,
    }))

    // Orbs
    const orbs = [
      { x: W * 0.2, y: H * 0.3, vx: 0.15, vy: 0.08, r: 280, color: 'rgba(167,139,250,0.10)' },
      { x: W * 0.8, y: H * 0.7, vx: -0.12, vy: -0.06, r: 220, color: 'rgba(139,92,246,0.07)' },
      { x: W * 0.5, y: H * 0.5, vx: 0.07, vy: -0.13, r: 180, color: 'rgba(196,181,253,0.06)' },
    ]

    let raf
    const draw = () => {
      ctx.clearRect(0, 0, W, H)

      // Grid
      ctx.strokeStyle = 'rgba(167,139,250,0.04)'
      ctx.lineWidth = 0.5
      const gs = 70
      for (let x = 0; x < W; x += gs) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke() }
      for (let y = 0; y < H; y += gs) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke() }

      // Orbs
      orbs.forEach(o => {
        o.x += o.vx; o.y += o.vy
        if (o.x < -o.r || o.x > W + o.r) o.vx *= -1
        if (o.y < -o.r || o.y > H + o.r) o.vy *= -1
        const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r)
        g.addColorStop(0, o.color)
        g.addColorStop(1, 'transparent')
        ctx.fillStyle = g
        ctx.beginPath(); ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2); ctx.fill()
      })

      // Nodes
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy
        if (n.x < 0 || n.x > W) n.vx *= -1
        if (n.y < 0 || n.y > H) n.vy *= -1
      })

      // Connections
      for (let i = 0; i < NODES; i++) {
        for (let j = i + 1; j < NODES; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y
          const dist = Math.sqrt(dx*dx + dy*dy)
          if (dist < 140) {
            ctx.strokeStyle = `rgba(167,139,250,${(1 - dist/140) * 0.18})`
            ctx.lineWidth = 0.6
            ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.stroke()
          }
        }
      }

      // Dots
      nodes.forEach(n => {
        ctx.fillStyle = 'rgba(167,139,250,0.5)'
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill()
      })

      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />
}

function TypingText({ texts, speed = 80 }) {
  const [idx, setIdx] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) { const t = setTimeout(() => setPaused(false), 1800); return () => clearTimeout(t) }
    const current = texts[idx]
    const t = setTimeout(() => {
      if (!deleting) {
        const next = current.slice(0, displayed.length + 1)
        setDisplayed(next)
        if (next === current) { setPaused(true); setDeleting(true) }
      } else {
        const next = displayed.slice(0, -1)
        setDisplayed(next)
        if (next === '') { setDeleting(false); setIdx((idx + 1) % texts.length) }
      }
    }, deleting ? 40 : speed)
    return () => clearTimeout(t)
  }, [displayed, deleting, paused, idx])

  return (
    <span>
      {displayed}
      <span className="cursor">|</span>
    </span>
  )
}

function SkillCard({ category, items, delay = 0 }) {
  const [ref, inView] = useInView()
  const [hovered, setHovered] = useState(null)
  return (
    <div ref={ref} className={`skill-card ${inView ? 'visible' : ''}`} style={{ '--delay': `${delay}ms` }}>
      <div className="skill-cat">{category}</div>
      <div className="skill-tags">
        {items.map((item, i) => (
          <span
            key={item}
            className={`tag ${hovered === i ? 'tag-hover' : ''}`}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

function ContactCard({ label, href, icon }) {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`contact-card ${hovered ? 'contact-hovered' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="contact-icon">
        {icon === 'email' ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2"/>
            <path d="M2 7l10 7 10-7"/>
          </svg>
        ) : icon === 'gh' ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
          </svg>
        )}
      </span>
      <span className="contact-label">{label}</span>
      <span className="contact-arrow">↗</span>
    </a>
  )
}

function FloatingParticles() {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    duration: Math.random() * 15 + 10,
    delay: Math.random() * 10,
    opacity: Math.random() * 0.4 + 0.1,
  }))
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
      {particles.map(p => (
        <div key={p.id} className="particle" style={{
          left: `${p.x}%`, top: `${p.y}%`,
          width: p.size, height: p.size,
          opacity: p.opacity,
          animationDuration: `${p.duration}s`,
          animationDelay: `${p.delay}s`,
        }} />
      ))}
    </div>
  )
}

function StatusDot() {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--green)', fontFamily: 'var(--mono)', letterSpacing: '0.05em' }}>
      <span className="dot-pulse" />
      available for work
    </span>
  )
}


function GhostCursor() {
  const canvasRef = useRef(null)
  const pointsRef = useRef([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    window.addEventListener('resize', resize)

    const onMove = (e) => {
      pointsRef.current.push({ x: e.clientX, y: e.clientY, age: 0 })
      if (pointsRef.current.length > 60) pointsRef.current.shift()
    }
    window.addEventListener('mousemove', onMove)

    let raf
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const pts = pointsRef.current
      if (pts.length > 1) {
        for (let i = 1; i < pts.length; i++) {
          const t = i / pts.length
          const alpha = t * 0.85
          const width = t * 2.5
          ctx.beginPath()
          ctx.moveTo(pts[i - 1].x, pts[i - 1].y)
          ctx.lineTo(pts[i].x, pts[i].y)
          ctx.strokeStyle = `rgba(196,181,253,${alpha})`
          ctx.lineWidth = width
          ctx.lineCap = 'round'
          ctx.lineJoin = 'round'
          ctx.stroke()
        }
        // glow layer
        ctx.save()
        ctx.filter = 'blur(3px)'
        for (let i = Math.max(1, pts.length - 20); i < pts.length; i++) {
          const t = i / pts.length
          ctx.beginPath()
          ctx.moveTo(pts[i - 1].x, pts[i - 1].y)
          ctx.lineTo(pts[i].x, pts[i].y)
          ctx.strokeStyle = `rgba(167,139,250,${t * 0.4})`
          ctx.lineWidth = t * 6
          ctx.stroke()
        }
        ctx.restore()
      }

      pts.forEach(p => p.age++)
      pointsRef.current = pts.filter(p => p.age < 60)
      raf = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 9999, pointerEvents: 'none' }} />
}

function ClickRipple() {
  const canvasRef = useRef(null)
  const ripplesRef = useRef([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    window.addEventListener('resize', resize)

    const onClick = (e) => {
      const x = e.clientX
      const y = e.clientY
      // spawn 3 rings with stagger
      for (let i = 0; i < 3; i++) {
        ripplesRef.current.push({ x, y, r: 0, maxR: 60 + i * 25, age: 0, delay: i * 6 })
      }
    }
    window.addEventListener('click', onClick)

    let raf
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ripplesRef.current.forEach(rp => {
        if (rp.age < rp.delay) { rp.age++; return }
        rp.r += 2.5
        const life = 1 - rp.r / rp.maxR
        if (life <= 0) return
        ctx.beginPath()
        ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(167,139,250,${life * 0.7})`
        ctx.lineWidth = 1.5 * life
        ctx.stroke()
      })
      ripplesRef.current = ripplesRef.current.filter(rp => rp.r < rp.maxR)
      raf = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('click', onClick)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 9998, pointerEvents: 'none' }} />
}
export default function App() {
  const [scrollY, setScrollY] = useState(0)
  const [heroRef, heroInView] = useInView(0.1)

  useEffect(() => {
    const fn = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const heroOpacity = Math.max(0, 1 - scrollY / (window.innerHeight * 0.7))
  const heroTranslate = scrollY * 0.2

  return (
    <div className="app">
      <Noise />
      <AnimatedBg />
      <FloatingParticles />
      <GhostCursor />
      <ClickRipple />

      {/* HERO */}
      <section className="hero" ref={heroRef} style={{ opacity: heroOpacity, transform: `translateY(${heroTranslate}px)` }}>
        <div className="hero-inner">
          <StatusDot />
          <h1 className="hero-name">
            <span className="name-first">Bogdan</span>
            <span className="name-last">Kochkurov</span>
          </h1>
          <div className="hero-role">
            <TypingText texts={['Full Stack Web Developer', 'Python & FastAPI', 'React & Vite', 'Telegram Mini Apps', 'DevOps & Linux']} />
          </div>
          <div className="hero-line" />
          <p className="hero-sub">Building fast, reliable and polished digital products.</p>
        </div>
        <div className="scroll-hint">
          <div className="scroll-mouse">
            <div className="scroll-wheel" />
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section className="section skills-section">
        <div className="section-label">expertise</div>
        <div className="skills-grid">
          {Object.entries(SKILLS).map(([cat, items], i) => (
            <SkillCard key={cat} category={cat} items={items} delay={i * 80} />
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section className="section contact-section">
        <div className="section-label">get in touch</div>
        <h2 className="contact-title">Impressed?<br /><span className="contact-title-accent">Let's build something.</span></h2>
        <div className="contact-cards">
          {CONTACT.map(c => <ContactCard key={c.label} {...c} />)}
        </div>
      </section>

      <footer className="footer">
        <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text3)' }}>
          © 2025 Bogdan Kochkurov — acided.dev
        </span>
      </footer>
    </div>
  )
}
