const WebSocket = require('ws');

const createEchoServer =server => {
    const wsServer = new WebSocket.Server({server});

    wsServer.on('connection', (ws,req) => {  // 當有人連線時候要做的事情
        console.log('size', wsServer.client.size);
        console.log('ip:', req.connection.remoteAddress);

        ws.on('message', message=>{
            ws,send(message);
        })
        ws.send('連線了!')
    })
};

module.exports = createEchoServer; 