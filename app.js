const express = require('express');
const WebSocket = require('websocket').w3cwebsocket;
const webstomp = require('webstomp-client');

const app = express();
var cors = require('cors');
const app_port = 5000;

app.use(cors());

const json = require('json-bigint');
const host = '15.229.178.29';
const ws_port = '8080';
const endpoint = '/analytics';
const url = `ws://${host}:${ws_port}${endpoint}`;

app.post('/', (req, res) => {
    try {
        const socket = new WebSocket(url);
        const client = webstomp.over(socket);
        client.connect({}, () => {
            client.send('/app/send/analytics', json.stringify({
                'data': {
                    'reportDemanded': true,
                    'demandedBy': 'Calfifa'
                },
                'from': 'Analytics',
                'timestamp': new Date()
            }));
            res.status(200);
        });
    } catch (error) {
        res.status(500);
        res.send('Error:', error);
        console.log('Error:', error);
    }
    console.log("????")
});

app.listen(app_port, (error) => {
    if (!error) {
        console.log("Server is Successfully Running, and App is listening on port " + app_port)
        console.log('WebSocket URL:', url);
    }
    else {
        console.log("Error occurred, server can't start", error);
    }
}
);