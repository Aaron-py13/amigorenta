'use strict';
(() => {
 const cards=[...document.querySelectorAll('.audience-card')];
 if(!('IntersectionObserver' in window))return;
 const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('audience-enter');entry.target.classList.remove('audience-wait');observer.unobserve(entry.target);}});
 },{threshold:.12});
 cards.forEach(card=>{card.classList.add('audience-wait');observer.observe(card);});
})();
