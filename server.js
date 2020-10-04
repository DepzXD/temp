const express = require('express')
const http = require('http')
const socketIo = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketIo(server)

const Port = 8000 || process.env.NodeEnv

const rooms = {}

io.on('connection', socket => {
  socket.on('joinRoom', roomID, => {
    if(rooms[roomID]) {
      rooms[roomID].push(socket.id)
    } else {
      rooms[roomID] = [socket.id]
    }

    const otherUser = rooms[roomID].find(id => id !== socket.id)
    if(otherUser) {
      socket.emit('otherUser', otherUser)
      socket.to(otherUser).emit('user joined', socket.id)
    }
  })
})

server.listen(Port, () => console.log(`server is running on port ${Port}.`)) 