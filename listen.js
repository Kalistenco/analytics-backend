const WebSocket = require('websocket').w3cwebsocket;
const webstomp = require('webstomp-client');
const json = require('json-bigint');
const host = '15.229.178.29';
const port = '8080';
const endpoint = '/analytics';
const url = `ws://${host}:${port}${endpoint}`;
console.log('WebSocket URL:', url);
try {
    const socket = new WebSocket(url);
    const client = webstomp.over(socket);
    client.connect({}, () => {
        console.log('STOMP WebSocket connected');
        client.subscribe('/topic/business', (message) => {
            console.log('Received message:', message.body);
            try {
                const value = message.body.replace(/'/g, '"');
                const data = json.parse(value);
                console.log(data);
            } catch (error) {
                console.log('Error:', error);
            }
        });
        client.send('/app/send/analytics', 'hello from Node.js');
        // const data = prompt('Press enter to exit');
        // client.disconnect();
        // socket.close();
    });
} catch (error) {
    console.log('Error:', error);
}