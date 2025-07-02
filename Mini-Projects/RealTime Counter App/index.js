let express = require('express')
let socket = require('socket.io')

//App Setup
let app = express()
let server = app.listen(4000, () => {
    console.log('listening to requsts on port 4000')
})

//static files
app.use(express.static('public'))

//Socket Connection

let io = socket(server)

//init counter value
let counter = 0
let userCount = 0

io.on('connection', (socket) => {
    try {
    userCount++
    console.log(`User ${socket.id} connected. Total users:`, userCount) 

    //Active users
    io.sockets.emit('userCount',userCount)

    // Send current counter value to new client
    socket.emit('count', counter)

    socket.on('disconnect', ()=> {
        try {
        userCount--
        console.log(`User ${socket.id} disconnected . Total users:`,userCount)
        io.sockets.emit('userCount',userCount)
        }  catch (error) {
            console.log('Error in disconnecting handler:', error)
        }
    })

    socket.on('increment', () => {
        try {
        counter++
        io.sockets.emit('count', counter)
        } catch (error) {
            socket.emit('error_response', {
                message: 'Failed to increment counter'
            })
        }
    })

    socket.on('decrement', () => {
        try {
                counter--
                io.sockets.emit('count', counter)
            } catch (error) {
                socket.emit('error_response', {
                    message: 'Failed to decrement counter'
                })
            }
        })

    socket.on('reset', () => {
        try {
        counter = 0
        io.sockets.emit('count', counter)
        } catch (error) {
            socket.emit('error_response', {
                message: 'Failed to reset counter'
            })
        }
    })

    socket.on('clicking', (data) => {
            try {
                socket.broadcast.emit('clicking', data)
            } catch (error) {
                socket.emit('error_response', {
                    message: 'Failed to broadcast clicking status'
                })
            }
        })

        socket.on('stop_clicking', () => {
            try {
                socket.broadcast.emit('stop_clicking')
            } catch (error) {
                socket.emit('error_response', {
                    message: 'Failed to stop clicking status'
                })
            }
        })
    } catch (error) {
        console.log('Error in connection handler:', error)
    }
})