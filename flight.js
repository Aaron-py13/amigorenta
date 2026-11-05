'use strict';
(() => {
 const section=document.querySelector('#servicios'),cards=[...section.querySelectorAll('.service-grid article')];
 const story=document.querySelector('#historia'),words=[...story.querySelectorAll('.story-narration span')],video=document.querySelector('#flight-video');
 const clamp=n=>Math.max(0,Math.min(1,n)),ease=n=>n*n*(3-2*n);let raf=0,failed=false;
 function route(t){if(t<=1.3)return 0;if(t<3.6)return ease((t-1.3)/2.3);if(t<=4.8)return 1;if(t<7.2)return 1+ease((t-4.8)/2.4);return 2;}
 function draw(){raf=0;const enabled=document.body.classList.contains('motion'),p=clamp(-section.getBoundingClientRect().top/Math.max(1,section.offsetHeight-innerHeight)),s=clamp(-story.getBoundingClientRect().top/Math.max(1,story.offsetHeight-innerHeight));
 words.forEach((word,i)=>{const t=enabled?clamp(((s-.52)/.34)*1.35-(i/words.length)*.35):1;word.style.opacity=String(t);word.style.transform=`translateY(${(1-t)*18}px)`;});
 const time=p*8.96,position=route(time),index=Math.round(position),mobile=innerWidth<=760;
 cards.forEach((card,i)=>{const delta=i-position,weight=1-clamp(Math.abs(delta));card.style.opacity=enabled?String(mobile?weight:.42+.58*weight):'1';card.style.visibility=enabled&&mobile&&weight<.01?'hidden':'visible';card.style.transform=enabled?(mobile?`translate3d(${delta*110}%,0,0)`:`translateY(${(1-weight)*18}px)`):'none';card.classList.toggle('flight-active',enabled&&i===index);});
 document.querySelector('#flight-count').textContent=`0${index+1} / 03`;
 if(!failed&&Number.isFinite(video.duration)&&video.duration>0&&!video.seeking){const target=enabled?Math.min(time,video.duration-.04):0;if(Math.abs(video.currentTime-target)>.04)video.currentTime=target;}}
 function schedule(){if(!raf)raf=requestAnimationFrame(draw);}
 video.addEventListener('loadedmetadata',schedule);video.addEventListener('seeked',schedule);video.addEventListener('error',()=>{failed=true;});
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule,{passive:true});addEventListener('load',schedule);schedule();
})();
