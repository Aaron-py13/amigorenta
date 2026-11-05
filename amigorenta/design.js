'use strict';
// Editorial cards and the 2007 story use native scrolling; no wheel hijacking.
(() => {
 const cards=[...document.querySelectorAll('.property-card')];
 const story=document.querySelector('.story-scroll');
 const postcards=[...document.querySelectorAll('.postcard')];
 const year=document.querySelector('.story-year');
 const finePointer=matchMedia('(hover: hover) and (pointer: fine)');
 const limit=(n,a=0,b=1)=>Math.min(b,Math.max(a,n));
 let frame=0;
 function update(){
  frame=0;
  const enabled=document.body.classList.contains('motion');
  const visible=cards.filter(c=>!c.hidden);
  visible.forEach((card,i)=>{
   card.style.setProperty('--card-order',String(i%2));
   card.style.setProperty('--entrance-delay',(i%3)*100+'ms');
   const rect=card.getBoundingClientRect();
   const p=limit((innerHeight-rect.top)/(innerHeight+rect.height));
   card.style.setProperty('--image-y',enabled?((p-.5)*(innerWidth<700?65:90))+'px':'0px');
   if(!enabled){card.style.setProperty('--tilt-x','0deg');card.style.setProperty('--tilt-y','0deg');}
  });
  const rect=story.getBoundingClientRect();
  const p=limit(-rect.top/Math.max(1,story.offsetHeight-innerHeight));
  // 0–15%: photos hold. 15–48%: every photo leaves the viewport.
  // Only after 52% does the centered narration replace them.
  const exit=enabled?limit((p-.15)/.33):0;
  const easedExit=exit*exit*(3-2*exit);
  const textProgress=enabled?limit((p-.52)/.12):1;
  const heading=document.querySelector('.story-heading');
  const narration=document.querySelector('.story-narration');
  const stamp=document.querySelector('.story-stamp');
  heading.style.opacity=enabled?String(1-easedExit):'1';
  heading.style.transform=enabled?`translateY(${-easedExit*55}px)`:'none';
  narration.style.opacity=String(textProgress);
  narration.style.visibility=enabled&&textProgress===0?'hidden':'visible';
  narration.style.transform=enabled?`translateY(${(1-textProgress)*55}px)`:'none';
  stamp.style.opacity=enabled?String(1-easedExit):'1';
  stamp.style.visibility=enabled&&exit===1?'hidden':'visible';
  stamp.style.transform=`translateY(${-easedExit*180}px) rotate(${12+easedExit*35}deg)`;
  year.style.opacity=enabled?String(1-easedExit*.68):'1';
  year.style.transform=enabled?`translateX(${(p-.5)*120}px) scale(${.94+p*.12})`:'none';
  postcards.forEach((card,i)=>{
   const spread=enabled?(p-.5):0;
   const x=(i-1)*spread*105+(i-1)*easedExit*((globalThis.innerWidth||1920)+500);
   const y=enabled?(i===1?-easedExit*(innerHeight+600):easedExit*180):0;
   const rotation=[-13,4,14][i]+(i-1)*spread*18+(i-1)*easedExit*55;
   card.style.transform=`translateX(calc(-50% + ${x}px)) translateY(${y}px) rotate(${rotation}deg)`;
   card.style.opacity=enabled?String(1-limit((exit-.9)/.1)):'1';
   card.style.visibility=enabled&&exit===1?'hidden':'visible';
  });
  document.querySelector('.story-progress').style.transform=`scaleX(${p})`;
 }
 function schedule(){if(!frame)frame=requestAnimationFrame(update);}
 cards.forEach(card=>{
  card.addEventListener('pointermove',event=>{
   if(!finePointer.matches||!document.body.classList.contains('motion'))return;
   const r=card.getBoundingClientRect();
   card.style.setProperty('--tilt-x',((.5-(event.clientY-r.top)/r.height)*5)+'deg');
   card.style.setProperty('--tilt-y',(((event.clientX-r.left)/r.width-.5)*6)+'deg');
  });
  card.addEventListener('pointerleave',()=>{card.style.setProperty('--tilt-x','0deg');card.style.setProperty('--tilt-y','0deg');});
 });
 if('IntersectionObserver' in window){
  const entrance=new IntersectionObserver(entries=>entries.forEach(entry=>{
   if(entry.isIntersecting){entry.target.classList.remove('catalog-wait');entrance.unobserve(entry.target);}
  }),{threshold:.08});
  cards.forEach(card=>{card.classList.add('catalog-wait');entrance.observe(card);});
 }
 document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{
  schedule();
  if(document.body.classList.contains('motion'))cards.filter(c=>!c.hidden).forEach((c,i)=>c.querySelector('.property-open').animate([{opacity:.3,translate:'0 25px'},{opacity:1,translate:'0 0'}],{duration:450,delay:i*45,easing:'ease-out'}));
 }));
 
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule,{passive:true});addEventListener('load',schedule);
 schedule();
})();
