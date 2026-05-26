// =============================================
// ALLERIA — share.js
// Web Share API + clipboard fallback
// Supabase feedback form submission
// Star rating input
// =============================================

(function () {
  'use strict';

  const SITE_URL = window.location.origin + window.location.pathname;

  // Share messages per context
  const SHARE_MESSAGES = {
    ciencia: {
      text: 'Descubrí por qué la masa madre es diferente 🧬 Muy interesante, mira:',
      url: SITE_URL + '#ciencia'
    },
    guia: {
      text: '¿Sabes identificar pan de masa madre real? Aprende aquí:',
      url: SITE_URL + '#juego'
    },
    productos: {
      text: 'Mira el menú de Alleria, panadería de masa madre en Barquisimeto 🥖',
      url: SITE_URL + '#productos'
    },
    feedback: {
      text: 'Probé Alleria Coffee Bar y es increíble 🥖☕ Tienen pan de masa madre artesanal en Barquisimeto. Te lo recomiendo:',
      url: SITE_URL
    }
  };

  // ===== CONTEXTUAL SHARE BUTTON (productos section header) =====
  document.querySelectorAll('.btn-share-context').forEach(btn => {
    btn.addEventListener('click', async () => {
      const context = btn.dataset.shareContext || 'productos';
      const { text, url } = SHARE_MESSAGES[context] || SHARE_MESSAGES.productos;
      const waUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
      window.open(waUrl, '_blank', 'noopener');
    });
  });

  // ===== SHARE BUTTON GROUPS (.share-buttons) =====
  document.querySelectorAll('.share-buttons').forEach(group => {
    const context = group.dataset.shareContext || 'ciencia';
    const { text, url } = SHARE_MESSAGES[context] || SHARE_MESSAGES.ciencia;

    group.querySelectorAll('.btn-share').forEach(btn => {
      btn.addEventListener('click', async () => {

        if (btn.classList.contains('whatsapp')) {
          // WhatsApp — try Web Share first on mobile
          if (navigator.share) {
            try {
              await navigator.share({ title: 'Alleria Coffee Bar', text, url });
              return;
            } catch (err) {
              if (err.name === 'AbortError') return;
            }
          }
          const waUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
          window.open(waUrl, '_blank', 'noopener');
        }

        if (btn.classList.contains('copy')) {
          try {
            await navigator.clipboard.writeText(url);
            window.showToast?.('¡Link copiado al portapapeles! 📋');
          } catch {
            window.showToast?.('Copia este link: ' + url);
          }
        }

      });
    });
  });

  // ===== STAR RATING =====
  const starsInput = document.getElementById('stars-input');
  const ratingInput = document.getElementById('feedback-rating');

  if (starsInput) {
    const starBtns = starsInput.querySelectorAll('.star-btn');

    starBtns.forEach((btn, idx) => {
      btn.addEventListener('mouseenter', () => highlightStars(idx + 1));
      btn.addEventListener('mouseleave', () => highlightStars(parseInt(ratingInput.value) || 0));
      btn.addEventListener('click', () => {
        ratingInput.value = idx + 1;
        highlightStars(idx + 1);
      });
      // Touch support
      btn.addEventListener('touchend', (e) => {
        e.preventDefault();
        ratingInput.value = idx + 1;
        highlightStars(idx + 1);
      });
    });

    function highlightStars(count) {
      starBtns.forEach((b, i) => b.classList.toggle('active', i < count));
    }
  }

  // ===== CHARACTER COUNTER =====
  const commentArea = document.getElementById('feedback-comment');
  const charCount   = document.getElementById('char-count');

  if (commentArea && charCount) {
    commentArea.addEventListener('input', () => {
      const len = commentArea.value.length;
      charCount.textContent = `${len}/150`;
      charCount.style.color = len >= 130 ? '#e53e3e' : '';
    });
  }

  // ===== FEEDBACK FORM SUBMISSION =====
  const feedbackForm    = document.getElementById('feedback-form');
  const submitBtn       = document.getElementById('btn-submit-feedback');
  const successDiv      = document.getElementById('feedback-success');
  const errorDiv        = document.getElementById('feedback-error');

  if (feedbackForm) {
    feedbackForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const rating   = parseInt(ratingInput?.value || '0', 10);
      const name     = document.getElementById('feedback-name')?.value.trim() || '';
      const business = document.getElementById('feedback-business')?.value.trim() || '';
      const comment  = commentArea?.value.trim() || '';

      // Validation
      if (rating < 1 || comment.length < 3) {
        errorDiv.hidden = false;
        return;
      }
      errorDiv.hidden = true;

      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando...';

      const success = await submitToSupabase({ rating, name: name || 'Anónimo', business, comment });

      submitBtn.disabled = false;
      submitBtn.textContent = 'ENVIAR RESEÑA';

      if (success) {
        feedbackForm.style.display = 'none';
        successDiv.hidden = false;
      } else {
        window.showToast?.('Hubo un error. Intenta de nuevo.');
      }
    });
  }

  async function submitToSupabase({ rating, name, business, comment }) {
    if (!SUPABASE_CONFIGURED) {
      console.info('[Alleria] Supabase not configured. Feedback not saved:', { rating, name, business, comment });
      return true;
    }

    try {
      const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
      const row = { name, rating, comment };
      if (business) row.business = business;
      const { error } = await client
        .from('testimonials')
        .insert([row]);

      if (error) {
        console.error('[Alleria] Supabase error:', error.message);
        return false;
      }

      notifyTelegram({ rating, name, business, comment });
      return true;
    } catch (err) {
      console.error('[Alleria] Unexpected error:', err);
      return false;
    }
  }

  function notifyTelegram({ rating, name, business, comment }) {
    const stars = '⭐'.repeat(rating);
    const lugar = business ? `📍 ${business}` : '📍 No especificado';
    const text = `${stars} NUEVA RESEÑA — Alleria\n👤 ${name}\n${lugar}\n💬 "${comment}"`;
    const token = '8939547732:AAHqm4UgZj41CUzEcertm1FYJQZ7iM7e3yk';
    const chatId = '8979825898';
    fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text })
    }).catch(() => {});
  }

})();
