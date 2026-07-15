/* ═══════════════════════════════════════════════════════════════
   lab-theme.js — الخلفية العلمية المشتركة لجميع الصفحات
   ثلاثية الأبعاد: ذرات + جزيئات + DNA + معادلات + جسيمات
   ═══════════════════════════════════════════════════════════════ */
(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  /* ── mouse tracking for parallax ── */
  let mx = 0, my = 0;
  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  /* ── helpers ── */
  const rand  = (a, b) => a + Math.random() * (b - a);
  const wrap  = (v, max) => v < 0 ? max : v > max ? 0 : v;
  const PI2   = Math.PI * 2;

  /* ══════════ 1. FLOATING PARTICLES ══════════ */
  const particles = Array.from({ length: 55 }, () => ({
    x: rand(0, 9999), y: rand(0, 9999),
    vx: rand(-0.25, 0.25), vy: rand(-0.25, 0.25),
    r: rand(0.8, 2.2),
    alpha: rand(0.18, 0.55),
    color: ['#00C8FF','#38BDF8','#7DD3FC','#BAE6FD','#818CF8'][Math.floor(rand(0,5))],
    reset() { this.x = rand(0,W); this.y = rand(0,H); }
  }));

  /* ══════════ 2. ATOMS (nucleus + 2 electron orbits) ══════════ */
  const atoms = Array.from({ length: 8 }, () => ({
    x: rand(0,9999), y: rand(0,9999),
    vx: rand(-0.18, 0.18), vy: rand(-0.18, 0.18),
    nucleus: rand(3, 6),
    orbits: [
      { r: rand(18,28), angle: rand(0,PI2), speed: rand(0.012,0.022), tilt: rand(0, Math.PI) },
      { r: rand(28,42), angle: rand(0,PI2), speed: rand(-0.018,-0.008), tilt: rand(0, Math.PI*0.8) },
    ],
    color: ['#00C8FF','#38BDF8','#60A5FA','#818CF8'][Math.floor(rand(0,4))],
  }));

  /* ══════════ 3. MOLECULES (bonded dots) ══════════ */
  const molTemplates = [
    [{x:0,y:0},{x:16,y:-10},{x:16,y:10}],
    [{x:0,y:0},{x:20,y:0},{x:40,y:0}],
    [{x:0,y:0},{x:15,y:-13},{x:30,y:0},{x:15,y:13}],
    [{x:0,y:0},{x:18,y:-8},{x:36,y:0}],
  ];
  const molecules = Array.from({ length: 14 }, () => {
    const t = molTemplates[Math.floor(rand(0,molTemplates.length))];
    return {
      x: rand(0,9999), y: rand(0,9999),
      vx: rand(-0.18,0.18), vy: rand(-0.18,0.18),
      rot: rand(0,PI2), rotSpeed: rand(-0.006,0.006),
      atoms: t,
      color: ['#00C8FF','#38BDF8','#34D399','#818CF8','#60A5FA'][Math.floor(rand(0,5))],
      alpha: rand(0.18, 0.38),
    };
  });

  /* ══════════ 4. DNA HELICES ══════════ */
  const dnaStrands = Array.from({ length: 3 }, () => ({
    x: rand(0,9999), y: rand(0,9999),
    vx: rand(-0.12,0.12), vy: rand(-0.12,0.12),
    phase: rand(0,PI2),
    speed: rand(0.012,0.018),
    len: rand(80,130),
    alpha: rand(0.14,0.26),
  }));

  /* ══════════ 5. SCIENCE FORMULAS ══════════ */
  const symbols = ['H₂O','CO₂','E=mc²','DNA','ATP','F=ma','v=λf','pH','∑F','O₂','Fe','⚛'];
  const formulas = Array.from({ length: 18 }, () => ({
    x: rand(0,9999), y: rand(0,9999),
    vx: rand(-0.14,0.14), vy: rand(-0.14,0.14),
    text: symbols[Math.floor(rand(0,symbols.length))],
    alpha: rand(0.07,0.18),
    size: Math.floor(rand(10,18)),
    color: ['#38BDF8','#7DD3FC','#818CF8','#34D399','#BAE6FD'][Math.floor(rand(0,5))],
  }));

  /* ══════════ DRAW LOOP ══════════ */
  function draw() {
    ctx.clearRect(0, 0, W, H);

    /* background gradient */
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0,   '#061E3A');
    bg.addColorStop(0.35,'#0A2D52');
    bg.addColorStop(0.7, '#0D3566');
    bg.addColorStop(1,   '#082847');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    /* subtle grid */
    ctx.strokeStyle = 'rgba(0,150,220,0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 60) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
    for (let y = 0; y < H; y += 60) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

    /* ambient glow blobs — parallax with mouse */
    const px = (mx / W - 0.5) * 30;
    const py = (my / H - 0.5) * 30;
    const glows = [
      {x:W*0.15+px, y:H*0.2+py,  r:280, c:'rgba(0,160,255,0.12)'},
      {x:W*0.8-px,  y:H*0.15-py, r:220, c:'rgba(0,120,240,0.10)'},
      {x:W*0.5+px,  y:H*0.65+py, r:260, c:'rgba(0,200,230,0.09)'},
      {x:W*0.85-px, y:H*0.75-py, r:200, c:'rgba(50,100,220,0.08)'},
    ];
    glows.forEach(g => {
      const rg = ctx.createRadialGradient(g.x,g.y,0,g.x,g.y,g.r);
      rg.addColorStop(0, g.c); rg.addColorStop(1,'transparent');
      ctx.fillStyle = rg; ctx.beginPath(); ctx.arc(g.x,g.y,g.r,0,PI2); ctx.fill();
    });

    /* particles */
    particles.forEach(p => {
      p.x = wrap(p.x+p.vx, W); p.y = wrap(p.y+p.vy, H);
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, PI2);
      const hex = Math.floor(p.alpha*255).toString(16).padStart(2,'0');
      ctx.fillStyle = p.color + hex; ctx.fill();
      const rg = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*5);
      rg.addColorStop(0, p.color+'28'); rg.addColorStop(1,'transparent');
      ctx.fillStyle=rg; ctx.beginPath(); ctx.arc(p.x,p.y,p.r*5,0,PI2); ctx.fill();
    });

    /* atoms */
    atoms.forEach(a => {
      a.x = wrap(a.x+a.vx, W); a.y = wrap(a.y+a.vy, H);
      a.orbits.forEach(o => { o.angle += o.speed; });
      /* nucleus glow */
      const ng = ctx.createRadialGradient(a.x,a.y,0,a.x,a.y,a.nucleus*3);
      ng.addColorStop(0,a.color+'66'); ng.addColorStop(1,'transparent');
      ctx.fillStyle=ng; ctx.beginPath(); ctx.arc(a.x,a.y,a.nucleus*3,0,PI2); ctx.fill();
      /* nucleus */
      ctx.beginPath(); ctx.arc(a.x,a.y,a.nucleus,0,PI2); ctx.fillStyle=a.color; ctx.fill();
      /* orbits + electrons */
      a.orbits.forEach(o => {
        ctx.save(); ctx.translate(a.x,a.y); ctx.rotate(o.tilt); ctx.scale(1,0.38);
        ctx.beginPath(); ctx.ellipse(0,0,o.r,o.r,0,0,PI2);
        ctx.strokeStyle=a.color+'35'; ctx.lineWidth=0.8; ctx.stroke();
        const ex = Math.cos(o.angle)*o.r;
        const ey = Math.sin(o.angle)*o.r;
        ctx.restore();
        const rx = a.x + ex*Math.cos(o.tilt) - ey*0.38*Math.sin(o.tilt);
        const ry = a.y + ex*Math.sin(o.tilt) + ey*0.38*Math.cos(o.tilt);
        ctx.beginPath(); ctx.arc(rx, ry, 2, 0, PI2); ctx.fillStyle='#BAE6FD'; ctx.fill();
      });
    });

    /* molecules */
    molecules.forEach(m => {
      m.x = wrap(m.x+m.vx,W); m.y = wrap(m.y+m.vy,H); m.rot += m.rotSpeed;
      ctx.save(); ctx.translate(m.x,m.y); ctx.rotate(m.rot); ctx.globalAlpha=m.alpha;
      for (let i=0; i<m.atoms.length-1; i++) {
        ctx.beginPath(); ctx.moveTo(m.atoms[i].x,m.atoms[i].y);
        ctx.lineTo(m.atoms[i+1].x,m.atoms[i+1].y);
        ctx.strokeStyle=m.color; ctx.lineWidth=1.2; ctx.stroke();
      }
      m.atoms.forEach((at,i) => {
        ctx.beginPath(); ctx.arc(at.x,at.y,i===0?4:3,0,PI2);
        ctx.fillStyle = i===0 ? m.color : '#BAE6FD'; ctx.fill();
      });
      ctx.restore(); ctx.globalAlpha=1;
    });

    /* DNA */
    dnaStrands.forEach(d => {
      d.x = wrap(d.x+d.vx,W); d.y = wrap(d.y+d.vy,H); d.phase += d.speed;
      ctx.globalAlpha = d.alpha;
      const steps=20, sh=d.len/steps;
      for (let i=1; i<steps; i++) {
        const y  = d.y - d.len/2 + i*sh;
        const py = d.y - d.len/2 + (i-1)*sh;
        const a1=d.phase+i/steps*Math.PI*4, pa1=d.phase+(i-1)/steps*Math.PI*4;
        const x1=d.x+Math.cos(a1)*13, x2=d.x+Math.cos(a1+Math.PI)*13;
        const px1=d.x+Math.cos(pa1)*13, px2=d.x+Math.cos(pa1+Math.PI)*13;
        ctx.beginPath(); ctx.moveTo(px1,py); ctx.lineTo(x1,y);
        ctx.strokeStyle='#00C8FF'; ctx.lineWidth=1.1; ctx.stroke();
        ctx.beginPath(); ctx.moveTo(px2,py); ctx.lineTo(x2,y);
        ctx.strokeStyle='#818CF8'; ctx.lineWidth=1.1; ctx.stroke();
        if (i%2===0) {
          ctx.beginPath(); ctx.moveTo(x1,y); ctx.lineTo(x2,y);
          ctx.strokeStyle='rgba(0,200,150,0.55)'; ctx.lineWidth=0.7; ctx.stroke();
          ctx.beginPath(); ctx.arc(x1,y,1.8,0,PI2); ctx.fillStyle='#38BDF8'; ctx.fill();
          ctx.beginPath(); ctx.arc(x2,y,1.8,0,PI2); ctx.fillStyle='#818CF8'; ctx.fill();
        }
      }
      ctx.globalAlpha=1;
    });

    /* formulas */
    ctx.textBaseline='middle';
    formulas.forEach(f => {
      f.x=wrap(f.x+f.vx,W); f.y=wrap(f.y+f.vy,H);
      ctx.globalAlpha=f.alpha;
      ctx.font=`${f.size}px 'Tajawal',monospace`;
      ctx.fillStyle=f.color; ctx.fillText(f.text,f.x,f.y);
      ctx.globalAlpha=1;
    });

    requestAnimationFrame(draw);
  }
  draw();
})();
