const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch({});
const p=await b.newPage({viewport:{width:1280,height:720},deviceScaleFactor:1.5});
await p.goto('https://keramahall.vercel.app/',{waitUntil:'networkidle'});
await p.evaluate(()=>{const s=document.createElement('style');s.textContent='::-webkit-scrollbar{display:none}';document.head.appendChild(s);});
await p.waitForTimeout(5000);
const H=720, top=async id=>p.evaluate(id=>{const s=document.getElementById(id);return s.getBoundingClientRect().top+scrollY;},id);
const hgt=async id=>p.evaluate(id=>document.getElementById(id).offsetHeight,id);
let f=0, y=0;
const ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
async function shot(){ await p.waitForTimeout(30); await p.screenshot({path:`frames/f${String(f++).padStart(5,'0')}.jpg`,type:'jpeg',quality:88}); }
async function hold(n){ for(let i=0;i<n;i++) await shot(); }
async function go(to,n){ const y0=y; for(let i=1;i<=n;i++){ y=Math.round(y0+(to-y0)*ease(i/n)); await p.evaluate(v=>window.scrollTo(0,v),y); await shot(); } }
const prod=await top('production'), street=await top('street'), sh=await hgt('street'), house=await top('home3d'), hh=await hgt('home3d'), part=await top('partners');
await hold(45);                                   // первый экран
await go(prod+ (await hgt('production'))-H, 90);  // факты
await go(street+sh-H, 150);                        // терраса
await hold(30);
await go(house+(hh-H)*0.66, 240);                  // коридор → ванная
await go(house+(hh-H)*1.0, 120);                   // смена коллекций
await hold(30);
await go(part, 60);
await hold(20);
for(const v of ['2','25','250','2500','3500']){ await p.fill('#rrp',v); await p.dispatchEvent('#rrp','input'); await hold(5); }
await hold(20);
await p.evaluate(()=>{const c=document.querySelector('#partners input[type=checkbox]'); c.click();});
await hold(45);
console.log('frames',f);
await b.close();})();