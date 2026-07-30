// =============================================
// ALLERIA — directorio.js
// Página "Dónde probar Alleria" (/donde-probar)
// =============================================
// Lee la MISMA lista de locales que las landings del QR (js/socios-data.js),
// así no hay dos listas que mantener.
//
// REGLA IMPORTANTE: aquí solo aparecen los locales con
// mostrar_en_directorio: true — es decir, los que te autorizaron a
// nombrarlos públicamente. Los demás siguen teniendo su landing de QR
// funcionando, pero no salen en esta página.
//
// Si ninguno está autorizado, la sección entera no se muestra: la página
// sigue teniendo sentido con nuestras tiendas y la invitación a negocios.
// =============================================

(function () {
  'use strict';

  var socios  = window.ALLERIA_SOCIOS || {};
  var seccion = document.getElementById('d-aliados');
  var grid    = document.getElementById('d-aliados-grid');

  if (!seccion || !grid) return;

  // Solo los autorizados, en orden alfabético
  var autorizados = Object.keys(socios)
    .map(function (slug) { return socios[slug]; })
    .filter(function (s) { return s && s.mostrar_en_directorio === true; })
    .sort(function (a, b) {
      return (a.nombre || '').localeCompare(b.nombre || '', 'es');
    });

  if (autorizados.length === 0) return;   // sin autorizados, sección oculta

  autorizados.forEach(function (socio) {
    var card = document.createElement('article');
    card.className = 'd-card';

    var titulo = document.createElement('h3');
    titulo.textContent = socio.nombre || '';
    card.appendChild(titulo);

    // Los panes de Alleria que usa ese local
    if (Array.isArray(socio.panes) && socio.panes.length > 0) {
      var lista = document.createElement('ul');
      lista.className = 's-chips d-chips';
      lista.setAttribute('role', 'list');
      socio.panes.forEach(function (pan) {
        var li = document.createElement('li');
        li.textContent = pan;
        lista.appendChild(li);
      });
      card.appendChild(lista);
    }

    // Instagram del local: si no tiene, no se muestra nada (nunca un enlace muerto)
    if (socio.instagram) {
      var enlace = document.createElement('a');
      enlace.className = 'd-ig';
      enlace.href = 'https://www.instagram.com/' + socio.instagram;
      enlace.target = '_blank';
      enlace.rel = 'noopener';
      enlace.textContent = '@' + socio.instagram;
      card.appendChild(enlace);
    }

    grid.appendChild(card);
  });

  seccion.hidden = false;
})();
