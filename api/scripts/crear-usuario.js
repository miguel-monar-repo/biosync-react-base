// Crea un usuario para entrar a la app (o actualiza su contraseña, nombre y rol si el correo ya existe).
// No hay pantalla de registro: los usuarios se crean solo con este script.
//
// Uso (dentro de api/):
//   npm run crear-usuario -- --email correo@ejemplo.com --nombre "Nombre" --rol usuario
//   npm run crear-usuario -- --email correo@ejemplo.com --nombre "Nombre" --rol admin --generar
//
//   --rol      admin o usuario (por defecto: usuario)
//   --generar  crea una contraseña aleatoria y la muestra una sola vez.
//              Sin --generar, el script te pide escribir la contraseña (mínimo 8 caracteres).
import { createInterface } from 'node:readline/promises'
import { parseArgs } from 'node:util'
import { MongoClient } from 'mongodb'
import { reglas } from '../../shared/validacionContacto.mjs'
import { generarContrasena, hashContrasena } from '../contrasenas.js'

const ROLES = ['admin', 'usuario']

const { values } = parseArgs({
  options: {
    email: { type: 'string' },
    nombre: { type: 'string', default: '' },
    rol: { type: 'string', default: 'usuario' },
    generar: { type: 'boolean', default: false },
  },
})

function terminar(mensaje) {
  console.error(mensaje)
  process.exit(1)
}

// Se reutiliza la regla del correo del formulario de contacto
const { valor: email, error } = reglas.email(values.email)
if (!values.email || error) terminar('Falta un correo válido: --email correo@ejemplo.com')
if (!ROLES.includes(values.rol)) terminar(`El rol debe ser: ${ROLES.join(' o ')}`)

let contrasena
if (values.generar) {
  contrasena = generarContrasena()
} else {
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  contrasena = await rl.question('Contraseña (mínimo 8 caracteres): ')
  rl.close()
}
if (contrasena.length < 8) terminar('La contraseña debe tener al menos 8 caracteres.')

const client = new MongoClient(process.env.MONGODB_URI)
try {
  await client.connect()
  const usuarios = client.db(process.env.MONGODB_DB).collection('users')
  await usuarios.createIndexes([{ key: { email: 1 }, unique: true }])

  const resultado = await usuarios.updateOne(
    { email },
    {
      $set: {
        nombre: values.nombre.trim() || email.split('@')[0],
        rol: values.rol,
        contrasena: await hashContrasena(contrasena),
        actualizadoEn: new Date(),
      },
      $setOnInsert: { email, creadoEn: new Date() },
    },
    { upsert: true },
  )

  console.log(resultado.upsertedCount ? 'Usuario creado:' : 'Usuario actualizado:', email, `(rol: ${values.rol})`)
  if (values.generar) {
    console.log('Contraseña generada (guárdala, no se vuelve a mostrar):', contrasena)
  }
} finally {
  await client.close()
}
