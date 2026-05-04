<div align="center">

# ✦ acided.dev

**Personal portfolio — Bogdan Kochkurov**

[![Live](https://img.shields.io/badge/live-acided.dev-a78bfa?style=flat-square&logo=vercel&logoColor=white)](https://acided.dev)
[![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)

</div>

---

## Stack

| Layer | Tech |
|-------|------|
| Framework | React 19 + Vite 8 |
| Styling | CSS Variables, Montserrat + JetBrains Mono |
| Animation | Canvas API (network bg, ghost cursor, click ripple) |
| Deploy | Nginx · Debian 12 · Cloudflare |
| CI/CD | GitHub Actions → SSH → VPS |

## Features

- **Animated background** — particle network with floating orbs
- **Ghost cursor** — glowing line trail following the mouse
- **Click ripple** — triple ring burst on every click
- **Scroll parallax** — hero fades and translates on scroll
- **Typing animation** — cycles through roles with typewriter effect
- **Staggered reveals** — skill cards animate in on scroll via IntersectionObserver

## Local dev

```bash
git clone https://github.com/acided/acided.dev
cd acided.dev
npm install
npm run dev
```

Runs on `http://localhost:5173`

## Deploy

```bash
npm run build   # outputs to /dist
```

CI/CD via GitHub Actions — every push to `main` builds and rsyncs `dist/` to the VPS over SSH.

## Contact

| | |
|---|---|
| GitHub | [@acided](https://github.com/acided) |
| Telegram | [@acided1](https://t.me/acided1) |
| Email | acided.dev@gmail.com |

---

<div align="center">
<sub>Built with React · Deployed on a VPS in Kyrgyzstan 🇰🇬</sub>
</div>