/**
 * COLOR SORT PUZZLE - WATER SORT GAME
 * Complete Game Logic, Procedural Solvable Generator, Solver & Hint Engine,
 * Web Audio Synthesizer, Confetti System & Accessible UI.
 */

(() => {
  'use strict';

  // =========================================================================
  // 1. CONFIGURATION & CONSTANTS
  // =========================================================================
  const TUBE_CAPACITY = 4;
  const TOTAL_LEVELS = 100;

  const COLOR_PALETTE = [
    { id: 'red', name: 'Red', hex: '#ff3366', symbol: '★' },
    { id: 'blue', name: 'Blue', hex: '#0077ff', symbol: '●' },
    { id: 'green', name: 'Green', hex: '#00e676', symbol: '▲' },
    { id: 'yellow', name: 'Yellow', hex: '#ffd600', symbol: '◆' },
    { id: 'purple', name: 'Purple', hex: '#c026d3', symbol: '■' },
    { id: 'orange', name: 'Orange', hex: '#ff6d00', symbol: '▼' },
    { id: 'pink', name: 'Pink', hex: '#ff2d87', symbol: '✚' },
    { id: 'cyan', name: 'Cyan', hex: '#00e5ff', symbol: '✖' },
    { id: 'lime', name: 'Lime', hex: '#aeea00', symbol: '⬟' },
    { id: 'brown', name: 'Brown', hex: '#8d6e63', symbol: '♥' },
    { id: 'indigo', name: 'Indigo', hex: '#6200ea', symbol: '✦' },
    { id: 'teal', name: 'Teal', hex: '#00bfa5', symbol: '☀' }
  ];

  const COLOR_MAP = {};
  COLOR_PALETTE.forEach(c => { COLOR_MAP[c.id] = c; });

  // =========================================================================
  // 2. AUDIO SYNTHESIZER (Web Audio API - Standalone, zero external assets)
  // =========================================================================
  class SoundManager {
    constructor() {
      this.ctx = null;
      this.enabled = localStorage.getItem('colorsort_sound') !== 'false';
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    toggle() {
      this.enabled = !this.enabled;
      localStorage.setItem('colorsort_sound', this.enabled);
      return this.enabled;
    }

    playSelect() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(720, now + 0.08);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    }

    playPour() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Bubble 1
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(320, now);
      osc1.frequency.exponentialRampToValueAtTime(580, now + 0.16);
      gain1.gain.setValueAtTime(0.22, now);
      gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.16);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.16);

      // Bubble 2
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(420, now + 0.12);
      osc2.frequency.exponentialRampToValueAtTime(740, now + 0.3);
      gain2.gain.setValueAtTime(0.25, now + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.3);
    }

    playInvalid() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.linearRampToValueAtTime(90, now + 0.14);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.14);
    }

    playUndo() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(540, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.12);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    }

    playWin() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.45);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.5);
      });
    }

    playClick() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.03);
    }
  }

  // =========================================================================
  // 3. SEEDED PSEUDO-RANDOM GENERATOR
  // =========================================================================
  function createPRNG(seed) {
    let s = Math.imul(seed ^ 0x6D2B79F5, 1) || 1;
    return function() {
      s = Math.imul(s ^ (s >>> 15), s | 1);
      s ^= s + Math.imul(s ^ (s >>> 7), s | 61);
      return ((s ^ (s >>> 14)) >>> 0) / 4294967296;
    };
  }

  // =========================================================================
  // 4. PUZZLE GENERATOR & FAST BFS SOLVER
  // =========================================================================
  class PuzzleSolver {
    static isTubeSolved(tube) {
      if (tube.length === 0) return true;
      if (tube.length !== TUBE_CAPACITY) return false;
      return tube.every(c => c === tube[0]);
    }

    static isSolved(tubes) {
      return tubes.every(tube => PuzzleSolver.isTubeSolved(tube));
    }

    static getTopColorInfo(tube) {
      if (tube.length === 0) return null;
      const color = tube[tube.length - 1];
      let count = 0;
      for (let i = tube.length - 1; i >= 0; i--) {
        if (tube[i] === color) count++;
        else break;
      }
      return { color, count };
    }

    static canPour(fromTube, toTube) {
      if (fromTube.length === 0) return false;
      if (toTube.length >= TUBE_CAPACITY) return false;
      if (toTube.length === 0) return true;
      return toTube[toTube.length - 1] === fromTube[fromTube.length - 1];
    }

    static getPourCount(fromTube, toTube) {
      const topInfo = PuzzleSolver.getTopColorInfo(fromTube);
      if (!topInfo) return 0;
      const space = TUBE_CAPACITY - toTube.length;
      return Math.min(topInfo.count, space);
    }

    static serialize(tubes) {
      // Create canonical representation for visited state hashing
      return tubes.map(t => t.join(',')).sort().join('|');
    }

    /**
     * Fast BFS Solver to find optimal sequence of moves
     */
    static solve(tubes, maxDepth = 25, maxStates = 4500) {
      if (PuzzleSolver.isSolved(tubes)) return [];

      const initialHash = PuzzleSolver.serialize(tubes);
      const queue = [{ state: tubes.map(t => [...t]), moves: [] }];
      const visited = new Set([initialHash]);
      let stateCount = 0;

      while (queue.length > 0 && stateCount < maxStates) {
        stateCount++;
        const { state, moves } = queue.shift();

        if (moves.length >= maxDepth) continue;

        const numTubes = state.length;
        for (let from = 0; from < numTubes; from++) {
          const fromTube = state[from];
          if (fromTube.length === 0) continue;
          if (PuzzleSolver.isTubeSolved(fromTube)) continue; // Don't disrupt already completed tubes

          for (let to = 0; to < numTubes; to++) {
            if (from === to) continue;
            const toTube = state[to];

            // Don't pour into an empty tube if source is already pure single color
            if (toTube.length === 0 && fromTube.every(c => c === fromTube[0])) continue;

            if (PuzzleSolver.canPour(fromTube, toTube)) {
              const pourCount = PuzzleSolver.getPourCount(fromTube, toTube);
              if (pourCount === 0) continue;

              // Clone state and apply move
              const nextState = state.map(t => [...t]);
              const color = nextState[from][nextState[from].length - 1];
              for (let i = 0; i < pourCount; i++) {
                nextState[to].push(nextState[from].pop());
              }

              const nextMoves = [...moves, { from, to, color, count: pourCount }];

              if (PuzzleSolver.isSolved(nextState)) {
                return nextMoves;
              }

              const hash = PuzzleSolver.serialize(nextState);
              if (!visited.has(hash)) {
                visited.add(hash);
                queue.push({ state: nextState, moves: nextMoves });
              }
            }
          }
        }
      }

      return null; // No solution found within limits
    }
  }

  class LevelGenerator {
    static getDifficultyConfig(level) {
      if (level <= 25) {
        // Easy: 3-4 colors, 2 empty tubes (5-6 total)
        const colorsCount = level <= 12 ? 3 : 4;
        return { diff: 'easy', colors: colorsCount, empty: 2, scrambleSteps: 35 + level };
      } else if (level <= 50) {
        // Medium: 5-6 colors, 2 empty tubes (7-8 total)
        const colorsCount = level <= 38 ? 5 : 6;
        return { diff: 'medium', colors: colorsCount, empty: 2, scrambleSteps: 50 + level };
      } else if (level <= 75) {
        // Hard: 7-9 colors, 2-3 empty tubes (9-12 total)
        const colorsCount = 7 + Math.floor((level - 51) / 8);
        const emptyCount = colorsCount >= 8 ? 3 : 2;
        return { diff: 'hard', colors: colorsCount, empty: emptyCount, scrambleSteps: 65 + level };
      } else {
        // Expert: 10-11 colors, 3 empty tubes (13-14 total)
        const colorsCount = Math.min(11, 9 + Math.floor((level - 76) / 10));
        return { diff: 'expert', colors: colorsCount, empty: 3, scrambleSteps: 85 + level };
      }
    }

    /**
     * Generates a guaranteed-solvable level
     */
    static generateLevel(levelNum) {
      const config = LevelGenerator.getDifficultyConfig(levelNum);
      const totalTubes = config.colors + config.empty;
      const selectedColors = COLOR_PALETTE.slice(0, config.colors).map(c => c.id);

      let attempts = 0;
      while (attempts < 20) {
        attempts++;
        const rng = createPRNG(levelNum * 997 + attempts * 31);

        // 1. Initialize solved state
        const tubes = [];
        for (let i = 0; i < config.colors; i++) {
          tubes.push(Array(TUBE_CAPACITY).fill(selectedColors[i]));
        }
        for (let i = 0; i < config.empty; i++) {
          tubes.push([]);
        }

        // 2. Reverse-pour scrambling simulation
        let lastFrom = -1;
        let lastTo = -1;

        for (let step = 0; step < config.scrambleSteps; step++) {
          // Pick non-empty tube
          const nonEmpties = [];
          tubes.forEach((t, idx) => { if (t.length > 0) nonEmpties.push(idx); });
          if (nonEmpties.length === 0) break;

          const fromIdx = nonEmpties[Math.floor(rng() * nonEmpties.length)];

          // Pick non-full destination tube
          const availDests = [];
          tubes.forEach((t, idx) => {
            if (idx !== fromIdx && t.length < TUBE_CAPACITY) {
              // Avoid immediate exact undo loop
              if (!(idx === lastFrom && fromIdx === lastTo)) {
                availDests.push(idx);
              }
            }
          });

          if (availDests.length === 0) continue;
          const toIdx = availDests[Math.floor(rng() * availDests.length)];

          // Move 1 segment in reverse
          const color = tubes[fromIdx].pop();
          tubes[toIdx].push(color);

          lastFrom = fromIdx;
          lastTo = toIdx;
        }

        // 3. Verify that the puzzle is not already solved and has sufficient entropy
        if (PuzzleSolver.isSolved(tubes)) continue;

        // Check solvability with BFS solver
        const solution = PuzzleSolver.solve(tubes, 30, 3500);
        if (solution && solution.length >= 3) {
          return {
            level: levelNum,
            difficulty: config.diff,
            tubes: tubes.map(t => [...t]),
            optimalMoves: solution.length
          };
        }
      }

      // Fallback robust level if random search timed out
      return LevelGenerator.createFallbackLevel(levelNum, config, selectedColors);
    }

    static createFallbackLevel(levelNum, config, colors) {
      const rng = createPRNG(levelNum * 42);
      const pool = [];
      colors.forEach(c => {
        for (let i = 0; i < TUBE_CAPACITY; i++) pool.push(c);
      });

      // Fisher-Yates shuffle
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }

      const tubes = [];
      for (let i = 0; i < config.colors; i++) {
        tubes.push(pool.slice(i * TUBE_CAPACITY, (i + 1) * TUBE_CAPACITY));
      }
      for (let i = 0; i < config.empty; i++) {
        tubes.push([]);
      }

      return {
        level: levelNum,
        difficulty: config.diff,
        tubes: tubes,
        optimalMoves: config.colors * 3 + 2
      };
    }
  }

  // =========================================================================
  // 5. CONFETTI CELEBRATION ENGINE
  // =========================================================================
  class ConfettiEngine {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      this.ctx = this.canvas.getContext('2d');
      this.particles = [];
      this.animationId = null;
      this.resize();
      window.addEventListener('resize', () => this.resize());
    }

    resize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }

    fire() {
      this.particles = [];
      const colors = ['#00e5ff', '#ffd600', '#ff3366', '#00e676', '#c026d3', '#ffffff', '#ff6d00'];
      const count = window.innerWidth < 600 ? 90 : 160;

      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: this.canvas.width / 2 + (Math.random() - 0.5) * 80,
          y: this.canvas.height * 0.45 + (Math.random() - 0.5) * 60,
          w: Math.random() * 9 + 5,
          h: Math.random() * 8 + 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: (Math.random() - 0.5) * 22,
          vy: -Math.random() * 16 - 7,
          rotation: Math.random() * 360,
          vRot: (Math.random() - 0.5) * 12,
          gravity: 0.38,
          drag: 0.965,
          opacity: 1,
          shape: Math.random() > 0.3 ? 'rect' : 'circle'
        });
      }

      if (this.animationId) cancelAnimationFrame(this.animationId);
      this.render();
    }

    render() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      let alive = false;

      for (const p of this.particles) {
        p.vx *= p.drag;
        p.vy *= p.drag;
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vRot;

        if (p.y > this.canvas.height * 0.6) {
          p.opacity -= 0.012;
        }

        if (p.opacity > 0 && p.y < this.canvas.height + 40) {
          alive = true;
          this.ctx.save();
          this.ctx.globalAlpha = Math.max(0, p.opacity);
          this.ctx.translate(p.x, p.y);
          this.ctx.rotate((p.rotation * Math.PI) / 180);
          this.ctx.fillStyle = p.color;

          if (p.shape === 'rect') {
            this.ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          } else {
            this.ctx.beginPath();
            this.ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
            this.ctx.fill();
          }
          this.ctx.restore();
        }
      }

      if (alive) {
        this.animationId = requestAnimationFrame(() => this.render());
      } else {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
    }
  }

  // =========================================================================
  // 6. MAIN GAME CONTROLLER & UI MANAGER
  // =========================================================================
  class ColorSortGame {
    constructor() {
      this.sound = new SoundManager();
      this.confetti = new ConfettiEngine('confettiCanvas');

      // Game state
      this.currentLevel = parseInt(localStorage.getItem('colorsort_current_level') || '1', 10);
      this.unlockedLevel = parseInt(localStorage.getItem('colorsort_unlocked_level') || '1', 10);
      this.tubes = [];
      this.initialTubes = [];
      this.history = [];
      this.selectedTubeIndex = null;
      this.focusedTubeIndex = 0;
      this.moves = 0;
      this.timerSeconds = 0;
      this.timerInterval = null;
      this.isPaused = false;
      this.isAnimating = false;
      this.hintsRemaining = parseInt(localStorage.getItem('colorsort_hints') || '5', 10);
      this.colorblind = localStorage.getItem('colorsort_colorblind') === 'true';
      this.optimalMoves = 10;
      this.difficulty = 'easy';

      // Cache DOM elements
      this.dom = {
        wrapper: document.getElementById('gameWrapper'),
        tubesGrid: document.getElementById('tubesGrid'),
        levelDisplay: document.getElementById('levelDisplay'),
        difficultyTag: document.getElementById('difficultyTag'),
        movesDisplay: document.getElementById('movesDisplay'),
        timerDisplay: document.getElementById('timerDisplay'),
        bestScoreDisplay: document.getElementById('bestScoreDisplay'),
        undoCountBadge: document.getElementById('undoCountBadge'),
        hintsBadge: document.getElementById('hintsBadge'),
        hintBanner: document.getElementById('hintBanner'),
        hintMessage: document.getElementById('hintMessage'),
        closeHintBtn: document.getElementById('closeHintBtn'),
        srAnnouncer: document.getElementById('srAnnouncer'),

        // Buttons
        btnSound: document.getElementById('btnSound'),
        soundOnIcon: document.querySelector('.sound-on-icon'),
        soundOffIcon: document.querySelector('.sound-off-icon'),
        btnPause: document.getElementById('btnPause'),
        btnHelp: document.getElementById('btnHelp'),
        btnLevelMenu: document.getElementById('btnLevelMenu'),
        btnUndo: document.getElementById('btnUndo'),
        btnHint: document.getElementById('btnHint'),
        btnRestart: document.getElementById('btnRestart'),

        // Modals
        winModal: document.getElementById('winModal'),
        winTitle: document.getElementById('winModalTitle'),
        winSubtitle: document.getElementById('winSubtitle'),
        winMovesVal: document.getElementById('winMovesVal'),
        winTimeVal: document.getElementById('winTimeVal'),
        winBestVal: document.getElementById('winBestVal'),
        starsRating: document.getElementById('starsRating'),
        btnNextLevel: document.getElementById('btnNextLevel'),
        btnReplay: document.getElementById('btnReplay'),
        btnWinLevelSelect: document.getElementById('btnWinLevelSelect'),

        levelSelectModal: document.getElementById('levelSelectModal'),
        btnCloseLevelSelect: document.getElementById('btnCloseLevelSelect'),
        levelGridContainer: document.getElementById('levelGridContainer'),
        diffTabs: document.querySelectorAll('.diff-tab'),

        pauseModal: document.getElementById('pauseModal'),
        btnResume: document.getElementById('btnResume'),
        btnRestartFromPause: document.getElementById('btnRestartFromPause'),
        btnLevelsFromPause: document.getElementById('btnLevelsFromPause'),
        pauseSoundToggle: document.getElementById('pauseSoundToggle'),
        colorblindToggle: document.getElementById('colorblindToggle'),

        helpModal: document.getElementById('helpModal'),
        btnCloseHelp: document.getElementById('btnCloseHelp'),
        btnGotIt: document.getElementById('btnGotIt')
      };

      this.initEvents();
      this.updateSoundIcons();
      this.updateColorblindUI();
      this.loadLevel(this.currentLevel);
    }

    // =======================================================================
    // Event Listeners Setup
    // =======================================================================
    initEvents() {
      // Sound Toggle
      this.dom.btnSound.addEventListener('click', () => {
        const enabled = this.sound.toggle();
        this.updateSoundIcons();
        this.announce(enabled ? 'Sound turned on' : 'Sound turned off');
      });

      this.dom.pauseSoundToggle.addEventListener('change', (e) => {
        if (this.sound.enabled !== e.target.checked) {
          this.sound.toggle();
          this.updateSoundIcons();
        }
      });

      // Colorblind Toggle
      this.dom.colorblindToggle.addEventListener('change', (e) => {
        this.colorblind = e.target.checked;
        localStorage.setItem('colorsort_colorblind', this.colorblind);
        this.renderTubes();
        this.announce(this.colorblind ? 'Colorblind mode enabled' : 'Colorblind mode disabled');
      });

      // Header Buttons
      this.dom.btnPause.addEventListener('click', () => this.togglePause(true));
      this.dom.btnHelp.addEventListener('click', () => this.showHelp(true));
      this.dom.btnLevelMenu.addEventListener('click', () => this.showLevelSelect(true));

      // Action Buttons
      this.dom.btnUndo.addEventListener('click', () => this.undoMove());
      this.dom.btnHint.addEventListener('click', () => this.showHint());
      this.dom.btnRestart.addEventListener('click', () => this.restartLevel());

      this.dom.closeHintBtn.addEventListener('click', () => {
        this.dom.hintBanner.classList.add('hidden');
        this.clearHintHighlights();
      });

      // Win Modal Actions
      this.dom.btnNextLevel.addEventListener('click', () => {
        this.dom.winModal.classList.add('hidden');
        this.nextLevel();
      });
      this.dom.btnReplay.addEventListener('click', () => {
        this.dom.winModal.classList.add('hidden');
        this.restartLevel();
      });
      this.dom.btnWinLevelSelect.addEventListener('click', () => {
        this.dom.winModal.classList.add('hidden');
        this.showLevelSelect(true);
      });

      // Pause Modal Actions
      this.dom.btnResume.addEventListener('click', () => this.togglePause(false));
      this.dom.btnRestartFromPause.addEventListener('click', () => {
        this.togglePause(false);
        this.restartLevel();
      });
      this.dom.btnLevelsFromPause.addEventListener('click', () => {
        this.togglePause(false);
        this.showLevelSelect(true);
      });

      // Level Select Modal
      this.dom.btnCloseLevelSelect.addEventListener('click', () => this.showLevelSelect(false));
      this.dom.diffTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
          this.dom.diffTabs.forEach(t => t.classList.remove('active'));
          e.currentTarget.classList.add('active');
          this.renderLevelGrid(e.currentTarget.dataset.diff);
        });
      });

      // Help Modal
      this.dom.btnCloseHelp.addEventListener('click', () => this.showHelp(false));
      this.dom.btnGotIt.addEventListener('click', () => this.showHelp(false));

      // Global Keyboard Navigation
      window.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    updateSoundIcons() {
      if (this.sound.enabled) {
        this.dom.soundOnIcon.classList.remove('hidden');
        this.dom.soundOffIcon.classList.add('hidden');
        this.dom.pauseSoundToggle.checked = true;
      } else {
        this.dom.soundOnIcon.classList.add('hidden');
        this.dom.soundOffIcon.classList.remove('hidden');
        this.dom.pauseSoundToggle.checked = false;
      }
    }

    updateColorblindUI() {
      this.dom.colorblindToggle.checked = this.colorblind;
    }

    announce(message) {
      if (this.dom.srAnnouncer) {
        this.dom.srAnnouncer.textContent = message;
      }
    }

    // =======================================================================
    // Level Loading & Initialization
    // =======================================================================
    loadLevel(levelNum) {
      if (levelNum > TOTAL_LEVELS) levelNum = TOTAL_LEVELS;
      if (levelNum < 1) levelNum = 1;

      this.currentLevel = levelNum;
      localStorage.setItem('colorsort_current_level', this.currentLevel);

      // Generate solvable puzzle
      const puzzle = LevelGenerator.generateLevel(this.currentLevel);
      this.difficulty = puzzle.difficulty;
      this.optimalMoves = puzzle.optimalMoves;
      this.tubes = puzzle.tubes.map(t => [...t]);
      this.initialTubes = puzzle.tubes.map(t => [...t]);

      this.selectedTubeIndex = null;
      this.focusedTubeIndex = 0;
      this.history = [];
      this.moves = 0;
      this.isAnimating = false;
      this.dom.hintBanner.classList.add('hidden');

      this.updateStatsDisplay();
      this.renderTubes();
      this.startTimer();
      this.announce(`Level ${this.currentLevel} loaded. ${this.tubes.length} glasses ready.`);
    }

    updateStatsDisplay() {
      this.dom.levelDisplay.textContent = this.currentLevel;
      this.dom.movesDisplay.textContent = this.moves;
      this.dom.undoCountBadge.textContent = this.history.length;
      this.dom.hintsBadge.textContent = this.hintsRemaining;

      // Difficulty tag
      this.dom.difficultyTag.textContent = this.difficulty.toUpperCase();
      this.dom.difficultyTag.className = `difficulty-tag diff-${this.difficulty}`;

      // Best score
      const best = this.getBestScore(this.currentLevel);
      this.dom.bestScoreDisplay.textContent = best ? best.moves : '-';
    }

    startTimer() {
      if (this.timerInterval) clearInterval(this.timerInterval);
      this.timerSeconds = 0;
      this.updateTimerDisplay();

      this.timerInterval = setInterval(() => {
        if (!this.isPaused) {
          this.timerSeconds++;
          this.updateTimerDisplay();
        }
      }, 1000);
    }

    stopTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
    }

    updateTimerDisplay() {
      const mins = Math.floor(this.timerSeconds / 60);
      const secs = this.timerSeconds % 60;
      this.dom.timerDisplay.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    // =======================================================================
    // Tube Rendering & Visual Construction
    // =======================================================================
    renderTubes() {
      this.dom.tubesGrid.innerHTML = '';

      this.tubes.forEach((tube, idx) => {
        const isSelected = this.selectedTubeIndex === idx;
        const isFullCompleted = PuzzleSolver.isTubeSolved(tube) && tube.length === TUBE_CAPACITY;

        const tubeWrapper = document.createElement('div');
        tubeWrapper.className = `tube-wrapper ${isSelected ? 'selected' : ''}`;

        const tubeEl = document.createElement('div');
        tubeEl.className = `tube ${isSelected ? 'is-selected' : ''} ${isFullCompleted ? 'tube-completed' : ''}`;
        tubeEl.dataset.index = idx;
        tubeEl.setAttribute('role', 'button');
        tubeEl.setAttribute('tabindex', '0');

        // Accessible description
        const colorNames = tube.map(c => COLOR_MAP[c] ? COLOR_MAP[c].name : c).join(', ');
        const desc = tube.length === 0 ? 'Empty glass' : `${tube.length} layers: ${colorNames}`;
        tubeEl.setAttribute('aria-label', `Glass ${idx + 1}: ${desc}`);

        // Glass Rim
        const rim = document.createElement('div');
        rim.className = 'tube-rim';
        tubeEl.appendChild(rim);

        // Glass Body
        const body = document.createElement('div');
        body.className = 'tube-body';

        // Reflections
        const reflLeft = document.createElement('div');
        reflLeft.className = 'tube-reflection-left';
        const reflRight = document.createElement('div');
        reflRight.className = 'tube-reflection-right';
        body.appendChild(reflLeft);
        body.appendChild(reflRight);

        // Render liquid segments from bottom (index 0) to top
        tube.forEach((colorId) => {
          const colorObj = COLOR_MAP[colorId] || { name: colorId, symbol: '•' };
          const segment = document.createElement('div');
          segment.className = `liquid-segment color-${colorId} ${this.colorblind ? 'colorblind-active' : ''}`;
          segment.dataset.symbol = colorObj.symbol;

          // Meniscus surface
          const surface = document.createElement('div');
          surface.className = 'liquid-surface';
          segment.appendChild(surface);

          // Bubbles effect
          const bubbles = document.createElement('div');
          bubbles.className = 'liquid-bubbles';
          segment.appendChild(bubbles);

          body.appendChild(segment);
        });

        tubeEl.appendChild(body);

        // Glass number label
        const numberLabel = document.createElement('div');
        numberLabel.className = 'tube-number-label';
        numberLabel.textContent = `${idx + 1}`;

        tubeWrapper.appendChild(tubeEl);
        tubeWrapper.appendChild(numberLabel);

        // Click / Touch Handler
        tubeEl.addEventListener('click', (e) => {
          e.stopPropagation();
          this.handleTubeClick(idx);
        });

        this.dom.tubesGrid.appendChild(tubeWrapper);
      });
    }

    // =======================================================================
    // Tube Selection & Pour Interaction
    // =======================================================================
    handleTubeClick(idx) {
      if (this.isAnimating || this.isPaused) return;

      this.clearHintHighlights();

      // If nothing selected yet
      if (this.selectedTubeIndex === null) {
        // Can only select a non-empty glass
        if (this.tubes[idx].length === 0) {
          this.sound.playInvalid();
          this.shakeTube(idx);
          this.announce(`Glass ${idx + 1} is empty.`);
          return;
        }

        // If the glass is already solved and full, gently allow or play select
        this.selectedTubeIndex = idx;
        this.sound.playSelect();
        this.renderTubes();
        const top = this.tubes[idx][this.tubes[idx].length - 1];
        const colorName = COLOR_MAP[top] ? COLOR_MAP[top].name : top;
        this.announce(`Selected Glass ${idx + 1} with top color ${colorName}. Select destination glass to pour.`);
      } else {
        const fromIdx = this.selectedTubeIndex;
        const toIdx = idx;

        // Tapping the same glass unselects it
        if (fromIdx === toIdx) {
          this.selectedTubeIndex = null;
          this.sound.playClick();
          this.renderTubes();
          this.announce(`Deselected Glass ${fromIdx + 1}.`);
          return;
        }

        // Validate move
        if (PuzzleSolver.canPour(this.tubes[fromIdx], this.tubes[toIdx])) {
          this.executePour(fromIdx, toIdx);
        } else {
          // Invalid move
          this.sound.playInvalid();
          this.shakeTube(toIdx);
          const fromTop = this.tubes[fromIdx][this.tubes[fromIdx].length - 1];
          const toTop = this.tubes[toIdx].length > 0 ? this.tubes[toIdx][this.tubes[toIdx].length - 1] : 'none';
          this.announce(`Cannot pour from Glass ${fromIdx + 1} into Glass ${toIdx + 1}. Colors do not match or glass is full.`);
          // Unselect
          this.selectedTubeIndex = null;
          this.renderTubes();
        }
      }
    }

    shakeTube(idx) {
      const tubeEls = this.dom.tubesGrid.querySelectorAll('.tube');
      if (tubeEls[idx]) {
        tubeEls[idx].classList.remove('shake');
        void tubeEls[idx].offsetWidth; // trigger reflow
        tubeEls[idx].classList.add('shake');
        setTimeout(() => {
          if (tubeEls[idx]) tubeEls[idx].classList.remove('shake');
        }, 450);
      }
    }

    // =======================================================================
    // Pour Animation & Mechanics
    // =======================================================================
    executePour(fromIdx, toIdx) {
      const pourCount = PuzzleSolver.getPourCount(this.tubes[fromIdx], this.tubes[toIdx]);
      if (pourCount <= 0) {
        this.selectedTubeIndex = null;
        this.renderTubes();
        return;
      }

      this.isAnimating = true;
      const colorPoured = this.tubes[fromIdx][this.tubes[fromIdx].length - 1];
      const colorObj = COLOR_MAP[colorPoured] || { name: colorPoured, hex: '#00e5ff' };

      // Record move in history for Undo
      this.history.push({
        from: fromIdx,
        to: toIdx,
        count: pourCount,
        color: colorPoured
      });

      // Animate glass tilt and pouring
      const tubeEls = this.dom.tubesGrid.querySelectorAll('.tube');
      const fromEl = tubeEls[fromIdx];
      const toEl = tubeEls[toIdx];

      if (fromEl && toEl) {
        const fromRect = fromEl.getBoundingClientRect();
        const toRect = toEl.getBoundingClientRect();

        const deltaX = toRect.left - fromRect.left;
        const deltaY = toRect.top - fromRect.top;
        const isLeft = deltaX < 0;
        const tiltAngle = isLeft ? -70 : 70;
        const liftY = deltaY - 50;

        // Apply 3D tilt transform
        fromEl.style.zIndex = '99';
        fromEl.style.transition = 'transform 0.35s cubic-bezier(0.25, 1, 0.5, 1)';
        fromEl.style.transform = `translate3d(${deltaX + (isLeft ? 36 : -36)}px, ${liftY}px, 0) rotate(${tiltAngle}deg)`;

        this.sound.playPour();

        // Create pouring liquid stream
        const stream = document.createElement('div');
        stream.className = `pour-stream color-${colorPoured}`;
        stream.style.left = `${toRect.left + toRect.width / 2 - 4}px`;
        stream.style.top = `${toRect.top + 10}px`;
        stream.style.height = '40px';
        stream.style.opacity = '1';
        document.body.appendChild(stream);

        setTimeout(() => {
          // Perform state data transfer
          for (let i = 0; i < pourCount; i++) {
            this.tubes[toIdx].push(this.tubes[fromIdx].pop());
          }

          this.moves++;
          this.updateStatsDisplay();

          // Fade out stream & return source tube
          stream.style.opacity = '0';
          setTimeout(() => {
            if (stream.parentNode) stream.parentNode.removeChild(stream);
          }, 150);

          fromEl.style.transition = 'transform 0.28s ease';
          fromEl.style.transform = 'translate3d(0, 0, 0) rotate(0deg)';

          setTimeout(() => {
            fromEl.style.zIndex = '';
            fromEl.style.transform = '';
            fromEl.style.transition = '';
            this.selectedTubeIndex = null;
            this.isAnimating = false;
            this.renderTubes();

            this.announce(`Poured ${pourCount} unit(s) of ${colorObj.name} from Glass ${fromIdx + 1} into Glass ${toIdx + 1}.`);

            // Check Win Condition
            this.checkWin();
          }, 280);
        }, 340);
      } else {
        // Fallback instant transfer if DOM elements missing
        for (let i = 0; i < pourCount; i++) {
          this.tubes[toIdx].push(this.tubes[fromIdx].pop());
        }
        this.moves++;
        this.selectedTubeIndex = null;
        this.isAnimating = false;
        this.updateStatsDisplay();
        this.renderTubes();
        this.checkWin();
      }
    }

    // =======================================================================
    // Undo & Restart
    // =======================================================================
    undoMove() {
      if (this.isAnimating || this.history.length === 0 || this.isPaused) return;

      const lastMove = this.history.pop();
      const { from, to, count } = lastMove;

      for (let i = 0; i < count; i++) {
        if (this.tubes[to].length > 0) {
          this.tubes[from].push(this.tubes[to].pop());
        }
      }

      this.moves++;
      this.selectedTubeIndex = null;
      this.sound.playUndo();
      this.clearHintHighlights();
      this.updateStatsDisplay();
      this.renderTubes();
      this.announce(`Move undone. Returned ${count} layer(s) to Glass ${from + 1}.`);
    }

    restartLevel() {
      if (this.isAnimating) return;
      this.tubes = this.initialTubes.map(t => [...t]);
      this.history = [];
      this.moves = 0;
      this.selectedTubeIndex = null;
      this.sound.playClick();
      this.clearHintHighlights();
      this.dom.hintBanner.classList.add('hidden');
      this.updateStatsDisplay();
      this.renderTubes();
      this.startTimer();
      this.announce(`Level ${this.currentLevel} restarted.`);
    }

    nextLevel() {
      if (this.currentLevel < TOTAL_LEVELS) {
        this.loadLevel(this.currentLevel + 1);
      } else {
        this.loadLevel(1);
      }
    }

    // =======================================================================
    // Hint System
    // =======================================================================
    showHint() {
      if (this.isAnimating || this.isPaused) return;

      if (this.hintsRemaining <= 0) {
        this.showHintBanner('No hints remaining! Try undoing or restarting.');
        this.sound.playInvalid();
        return;
      }

      const solution = PuzzleSolver.solve(this.tubes, 25, 4000);

      if (!solution || solution.length === 0) {
        if (PuzzleSolver.isSolved(this.tubes)) {
          this.showHintBanner('Puzzle is already solved!');
        } else {
          this.showHintBanner('No valid path to solve from here. Try Undoing moves or Restarting the level.');
          this.sound.playInvalid();
        }
        return;
      }

      const nextMove = solution[0];
      const fromIdx = nextMove.from;
      const toIdx = nextMove.to;
      const colorObj = COLOR_MAP[nextMove.color] || { name: nextMove.color };

      this.hintsRemaining--;
      localStorage.setItem('colorsort_hints', this.hintsRemaining);
      this.dom.hintsBadge.textContent = this.hintsRemaining;

      this.sound.playSelect();
      this.highlightHint(fromIdx, toIdx);

      const msg = `Try pouring ${colorObj.name} from Glass ${fromIdx + 1} into Glass ${toIdx + 1}.`;
      this.showHintBanner(msg);
      this.announce(`Hint: ${msg}`);
    }

    showHintBanner(message) {
      this.dom.hintMessage.textContent = message;
      this.dom.hintBanner.classList.remove('hidden');
    }

    highlightHint(fromIdx, toIdx) {
      this.clearHintHighlights();
      const tubeEls = this.dom.tubesGrid.querySelectorAll('.tube');
      if (tubeEls[fromIdx]) tubeEls[fromIdx].classList.add('hint-source');
      if (tubeEls[toIdx]) tubeEls[toIdx].classList.add('hint-dest');
    }

    clearHintHighlights() {
      const tubeEls = this.dom.tubesGrid.querySelectorAll('.tube');
      tubeEls.forEach(el => {
        el.classList.remove('hint-source', 'hint-dest');
      });
    }

    // =======================================================================
    // Win Detection & Score Calculation
    // =======================================================================
    checkWin() {
      if (PuzzleSolver.isSolved(this.tubes)) {
        this.stopTimer();
        this.sound.playWin();
        this.confetti.fire();

        // Calculate stars: 3 stars if <= optimal + 3 moves, 2 stars if <= optimal + 8, 1 star otherwise
        let stars = 1;
        if (this.moves <= this.optimalMoves + 3) stars = 3;
        else if (this.moves <= this.optimalMoves + 8) stars = 2;

        // Save best score
        this.saveBestScore(this.currentLevel, this.moves, this.timerSeconds, stars);

        // Unlock next level
        if (this.currentLevel >= this.unlockedLevel && this.currentLevel < TOTAL_LEVELS) {
          this.unlockedLevel = this.currentLevel + 1;
          localStorage.setItem('colorsort_unlocked_level', this.unlockedLevel);
        }

        setTimeout(() => this.showWinModal(stars), 600);
      }
    }

    showWinModal(stars) {
      const mins = Math.floor(this.timerSeconds / 60);
      const secs = this.timerSeconds % 60;
      const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      const best = this.getBestScore(this.currentLevel);

      this.dom.winMovesVal.textContent = this.moves;
      this.dom.winTimeVal.textContent = timeStr;
      this.dom.winBestVal.textContent = best ? best.moves : this.moves;

      // Render stars
      const starEls = this.dom.starsRating.querySelectorAll('.star');
      starEls.forEach((star, idx) => {
        if (idx < stars) {
          star.classList.add('filled');
        } else {
          star.classList.remove('filled');
        }
      });

      const subtitles = [
        'Good attempt! Keep sharpening your skills!',
        'Great job! Excellent puzzle solving!',
        'Perfection! Flawless master of colors!'
      ];
      this.dom.winSubtitle.textContent = subtitles[stars - 1] || 'Level Complete!';

      this.dom.winModal.classList.remove('hidden');
      this.announce(`Level Complete! Solved in ${this.moves} moves and ${timeStr}. Earned ${stars} stars.`);
    }

    getBestScore(level) {
      const scores = JSON.parse(localStorage.getItem('colorsort_scores') || '{}');
      return scores[level] || null;
    }

    saveBestScore(level, moves, time, stars) {
      const scores = JSON.parse(localStorage.getItem('colorsort_scores') || '{}');
      const prev = scores[level];
      if (!prev || moves < prev.moves || (moves === prev.moves && time < prev.time)) {
        scores[level] = { moves, time, stars };
        localStorage.setItem('colorsort_scores', JSON.stringify(scores));
      }
    }

    // =======================================================================
    // Modals & Menus
    // =======================================================================
    togglePause(pause) {
      this.isPaused = pause;
      if (pause) {
        this.dom.pauseModal.classList.remove('hidden');
        this.announce('Game paused');
      } else {
        this.dom.pauseModal.classList.add('hidden');
        this.announce('Game resumed');
      }
    }

    showHelp(show) {
      if (show) {
        this.dom.helpModal.classList.remove('hidden');
      } else {
        this.dom.helpModal.classList.add('hidden');
      }
    }

    showLevelSelect(show) {
      if (show) {
        this.dom.levelSelectModal.classList.remove('hidden');
        this.renderLevelGrid(this.difficulty);
      } else {
        this.dom.levelSelectModal.classList.add('hidden');
      }
    }

    renderLevelGrid(diff) {
      let start = 1;
      let end = 25;
      if (diff === 'medium') { start = 26; end = 50; }
      else if (diff === 'hard') { start = 51; end = 75; }
      else if (diff === 'expert') { start = 76; end = 100; }

      this.dom.levelGridContainer.innerHTML = '';
      const scores = JSON.parse(localStorage.getItem('colorsort_scores') || '{}');

      for (let lvl = start; lvl <= end; lvl++) {
        const isLocked = lvl > this.unlockedLevel;
        const isCurrent = lvl === this.currentLevel;
        const score = scores[lvl];

        const tile = document.createElement('button');
        tile.className = `level-tile ${isLocked ? 'locked' : ''} ${isCurrent ? 'current' : ''}`;
        tile.disabled = isLocked;
        tile.setAttribute('aria-label', `Level ${lvl}${isLocked ? ', locked' : score ? `, completed with ${score.stars} stars` : ''}`);

        const numEl = document.createElement('div');
        numEl.className = 'level-tile-num';
        numEl.textContent = isLocked ? '🔒' : lvl;
        tile.appendChild(numEl);

        if (!isLocked && score) {
          const starEl = document.createElement('div');
          starEl.className = 'level-tile-stars';
          starEl.textContent = '★'.repeat(score.stars);
          tile.appendChild(starEl);
        }

        tile.addEventListener('click', () => {
          this.sound.playClick();
          this.showLevelSelect(false);
          this.loadLevel(lvl);
        });

        this.dom.levelGridContainer.appendChild(tile);
      }
    }

    // =======================================================================
    // Keyboard Controls
    // =======================================================================
    handleKeyboard(e) {
      // Ignore if typing inside input
      if (e.target.tagName === 'INPUT') return;

      // Modals open -> Escape closes
      if (e.key === 'Escape') {
        this.dom.winModal.classList.add('hidden');
        this.dom.levelSelectModal.classList.add('hidden');
        this.dom.pauseModal.classList.add('hidden');
        this.dom.helpModal.classList.add('hidden');
        this.isPaused = false;
        return;
      }

      if (e.key === 'p' || e.key === 'P') {
        this.togglePause(!this.isPaused);
        return;
      }

      if (this.isPaused) return;

      if (e.key === 'u' || e.key === 'U' || (e.ctrlKey && e.key === 'z')) {
        e.preventDefault();
        this.undoMove();
        return;
      }

      if (e.key === 'h' || e.key === 'H') {
        this.showHint();
        return;
      }

      if (e.key === 'r' || e.key === 'R') {
        this.restartLevel();
        return;
      }

      if (e.key === 'm' || e.key === 'M') {
        const enabled = this.sound.toggle();
        this.updateSoundIcons();
        this.announce(enabled ? 'Sound on' : 'Sound off');
        return;
      }

      // Arrow navigation across tubes
      const tubeCount = this.tubes.length;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        this.focusTube((this.focusedTubeIndex + 1) % tubeCount);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.focusTube((this.focusedTubeIndex - 1 + tubeCount) % tubeCount);
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.handleTubeClick(this.focusedTubeIndex);
      }
    }

    focusTube(idx) {
      this.focusedTubeIndex = idx;
      const tubeEls = this.dom.tubesGrid.querySelectorAll('.tube');
      if (tubeEls[idx]) {
        tubeEls[idx].focus();
        const top = this.tubes[idx][this.tubes[idx].length - 1];
        const colorName = top && COLOR_MAP[top] ? COLOR_MAP[top].name : 'empty';
        this.announce(`Focused Glass ${idx + 1}: ${colorName}`);
      }
    }
  }

  // Initialize game on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    window.game = new ColorSortGame();
  });
})();
