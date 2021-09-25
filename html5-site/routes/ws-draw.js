const WebSocket = require('ws');

const createDrawServer = server => {
    const wsServer = new WebSocket.Server({server});
    const map = new Map();

    wsServer.on('connection', (ws, req)=>{  // 當有人連線時候要做的事情
        ws.on('message', (message, isisBinary)=>{
            let msg = message.toString(); ; // 要廣播的訊息
            wsServer.clients.forEach(c=>{
                if(c.readyState===WebSocket.OPEN){
                    c.send(msg);
                }
            })
        })
    })
};

module.exports = createDrawServer; 