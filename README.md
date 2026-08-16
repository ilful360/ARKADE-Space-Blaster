# 🕹️ ARKADE — Space Blaster

A retro-styled browser space shooter built with **React, TypeScript, Vite, and Tailwind CSS**.

**Play online:** https://ilful360.github.io/ARKADE-Space-Blaster/

## ✨ Features

- 🚀 CSS-built player and enemy spaceships
- 👾 Multiple enemy types
- 🌊 Wave-based gameplay
- 👑 Boss encounters
- 💥 Arcade-style visual effects
- ⚡ Power-ups
- 🔥 Combo scoring
- 🏆 Persistent high scores
- 📺 Retro CRT / neon-inspired effects
- 📱 Responsive browser interface
- ⏸️ Pause and resume gameplay
- 🔊 Browser-generated sound effects

## 🎮 Controls

| Key | Action |
|---|---|
| `W` / `↑` | Move up |
| `A` / `←` | Move left |
| `S` / `↓` | Move down |
| `D` / `→` | Move right |
| `Space` | Shoot |
| `P` / `Escape` | Pause |

## 🛠️ Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- CSS animations and effects
- Browser `localStorage` for high scores
- Web Audio API for sound effects

## 🚀 Run Locally

### Requirements

- Node.js 18+
- npm
- A modern web browser

### Clone

```bash
git clone https://github.com/ilful360/ARKADE-Space-Blaster.git
cd ARKADE-Space-Blaster
```

### Install dependencies

```bash
npm ci
```

### Start development server

```bash
npm run dev
```

Open the local URL shown by Vite.

### Validate the project

```bash
npm run typecheck
npm run build
```

Or run both checks together:

```bash
npm run check
```

### Preview the production build

```bash
npm run preview
```

## 📁 Project Structure

```text
ARKADE-Space-Blaster/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   ├── workflows/
│   ├── dependabot.yml
│   └── PULL_REQUEST_TEMPLATE.md
├── public/
├── src/
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   └── ...
├── .gitignore
├── CONTRIBUTING.md
├── LICENSE
├── README.md
├── SECURITY.md
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
└── vite.config.ts
```

## 🌐 GitHub Pages

The project is configured as a GitHub Pages project site at:

**https://ilful360.github.io/ARKADE-Space-Blaster/**

The included GitHub Actions workflow installs the locked dependencies, type-checks the source, builds the Vite production site, uploads `dist/`, and deploys it to GitHub Pages.

In GitHub, make sure **Settings → Pages → Source** is set to **GitHub Actions**.

## 🐛 Reporting Issues

Use GitHub Issues for bugs and feature requests. For a bug report, include what happened, steps to reproduce, expected behaviour, browser/OS information, and screenshots or console errors when useful.

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development and pull request guidelines.

## 📄 License

This project is licensed under the **MIT License**. See [LICENSE](LICENSE).

## 👤 Author

**MD Ilful Hossain**

GitHub: https://github.com/ilful360

---

⭐ If you enjoy the game, consider starring the repository!
