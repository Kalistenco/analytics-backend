const express = require('express');
const WebSocket = require('websocket').w3cwebsocket;
const webstomp = require('webstomp-client');

const app = express();
const app_port = 5000;

const json = require('json-bigint');
const host = '15.229.178.29';
const ws_port = '8080';
const endpoint = '/analytics';
const url = `ws://${host}:${ws_port}${endpoint}`;

function parseJwt(token) {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}

app.get('/', (req, res) => {
    res.status(200);
    res.send("Holis")
})

app.post('/', (req, res) => {
    try {
        const socket = new WebSocket(url);
        const client = webstomp.over(socket);
        client.connect({}, () => {
            client.send('/app/send/analytics', json.stringify({
                'payload': {
                    'data': {
                        'reportDemanded': true,
                        'demandedBy': 'Calfifa'
                    }
                },
                'from': 'Analytics',
                'timestamp': new Date()
            }
            ));
            res.status(200);
            res.end()
        });
    } catch (error) {
        res.status(500);
        res.send('Error:', error);
        console.log('Error:', error);
    }
});

app.post('login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const socket = new WebSocket(url);
        const client = webstomp.over(socket);
        client.connect({}, () => {
            client.send('/app/send/analytics', json.stringify({
                'payload': {
                    'operation': 'LOGIN',
                    'data': {
                        'password': password,
                        'email': email
                    },
                    'from': 'ANALYTICS',
                    'timestamp': new Date()
                }
            }));
            client.subscribe('/topic/backoffice', (message) => {
                console.log("RECEIVED MESSAGE: ", message.body);
                try {
                    const value = message.body.replace(/'/g, '"');
                    const data = json.parse(value);
                    console.log("RECEIVED DATA: ", data);
                    if (data && data.payload && data.payload.operation === "LOGIN") {
                        if (data.payload.data && data.payload.data.result === "success") {
                            const parsedToken = parseJwt(data.payload.data.token);
                            console.log("PARSED TOKEN: ", parsedToken);
                            if (parsedToken) {
                                res.send({
                                    'permissions': parsedToken.permisos
                                });
                                res.status(200);
                                res.end();
                            } else {
                                res.status(500);
                                res.send("Error: sin permisos");
                                res.end();
                            }
                        } else if (data.payload.data && data.payload.data.result === "error") {
                            res.status(500);
                            res.end();
                        }
                    };
                } catch (error) {
                    res.status(500);
                    res.send('Error:', error);
                    console.log('Error:', error);
                }
            });
        })
    } catch (error) {
        res.status(500);
        res.send('Error:', error);
    }
});

app.listen(app_port, (error) => {
    if (!error) {
        console.log("Server is Successfully Running, and App is listening on port " + app_port)
        console.log('WebSocket URL:', url);
    }
    else {
        console.log("Error occurred, server can't start", error);
    }
});

// const WebSocket = require('websocket').w3cwebsocket;
// const webstomp = require('webstomp-client');
// const json = require('json-bigint');
// const host = '15.229.178.29';
// const port = '8080';
// const endpoint = '/analytics';
// const url = `ws://${host}:${port}${endpoint}`;
// console.log('WebSocket URL:', url);
// try {
// const socket = new WebSocket(url);
// const client = webstomp.over(socket);
// client.connect({}, () => {
// console.log('STOMP WebSocket connected');
// client.subscribe('/topic/business', (message) => {
// console.log('Received message:', message.body);
// try {
// const value = message.body.replace(/'/g, '"');
// const data = json.parse(value);
// console.log(data);
// } catch (error) {
// console.log('Error:', error);
// }
// });
// client.send('/app/send/analytics', 'hello from Node.js');
// // const data = prompt('Press enter to exit');
// // client.disconnect();
// // socket.close();
// });
// } catch (error) {
// console.log('Error:', error);
// }