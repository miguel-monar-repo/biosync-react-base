# BioSync

**Familia conectada desde el teléfono.**

BioSync convierte el celular de cada persona en un aviso de cuidado familiar: usa los sensores del
teléfono (pasos, ubicación, caídas, inactividad y batería) para saber cómo está y le avisa a su
familia, con voz y vibración, cuando algo no va bien. Sin aparatos extra: solo el teléfono.

- **Sitio:** <https://biosync-react-base.vercel.app>
- **Demo sin registro:** <https://biosync-react-base.vercel.app/demo>
- **Planes:** <https://biosync-react-base.vercel.app/planes>

> Proyecto académico de demostración. No es un servicio comercial en funcionamiento ni un
> dispositivo médico.

---

## Tabla de contenidos

1. [Qué hace](#qué-hace)
2. [Qué no hace](#qué-no-hace)
3. [Planes](#planes)
4. [Páginas de la web](#páginas-de-la-web)
5. [Módulos del proyecto](#módulos-del-proyecto)
6. [Tecnologías](#tecnologías)
7. [Cómo ejecutarlo en local](#cómo-ejecutarlo-en-local)
8. [Despliegue](#despliegue)
9. [Próximos pasos](#próximos-pasos)
10. [Contribuidores](#contribuidores)

---

## Qué hace

### Para las familias

- **Tres perfiles de cuidado**, cada uno con lo que necesita esa etapa de la vida:
  - **Deportivo:** contador de pasos y ruta recorrida por GPS.
  - **Adulto mayor:** detección de caídas, aviso por inactividad, ubicación, batería y una lista de
    medicamentos de ejemplo.
  - **Niño:** ubicación en tiempo real, mensajes a la familia y nivel de batería.
- **Sensores reales del teléfono** (lo marcado como "real" en la app): pasos, ubicación, caídas,
  inactividad y batería. El resto son datos de ejemplo para la demo.
- **Alertas por voz y vibración**, con un aviso que permite responder **"Estoy bien"** o
  **"Necesito ayuda"**.
- **Sincronización familiar (opcional):** con un código de familia, los teléfonos comparten
  mensajes, eventos y ubicaciones en tiempo real.

### En la web

- **Demo pública** con los tres perfiles, sin necesidad de registrarse.
- **Página de planes** con precios y **formulario de compra**: la persona elige su plan y deja su
  correo y celular; el equipo crea su cuenta y le envía la contraseña y el método de pago a ese correo.
- **Ingreso con cuenta:** cada usuario ve en la app **solo el perfil de su plan**.
- **Formulario de contacto** para dudas.
- **Aviso sobre el tratamiento de datos personales.**

### Para el equipo

- **Panel de administración privado** (solo para cuentas con rol admin):
  - mensajes del formulario de contacto,
  - solicitudes de compra, con creación de la cuenta del cliente en un paso,
  - gestión de usuarios: crear, editar y borrar, con su rol y su plan.

### Seguridad básica incluida

- Contraseñas guardadas con hash (`scrypt`), nunca en texto plano.
- Validación de formularios en el navegador **y** en el servidor, con las mismas reglas.
- Campo trampa contra bots y límite de envíos por IP en los formularios y en el ingreso.
- Las claves y la cadena de conexión viven solo en variables de entorno, fuera del código.
- Las rutas de administración de la API exigen sesión y rol de administrador.

---

## Qué no hace

- **No es un dispositivo médico ni reemplaza a los servicios de emergencia.** Ante una emergencia,
  llama al ECU 911.
- **No cobra.** No hay pasarela de pago: el método de pago se envía por correo.
- **No envía correos automáticamente.** La contraseña y el método de pago los envía el equipo.
- **No es una app nativa.** Es una aplicación web: los sensores funcionan mientras la página está
  abierta y dependen del navegador y de los permisos que conceda la persona.
- **No lleva un historial médico.** Los datos de los sensores se usan en el momento. Si la
  sincronización familiar está activada, la ubicación, los mensajes y los eventos se comparten con la
  familia a través de Firebase.
- **No tiene registro abierto.** Las cuentas se crean a partir de una compra o desde el panel del equipo.

---

## Planes

Precios en dólares estadounidenses (USD), la moneda oficial de Ecuador, con pago mensual.

| Plan | Precio | Qué ve en la app |
|---|---|---|
| Deportivo | $3.99 / mes | Perfil Deportivo |
| Niño | $4.99 / mes | Perfil Niño |
| Adulto mayor | $5.99 / mes | Perfil Adulto mayor |
| Familiar | $11.99 / mes | Los tres perfiles |

Los planes y precios están definidos en un solo lugar: [`shared/planes.mjs`](shared/planes.mjs).

---

## Páginas de la web

| Ruta | Qué es | Acceso |
|---|---|---|
| `/` | Portada de la marca, con el formulario de contacto | Público |
| `/demo` | Demo con los tres perfiles | Público |
| `/planes` | Planes y precios | Público |
| `/comprar` | Formulario de compra de un plan | Público |
| `/politica-datos` | Aviso sobre el tratamiento de datos | Público |
| `/login` | Ingreso con correo y contraseña | Público |
| `/app` | La app, con el perfil del plan de cada usuario | Con cuenta |

El panel de administración tiene una ruta privada que no aparece en la web.

---

## Módulos del proyecto

```text
biosync-react-base/
├── client/      Frontend: React + Vite (landing, demo, app, planes, compra, panel)
├── api/         Backend: Express + MongoDB (formularios, login, panel)
├── shared/      Reglas comunes al navegador y al servidor
└── prototype/   Prototipo original en HTML, CSS y JS (referencia)
```

### `client/` — frontend

| Carpeta | Contenido |
|---|---|
| `pages/` | Pantallas completas: portada, demo y app, login, planes, compra, aviso de datos y panel |
| `components/` | Piezas reutilizables: barra superior, aviso de alerta, avisos emergentes (toasts), mapa, tarjeta de batería |
| `components/profiles/` | Los tres perfiles: Deportivo, Adulto mayor y Niño |
| `components/landing/` | Piezas de la portada: teléfono de muestra y formulario de contacto |
| `components/admin/` | Secciones del panel: mensajes, compras, usuarios |
| `hooks/` | Lógica de los sensores: pasos, caídas, ubicación, ruta, batería, audio, mensajes |
| `context/` | Estado compartido: sesión, familia, aviso de alerta y toasts |
| `services/` | Código sin React: API, Firebase, voz y vibración, sensores, `localStorage` |
| `styles/` | Colores y fuentes como variables CSS, y estilos base |

### `api/` — backend

| Archivo | Qué hace |
|---|---|
| `index.js` | La API: formulario de contacto, solicitudes de compra, ingreso y cierre de sesión, y rutas del panel |
| `contrasenas.js` | Hash y verificación de contraseñas con `scrypt` |
| `usuarios.js` | Reglas de los usuarios: correo, rol, plan, contraseña |
| `scripts/crear-usuario.js` | Crea o actualiza un usuario desde la terminal (por ejemplo, el primer admin) |

Rutas públicas de la API:

| Método y ruta | Uso |
|---|---|
| `GET /` | Comprobar que la API está en línea |
| `POST /api/contact` | Enviar el formulario de contacto |
| `POST /api/compras` | Enviar una solicitud de compra |
| `POST /api/login` | Ingresar; devuelve un token de sesión |
| `GET /api/sesion` | Comprobar la sesión |
| `POST /api/logout` | Cerrar la sesión |

Las rutas del panel requieren una sesión con rol de administrador.

### `shared/` — reglas comunes

| Archivo | Qué contiene |
|---|---|
| `validacionContacto.mjs` | Reglas del formulario de contacto (nombre, correo, celular de Ecuador, mensaje) |
| `validacionCompra.mjs` | Reglas del formulario de compra |
| `planes.mjs` | Planes, precios y qué perfiles ve cada uno |

### Datos (MongoDB)

| Colección | Qué guarda |
|---|---|
| `contacts` | Mensajes del formulario de contacto |
| `compras` | Solicitudes de compra de planes |
| `users` | Usuarios: correo, nombre, rol, plan y contraseña con hash |
| `sesiones` | Sesiones abiertas (solo el hash del token) |
| `envios` | Contador temporal para el límite de envíos (se borra solo en una hora) |

---

## Tecnologías

| Parte | Tecnología |
|---|---|
| Frontend | React 19, Vite, React Router |
| Backend | Node.js, Express 5 |
| Base de datos | MongoDB Atlas |
| Tiempo real (familia) | Firebase Firestore (opcional) |
| Despliegue | Vercel (dos proyectos: web y API) |
| Lenguaje | JavaScript (sin TypeScript) |

---

## Cómo ejecutarlo en local

Requisitos: Node.js 22 o superior y una base de datos en MongoDB Atlas.

1. Instala las dependencias:
   ```bash
   cd api && npm install
   cd ../client && npm install
   ```
2. Crea un archivo `.env` en la **raíz** del proyecto (no se sube a Git):
   ```env
   MONGODB_URI=
   MONGODB_DB=biosync
   MONGODB_COLLECTION=contacts
   PORT=4000
   ```
3. Opcional: para sincronizar familias, copia `client/.env.example` como `client/.env` y completa los
   datos de Firebase.
4. Crea el primer usuario administrador:
   ```bash
   cd api
   npm run crear-usuario -- --email tu@correo.com --nombre "Tu nombre" --rol admin
   ```
5. Abre dos terminales:
   ```bash
   cd api && npm run dev       # API en http://localhost:4000
   cd client && npm run dev    # Web en http://localhost:5173
   ```

En local, la web envía las peticiones `/api` a `localhost:4000` a través de Vite.

Comandos útiles en `client/`: `npm run lint` (revisión del código) y `npm run build` (versión para producción).

---

## Despliegue

El mismo repositorio se publica en Vercel como **dos proyectos**:

| Proyecto | Carpeta | Variables de entorno |
|---|---|---|
| Web | `client/` | `VITE_API_URL` (dirección de la API) |
| API | `api/` | `MONGODB_URI`, `MONGODB_DB`, `MONGODB_COLLECTION`, `FRONTEND_URL` (dirección de la web) |

- La rama `main` se publica en producción; las demás ramas generan versiones de prueba (preview).
- Todo cambio llega a `main` por medio de un Pull Request.

---

## Próximos pasos

- **Asistente virtual (chatbot):** un botón flotante en todas las páginas para resolver dudas sobre
  los planes, sus precios y su duración, usando la API de Claude (Anthropic). Está pensado solo para
  orientar a las personas usuarias, no para dar información técnica del sistema.

---

## Contribuidores

| Persona | GitHub |
|---|---|
| Miguel Monar | [miguel-monar-repo](https://github.com/miguel-monar-repo) |
| Paula Morillo | [paulaveronica07-ctrl](https://github.com/paulaveronica07-ctrl) |

BioSync nació de una pregunta: *¿y si el teléfono pudiera avisarle a la familia cuando algo no va bien?*
La idea fue de Miguel y Paula, quienes la convirtieron en BioSync.
