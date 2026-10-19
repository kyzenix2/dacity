const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const nav=document.getElementById('nav');
const par=[...document.querySelectorAll('[data-speed]')];
let ticking=false;
function onScroll(){
  const y=scrollY;
  nav.classList.toggle('solid',y>40);
  if(!RM)par.forEach(e=>e.style.transform=`translate3d(0,${y*e.dataset.speed}px,0)`);
  ticking=false;
}
addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(onScroll)}},{passive:true});
onScroll();

const io=new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}
}),{threshold:.12,rootMargin:'0px 0px -8% 0px'});
document.querySelectorAll('.reveal').forEach((e,i)=>{
  e.style.transitionDelay=(i%5)*70+'ms';
  io.observe(e);
});

document.querySelectorAll('[data-copy]').forEach(b=>b.onclick=()=>{
  const code=b.previousElementSibling;
  navigator.clipboard.writeText(code.textContent.trim());
  b.textContent='Copied!';
  setTimeout(()=>b.textContent='Copy',1500);
});

const lb=document.getElementById('lightbox');
document.querySelectorAll('.wall figure').forEach(f=>f.onclick=()=>{
  lb.querySelector('img').src=f.querySelector('img').src;
  lb.querySelector('p').textContent=f.querySelector('figcaption').textContent;
  lb.classList.add('on');
});
lb.onclick=e=>{if(e.target!==lb.querySelector('img'))lb.classList.remove('on')};
addEventListener('keydown',e=>{if(e.key==='Escape')lb.classList.remove('on')});

const neon=document.getElementById('neon'),nx=neon.getContext('2d');
let dots=[],streaks=[],running=true;
function sizeNeon(){
  neon.width=innerWidth;neon.height=innerHeight;
  const n=Math.min(RM?12:40,Math.floor(innerWidth/42));
  dots=Array.from({length:n},()=>({
    x:Math.random()*neon.width,y:Math.random()*neon.height,
    r:Math.random()*1.9+.3,vx:(Math.random()-.5)*.3,vy:(Math.random()-.5)*.3,
    c:Math.random()>.4?'#ff2d95':'#ffc857',a:.3+Math.random()*.45
  }));
  streaks=RM?[]:Array.from({length:5},()=>({
    x:Math.random()*neon.width,y:-Math.random()*neon.height,
    len:80+Math.random()*100,sp:2.2+Math.random()*3.2,c:Math.random()>.5?'#ff2d95':'#ffc857'
  }));
}
sizeNeon();addEventListener('resize',sizeNeon);
document.addEventListener('visibilitychange',()=>{running=!document.hidden});
(function drawNeon(){
  if(running){
    nx.clearRect(0,0,neon.width,neon.height);
    dots.forEach(d=>{
      d.x+=d.vx;d.y+=d.vy;
      if(d.x<0||d.x>neon.width)d.vx*=-1;
      if(d.y<0||d.y>neon.height)d.vy*=-1;
      nx.beginPath();nx.arc(d.x,d.y,d.r,0,Math.PI*2);
      nx.fillStyle=d.c;nx.globalAlpha=d.a;nx.fill();
    });
    streaks.forEach(s=>{
      s.y+=s.sp;
      if(s.y>neon.height+s.len){s.y=-s.len;s.x=Math.random()*neon.width}
      const g=nx.createLinearGradient(s.x,s.y,s.x,s.y+s.len);
      g.addColorStop(0,'transparent');g.addColorStop(.45,s.c);g.addColorStop(1,'transparent');
      nx.globalAlpha=.35;nx.strokeStyle=g;nx.lineWidth=1.5;
      nx.beginPath();nx.moveTo(s.x,s.y);nx.lineTo(s.x,s.y+s.len);nx.stroke();
    });
    nx.globalAlpha=1;
  }
  requestAnimationFrame(drawNeon);
})();

const cv=document.getElementById('fx'),cx=cv.getContext('2d');
let parts=[];
function sizeFx(){cv.width=innerWidth;cv.height=innerHeight}sizeFx();addEventListener('resize',sizeFx);
function beep(){
  try{
    const a=new AudioContext(),o=a.createOscillator(),g=a.createGain();
    o.type='square';o.frequency.setValueAtTime(380,a.currentTime);
    o.frequency.exponentialRampToValueAtTime(160,a.currentTime+.3);
    g.gain.setValueAtTime(.14,a.currentTime);g.gain.exponentialRampToValueAtTime(.001,a.currentTime+.35);
    o.connect(g);g.connect(a.destination);o.start();o.stop(a.currentTime+.35);
  }catch(e){}
}
function pulse(big){
  beep();
  document.body.classList.remove('shake');void document.body.offsetWidth;document.body.classList.add('shake');
  document.getElementById('flash').animate([{opacity:.85},{opacity:0}],{duration:650});
  const n=big?120:50;
  const colors=['#ff2d95','#ffc857','#e6007a','#ff6bcb','#ff9f1c'];
  for(let i=0;i<n;i++)parts.push({
    x:innerWidth/2,y:innerHeight/2,
    vx:(Math.random()-.5)*22,vy:(Math.random()-.8)*16,
    r:2+Math.random()*5,c:colors[i%colors.length],l:1
  });
  if(parts.length===n)loop();
}
function loop(){
  cx.clearRect(0,0,cv.width,cv.height);
  parts.forEach(p=>{
    p.x+=p.vx;p.y+=p.vy;p.vy+=.42;p.l-=.014;
    cx.globalAlpha=Math.max(p.l,0);cx.fillStyle=p.c;
    cx.beginPath();cx.arc(p.x,p.y,p.r,0,Math.PI*2);cx.fill();
  });
  parts=parts.filter(p=>p.l>0&&p.y<innerHeight+40);
  if(parts.length)requestAnimationFrame(loop);else cx.clearRect(0,0,cv.width,cv.height);
}
document.getElementById('pulseBtn').onclick=()=>pulse(false);
let buf='';
addEventListener('keydown',e=>{
  if(e.key.length!==1)return;
  buf=(buf+e.key.toLowerCase()).slice(-6);
  if(buf==='dacity')pulse(true);
});
