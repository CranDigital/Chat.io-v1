const express = require('express')
const app = express() 
const http = require('http').createServer(app) // cria o servidor HTTP
const path = require('path') // lib que trabalha com pastas / arquivos
const colors = require('colors')
const format = require('./utils/format')
const {
  joinUser,
  roomUsers,
  userLeave
} = require('./utils/user') // importa as funções do arquivo user.js

const io = require('socket.io')(http) // cria a conexão IO com o servidor HTTP

app.set('view engine', 'ejs') //alterar o mecanismo de template para o ejs
app.use(express.static(path.join(__dirname, './public'))) // onde vai ficar a parte estática do express - dir de diretorio

/* Rotas */

app.get('/chat', (req, res) => {
  return res.render('chat') // renderiza o arquivo chat.ejs
})

app.get('/', (req, res) => {
  return res.render('index') // renderiza o arquivo index.ejs
})

/* Fim das Rotas */

/*
  Socket.io vai tanto receber quanto enviar dados do frontend / backend
  ON: Recebe dados
  EMIT: Envia dados
*/

io.on('connection', (socket) => {

  socket.on('join', ({ username, room }) => {

    const user = joinUser(socket.id, username, room) // armazena os dados
    
    socket.join(user.room) // entra na sala
    socket.emit('show', format('Chat Bot', 'Bem vindo(a) ao Chat.js!')) // (Usuário) socket manda pra um
    socket.broadcast.to(user.room).emit('show', format('Chat Bot', `${user.username} entrou no chat!`)) // (Todos) que estão na sala
    
    io.to(user.room).emit('users', {
      room: user.room,
      users: roomUsers(user.room)
    }) // envia pro frontend o nome da sala e os usuários para mostrar no menu
  })

  /*
    Como funciona o envio de mensagens? O frontend vai enviar os dados cru para o backend
    (evento: message). O backend vai formatar a mensagem com a função FORMAT e devolve ao frontend
    (evento: show) os dados formatados para que seja mostrado ao usuário.

    Lógica de receber e enviar dados.
  */

  socket.on('message', (data) => {
    if (data != undefined) {
      io.emit('show', format(data.user, data.message)) // formata os dados vindos do front e devolve formatado
    }
  })

  socket.on('disconnect', () => {

    const user = userLeave(socket.id) // remove da lista

    if (user) {

      io.to(user.room).emit('show',
        format('Chat Bot', `${user.username} saiu da sala!`) // avisa a sala que o usuário saiu
      )

      io.to(user.room).emit('users', {
        room: user.room,
        users: roomUsers(user.room)
      }) // atualiza os dados após um usuário sair
    }
  })
})

/* Conexão */

http.listen(3000, () => {
  console.clear()
  console.log(
    colors.green('[STATUS] ') + colors.blue('Server is running!\n') +
    colors.green('[SERVER] ') + colors.blue('http://localhost:3000/chat\n') +
    colors.green('[DEVELOPER] ') + colors.magenta('Snarloff & LePetuconski')
  )
})