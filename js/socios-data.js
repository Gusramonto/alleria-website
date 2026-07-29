// =============================================
// ALLERIA — Socios B2B (datos de las landings del QR)
// =============================================
//
//  ▸ CÓMO AGREGAR UN LOCAL NUEVO:
//    1. Copia un bloque completo de abajo (desde 'slug': { hasta },)
//    2. Pégalo antes de la línea que dice  // ——— fin de la lista ———
//    3. Cambia los valores. Guarda. Sube el cambio. Listo.
//    La página /socios/EL-SLUG funciona sola, no hay que tocar nada más.
//
//  ▸ CÓMO EDITAR LOS PANES DE UN LOCAL (lo más frecuente):
//    Busca el local por su nombre y edita la lista 'panes'. Nada más.
//    Cada línea DEBE seguir la fórmula:  "[Producto] en masa madre de Alleria"
//
//  ▸ QUÉ SIGNIFICA CADA CAMPO:
//    slug       → lo que va en la URL. /socios/tiffany  →  slug 'tiffany'
//                 Solo minúsculas, números y guiones. Sin acentos ni espacios.
//    nombre     → el nombre del local tal como se muestra en pantalla.
//    instagram  → el usuario SIN la @. Si lo dejas vacío ('') el enlace
//                 al Instagram del local simplemente no aparece (nunca sale roto).
//    tipo       → 'opcion'          → el comensal PUEDE pedirlo (hamburgueserías, bares)
//                 'acompanamiento'  → se lo sirven sin pedirlo (hoteles, restaurantes)
//                 Cambia el texto del subtítulo y del bloque de panes.
//    panes      → los panes de Alleria que usa ESE local. Se muestran como etiquetas.
//    foto       → foto del hero. Las disponibles están listadas más abajo.
//    foto_alt   → descripción de la foto (accesibilidad y buscadores).
//    foto_plato → Foto del PLATO del local hecho con nuestro pan. Si la pones,
//                 el hero la usa automáticamente en lugar de 'foto' y le da más
//                 altura para que el plato se luzca. Si está vacía ('') se usa 'foto'.
//                 Manda la foto y yo la preparo (recorte + peso optimizado).
//    foto_plato_alt → descripción de la foto del plato.
//    acento     → reservado para más adelante. Hoy no se usa. Déjalo vacío.
//    mostrar_en_directorio → true SOLO si ese local te autorizó a nombrarlo
//                 públicamente en la página "Dónde probar Alleria".
//                 false = no aparece en el directorio (la landing del QR sí funciona).
//
//  ▸ FOTOS DISPONIBLES (ya optimizadas para carga rápida en celular):
//    '/assets/socios/panes-alleria.jpg'    → variedad de panes en cesta
//    '/assets/socios/pan-hotdog.jpg'       → panes de perro caliente
//    '/assets/socios/siciliano.jpg'        → hogaza siciliano
//    '/assets/socios/pan-campesino.jpg'    → campesino integral
//    '/assets/socios/pan-deli.jpg'         → pan deli
//    '/assets/socios/pan-hamburguesa.jpg'  → pan de hamburguesa
//
//  ▸ FOTOS DE PLATO (van en 'foto_plato'):
//    '/assets/socios/plato-hamburgueseria143.jpg' → hamburguesa de La Hamburguesería 143
//
// =============================================

window.ALLERIA_SOCIOS = {

  // ——— La Hamburguesería 143 ———
  'hamburgueseria143': {
    nombre: 'La Hamburguesería 143',
    instagram: 'hba143',
    tipo: 'opcion',
    panes: [
      'Hamburguesa en masa madre de Alleria',
      'Pepito en masa madre de Alleria'
    ],
    foto: '/assets/socios/pan-hamburguesa.jpg',
    foto_alt: 'Panes de hamburguesa en masa madre de Alleria',
    foto_plato: '/assets/socios/plato-hamburgueseria143.jpg',
    foto_plato_alt: 'Hamburguesa de La Hamburguesería 143 servida en pan de masa madre de Alleria',
    acento: '',
    mostrar_en_directorio: false
  },

  // ——— Bar 251 ———
  '251': {
    nombre: 'Bar 251',
    instagram: '251bar',
    tipo: 'opcion',
    panes: [
      'Perro caliente en masa madre de Alleria'
    ],
    foto: '/assets/socios/pan-hotdog.jpg',
    foto_alt: 'Panes de perro caliente en masa madre de Alleria',
    foto_plato: '',
    acento: '',
    mostrar_en_directorio: false
  },

  // ——— Hotel Tiffany ———
  'tiffany': {
    nombre: 'Hotel Tiffany',
    instagram: 'hoteltiffany',
    tipo: 'acompanamiento',
    panes: [
      'Deli en masa madre de Alleria',
      'Campesino en masa madre de Alleria',
      'Canilla en masa madre de Alleria',
      'Focaccia en masa madre de Alleria'
    ],
    foto: '/assets/socios/panes-alleria.jpg',
    foto_alt: 'Panes artesanales de masa madre de Alleria',
    foto_plato: '',
    acento: '',
    mostrar_en_directorio: false
  },

  // ——— Campobasso ———
  'campobasso': {
    nombre: 'Campobasso',
    instagram: 'dicampobasso_',
    tipo: 'acompanamiento',
    panes: [
      'Campesino en masa madre de Alleria',
      'Siciliano en masa madre de Alleria'
    ],
    foto: '/assets/socios/siciliano.jpg',
    foto_alt: 'Hogaza de pan siciliano en masa madre de Alleria',
    foto_plato: '',
    acento: '',
    mostrar_en_directorio: false
  }

  // ——— fin de la lista ———
};


// =============================================
// TEXTOS POR TIPO DE LOCAL
// Son el eco del hablador que trajo a la persona hasta aquí.
// Si cambias el texto de un hablador impreso, cambia también el de aquí.
// =============================================
window.ALLERIA_SOCIOS_TIPOS = {

  // Hablador: "Pídela en masa madre de Alleria." / "Estás comiendo masa madre de Alleria."
  opcion: {
    subtitulo: 'Fermentación de días, sin conservantes. Por eso cae ligero y sabe distinto.',
    panes_titulo: 'Lo que pediste en {nombre} lleva:'
  },

  // Hablador: "Masa madre de Alleria. Cae ligero, sabe de verdad."
  acompanamiento: {
    subtitulo: 'Cae ligero, sabe de verdad. Fermentación de días, sin conservantes.',
    panes_titulo: 'El pan que te sirvieron en {nombre} es:'
  }
};
