const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
const dialog = document.querySelector('.enquiry-dialog');
const form = document.querySelector('.enquiry-form');
const success = document.querySelector('.form-success');

function closeMenu({ restoreFocus = false } = {}) {
  const wasOpen = toggle?.getAttribute('aria-expanded') === 'true';
  toggle?.setAttribute('aria-expanded', 'false');
  nav?.classList.remove('is-open');
  document.body.classList.remove('nav-open');
  if (toggle) toggle.querySelector('span').textContent = 'Menu';
  if (restoreFocus && wasOpen) toggle?.focus();
}

toggle?.addEventListener('click', () => {
  const opening = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(opening));
  nav?.classList.toggle('is-open', opening);
  document.body.classList.toggle('nav-open', opening);
  toggle.querySelector('span').textContent = opening ? 'Close' : 'Menu';
});
nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => closeMenu()));

function openEnquiry() {
  form.hidden = false;
  success.hidden = true;
  dialog.showModal();
}

function closeEnquiry() {
  dialog.close();
  form.reset();
}

document.querySelectorAll('[data-open-enquiry]').forEach((button) => button.addEventListener('click', openEnquiry));
document.querySelectorAll('[data-close-enquiry]').forEach((button) => button.addEventListener('click', closeEnquiry));
dialog?.addEventListener('click', (event) => { if (event.target === dialog) closeEnquiry(); });

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const subject = `Portfolio demo — Maison Éloise viewing for ${data.get('name')}`;
  const body = [
    'Maison Éloise concept viewing enquiry',
    `Preferred date: ${data.get('date')}`,
    `Name: ${data.get('name')}`,
    `Email: ${data.get('email')}`,
    `Telephone: ${data.get('telephone') || 'Not provided'}`,
    '',
    'Note:',
    data.get('message') || 'No note provided',
    '',
    'This request came from the Studio S. portfolio concept.'
  ].join('\n');
  form.hidden = true;
  success.hidden = false;
  success.querySelector('button').focus();
  window.location.href = `mailto:aouezgharsafouan@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

const dateInput = document.querySelector('input[type=date]');
if (dateInput) {
  const today = new Date();
  const max = new Date(today);
  max.setDate(today.getDate() + 60);
  const format = (date) => [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
  dateInput.min = format(today);
  dateInput.max = format(max);
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: .1 });
document.querySelectorAll('.reveal').forEach((element, index) => {
  if (element.closest('.hero')) element.style.transitionDelay = `${Math.min(index * 80, 280)}ms`;
  observer.observe(element);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !dialog.open) closeMenu({ restoreFocus: true });
});
document.querySelector('[data-year]').textContent = new Date().getFullYear();
