import mongoose from 'mongoose'
import contactRepository from './src/repositories/contact.repository.js'
import conversationRepository from './src/repositories/conversation.repository.js'
import conversationMemberRepository from './src/repositories/conversationMember.repository.js'
import messageRepository from './src/repositories/message.repository.js'
import userRepository from './src/repositories/user.repository.js'
import ENVIRONMENT from "./src/config/environment.config.js";


const MONGO_URI = ENVIRONMENT.MONGO_DB_CONNECTION_STRING + '/whatsapp_clone_test'
async function main() {
  await mongoose.connect(MONGO_URI)
  console.log('Conectado a Mongo\n')


  // Usuarios falsos: Mongo no valida que las refs existan
  const userA = new mongoose.Types.ObjectId()
  const userB = new mongoose.Types.ObjectId()

  // 1. Crear conversacion
  const conversation = await conversationRepository.create({
    type: 'group',
    name: 'Grupo de prueba',
    fk_created_by: userA
  })
  console.log('1. Conversacion creada:', conversation._id.toString())

  // 2. Agregar miembros
  await conversationMemberRepository.addMember(conversation._id, userA, 'admin')
  await conversationMemberRepository.addMember(conversation._id, userB)
  const members = await conversationMemberRepository.findMembers(conversation._id)
  console.log('2. Miembros activos:', members.length) // esperado: 2

  // 3. isMember
  const esMiembro = await conversationMemberRepository.isMember(conversation._id, userB)
  console.log('3. userB es miembro:', esMiembro) // esperado: true

  // 4. Crear mensajes
  const msg1 = await messageRepository.create({
    conversation_id: conversation._id,
    sender_id: userA,
    content: 'Hola!'
  })
  const msg2 = await messageRepository.create({
    conversation_id: conversation._id,
    sender_id: userB,
    content: 'Todo bien?'
  })
  console.log('4. Mensajes creados')

  // 5. updateLastMessage + findLatest
  await conversationRepository.updateLastMessage(conversation._id, msg2._id)
  const ultimo = await messageRepository.findLatest(conversation._id)
  console.log('5. Ultimo mensaje:', ultimo.content) // esperado: 'Todo bien?'

  // 6. Soft delete del ultimo mensaje -> findLatest debe caer al anterior
  await messageRepository.markAsDeleted(msg2._id)
  const nuevoUltimo = await messageRepository.findLatest(conversation._id)
  console.log('6. Ultimo tras borrar:', nuevoUltimo.content) // esperado: 'Hola!'

  // 7. El historial completo igual muestra ambos (el borrado con flag)
  const historial = await messageRepository.findByConversation(conversation._id)
  console.log('7. Mensajes en historial:', historial.length) // esperado: 2

  // 8. leaveConversation
  await conversationMemberRepository.leaveConversation(conversation._id, userB)
  const sigueSiendo = await conversationMemberRepository.isMember(conversation._id, userB)
  console.log('8. userB sigue siendo miembro:', sigueSiendo) // esperado: false

  // 9. Reincorporacion (el upsert de addMember)
  await conversationMemberRepository.addMember(conversation._id, userB)
  const total = await conversationMemberRepository.findMembers(conversation._id)
  console.log('9. Miembros tras volver:', total.length) // esperado: 2, sin duplicados

  // 10. Soft delete de la conversacion
  await conversationRepository.delete(conversation._id)
  const buscada = await conversationRepository.findById(conversation._id)
  console.log('10. Conversacion borrada, findById devuelve:', buscada) // esperado: null


  // --- USUARIOS ---
  // OJO: ajusta estos campos a los required de tu user.model.js
  // (si tu schema exige password u otros campos, agregalos aca)
  const ana = await userRepository.create({
    name: 'Ana Test',
    email: 'ana@test.com',
    phone: '+5491111111111',
    password: 'hash-de-prueba'
  })
  const bruno = await userRepository.create({
    name: 'Bruno Test',
    email: 'bruno@test.com',
    phone: '+5492222222222',
    password: 'hash-de-prueba'
  })
  console.log('1. Usuarios creados:', ana.name, '/', bruno.name)

  // 2. Busquedas por cada indice
  const porEmail = await userRepository.getByEmail('ana@test.com')
  console.log('2a. getByEmail:', porEmail.name) // esperado: Ana Test
  const porPhone = await userRepository.getByPhone('+5492222222222')
  console.log('2b. getByPhone:', porPhone.name) // esperado: Bruno Test
  const porId = await userRepository.getById(ana._id)
  console.log('2c. getById:', porId.name) // esperado: Ana Test

  // 3. updateById devuelve el documento actualizado (bug del return corregido)
  const actualizado = await userRepository.updateById(ana._id, { name: 'Ana Editada' })
  console.log('3. updateById devuelve:', actualizado.name) // esperado: Ana Editada

  // 4. Estado online/offline y last_seen
  const online = await userRepository.setOnline(bruno._id)
  console.log('4a. setOnline:', online.online) // esperado: true
  const offline = await userRepository.setOffline(bruno._id)
  console.log('4b. setOffline:', offline.online) // esperado: false
  const visto = await userRepository.updateLastSeen(bruno._id)
  console.log('4c. updateLastSeen:', visto.last_seen) // esperado: fecha de ahora

  // --- CONTACTOS ---
  // 5. Ana agrega a Bruno
  await contactRepository.addContact(ana._id, bruno._id)
  console.log('5. Contacto agregado')

  // 6. findByOwner con populate: el contacto trae los datos del usuario
  const agenda = await contactRepository.findByOwner(ana._id)
  console.log('6. Agenda de Ana:', agenda.length, '- contacto:', agenda[0].contact_id.name)
  // esperado: 1 - contacto: Bruno Test

  // 7. findContact puntual
  const contacto = await contactRepository.findContact(ana._id, bruno._id)
  console.log('7. findContact:', contacto.contact_id.name) // esperado: Bruno Test

  // 8. La relacion NO es simetrica: Bruno no tiene a Ana
  const agendaBruno = await contactRepository.findByOwner(bruno._id)
  console.log('8. Agenda de Bruno:', agendaBruno.length) // esperado: 0

  // 9. update generico (ajusta el campo a los que tenga tu contact.model.js,
  // por ejemplo alias, favorite o blocked)
  const editado = await contactRepository.update(ana._id, bruno._id, { favorite: true })
  console.log('9. update:', editado.favorite) // esperado: true (si el schema tiene favorite)

  // 10. removeContact y verificacion
  await contactRepository.removeContact(ana._id, bruno._id)
  const yaNoEsta = await contactRepository.findContact(ana._id, bruno._id)
  console.log('10. Tras remover, findContact:', yaNoEsta) // esperado: null

  // Limpieza: borrar los usuarios de prueba
  await userRepository.deleteById(ana._id)
  await userRepository.deleteById(bruno._id)
  console.log('\nUsuarios de prueba eliminados. Listo.')



  await mongoose.connection.close()
  console.log('\nListo. Conexion cerrada.')
}

main().catch(err => {
  console.error('Error en las pruebas:', err)
  mongoose.connection.close()
})

