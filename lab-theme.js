/* ═══════════════════════════════════════════════════════════════
   lab-theme.js — خلفية علمية متحركة فاتحة (ذرات + جزيئات + DNA)
   ألوان شفافة تظهر فوق الخلفية البيضاء/السماوية الفاتحة
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

  let mx = W / 2, my = H / 2;
  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  const PI2 = Math.PI * 2;
  const rand = (a, b) => a + Math.random() * (b - a);
  const wrap = (v, max) => v < 0 ? max : v > max ? 0 : v;

  /* ── ألوان فاتحة شفافة ── */
  const COLORS = ['#0EA5E9','#38BDF8','#7DD3FC','#6366F1','#818CF8','#34D399'];

  /* ── جسيمات صغيرة ── */
  const particles = Array.from({ length: 50 }, () => ({
    x: rand(0,9999), y: rand(0,9999),
    vx: rand(-0.2,0.2), vy: rand(-0.2,0.2),
    r: rand(1, 2.8),
    alpha: rand(0.08, 0.22),
    color: COLORS[Math.floor(rand(0,COLORS.length))],
  }));

  /* ── ذرات بمدارات ── */
  const atoms = Array.from({ length: 7 }, () => ({
    x: rand(0,9999), y: rand(0,9999),
    vx: rand(-0.15,0.15), vy: rand(-0.15,0.15),
    nucleus: rand(3,5),
    color: COLORS[Math.floor(rand(0,3))],
    orbits: [
      { r: rand(16,26), angle: rand(0,PI2), speed: rand(0.012,0.02),  tilt: rand(0, Math.PI) },
      { r: rand(26,40), angle: rand(0,PI2), speed: rand(-0.016,-0.008), tilt: rand(0, Math.PI*0.75) },
    ],
  }));

  /* ── جزيئات مترابطة ── */
  const molTemplates = [
    [{x:0,y:0},{x:15,y:-9},{x:15,y:9}],
    [{x:0,y:0},{x:18,y:0},{x:36,y:0}],
    [{x:0,y:0},{x:13,y:-11},{x:26,y:0},{x:13,y:11}],
  ];
  const molecules = Array.from({ length: 12 }, () => {
    const t = molTemplates[Math.floor(rand(0,molTemplates.length))];
    return {
      x: rand(0,9999), y: rand(0,9999),
      vx: rand(-0.15,0.15), vy: rand(-0.15,0.15),
      rot: rand(0,PI2), rotSpeed: rand(-0.005,0.005),
      pts: t,
      color: COLORS[Math.floor(rand(0,COLORS.length))],
      alpha: rand(0.10, 0.22),
    };
  });

  /* ── حلزون DNA ── */
  const dnaStrands = Array.from({ length: 3 }, () => ({
    x: rand(0,9999), y: rand(0,9999),
    vx: rand(-0.1,0.1), vy: rand(-0.1,0.1),
    phase: rand(0,PI2), speed: rand(0.012,0.016),
    len: rand(80,120), alpha: rand(0.1,0.18),
  }));

  /* ── معادلات علمية عائمة ── */
  const syms = ['H₂O','CO₂','E=mc²','DNA','ATP','F=ma','O₂','pH','⚛','λ','∑F'];
  const formulas = Array.from({ length: 16 }, () => ({
    x: rand(0,9999), y: rand(0,9999),
    vx: rand(-0.12,0.12), vy: rand(-0.12,0.12),
    text: syms[Math.floor(rand(0,syms.length))],
    alpha: rand(0.06, 0.13),
    size: Math.floor(rand(10,17)),
    color: COLORS[Math.floor(rand(0,COLORS.length))],
  }));

  /* ── حلقات هندسية ── */
  const rings = Array.from({ length: 5 }, () => ({
    x: rand(0,9999), y: rand(0,9999),
    vx: rand(-0.08,0.08), vy: rand(-0.08,0.08),
    r: rand(25,55), alpha: rand(0.04,0.09),
    color: COLORS[Math.floor(rand(0,COLORS.length))],
    rot: rand(0,PI2), rotSpeed: rand(-0.004,0.004),
    sides: Math.floor(rand(3,7)),
  }));

  function hexagon(cx, cy, r, sides, rot) {
    ctx.beginPath();
    for (let i = 0; i <= sides; i++) {
      const a = rot + (i / sides) * PI2;
      i === 0 ? ctx.moveTo(cx + Math.cos(a)*r, cy + Math.sin(a)*r)
               : ctx.lineTo(cx + Math.cos(a)*r, cy + Math.sin(a)*r);
    }
    ctx.closePath();
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    /* خلفية شفافة — تُترك بيضاء من الـ CSS */

    /* توهجات سماوية خفيفة مع parallax */
    const px = (mx/W - 0.5) * 20;
    const py = (my/H - 0.5) * 20;
    [
      {x:W*0.1+px,  y:H*0.15+py, r:260, c:'rgba(14,165,233,0.07)'},
      {x:W*0.85-px, y:H*0.1-py,  r:220, c:'rgba(99,102,241,0.06)'},
      {x:W*0.5+px,  y:H*0.7+py,  r:240, c:'rgba(56,189,248,0.06)'},
      {x:W*0.8-px,  y:H*0.8-py,  r:180, c:'rgba(14,165,233,0.05)'},
    ].forEach(g => {
      const rg = ctx.createRadialGradient(g.x,g.y,0,g.x,g.y,g.r);
      rg.addColorStop(0,g.c); rg.addColorStop(1,'transparent');
      ctx.fillStyle=rg; ctx.beginPath(); ctx.arc(g.x,g.y,g.r,0,PI2); ctx.fill();
    });

    /* حلقات هندسية */
    rings.forEach(rg => {
      rg.x=wrap(rg.x+rg.vx,W); rg.y=wrap(rg.y+rg.vy,H); rg.rot+=rg.rotSpeed;
      ctx.globalAlpha=rg.alpha;
      hexagon(rg.x,rg.y,rg.r,rg.sides,rg.rot);
      ctx.strokeStyle=rg.color; ctx.lineWidth=1.2; ctx.stroke();
      ctx.globalAlpha=1;
    });

    /* جسيمات */
    particles.forEach(p => {
      p.x=wrap(p.x+p.vx,W); p.y=wrap(p.y+p.vy,H);
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,PI2);
      ctx.fillStyle=p.color+Math.floor(p.alpha*255).toString(16).padStart(2,'0');
      ctx.fill();
    });

    /* ذرات */
    atoms.forEach(a => {
      a.x=wrap(a.x+a.vx,W); a.y=wrap(a.y+a.vy,H);
      a.orbits.forEach(o => { o.angle+=o.speed; });
      /* nucleus */
      const ng=ctx.createRadialGradient(a.x,a.y,0,a.x,a.y,a.nucleus*2.5);
      ng.addColorStop(0,a.color+'50'); ng.addColorStop(1,'transparent');
      ctx.fillStyle=ng; ctx.beginPath(); ctx.arc(a.x,a.y,a.nucleus*2.5,0,PI2); ctx.fill();
      ctx.beginPath(); ctx.arc(a.x,a.y,a.nucleus,0,PI2); ctx.fillStyle=a.color+'CC'; ctx.fill();
      /* مدارات وإلكترونات */
      a.orbits.forEach(o => {
        ctx.save(); ctx.translate(a.x,a.y); ctx.rotate(o.tilt); ctx.scale(1,0.38);
        ctx.beginPath(); ctx.ellipse(0,0,o.r,o.r,0,0,PI2);
        ctx.strokeStyle=a.color+'30'; ctx.lineWidth=0.8; ctx.stroke();
        const ex=Math.cos(o.angle)*o.r, ey=Math.sin(o.angle)*o.r;
        ctx.restore();
        const rx=a.x+ex*Math.cos(o.tilt)-ey*0.38*Math.sin(o.tilt);
        const ry=a.y+ex*Math.sin(o.tilt)+ey*0.38*Math.cos(o.tilt);
        ctx.beginPath(); ctx.arc(rx,ry,2,0,PI2);
        ctx.fillStyle=a.color+'BB'; ctx.fill();
      });
    });

    /* جزيئات */
    molecules.forEach(m => {
      m.x=wrap(m.x+m.vx,W); m.y=wrap(m.y+m.vy,H); m.rot+=m.rotSpeed;
      ctx.save(); ctx.translate(m.x,m.y); ctx.rotate(m.rot); ctx.globalAlpha=m.alpha;
      for(let i=0;i<m.pts.length-1;i++){
        ctx.beginPath(); ctx.moveTo(m.pts[i].x,m.pts[i].y);
        ctx.lineTo(m.pts[i+1].x,m.pts[i+1].y);
        ctx.strokeStyle=m.color; ctx.lineWidth=1.3; ctx.stroke();
      }
      m.pts.forEach((p,i)=>{
        ctx.beginPath(); ctx.arc(p.x,p.y,i===0?3.5:2.5,0,PI2);
        ctx.fillStyle=i===0?m.color:m.color+'99'; ctx.fill();
      });
      ctx.restore(); ctx.globalAlpha=1;
    });

    /* DNA */
    dnaStrands.forEach(d => {
      d.x=wrap(d.x+d.vx,W); d.y=wrap(d.y+d.vy,H); d.phase+=d.speed;
      ctx.globalAlpha=d.alpha;
      const steps=18, sh=d.len/steps;
      for(let i=1;i<steps;i++){
        const y=d.y-d.len/2+i*sh, py2=d.y-d.len/2+(i-1)*sh;
        const a1=d.phase+i/steps*PI2*2, pa1=d.phase+(i-1)/steps*PI2*2;
        ctx.beginPath(); ctx.moveTo(d.x+Math.cos(pa1)*12,py2);
        ctx.lineTo(d.x+Math.cos(a1)*12,y);
        ctx.strokeStyle='#0EA5E9'; ctx.lineWidth=1; ctx.stroke();
        ctx.beginPath(); ctx.moveTo(d.x+Math.cos(pa1+Math.PI)*12,py2);
        ctx.lineTo(d.x+Math.cos(a1+Math.PI)*12,y);
        ctx.strokeStyle='#6366F1'; ctx.lineWidth=1; ctx.stroke();
        if(i%2===0){
          ctx.beginPath();
          ctx.moveTo(d.x+Math.cos(a1)*12,y);
          ctx.lineTo(d.x+Math.cos(a1+Math.PI)*12,y);
          ctx.strokeStyle='rgba(52,211,153,0.5)'; ctx.lineWidth=0.7; ctx.stroke();
        }
      }
      ctx.globalAlpha=1;
    });

    /* معادلات */
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
