// אתחול EmailJS
emailjs.init("miOp6iToFLfbH1jk5");

const form = document.getElementById('contactForm');
const sendBtn = document.getElementById('sendBtn');
const formResponse = document.getElementById('formResponse');

form.addEventListener('submit', function(e) {
  e.preventDefault();

  clearErrors();
  formResponse.textContent = '';
  formResponse.classList.remove('error', 'success');

  if (!validateForm()) {
    formResponse.textContent = 'אנא מלא/י את כל השדות כראוי.';
    formResponse.classList.add('error');
    return;
  }

  sendBtn.disabled = true;
  sendBtn.textContent = 'שולח...';

  const templateParams = {
    name: form.name.value.trim(),
    phone: form.phone.value.trim(),
    email: form.email.value.trim(),
    area: form.area.value.trim(),
    message: form.message.value.trim(),
  };

  emailjs.send('service_45f1wyc', 'template_default', templateParams)
    .then(() => {
      formResponse.textContent = 'הפנייה התקבלה אצלינו. נשמח לחזור אליך מייד כשנתפנה.';
      formResponse.classList.remove('error');
      formResponse.classList.add('success');
      form.reset();
    }, (error)
