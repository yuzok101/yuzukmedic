// script.js - עם מודול וייבוא EmailJS מה-CDN

import emailjs from 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.es.min.js';

// אתחול EmailJS עם ה-Public Key שלך
emailjs.init('miOp6iToFLfbH1jk5');

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  const responseDiv = document.getElementById('formResponse');
  const sendBtn = document.getElementById('sendBtn');

  // פונקציה לאיפוס הודעות שגיאה
  function clearErrors() {
    form.querySelectorAll('.error-message').forEach(span => {
      span.textContent = '';
      span.style.display = 'none';
    });
  }

  // פונקציה לאימות הטופס
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
   
