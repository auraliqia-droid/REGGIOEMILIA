# Comunidad Educativa Reggio Emilia — Sitio Web

Sitio web institucional de la Comunidad Educativa Reggio Emilia, Xalapa, Veracruz.

## Archivos del proyecto

```
/
├── index.html          ← Estructura HTML completa (SPA de una sola página)
├── styles.css          ← Todos los estilos (design system + componentes)
├── main.js             ← Interacciones JS (menú, lightbox, FAQ, formulario)
├── LOGO REGGIO EMILIA_VERSION HORIZONTAL_COLOR RGB.png   ← Logo oficial
├── mascota 1           ← Mascota institucional (JPEG)
├── mascota 2           ← Mascota interactiva (JPEG)
├── WhatsApp Image 2026-02-08 at 2.09.30 PM.jpeg  ← Foto: arte en aula
├── WhatsApp Image 2026-02-08 at 2.10.45 PM.jpeg  ← Foto: huerto escolar
├── WhatsApp Image 2026-02-08 at 2.20.03 PM.jpeg  ← Foto: actividad familiar
├── quienes somos 2     ← Imagen panorámica (PNG)
├── inspiracion 1 .png  ← Imagen inspiracional
└── inspiracion 2       ← Imagen inspiracional (PNG)
```

## Despliegue

### Opción 1 — GitHub Pages (gratuito, recomendado)
1. Sube todos los archivos a un repositorio de GitHub
2. Ve a **Settings → Pages → Source: Deploy from branch → main → / (root)**
3. El sitio estará disponible en `https://usuario.github.io/nombre-repo/`
4. Para usar dominio propio (`reggioemiliaxalapa.com`), agrega un archivo `CNAME` con el dominio

### Opción 2 — Netlify (gratuito, drag & drop)
1. Visita [netlify.com](https://netlify.com) y crea una cuenta
2. Arrastra la carpeta del proyecto a la zona de deploy
3. Obtienes URL inmediata; configura dominio propio en Settings → Domain Management

### Opción 3 — Hosting compartido
- Sube todos los archivos a `public_html` o `www` vía FTP

## Configurar el formulario de contacto (Formspree)

1. Crea cuenta gratuita en [formspree.io](https://formspree.io)
2. Crea formulario apuntando a `eliza@reggioemilia.edu.mx`
3. En `index.html`, reemplaza `xpwdznqb` en el `action` del form con tu ID real:
   ```html
   action="https://formspree.io/f/TU-ID-AQUI"
   ```
4. El plan gratuito permite hasta 50 envíos/mes

## Cómo actualizar el contenido

### Cambiar textos
Abre `index.html` en cualquier editor. Las secciones están comentadas: `<!-- ═══ 1. HERO ═══ -->`, etc.

### Agregar fotos a la galería
En la sección `id="galeria"`, copia y pega este bloque, ajustando el nombre del archivo y descripción:
```html
<button type="button" class="gallery-item" data-lightbox
  data-src="mi-foto.jpg" data-caption="Descripción"
  aria-label="Abrir imagen: Descripción">
  <img src="mi-foto.jpg" alt="Descripción" loading="lazy" width="1200" height="900"/>
  <span class="gallery-overlay" aria-hidden="true">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      <line x1="11" y1="8" x2="11" y2="14"/>
      <line x1="8" y1="11" x2="14" y2="11"/>
    </svg>
  </span>
</button>
```

### Actualizar número de WhatsApp
Busca `525655473159` en `index.html` y reemplaza con el nuevo número (formato: 52 + 10 dígitos).

## Lista de fotos recomendadas para el cliente

- [ ] Fachada exterior de la escuela (luz de día)
- [ ] Vista general del Atelier o salón principal
- [ ] Niños trabajando con materiales (arcilla, pintura, construcción)
- [ ] Áreas al aire libre / jardín / huerto
- [ ] Maestra acompañando a niños en proyecto
- [ ] Reunión o taller de familias
- [ ] Detalle de materiales del Atelier
- [ ] Documentación pedagógica en las paredes
- [ ] Evento escolar (Muestra pedagógica)

**Especificaciones:** JPG o WebP, mínimo 1200×800 px, horizontal preferible.
Sin rostros de niños sin consentimiento escrito de padres.

## Paleta de colores institucional

| Color    | Hex       | Uso principal          |
|----------|-----------|------------------------|
| Azul     | `#0167b1` | Títulos, botones, brand |
| Rojo     | `#e30119` | Acentos, badges urgencia |
| Verde    | `#83b410` | Naturaleza, éxito       |
| Amarillo | `#fcc302` | Resaltados, iconos      |
| Negro    | `#040404` | Texto principal         |
| Crema    | `#f7f4ef` | Fondos cálidos          |

## Funcionalidades implementadas

- Navbar sticky con glassmorphism y menú hamburguesa animado
- Hero con blob animations, estadísticas y CTAs
- Sección Quiénes Somos con fotos y mascota interactiva 3D
- Sección Filosofía con 6 principios Reggio y íconos SVG orgánicos
- Sección Testimonios con 3 testimonios y métricas de confianza
- Galería / Atelier con lightbox, navegación teclado y swipe táctil
- FAQ con acordeón nativo + animación CSS
- Sección Inscripciones con urgencia y CTAs
- Formulario de contacto con validación JS + envío async (Formspree)
- Mapa Google Maps embebido
- Footer completo con links, contacto, horarios y redes sociales
- Botón flotante de WhatsApp animado
- Schema.org JSON-LD: EducationalOrganization + FAQPage
- Open Graph + Twitter Cards
- Dark mode automático (prefers-color-scheme)
- prefers-reduced-motion respetado
- WCAG 2.1 AA: contraste, ARIA labels, skip link, focus visible

## Contacto del proyecto

**Institución:** Comunidad Educativa Reggio Emilia
**Dirección:** Corregidora No. 65, Col. Los Ángeles, C.P. 91060, Xalapa, Ver.
**Tel:** 565 547 3159
**Email:** eliza@reggioemilia.edu.mx
**Instagram:** [@comunidadreggioemilia](https://www.instagram.com/comunidadreggioemilia/)
**Facebook:** [ComunidadEducativaReggioEmilia](https://www.facebook.com/ComunidadEducativaReggioEmilia/)
