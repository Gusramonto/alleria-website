// =============================================
// ALLERIA — notify.js
// Aviso por Telegram cuando llega una reseña nueva.
// =============================================
// Lo usan la página principal (js/share.js) y las landings de socios
// (js/socios.js). Está en un solo archivo a propósito: así la
// configuración del bot vive en un único lugar y no repetida.
// =============================================

(function () {
  'use strict';

  var TELEGRAM_TOKEN   = '8939547732:AAHqm4UgZj41CUzEcertm1FYJQZ7iM7e3yk';
  var TELEGRAM_CHAT_ID = '8979825898';

  /**
   * Envía el aviso de una reseña nueva.
   * Nunca lanza errores: si el aviso falla, la reseña ya está guardada
   * en Supabase y el usuario no debe enterarse de nada.
   *
   * @param {object} datos { rating, name, business, comment, socio }
   */
  window.alleriaAvisarResena = function (datos) {
    try {
      var estrellas = '⭐'.repeat(Math.min(5, Math.max(1, datos.rating || 1)));
      var lugar  = datos.business ? '📍 ' + datos.business : '📍 No especificado';
      var origen = datos.socio ? '\n🔗 Escaneó el QR de: ' + datos.socio : '';

      var texto = estrellas + ' NUEVA RESEÑA — Alleria\n' +
                  '👤 ' + (datos.name || 'Anónimo') + '\n' +
                  lugar + origen + '\n' +
                  '💬 "' + (datos.comment || '') + '"';

      fetch('https://api.telegram.org/bot' + TELEGRAM_TOKEN + '/sendMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: texto }),
        keepalive: true
      }).catch(function () { /* el aviso nunca puede romper nada */ });
    } catch (e) { /* silencio */ }
  };

})();
