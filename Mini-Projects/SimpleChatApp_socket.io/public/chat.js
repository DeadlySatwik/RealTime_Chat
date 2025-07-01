//Make connection

let socket = io.connect('http://localhost:4000')

//Query DOM
let message = document.getElementById('message')
let handle = document.getElementById('handle')
let btn = document.getElementById('send')
let output = document.getElementById('output')
let feedback = document.getElementById('feedback')

let typing = false
let timeout = undefined


//Emit Events

btn.addEventListener('click', function() {
    socket.emit('chat',{
        message : message.value,
        handle : handle.value
    })
    message.value = ""  // Clear message sending
})

// Handle typing events
message.addEventListener('keypress', function() {
    socket.emit('typing', handle.value)
    typing = true
    clearTimeout(timeout)
    
    // Clear typing feedback after 2 second of no typing
    timeout = setTimeout(function() {
        typing = false
        socket.emit('stop_typing')
    }, 2000)
})

// Handle Enter key to send message
message.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        btn.click()
        typing = false
        clearTimeout(timeout)
    }
})


//Listen for Events

socket.on('chat', function(data) {
    feedback.innerHTML = ""
    output.innerHTML += '<p><strong>' + data.handle + ':</stong>' + data.message + data.message + '</p>'
})

socket.on('typing', function(data) {
    feedback.innerHTML= '<p><em>' + data + ' is typing...</em></p>'
})

socket.on('stop_typing', function() {
    feedback.innerHTML = ""
})