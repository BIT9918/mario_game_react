import React, { useRef, useEffect, useState } from 'react';

const App = () => {
  const canvasRef = useRef(null);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  // --- CHEAT SYSTEM REFS ---
  const cheatsRef = useRef({ godMode: false, infiniteJump: false });
  const clickCountRef = useRef(0);
  const cheatTimerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: true });
    canvas.width = 800;
    canvas.height = 600;

    const game = {
      isGameOver: false,
      isWin: false,
      level: 1,
      camera: { x: 0 },
      levelWidth: 3200,
      gravity: 0.85,
      friction: 0.82,
      player: {
        x: 120,
        y: 380,
        vx: 0,
        vy: 0,
        width: 32,
        height: 48,
        onGround: false,
        facing: 1,
        frame: 0,
        state: 'idle',
        invuln: 0,
        jumpsRemaining: 1,
        maxJumps: 2,
      },
      platforms: [],
      enemies: [],
      projectiles: [],
      coins: [],
      particles: [],
      clouds: [],
      score: 0,
      lives: 3,
      collectedCoins: 0,
      totalCoins: 9,
      keys: {},
      audioCtx: new (window.AudioContext || window.webkitAudioContext)(),
      lastTime: Date.now(),
    };

    const loadLevel = (levelNum) => {
      game.player.x = 120;
      game.player.y = 380;
      game.player.vx = 0;
      game.player.vy = 0;
      game.player.jumpsRemaining = game.player.maxJumps;
      game.camera.x = 0;
      game.collectedCoins = 0;
      game.projectiles = [];
      game.particles = [];

      if (levelNum === 1) {
        game.levelWidth = 3200;
        game.totalCoins = 9;
        game.platforms = [
          { x: 0, y: 520, w: 3200, h: 80, color: '#5C4033' },
          { x: 320, y: 450, w: 220, h: 20, color: '#228B22' },
          { x: 620, y: 380, w: 180, h: 20, color: '#228B22' },
          { x: 920, y: 320, w: 140, h: 20, color: '#228B22' },
          { x: 1180, y: 400, w: 260, h: 20, color: '#228B22' },
          { x: 1550, y: 340, w: 200, h: 20, color: '#228B22' },
          { x: 1850, y: 440, w: 180, h: 20, color: '#228B22' },
          { x: 2150, y: 280, w: 300, h: 20, color: '#228B22' },
          { x: 2550, y: 380, w: 220, h: 20, color: '#228B22' },
          { x: 2900, y: 440, w: 300, h: 20, color: '#228B22' },
        ];
        game.enemies = [
          { x: 700, y: 490, vx: -1.8, width: 34, height: 32, alive: true, frame: 0, deathTime: 0, type: 'goomba' },
          { x: 1150, y: 490, vx: -1.6, width: 34, height: 32, alive: true, frame: 0, deathTime: 0, type: 'goomba' },
          { x: 1680, y: 490, vx: -2.0, width: 34, height: 32, alive: true, frame: 0, deathTime: 0, type: 'goomba' },
          { x: 2280, y: 490, vx: -1.7, width: 34, height: 32, alive: true, frame: 0, deathTime: 0, type: 'goomba' },
          { x: 2750, y: 490, vx: -1.9, width: 34, height: 32, alive: true, frame: 0, deathTime: 0, type: 'goomba' },
        ];
        game.coins = [
          { x: 380, y: 390, collected: false, bob: 0 },
          { x: 680, y: 320, collected: false, bob: 0 },
          { x: 980, y: 260, collected: false, bob: 0 },
          { x: 1250, y: 340, collected: false, bob: 0 },
          { x: 1620, y: 280, collected: false, bob: 0 },
          { x: 1920, y: 380, collected: false, bob: 0 },
          { x: 2220, y: 220, collected: false, bob: 0 },
          { x: 2620, y: 320, collected: false, bob: 0 },
          { x: 2980, y: 380, collected: false, bob: 0 },
        ];
        game.clouds = [
          { x: 100, y: 80, speed: 0.3 },
          { x: 500, y: 120, speed: 0.25 },
          { x: 1100, y: 60, speed: 0.35 },
          { x: 1700, y: 140, speed: 0.28 },
          { x: 2400, y: 90, speed: 0.32 },
        ];
      } else if (levelNum === 2) {
        game.levelWidth = 4200;
        game.totalCoins = 15;
        game.platforms = [
          { x: 0, y: 520, w: 600, h: 80, color: '#3B2F2F' },
          { x: 750, y: 440, w: 100, h: 20, color: '#2E8B57' },
          { x: 1000, y: 340, w: 80, h: 20, color: '#2E8B57' },
          { x: 1250, y: 240, w: 120, h: 20, color: '#2E8B57' },
          { x: 1550, y: 400, w: 350, h: 20, color: '#2E8B57' },
          { x: 2050, y: 300, w: 120, h: 20, color: '#2E8B57' },
          { x: 2350, y: 480, w: 500, h: 120, color: '#3B2F2F' },
          { x: 3000, y: 360, w: 100, h: 20, color: '#2E8B57' },
          { x: 3250, y: 240, w: 100, h: 20, color: '#2E8B57' },
          { x: 3600, y: 520, w: 600, h: 80, color: '#3B2F2F' },
        ];
        game.enemies = [
          { x: 400, y: 490, vx: -3.2, width: 34, height: 32, alive: true, frame: 0, deathTime: 0, type: 'goomba' },
          { x: 1280, y: 208, vx: 0, width: 34, height: 32, alive: true, frame: 0, deathTime: 0, type: 'shooter', fireTimer: 0 },
          { x: 1650, y: 368, vx: -3.8, width: 34, height: 32, alive: true, frame: 0, deathTime: 0, type: 'goomba' },
          { x: 1750, y: 368, vx: -3.5, width: 34, height: 32, alive: true, frame: 0, deathTime: 0, type: 'goomba' },
          { x: 2600, y: 448, vx: 0, width: 34, height: 32, alive: true, frame: 0, deathTime: 0, type: 'shooter', fireTimer: 60 },
          { x: 2750, y: 448, vx: 0, width: 34, height: 32, alive: true, frame: 0, deathTime: 0, type: 'shooter', fireTimer: 0 },
          { x: 3280, y: 208, vx: 0, width: 34, height: 32, alive: true, frame: 0, deathTime: 0, type: 'shooter', fireTimer: 30 },
          { x: 3800, y: 490, vx: -4.0, width: 34, height: 32, alive: true, frame: 0, deathTime: 0, type: 'goomba' },
        ];
        game.coins = [
          { x: 450, y: 400, collected: false, bob: 0 },
          { x: 790, y: 380, collected: false, bob: 0 },
          { x: 1030, y: 280, collected: false, bob: 0 },
          { x: 1300, y: 160, collected: false, bob: 0 },
          { x: 1600, y: 340, collected: false, bob: 0 },
          { x: 1700, y: 340, collected: false, bob: 0 },
          { x: 1800, y: 340, collected: false, bob: 0 },
          { x: 2090, y: 240, collected: false, bob: 0 },
          { x: 2450, y: 420, collected: false, bob: 0 },
          { x: 2550, y: 420, collected: false, bob: 0 },
          { x: 2700, y: 360, collected: false, bob: 0 },
          { x: 3030, y: 300, collected: false, bob: 0 },
          { x: 3280, y: 160, collected: false, bob: 0 },
          { x: 3750, y: 460, collected: false, bob: 0 },
          { x: 3850, y: 460, collected: false, bob: 0 },
        ];
        game.clouds = [
          { x: 200, y: 70, speed: 0.4 },
          { x: 800, y: 110, speed: 0.3 },
          { x: 1500, y: 50, speed: 0.45 },
          { x: 2200, y: 130, speed: 0.35 },
          { x: 3000, y: 80, speed: 0.4 },
          { x: 3800, y: 100, speed: 0.38 },
        ];
      } else if (levelNum === 3) {
        game.levelWidth = 6000;
        game.totalCoins = 20;
        game.platforms = [
          { x: 0, y: 520, w: 400, h: 80, color: '#2F4F4F' },
          { x: 550, y: 440, w: 200, h: 20, color: '#4682B4' },
          { x: 900, y: 360, w: 250, h: 20, color: '#4682B4' },
          { x: 1300, y: 280, w: 100, h: 20, color: '#4682B4' },
          { x: 1550, y: 480, w: 450, h: 120, color: '#2F4F4F' },
          { x: 2150, y: 400, w: 150, h: 20, color: '#4682B4' },
          { x: 2450, y: 300, w: 250, h: 20, color: '#4682B4' },
          { x: 2850, y: 460, w: 350, h: 140, color: '#2F4F4F' },
          { x: 3350, y: 360, w: 100, h: 20, color: '#4682B4' },
          { x: 3600, y: 240, w: 100, h: 20, color: '#4682B4' },
          { x: 3850, y: 500, w: 400, h: 100, color: '#2F4F4F' },
          { x: 4400, y: 400, w: 150, h: 20, color: '#4682B4' },
          { x: 4700, y: 280, w: 150, h: 20, color: '#4682B4' },
          { x: 5000, y: 480, w: 300, h: 120, color: '#2F4F4F' },
          { x: 5450, y: 520, w: 550, h: 80, color: '#2F4F4F' },
        ];
        game.enemies = [
          { x: 300, y: 490, vx: -3.5, width: 34, height: 32, alive: true, frame: 0, deathTime: 0, type: 'goomba' },
          { x: 650, y: 408, vx: -4.5, width: 34, height: 32, alive: true, frame: 0, deathTime: 0, type: 'spikey' },
          { x: 1050, y: 328, vx: -4.0, width: 34, height: 32, alive: true, frame: 0, deathTime: 0, type: 'goomba' },
          { x: 1650, y: 448, vx: -4.0, width: 34, height: 32, alive: true, frame: 0, deathTime: 0, type: 'spikey' },
          { x: 1800, y: 448, vx: -4.5, width: 34, height: 32, alive: true, frame: 0, deathTime: 0, type: 'goomba' },
          { x: 2600, y: 268, vx: 0, width: 34, height: 32, alive: true, frame: 0, deathTime: 0, type: 'shooter', fireTimer: 40 },
          { x: 3000, y: 428, vx: -4.8, width: 34, height: 32, alive: true, frame: 0, deathTime: 0, type: 'spikey' },
          { x: 3100, y: 428, vx: 0, width: 34, height: 32, alive: true, frame: 0, deathTime: 0, type: 'shooter', fireTimer: 0 },
          { x: 4000, y: 468, vx: -4.5, width: 34, height: 32, alive: true, frame: 0, deathTime: 0, type: 'spikey' },
          { x: 4150, y: 468, vx: -5.0, width: 34, height: 32, alive: true, frame: 0, deathTime: 0, type: 'goomba' },
          { x: 5150, y: 448, vx: 0, width: 34, height: 32, alive: true, frame: 0, deathTime: 0, type: 'shooter', fireTimer: 20 },
          { x: 5600, y: 488, vx: -4.0, width: 34, height: 32, alive: true, frame: 0, deathTime: 0, type: 'spikey' },
          { x: 5750, y: 488, vx: -4.0, width: 34, height: 32, alive: true, frame: 0, deathTime: 0, type: 'goomba' },
        ];
        game.coins = [
          { x: 600, y: 380, collected: false, bob: 0 },
          { x: 650, y: 380, collected: false, bob: 0 },
          { x: 950, y: 300, collected: false, bob: 0 },
          { x: 1050, y: 300, collected: false, bob: 0 },
          { x: 1330, y: 220, collected: false, bob: 0 },
          { x: 1600, y: 420, collected: false, bob: 0 },
          { x: 1750, y: 420, collected: false, bob: 0 },
          { x: 1900, y: 420, collected: false, bob: 0 },
          { x: 2200, y: 340, collected: false, bob: 0 },
          { x: 2500, y: 240, collected: false, bob: 0 },
          { x: 2600, y: 240, collected: false, bob: 0 },
          { x: 2900, y: 400, collected: false, bob: 0 },
          { x: 3050, y: 400, collected: false, bob: 0 },
          { x: 3380, y: 300, collected: false, bob: 0 },
          { x: 3630, y: 180, collected: false, bob: 0 },
          { x: 3950, y: 440, collected: false, bob: 0 },
          { x: 4100, y: 440, collected: false, bob: 0 },
          { x: 4450, y: 340, collected: false, bob: 0 },
          { x: 4750, y: 220, collected: false, bob: 0 },
          { x: 5050, y: 420, collected: false, bob: 0 },
        ];
        game.clouds = [
          { x: 300, y: 90, speed: 0.5 },
          { x: 1200, y: 140, speed: 0.4 },
          { x: 2500, y: 70, speed: 0.55 },
          { x: 3800, y: 120, speed: 0.45 },
          { x: 4900, y: 100, speed: 0.5 },
          { x: 5800, y: 80, speed: 0.6 },
        ];
      } else if (levelNum === 4) {
        // LEVEL 4: Extremely hard, huge gaps, 8000 width, new Bird enemy
        game.levelWidth = 8000;
        game.totalCoins = 30;
        
        // Lots of tiny platforms and massive gaps
        const hardPlatforms = [
          { x: 0, y: 520, w: 300, h: 80, color: '#300000' }, // Start safe
          { x: 450, y: 440, w: 80, h: 20, color: '#8B0000' },
          { x: 700, y: 350, w: 80, h: 20, color: '#8B0000' },
          { x: 1000, y: 250, w: 60, h: 20, color: '#8B0000' },
          { x: 1300, y: 450, w: 300, h: 150, color: '#300000' }, // Mini safe zone
          { x: 1800, y: 380, w: 100, h: 20, color: '#8B0000' },
          { x: 2100, y: 280, w: 60, h: 20, color: '#8B0000' },
          { x: 2400, y: 180, w: 60, h: 20, color: '#8B0000' },
          { x: 2750, y: 480, w: 400, h: 120, color: '#300000' }, 
          { x: 3400, y: 400, w: 80, h: 20, color: '#8B0000' },
          { x: 3700, y: 300, w: 80, h: 20, color: '#8B0000' },
          { x: 4000, y: 450, w: 200, h: 150, color: '#300000' },
          { x: 4500, y: 350, w: 60, h: 20, color: '#8B0000' },
          { x: 4800, y: 250, w: 60, h: 20, color: '#8B0000' },
          { x: 5100, y: 150, w: 60, h: 20, color: '#8B0000' },
          { x: 5400, y: 500, w: 300, h: 100, color: '#300000' },
          { x: 6000, y: 400, w: 80, h: 20, color: '#8B0000' },
          { x: 6300, y: 300, w: 80, h: 20, color: '#8B0000' },
          { x: 6700, y: 200, w: 80, h: 20, color: '#8B0000' },
          { x: 7100, y: 400, w: 150, h: 20, color: '#8B0000' },
          { x: 7500, y: 520, w: 500, h: 80, color: '#300000' }, // End zone
        ];
        game.platforms = hardPlatforms;

        // Introducting the new 'bird' enemy that flies to you
        game.enemies = [
          { x: 750, y: 150, width: 34, height: 32, alive: true, frame: 0, deathTime: 0, type: 'bird' },
          { x: 1400, y: 418, vx: -5.0, width: 34, height: 32, alive: true, frame: 0, deathTime: 0, type: 'spikey' },
          { x: 2200, y: 100, width: 34, height: 32, alive: true, frame: 0, deathTime: 0, type: 'bird' },
          { x: 2900, y: 448, vx: 0, width: 34, height: 32, alive: true, frame: 0, deathTime: 0, type: 'shooter', fireTimer: 30 },
          { x: 3000, y: 448, vx: 0, width: 34, height: 32, alive: true, frame: 0, deathTime: 0, type: 'shooter', fireTimer: 0 },
          { x: 3800, y: 150, width: 34, height: 32, alive: true, frame: 0, deathTime: 0, type: 'bird' },
          { x: 4100, y: 418, vx: -4.5, width: 34, height: 32, alive: true, frame: 0, deathTime: 0, type: 'spikey' },
          { x: 4900, y: 100, width: 34, height: 32, alive: true, frame: 0, deathTime: 0, type: 'bird' },
          { x: 5500, y: 468, vx: -5.5, width: 34, height: 32, alive: true, frame: 0, deathTime: 0, type: 'goomba' },
          { x: 6100, y: 150, width: 34, height: 32, alive: true, frame: 0, deathTime: 0, type: 'bird' },
          { x: 6800, y: 100, width: 34, height: 32, alive: true, frame: 0, deathTime: 0, type: 'bird' },
          { x: 7200, y: 368, vx: -5.0, width: 34, height: 32, alive: true, frame: 0, deathTime: 0, type: 'spikey' },
        ];

        // 30 Coins spread out
        game.coins = [];
        for(let i = 0; i < 30; i++) {
          game.coins.push({
            x: 400 + (i * 240), 
            y: 200 + (Math.sin(i) * 100), 
            collected: false, 
            bob: i 
          });
        }

        game.clouds = [
          { x: 500, y: 50, speed: 0.6 },
          { x: 1500, y: 100, speed: 0.7 },
          { x: 3000, y: 80, speed: 0.8 },
          { x: 4500, y: 60, speed: 0.65 },
          { x: 6000, y: 120, speed: 0.75 },
          { x: 7500, y: 90, speed: 0.85 },
        ];
      }
    };

    const playSound = (freq, duration, type = 'triangle', volume = 0.3) => {
      if (!game.audioCtx) return;
      const osc = game.audioCtx.createOscillator();
      const gain = game.audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, game.audioCtx.currentTime);
      gain.gain.value = volume;
      osc.connect(gain).connect(game.audioCtx.destination);
      osc.start();
      setTimeout(() => osc.stop(), duration * 1000);
    };

    const createParticles = (x, y, count, color, vxSpread = 3, vySpread = 5) => {
      for (let i = 0; i < count; i++) {
        game.particles.push({
          x: x + Math.random() * 20 - 10,
          y: y + Math.random() * 20 - 10,
          vx: (Math.random() - 0.5) * vxSpread,
          vy: (Math.random() - 0.5) * vySpread - 2,
          life: 25 + Math.random() * 15,
          color,
          size: 4 + Math.random() * 4,
        });
      }
    };

    const checkCollision = (a, b) => {
      return (
        a.x < b.x + (b.w || b.width) &&
        a.x + (a.w || a.width) > b.x &&
        a.y < b.y + (b.h || b.height) &&
        a.y + (a.h || a.height) > b.y
      );
    };

    const drawBackground = () => {
      const grad = ctx.createLinearGradient(0, 0, 0, 600);
      if (game.level === 1) {
        grad.addColorStop(0, '#5C94FC');
        grad.addColorStop(1, '#A0D8FF');
      } else if (game.level === 2) {
        grad.addColorStop(0, '#FF7F50');
        grad.addColorStop(1, '#FFDAB9');
      } else if (game.level === 3) {
        grad.addColorStop(0, '#191970');
        grad.addColorStop(1, '#483D8B');
      } else if (game.level === 4) {
        // Red sky for level 4
        grad.addColorStop(0, '#4A0000');
        grad.addColorStop(1, '#8B0000');
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 800, 600);

      if (game.level >= 3) {
        ctx.fillStyle = game.level === 4 ? '#FFCCCC' : '#FFFFFF';
        for(let i=0; i<30; i++) {
          const starX = (i * 123 + game.camera.x * 0.05) % 800;
          const starY = (i * 87) % 300;
          ctx.globalAlpha = Math.abs(Math.sin(Date.now() / 500 + i));
          ctx.fillRect(starX, starY, 2, 2);
        }
        ctx.globalAlpha = 1;
      }

      ctx.fillStyle = game.level === 1 ? '#4A7043' : game.level === 2 ? '#8B4513' : game.level === 3 ? '#1A2A2A' : '#110000';
      ctx.beginPath();
      ctx.moveTo(0 - game.camera.x * 0.2, 520);
      ctx.lineTo(400 - game.camera.x * 0.2, 380);
      ctx.lineTo(800 - game.camera.x * 0.2, 520);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(600 - game.camera.x * 0.2, 520);
      ctx.lineTo(1100 - game.camera.x * 0.2, 340);
      ctx.lineTo(1600 - game.camera.x * 0.2, 520);
      ctx.fill();

      ctx.fillStyle = game.level === 3 ? '#A9A9A9' : game.level === 4 ? '#550000' : '#FFFFFF';
      game.clouds.forEach((cloud) => {
        const cx = (cloud.x - game.camera.x * 0.4) % (game.levelWidth) - 100;
        ctx.globalAlpha = game.level >= 3 ? 0.4 : 0.9;
        ctx.beginPath();
        ctx.ellipse(cx + 60, cloud.y, 70, 25, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(cx + 30, cloud.y - 10, 35, 22, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(cx + 95, cloud.y - 12, 40, 20, 0, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      ctx.fillStyle = game.level === 1 ? '#2E8B57' : game.level === 2 ? '#556B2F' : game.level === 3 ? '#2F4F4F' : '#220000';
      for (let i = 0; i < (game.levelWidth / 280); i++) {
        const bx = (i * 280 - (game.camera.x * 0.8) % 280) - 50;
        ctx.beginPath();
        ctx.ellipse(bx + 40, 495, 55, 22, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawMario = (px, py, facing, frame, state) => {
      ctx.save();
      if (facing === -1) {
        ctx.translate(px + 32, py);
        ctx.scale(-1, 1);
        ctx.translate(-32, 0);
      } else {
        ctx.translate(px, py);
      }

      const animFrame = Math.floor(frame) % 4;

      ctx.fillStyle = '#2C2C2C';
      ctx.fillRect(6, 38, 9, 10);
      ctx.fillRect(19, 38, 9, 10);

      ctx.fillStyle = '#2A4B8C';
      if (state === 'jump') {
        ctx.fillRect(8, 26, 7, 15);
        ctx.fillRect(19, 26, 7, 15);
      } else if (state === 'run') {
        const legOffset = animFrame % 2 === 0 ? 3 : -3;
        ctx.fillRect(7 + legOffset, 26, 8, 15);
        ctx.fillRect(18 - legOffset, 26, 8, 15);
      } else {
        ctx.fillRect(8, 26, 8, 15);
        ctx.fillRect(18, 26, 8, 15);
      }

      ctx.fillStyle = '#E4000F';
      ctx.fillRect(7, 18, 20, 12);
      ctx.fillStyle = '#F4C38B';
      ctx.fillRect(4, 19, 6, 9);
      ctx.fillRect(24, 19, 6, 9);
      ctx.fillStyle = '#F4C38B';
      ctx.fillRect(8, 6, 18, 16);
      ctx.fillStyle = '#E4000F';
      ctx.fillRect(5, 3, 24, 8);
      ctx.fillRect(9, -2, 16, 7);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(13, 5, 8, 3);
      ctx.fillStyle = '#000000';
      ctx.fillRect(12, 10, 5, 5);
      ctx.fillRect(19, 10, 5, 5);
      ctx.fillStyle = '#2C2C2C';
      ctx.fillRect(10, 16, 14, 3);

      ctx.restore();
    };

    const drawEnemy = (ex, ey, alive, frame, deathTime, type) => {
      ctx.save();
      const gx = ex - game.camera.x;
      if (!alive && deathTime) {
        ctx.translate(gx + 17, ey + 25);
        ctx.rotate(Math.PI * 0.4);
        ctx.translate(-17, -25);
      }
      
      if (type === 'goomba') {
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(gx + 2, ey + 8, 30, 18);
        ctx.fillStyle = '#4A2C0F';
        ctx.fillRect(gx + 6, ey + 20, 22, 8);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(gx + 8, ey + 12, 7, 8);
        ctx.fillRect(gx + 20, ey + 12, 7, 8);
        ctx.fillStyle = '#000000';
        ctx.fillRect(gx + 10, ey + 14, 3, 4);
        ctx.fillRect(gx + 22, ey + 14, 3, 4);
      } else if (type === 'shooter') {
        ctx.fillStyle = '#4A4A4A';
        ctx.fillRect(gx, ey + 4, 34, 24);
        ctx.fillStyle = '#2A2A2A';
        ctx.fillRect(gx + 4, ey + 22, 26, 10);
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(gx + 12, ey + 10, 10, 8);
        ctx.fillStyle = '#000000';
        ctx.fillRect(gx + 15, ey + 12, 4, 4);
      } else if (type === 'spikey') {
        ctx.fillStyle = '#4B0082';
        ctx.fillRect(gx + 2, ey + 12, 30, 20);
        ctx.fillStyle = '#E0E0E0';
        ctx.beginPath();
        ctx.moveTo(gx + 17, ey);
        ctx.lineTo(gx + 7, ey + 12);
        ctx.lineTo(gx + 27, ey + 12);
        ctx.fill();
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(gx + 8, ey + 16, 6, 6);
        ctx.fillRect(gx + 20, ey + 16, 6, 6);
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(gx + 10, ey + 18, 3, 3);
        ctx.fillRect(gx + 22, ey + 18, 3, 3);
      } else if (type === 'bird') {
        // Draw the new Bird Enemy
        const wingFlap = Math.sin(frame * 1.5) * 12; 
        ctx.fillStyle = '#1E90FF'; // Blue body
        ctx.beginPath();
        ctx.arc(gx + 17, ey + 16, 12, 0, Math.PI * 2);
        ctx.fill();
        
        // Flapping Wings
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.moveTo(gx + 17, ey + 16);
        ctx.lineTo(gx - 8, ey + 8 + wingFlap);
        ctx.lineTo(gx + 5, ey + 16);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(gx + 17, ey + 16);
        ctx.lineTo(gx + 42, ey + 8 + wingFlap);
        ctx.lineTo(gx + 29, ey + 16);
        ctx.fill();
        
        // Angry Eyes
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(gx + 10, ey + 10, 6, 4);
        ctx.fillRect(gx + 18, ey + 10, 6, 4);
        ctx.fillStyle = '#FF0000'; // Red pupils!
        ctx.fillRect(gx + 12, ey + 11, 2, 2);
        ctx.fillRect(gx + 20, ey + 11, 2, 2);
      }

      ctx.restore();
    };

    const drawCoin = (cx, cy, bob) => {
      const screenX = cx - game.camera.x;
      const offsetY = Math.sin(bob) * 4;
      ctx.fillStyle = '#F4C300';
      ctx.beginPath();
      ctx.ellipse(screenX + 10, cy + 10 + offsetY, 12, 14, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 18px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('¢', screenX + 10, cy + 16 + offsetY);
      ctx.textAlign = 'left';
    };

    const drawProjectile = (proj) => {
      const px = proj.x - game.camera.x;
      ctx.fillStyle = '#FF4500';
      ctx.beginPath();
      ctx.arc(px + proj.width / 2, proj.y + proj.height / 2, proj.width / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(px + proj.width / 2, proj.y + proj.height / 2, proj.width / 4, 0, Math.PI * 2);
      ctx.fill();
    };

    const draw = () => {
      ctx.clearRect(0, 0, 800, 600);
      drawBackground();

      ctx.lineWidth = 3;
      game.platforms.forEach((p) => {
        const sx = p.x - game.camera.x;
        if (sx + p.w < 0 || sx > 800) return;
        ctx.fillStyle = p.color;
        ctx.fillRect(sx, p.y, p.w, p.h);
        ctx.strokeStyle = '#1E3A1E';
        ctx.strokeRect(sx, p.y, p.w, p.h);
      });

      game.coins.forEach((coin) => {
        if (!coin.collected) drawCoin(coin.x, coin.y, coin.bob);
      });

      game.enemies.forEach((enemy) => {
        if (enemy.alive || (enemy.deathTime && Date.now() - enemy.deathTime < 400)) {
          drawEnemy(enemy.x, enemy.y, enemy.alive, enemy.frame, enemy.deathTime, enemy.type);
        }
      });

      game.projectiles.forEach((proj) => {
        if (proj.active) drawProjectile(proj);
      });

      const p = game.player;
      if (p.invuln % 6 < 4) {
        drawMario(p.x - game.camera.x, p.y, p.facing, p.frame, p.state);
      }

      game.particles.forEach((part) => {
        ctx.fillStyle = part.color;
        ctx.globalAlpha = part.life / 30;
        ctx.fillRect(part.x - game.camera.x, part.y, part.size, part.size);
      });
      ctx.globalAlpha = 1;

      ctx.shadowColor = '#000';
      ctx.shadowBlur = 8;
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 24px Arial';
      ctx.fillText(`LEVEL ${game.level}`, 30, 40);
      
      ctx.font = 'bold 28px Arial';
      ctx.fillText(`SCORE ${String(game.score).padStart(6, '0')}`, 160, 40);

      ctx.shadowBlur = 4;
      ctx.fillStyle = '#F4C300';
      ctx.font = 'bold 26px Arial';
      ctx.fillText(`COINS ${game.collectedCoins}/${game.totalCoins}`, 30, 78);

      ctx.shadowBlur = 0;
      ctx.fillStyle = '#FF0000';
      ctx.font = 'bold 32px Arial';
      for (let i = 0; i < game.lives; i++) {
        ctx.fillText('❤️', 30 + i * 48, 120);
      }

      if (game.score === 0 && game.level === 1) {
        ctx.fillStyle = '#FFFF00';
        ctx.font = '20px Arial';
        ctx.fillText('← → MOVE    ↑ JUMP    COLLECT ALL COINS!', 360, 40);
      }

      if (cheatsRef.current.godMode) {
        ctx.fillStyle = '#00FF00';
        ctx.font = 'bold 16px Arial';
        ctx.fillText('GOD MODE ENABLED', 30, 160);
      }

      const actualFlagX = game.levelWidth - 150;
      const flagScreenX = actualFlagX - game.camera.x;
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(flagScreenX, 220, 12, 300);
      ctx.fillStyle = '#FF0000';
      ctx.beginPath();
      ctx.moveTo(flagScreenX, 220);
      ctx.lineTo(flagScreenX + 60, 250);
      ctx.lineTo(flagScreenX, 280);
      ctx.fill();

      if (p.x > actualFlagX - 150 && game.collectedCoins < game.totalCoins) {
        ctx.fillStyle = '#FFFF00';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('COLLECT ALL COINS FIRST!', flagScreenX + 30, 190);
        ctx.textAlign = 'left';
      }
    };

    const update = () => {
      const p = game.player;
      const now = Date.now();
      const dt = (now - game.lastTime) / 16;
      game.lastTime = now;

      let targetVx = 0;
      if (game.keys['ArrowLeft']) { targetVx = -5.2; p.facing = -1; }
      if (game.keys['ArrowRight']) { targetVx = 5.2; p.facing = 1; }

      p.vx = p.vx * game.friction + targetVx * 0.22;
      if (Math.abs(p.vx) < 0.2) p.vx = 0;

      p.vy += game.gravity * dt;

      p.x += p.vx * dt;
      for (let plat of game.platforms) {
        if (checkCollision(p, plat)) {
          if (p.vx > 0) p.x = plat.x - p.width;
          if (p.vx < 0) p.x = plat.x + plat.w;
          p.vx = 0;
        }
      }

      p.y += p.vy * dt;
      p.onGround = false;
      for (let plat of game.platforms) {
        if (checkCollision(p, plat)) {
          if (p.vy > 0) {
            p.y = plat.y - p.height;
            p.vy = 0;
            p.onGround = true;
            if (p.jumpsRemaining < p.maxJumps) {
              p.jumpsRemaining = p.maxJumps;
            }
            if (Math.abs(p.vx) > 2) createParticles(p.x + 16, p.y + p.height, 6, '#8B4513', 2, 1);
          } else if (p.vy < 0) {
            p.y = plat.y + plat.h;
            p.vy = 0;
            if (plat.y < 400) {
              createParticles(plat.x + plat.w / 2, plat.y, 12, '#FFD700');
              playSound(1400, 0.08, 'sine', 0.4);
            }
          }
        }
      }

      p.state = p.onGround ? (Math.abs(p.vx) > 1 ? 'run' : 'idle') : 'jump';
      p.frame += 0.22 * (Math.abs(p.vx) / 5 + 0.6);

      const idealCam = Math.max(0, Math.min(p.x - 340, game.levelWidth - 800));
      game.camera.x += (idealCam - game.camera.x) * 0.12;

      game.enemies.forEach((en) => {
        if (!en.alive) return;
        
        if (en.type === 'shooter') {
          en.fireTimer += dt;
          if (en.fireTimer > 120) {
            en.fireTimer = 0;
            const dirX = p.x < en.x ? -1 : 1;
            game.projectiles.push({
              x: en.x + 11,
              y: en.y + 10,
              vx: dirX * 4.5,
              vy: 0,
              width: 12,
              height: 12,
              active: true
            });
            playSound(300, 0.1, 'square', 0.4);
          }
        } else if (en.type === 'bird') {
          // BIRD LOGIC: Flies towards player if within 800 pixels
          en.frame += 0.15;
          const dx = p.x - en.x;
          const dy = p.y - en.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 800) {
            const birdSpeed = 2.5; // Fast, but fair
            en.x += (dx / dist) * birdSpeed * dt;
            en.y += (dy / dist) * birdSpeed * dt;
          }
        } else {
          en.x += en.vx * dt;
          en.frame += 0.15;
          const MAX_ENEMY_SPEED = 6.0;
          if (Math.abs(en.vx) > MAX_ENEMY_SPEED) {
            en.vx = Math.sign(en.vx) * MAX_ENEMY_SPEED;
          }
          let onPlat = false;
          for (let plat of game.platforms) {
            if (en.x + en.width > plat.x && en.x < plat.x + plat.w && Math.abs(en.y + en.height - plat.y) < 8) {
              onPlat = true;
              break;
            }
          }
          if (!onPlat) en.vx *= -1; 
        }

        if (checkCollision(p, { x: en.x, y: en.y, w: en.width, h: en.height })) {
          if (p.invuln > 0) return;
          // You can stomp birds too! Just not spikeys.
          if (p.vy > 0 && p.y + p.height - 12 < en.y + en.height / 2 && en.type !== 'spikey') {
            en.alive = false;
            en.deathTime = Date.now();
            p.vy = -14;
            game.score += en.type === 'shooter' ? 400 : en.type === 'bird' ? 500 : 200;
            playSound(600, 0.15, 'square', 0.6);
            createParticles(en.x + 17, en.y + 20, 22, '#8B4513', 4, 6);
          } else {
            if (!cheatsRef.current.godMode) {
              game.lives--;
            }
            if (game.lives <= 0) {
              game.isGameOver = true;
              setFinalScore(game.score);
              setGameOver(true);
            } else {
              p.invuln = 60;
              p.vx = -p.facing * 8;
              p.vy = -9;
              playSound(120, 0.6, 'sawtooth', 0.7);
            }
          }
        }
      });

      game.projectiles.forEach((proj) => {
        if (!proj.active) return;
        proj.x += proj.vx * dt;
        proj.y += proj.vy * dt;

        if (checkCollision(p, proj)) {
          proj.active = false;
          if (p.invuln <= 0) {
            if (!cheatsRef.current.godMode) {
              game.lives--;
            }
            if (game.lives <= 0) {
              game.isGameOver = true;
              setFinalScore(game.score);
              setGameOver(true);
            } else {
              p.invuln = 60;
              p.vx = -p.facing * 8;
              p.vy = -9;
              playSound(120, 0.6, 'sawtooth', 0.7);
            }
          }
        }

        if (proj.x < game.camera.x - 100 || proj.x > game.camera.x + 900) {
          proj.active = false;
        }
      });

      game.coins.forEach((coin) => {
        if (coin.collected) return;
        coin.bob += 0.12;
        if (checkCollision(p, { x: coin.x, y: coin.y, w: 20, h: 20 })) {
          coin.collected = true;
          game.collectedCoins++;
          game.score += 100;
          playSound(1600, 0.08);
          playSound(2100, 0.12, 'sine', 0.25);
          createParticles(coin.x + 10, coin.y + 10, 18, '#FFD700', 5, 7);
        }
      });

      game.particles = game.particles.filter((part) => {
        part.x += part.vx;
        part.y += part.vy;
        part.vy += 0.25;
        part.life -= 1;
        return part.life > 0;
      });

      const actualFlagX = game.levelWidth - 150;
      if (p.x > actualFlagX - 30 && game.collectedCoins === game.totalCoins) {
        if (game.level === 1) {
          game.level = 2;
          game.score += 1000;
          playSound(800, 0.2);
          playSound(1200, 0.3);
          loadLevel(2);
        } else if (game.level === 2) {
          game.level = 3;
          game.score += 2000;
          playSound(800, 0.2);
          playSound(1200, 0.3);
          loadLevel(3);
        } else if (game.level === 3) {
          game.level = 4; // Move to Level 4
          game.score += 3000;
          playSound(800, 0.2);
          playSound(1200, 0.3);
          loadLevel(4);
        } else {
          // Beat Level 4!
          game.isWin = true;
          setFinalScore(game.score);
          setWin(true);
          playSound(800, 0.2);
          playSound(1100, 0.4);
          playSound(1400, 0.6);
        }
      }

      if (p.y > 650) {
        if (!cheatsRef.current.godMode) {
          game.lives--;
        }
        if (game.lives <= 0) {
          game.isGameOver = true;
          setFinalScore(game.score);
          setGameOver(true);
        } else {
          resetPlayer();
        }
      }

      if (p.invuln > 0) p.invuln--;
    };

    const resetPlayer = () => {
      const p = game.player;
      p.x = 120;
      p.y = 380;
      p.vx = 0;
      p.vy = 0;
      p.jumpsRemaining = p.maxJumps;
      game.camera.x = 0;
    };

    let animationId;
    const gameLoop = () => {
      if (!game.isGameOver && !game.isWin) {
        update();
        draw();
        animationId = requestAnimationFrame(gameLoop);
      }
    };

    const keyDown = (e) => {
      if(e.preventDefault) e.preventDefault();
      game.keys[e.key] = true;
      
      if (e.key === 'ArrowUp' && (cheatsRef.current.infiniteJump || game.player.jumpsRemaining > 0)) {
        game.player.vy = -16.5;
        if (!cheatsRef.current.infiniteJump) {
          game.player.jumpsRemaining--;
        }
        game.player.onGround = false;
        playSound(720, 0.12, 'triangle', 0.5);
        createParticles(game.player.x + 16, game.player.y + 48, 8, '#AAAAAA', 2, 2);
      }
      if (e.key && e.key.toLowerCase() === 'r') window.location.reload();
    };

    const keyUp = (e) => {
      if(e.preventDefault) e.preventDefault();
      game.keys[e.key] = false;
      if (e.key === 'ArrowUp' && game.player.vy < 0) {
        game.player.vy *= 0.55;
      }
    };

    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);

    const bindTouch = (id, key) => {
      const el = document.getElementById(id);
      if(el) {
        el.addEventListener('touchstart', (e) => { e.preventDefault(); keyDown({ key }); }, { passive: false });
        el.addEventListener('touchend', (e) => { e.preventDefault(); keyUp({ key }); }, { passive: false });
        el.addEventListener('mousedown', (e) => { e.preventDefault(); keyDown({ key }); });
        el.addEventListener('mouseup', (e) => { e.preventDefault(); keyUp({ key }); });
        el.addEventListener('mouseleave', (e) => { e.preventDefault(); keyUp({ key }); });
      }
    };

    bindTouch('btn-left', 'ArrowLeft');
    bindTouch('btn-right', 'ArrowRight');
    bindTouch('btn-jump', 'ArrowUp');

    loadLevel(1);
    gameLoop();

    return () => {
      window.removeEventListener('keydown', keyDown);
      window.removeEventListener('keyup', keyUp);
      cancelAnimationFrame(animationId);
    };
  }, []);

  const btnStyle = {
    background: 'rgba(255, 255, 255, 0.2)',
    border: '2px solid rgba(255, 255, 255, 0.5)',
    borderRadius: '50%',
    width: '70px',
    height: '70px',
    fontSize: '30px',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    userSelect: 'none',
    touchAction: 'none'
  };

  const handleSecretClick = () => {
    clickCountRef.current += 1;
    clearTimeout(cheatTimerRef.current);
    
    if (clickCountRef.current >= 3) {
      const code = window.prompt("Terminal Access:");
      if (code === "991812") {
        cheatsRef.current.godMode = true;
        cheatsRef.current.infiniteJump = true;
        alert("DEV MODE ENABLED: GOD MODE & INFINITE JUMP ON");
      }
      clickCountRef.current = 0;
    } else {
      cheatTimerRef.current = setTimeout(() => {
        clickCountRef.current = 0;
      }, 1000);
    }
  };

  return (
    <div style={{
      background: '#000',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      fontFamily: 'Arial, sans-serif',
      color: '#fff',
      overflow: 'hidden'
    }}>
      <div 
        onClick={handleSecretClick}
        style={{ 
          marginBottom: '10px', 
          fontSize: '36px', 
          fontWeight: 'bold', 
          textShadow: '4px 4px 0 #000', 
          textAlign: 'center',
          cursor: 'pointer',
          userSelect: 'none'
        }}
      >
        SUPER MARIO 2026
      </div>
      
      <div style={{ position: 'relative', boxShadow: '0 0 20px rgba(255,255,255,0.2)' }}>
        <canvas 
          ref={canvasRef} 
          style={{ 
            display: 'block', 
            background: '#000',
            maxWidth: '100%',
            height: 'auto'
          }} 
        />
        
        {gameOver && (
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.8)', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', zIndex: 10
          }}>
            <h1 style={{ color: '#FF0000', fontSize: '48px', margin: '0 0 20px 0' }}>GAME OVER</h1>
            <h2 style={{ color: '#FFF', margin: '0 0 30px 0' }}>FINAL SCORE: {finalScore}</h2>
            <button 
              onClick={() => window.location.reload()}
              style={{ padding: '15px 30px', fontSize: '24px', cursor: 'pointer', background: '#E4000F', color: '#FFF', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}
            >
              TRY AGAIN
            </button>
          </div>
        )}

        {win && (
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.8)', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', zIndex: 10
          }}>
            <h1 style={{ color: '#00FF00', fontSize: '48px', margin: '0 0 20px 0', textAlign: 'center' }}>YOU WIN!</h1>
            <h2 style={{ color: '#FFF', margin: '0 0 30px 0' }}>FINAL SCORE: {finalScore}</h2>
            <button 
              onClick={() => window.location.reload()}
              style={{ padding: '15px 30px', fontSize: '24px', cursor: 'pointer', background: '#228B22', color: '#FFF', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}
            >
              PLAY AGAIN
            </button>
          </div>
        )}
      </div>

     <div style={{
  marginTop: '20px',
  display: 'flex',
  width: '100%', 
  maxWidth: '800px', /* Keeps it from getting too stretched on giant monitors */
  justifyContent: 'space-between', /* This is the magic property that pushes them to opposite ends */
  padding: '0 20px', /* Adds a little breathing room on the edges */
  boxSizing: 'border-box'
}}>
  <div style={{ display: 'flex', gap: '25px' }}>
    <div  className='py-10 px-10' id="btn-left" style={btnStyle}>←</div>
    <div className='py-10 px-10' id="btn-right" style={btnStyle}>→</div>
  </div>
  <div className='py-10 px-10' id="btn-jump" style={{...btnStyle, width: '100px', borderRadius: '35px'}}>JUMP</div>
</div>
    </div>
  );
};

export default App;