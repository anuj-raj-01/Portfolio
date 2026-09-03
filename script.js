/* =====================================================
   PORTFOLIO JAVASCRIPT
   Handles: mobile menu toggle, scroll-reveal animations,
   the architecture diagram animation, expandable case
   studies, and contact form validation/submission.
   ===================================================== */

/* ---------- 1. MOBILE MENU TOGGLE ----------
   Controls opening/closing the full-screen mobile nav
   when the hamburger icon is tapped. */

// Grab references to the hamburger button and the mobile menu overlay
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

// When the hamburger icon is clicked...
hamburger.addEventListener('click', () => {
  // toggle() adds the class if it's missing, removes it if present,
  // and returns true/false depending on whether it's now present.
  const isOpen = mobileMenu.classList.toggle('open');

  // Keep the hamburger icon's own "open" class in sync (this is what
  // turns the 3 bars into an "X" shape, via CSS).
  hamburger.classList.toggle('open', isOpen);

  // Update the ARIA attribute so screen readers announce whether
  // the menu is currently expanded or collapsed.
  hamburger.setAttribute('aria-expanded', isOpen);
});

// When any link inside the mobile menu is clicked, automatically
// close the menu (so it doesn't stay open after navigating).
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});


/* ---------- 2. SCROLL-REVEAL ANIMATION ----------
   Elements with the "fade-in" class are invisible by default
   (see CSS). As the user scrolls and each one enters the
   viewport, we add the "visible" class, which triggers the
   fade + slide-up transition defined in styles.css. */

// IntersectionObserver watches elements and tells us when they
// enter or leave the visible part of the screen.
const observer = new IntersectionObserver((entries) => {
  // "entries" is a list of elements whose visibility just changed.
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // The element has scrolled into view - reveal it.
      entry.target.classList.add('visible');

      // Stop watching this element - we only need to reveal it once.
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12 // trigger once 12% of the element is visible on screen
});

// Find every element marked with class "fade-in" and start observing it.
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));


/* ---------- 3. ARCHITECTURE DIAGRAM ANIMATION ----------
   The "How I Build" section shows a vertical flow:
   User -> Frontend -> API -> Backend -> Database -> Deployment.
   This section makes the boxes fade in one-by-one, then
   continuously highlights one box at a time like a pulse. */

// Select every node AND arrow inside the diagram (in DOM order).
const archNodes = document.querySelectorAll('#archFlow .arch-node, #archFlow .arch-arrow');

// A second observer just for the architecture diagram: when the
// diagram scrolls into view, stagger each node's fade-in animation
// so they appear one after another instead of all at once.
const archObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      archNodes.forEach((node, idx) => {
        // Each node/arrow gets a slightly longer delay than the one
        // before it (0.12s apart), creating a cascading reveal effect.
        node.style.animationDelay = (idx * 0.12) + 's';
      });
      // Only need to trigger this once, so stop observing afterward.
      archObserver.disconnect();
    }
  });
}, { threshold: 0.2 }); // trigger once 20% of the diagram is visible

const archFlowEl = document.getElementById('archFlow');
if (archFlowEl) archObserver.observe(archFlowEl);

// Continuously cycle a highlighted "active" state through each box,
// like a signal moving down the pipeline (User -> ... -> Deployment).
let archActiveIdx = 0; // tracks which node is currently highlighted
const archOnlyNodes = document.querySelectorAll('#archFlow .arch-node'); // boxes only, not arrows

setInterval(() => {
  // Remove the "active" highlight from every box first...
  archOnlyNodes.forEach(n => n.classList.remove('active'));

  // ...then add it to just the current box in the sequence.
  archOnlyNodes[archActiveIdx].classList.add('active');

  // Move to the next box, wrapping back to 0 after the last one.
  archActiveIdx = (archActiveIdx + 1) % archOnlyNodes.length;
}, 1800); // change the highlighted box every 1.8 seconds


/* ---------- 4. EXPANDABLE PROJECT CASE STUDIES ----------
   Each project card has a "Full Case Study" bar at the bottom.
   Clicking it expands/collapses the detailed 18-stage write-up. */

document.querySelectorAll('.case-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    // Each toggle button has a data-target attribute pointing to
    // the id of the case-study content it should open/close.
    const target = document.getElementById(btn.dataset.target);

    // Flip the "open" class on the button (also rotates the arrow via CSS)
    // and remember whether it's now open or closed.
    const isOpen = btn.classList.toggle('open');

    // We can't smoothly animate from "height: auto", so instead we set
    // an explicit pixel height: scrollHeight = the full content height.
    // Closing it sets max-height back to 0.
    target.style.maxHeight = isOpen ? target.scrollHeight + 'px' : '0';
  });
});

// The small "Case Study" link/button inside each project's action row
// does the same thing as clicking the toggle bar, but also scrolls
// the page down to bring the case study into view.
document.querySelectorAll('.case-open-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault(); // stop the link from jumping using its href="#"

    // Find this link's parent project card, then find that card's toggle button.
    const card = link.closest('.project-card');
    const toggle = card.querySelector('.case-toggle');

    // Simulate a real click on the toggle bar, reusing the logic above.
    toggle.click();

    // Smoothly scroll the case study into the middle of the screen.
    toggle.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
});


/* ---------- 5. CONTACT FORM VALIDATION & SUBMISSION ---------- */

// Grab references to the form, the status message area, and the submit button.
const form = document.getElementById('contactForm');
const status = document.getElementById('cf-status');
const submitBtn = document.getElementById('cf-submit');

// Small reusable helper: checks a condition for one field, and
// shows/hides its red "invalid" styling + error text accordingly.
// Returns true if the field is valid, false if not.
function validateField(groupId, isValid) {
  const group = document.getElementById(groupId);
  group.classList.toggle('invalid', !isValid); // add "invalid" only when NOT valid
  return isValid;
}

// Runs every time the user tries to submit the form.
form.addEventListener('submit', (e) => {
  e.preventDefault(); // stop the browser's default full-page-reload submit

  // Read and trim (remove extra whitespace from) each field's current value.
  const name = document.getElementById('cf-name').value.trim();
  const email = document.getElementById('cf-email').value.trim();
  const subject = document.getElementById('cf-subject').value.trim();
  const message = document.getElementById('cf-message').value.trim();

  // Simple regex pattern to check the email looks like "something@something.something".
  // This isn't a perfect email validator, but it catches obvious mistakes.
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Validate every field. Each call also visually marks the field
  // red if it fails, via the validateField() helper above.
  const nameOk = validateField('grp-name', name.length > 0);
  const emailOk = validateField('grp-email', emailValid);
  const subjectOk = validateField('grp-subject', subject.length > 0);
  const messageOk = validateField('grp-message', message.length > 0);

  // Reset the status message's styling before deciding what to show.
  status.className = 'form-status';

  // If ANY field failed validation, show an error message and stop here
  // (don't proceed to the "sending" simulation below).
  if (!(nameOk && emailOk && subjectOk && messageOk)) {
    status.textContent = 'Please fix the highlighted fields.';
    status.classList.add('show', 'error');
    return; // exit the function early
  }

  // All fields passed validation - simulate sending the message.
  // Disable the button and change its text so the user gets feedback
  // that something is happening (prevents double-submitting too).
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';
  status.classList.remove('show', 'error', 'success');

  // NOTE: This is a placeholder for a real backend/email service.
  // Replace this setTimeout block with an actual fetch() call to
  // your backend, or to a form service like Formspree / EmailJS,
  // once you have one set up. Example:
  //
  // fetch('https://your-api.com/contact', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ name, email, subject, message })
  // })
  //   .then(res => { ... show success ... })
  //   .catch(err => { ... show error ... });

  setTimeout(() => {
    // Re-enable the button and restore its original text.
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send Message';

    // Show a success message to the user.
    status.textContent = "Message sent — I'll get back to you soon.";
    status.classList.add('show', 'success');

    // Clear all the form fields, ready for a new message.
    form.reset();
  }, 1200); // fake 1.2 second "network delay" so the loading state is visible
});
