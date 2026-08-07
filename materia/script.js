const products = {
  'barrier-serum': { name: 'Barrier Serum 01', price: 58, number: '/01', family: 'Treat / Object 01', description: 'A concentrated daily serum for stressed, dehydrated and reactive skin.', ingredients: ['Ectoin 2%', 'Beta-glucan', 'Ceramide NP'] },
  'mineral-cleanse': { name: 'Mineral Cleanse 02', price: 34, number: '/02', family: 'Cleanse / Object 02', description: 'A low-foam mineral cleanser that removes the day without stripping the barrier.', ingredients: ['Amino-acid surfactants', 'White kaolin', 'Glycerin'] },
  'lipid-veil': { name: 'Lipid Veil 03', price: 52, number: '/03', family: 'Seal / Object 03', description: 'A compact lipid cream that seals in water and softens signs of barrier fatigue.', ingredients: ['Sugarcane squalane', 'Cholesterol', 'Oat lipid'] },
  'night-shift': { name: 'Night Shift 04', price: 64, number: '/04', family: 'Treat / Object 04', description: 'A buffered retinal treatment for texture, tone and visibly steadier skin over time.', ingredients: ['Retinal 0.1%', 'Signal peptide', 'Bisabolol'] }
};

const cart = [];
const money = (number) => `€${number}`;
const body = document.body;
const drawer = document.querySelector('.cart-drawer');
const backdrop = document.querySelector('.drawer-backdrop');
const dialog = document.querySelector('.product-dialog');
const cartTriggers = [...document.querySelectorAll('[data-open-cart]')];
let activeProduct = 'barrier-serum';
let activeSize = 'full';
let cartReturnFocus = null;

const drawerBackground = [...document.querySelectorAll('body > *')].filter((element) => (
  element !== drawer && element !== backdrop && element.tagName !== 'SCRIPT'
));
drawer.setAttribute('inert', '');

function updateCart() {
  const count = cart.length;
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  document.querySelectorAll('[data-cart-count]').forEach((element) => { element.textContent = count; });
  document.querySelector('[data-subtotal]').textContent = money(total);
  const status = document.querySelector('[data-checkout-status]');
  if (status) status.textContent = '';

  const wrap = document.querySelector('.cart-items');
  wrap.innerHTML = count
    ? cart.map((item, index) => `<article class="cart-item"><div class="cart-item-visual">${item.number}</div><div><h3>${item.name}</h3><p>${item.size || 'Full size'} · ${money(item.price)}</p><button type="button" data-remove="${index}" aria-label="Remove ${item.name} from cart">Remove</button></div><strong>${money(item.price)}</strong></article>`).join('')
    : '<div class="cart-empty"><b>0</b><p>No objects selected.</p><a href="#collection" data-close-cart>Enter the collection →</a></div>';

  wrap.querySelectorAll('[data-remove]').forEach((button) => button.addEventListener('click', () => {
    cart.splice(Number(button.dataset.remove), 1);
    updateCart();
  }));
  wrap.querySelectorAll('[data-close-cart]').forEach((button) => button.addEventListener('click', () => closeCart()));
}

function openCart() {
  cartReturnFocus = document.activeElement;
  drawer.removeAttribute('inert');
  drawer.setAttribute('aria-hidden', 'false');
  cartTriggers.forEach((trigger) => trigger.setAttribute('aria-expanded', 'true'));
  drawerBackground.forEach((element) => { element.setAttribute('inert', ''); });
  body.classList.add('drawer-open');
  window.setTimeout(() => drawer.querySelector('[data-close-cart]')?.focus(), 50);
}

function closeCart({ restoreFocus = true } = {}) {
  if (!body.classList.contains('drawer-open')) return;
  body.classList.remove('drawer-open');
  drawer.setAttribute('aria-hidden', 'true');
  drawer.setAttribute('inert', '');
  cartTriggers.forEach((trigger) => trigger.setAttribute('aria-expanded', 'false'));
  drawerBackground.forEach((element) => { element.removeAttribute('inert'); });
  if (restoreFocus && cartReturnFocus instanceof HTMLElement) cartReturnFocus.focus();
  cartReturnFocus = null;
}

function trapCartFocus(event) {
  if (event.key !== 'Tab' || !body.classList.contains('drawer-open')) return;
  const focusable = [...drawer.querySelectorAll('button:not([disabled]),a[href],input:not([disabled])')];
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable.at(-1);
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

cartTriggers.forEach((button) => button.addEventListener('click', openCart));
document.querySelectorAll('[data-close-cart]').forEach((button) => button.addEventListener('click', () => closeCart()));

function addItem(id, size = 'Full size', override) {
  const product = products[id];
  cart.push({ ...product, size, price: override ?? product.price });
  updateCart();
  openCart();
}

document.querySelectorAll('.product').forEach((card) => {
  const id = card.dataset.product;
  card.querySelector('.quick-add').addEventListener('click', () => addItem(id));
  card.querySelector('.product-image').addEventListener('click', () => openProduct(id));
});

function openProduct(id) {
  activeProduct = id;
  activeSize = 'full';
  const product = products[id];
  dialog.querySelector('[data-dialog-number]').textContent = product.number;
  dialog.querySelector('[data-dialog-family]').textContent = product.family;
  dialog.querySelector('[data-dialog-title]').textContent = product.name;
  dialog.querySelector('[data-dialog-desc]').textContent = product.description;
  dialog.querySelector('[data-dialog-price]').textContent = money(product.price);
  dialog.querySelector('[data-dialog-ingredients]').innerHTML = product.ingredients.map((item) => `<li>${item}</li>`).join('');
  dialog.querySelectorAll('[data-size]').forEach((button) => {
    const active = button.dataset.size === 'full';
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  dialog.showModal();
}

dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
dialog.querySelectorAll('[data-size]').forEach((button) => button.addEventListener('click', () => {
  activeSize = button.dataset.size;
  dialog.querySelectorAll('[data-size]').forEach((item) => {
    const active = item === button;
    item.classList.toggle('is-active', active);
    item.setAttribute('aria-pressed', String(active));
  });
}));
dialog.querySelector('.dialog-add').addEventListener('click', () => {
  const sample = activeSize === 'sample';
  dialog.close();
  addItem(activeProduct, sample ? '5 ml sample' : 'Full size', sample ? 14 : null);
});

document.querySelectorAll('[data-filter]').forEach((button) => button.addEventListener('click', () => {
  document.querySelectorAll('[data-filter]').forEach((item) => {
    const active = item === button;
    item.classList.toggle('is-active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  document.querySelectorAll('.product').forEach((card) => card.classList.toggle('is-hidden', button.dataset.filter !== 'all' && card.dataset.family !== button.dataset.filter));
}));

document.querySelectorAll('.ingredient').forEach((button) => button.addEventListener('click', () => {
  const opening = !button.classList.contains('is-open');
  document.querySelectorAll('.ingredient').forEach((item) => {
    item.classList.remove('is-open');
    item.setAttribute('aria-expanded', 'false');
  });
  if (opening) {
    button.classList.add('is-open');
    button.setAttribute('aria-expanded', 'true');
  }
}));

const routines = {
  tight: { code: '01 / 03', title: 'Repair + seal', copy: 'Barrier Serum 01 brings water-binding support; Lipid Veil 03 slows its escape.', items: ['barrier-serum', 'lipid-veil'] },
  reactive: { code: '02 / 01', title: 'Clean less + calm', copy: 'Mineral Cleanse 02 keeps the wash quiet; Barrier Serum 01 supports recovery.', items: ['mineral-cleanse', 'barrier-serum'] },
  congested: { code: '02 / 04', title: 'Reset + refine', copy: 'A non-stripping cleanse followed by Night Shift 04 on alternate evenings.', items: ['mineral-cleanse', 'night-shift'] },
  steady: { code: '01 / 03', title: 'Maintain the signal', copy: 'Hydrate with Barrier Serum 01, then seal only where the skin asks for it.', items: ['barrier-serum', 'lipid-veil'] }
};
let chosenRoutine = null;
document.querySelectorAll('[data-state]').forEach((button) => button.addEventListener('click', () => {
  chosenRoutine = routines[button.dataset.state];
  document.querySelectorAll('[data-state]').forEach((item) => {
    const active = item === button;
    item.classList.toggle('is-active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  document.querySelector('[data-routine-code]').textContent = chosenRoutine.code;
  document.querySelector('[data-routine-title]').textContent = chosenRoutine.title;
  document.querySelector('[data-routine-copy]').textContent = chosenRoutine.copy;
  const total = chosenRoutine.items.reduce((sum, id) => sum + products[id].price, 0);
  document.querySelector('[data-routine-price]').textContent = money(total);
  document.querySelector('[data-add-routine]').disabled = false;
}));
document.querySelector('[data-add-routine]').addEventListener('click', () => {
  chosenRoutine?.items.forEach((id) => cart.push({ ...products[id], size: 'Full size' }));
  updateCart();
  openCart();
});

const menu = document.querySelector('.menu-trigger');
const nav = document.querySelector('.site-nav');
function closeMenu({ restoreFocus = false } = {}) {
  const wasOpen = menu.getAttribute('aria-expanded') === 'true';
  menu.setAttribute('aria-expanded', 'false');
  menu.querySelector('span').textContent = 'Menu';
  nav.classList.remove('is-open');
  body.classList.remove('nav-open');
  if (restoreFocus && wasOpen) menu.focus();
}
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  menu.querySelector('span').textContent = open ? 'Close' : 'Menu';
  nav.classList.toggle('is-open', open);
  body.classList.toggle('nav-open', open);
});
nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => closeMenu()));

const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
  if (entry.isIntersecting) {
    entry.target.classList.add('is-visible');
    observer.unobserve(entry.target);
  }
}), { threshold: .12 });
document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  addEventListener('scroll', () => document.querySelectorAll('[data-parallax]').forEach((element) => {
    const rect = element.getBoundingClientRect();
    if (rect.bottom > 0 && rect.top < innerHeight) element.querySelector('img').style.transform = `scale(1.04) translateY(${(rect.top - innerHeight / 2) * Number(element.dataset.parallax)}px)`;
  }), { passive: true });
  const cursor = document.querySelector('.cursor-mark');
  addEventListener('pointermove', (event) => {
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
  });
}

document.querySelector('.newsletter form').addEventListener('submit', (event) => {
  event.preventDefault();
  event.currentTarget.querySelector('p').textContent = 'Concept demo only — no mailing list is connected and no data was sent.';
});
document.querySelector('[data-checkout]').addEventListener('click', () => {
  document.querySelector('[data-checkout-status]').textContent = cart.length
    ? 'Checkout is a portfolio demonstration; no payment or order has been submitted.'
    : 'Add an object before previewing checkout.';
});
document.addEventListener('keydown', (event) => {
  trapCartFocus(event);
  if (event.key !== 'Escape') return;
  if (body.classList.contains('drawer-open')) closeCart();
  else if (dialog.open) dialog.close();
  else closeMenu({ restoreFocus: true });
});

document.querySelector('[data-year]').textContent = new Date().getFullYear();
updateCart();
