const moment = require('moment')

/*
  format('Chat Bot', 'Bem vindo(a) ao Chat.js!') vira:

  {
    "user": "Chat Bot",
    "message": "Bem vindo(a) ao Chat.js!",
    "time": "5:15 AM"
  }

  e envia esses dados para o frontend

*/

module.exports = (user, message) => {
  return {
    user,
    message,
    time: moment().format('h:mm A')
  }
}