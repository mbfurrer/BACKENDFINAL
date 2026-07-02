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

  await mongoose.connection.close()
  console.log('\nListo. Conexion cerrada.')
}

main().catch(err => {
  console.error('Error en las pruebas:', err)
  mongoose.connection.close()
})

