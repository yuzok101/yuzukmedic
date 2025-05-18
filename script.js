// script.js - מודול עם ייבוא EmailJS מה-CDN

import emailjs from 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.es.min.js';

// אתחול EmailJS עם ה-Public Key שלך
emailjs.init('miOp6iToFLfbH1jk5');

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  const responseDiv = document.getElementById('formResponse');
  const sendBtn = document.getElementById('sendBtn');

  // פונקציה להצגת שגיאה ליד שדה
  function showError(fieldName, message) {
    const input = form[fieldName];
    const errorSpan = input.nextElementSibling;
    if (errorSpan) {
      errorSpan.textContent = message;
      errorSpan.style.display = 'block';
    }
  }

  // איפוס הודעות שגיאה
  function clearErrors() {
    form.querySelectorAll('.error-message').forEach(span => {
      span.textContent = '';
      span.style.display = 'none';
    });
  }

  // אימות הטופס
  function validateForm() {
    clearErrors();
    let valid = true;

    // שם - לפחות 4 תווים
    if (!form.name.value.trim() || form.name.value.trim().length < 4) {
      showError('name', 'נא להכניס שם מלא עם לפחות 4 תווים');
      valid = false;
    }

    // טלפון - תבנית 05xxxxxxxx
    const phonePattern = /^05\d{8}$/;
    if (!phonePattern.test(form.phone.value.trim())) {
      showError('phone', 'נא להכניס טלפון תקין שמתחיל ב-05 ומכיל 10 ספרות');
      valid = false;
    }

    // אימייל - בדיקה בסיסית
    if (!form.email.value.trim() || !/\S+@\S+\.\S+/.test(form.email.value.trim())) {
      showError('email', 'נא להכניס כתובת אימייל תקינה');
      valid = false;
    }

    // אזור - לפחות 2 תווים
    if (!form.area.value.trim() || form.area.value.trim().length < 2) {
      showError('area', 'נא להכניס איזור בארץ');
      valid = false;
    }

    // הודעה - לפחות 5 תווים
    if (!form.message.value.trim() || form.message.value.trim().length < 5) {
      showError('message', 'נא להכניס הודעה עם לפחות 5 תווים');
      valid = false;
    }

    return valid;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    responseDiv.textContent = '';
    responseDiv.className = 'form-response';

    if (!validateForm()) {
      return;
    }

    sendBtn.disabled = true;
    sendBtn.textContent = 'שולח...';

    emailjs.send('service_45f1wyc', 'template_e02sg8p', {
      name: form.name.value.trim(),
      phone: form.phone.value.trim(),
      email: form.email.value.trim(),
      area: form.area.value.trim(),
      message: form.message.value.trim()
    })
    .then(() => {
      responseDiv.textContent = 'פנייתך התקבלה אצלינו, נשמח לחזור אליך מייד כשנתפנה.';
      responseDiv.classList.add('success');
      form.reset();
    })
    .catch((error) => {
      console.error('EmailJS error:', error);
      responseDiv.textContent = 'אירעה שגיאה בשליחת ההודעה. אנא נסה שוב מאוחר יותר.';
      responseDiv.classList.add('error');
    })
    .finally(() => {
      sendBtn.disabled = false;
      sendBtn.textContent = 'שלח';
    });
  });
});
