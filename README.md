# Color Sort Puzzle 🧪✨

A polished, modern Water / Color Sort Puzzle game built with vanilla HTML5, CSS3, and JavaScript. Zero external dependencies, fully playable offline in any web browser.

![Color Sort Puzzle Screenshot](https://raw.githubusercontent.com/Srigan17/ColorSort/main/screenshot.png) *(Optional preview)*

## 🎮 Features

- **100+ Solvable Levels**: Procedurally generated with guaranteed solvability across 4 difficulty tiers (Easy, Medium, Hard, Expert).
- **Realistic Pour Physics & Animations**: 3D glass tilting, fluid stream dynamics, meniscus liquid curves, and particle effects.
- **Smart Hint System**: Built-in BFS solver analyzes the board in real time to recommend the next best move.
- **Audio Synthesizer**: Native Web Audio API sound effects for pouring, glass selection, invalid moves, and victory fanfare without any audio assets.
- **Modern Glassmorphism UI**: Glowing dark theme, star ratings, and celebratory confetti upon level completion.
- **Accessibility & Controls**: Full keyboard navigation, screen reader support (`aria-live`), and toggleable colorblind symbols.
- **Move Tracking & Timer**: Keep track of your time, moves, and beat your best scores.

## 🕹️ How to Play

1. Click or tap a glass to select it.
2. Click or tap another glass to pour the top liquid layer into it.
3. You can only pour if:
   - The destination glass has available space, AND
   - The destination glass is empty OR its top color matches the pouring liquid.
4. Sort all colors so each glass contains only one single color (or is left completely empty) to win!

### Keyboard Shortcuts
- **Arrow Keys**: Move focus between glasses
- **Enter / Space**: Select / Pour
- **U / Ctrl+Z**: Undo move
- **H**: Get a hint
- **R**: Restart current level
- **P**: Pause / Resume
- **M**: Mute / Unmute sound
- **Esc**: Close modals

## 🚀 Getting Started

Simply clone or download this repository and open `index.html` in your favorite web browser:

```bash
git clone https://github.com/Srigan17/ColorSort.git
cd ColorSort
# Open index.html directly
```

## 🛠️ Built With

- **HTML5**
- **CSS3** (Custom Properties, Glassmorphism, 3D Transforms)
- **Vanilla JavaScript** (ES6+, Web Audio API, Canvas 2D)

## 📄 License

This project is licensed under the MIT License.
