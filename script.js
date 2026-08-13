const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');

function closeMenu() {
  toggle?.setAttribute('aria-expanded', 'false');
  nav?.classList.remove('is-open');
  document.body.classList.remove('nav-open');
  toggle?.querySelector('span')?.replaceChildren('Menu');
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

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealElements = document.querySelectorAll('.reveal');

if (reducedMotion || !('IntersectionObserver' in window)) {
  revealElements.forEach((element) => element.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .1 });

  revealElements.forEach((element, index) => {
    if (element.closest('.hero')) element.style.transitionDelay = `${Math.min(index * 90, 300)}ms`;
    observer.observe(element);
  });
}

document.querySelectorAll('[data-year]').forEach((element) => {
  element.textContent = new Date().getFullYear();
});

const enquiryForm = document.querySelector('#enquiry-form');
const enquiryStatus = document.querySelector('#enquiry-status');
const enquiryButton = enquiryForm?.querySelector('button[type="submit"]');
const enquiryFields = enquiryForm?.querySelector('[data-enquiry-fields]');
const enquirySubmit = enquiryForm?.querySelector('[data-enquiry-submit]');
const enquiryPrivacy = enquiryForm?.querySelector('[data-enquiry-privacy]');
const enquirySuccess = enquiryForm?.querySelector('#enquiry-success');
const enquiryReference = enquiryForm?.querySelector('[data-enquiry-reference]');

enquiryForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!enquiryForm.reportValidity()) return;

  const turnstileToken = enquiryForm.querySelector('input[name="cf-turnstile-response"]')?.value;
  if (!turnstileToken) {
    enquiryStatus?.classList.add('is-error');
    if (enquiryStatus) enquiryStatus.textContent = 'Please complete the spam check before sending.';
    return;
  }

  enquiryButton?.setAttribute('disabled', '');
  enquiryForm.setAttribute('aria-busy', 'true');
  enquiryStatus?.classList.remove('is-error');
  if (enquiryButton) enquiryButton.firstChild.textContent = 'Sending… ';
  if (enquiryStatus) enquiryStatus.textContent = 'Sending your enquiry securely.';

  try {
    const response = await fetch(enquiryForm.action, {
      method: 'POST',
      body: new FormData(enquiryForm),
      headers: { Accept: 'application/json' }
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.message || 'Your enquiry could not be sent. Please try again.');
    }

    enquiryFields?.setAttribute('hidden', '');
    enquirySubmit?.setAttribute('hidden', '');
    enquiryPrivacy?.setAttribute('hidden', '');
    enquirySuccess?.removeAttribute('hidden');
    if (enquiryReference && result.reference) enquiryReference.textContent = `Reference · ${result.reference}`;
    enquirySuccess?.focus({ preventScroll: true });
    enquiryForm.reset();
    if (window.turnstile) window.turnstile.reset();
  } catch (error) {
    enquiryStatus?.classList.add('is-error');
    if (enquiryStatus) enquiryStatus.textContent = error instanceof Error ? error.message : 'Your enquiry could not be sent. Please try again.';
    if (window.turnstile) window.turnstile.reset();
  } finally {
    enquiryButton?.removeAttribute('disabled');
    enquiryForm.removeAttribute('aria-busy');
    if (enquiryButton) enquiryButton.firstChild.textContent = 'Start a conversation ';
  }
});
