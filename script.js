


const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');


hamburger.addEventListener('click', () => {
 
  const isOpen = mobileMenu.classList.toggle('open');


  hamburger.classList.toggle('open', isOpen);


  hamburger.setAttribute('aria-expanded', isOpen);
});



mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});



const observer = new IntersectionObserver((entries) => {
 
  entries.forEach(entry => {
    if (entry.isIntersecting) {
     
      entry.target.classList.add('visible');

     
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12 
});


document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));



const archNodes = document.querySelectorAll('#archFlow .arch-node, #archFlow .arch-arrow');


const archObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      archNodes.forEach((node, idx) => {
       
        node.style.animationDelay = (idx * 0.12) + 's';
      });
     
      archObserver.disconnect();
    }
  });
}, { threshold: 0.2 }); 

const archFlowEl = document.getElementById('archFlow');
if (archFlowEl) archObserver.observe(archFlowEl);


let archActiveIdx = 0;
const archOnlyNodes = document.querySelectorAll('#archFlow .arch-node'); 

setInterval(() => {
 
  archOnlyNodes.forEach(n => n.classList.remove('active'));

 
  archOnlyNodes[archActiveIdx].classList.add('active');

 
  archActiveIdx = (archActiveIdx + 1) % archOnlyNodes.length;
}, 1800); 




document.querySelectorAll('.case-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
  
    const target = document.getElementById(btn.dataset.target);

  
    const isOpen = btn.classList.toggle('open');

   
    target.style.maxHeight = isOpen ? target.scrollHeight + 'px' : '0';
  });
});


document.querySelectorAll('.case-open-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();

 
    const card = link.closest('.project-card');
    const toggle = card.querySelector('.case-toggle');

    
    toggle.click();

   
    toggle.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
});



const form = document.getElementById('contactForm');
const status = document.getElementById('cf-status');
const submitBtn = document.getElementById('cf-submit');


function validateField(groupId, isValid) {
  const group = document.getElementById(groupId);
  group.classList.toggle('invalid', !isValid); 
  return isValid;
}


form.addEventListener('submit', (e) => {
  e.preventDefault(); 
  const name = document.getElementById('cf-name').value.trim();
  const email = document.getElementById('cf-email').value.trim();
  const subject = document.getElementById('cf-subject').value.trim();
  const message = document.getElementById('cf-message').value.trim();

  
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

 
  const nameOk = validateField('grp-name', name.length > 0);
  const emailOk = validateField('grp-email', emailValid);
  const subjectOk = validateField('grp-subject', subject.length > 0);
  const messageOk = validateField('grp-message', message.length > 0);

 
  status.className = 'form-status';

  
  if (!(nameOk && emailOk && subjectOk && messageOk)) {
    status.textContent = 'Please fix the highlighted fields.';
    status.classList.add('show', 'error');
    return; // exit the function early
  }

 
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';
  status.classList.remove('show', 'error', 'success');

 

  setTimeout(() => {
   
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send Message';

    
    status.textContent = "Message sent — I'll get back to you soon.";
    status.classList.add('show', 'success');

  
    form.reset();
  }, 1200);
});
