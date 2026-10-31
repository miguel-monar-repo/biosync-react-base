# Formulario de contacto: guía de integración en React

Este documento tiene todo lo necesario para llevar el formulario de contacto (probado en un proyecto aislado con HTML + Express + MongoDB Atlas) a un proyecto de React. Está pensado para que lo lea un agente de código o una persona desarrolladora antes de tocar el proyecto.

**Cómo usarlo:** copia este archivo al proyecto de React (por ejemplo `docs/formulario-contacto.md`) y usa el prompt de la [sección 10](#10-prompt-para-el-agente).

---

## 1. Qué es y qué ya está probado

Un formulario de contacto con:

- Validación en el navegador **y** en el servidor, con las mismas reglas (un solo módulo compartido).
- API `POST /api/contact` en Node.js que guarda en MongoDB Atlas.
- Antispam con campo trampa (honeypot) y límite de 5 envíos por IP por hora.
- Diseño oscuro, mobile first y accesible (labels, `aria-invalid`, `aria-describedby`, teclado, botones de 48 px).

Probado en el proyecto aislado (todo pasó):

| Prueba | Resultado esperado |
|---|---|
| Envío válido `"  Paula Gómez "`, `Prueba@Correo.com`, `300 123 4567` | 201. Se guarda `Paula Gómez`, `prueba@correo.com`, `3001234567`, `atendido: false`, `creadoEn` |
| Envío con todos los campos mal | 400 con `{ errores: { campo: "mensaje" } }` |
| Celular de 9 dígitos directo a la API | 400 `{ errores: { celular: "El celular debe tener 10 dígitos y empezar por 3." } }` |
| Campo `website` con texto | 201 pero **no** se guarda nada |
| Sexto envío en la misma hora desde la misma IP | 429 `{ error: "Has enviado varios mensajes, intenta más tarde" }` |
| Envío vacío en el navegador | No llama a la API, errores bajo cada campo, foco en el primero |
| Sin red | Mensaje arriba del botón y no se borra lo escrito |
| 360 / 768 / 1280 px | Sin scroll horizontal; dos columnas desde 900 px |

---

## 2. Especificación funcional

### Campos (en este orden)

| # | Campo (`name`) | Tipo | Obligatorio | Regla | Limpieza antes de guardar | Mensaje de error | Placeholder |
|---|---|---|---|---|---|---|---|
| 1 | `nombre` | text | Sí | 2 a 60 caracteres; solo letras, espacios, tildes, ü y ñ | `trim()` | Escribe tu nombre (mínimo 2 letras). | Ej.: Paula Gómez |
| 2 | `email` | email | Sí | Formato válido, máximo 120 | `trim()` + minúsculas | Escribe un correo válido, por ejemplo nombre@correo.com. | nombre@correo.com |
| 3 | `celular` | tel | Sí | 10 dígitos que empiezan por 3 (se permiten espacios al escribir) | Se guardan solo los dígitos | El celular debe tener 10 dígitos y empezar por 3. | 300 123 4567 |
| 4 | `planInteres` | select | No | Niño, Adulto mayor, Deportivo, Familiar, Aún no sé | Vacío → `null` | Selecciona un plan de la lista. (solo si llega un valor inventado) | Selecciona un plan |
| 5 | `mensaje` | textarea | Sí | 10 a 1000 caracteres; contador visible `0/1000` | `trim()` | Cuéntanos un poco más (mínimo 10 caracteres). / El mensaje no puede pasar de 1000 caracteres. | — |
| 6 | `consentimiento` | checkbox | Sí | Debe ser `true`. Texto: "Autorizo el tratamiento de mis datos personales" + enlace a la política de datos | — | Necesitamos tu autorización para poder contactarte. | — |
| 7 | `website` | oculto (honeypot) | — | Invisible para personas. Si llega con texto, el servidor responde 201 sin guardar | — | — | — |

No hay campo `apellido`.

### Comportamiento

- Validar cada campo **al salir de él** (`blur`; en checkbox y select, al cambiar) y **al enviar**. Si un campo ya tiene error, se revalida mientras la persona escribe.
- Error debajo del campo, borde rojo, `aria-invalid="true"`.
- Con errores al enviar: **no** llamar a la API y llevar el foco al primer campo con error.
- Mientras envía: botón desactivado, texto "Enviando…" y un spinner pequeño (evita doble envío).
- Éxito: reemplazar el formulario por **"¡Gracias, {nombre}! Recibimos tu mensaje y te contactaremos pronto."** y un botón **"Enviar otro mensaje"** que limpia y vuelve al formulario. El foco va al título de éxito y, al volver, al campo nombre.
- Error de red o del servidor: mostrar arriba del botón **"No pudimos enviar tu mensaje. Revisa tu conexión e inténtalo de nuevo."** sin borrar lo escrito.
- 429: mostrar en el mismo lugar el texto que devuelve el servidor.
- Nunca `alert()`.

### Diseño

- Mobile first: una columna, campos y botón a todo el ancho. Desde 900 px: dos columnas (texto a la izquierda, formulario en una tarjeta a la derecha).
- Tarjeta `#11151E` con bordes redondeados; botón `#2EE6A6` con texto oscuro; campo con foco: borde verde; error: `#FF6B81`.
- Fuentes: **Space Grotesk** (títulos y botón) y **DM Sans** (texto).

---

## 3. Arquitectura

```
Navegador (React)                     Servidor (Node)                  MongoDB Atlas
ContactForm.jsx ──fetch POST────────▶ /api/contact                     db: biosync
   │  usa reglas de                      1. límite 5/IP/hora (429)      colección: contacts
   ▼                                     2. honeypot → 201 sin guardar
validacionContacto.js ◀── mismo ──────  3. validarContacto (400)
                          módulo         4. insertOne (201)  ─────────▶ documento
```

**Regla de oro:** `MONGODB_URI` vive solo en el servidor (archivo `.env`, en `.gitignore`). React nunca habla directo con MongoDB.

### Contrato de la API

`POST /api/contact` con `Content-Type: application/json`

```json
{
  "nombre": "Paula Gómez",
  "email": "paula@correo.com",
  "celular": "300 123 4567",
  "planInteres": "Familiar",
  "mensaje": "Quiero información del plan familiar.",
  "consentimiento": true,
  "website": ""
}
```

| Estado | Cuerpo | Cuándo |
|---|---|---|
| 201 | `{ "mensaje": "Mensaje recibido" }` | Guardado, o honeypot con texto (misma respuesta a propósito) |
| 400 | `{ "errores": { "celular": "..." } }` | Alguna regla falla (solo vienen los campos con error) |
| 429 | `{ "error": "Has enviado varios mensajes, intenta más tarde" }` | Sexto envío de la IP en la última hora |
| 500 | `{ "error": "No se pudo guardar el mensaje" }` | Falla al guardar en MongoDB |

### Documento guardado (colección `contacts`)

```js
{
  _id: ObjectId,
  nombre: "Paula Gómez",
  email: "paula@correo.com",
  celular: "3001234567",
  planInteres: "Familiar",      // o null
  mensaje: "Quiero información del plan familiar.",
  consentimiento: true,
  atendido: false,
  creadoEn: ISODate("2026-10-31T00:34:19.713Z")
}
```

---

## 4. Variables de entorno

```env
# .env del SERVIDOR (nunca del frontend)
MONGODB_URI=mongodb+srv://USUARIO:CONTRASEÑA@cluster0.xxxxx.mongodb.net/
MONGODB_DB=biosync
MONGODB_COLLECTION=contacts
PORT=4000
```

> ⚠️ **En Vite, nunca uses el prefijo `VITE_` para `MONGODB_URI`.** Todo lo que empieza por `VITE_` se mete en el JavaScript que descarga el navegador. Lo mismo en Next.js con `NEXT_PUBLIC_`.

Verifica que `.env` esté en `.gitignore` antes del primer commit.

---

## 5. Código de referencia

### 5.1 Reglas compartidas: `shared/validacionContacto.js`

Versión ES modules (la que usa React y un servidor con `"type": "module"`). Si el proyecto usa TypeScript, conviértelo a `.ts` manteniendo la misma lógica.

```js
// Reglas del formulario de contacto, compartidas por el navegador y el servidor.
// Cada regla recibe el valor tal como llega y devuelve { valor limpio, error }.
export const PLANES = ["Niño", "Adulto mayor", "Deportivo", "Familiar", "Aún no sé"];

const texto = (valor) => (typeof valor === "string" ? valor.normalize("NFC") : "");

export const reglas = {
    nombre(valor) {
        const limpio = texto(valor).trim();
        const ok = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]{2,60}$/.test(limpio);
        return { valor: limpio, error: ok ? null : "Escribe tu nombre (mínimo 2 letras)." };
    },

    email(valor) {
        const limpio = texto(valor).trim().toLowerCase();
        const ok = limpio.length <= 120 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(limpio);
        return {
            valor: limpio,
            error: ok ? null : "Escribe un correo válido, por ejemplo nombre@correo.com.",
        };
    },

    celular(valor) {
        // Se permiten espacios al escribir, pero se guardan solo los dígitos
        const limpio = texto(valor).replace(/\s/g, "");
        const ok = /^3\d{9}$/.test(limpio);
        return { valor: limpio, error: ok ? null : "El celular debe tener 10 dígitos y empezar por 3." };
    },

    planInteres(valor) {
        const limpio = texto(valor).trim();
        if (limpio === "") return { valor: null, error: null };
        return { valor: limpio, error: PLANES.includes(limpio) ? null : "Selecciona un plan de la lista." };
    },

    mensaje(valor) {
        const limpio = texto(valor).trim();
        let error = null;
        if (limpio.length < 10) error = "Cuéntanos un poco más (mínimo 10 caracteres).";
        else if (limpio.length > 1000) error = "El mensaje no puede pasar de 1000 caracteres.";
        return { valor: limpio, error };
    },

    consentimiento(valor) {
        const ok = valor === true;
        return { valor: ok, error: ok ? null : "Necesitamos tu autorización para poder contactarte." };
    },
};

export function validarContacto(datos) {
    const limpios = {};
    const errores = {};
    for (const campo of Object.keys(reglas)) {
        const { valor, error } = reglas[campo](datos ? datos[campo] : undefined);
        limpios[campo] = valor;
        if (error) errores[campo] = error;
    }
    return { datos: limpios, errores, valido: Object.keys(errores).length === 0 };
}
```

### 5.2 Servidor Express: `server/index.js` (variante A)

Requiere `npm install express mongodb`. Express 5.

```js
import express from "express";
import { MongoClient } from "mongodb";
import { validarContacto } from "../shared/validacionContacto.js";

const app = express();
const PORT = process.env.PORT || 4000;

// La cadena de conexión vive solo en el servidor (archivo .env)
const client = new MongoClient(process.env.MONGODB_URI);
let coleccion;

app.use(express.json());

// Si en producción el servidor queda detrás de un proxy (Nginx, Render, Railway...),
// activa esto para que req.ip sea la IP real y el límite por IP funcione:
// app.set("trust proxy", 1);

// Máximo 5 envíos por IP cada hora. Se guarda en memoria, así que se reinicia con el servidor.
const LIMITE_ENVIOS = 5;
const VENTANA_MS = 60 * 60 * 1000;
const enviosPorIp = new Map();

function limitarEnvios(req, res, next) {
    const ahora = Date.now();
    const recientes = (enviosPorIp.get(req.ip) || []).filter((t) => ahora - t < VENTANA_MS);

    if (recientes.length >= LIMITE_ENVIOS) {
        enviosPorIp.set(req.ip, recientes);
        return res.status(429).json({ error: "Has enviado varios mensajes, intenta más tarde" });
    }

    recientes.push(ahora);
    enviosPorIp.set(req.ip, recientes);
    next();
}

app.post("/api/contact", limitarEnvios, async (req, res) => {
    const cuerpo = req.body || {};

    // Campo trampa: si un bot lo llenó, respondemos como si todo saliera bien pero no guardamos
    if (cuerpo.website) {
        return res.status(201).json({ mensaje: "Mensaje recibido" });
    }

    const { datos, errores, valido } = validarContacto(cuerpo);
    if (!valido) {
        return res.status(400).json({ errores });
    }

    try {
        await coleccion.insertOne({ ...datos, atendido: false, creadoEn: new Date() });
        res.status(201).json({ mensaje: "Mensaje recibido" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "No se pudo guardar el mensaje" });
    }
});

async function iniciar() {
    await client.connect();
    coleccion = client.db(process.env.MONGODB_DB).collection(process.env.MONGODB_COLLECTION || "contacts");
    console.log("Conectado a MongoDB");

    app.listen(PORT, (error) => {
        if (error) throw error; // por ejemplo, el puerto ya está en uso
        console.log(`API en http://localhost:${PORT}`);
    });
}

iniciar().catch((error) => {
    console.error("Error al conectar a MongoDB:", error);
    process.exit(1);
});
```

### 5.3 Componente React: `src/components/ContactSection/ContactSection.jsx`

Incluye el texto de la izquierda y la tarjeta con el formulario. Los `id` se generan con `useId()` para que no choquen con otros de la landing.

```jsx
import { useEffect, useId, useRef, useState } from "react";
import { reglas, PLANES } from "../../../shared/validacionContacto.js"; // ajustar ruta
import "./ContactSection.css";

const CAMPOS = ["nombre", "email", "celular", "planInteres", "mensaje", "consentimiento"];
const ERROR_ENVIO = "No pudimos enviar tu mensaje. Revisa tu conexión e inténtalo de nuevo.";
const VALORES_INICIALES = {
    nombre: "",
    email: "",
    celular: "",
    planInteres: "",
    mensaje: "",
    consentimiento: false,
    website: "",
};

export default function ContactSection({
    titulo = "Hablemos",
    texto = "¿Tienes dudas sobre nuestros planes? Déjanos tus datos y un mensaje, y te contactaremos pronto.",
    politicaUrl = "/politica-datos",
    apiUrl = "/api/contact",
}) {
    const id = useId();
    const [valores, setValores] = useState(VALORES_INICIALES);
    const [errores, setErrores] = useState({});
    const [errorGeneral, setErrorGeneral] = useState("");
    const [enviando, setEnviando] = useState(false);
    const [nombreEnviado, setNombreEnviado] = useState(null);

    const campoRefs = useRef({});
    const exitoRef = useRef(null);
    const volviendo = useRef(false);

    // Foco al título de éxito, o al nombre al volver con "Enviar otro mensaje"
    useEffect(() => {
        if (nombreEnviado) {
            exitoRef.current?.focus();
        } else if (volviendo.current) {
            volviendo.current = false;
            campoRefs.current.nombre?.focus();
        }
    }, [nombreEnviado]);

    function validarCampo(campo, valor) {
        const { error } = reglas[campo](valor);
        setErrores((prev) => ({ ...prev, [campo]: error }));
        return error;
    }

    function manejarCambio(e) {
        const { name, type, value, checked, tagName } = e.target;
        const valor = type === "checkbox" ? checked : value;
        setValores((prev) => ({ ...prev, [name]: valor }));

        if (name === "website") return;
        // Checkbox y select se validan al cambiar; el resto, solo si ya tenían error
        if (type === "checkbox" || tagName === "SELECT" || errores[name]) {
            validarCampo(name, valor);
        }
    }

    function manejarBlur(e) {
        const { name, type, tagName } = e.target;
        if (type === "checkbox" || tagName === "SELECT") return;
        validarCampo(name, valores[name]);
    }

    function enfocarPrimerError(lista) {
        const primero = CAMPOS.find((campo) => lista[campo]);
        if (primero) campoRefs.current[primero]?.focus();
    }

    async function manejarEnvio(e) {
        e.preventDefault();
        if (enviando) return;
        setErrorGeneral("");

        const nuevos = {};
        for (const campo of CAMPOS) {
            const { error } = reglas[campo](valores[campo]);
            if (error) nuevos[campo] = error;
        }
        setErrores(nuevos);
        if (Object.keys(nuevos).length > 0) {
            enfocarPrimerError(nuevos);
            return;
        }

        setEnviando(true);
        try {
            const respuesta = await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(valores),
            });
            const resultado = await respuesta.json().catch(() => ({}));

            if (respuesta.status === 201) {
                setNombreEnviado(reglas.nombre(valores.nombre).valor);
            } else if (respuesta.status === 400 && resultado.errores) {
                setErrores(resultado.errores);
                enfocarPrimerError(resultado.errores);
            } else if (respuesta.status === 429 && resultado.error) {
                setErrorGeneral(resultado.error);
            } else {
                setErrorGeneral(ERROR_ENVIO);
            }
        } catch {
            setErrorGeneral(ERROR_ENVIO);
        } finally {
            setEnviando(false);
        }
    }

    function enviarOtro() {
        volviendo.current = true;
        setValores(VALORES_INICIALES);
        setErrores({});
        setErrorGeneral("");
        setNombreEnviado(null);
    }

    // Props comunes de cada campo: id, ref, eventos y atributos de accesibilidad
    const props = (campo) => ({
        id: `${id}-${campo}`,
        name: campo,
        ref: (el) => {
            campoRefs.current[campo] = el; // sin return: en React 19 lo que devuelve un ref callback es su limpieza
        },
        onChange: manejarCambio,
        onBlur: manejarBlur,
        "aria-invalid": errores[campo] ? "true" : undefined,
        "aria-describedby": `${id}-error-${campo}`,
    });

    const error = (campo) => (
        <p className="campo-error" id={`${id}-error-${campo}`}>
            {errores[campo]}
        </p>
    );

    return (
        <section className="seccion-contacto">
            <div className="contacto">
                <div className="contacto-intro">
                    <h2 className="contacto-titulo">{titulo}</h2>
                    <p>{texto}</p>
                </div>

                <div className="tarjeta">
                    {nombreEnviado ? (
                        <div className="exito">
                            <h3 ref={exitoRef} tabIndex={-1}>¡Gracias, {nombreEnviado}!</h3>
                            <p>Recibimos tu mensaje y te contactaremos pronto.</p>
                            <button type="button" className="boton" onClick={enviarOtro}>
                                Enviar otro mensaje
                            </button>
                        </div>
                    ) : (
                        <>
                            <h3>Escríbenos</h3>
                            <form onSubmit={manejarEnvio} noValidate>
                                <div className="campo">
                                    <label htmlFor={`${id}-nombre`}>Nombre</label>
                                    <input {...props("nombre")} type="text" autoComplete="name"
                                        placeholder="Ej.: Paula Gómez" maxLength={60} required
                                        value={valores.nombre} />
                                    {error("nombre")}
                                </div>

                                <div className="campo">
                                    <label htmlFor={`${id}-email`}>Correo</label>
                                    <input {...props("email")} type="email" autoComplete="email"
                                        placeholder="nombre@correo.com" maxLength={120} required
                                        value={valores.email} />
                                    {error("email")}
                                </div>

                                <div className="campo">
                                    <label htmlFor={`${id}-celular`}>Celular</label>
                                    <input {...props("celular")} type="tel" autoComplete="tel-national"
                                        inputMode="numeric" placeholder="300 123 4567" maxLength={14} required
                                        value={valores.celular} />
                                    {error("celular")}
                                </div>

                                <div className="campo">
                                    <label htmlFor={`${id}-planInteres`}>
                                        Plan de interés <span className="opcional">(opcional)</span>
                                    </label>
                                    <select {...props("planInteres")} value={valores.planInteres}>
                                        <option value="">Selecciona un plan</option>
                                        {PLANES.map((plan) => (
                                            <option key={plan}>{plan}</option>
                                        ))}
                                    </select>
                                    {error("planInteres")}
                                </div>

                                <div className="campo">
                                    <label htmlFor={`${id}-mensaje`}>Mensaje</label>
                                    <textarea {...props("mensaje")} rows={5} maxLength={1000} required
                                        aria-describedby={`${id}-error-mensaje ${id}-contador`}
                                        value={valores.mensaje} />
                                    <div className="campo-pie">
                                        {error("mensaje")}
                                        <span className="contador" id={`${id}-contador`}>
                                            {valores.mensaje.length}/1000
                                        </span>
                                    </div>
                                </div>

                                <div className="campo">
                                    <div className="check">
                                        <input {...props("consentimiento")} type="checkbox" required
                                            checked={valores.consentimiento} />
                                        <label htmlFor={`${id}-consentimiento`}>
                                            Autorizo el tratamiento de mis datos personales (
                                            <a href={politicaUrl} target="_blank" rel="noopener noreferrer">
                                                ver política de datos
                                            </a>
                                            )
                                        </label>
                                    </div>
                                    {error("consentimiento")}
                                </div>

                                {/* Campo trampa antispam: las personas no lo ven; si llega con texto, es un bot */}
                                <div className="trampa" aria-hidden="true">
                                    <label htmlFor={`${id}-website`}>Deja este campo vacío</label>
                                    <input id={`${id}-website`} name="website" type="text" tabIndex={-1}
                                        autoComplete="off" value={valores.website} onChange={manejarCambio} />
                                </div>

                                {errorGeneral && (
                                    <p className="error-general" role="alert">{errorGeneral}</p>
                                )}

                                <button type="submit" className={`boton${enviando ? " enviando" : ""}`}
                                    disabled={enviando}>
                                    <span className="spinner" aria-hidden="true" />
                                    <span>{enviando ? "Enviando…" : "Enviar mensaje"}</span>
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}
```

Notas del componente:

- Los títulos son `h2` y `h3` porque dentro de una landing el `h1` suele ser el del hero. Ajusta según la jerarquía de la página.
- `role="alert"` en el error general hace que los lectores de pantalla lo anuncien.
- Si el proyecto usa TypeScript: tipa `valores` con una interfaz `ContactoValores` y las reglas como `Record<Campo, (valor: unknown) => { valor: unknown; error: string | null }>`.

### 5.4 Estilos: `src/components/ContactSection/ContactSection.css`

Todo va dentro de `.seccion-contacto` para no afectar al resto de la landing. Si el proyecto usa CSS Modules, Tailwind o styled-components, tradúcelo a ese sistema manteniendo los valores. Si la landing ya define estos colores como variables, reutilízalas.

```css
.seccion-contacto {
    --fondo: #0a0d14;
    --tarjeta: #11151e;
    --tarjeta-borde: #1f2633;
    --campo: #0b0f17;
    --campo-borde: #2a3242;
    --texto: #e8ecf3;
    --texto-suave: #9aa4b5;
    --placeholder: #6b7588;
    --verde: #2ee6a6;
    --verde-hover: #5bedba;
    --texto-sobre-verde: #06110c;
    --error: #ff6b81;
    --error-fondo: rgba(255, 107, 129, 0.1);

    background: var(--fondo);
    color: var(--texto);
    font-family: "DM Sans", system-ui, sans-serif;
    line-height: 1.5;
}

.seccion-contacto *,
.seccion-contacto *::before,
.seccion-contacto *::after {
    box-sizing: border-box;
}

.seccion-contacto h2,
.seccion-contacto h3 {
    font-family: "Space Grotesk", system-ui, sans-serif;
    line-height: 1.15;
    margin: 0 0 0.5em;
}

.seccion-contacto a {
    color: var(--verde);
}

/* ---------- Layout (mobile first: una columna) ---------- */

.seccion-contacto .contacto {
    max-width: 1120px;
    margin: 0 auto;
    padding: 40px 16px;
    display: grid;
    gap: 32px;
}

.seccion-contacto .contacto-titulo {
    font-size: clamp(2.25rem, 8vw, 3.5rem);
}

.seccion-contacto .contacto-intro p {
    color: var(--texto-suave);
    font-size: 1.125rem;
    max-width: 44ch;
    margin: 0;
}

.seccion-contacto .tarjeta {
    background: var(--tarjeta);
    border: 1px solid var(--tarjeta-borde);
    border-radius: 20px;
    padding: 24px 16px;
}

.seccion-contacto .tarjeta h3 {
    font-size: 1.5rem;
}

@media (min-width: 600px) {
    .seccion-contacto .tarjeta {
        padding: 32px;
    }
}

/* Escritorio: texto a la izquierda, formulario a la derecha */
@media (min-width: 900px) {
    .seccion-contacto .contacto {
        grid-template-columns: 1fr 1.15fr;
        align-items: start;
        gap: 64px;
        padding: 96px 32px;
    }

    .seccion-contacto .contacto-intro {
        position: sticky;
        top: 96px;
    }
}

/* ---------- Campos ---------- */

.seccion-contacto .campo {
    margin-bottom: 20px;
}

.seccion-contacto .campo label {
    display: block;
    font-weight: 500;
    margin-bottom: 6px;
}

.seccion-contacto .opcional {
    color: var(--texto-suave);
    font-weight: 400;
}

.seccion-contacto .campo input[type="text"],
.seccion-contacto .campo input[type="email"],
.seccion-contacto .campo input[type="tel"],
.seccion-contacto .campo select,
.seccion-contacto .campo textarea {
    width: 100%;
    min-height: 48px;
    padding: 12px 14px;
    background: var(--campo);
    color: var(--texto);
    border: 1.5px solid var(--campo-borde);
    border-radius: 10px;
    font: inherit;
}

.seccion-contacto .campo textarea {
    min-height: 140px;
    resize: vertical;
}

.seccion-contacto .campo select {
    appearance: none;
    padding-right: 40px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%239aa4b5' stroke-width='2' fill='none'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
}

.seccion-contacto .campo select option {
    background: var(--tarjeta);
    color: var(--texto);
}

.seccion-contacto .campo ::placeholder {
    color: var(--placeholder);
}

.seccion-contacto .campo input:focus,
.seccion-contacto .campo select:focus,
.seccion-contacto .campo textarea:focus {
    outline: none;
    border-color: var(--verde);
    box-shadow: 0 0 0 3px rgba(46, 230, 166, 0.2);
}

/* Debe ir DESPUÉS de las reglas anteriores y con :is() para ganar en especificidad */
.seccion-contacto .campo :is(input, select, textarea)[aria-invalid="true"] {
    border-color: var(--error);
}

.seccion-contacto .campo-error {
    color: var(--error);
    font-size: 0.875rem;
    margin: 6px 0 0;
}

.seccion-contacto .campo-error:empty {
    display: none;
}

.seccion-contacto .campo-pie {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
}

.seccion-contacto .contador {
    margin: 6px 0 0 auto;
    color: var(--texto-suave);
    font-size: 0.875rem;
    white-space: nowrap;
}

/* ---------- Casilla de autorización ---------- */

.seccion-contacto .check {
    display: flex;
    align-items: flex-start;
    gap: 12px;
}

.seccion-contacto .check input[type="checkbox"] {
    flex-shrink: 0;
    width: 22px;
    height: 22px;
    margin: 12px 0 0;
    accent-color: var(--verde);
    cursor: pointer;
}

.seccion-contacto .campo .check label {
    font-weight: 400;
    margin: 0;
    padding: 10px 0;
    min-height: 44px;
    cursor: pointer;
}

.seccion-contacto .check input[aria-invalid="true"] {
    outline: 2px solid var(--error);
    outline-offset: 2px;
}

.seccion-contacto .check input:focus-visible {
    outline: 2px solid var(--verde);
    outline-offset: 2px;
}

/* Campo trampa: fuera de la pantalla, invisible para personas */
.seccion-contacto .trampa {
    position: absolute;
    left: -10000px;
    width: 1px;
    height: 1px;
    overflow: hidden;
}

/* ---------- Mensajes y botón ---------- */

.seccion-contacto .error-general {
    background: var(--error-fondo);
    border: 1px solid var(--error);
    color: #ffd0d7;
    padding: 12px 14px;
    border-radius: 10px;
    margin: 0 0 16px;
}

.seccion-contacto .boton {
    width: 100%;
    min-height: 48px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 12px 24px;
    background: var(--verde);
    color: var(--texto-sobre-verde);
    border: 0;
    border-radius: 12px;
    font-family: "Space Grotesk", system-ui, sans-serif;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
}

.seccion-contacto .boton:hover {
    background: var(--verde-hover);
}

.seccion-contacto .boton:focus-visible {
    outline: 3px solid var(--texto);
    outline-offset: 3px;
}

.seccion-contacto .boton:disabled {
    opacity: 0.75;
    cursor: progress;
}

.seccion-contacto .spinner {
    display: none;
    width: 16px;
    height: 16px;
    border: 2px solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    animation: girar-contacto 0.7s linear infinite;
}

.seccion-contacto .boton.enviando .spinner {
    display: inline-block;
}

@keyframes girar-contacto {
    to {
        transform: rotate(360deg);
    }
}

@media (prefers-reduced-motion: reduce) {
    .seccion-contacto .spinner {
        animation-duration: 2s;
    }
}

.seccion-contacto .exito h3:focus {
    outline: none;
}

.seccion-contacto .exito p {
    color: var(--texto-suave);
    margin: 0 0 24px;
}
```

**Fuentes:** si la landing todavía no carga Space Grotesk y DM Sans, agrega esto en el `<head>` de `index.html` (Vite) o con `next/font` (Next.js):

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
```

---

## 6. Cómo encajarlo según el tipo de proyecto

Lo primero es identificar qué tipo de proyecto de React es (mirar `package.json`).

### Variante A: Vite (o Create React App), sin backend propio

Estructura sugerida:

```
mi-app/
├── .env                      ← MONGODB_URI etc. (sin prefijo VITE_)
├── server/index.js           ← sección 5.2
├── shared/validacionContacto.js  ← sección 5.1
└── src/components/ContactSection/
    ├── ContactSection.jsx    ← sección 5.3
    └── ContactSection.css    ← sección 5.4
```

1. `npm install express mongodb`
2. En `vite.config.js`, el proxy hace que `fetch("/api/contact")` llegue a Express durante el desarrollo:
   ```js
   export default defineConfig({
       plugins: [react()],
       server: {
           proxy: { "/api": "http://localhost:4000" },
       },
   });
   ```
3. Scripts en `package.json` (Vite crea el proyecto con `"type": "module"`, por eso el servidor usa `import`):
   ```json
   "dev:api": "node --watch --env-file=.env server/index.js"
   ```
   Se corren dos terminales: `npm run dev` (Vite) y `npm run dev:api` (API). Opcional: `concurrently` para una sola.
4. Usar el componente: `<ContactSection politicaUrl="/politica-datos" />` donde va la sección de contacto.
5. Producción: la API debe vivir en algún servidor de Node (Render, Railway, VPS...). Si el frontend queda en otro dominio, pasa `apiUrl="https://tu-api.com/api/contact"` y configura CORS en Express solo para el dominio del frontend.

### Variante B: Next.js (App Router)

No hace falta Express; la API es un Route Handler y `.env.local` nunca llega al navegador (salvo variables `NEXT_PUBLIC_`).

`app/api/contact/route.js`:

```js
import { MongoClient } from "mongodb";
import { validarContacto } from "@/shared/validacionContacto";

// Reutilizar la conexión entre peticiones (y entre recargas en desarrollo)
const clientPromise = globalThis._mongoClientPromise ??= new MongoClient(process.env.MONGODB_URI).connect();

export async function POST(request) {
    const cuerpo = await request.json().catch(() => ({}));

    if (cuerpo.website) {
        return Response.json({ mensaje: "Mensaje recibido" }, { status: 201 });
    }

    const { datos, errores, valido } = validarContacto(cuerpo);
    if (!valido) {
        return Response.json({ errores }, { status: 400 });
    }

    try {
        const client = await clientPromise;
        await client
            .db(process.env.MONGODB_DB)
            .collection(process.env.MONGODB_COLLECTION || "contacts")
            .insertOne({ ...datos, atendido: false, creadoEn: new Date() });
        return Response.json({ mensaje: "Mensaje recibido" }, { status: 201 });
    } catch (error) {
        console.error(error);
        return Response.json({ error: "No se pudo guardar el mensaje" }, { status: 500 });
    }
}
```

- El componente necesita `"use client";` en la primera línea.
- **Límite por IP:** en Vercel (serverless) un `Map` en memoria **no sirve**, porque cada invocación puede ser otra instancia. Opciones: Upstash Ratelimit, o una colección `envios` en MongoDB con índice TTL de 1 hora (`createIndex({ creadoEn: 1 }, { expireAfterSeconds: 3600 })`) contando `countDocuments({ ip })` antes de guardar. La IP sale de `request.headers.get("x-forwarded-for")?.split(",")[0]`.

---

## 7. MongoDB Atlas

- Base: `biosync`. Colección: `contacts` (se crea sola con el primer `insertOne`).
- **Network Access:** la IP del servidor debe estar permitida. En desarrollo, "Add Current IP Address"; en producción, la IP del hosting (o `0.0.0.0/0` si el hosting no tiene IP fija, con una contraseña fuerte).
- **Database Access:** usuario con rol "Read and write to any database" (o solo a `biosync`).
- **No** crear índice único en `email`: una misma persona puede escribir varias veces.
- Validador opcional para `contacts` (pestaña *Validation* en Atlas), que coincide con lo que guarda el servidor:

```json
{
  "$jsonSchema": {
    "bsonType": "object",
    "required": ["nombre", "email", "celular", "mensaje", "consentimiento", "atendido", "creadoEn"],
    "additionalProperties": false,
    "properties": {
      "_id": { "bsonType": "objectId" },
      "nombre": { "bsonType": "string", "minLength": 2, "maxLength": 60 },
      "email": { "bsonType": "string", "maxLength": 120, "pattern": "^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$" },
      "celular": { "bsonType": "string", "pattern": "^3[0-9]{9}$" },
      "planInteres": { "enum": ["Niño", "Adulto mayor", "Deportivo", "Familiar", "Aún no sé", null] },
      "mensaje": { "bsonType": "string", "minLength": 10, "maxLength": 1000 },
      "consentimiento": { "enum": [true] },
      "atendido": { "bsonType": "bool" },
      "creadoEn": { "bsonType": "date" }
    }
  }
}
```

---

## 8. Problemas que ya aparecieron y cómo se resolvieron

| Síntoma | Causa | Solución |
|---|---|---|
| `SSL routines ... tlsv1 alert internal error ... SSL alert number 80` y `ReplicaSetNoPrimary` | La IP no está permitida en Atlas | Atlas → Security → **Network Access** → Add Current IP Address |
| `MongoServerError: bad auth : Authentication failed` | Usuario o contraseña no coinciden con Atlas | Atlas → Security → **Database Access** → Edit Password; actualizar `.env` y reiniciar |
| `npm.ps1 no se puede cargar ... la ejecución de scripts está deshabilitada` | Política de ejecución de PowerShell | Usar `npm.cmd run dev`, o `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`, o una terminal cmd/Git Bash |
| El formulario responde **401** o 404 aunque el servidor funciona | La página se abrió con **Live Preview** de VS Code, que ocupa el puerto 3000 en 127.0.0.1 y recibe el `fetch` | Abrir la URL del servidor de desarrollo (Vite o Express), no Live Preview; usar otro puerto para la API (4000) |
| El servidor dice "Servidor en…" pero no responde | En Express 5, `app.listen` llama al callback **también con error** (p. ej. puerto ocupado) | `app.listen(PORT, (error) => { if (error) throw error; ... })` |
| Los inputs con error no muestran borde rojo, pero el textarea sí | `.campo input[type="text"]` le gana en especificidad a `.campo [aria-invalid="true"]` | Usar `.campo :is(input, select, textarea)[aria-invalid="true"]` y declararlo después del `:focus` |
| Un nombre con tilde falla al probar con `curl` en Git Bash (Windows) | curl envía el texto en la codificación de la consola, no en UTF-8 | Probar con `fetch` desde Node o con Postman/Thunder Client |
| Cambié el `.env` y no pasa nada | `--env-file` solo se lee al arrancar | Detener (Ctrl+C) y volver a arrancar |
| El límite de 5 envíos "no se reinicia" en pruebas | El `Map` vive en memoria del proceso | Reiniciar el servidor de la API |

---

## 9. Checklist de pruebas después de integrar

API (con Node, no con curl en Windows):

```js
// node probar-api.mjs   (con la API corriendo en el puerto 4000; .mjs permite el await de nivel superior)
const enviar = (datos) =>
    fetch("http://localhost:4000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
    }).then(async (r) => console.log(r.status, await r.text()));

const valido = {
    nombre: "  Paula Gómez ", email: "Prueba@Correo.com", celular: "300 123 4567",
    planInteres: "Familiar", mensaje: "Hola, quiero información del plan familiar.",
    consentimiento: true, website: "",
};

await enviar(valido);                                   // 201
await enviar({ nombre: "P", email: "malo", celular: "123", mensaje: "corto", consentimiento: false }); // 400
await enviar({ ...valido, celular: "300123456" });      // 400 solo celular
await enviar({ ...valido, website: "http://spam.com" }); // 201 y no se guarda
await enviar({});                                       // 400 (5.º envío)
await enviar({});                                       // 429 (6.º envío)
```

Después: revisar en Atlas que exista **un solo** documento nuevo (el válido) con `celular: "3001234567"`, email en minúsculas, `atendido: false` y `creadoEn`, y borrarlo.

Navegador:

- [ ] Enviar vacío → errores bajo cada campo, bordes rojos, foco en Nombre, sin petición en la pestaña Network.
- [ ] Escribir en Mensaje → el contador cambia (`11/1000`).
- [ ] Celular `300 123 456` y salir del campo → error.
- [ ] Envío válido → "Enviando…" con spinner, luego "¡Gracias, {nombre}!"; "Enviar otro mensaje" limpia y enfoca Nombre.
- [ ] Apagar la API y enviar → mensaje de error arriba del botón, lo escrito se conserva.
- [ ] Solo con teclado (Tab, Espacio en la casilla, Enter para enviar) se completa el flujo.
- [ ] DevTools a 360, 768 y 1280 px → sin scroll horizontal; dos columnas desde 900 px.

---

## 10. Prompt para el agente

Pega esto en Claude Code, en la ventana del proyecto de React, después de copiar este archivo a `docs/formulario-contacto.md`:

```
Lee completo docs/formulario-contacto.md. Es un formulario de contacto ya probado
en un proyecto aislado (HTML + Express + MongoDB Atlas) que quiero integrar en este
proyecto de React.

Antes de cambiar nada:
1. Revisa este proyecto: framework (Vite, CRA o Next.js), JavaScript o TypeScript,
   si ya hay backend, cómo maneja estilos (CSS, CSS Modules, Tailwind...), cómo carga
   fuentes y variables de entorno, y dónde va la sección de contacto en la landing.
2. Dime en pocas líneas qué variante de la sección 6 aplica, qué archivos vas a
   crear o tocar, y qué adaptarías del código de referencia para que encaje con el
   estilo del proyecto.
3. Espera mi confirmación.

Después de confirmar: implementa respetando la especificación de la sección 2 tal
cual (textos, reglas, comportamiento), nunca expongas MONGODB_URI al cliente, verifica
que .env esté en .gitignore y ejecuta las pruebas de la sección 9. Al final dime qué
cambiaste y cómo probarlo yo.
```
