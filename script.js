emailjs.init('miOp6iToFLfbH1jk5');

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  const responseDiv = document.getElementById('formResponse');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    clearErrors();
    responseDiv.textContent = '';
    responseDiv.className = 'form-response';

    if (!validateForm()) {
      return;
    }

    const sendBtn = document.getElementById('sendBtn');
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

  function validateForm() {
    let valid = true;

    if (!form.name.value.trim() || form.name.value.trim().length < 4) {
      showError('name', 'נא להזין שם מלא עם לפחות 4 תווים');
      valid = false;
    }
    if (!form.phone.value.trim()) {
      showError('phone', 'נא להזין מספר טלפון');
      valid = false;
    }
    if (!form.email.value.trim() || !validateEmail(form.email.value.trim())) {
      showError('email', 'נא להזין כתובת אימייל תקינה');
      valid = false;
    }
    if (!form.area.value.trim() || form.area.value.trim().length < 2) {
      showError('area', 'נא להזין אזור בארץ');
      valid = false;
    }
    if (!form.message.value.trim() || form.message.value.trim().length < 5) {
      showError('message', 'נא להזין הודעה עם לפחות 5 תווים');
      valid = false;
    }

    return valid;
  }

  function showError(fieldId, message) {
    const input = form.querySelector(`#${fieldId}`);
    const errorSpan =
