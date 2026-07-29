// =============================================
// ALLERIA — socios.js
// Pinta la landing co-branded según el slug de la URL
// y registra escaneos y clics en Supabase.
//
// NO depende de main.js (esta página no tiene header ni menú del sitio).
// Si algo falla, la página queda como una landing genérica de Alleria
// perfectamente válida — nunca rota, nunca con enlaces muertos.
// =============================================

(function () {
  'use strict';

  // ===== 1. ¿QUÉ LOCAL ES? =====
  function obtenerSlug() {
    // Ruta real: /socios/tiffany
    var match = window.location.pathname.match(/\/socios\/([^\/?#]+)/i);
    if (match && match[1]) {
      return decodeURIComponent(match[1]).toLowerCase();
    }
    // Alternativa para pruebas locales: socios.html?socio=tiffany
    var query = new URLSearchParams(window.location.search).get('socio');
    return query ? query.toLowerCase() : '';
  }

  var slug   = obtenerSlug();
  var socios = window.ALLERIA_SOCIOS || {};
  var tipos  = window.ALLERIA_SOCIOS_TIPOS || {};
  var socio  = Object.prototype.hasOwnProperty.call(socios, slug) ? socios[slug] : null;

  function $(id) { return document.getElementById(id); }


  // ===== 2. PINTAR EL CONTENIDO DEL LOCAL =====
  // Todo lo específico del local está oculto por defecto en el HTML.
  // Solo se muestra si el dato existe. Regla: dato vacío = elemento oculto.
  if (socio) {

    // — Crédito al anfitrión —
    if (socio.nombre) {
      var cobrand = $('s-cobrand');
      if (cobrand) {
        cobrand.textContent = socio.nombre + ' eligió masa madre de Alleria';
        cobrand.hidden = false;
      }
      document.title = 'Ese pan que te gustó en ' + socio.nombre + ' es masa madre de Alleria';
    }

    // — Foto del hero: si ya hay foto del plato del local, tiene prioridad —
    var img = $('s-hero-img');
    if (img) {
      if (socio.foto_plato) {
        img.src = socio.foto_plato;
        img.alt = socio.foto_plato_alt || socio.foto_alt || img.alt;
        // La foto de plato necesita más altura que una foto de pan solo
        if (img.parentNode) img.parentNode.classList.add('s-hero-media--plato');
      } else if (socio.foto) {
        img.src = socio.foto;
        if (socio.foto_alt) img.alt = socio.foto_alt;
      }
    }

    // — Título del bloque de reseña, con el nombre del local —
    if (socio.nombre) {
      var tituloResena = $('s-review-title');
      if (tituloResena) {
        tituloResena.textContent = '¿Qué te pareció el pan en ' + socio.nombre + '?';
      }
    }

    // — Subtítulo según el tipo de hablador que trajo a la persona —
    var textos = tipos[socio.tipo];
    if (textos && textos.subtitulo) {
      var sub = $('s-sub');
      if (sub) sub.textContent = textos.subtitulo;
    }

    // — Los panes de ESTE local —
    if (Array.isArray(socio.panes) && socio.panes.length > 0) {
      var lista = $('s-chips');
      var bloque = $('s-panes');
      var titulo = $('s-panes-titulo');

      if (lista && bloque) {
        socio.panes.forEach(function (pan) {
          var li = document.createElement('li');
          li.textContent = pan;
          lista.appendChild(li);
        });

        if (titulo) {
          var plantilla = (textos && textos.panes_titulo) || 'Lo que probaste en {nombre} lleva:';
          titulo.textContent = plantilla.replace('{nombre}', socio.nombre || 'este local');
        }

        bloque.hidden = false;
      }
    }

    // — Instagram del anfitrión: si no tiene handle, el enlace no existe —
    if (socio.instagram) {
      var enlaceSocio = $('s-footer-socio');
      if (enlaceSocio) {
        enlaceSocio.href = 'https://www.instagram.com/' + socio.instagram;
        enlaceSocio.textContent = 'Sigue también a ' + (socio.nombre || '@' + socio.instagram);
        enlaceSocio.hidden = false;
      }
    }
  }


  // ===== 3. MEDICIÓN (escaneos y clics por local) =====
  // Inserción directa por REST: evita cargar la librería de Supabase (40 KB)
  // en una página donde la velocidad decide la conversión.
  function registrar(evento) {
    if (typeof SUPABASE_CONFIGURED === 'undefined' || !SUPABASE_CONFIGURED) return;

    try {
      fetch(SUPABASE_URL + '/rest/v1/socio_eventos', {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': 'Bearer ' + SUPABASE_KEY,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          slug: slug || '(sin-slug)',
          evento: evento
        }),
        keepalive: true   // sobrevive aunque el usuario se vaya a Instagram
      }).catch(function () { /* la medición nunca puede romper la página */ });
    } catch (e) { /* silencio */ }
  }

  // Un escaneo por sesión: recargar la página no infla el conteo.
  function registrarEscaneo() {
    var clave = 'alleria_scan_' + (slug || 'generico');
    try {
      if (sessionStorage.getItem(clave)) return;
      sessionStorage.setItem(clave, '1');
    } catch (e) { /* modo privado: se registra igual */ }
    registrar('scan');
  }

  registrarEscaneo();

  // Clics en cada acción
  [['s-cta-hero', 'click_instagram'],
   ['s-cta-main', 'click_instagram'],
   ['s-cta-wa', 'click_whatsapp'],
   ['s-footer-socio', 'click_instagram_socio']
  ].forEach(function (par) {
    var el = $(par[0]);
    if (el) {
      el.addEventListener('click', function () { registrar(par[1]); });
    }
  });


  // ===== 4. RESEÑA DEL COMENSAL =====
  // Guarda la satisfacción ligada al local, para poder responder
  // "¿qué opinan los comensales del pan de Alleria en ESTE establecimiento?"
  (function resenas() {
    var form    = $('s-review-form');
    var estrellas = $('s-stars');
    if (!form || !estrellas) return;

    var extra   = $('s-review-extra');
    var okMsg   = $('s-review-ok');
    var errMsg  = $('s-review-err');
    var botones = estrellas.querySelectorAll('.s-star');
    var puntaje = 0;

    function pintarEstrellas(valor) {
      for (var i = 0; i < botones.length; i++) {
        botones[i].classList.toggle('on', i < valor);
      }
    }

    estrellas.addEventListener('click', function (e) {
      var btn = e.target.closest('.s-star');
      if (!btn) return;
      puntaje = parseInt(btn.getAttribute('data-value'), 10) || 0;
      $('s-rating').value = String(puntaje);
      pintarEstrellas(puntaje);
      if (extra) extra.hidden = false;   // el resto aparece solo tras puntuar
      registrar('resena_estrellas');
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (puntaje < 1) return;

      var boton = $('s-review-send');
      if (boton) { boton.disabled = true; boton.textContent = 'Enviando...'; }
      if (errMsg) errMsg.hidden = true;

      var fila = {
        name:    ($('s-review-name').value || '').trim() || 'Anónimo',
        rating:  puntaje,
        comment: ($('s-review-comment').value || '').trim() || 'Sin comentario',
        business: socio && socio.nombre ? socio.nombre : 'QR sin local',
        socio_slug: slug || null
      };

      if (typeof SUPABASE_CONFIGURED === 'undefined' || !SUPABASE_CONFIGURED) {
        mostrarGracias();
        return;
      }

      fetch(SUPABASE_URL + '/rest/v1/testimonials', {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': 'Bearer ' + SUPABASE_KEY,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(fila)
      })
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        registrar('resena_enviada');
        if (window.alleriaAvisarResena) {
          window.alleriaAvisarResena({
            rating:   fila.rating,
            name:     fila.name,
            business: fila.business,
            comment:  fila.comment,
            socio:    slug
          });
        }
        mostrarGracias();
      })
      .catch(function () {
        if (boton) { boton.disabled = false; boton.textContent = 'Enviar mi opinión'; }
        if (errMsg) errMsg.hidden = false;
      });
    });

    function mostrarGracias() {
      if (extra) extra.hidden = true;
      estrellas.style.pointerEvents = 'none';
      if (okMsg) okMsg.hidden = false;
    }
  })();


  // ===== 5. APARICIÓN SUAVE AL HACER SCROLL =====
  if ('IntersectionObserver' in window &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {

    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('visible');
          observador.unobserve(entrada.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.why-card, .s-chips li, .s-quote').forEach(function (el) {
      el.classList.add('reveal');
      observador.observe(el);
    });
  }

})();
