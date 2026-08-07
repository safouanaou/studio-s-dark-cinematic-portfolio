const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');
const dialog = document.querySelector('.reservation-dialog');
const form = document.querySelector('.reservation-form');
const success = document.querySelector('.reservation-success');

function closeNav() {
  toggle?.setAttribute('aria-expanded', 'false');
  nav?.classList.remove('is-open');
  document.body.classList.remove('nav-open');
  document.querySelector('.nav-toggle-label').textContent = 'Menu';
}

toggle?.addEventListener('click', () => {
  const opening = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(opening));
  nav?.classList.toggle('is-open', opening);
  document.body.classList.toggle('nav-open', opening);
  document.querySelector('.nav-toggle-label').textContent = opening ? 'Close' : 'Menu';
});

nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeNav));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') closeNav();
});

function openReservation() {
  form.hidden = false;
  success.hidden = true;
  dialog.showModal();
}

function closeReservation() {
  dialog.close();
  form.reset();
}

document.querySelectorAll('[data-open-reservation]').forEach((button) => button.addEventListener('click', openReservation));
document.querySelectorAll('[data-close-reservation]').forEach((button) => button.addEventListener('click', closeReservation));
dialog?.addEventListener('click', (event) => {
  if (event.target === dialog) closeReservation();
});

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const subject = `Portfolio demo — KINU reservation for ${data.get('name')}`;
  const body = [
    'KINU concept reservation',
    `Date: ${data.get('date')}`,
    `Time: ${data.get('time')}`,
    `Guests: ${data.get('guests')}`,
    `Name: ${data.get('name')}`,
    `Email: ${data.get('email')}`,
    '',
    'This request came from the Studio S. portfolio concept.'
  ].join('\n');
  form.hidden = true;
  success.hidden = false;
  success.querySelector('button').focus();
  window.location.href = `mailto:aouezgharsafouan@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

const dateInput = document.querySelector('input[type="date"]');
if (dateInput) {
  const today = new Date();
  const max = new Date(today);
  max.setDate(today.getDate() + 56);
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
}, { threshold: .12 });

document.querySelectorAll('.reveal').forEach((element, index) => {
  if (element.closest('.hero')) element.style.transitionDelay = `${Math.min(index * 100, 300)}ms`;
  observer.observe(element);
});

function updateSeasonMarker() {
  const maximum = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maximum > 0 ? Math.max(.08, window.scrollY / maximum) : .08;
  document.documentElement.style.setProperty('--scroll', String(progress));
}

window.addEventListener('scroll', updateSeasonMarker, { passive: true });
updateSeasonMarker();
document.querySelector('[data-year]').textContent = new Date().getFullYear();
