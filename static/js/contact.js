// ===== CONTACT FORM =====
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    const data = {
      firstName: form.firstName.value.trim(),
      lastName: form.lastName.value.trim(),
      email: form.email.value.trim(),
      subject: form.subject.value,
      message: form.message.value.trim(),
    };

    try {
      const res = await fetch('/contact/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getCookie('csrftoken') },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.status === 'ok') {
        document.getElementById('formSuccess').style.display = 'block';
        form.reset();
        showToast('Message sent successfully!');
      }
    } catch {
      showToast('Something went wrong. Please try again.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    }
  });
}

function validateForm() {
  let valid = true;

  const fields = [
    { id: 'firstName', errId: 'firstNameErr', msg: 'First name is required.' },
    { id: 'lastName',  errId: 'lastNameErr',  msg: 'Last name is required.' },
    { id: 'message',   errId: 'messageErr',   msg: 'Message cannot be empty.' },
  ];

  fields.forEach(({ id, errId, msg }) => {
    const el = document.getElementById(id);
    const err = document.getElementById(errId);
    if (!el.value.trim()) {
      el.classList.add('error');
      err.textContent = msg;
      valid = false;
    } else {
      el.classList.remove('error');
      err.textContent = '';
    }
  });

  // Email validation
  const emailEl = document.getElementById('email');
  const emailErr = document.getElementById('emailErr');
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value);
  if (!emailOk) {
    emailEl.classList.add('error');
    emailErr.textContent = 'Please enter a valid email address.';
    valid = false;
  } else {
    emailEl.classList.remove('error');
    emailErr.textContent = '';
  }

  return valid;
}

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : '';
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}