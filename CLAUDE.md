# Proyecto: Web Paco Merlos (Next.js + Directus)

## Backend / CMS

- Directus corriendo en Docker en VPS, con MariaDB propia.
- Expuesto vía Apache (reverse proxy) con SSL (Certbot).
- URL base API: <https://cms.pacomerlos.com>

## Colecciones principales

### carousel_slides

Slides del banner hero. Campos relevantes:

- id, sort, status (draft|published), is_featured (bool)
- title, description, button_function
- img_mobile, img_tablet, img_desktop (UUIDs de assets de Directus)
- title_color_preset (hex predefinido), title_color_custom (hex personalizado validado)
- description_color_preset (hex predefinido), description_color_custom (hex personalizado validado)

Reglas de color (a aplicar en el adaptador del frontend):

- El frontend resuelve el color final con esta prioridad: custom > preset > fallback
- title:       title_color_custom       ?? title_color_preset       ?? "#0F0F0F"
- description: description_color_custom ?? description_color_preset ?? "#0F0F0F"
- El componente nunca recibe null en los colores — el fallback garantiza un valor siempre válido

### paquitos_data

Catálogo de productos. Campos:

- id, name, tagline, image_main (UUID)
- general_description, interior_description, topping_description

## Flujo de aprobación de contenido (draft → published)

1. Equipo crea/edita slide → status = draft
2. Frontend DESARROLLO: filter[status][_in]=draft,published
3. Equipo aprueba → status = published
4. Frontend PRODUCCIÓN: filter[status][_eq]=published

## Lógica de ordenación del carrusel (Next.js)

1º criterio: is_featured (true antes que false)
2º criterio: sort (desempate dentro de cada grupo)

finalOrder = [...featuredSlides, fixedSlide, ...normalSlides]

## Principio arquitectónico

El backend (Directus) devuelve SOLO datos puros: status, sort, is_featured,
textos y UUIDs de imagen. Directus NO indica componente, layout ni
comportamiento visual.

El frontend Next.js es responsable de:

- Transformar UUIDs de Directus en URLs de assets (<https://cms.pacomerlos.com/assets/><uuid>)
- Aplicar la lógica de ordenación (is_featured + sort)
- Seleccionar imagen según breakpoint (mobile/tablet/desktop)
- Decidir el renderizado completo (componentes, estilos, comportamiento)

## Convenciones

- Variables de entorno: NEXT_PUBLIC_DIRECTUS_URL=<https://cms.pacomerlos.com>
- Distinguir entorno dev (draft+published) vs prod (solo published) vía variable de entorno o parámetro de fetch.
