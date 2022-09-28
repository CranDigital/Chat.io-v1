const users = [] // armazena os dados

/* Adiciona o usuário na array */

const joinUser = (id, username, room) => {
  const user = { id, username, room }
  users.push(user)
  return user
}

/* Puxa os usuários que estão na array */

const roomUsers = (room) => {
  return users.filter((user) => user.room == room)
}

/* Remove o usuário da array */

const userLeave = (id) => {
  const index = users.findIndex(user => user.id === id)
  if (index !== -1) return users.splice(index, 1)[0]
}

/* Exporta as funções */

module.exports = {
  joinUser,
  roomUsers,
  userLeave
}