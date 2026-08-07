const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');

function closeMenu({ restoreFocus = false } = {}) {
  const wasOpen = header.classList.contains('menu-open');
  header.classList.remove('menu-open');
  document.body.classList.remove('nav-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open menu');
  if (restoreFocus && wasOpen) menuButton.focus();
}

menuButton.addEventListener('click', () => {
  const open = header.classList.toggle('menu-open');
  document.body.classList.toggle('nav-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});

document.querySelectorAll('nav a').forEach((link) => {
  link.addEventListener('click', () => {
    closeMenu();
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu({ restoreFocus: true });
});

const testimonials = [
  { quote: '“For the first time, I didn’t feel like a number—or nervous. Everything was explained with such patience, and the whole experience felt genuinely calm.”', name: 'Amélie V.', since: 'Patient since 2021' },
  { quote: '“The clearest dental advice I’ve ever received. I understood every option, felt no pressure, and left completely confident in the plan we made together.”', name: 'Thomas R.', since: 'Patient since 2023' },
  { quote: '“The studio feels peaceful, the team remembers the little things, and Dr. Moreau is wonderfully gentle. I no longer put off my check-ups.”', name: 'Sofia L.', since: 'Patient since 2020' }
];
let storyIndex = 0;
const testimonial = document.querySelector('.testimonial');

function showStory(index) {
  storyIndex = (index + testimonials.length) % testimonials.length;
  const story = testimonials[storyIndex];
  testimonial.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 350, easing: 'ease-out' });
  testimonial.querySelector('blockquote').textContent = story.quote;
  testimonial.querySelector('strong').textContent = story.name;
  testimonial.querySelector('p span').textContent = story.since;
}

document.querySelector('.prev').addEventListener('click', () => showStory(storyIndex - 1));
document.querySelector('.next').addEventListener('click', () => showStory(storyIndex + 1));

document.querySelector('.booking-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const subject = `Portfolio demo — Maison Dentaire appointment for ${data.get('name')}`;
  const body = [
    'Maison Dentaire concept appointment request',
    `Name: ${data.get('name')}`,
    `Email: ${data.get('email')}`,
    `Phone: ${data.get('phone') || 'Not provided'}`,
    `Service: ${data.get('service')}`,
    '',
    'This request came from the Studio S. portfolio concept.'
  ].join('\n');
  form.querySelector('.form-status').textContent = 'Your email app is opening. Nothing is sent until you review the draft and press send.';
  form.reset();
  window.location.href = `mailto:aouezgharsafouan@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
