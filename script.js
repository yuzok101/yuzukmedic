import { init, send } from "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.es.min.js";

init('miOp6iToFLfbH1jk5');  // Public Key שלך

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  const responseDiv = document.getElementById('formResponse');
  const sendBtn = document.getElementById('sendBtn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    clearErrors();
    responseDiv.textContent = '';
    responseDiv.className = 'form-response';

    if (!validateForm()) {
      return;
    }

    sendBtn.disabled = true;
    sendBtn.textContent = 'שולח...';

    try {
      await send('service_45f1wyc', 'template_e02sg8p', {
        name: form.name.value.trim(),
        phone: form.phone.value.trim(),
        email: form.email.value.trim(),
        area: form.area.value.trim(),
        message: form.message.value.trim()
      });
      responseDiv.textContent = 'פנייתך התקבלה אצלינו, נשמח לחזור אליך מייד כשנתפנה.';
      responseDiv.classList.add('success');
      form.reset();
    } catch (error) {
      console.error('EmailJS error:', error);
      responseDiv.textContent = 'אירעה שגיאה בשליחת ההודעה. אנא נסה שוב מאוחר יותר.';
      responseDiv.classList.add('error');
    } finally {
      sendBtn.disabled = false;
      sendBtn.textContent = 'שלח';
    }
  });

  function clearErrors() {
    form.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    responseDiv.textContent = '';
    responseDiv.className = 'form-response';
  }

  function validateForm() {
    let valid = true;

    // שם מלא - לפחות 4 תווים
    if (form.name.value.trim().length < 4) {
      setError('name', 'אנא הזן שם מלא תקין (לפחות 4 תווים)');
      valid = false;
    }

    // טלפון - לפחות ספרה אחת (אפשר להוסיף Regex לפי הצורך)
    if (!form.phone.value.trim()) {
      setError('phone', 'אנא הזן טלפון תקין');
      valid = false;
    }

    // אימייל - בדיקה בסיסית
    if (!validateEmail(form.email.value.trim())) {
      setError('email', 'אנא הזן כתובת אימייל תקינה');
      valid = false;
    }

    // איזור - לפחות 2 תווים
    if (form.area.value.trim().length < 2) {
      setError('area', 'אנא הזן איזור בארץ');
      valid = false;
    }

    // הודעה - לפחות 5 תווים
    if (form.message.value.trim().length < 5) {
      setError('message', 'אנא הזן הודעה עם לפחות 5 תווים');
      valid = false;
    }

    return valid;
  }

  function setError(fieldId, message) {
    const errorSpan = form.querySelector(`#${fieldId} ~ .error-message`);
    if (errorSpan) {
      errorSpan.textContent = message;
    }
  }

  function validateEmail(email) {
    // בדיקת אימייל פשוטה
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
});
