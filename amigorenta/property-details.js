'use strict';
function renderDetails(p){
 const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const box=document.querySelector('#modal-details'),address=encodeURIComponent(p.address);
 const features=[['▦',p.bedrooms+' habitaciones','En la vivienda · ejemplo'],['♧',p.bathrooms+' baño','Compartido · ejemplo'],['⌂','Amoblada','Habitación privada · ejemplo'],['⌁','Wi-Fi','Incluido · ejemplo'],['◉','Lavandería',p.laundry+' · ejemplo'],['♡','Mascotas',p.pets]];
 box.innerHTML=`<span class="detail-type">HABITACIÓN PRIVADA</span><div class="detail-price">CAD ${p.price.toLocaleString('en-CA')} <small>/ mes</small></div><p class="detail-availability">${escape(p.availability)} · Ejemplo</p><p class="demo-label">DATOS DE EJEMPLO · CONFIRMAR ANTES DE RESERVAR</p><h3>Detalles de la propiedad</h3><div class="detail-features">${features.map(([icon,title,note])=>`<div><span class="feature-icon" aria-hidden="true">${icon}</span><strong>${escape(title)}</strong><small>${escape(note)}</small></div>`).join('')}</div><dl><dt>Depósito de ejemplo</dt><dd>CAD ${p.deposit.toLocaleString('en-CA')}</dd><dt>Estancia de ejemplo</dt><dd>${escape(p.term)}</dd><dt>Servicios de ejemplo</dt><dd>${escape(p.includes.join(' · '))}</dd></dl><div class="detail-description"><h3>Un poco sobre este espacio</h3><p>${escape(p.description)}</p></div><div class="detail-location"><h3>Ubicación</h3><p>${escape(p.address)}</p><iframe title="Mapa de ${escape(p.name)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://maps.google.com/maps?q=${address}&output=embed" allowfullscreen></iframe><div class="map-actions"><a class="map-primary" href="https://www.google.com/maps/search/?api=1&query=${address}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg><span>Ver ubicación en Maps</span><span class="map-arrow" aria-hidden="true">↗</span></a><button id="copy-address">Copiar dirección</button></div><p class="map-note">El mapa necesita internet. Confirma la ubicación exacta con el equipo.</p><p id="copy-result" role="status"></p></div>`;
 document.querySelector('#copy-address').addEventListener('click',async()=>{const status=document.querySelector('#copy-result');try{await navigator.clipboard.writeText(p.address);status.textContent='Dirección copiada.';}catch{status.textContent='Copia esta dirección: '+p.address;}});

}
(() => {
 const modal=document.querySelector('#gallery-modal');
 const cards=[...document.querySelectorAll('.property-card')];
 const indices=new Map();
 cards.forEach(card=>{const id=Number(card.querySelector('[data-property]').dataset.property),p=properties[id];indices.set(id,Math.max(0,p.photos.indexOf(p.cover)));});
 const timer=setInterval(()=>{
  if(document.hidden)return;
  if(modal.open){if(motion)movePhoto(1);return;}
  if(!motion)return;
  cards.forEach(card=>{
   const rect=card.getBoundingClientRect();if(card.hidden||rect.bottom<0||rect.top>innerHeight||card.matches(':hover')||card.contains(document.activeElement))return;
   const id=Number(card.querySelector('[data-property]').dataset.property),p=properties[id],index=(indices.get(id)+1)%p.photos.length;
   const target=card.querySelector('.card-photo img'),next=new Image();
   next.onload=()=>{if(!card.isConnected)return;target.src=next.src;target.alt=p.name+' · Foto '+(index+1);indices.set(id,index);};next.src='assets/'+p.photos[index];
  });
 },4500);
 addEventListener('pagehide',()=>clearInterval(timer),{once:true});
})();
