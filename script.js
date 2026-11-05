'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
const ease=x=>x*x*(3-2*x);
let motion=!matchMedia('(prefers-reduced-motion: reduce)').matches;
let queued=false, heroIndex=-1;
const heroTitles=['Tu amigo<br>en <em>Vancouver.</em>','Tu espacio.<br><em>Tu comienzo.</em>','Una ciudad.<br><em>Mil historias.</em>'];
const heroDescriptions=['Una nueva ciudad. Un espacio para ti.<br>Y alguien que habla tu idioma.','Habitaciones reales para tu próxima etapa.<br>Conoce cada detalle antes de decidir.','Explora nuestras propiedades en Vancouver y Burnaby.<br>Hablemos de dónde quieres estar.'];
const heroLocations=['EVERGREEN PLACE, BURNABY','KINGS AVENUE, VANCOUVER','EVERGREEN PLACE, BURNABY'];

function progress(el){return clamp(-el.getBoundingClientRect().top/Math.max(1,el.offsetHeight-innerHeight));}
function jump(el,p){window.scrollTo({top:el.getBoundingClientRect().top+scrollY+p*Math.max(0,el.offsetHeight-innerHeight),behavior:motion?'smooth':'instant'});}
function heroText(index){if(index===heroIndex)return;heroIndex=index;$('.hero-copy h1').innerHTML=heroTitles[index];$('#hero-description').innerHTML=heroDescriptions[index];$('#hero-location').textContent=`0${index+1} / 03 · ${heroLocations[index]}`;$$('[data-hero]').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===index)));}

function draw(){queued=false;if(!motion)return;
 const hp=progress($('.hero-scroll')), ht=clamp((hp-.08)/.84)*2;
 heroText(Math.round(ht));
 $$('.hero-slide').forEach((slide,i)=>{const arrival=clamp(i-ht),departure=clamp(ht-i);slide.style.opacity=String(i===0?1:ease(clamp(ht-i+1)));slide.style.transform=`translate3d(0,${arrival*35-departure*18}%,0)`;slide.querySelector('img').style.transform=`scale(${1.22-.12*ease(1-arrival)}) translate3d(0,${departure*10-arrival*10}%,0)`;});
 $('.hero-copy').style.transform=`translate3d(0,${-hp*65}px,0)`;
 $('.hero-line').style.transform=`scaleX(${hp})`;

}
function requestDraw(){if(!queued){queued=true;requestAnimationFrame(draw);}}
function setMotion(enabled){motion=enabled;document.body.classList.toggle('motion',motion);document.body.classList.toggle('paused',!motion);
 if(!motion){$$('.hero-slide').forEach((el,i)=>{el.style.opacity=i===0?'1':'0';el.style.transform='none';el.querySelector('img').style.transform='none';});$('.hero-copy').style.transform='none';heroText(0);}else requestDraw();
}
setMotion(motion);
addEventListener('scroll',requestDraw,{passive:true});addEventListener('resize',requestDraw,{passive:true});addEventListener('load',requestDraw);
$$('[data-hero]').forEach(b=>b.addEventListener('click',()=>{const i=Number(b.dataset.hero);if(motion)jump($('.hero-scroll'),.08+i*.42);else{$$('.hero-slide').forEach((el,j)=>el.style.opacity=j===i?'1':'0');heroText(i);}}));$$('[data-filter]').forEach(button=>button.addEventListener('click',()=>{$$('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));$$('.property-card').forEach(card=>card.hidden=button.dataset.filter!=='all'&&card.dataset.city!==button.dataset.filter);requestDraw();}));
function openDialog(dialog){dialog.showModal();document.body.classList.add('modal-open');}
$$('dialog').forEach(dialog=>{dialog.querySelector('.close').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');$('#menu-btn').setAttribute('aria-expanded','false');});});
$('#menu-btn').addEventListener('click',()=>{openDialog($('#menu'));$('#menu-btn').setAttribute('aria-expanded','true');});
$$('#menu a').forEach(a=>a.addEventListener('click',()=>$('#menu').close()));
let selectedProperty=0,selectedPhoto=0;
function showPhoto(){const p=properties[selectedProperty];$('#modal-image').src='assets/'+p.photos[selectedPhoto];$('#modal-image').alt=p.name+' · Foto '+(selectedPhoto+1);}
$$('[data-property]').forEach(button=>button.addEventListener('click',()=>{selectedProperty=Number(button.dataset.property);selectedPhoto=0;const p=properties[selectedProperty];$('#modal-name').textContent=p.name;$('#modal-city').textContent=p.city;$('#modal-contact').href='https://wa.me/16046538650?text='+encodeURIComponent('Hola Amigo Rentals, quisiera consultar disponibilidad y un video tour de '+p.name+', '+p.city+'.');renderDetails(p);showPhoto();openDialog($('#gallery-modal'));}));
function movePhoto(dir){selectedPhoto=(selectedPhoto+dir+properties[selectedProperty].photos.length)%properties[selectedProperty].photos.length;showPhoto();}
$('#gallery-modal').addEventListener('keydown',e=>{if(e.key==='ArrowLeft')movePhoto(-1);if(e.key==='ArrowRight')movePhoto(1);});
if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.remove('waiting');observer.unobserve(e.target);}}),{threshold:.08});$$('.section-top').forEach(el=>{el.classList.add('reveal','waiting');observer.observe(el);});}
