const { chromium } = require('playwright');const fs=require('fs');
const OUT='shots/';
const mode=process.argv[2];fs.mkdirSync(OUT,{recursive:true});
(async()=>{const b=await chromium.launch();
async function page(w,h,dpr){const p=await b.newPage({viewport:{width:w,height:h},deviceScaleFactor:dpr||1});
 await p.goto(process.env.URL||'https://keramahall.vercel.app/',{waitUntil:'networkidle',timeout:90000});await p.waitForTimeout(2500);return p;}
async function at(p,sel,f,name,q){const y=await p.evaluate(([sel,f])=>{const s=document.querySelector(sel);const r=s.getBoundingClientRect().top+scrollY;return Math.round(r+f*Math.max(0,s.offsetHeight-innerHeight));},[sel,f]);
 const cur=await p.evaluate(()=>scrollY);for(let k=1;k<=8;k++){await p.evaluate(v=>window.scrollTo(0,v),Math.round(cur+(y-cur)*k/8));await p.waitForTimeout(80);}
 await p.waitForLoadState('networkidle').catch(()=>{});await p.waitForTimeout(+(process.env.WAIT||1800));await p.screenshot({path:OUT+name+'.jpg',type:'jpeg',quality:q||86});}
if(mode==='clean'){const p=await page(1600,1000);
 await p.addStyleTag({content:'.hdr,.mg,.mg-scrim,.roombar,#production .copy,#production h1,#production .facts{visibility:hidden!important}'});
 await at(p,'#home3d',0.247,'c-corridor');await at(p,'#home3d',0.453,'c-living');
 for(const [i,f] of [[0,.72],[1,.80],[2,.88],[3,.97]]) await at(p,'#home3d',f,'c-bath'+i);
 await at(p,'#production',0.5,'c-prod');}
else if(mode==='street'){let p=await page(1440,900);for(const f of [0.95]) await at(p,'#street',f,'d-street-'+f);await p.close();p=await page(390,844,2);for(const f of [0.95]) await at(p,'#street',f,'m-street-'+f);}
else{
 let p=await page(1440,900);
 for(const [n,s,f] of [['d-hero','body',0],['d-street','#street',0.95],['d-house2','#home3d',0.62],['d-bath','#home3d',0.88],['d-dealer','#partners',0],['d-pro','#pro',0]]) await at(p,s,f,n);
 await p.close();
 p=await page(1280,800);
 for(const f of [0.15,0.5,0.85]) await at(p,'#production',f,'prod-'+f);
 for(let i=0;i<18;i++) await at(p,'#home3d',i/17*0.7,'walk-'+String(i).padStart(2,'0'),80);
 for(const [i,f] of [[0,.72],[1,.80],[2,.88],[3,.97]]) await at(p,'#home3d',f,'bath-'+i);
 for(let i=0;i<5;i++) await at(p,'#film',0.02+i*0.235,'film-'+i);
 await at(p,'#request',0,'request');await at(p,'#about',0,'about');
 await p.close();
 p=await page(390,844,2);
 for(const [n,s,f] of [['m-hero','body',0],['m-street','#street',0.95],['m-house','#home3d',0.62],['m-dealer','#partners',0.3],['m-bath','#home3d',0.8],['m-film','#film',0.25]]) await at(p,s,f,n);
}
await b.close();})();
