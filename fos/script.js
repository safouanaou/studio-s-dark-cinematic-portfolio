const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');

function closeMenu() {
  toggle?.setAttribute('aria-expanded', 'false');
  nav?.classList.remove('is-open');
  document.body.classList.remove('nav-open');
}

toggle?.addEventListener('click', () => {
  const isOpen = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!isOpen));
  nav?.classList.toggle('is-open', !isOpen);
  document.body.classList.toggle('nav-open', !isOpen);
});

nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach((element, index) => {
  if (element.closest('.hero')) element.style.transitionDelay = `${Math.min(index * 90, 360)}ms`;
  observer.observe(element);
});

const schedules = [
  { open: 9, close: 16, label: '09:00—16:00' },
  { open: 8, close: 17, label: '08:00—17:00' },
  { open: 8, close: 17, label: '08:00—17:00' },
  { open: 8, close: 17, label: '08:00—17:00' },
  { open: 8, close: 17, label: '08:00—17:00' },
  { open: 8, close: 17, label: '08:00—17:00' },
  { open: 9, close: 18, label: '09:00—18:00' },
];

const now = new Date();
const today = schedules[now.getDay()];
const decimalHour = now.getHours() + now.getMinutes() / 60;
const isOpen = decimalHour >= today.open && decimalHour < today.close;
const todayHours = document.querySelector('[data-today-hours]');
const status = document.querySelector('[data-open-status]');

if (todayHours) todayHours.textContent = today.label;
if (status) {
  status.lastChild.textContent = isOpen ? ` Open now · until ${String(today.close).padStart(2, '0')}:00` : ` Closed now · today ${today.label}`;
  status.classList.toggle('is-closed', !isOpen);
}

document.querySelector('[data-year]').textContent = new Date().getFullYear();
