const products={
  rain:{name:'Rain on Stone',price:195,image:'assets/rain-on-stone.webp',number:'Nº 01',description:'Wet limestone after summer rain. Black tea and violet leaf settle into a mineral trace of vetiver and cedar.',top:'Petrichor · Bergamot',heart:'Black tea · Violet leaf',base:'Vetiver · Cedarwood'},
  lantern:{name:'Lantern in the Fog',price:210,image:'assets/lantern-in-fog.webp',number:'Nº 02',description:'A warm point of resin seen through cold air. Olibanum and black pepper dissolve into labdanum and amber.',top:'Black pepper · Elemi',heart:'Olibanum · Labdanum',base:'Amber · Smoked woods'},
  paper:{name:'Paper Binding',price:185,image:'assets/paper-binding.webp',number:'Nº 03',description:'The dry intimacy of an old volume. Orris, black ink and worn leather rest on a pale cedar accord.',top:'Aldehydes · Orris',heart:'Black ink · Book cloth',base:'Cedar · Pale leather'},
  discovery:{name:'Archive Discovery Set',price:48,image:'assets/rain-on-stone.webp',number:'Study set',description:'Three 2 ml studies selected from the archive.',top:'Selected by you',heart:'Three observations',base:'Redeemable with 50 ml'}
};
let cart=[];let activeProduct='rain';
const $=(selector,scope=document)=>scope.querySelector(selector);const $$=(selector,scope=document)=>[...scope.querySelectorAll(selector)];

window.addEventListener('load',()=>setTimeout(()=>$('.opening')?.classList.add('done'),350));
$('.announcement button')?.addEventListener('click',e=>e.currentTarget.parentElement.remove());

const header=$('.site-header');let wasSticky=false;
window.addEventListener('scroll',()=>{const sticky=scrollY>140;if(sticky!==wasSticky){header.classList.toggle('sticky',sticky);wasSticky=sticky;}if(innerWidth>700){const image=$('.hero-image img');if(image)image.style.transform=`scale(1.04) translateY(${Math.min(scrollY*.025,16)}px)`;}},{passive:true});
const menuButton=$('.menu-button'),nav=$('#site-nav');
function closeMenu({restoreFocus=false}={}){const wasOpen=menuButton?.getAttribute('aria-expanded')==='true';nav?.classList.remove('open');menuButton?.setAttribute('aria-expanded','false');if(menuButton)menuButton.querySelector('span').textContent='Menu';if(restoreFocus&&wasOpen)menuButton.focus();}
menuButton?.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);menuButton.querySelector('span').textContent=open?'Close':'Menu';});
$$('#site-nav a').forEach(a=>a.addEventListener('click',()=>closeMenu()));

const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.12});
$$('.reveal').forEach((el,index)=>{el.style.transitionDelay=`${Math.min(index%4,3)*60}ms`;observer.observe(el);});

$$('[data-filter]').forEach(button=>button.addEventListener('click',()=>{const filter=button.dataset.filter;$$('[data-filter]').forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});$$('.product-card').forEach(card=>{card.classList.toggle('filtered-out',filter!=='all'&&card.dataset.family!==filter);});}));

const dialog=$('.product-dialog');
function openProduct(id){const p=products[id];if(!p)return;activeProduct=id;$('.dialog-image img').src=p.image;$('.dialog-image img').alt=`${p.name} perfume`;$('.dialog-number').textContent=p.number;$('.dialog-name').textContent=p.name;$('.dialog-description').textContent=p.description;$('.dialog-top').textContent=p.top;$('.dialog-heart').textContent=p.heart;$('.dialog-base').textContent=p.base;$('.dialog-price').textContent=`€${p.price}`;dialog.showModal();document.body.classList.add('locked');}
$$('.product-card').forEach(card=>$('.product-image',card)?.addEventListener('click',()=>openProduct(card.dataset.id)));
$('.close-dialog')?.addEventListener('click',()=>dialog.close());dialog?.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});dialog?.addEventListener('close',()=>document.body.classList.remove('locked'));

function addToCart(id,customName){const p={...products[id]};if(customName)p.name=customName;cart.push({...p,size:id==='discovery'?'3 × 2 ml':'50 ml · Extrait',lineId:crypto.randomUUID?.()||`${Date.now()}-${Math.random()}`});renderCart();openCart();}
$$('.product-card').forEach(card=>$('.quick-add',card)?.addEventListener('click',()=>addToCart(card.dataset.id)));
$('.dialog-add')?.addEventListener('click',()=>{const size=$('input[name="size"]:checked').value;if(size==='2 ml sample'){const p={...products[activeProduct],price:12};cart.push({...p,name:`${p.name} · Sample`,size:'2 ml sample',lineId:`${Date.now()}`});renderCart();dialog.close();openCart();}else{dialog.close();addToCart(activeProduct);}});

const cartPanel=$('.cart'),scrim=$('.scrim');
const cartTrigger=$('.cart-button');let cartReturnFocus=null;
const cartBackground=$$('body > *').filter(element=>element!==cartPanel&&element!==scrim&&element.tagName!=='SCRIPT');
cartPanel.setAttribute('inert','');
function openCart(){cartReturnFocus=document.activeElement;cartPanel.removeAttribute('inert');cartPanel.classList.add('open');cartPanel.setAttribute('aria-hidden','false');cartTrigger?.setAttribute('aria-expanded','true');scrim.hidden=false;cartBackground.forEach(element=>element.setAttribute('inert',''));document.body.classList.add('locked');setTimeout(()=>$('.close-cart')?.focus(),50)}
function closeCart({restoreFocus=true}={}){if(!cartPanel.classList.contains('open'))return;cartPanel.classList.remove('open');cartPanel.setAttribute('aria-hidden','true');cartPanel.setAttribute('inert','');cartTrigger?.setAttribute('aria-expanded','false');scrim.hidden=true;cartBackground.forEach(element=>element.removeAttribute('inert'));document.body.classList.remove('locked');if(restoreFocus&&cartReturnFocus instanceof HTMLElement)cartReturnFocus.focus();cartReturnFocus=null;}
function trapCartFocus(event){if(event.key!=='Tab'||!cartPanel.classList.contains('open'))return;const focusable=$$('button:not([disabled]),a[href],input:not([disabled])',cartPanel).filter(element=>!element.inert);if(!focusable.length)return;const first=focusable[0],last=focusable.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}
cartTrigger?.addEventListener('click',openCart);$('.close-cart')?.addEventListener('click',()=>closeCart());scrim?.addEventListener('click',()=>closeCart());
function renderCart(){$$('[data-cart-count]').forEach(el=>el.textContent=cart.length);$('[data-subtotal]').textContent=`€${cart.reduce((sum,item)=>sum+item.price,0)}`;const status=$('[data-checkout-status]');if(status)status.textContent='';const wrap=$('.cart-items');if(!cart.length){wrap.innerHTML='<div class="empty-cart"><span>∅</span><p>Your archive is empty.</p><a href="#collection">Explore the collection</a></div>';$('.empty-cart a').addEventListener('click',()=>closeCart());return;}wrap.innerHTML=cart.map(item=>`<article class="cart-line"><img src="${item.image}" alt=""/><div><h3>${item.name}</h3><p>${item.size}</p><button type="button" data-remove="${item.lineId}" aria-label="Remove ${item.name} from cart">Remove</button></div><strong>€${item.price}</strong></article>`).join('');$$('[data-remove]',wrap).forEach(btn=>btn.addEventListener('click',()=>{cart=cart.filter(item=>item.lineId!==btn.dataset.remove);renderCart();}));}
$('[data-checkout]')?.addEventListener('click',()=>{const status=$('[data-checkout-status]');if(!status)return;status.textContent=cart.length?'Checkout is a portfolio demonstration; no payment or order has been submitted.':'Add a fragrance before previewing checkout.';});

const scentData={mineral:{number:'Nº 01',family:'Aquatic / Mineral',name:'Rain on Stone',notes:'Petrichor, black tea, violet leaf, vetiver and wet cedar.',id:'rain'},resin:{number:'Nº 02',family:'Resinous / Amber',name:'Lantern in the Fog',notes:'Olibanum, black pepper, labdanum, amber and smoked woods.',id:'lantern'},paper:{number:'Nº 03',family:'Dry woods / Leather',name:'Paper Binding',notes:'Orris, black ink, worn book cloth, pale leather and cedar.',id:'paper'}};
$$('[data-scent]').forEach(button=>button.addEventListener('click',()=>{const item=scentData[button.dataset.scent];$$('[data-scent]').forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});const result=$('.index-result');result.animate([{opacity:.35,transform:'translateY(8px)'},{opacity:1,transform:'none'}],{duration:420,easing:'ease-out'});$('.result-number').textContent=item.number;$('.result-family').textContent=item.family;$('.result-name').textContent=item.name;$('.result-notes').textContent=item.notes;$('.result-add').textContent=`Add study to cart · €${products[item.id].price}`;$('.result-add').dataset.id=item.id;}));
$('.result-add')?.addEventListener('click',e=>addToCart(e.currentTarget.dataset.id||'rain'));

let samples=[];$$('[data-sample]').forEach(button=>button.addEventListener('click',()=>{const name=button.dataset.sample;if(button.classList.contains('selected')){samples=samples.filter(s=>s!==name);button.classList.remove('selected');button.setAttribute('aria-pressed','false');button.querySelector('i').textContent='＋';}else if(samples.length<3){samples.push(name);button.classList.add('selected');button.setAttribute('aria-pressed','true');button.querySelector('i').textContent='✓';}else{const count=$('.selection-count');count.animate([{transform:'translateX(-5px)'},{transform:'translateX(5px)'},{transform:'none'}],{duration:240});} $('[data-selection-count]').textContent=samples.length;$('.build-set').disabled=samples.length!==3;}));
$('.build-set')?.addEventListener('click',()=>addToCart('discovery',`Discovery Set · ${samples.join(', ')}`));

$('.newsletter form')?.addEventListener('submit',e=>{e.preventDefault();$('.form-status').textContent='Concept demo only — no mailing list is connected and no data was sent.';});
document.addEventListener('keydown',e=>{trapCartFocus(e);if(e.key==='Escape'){if(cartPanel.classList.contains('open'))closeCart();else if(dialog.open)dialog.close();else closeMenu({restoreFocus:true});}});
