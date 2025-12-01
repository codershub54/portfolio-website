// =========================
// Mobile Navigation Toggle
// =========================
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-links');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
  });
}

// =========================
// Smooth Scroll for Anchor Links
// =========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// =========================
// Star Ratings Highlight
// =========================
// Optional: animate ratings when projects scroll into view
const ratings = document.querySelectorAll('.rating');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('highlight');
    }
  });
}, { threshold: 0.5 });

ratings.forEach(rating => observer.observe(rating));

// =========================
// Contact Form Validation
// =========================
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
      e.preventDefault();
      alert('Please fill in all fields before submitting.');
    }
  });
}

// =========================
// AJAX submit to Formspree
// =========================
const formMessage = document.getElementById('form-message');
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);

    // Show loading state
    if (formMessage) {
      formMessage.textContent = 'Sending...';
      formMessage.className = 'form-message';
      formMessage.style.display = 'block';
    }

    // Quick check: if the action still contains the placeholder, show instructive error
    if (form.action.includes('yourFormID') || form.action.includes('formspree.io/f/yourFormID')) {
      if (formMessage) {
        formMessage.textContent = 'Form endpoint not configured. Replace "yourFormID" in the form action with your real Formspree form ID to receive messages.';
        formMessage.className = 'form-message error';
      }
      console.warn('Formspree form action contains placeholder. Update the action attribute with your Formspree form ID.');
      return;
    }

    fetch(form.action, {
      method: form.method || 'POST',
      body: data,
      headers: {
        'Accept': 'application/json'
      }
    }).then(response => {
      if (response.ok) {
        form.reset();
        if (formMessage) {
          formMessage.textContent = 'Thanks — your message has been sent!';
          formMessage.className = 'form-message success';
        }
      } else {
        response.json().then(data => {
          if (formMessage) {
            formMessage.textContent = (data && data.error) ? data.error : 'Oops — there was a problem sending your message.';
            formMessage.className = 'form-message error';
          }
        }).catch(() => {
          if (formMessage) {
            formMessage.textContent = 'Oops — there was a problem sending your message.';
            formMessage.className = 'form-message error';
          }
        });
      }
    }).catch(() => {
      if (formMessage) {
        formMessage.textContent = 'Network error — please try again later.';
        formMessage.className = 'form-message error';
      }
    });
  });
}
