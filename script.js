(function(){
  emailjs.init('miOp6iToFLfbH1jk5');
})();

const form = document.getElementById('contactForm');
const responseBox = document.getElementById('formResponse');

form.addEventListener('submit', function(event) {
  event.preventDefault();

  clearErrors();
  responseBox.textContent = '';
  responseBox.style.color = '#004aad';

  if(!validateForm()) {
    return;
  }

  const sendBtn = document.getElementById('sendBtn');
  sendBtn.disabled = true;
  sendBtn.textContent = 'שולח...';

  const formData = {
    name: form.name.value.trim(),
    phone: form.phone.value.trim(),
    email: form.email.value.trim(),
    area: form.area.value.trim(),
    message: form.message.value.trim()
  };

  emailjs.send('service_45f1wyc', 'template_e02sg8p', formData)
    .then(() => {
      responseBox.textContent = 'פנייתך התקבלה אצלינו. נשמח לחזור אליך מייד כשנתפנה.';
      form.reset();
      sendBtn.disabled = false;
      sendBtn.textContent = 'שלח';
    }, (error) => {
      responseBox.style.color = '#d93025';
      responseBox.textContent = 'אירעה שגיאה בשליחת ההודעה, אנא נסה שוב מאוחר יותר.';
      sendBtn.disabled = false;
      sendBtn.textContent = 'שלח';
      console.error('EmailJS error:', error);
    });
});

function clearErrors() {
  const errors = form.querySelectorAll('.error-message');
  errors.forEach(err => err.textContent = '');
}

function validateForm() {
  let valid = true;

  // שם - מינימום 4 תווים
  const name = form.name.value.trim();
  if (name.length < 4) {
    setError('name', 'נא להכניס לפחות 4 תווים בשם');
    valid = false;
  }

  // טלפון - מינימום 9 ספרות, יכול להתחיל ב+
  const phone = form.phone.value.trim();
  const phoneRegex = /^\+?\d{9,15}$/;
  if (!phoneRegex.test(phone)) {
    setError('phone', 'אנא הכנס מספר טלפון חוקי (לפחות 9 ספרות)');
    valid = false;
  }

  // אימייל - בדיקה בסיסית
  const email = form.email.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    setError('email', 'אנא הכנס כתובת מייל תקינה');
    valid = false;
  }

  // איזור - מינימום 2 תווים
