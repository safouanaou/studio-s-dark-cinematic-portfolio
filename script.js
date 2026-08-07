const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');

function closeMenu() {
  toggle?.setAttribute('aria-expanded', 'false');
  nav?.classList.remove('is-open');
  document.body.classList.remove('nav-open');
  toggle?.querySelector('span').replaceChildren('Menu');
}

toggle?.addEventListener('click', () => {
  const opening = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(opening));
  nav?.classList.toggle('is-open', opening);
  document.body.classList.toggle('nav-open', opening);
  toggle.querySelector('span').textContent = opening ? 'Close' : 'Menu';
});

nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: .1 });

document.querySelectorAll('.reveal').forEach((element, index) => {
  if (element.closest('.hero')) element.style.transitionDelay = `${Math.min(index * 90, 300)}ms`;
  observer.observe(element);
});

document.querySelector('[data-year]').textContent = new Date().getFullYear();

const enquiryForm = document.querySelector('#enquiry-form');
const enquiryStatus = document.querySelector('#enquiry-status');

enquiryForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  const data = new FormData(enquiryForm);
  const name = data.get('name')?.toString().trim() || '';
  const business = data.get('business')?.toString().trim() || '';
  const subject = `Project enquiry — ${business || name}`;
  const body = [
    `Name: ${name}`,
    `Email: ${data.get('email')}`,
    `Business or project: ${business || 'Not provided'}`,
    `Service: ${data.get('service')}`,
    `Approximate budget: ${data.get('budget')}`,
    `Desired launch: ${data.get('launch')}`,
    '',
    'Project details:',
    data.get('message')
  ].join('\n');

  if (enquiryStatus) {
    enquiryStatus.textContent = 'Your email app is opening. Review the enquiry, then press send.';
  }

  window.location.href = `mailto:aouezgharsafouan@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
