1. WebSocket Handshake (ws:// or wss://)  
    - Client sends HTTP upgrade request  
    - Server responds with 101 Switching Protocols  
    - Connection upgraded to WebSocket protocol  
    - Req Code:  
      ```http
      GET /socket HTTP/1.1
      Host: example.com
      Upgrade: websocket
      Connection: Upgrade
      ```

2. WebSocket Connection  
    - Full-duplex communication channel  
    - Low latency, real-time data exchange  
    - Persistent connection until closed  
    - Req Code:  
      ```js
      const socket = new WebSocket('wss://example.com');
      socket.onopen = () => console.log('Connection open');
      ```

3. WebSocket Messages  
    - Text frames (UTF-8 encoded)  
    - Binary frames (raw data)  
    - Control frames (ping, pong, close)  
    - Req Code:  
      ```js
      socket.onmessage = event => {
         console.log('Message:', event.data);
      };
      ```

4. WebSocket Events  
    - `onopen` - Connection established  
    - `onmessage` - Message received  
    - `onerror` - Error occurred  
    - `onclose` - Connection closed  
    - Req Code:  
      ```js
      socket.onclose = () => console.log('Connection closed');
      ```

5. WebSocket Use Cases  
    - Real-time chat applications  
    - Live sports updates  
    - Collaborative editing  
    - Gaming applications  
    - Stock price updates  
    - Req Code:  
      ```md
      - Feature: Real-time user updates
      - Connection: WebSocket
      - Status: Active
      ```