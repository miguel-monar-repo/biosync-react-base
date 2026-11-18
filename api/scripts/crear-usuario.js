// Crea un usuario para entrar a la app (o actualiza su contraseña, nombre y rol si el correo ya existe).
// Normalmente los usuarios se manejan desde el panel de administración; este script sirve para
// crear el primer admin o recuperar el acceso si nadie puede entrar al panel.
//
// Uso (dentro de api/):
//   npm run crear-usuario -- --email correo@ejemplo.com --nombre "Nombre" --rol usuario --plan deportivo
//   npm run crear-usuario -- --email correo@ejemplo.com --nombre "Nombre" --rol admin --generar
//
//   --rol      admin o usuario (por defecto: usuario)
//   --plan     obligatorio para rol usuario: el código de un plan activo de la colección "planes"
//              (por ejemplo deportivo, adulto-mayor, nino o familiar). Los admin no usan plan.
//   --generar  crea una contraseña aleatoria y la muestra una sola vez.
//              Sin --generar, el script te pide escribir la contraseña (mínimo 8 caracteres).
import { createInterface } from 'node:readline/promises'
import { parseArgs } from 'node:util'
import { MongoClient } from 'mongodb'
import { generarContrasena, hashContrasena } from '../contrasenas.js'
import { leerPlanes } from '../planes.js'
import { errorDePlan, MIN_CONTRASENA, validarUsuario } from '../usuarios.js'

const { values } = parseArgs({
  options: {
    email: { type: 'string' },
    nombre: { type: 'string', default: '' },
    rol: { type: 'string', default: 'usuario' },
    plan: { type: 'string', default: '' },
    generar: { type: 'boolean', default: false },
  },
})

function terminar(mensaje) {
  console.error(mensaje)
  process.exit(1)
}

const client = new MongoClient(process.env.MONGODB_URI)
try {
  await client.connect()
  const db = client.db(process.env.MONGODB_DB)

  // Primero se revisan correo, nombre (opcional), rol y plan, con las mismas reglas que el panel.
  // Los planes válidos son los activos de la colección "planes".
  const planes = await leerPlanes(db.collection('planes'))
  const previa = validarUsuario(
    { email: values.email, nombre: values.nombre || undefined, rol: values.rol, plan: values.plan },
    { nuevo: false, planes },
  )
  const errorPlan = errorDePlan(previa.datos)
  if (errorPlan && !previa.errores.plan) previa.errores.plan = `${errorPlan} Usa --plan.`
  if (!values.email || Object.keys(previa.errores).length > 0) {
    terminar(Object.values(previa.errores).join(' ') || 'Falta el correo: --email correo@ejemplo.com')
  }
  const { email } = previa.datos
  const plan = previa.datos.rol === 'admin' ? null : previa.datos.plan

  let contrasena
  if (values.generar) {
    contrasena = generarContrasena()
  } else {
    const rl = createInterface({ input: process.stdin, output: process.stdout })
    contrasena = await rl.question('Contraseña (mínimo 8 caracteres): ')
    rl.close()
  }
  if (contrasena.length < MIN_CONTRASENA) {
    terminar(`La contraseña debe tener al menos ${MIN_CONTRASENA} caracteres.`)
  }

  const usuarios = db.collection('users')
  await usuarios.createIndexes([{ key: { email: 1 }, unique: true }])

  const resultado = await usuarios.updateOne(
    { email },
    {
      $set: {
        nombre: values.nombre.trim() || email.split('@')[0],
        rol: values.rol,
        plan,
        contrasena: await hashContrasena(contrasena),
        actualizadoEn: new Date(),
      },
      $setOnInsert: { email, creadoEn: new Date() },
    },
    { upsert: true },
  )

  console.log(
    resultado.upsertedCount ? 'Usuario creado:' : 'Usuario actualizado:',
    email,
    `(rol: ${values.rol}${plan ? `, plan: ${plan}` : ''})`,
  )
  if (values.generar) {
    console.log('Contraseña generada (guárdala, no se vuelve a mostrar):', contrasena)
  }
} finally {
  await client.close()
}
