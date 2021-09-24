const WebSocket = require('ws');

const createChatServer = server => {
    const wsServer = new WebSocket.Server({server});
    const map = new Map();

    wsServer.on('connection', (ws, req)=>{  // 當有人連線時候要做的事情
        console.log(wsServer.clients); //Set類型
        map.set(ws, {name:''});
        ws.on('message', (message, isisBinary)=>{
            const mObj = map.get(ws);
            let msg; // 要廣播的訊息
            if(! mObj.name){
                mObj.name = message.toString();
                msg = `${mObj.name} 進到聊天室，共${wsServer.clients.size}人`;
            } else {
                msg = `${mObj.name}:${message.toString()}`;
            };
            wsServer.clients.forEach(c=>{
                if(c.readyState===WebSocket.OPEN){
                    c.send(msg);
                }
            })
        })
    })
};

module.exports = createChatServer; 