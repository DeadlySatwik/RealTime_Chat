//Make connection
let socket = io.connect('http://localhost:4000')

// Query DOM elements
let output = document.getElementById('output')
let handle = document.getElementById('handle')
let plusBtn = document.getElementById('plus-btn')
let minusBtn = document.getElementById('minus-btn')
let resetBtn = document.getElementById('reset-btn')
let feedback = document.getElementById('feedback')
let userCount = document.getElementById('user-count')
const statusDiv = document.getElementById('connection-status');
const statusText = statusDiv.querySelector('.status-text');

let clicking = false
let timeout = undefined

// Connection event handlers
socket.on('connect', () => {
    updateStatus('connected', 'Connected to server')
    enableButtons(true)
});

socket.on('disconnect', () => {
    updateStatus('disconnected', 'Disconnected from server')
    enableButtons(false)
});

socket.on('reconnecting', (attemptNumber) => {
    updateStatus('connecting', `Reconnecting... (Attempt ${attemptNumber})`)
    enableButtons(false)
});

socket.on('reconnect_failed', () => {
    updateStatus('error', 'Failed to reconnect. Please refresh the page.')
    enableButtons(false)
});

socket.on('error', (error) => {
    updateStatus('error', `Connection error: ${error.message}`)
    console.error('Socket error:', error)
    enableButtons(false)
});

// Helper functions
function updateStatus(state, message) {
    statusDiv.className = `status ${state}`
    statusDiv.innerHTML = `
        <span class="status-dot"></span>
        <span class="status-text">${message}</span>
    `
}

function enableButtons(enabled) {
    plusBtn.disabled = !enabled
    minusBtn.disabled = !enabled
    resetBtn.disabled = !enabled
}

//Emit Events
plusBtn.addEventListener('click', function(){
    socket.emit('increment')
    socket.emit('clicking', {
        handle: handle.value,
        action: 'incrementing'
    })
    clicking = true
    clearTimeout(timeout)
    
    timeout = setTimeout(function() {
        clicking = false
        socket.emit('stop_clicking')
    }, 500)
})

minusBtn.addEventListener('click', function(){
    socket.emit('decrement')
    socket.emit('clicking', {
        handle: handle.value,
        action: 'decrementing'
    })
    clicking = true
    clearTimeout(timeout)

    timeout = setTimeout(function() {
        clicking = false
        socket.emit('stop_clicking')
    }, 500)
})

resetBtn.addEventListener('click', function(){
    socket.emit('reset')
    socket.emit('clicking', {
        handle: handle.value,
        action: 'resetting'
    })
    clicking = true
    clearTimeout(timeout)
    timeout = setTimeout(function() {
        clicking = false
        socket.emit('stop_clicking')
    }, 500)
})

//Listen for Events

socket.on('userCount',(count) => {
    document.getElementById('user-count').textContent = `Online Users: ${count}`
})

socket.on('count', function(count) {
    output.textContent = count
    if (!clicking) {
        feedback.innerHTML = ""
    }
})

socket.on('clicking', function(data) {
    feedback.innerHTML = '<p><em>' + data.handle + ' is ' + data.action + '...</em></p>'
})

socket.on('stop_clicking', function() {
    feedback.innerHTML = ""
})

socket.on('error_response', (error) => {
    console.error('Operation failed:', error)
    feedback.innerHTML = `<p class="error"><em>Error: ${error.message}</em></p>`
    setTimeout(() => {
        feedback.innerHTML = ''
    }, 3000)
})