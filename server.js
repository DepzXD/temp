const http = require('http')
const express = require('express')
const socket = require('socket.io')
const { ExpressPeerServer } = require('peer')

const app = express()
const server = http.createServer(app)
const peerServer = ExpressPeerServer(server, {
  debug: true,
});

app.use('/peerjs', peerServer);

const io = socket(server)

io.on("connection", socket => {
  socket.on("joinRoom", (roomID, userID) => {
    socket.join(roomID)
    socket.to(roomID).broadcast.emit('user-connected', userID);
  })

  socket.on('hello', () => {
    console.log('say hello');
  })

  // socket.on('disconnect', () => {
  //     socket.to(roomId).broadcast.emit('user-disconnected', userId)
  //   })
})


server.listen(8000, () => console.log(`server is running on port 8000`))