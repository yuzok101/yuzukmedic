emailjs.init("miOp6iToFLfbH1jk5"); // Public key

document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name");
  const phone = document.getElementById("phone");
  const email = document.getElementById("email");
  const area = document.getElementById("area");
  const message = document.getElementById("message");
  const responseEl = document.getElementById("formResponse");

  // ניקוי הודעה קודמת
  responseEl.textContent = "";
  responseEl.style.color = "";

  // בדיקות
  if (name.value.length < 4) {
    showError(name, "נא להזין שם מלא עם לפחות 4 תווים");
    return;
  }

  if (!/^\d{9,}$/.test(phone.value)) {
    showError(phone, "נא להזין מספר טלפון תקין (לפחות 9 ספרות)");
    return;
  }

  if (!/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(email.value)) {
    showError(email, "נא להזין כתובת אימייל תקינה");
    return;
  }

  if (area.value.length < 2) {
    showError(area, "נא להזין אזור מגורים");
    return;
  }

  // שליחה ל־EmailJS
  emailjs.send("service_45f1wyc", "template_e02sg8p", {
    name: name.value,
    phone: phone.value,
    email: email.value,
    area: area.value,
    message: message.value
  }).then(function () {
    responseEl.textContent = "פנייתך התקבלה אצלנו, נחזור אליך בהקדם.";
    responseEl.style.color = "green";
    document.getElementById("contactForm").reset();
  }, function (error) {
    responseEl.textContent = "אירעה שגיאה בשליחת ההודעה. נסה שוב או פנה ישירות.";
    responseEl.style.color = "red";
  });
});

function showError(field, message) {
  const errorSpan = field.nextElementSibling;
  errorSpan.textContent = message;
  field.focus();
}
