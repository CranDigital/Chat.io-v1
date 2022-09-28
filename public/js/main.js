/* Pega as tags de acordo com o ID */

const chatForm = document.getElementById('chat-form')
const roomName = document.getElementById('room-name')
const messages = document.getElementById('messages')
const userList = document.getElementById('users')

/* Middleware */

const username = localStorage.getItem('username') // pega a chave username na localStorage

if (!username) {
  window.location.href = '/' // redireciona
}

/* End Middleware */

const { room } = Object.fromEntries(
  new URLSearchParams(window.location.search)
) 

/* 
  Pega a query room dentro da rota:
  http://localhost:3000/chat?room=Geral -> [Geral]
*/

const socket = io('http://localhost:3000') // Cria a conexão com o socket

/* Envia pro backend os dados do usuário para conectar ao chat */

socket.emit('join', {
  username,
  room
})

socket.on('users', ({ users, room }) => { // desestrutura o objeto

  /* 
    Recebe os dados do backend (usuários e o nome da sala) para serem alterados no frontend
  */

  roomName.innerText = room
  userList.innerHTML = ''

  users.forEach((user) => {
    let li = document.createElement('li')
    li.innerText = user.username
    userList.appendChild(li)
  })

})

/* Recebendo do backend */

socket.on('show', (data) => { // pega o objeto
  sendMessage(data)
})

const sendMessage = (data) => {
  messages.innerHTML += `
    <div class="message">
      <p class="meta">${data.user} <span>${data.time}</span></p>
      <p class="text">
        ${data.message}
      </p>
    </div>
  `
  messages.scrollTop = messages.scrollHeight // rola o scroll pra baixo sempre que enviar uma mensagem
}

const leaveRoom = () => {
  localStorage.removeItem('username') // remove o usuário da localStorage
  window.location.href = '/' // redireciona
}

chatForm.addEventListener('submit', (e) => { // coloca o evento de submit no <form>
  e.preventDefault() // remove as ações padrões de um form

  let msg = String(e.target.elements.msg.value).trim() // remove espaços da mensagem

  if (!msg) { // verifica se ela não é undefined
    return false
  }

  socket.emit('message', { // envia para o backend formata-la
    user: username,
    message: e.target.elements.msg.value
  })

  e.target.elements.msg.value = '' // limpa o input
  e.target.elements.msg.focus() // foca no input novamente
})

const copyToClipboard = () => {
  const url = window.location.href // pega a url toda
  navigator.clipboard.writeText(url).then(() => { // copia na área de transferência do usuário
    alert('Link copiado com sucesso!') // envia um alerta de confirmação
  })
}