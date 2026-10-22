# BioSync

App web que convierte el teléfono en un aviso de cuidado familiar: usa los sensores del
celular (pasos, GPS, caídas, inactividad, batería) y avisa a la familia por voz y vibración.

Estamos migrando el prototipo de `prototype/` (HTML/CSS/JS vanilla) a React.

## Equipo

Dos desarrolladores con unos 4 meses de experiencia en HTML, CSS, JS, Node, Express y MongoDB.
Explica siempre **en español y de forma sencilla**: qué se cambió, por qué y cómo probarlo.

## Stack

| Parte        | Tecnología                         | Estado          |
|--------------|------------------------------------|-----------------|
| Frontend     | React + Vite (JavaScript) en `client/` | Migrado         |
| Backend      | Express en `api/`                  | Más adelante    |
| Tiempo real  | Firebase (Firestore)               | Migrado (opcional, vía `.env`) |
| Deploy       | Vercel                             | Más adelante    |

Comandos (dentro de `client/`): `npm run dev`, `npm run build`, `npm run lint`.

## Estructura de `client/src`

```text
src/
├── main.jsx       punto de entrada, monta <App /> dentro de <BrowserRouter>
├── App.jsx        rutas: "/" → LandingPage, "/app" → DashboardPage
├── pages/         pantallas completas + su CSS (LandingPage, DashboardPage)
├── components/    piezas reutilizables (Icon, AlertBanner, ToastList, Topbar...)
│   ├── profiles/  los 3 perfiles de la demo (Sport, Senior, Kid)
│   └── landing/   piezas de la landing (PhoneMockup)
├── hooks/         lógica de sensores (useStepCounter, useFallDetection, useRealLocation...)
├── context/       estado compartido: Toast, AlertBanner y Family
│                  (XContext.js = contexto + hook useX, XProvider.jsx = componente)
├── services/      código sin React: Firebase, voz/vibración, sensores, localStorage
└── styles/        variables.css (colores y fuentes) y base.css (reset)
```

- Firebase se configura con `client/.env` (copiar `client/.env.example`). Sin `.env`
  la demo funciona igual, pero sin sincronizar entre teléfonos.
- `client/vercel.json` redirige todas las rutas a `index.html` para que `/app` funcione en Vercel.

## Reglas

1. **Migrar primero lo que existe, sin agregar funciones nuevas.** El objetivo es que la
   versión React haga lo mismo que el prototipo.
2. **Mobile first**: los estilos base son para teléfono y se amplían con
   `@media (min-width: ...)`. Colores y fuentes siempre en **variables CSS** (`var(--...)`).
3. **Nada de `innerHTML`, `alert()` ni `onclick` en el HTML.** En React se usa JSX,
   `onClick={...}` y componentes (por ejemplo un Toast o un modal en lugar de `alert`/`prompt`).
4. **JavaScript, no TypeScript.**
5. **Tareas pequeñas**, explicando cada cambio.
6. **Nunca poner claves en el código.** Van en `client/.env` como `VITE_...` y se leen con
   `import.meta.env.VITE_...`. Los `.env` están en `.gitignore`; se puede subir un `.env.example`
   sin valores reales.

## Qué hay en `prototype/` (referencia; ya migrado a `client/`)

### `prototype/app/` — la demo

- `index.html`: barra superior, barras de audio y familia, selector de perfiles y un
  `#dashboard` que se rellena con JS.
- `script.js` (~780 líneas), todo en un archivo:
  - `ICONS`: iconos SVG propios en strings → pasarán a componentes.
  - `state`: datos de los 3 perfiles (`sport`, `senior`, `kid`), mezcla de datos reales y de ejemplo.
  - `renderDashboard()`: dibuja cada perfil con `innerHTML` → serán 3 componentes/páginas.
  - Sensores: podómetro y detección de caídas (`devicemotion`), GPS (`watchPosition`),
    batería (`getBattery`), inactividad (revisión con `setInterval`).
  - Voz (`speechSynthesis`) y vibración (`navigator.vibrate`).
  - Banner de alerta con "Estoy bien" / "Necesito ayuda" y toasts.
  - Sincronización familiar con Firebase compat v10: `families/{código}/messages`, `events`,
    `locations`. Usa `prompt()` para el código de familia (hay que reemplazarlo).
  - `localStorage`: `biosync_family_code`, `biosync_steps_day`, `biosync_steps_count`.
- `styles.css`: variables en `:root` (`--primary: #4E8FFF`, etc.), fuentes Sora / IBM Plex.
  Es **desktop first** (`max-width`), hay que darle la vuelta al migrar.
- Faltan archivos que el HTML pide: `config.js` (configuración de Firebase), `manifest.json`,
  `service-worker.js` e `icons/`. Las rutas `../styles/styles.css` y `../script.js` no coinciden
  con la carpeta.

### `prototype/landing/` — la página de la marca

- `index.html`: navegación, hero con un teléfono de muestra, secciones "Quiénes somos",
  "A qué nos dedicamos" y "Cómo nació", y footer.
- `scrpt.js` (el nombre tiene una errata; el HTML pide `script.js`): cambia los textos del teléfono
  de muestra según el perfil y usa `alert()` en los botones.
- `styles.css`: colores escritos a mano (verde `#2EE6A6`), fuentes Space Grotesk / DM Sans.
  Hay que pasarlos a variables.
