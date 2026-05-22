// =============================================
// ALLERIA — calculator.js
// B2B bread calculator
// Algorithm: doc spec section 5.6.1
// =============================================

(function () {
  'use strict';

  const form   = document.getElementById('calculator-form');
  const result = document.getElementById('calculator-result');
  if (!form) return;

  // Product prices (USD, IVA incluido)
  const PRICES = {
    focaccia:  2.50,
    ciabatta:  2.00,
    molde:     6.00,   // average med/grande
    otros:     1.50    // average canilla/campesino/deli
  };

  // Distribution of daily bread among product types
  const DIST = {
    focaccia: 0.40,
    ciabatta: 0.28,
    molde:    0.20,
    otros:    0.12
  };

  const WORKING_DAYS = 26; // days/month

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const desayunos = clamp(parseInput('calc-desayunos'), 0, 9999);
    const almuerzos = clamp(parseInput('calc-almuerzos'), 0, 9999);
    const cenas     = clamp(parseInput('calc-cenas'),     0, 9999);
    const tipo      = form.querySelector('input[name="tipo"]:checked')?.value || 'restaurante';

    if (desayunos === 0 && almuerzos === 0 && cenas === 0) {
      shakeForm();
      return;
    }

    const breakdown = calculate(desayunos, almuerzos, cenas, tipo);
    renderResult(breakdown);
    result.hidden = false;
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  function calculate(desayunos, almuerzos, cenas, tipo) {
    // Daily bread need (from spec: 0.5 desayuno, 0.7 almuerzo, 0.4 cena)
    let dailyBase = desayunos * 0.5 + almuerzos * 0.7 + cenas * 0.4;

    // Business type multiplier
    if (tipo === 'hotel')    dailyBase *= 1.20;
    if (tipo === 'catering') dailyBase *= 1.15;
    if (tipo === 'bodegon')  dailyBase *= 1.10;

    const monthlyTotal = Math.round(dailyBase * WORKING_DAYS);

    // Distribute across product types
    const focaccias = Math.round(monthlyTotal * DIST.focaccia);
    const ciabattas = Math.round(monthlyTotal * DIST.ciabatta);
    const moldes    = Math.round(monthlyTotal * DIST.molde);
    const otros     = monthlyTotal - focaccias - ciabattas - moldes;

    const totalUSD = (
      focaccias * PRICES.focaccia +
      ciabattas * PRICES.ciabatta +
      moldes    * PRICES.molde    +
      Math.max(0, otros) * PRICES.otros
    );

    return { focaccias, ciabattas, moldes, otros: Math.max(0, otros), totalUSD };
  }

  function renderResult({ focaccias, ciabattas, moldes, otros, totalUSD }) {
    setText('res-focaccias',       `${focaccias} u/mes`);
    setText('res-focaccias-price', `$${(focaccias * PRICES.focaccia).toFixed(0)}`);
    setText('res-ciabattas',       `${ciabattas} u/mes`);
    setText('res-ciabattas-price', `$${(ciabattas * PRICES.ciabatta).toFixed(0)}`);
    setText('res-molde',           `${moldes} u/mes`);
    setText('res-molde-price',     `$${(moldes * PRICES.molde).toFixed(0)}`);
    setText('res-otros',           `${otros} u/mes`);
    setText('res-otros-price',     `$${(otros * PRICES.otros).toFixed(0)}`);
    setText('res-total',           `$${totalUSD.toFixed(0)}`);

    // Wire up WhatsApp CTA with pre-filled context
    const btnCotizar = document.getElementById('btn-cotizar');
    if (btnCotizar) {
      const msg = encodeURIComponent(
        `Hola Alleria! Calculé que mi negocio necesita aprox. $${totalUSD.toFixed(0)}/mes en panes. ` +
        `Me gustaría una cotización exacta al mayor 🥖`
      );
      btnCotizar.href = `https://wa.me/584122632864?text=${msg}`;
    }
  }

  function parseInput(id) {
    const val = parseInt(document.getElementById(id)?.value || '0', 10);
    return isNaN(val) ? 0 : val;
  }

  function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }

  function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function shakeForm() {
    form.style.animation = 'none';
    requestAnimationFrame(() => {
      form.style.animation = '';
      form.style.transform = 'translateX(6px)';
      setTimeout(() => { form.style.transform = 'translateX(-6px)'; }, 80);
      setTimeout(() => { form.style.transform = ''; }, 160);
    });
    window.showToast?.('Ingresa al menos una comida del día');
  }

})();
