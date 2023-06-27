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
            console.log('Received message from business:', message.body);

        });
        client.subscribe('/topic/analytics', (message) => {
            console.log('Received message from analytics:', message.body);
            try {
                const value = message.body.replace(/'/g, '"');
                const data = json.parse(value);
                console.log(data);
            } catch (error) {
                console.log('Error:', error);
            }
        });
    });
} catch (error) {
    console.log('Error:', error);
}