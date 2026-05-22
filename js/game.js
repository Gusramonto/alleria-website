// =============================================
// ALLERIA — game.js
// "¿Sabes Identificar Pan Real?" — 5 rounds
// Canvas score image generation
// =============================================

(function () {
  'use strict';

  // ===== GAME DATA =====
  // Each round: one image is sourdough, one is industrial.
  // isSourdough=true marks the correct answer.
  // Images are placeholders — replace src with real photos.
  // Recommended search: "sourdough bread crumb texture" vs "commercial white bread"
  const ROUNDS_DATA = [
    {
      category: 'La Miga',
      imageA: {
        src: 'https://upload.wikimedia.org/wikipedia/commons/9/90/White_sandwich_bread.jpg',
        alt: 'Miga de pan industrial uniforme',
        isSourdough: false,
        label: 'Pan A'
      },
      imageB: {
        src: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Sliced_loaf_of_sourdough_bread.jpg',
        alt: 'Miga de pan de masa madre con alveolos irregulares',
        isSourdough: true,
        label: 'Pan B'
      },
      feedbackCorrect: '¡Correcto! Los alveolos grandes e irregulares son la firma de la masa madre real',
      feedbackIncorrect: '¡Casi! La miga de masa madre tiene burbujas irregulares y grandes. La industrial es uniforme y pequeña'
    },
    {
      category: 'La Corteza',
      imageA: {
        src: 'https://upload.wikimedia.org/wikipedia/commons/a/aa/Sourdough_bread_baked_in_cast_iron_dutch_oven.jpg',
        alt: 'Corteza gruesa y oscura de pan de masa madre',
        isSourdough: true,
        label: 'Pan A'
      },
      imageB: {
        src: 'https://upload.wikimedia.org/wikipedia/commons/5/5b/Crust_of_milk_loaf_with_wheatgerm.jpg',
        alt: 'Corteza suave y pálida de pan industrial',
        isSourdough: false,
        label: 'Pan B'
      },
      feedbackCorrect: '¡Perfecto! Corteza oscura, gruesa y crujiente = fermentación real. Tarda más en hornear.',
      feedbackIncorrect: 'La corteza de masa madre es oscura y gruesa (izquierda). La suave y clara es pan industrial.'
    },
    {
      category: 'El Color',
      imageA: {
        src: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Wei%C3%9Fbrot-1.jpg',
        alt: 'Pan blanco industrial de color pálido uniforme',
        isSourdough: false,
        label: 'Pan A'
      },
      imageB: {
        src: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Sourdough_bread.jpg',
        alt: 'Pan de masa madre con color dorado oscuro caramelizado',
        isSourdough: true,
        label: 'Pan B'
      },
      feedbackCorrect: '¡Exacto! El color dorado oscuro con manchas es caramelización natural de la fermentación larga',
      feedbackIncorrect: 'El color pálido y uniforme (A) es industrial. La masa madre (B) tiene ese dorado intenso e irregular'
    },
    {
      category: 'La Textura',
      imageA: {
        src: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Slices_of_sourdough_bread.jpg',
        alt: 'Rebanadas densas y elásticas de pan de masa madre',
        isSourdough: true,
        label: 'Pan A'
      },
      imageB: {
        src: 'https://upload.wikimedia.org/wikipedia/commons/b/b7/Sliced_sandwich_breads_2021-8-28.jpg',
        alt: 'Rebanadas esponjosas de pan industrial de molde',
        isSourdough: false,
        label: 'Pan B'
      },
      feedbackCorrect: '¡Bien visto! La textura densa, húmeda y con estructura irregular (A) es masa madre auténtica',
      feedbackIncorrect: 'El pan esponjoso y perfectamente uniforme (B) es industrial. La masa madre (A) es densa y con carácter'
    },
    {
      category: 'La Conservación',
      imageA: {
        src: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Sandwich_bread_%28Bakers_Choice%29.JPG',
        alt: 'Pan industrial empaquetado con conservantes',
        isSourdough: false,
        label: 'Pan Industrial'
      },
      imageB: {
        src: 'https://upload.wikimedia.org/wikipedia/commons/6/67/Loaf_of_sourdough_bread_cooling.jpg',
        alt: 'Pan de masa madre recién horneado sin conservantes',
        isSourdough: true,
        label: 'Pan Masa Madre'
      },
      feedbackCorrect: '¡Correcto! La acidez natural del pan B lo conserva 5–7 días sin moho. El A necesita conservantes para durar.',
      feedbackIncorrect: 'El industrial (A) dura 2–3 días sin moho gracias a conservantes. La masa madre (B) se conserva sola 5–7 días por su acidez natural.'
    }
  ];

  const RESULTS = [
    { min: 5, max: 5, label: '5/5 — EXPERTO EN PAN REAL', quote: 'Tienes ojo de panadero artesanal 🏆', color: '#2d7d46' },
    { min: 4, max: 4, label: '4/5 — CASI EXPERTO',        quote: 'Ya reconoces el pan de calidad 🥖',   color: '#2d7d46' },
    { min: 3, max: 3, label: '3/5 — APRENDIZ',            quote: 'Vas por buen camino 👍',              color: '#f5a623' },
    { min: 2, max: 2, label: '2/5 — NOVATO',              quote: 'Empieza a fijarte en los detalles 🔍', color: '#f5a623' },
    { min: 0, max: 1, label: '0–1/5 — NECESITAS PRÁCTICA', quote: 'Visita Alleria y aprende con nosotros 🥐', color: '#e53e3e' }
  ];

  // ===== STATE =====
  let gameRounds = [];   // shuffled rounds (A/B sides randomized)
  let currentRound = 0;
  let score = 0;
  let answered = false;

  // ===== DOM REFS =====
  const $ = id => document.getElementById(id);
  const gameContainer  = $('game-container');
  const gameProgress   = $('game-progress');
  const gameQuestion   = $('game-question');
  const gameFeedback   = $('game-feedback');
  const gameResult     = $('game-result');
  const gameCategory   = $('game-category');
  const gameImgA       = $('game-img-a');
  const gameImgB       = $('game-img-b');
  const btnA           = $('btn-a');
  const btnB           = $('btn-b');
  const feedbackIcon   = $('feedback-icon');
  const feedbackText   = $('feedback-text');
  const btnNext        = $('btn-next');
  const gameRoundLabel = $('game-round-label');
  const resultScore    = $('result-score');
  const resultLabel    = $('result-label');
  const resultQuote    = $('result-quote');
  const btnPlayAgain   = $('btn-play-again');
  const btnShareScore  = $('btn-share-score');
  const btnReto        = $('btn-reto');
  const btnCotizar     = $('btn-cotizar');

  if (!gameContainer) return;

  // ===== INIT =====
  initGame();

  function initGame() {
    currentRound = 0;
    score = 0;
    answered = false;

    // Shuffle: randomly swap A and B for each round (50/50)
    gameRounds = ROUNDS_DATA.map(round => {
      const swap = Math.random() > 0.5;
      return {
        ...round,
        imageA: swap ? round.imageB : round.imageA,
        imageB: swap ? round.imageA : round.imageB
      };
    });

    updateDots();
    showQuestion();

    gameQuestion.hidden = false;
    gameFeedback.hidden = true;
    gameResult.hidden = true;
    gameProgress.hidden = false;
  }

  function showQuestion() {
    const round = gameRounds[currentRound];
    gameCategory.textContent = round.category;
    gameRoundLabel.textContent = `Pregunta ${currentRound + 1} / 5`;

    gameImgA.src = round.imageA.src;
    gameImgA.alt = round.imageA.alt;
    gameImgB.src = round.imageB.src;
    gameImgB.alt = round.imageB.alt;

    // Reset button labels and states
    btnA.textContent = `Elegir ${round.imageA.label}`;
    btnB.textContent = `Elegir ${round.imageB.label}`;
    btnA.disabled = false;
    btnB.disabled = false;

    const choiceA = $('choice-a');
    const choiceB = $('choice-b');
    choiceA.classList.remove('correct', 'incorrect');
    choiceB.classList.remove('correct', 'incorrect');

    answered = false;
    updateDots();
  }

  function updateDots() {
    for (let i = 1; i <= 5; i++) {
      const dot = $(`dot-${i}`);
      dot.classList.remove('done', 'current');
      if (i - 1 < currentRound) dot.classList.add('done');
      if (i - 1 === currentRound) dot.classList.add('current');
    }
  }

  function handleAnswer(choice) {
    if (answered) return;
    answered = true;

    const round = gameRounds[currentRound];
    const selectedImage = choice === 'a' ? round.imageA : round.imageB;
    const isCorrect = selectedImage.isSourdough;

    if (isCorrect) score++;

    // Visual feedback on images
    const choiceA = $('choice-a');
    const choiceB = $('choice-b');

    if (choice === 'a') {
      choiceA.classList.add(isCorrect ? 'correct' : 'incorrect');
      choiceB.classList.add(isCorrect ? 'incorrect' : 'correct');
    } else {
      choiceB.classList.add(isCorrect ? 'correct' : 'incorrect');
      choiceA.classList.add(isCorrect ? 'incorrect' : 'correct');
    }

    btnA.disabled = true;
    btnB.disabled = true;

    // Show feedback
    feedbackIcon.textContent = isCorrect ? '✅' : '❌';
    feedbackText.textContent = isCorrect ? round.feedbackCorrect : round.feedbackIncorrect;

    gameQuestion.hidden = false;
    gameFeedback.hidden = false;
  }

  btnA.addEventListener('click', () => handleAnswer('a'));
  btnB.addEventListener('click', () => handleAnswer('b'));

  btnNext.addEventListener('click', () => {
    currentRound++;
    gameFeedback.hidden = true;

    if (currentRound >= 5) {
      showResult();
    } else {
      showQuestion();
    }
  });

  function showResult() {
    gameQuestion.hidden = true;
    gameFeedback.hidden = true;
    gameProgress.hidden = true;
    gameResult.hidden = false;

    const result = RESULTS.find(r => score >= r.min && score <= r.max);
    resultScore.textContent = `${score}/5`;
    resultScore.style.color = result.color;
    resultLabel.textContent = result.label;
    resultQuote.textContent = result.quote;

    // Update B2B calculator link
    if (btnCotizar) {
      btnCotizar.href = `https://wa.me/584122632864?text=Hola%20Alleria!%20Quiero%20una%20cotizaci%C3%B3n%20al%20mayor%20%F0%9F%A5%96`;
    }
  }

  btnPlayAgain.addEventListener('click', initGame);

  // ===== SHARE SCORE =====
  btnShareScore.addEventListener('click', async () => {
    const imgDataUrl = generateScoreCanvas(score);
    const text = `Saqué ${score}/5 identificando pan real 🥖 ¿Tú cuánto sacarías? Ponlo a prueba en alleriacoffeebar.com`;
    const url = window.location.origin + window.location.pathname;

    if (navigator.share) {
      try {
        // Try with image file (canvas → blob)
        const blob = await canvasToBlob();
        if (blob) {
          const file = new File([blob], 'mi-resultado-alleria.png', { type: 'image/png' });
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({ files: [file], title: 'Mi resultado — Alleria', text, url });
            return;
          }
        }
        // Fallback: share without image
        await navigator.share({ title: 'Mi resultado — Alleria', text, url });
      } catch (err) {
        if (err.name !== 'AbortError') fallbackCopy(text + ' ' + url);
      }
    } else {
      // Desktop: download image + copy text
      downloadCanvas(imgDataUrl);
      fallbackCopy(text + ' ' + url);
    }
  });

  btnReto.addEventListener('click', async () => {
    const text = `¿Puedes identificar pan de masa madre real? 🥖 Yo saqué ${score}/5. Pon a prueba tu ojo:`;
    const url = window.location.origin + window.location.pathname + '#juego';
    if (navigator.share) {
      try { await navigator.share({ title: 'Reta a tus amigos — Alleria', text, url }); }
      catch (err) { if (err.name !== 'AbortError') fallbackCopy(text + ' ' + url); }
    } else {
      fallbackCopy(text + ' ' + url);
    }
  });

  function fallbackCopy(text) {
    navigator.clipboard?.writeText(text)
      .then(() => window.showToast('¡Link copiado al portapapeles!'))
      .catch(() => window.showToast('Copia este link y compártelo'));
  }

  // ===== CANVAS SCORE IMAGE =====
  function generateScoreCanvas(score) {
    const canvas = document.getElementById('score-canvas');
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    const W = 600, H = 800;

    // Background
    ctx.fillStyle = '#f5f1e8';
    ctx.fillRect(0, 0, W, H);

    // Top accent bar
    ctx.fillStyle = '#2d7d46';
    ctx.fillRect(0, 0, W, 8);

    // Bottom accent bar
    ctx.fillRect(0, H - 8, W, 8);

    // Score circle
    ctx.beginPath();
    ctx.arc(W / 2, 280, 120, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#2d7d46';
    ctx.lineWidth = 6;
    ctx.stroke();

    // Score text
    const result = RESULTS.find(r => score >= r.min && score <= r.max);
    ctx.fillStyle = result ? result.color : '#2d7d46';
    ctx.font = 'bold 80px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${score}/5`, W / 2, 278);

    // Title
    ctx.fillStyle = '#3d3d3d';
    ctx.font = 'bold 28px serif';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText('¿SABES IDENTIFICAR', W / 2, 460);
    ctx.fillText('PAN REAL?', W / 2, 496);

    // Result label
    ctx.fillStyle = '#2d7d46';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText(result ? result.label.split('—')[1]?.trim() || result.label : '', W / 2, 548);

    // Branding
    ctx.fillStyle = '#666666';
    ctx.font = '18px sans-serif';
    ctx.fillText('Alleria Coffee Bar', W / 2, 620);
    ctx.font = '15px sans-serif';
    ctx.fillText('Panadería Artesanal · Barquisimeto', W / 2, 648);

    // CTA
    ctx.fillStyle = '#2d7d46';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('¿Y tú cuánto sacarías? Ponlo a prueba →', W / 2, 710);

    // Watermark logo text (since we can't load external image in canvas easily)
    ctx.fillStyle = '#3d3d3d';
    ctx.font = 'bold italic 36px serif';
    ctx.fillText('ALLERIA', W / 2, 160);
    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#666';
    ctx.letterSpacing = '6px';
    ctx.fillText('COFFEE BAR', W / 2, 185);

    return canvas.toDataURL('image/png');
  }

  function canvasToBlob() {
    return new Promise(resolve => {
      const canvas = document.getElementById('score-canvas');
      if (!canvas) return resolve(null);
      generateScoreCanvas(score);
      canvas.toBlob(resolve, 'image/png');
    });
  }

  function downloadCanvas(dataUrl) {
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'mi-resultado-alleria.png';
    a.click();
    window.showToast('Imagen descargada. ¡Compártela!');
  }

})();
