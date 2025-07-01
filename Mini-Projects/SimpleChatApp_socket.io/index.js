let express = require('express')
let socket = require('socket.io')


//App setup
let app = express()
let server = app.listen(4000, function(){
    console.log('listening to requsts on port 4000')
})

//static files
app.use(express.static('public'))

//Socket setup

let io = socket(server)

io.on('connection', function(socket){
    console.log('made socket connection',socket.id) 

    socket.on('chat', function(data){
        io.sockets.emit('chat', data)
    })

    socket.on('typing', function(data) {
        socket.broadcast.emit('typing', data)
    })

    socket.on('stop_typing', function() {
        socket.broadcast.emit('stop_typing')
    })
})