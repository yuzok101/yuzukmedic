// החלף את הפרטים הבאים לפי החשבון שלך ב-EmailJS
const serviceID = 'service_45f1wyc';
const templateID = 'Contact Us'; // השם החדש של התבנית
const publicKey = 'miOp6iToFLfbH1jk5';

window.onload = function() {
  const form = document.getElementById('contact-form');
  const statusMsg = document.getElementById('status-msg');

  form.addEventListener('submit', function(event) {
    event.preventDefault();

    // בדיקות ולידציה פשוטות
    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const email = form.email.value.trim();
    const area = form.area.value.trim();
    const message = form.message.value.trim();

    if (name.length < 3) {
      statusMsg.textContent = 'אנא הכנס שם עם לפחות 3 תווים';
      statusMsg.style.color = 'red';
      return;
    }

    const phoneRegex = /^[0-9]{9,}$/;
    if (!phoneRegex.test(phone)) {
      statusMsg.textContent = 'אנא הכנס מספר טלפון חוקי עם לפחות 9 ספרות';
      statusMsg.style.color = 'red';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!emailRegex.test(email)) {
      statusMsg.textContent = 'אנא הכנס כתובת מייל תקינה';
      statusMsg.style.color = 'red';
      return;
    }

    // שולח את הטופס דרך EmailJS
    emailjs.send(serviceID, templateID, {
      name: name,
      phone: phone,
      email: email,
      area: area,
      message: message
    }, publicKey)
      .then(() => {
        statusMsg.textContent = 'פנייתך התקבלה אצלינו, נשמח לחזור אליך מייד כשנתפנה.';
        statusMsg.style.color = 'green';
        form.reset();
      })
      .catch(() => {
        statusMsg.textContent = 'אירעה שגיאה בשליחת ההודעה. אנא נסה שוב מאוחר יותר.';
        statusMsg.style.color = 'red';
      });
  });
};
