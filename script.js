window.onload = function() {
  emailjs.init("miOp6iToFLfbH1jk5");

  const form = document.getElementById('contactForm');
  const statusMsg = document.getElementById('formResponse');

  function validateInput(input) {
    const val = input.value.trim();
    const name = input.name;
    let valid = true;
    let msg = '';

    if (!val) {
      valid = false;
      msg = 'שדה חובה';
      return { valid, msg };
    }

    switch (name) {
      case 'name':
        if (val.length < 4) {
          valid = false;
          msg = 'יש להזין לפחות 4 תווים';
        }
        break;

      case 'phone':
        // בדיקת מספר טלפון פשוטה (רק ספרות, 9-10 ספרות)
        if (!/^\d{9,10}$/.test(val.replace(/\D/g, ''))) {
          valid = false;
          msg = 'יש להזין מספר טלפון תקין ללא קידומת +';
        }
        break;

      case 'email':
        // אימייל פשוט
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(val)) {
          valid = false;
          msg = 'אימייל לא תקין';
        }
        break;

      case 'area':
        if (val.length < 2) {
          valid = false;
          msg = 'יש להזין לפחות 2 תווים';
        }
        break;

      case 'message':
        if (val.length < 5) {
          valid = false;
          msg = 'ההודעה קצרה מדי';
        }
        break;
    }

    return { valid, msg };
  }

  function validateForm() {
    let allValid = true;
    const inputs = form.querySelectorAll('input, textarea');

    inputs.forEach(input => {
      const { valid, msg } = validateInput(input);
      const errorSpan = input.nextElementSibling;
      if (!valid) {
        errorSpan.textContent = msg;
        allValid = false;
      } else {
        errorSpan.textContent = '';
      }
    });

    return allValid;
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    statusMsg.textContent = '';
    if (!validateForm()) {
      statusMsg.style.color = '#cc0000';
      statusMsg.textContent = 'אנא תקן את השדות המסומנים';
      return;
    }

    // Disable submit button כדי למנוע שליחות כפולות
    const submitBtn = document.getElementById('sendBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'שולח...';

    const templateParams = {
      from_name: form.name.value.trim(),
      phone: form.phone.value.trim(),
      email: form.email.value.trim(),
      area: form.area.value.trim(),
      message: form.message.value.trim()
    };

    emailjs.send('service_45f1wyc', 'Contact Us', templateParams)
      .then(function(response) {
        statusMsg.style.color = 'green';
        statusMsg.textContent = 'ההודעה נשלחה בהצלחה, תודה רבה!';
        form.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = 'שלח';
      }, function(error) {
        statusMsg.style.color = '#cc0000';
        statusMsg.textContent = 'אירעה שגיאה בשליחת ההודעה, נסה שוב מאוחר יותר.';
        submitBtn.disabled = false;
        submitBtn.textContent = 'שלח';
      });
  });
};
