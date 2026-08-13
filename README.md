# 🕹️ ARKADE — Space Blaster

A retro-styled arcade space shooter built entirely with **React**, **TypeScript**, **Vite**, and **CSS** — no canvas, no sprites, just pure CSS alien spaceships and neon effects!

![Arkade Screenshot](https://img.shields.io/badge/Game-ARKADE%20Space%20Blaster-ff2d95?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHRleHQgeT0iMTgiIGZvbnQtc2l6ZT0iMTgiPvCflrk8L3RleHQ+PC9zdmc+)

## ✨ Features

- 🚀 **Pure CSS spaceships** — player & enemies are hand-crafted with clip-paths, gradients & glows
- 👾 **4 alien ship types** — Scout Saucers, Interceptors, Heavy Cruisers, and Mothership Bosses
- 🌊 **Wave-based gameplay** — progressive difficulty with boss fights every 5 waves
- 💥 **Particle explosions** — satisfying CSS-animated destruction effects
- 🔥 **Power-ups** — Health, Rapid Fire, Spread Shot, Shield
- 🏆 **Combo system** — chain kills for massive score multipliers
- 📺 **CRT retro effects** — scanlines, screen shake, neon glow
- 🎮 **Keyboard controls** — WASD/Arrow Keys + Space
- 💾 **Persistent high scores** — saved to localStorage
- 📱 **Responsive** — scales to fit any screen

## 🎮 Controls

| Key | Action |
|---|---|
| `W` `A` `S` `D` / `↑` `←` `↓` `→` | Move ship |
| `Space` | Shoot |
| `P` / `Escape` | Pause |

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- npm or yarn

### Install & Run

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/arkade-space-blaster.git
cd arkade-space-blaster

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## 📦 Deploy to GitHub Pages

### Option 1: GitHub Actions (Recommended)

1. Push this project to a GitHub repository
2. Go to **Settings → Pages → Source** → select **GitHub Actions**
3. Create the file `.github/workflows/deploy.yml` (already included below)
4. Push — your game will be live at `https://YOUR_USERNAME.github.io/arkade-space-blaster/`

### Option 2: Manual Deploy

```bash
npm run build
# The built files are in the dist/ folder
# Upload dist/ contents to any static host
```

## 🛸 Enemy Types

| Ship | Type | Behavior |
|---|---|---|
| 🟢 Scout Saucer | Grunt | Patrols left-right, descends slowly |
| 🟡 Interceptor | Zigzag | Fast sine-wave movement, occasional shots |
| 🔴 Heavy Cruiser | Tank | Armoured, fires at player |
| 🟣 Mothership | Boss | Massive HP, triple shots, appears every 5 waves |

## 🛠️ Tech Stack

- **React 19** — UI rendering
- **TypeScript** — type safety
- **Vite** — fast bundling
- **Tailwind CSS 4** — utility styles
- **Pure CSS** — all game visuals (no canvas/WebGL)

## 📁 Project Structure

```
src/
├── App.tsx              # Entry point
├── Game.tsx             # Main game logic & loop
├── types.ts             # TypeScript interfaces
├── hooks/
│   ├── useGameLoop.ts   # requestAnimationFrame loop
│   └── useInput.ts      # Keyboard input handler
├── components/
│   ├── StarField.tsx    # Animated star background
│   ├── Player.tsx       # CSS player spaceship
│   ├── EnemySprite.tsx  # CSS alien spaceships (4 types)
│   ├── HUD.tsx          # Score, lives, wave, power-ups
│   ├── MenuScreen.tsx   # Title screen
│   ├── PauseScreen.tsx  # Pause overlay
│   └── GameOverScreen.tsx # Game over with stats
└── index.css            # Animations & neon effects
```

## 📄 License

MIT — feel free to use, modify, and share!

---

<p align="center">
  Made with ❤️ for GitHub<br/>
  <strong>⭐ Star this repo if you enjoyed the game!</strong>
</p>
