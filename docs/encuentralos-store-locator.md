# Sección "Encuéntralos" (localizador de puntos de venta) — estado y plan

> Documento de trabajo. Recoge el estado de la **demo HTML original**, los
> problemas a resolver para llevarla a **producción en Next.js**, las opciones de
> arquitectura y los datos que faltan por **definir** antes de implementar.
> Pendiente de decisiones de negocio (ver §5). No implementar hasta cerrarlas.

## 1. Qué es

Localizador de puntos de venta sobre mapa interactivo. El usuario indica su
posición (geolocalización del navegador o búsqueda por dirección) y la sección le
muestra los puntos de venta más cercanos, ordenados por distancia, con:

- Lista lateral sincronizada con el mapa (hover/click ↔ marcador activo).
- Marcadores Leaflet + popups con enlace "Cómo llegar" a Google Maps.
- Pin de la ubicación del usuario con animación de pulso.
- Encuadre automático (`fitBounds`) a los más cercanos.

## 2. Estado de la DEMO actual (proyecto HTML `/OneStar/PACOMERLOS`)

Implementación funcional pero pensada como **demostración**, no para producción.

### Piezas

| Capa | Ubicación | Contenido |
|------|-----------|-----------|
| HTML | `index.html:337-370` | Estructura: eyebrow, título, barra (botón geo + input búsqueda), cuerpo `lista + mapa` |
| CSS | `style.css:878-1054` | Sección naranja, grid `340px / 1fr`, ítems de lista, pin de usuario con pulso, responsive (`max-width:767px` apila lista+mapa) |
| JS | `main.js:272-464` | Toda la lógica, en un IIFE autocontenido |
| Libs | `index.html:26-27, 412-413` | Leaflet 1.9.4 + `leaflet-gesture-handling` desde unpkg (CDN) |

### Cómo obtiene los datos (lo más relevante)

**No hay base de datos propia de tiendas.** Los puntos se consultan **en vivo**
desde OpenStreetMap:

- **Overpass API** (`overpass-api.de`): query con `brand=Mercadona` en un radio de
  **30 km** (`RADIUS_M = 30000`) alrededor del usuario (`main.js:337-350`).
- **Nominatim** (`nominatim.openstreetmap.org`): geocoding de la búsqueda por texto,
  `countrycodes=es` (`main.js:445-455`).

### Flujo

```
Usuario
 ├─ [Usar mi ubicación] → navigator.geolocation.getCurrentPosition → (lat,lng)
 └─ [Buscar dirección]  → Nominatim (geocoder OSM, countrycodes=es) → (lat,lng)
                                   │
                                   ▼
                       locateAndRender(lat,lng)
                                   │
                                   ▼
     fetchStores → Overpass: nodes+ways brand=Mercadona (around 30 km)
                                   │
                                   ▼
     renderList → distKm (Haversine) → sort por distancia →
         · marcadores + popups (Leaflet)
         · lista HTML sincronizada (setActive bidireccional)
         · pin de usuario con pulso
         · fitBounds a los 15 más cercanos
         · setActive(más cercano)
```

### Detalles técnicos que se conservan al portar

- **Distancia:** Haversine propia (`distKm`, `main.js:310`), R=6371 km. Válido para
  distancias cortas.
- **Sincronización lista ↔ mapa:** estado compartido `storeMarkers`, `activeId`;
  `setActive()` cambia icono, abre popup, `panTo`, marca ítem y `scrollIntoView`.
- **Iconos:** `divIcon` con HTML inline; el del usuario con doble div + `@keyframes
  enc-pulse`.
- **`invalidateSize`:** a los 300 ms y vía `IntersectionObserver` al entrar en
  viewport — workaround de Leaflet cuando el contenedor no estaba medido al init.
- **Guard de arranque:** `if (!geoBtn || !mapEl || typeof L === 'undefined') return;`
  degrada limpio si no hay Leaflet.
- **Gesture handling:** evita que el scroll de página quede atrapado por el zoom.

## 3. Problemas a resolver para PRODUCCIÓN

### 3.1 Fuente de datos (el problema de fondo)

**Presencia de marca ≠ disponibilidad de producto.** Overpass responde "¿dónde hay
un Mercadona?", pero el cliente pregunta "¿dónde compro un Paquito?". Solo coinciden
si el producto está en el **100 %** de las tiendas de la cadena. Si se vende en un
subconjunto (lanzamiento por fases, tiendas seleccionadas), Overpass devuelve
**falsos positivos** → el cliente va a una tienda sin producto → daño de marca.
Riesgo nº 1.

### 3.2 Dependencia de APIs públicas gratuitas (sin SLA)

- **Overpass** (`overpass-api.de`): rate-limited, se satura, puede devolver
  429/504. Pensado para uso ligero, **no para tráfico de producción**.
- **Nominatim**: su [política de uso](https://operations.osmfoundation.org/policies/nominatim/)
  restringe uso intensivo/comercial, exige `User-Agent`/`Referer` identificable y
  máx. 1 req/s. La demo **no envía User-Agent** → riesgo de bloqueo.

### 3.3 Sin caché ni control de ratio

Cada búsqueda golpea Overpass+Nominatim en directo; las mismas zonas se
re-consultan siempre. Sin debounce en el input.

### 3.4 Integración con Next.js / React

- Leaflet toca `window`/DOM → debe vivir en un **Client Component** (`'use client'`)
  cargado con `next/dynamic` + `ssr:false` (si no, rompe en SSR).
- La demo usa Leaflet imperativo en un IIFE; hay que portarlo a ciclo de vida React
  (`useEffect`, limpieza) o a `react-leaflet`.

### 3.5 Seguridad / robustez menores

- **XSS (bajo):** los textos de OSM se inyectan vía `innerHTML` sin escapar
  (`main.js:368-392`). Con JSX/`textContent` se escapa solo.
- **Permiso denegado:** solo `alert()`; sin fallback (p. ej. foco en el buscador).
- **Radio fijo 30 km:** en zonas rurales puede salir vacío; en ciudad, demasiados
  resultados (solo se limita a 15 para `fitBounds`, no la lista).

## 4. Opciones de arquitectura

Las dos opciones **no compiten en el mismo plano**: una es la *fuente de verdad en
runtime*, la otra incluye de dónde salen las coordenadas. Conviene separar:

> **Runtime (qué consulta el sitio en cada visita)** vs **Origen de coordenadas
> (de dónde salen los lat/lng al poblar los datos, una sola vez)**.

### Opción A — Overpass en vivo, proxeado por Route Handler

Route Handler `/api/stores?lat&lng` que consulta Overpass **server-side** con caché
y `User-Agent` correcto; el cliente nunca habla con Overpass.

- ✅ Cero mantenimiento de datos; escala sola a miles; resuelve CORS/rate-limit/caché.
- ❌ **No resuelve los falsos positivos** (presencia ≠ disponibilidad).
- ❌ Sigue dependiendo de Overpass en runtime (el proxy no evita una caída del upstream).
- ❌ Sin control editorial (no "próximamente", ni destacados, ni notas, ni horarios).
- ❌ ToS de Overpass para uso comercial.

### Opción B — Directus como fuente de verdad (colección curada)

Colección `puntos_venta` en Directus (mismo patrón que `paquitos_data`): nombre,
cadena, dirección, lat, lng, `target`, `status`, etc. Cercanía en el cliente con la
Haversine ya existente.

- ✅ **Exacto:** listas solo las tiendas que **sí** venden.
- ✅ Control editorial total: badges, destacados, "próximamente", horarios, notas.
- ✅ Sin dependencia de terceros en runtime (solo Directus, ya crítico).
- ✅ Encaje perfecto con la arquitectura actual (`target`/`status`, ISR, `queries.ts`).
- ❌ Teclear miles de tiendas a mano es inviable → necesita importación si la escala
  es grande.

### Opción C — Síntesis recomendada: Directus runtime + OSM como semilla (offline)

- **Runtime → siempre Directus** (fuente de verdad, exacto, editorial, fiable).
- **Coordenadas → script de seeding** que consulta Overpass *una vez* (o periódico)
  y **rellena Directus** cuando haya que poblar muchas tiendas de una cadena. Luego
  se poda a disponibilidad real y se enriquece editorialmente.

Esto neutraliza el único punto fuerte de A (cero data-entry) sin heredar su
fragilidad. La búsqueda por texto (geocoding) seguiría usando Nominatim, pero
**proxeada por un Route Handler** con User-Agent y caché.

**Recomendación:** Opción C. Descartar A en runtime por exactitud + ToS + fiabilidad.

## 5. Qué falta por DEFINIR (decisiones de negocio bloqueantes)

Sin estos datos no se puede cerrar el diseño:

1. **Cobertura por cadena:** ¿el producto estará en **todas** las tiendas de cada
   cadena o en un **subconjunto** seleccionado / por fases?
   - Subconjunto → Directus obligatorio (Overpass daría falsos positivos).
   - Todas → Directus sigue siendo la verdad, pero se puede sembrar desde OSM.
2. **Escala (nº de puntos):** decenas / cientos / miles. Determina si la carga es
   manual o necesita importación automatizada.
3. **Cadenas concretas:** ¿qué supermercados? (afecta a etiquetas `brand` en OSM si
   se siembra, y al modelo `cadena` + logos en Directus).
4. **Origen del listado oficial:** ¿la distribuidora dará un CSV/Excel de tiendas?
   Si sí, se importa directo (mejor que OSM). Si no, se siembra desde OSM o se teclea.
5. **Datos por tienda:** ¿qué campos hacen falta? (dirección, horario, "próximamente",
   destacado, nota, teléfono…). Define el esquema de la colección.
6. **Cobertura geográfica:** ¿solo Madrid/España, o más? Afecta a radios y geocoding.

## 6. Esbozo de implementación (cuando se cierre §5)

Pensado para encajar con la arquitectura actual; **no implementado**.

- **Directus:** colección `puntos_venta` (campos según §5.5) con `target` y, si
  procede, `status`, siguiendo el patrón de `paquitos_data`.
- **Tipos:** `src/types/puntos-venta.ts`.
- **Query:** `getPuntosVenta()` en `src/lib/directus/queries.ts` con `targetFilter()`
  (y `statusFilter()` si aplica), ISR.
- **Componente `<StoreLocator>` cliente** (`'use client'`): Leaflet vía
  `next/dynamic` + `ssr:false`, portando `setActive`/`renderList`/Haversine de la
  demo. Estilos a `globals.css`/Tailwind; animación de pulso a `@layer components`.
- **Route Handler `/api/geocode`** (si se mantiene búsqueda por texto): proxy a
  Nominatim con `User-Agent` y caché.
- **(Opcional) Script de seeding** desde Overpass → Directus, si la escala lo exige
  (Opción C). Ejecución puntual/periódica, fuera del runtime.
- **Mejoras de robustez:** debounce en input, escapar datos (JSX lo hace), fallback
  de geolocalización, estados de carga con skeleton.

## 7. Referencias al código de la demo

- `index.html:337-370` — markup de la sección.
- `style.css:878-1054` — estilos.
- `main.js:272-464` — lógica completa del locator (IIFE).
- `main.js:310` — Haversine (`distKm`).
- `main.js:337-350` — query Overpass (`brand=Mercadona`, 30 km).
- `main.js:445-455` — geocoding Nominatim.
