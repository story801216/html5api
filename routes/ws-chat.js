const WebSocket = require('ws');
const sessionParser = require(__dirname + '/session-parser');

const createChatServer = server=>{
	const wsServer = new WebSocket.Server({server});
	const map = new Map(); // 存放對應的名稱
	wsServer.on('connection', (ws, req)=>{
		console.log('req.session:', req.session);
		sessionParser(req, {}, () => {
			console.log('req.session:', req.session);
		});

		map.set(ws, {name: ''}); // 設定對應的物件
		ws.on('message', message=>{
			const mObj = map.get(ws); // 取得對應的物件
			let msg;
			if(! mObj.name){
				mObj.name = message;
				msg = `${mObj.name} 進入，人數：${wsServer.clients.size}`;
			} else {
				msg = `${mObj.name}: ${message}`;	
			}
			wsServer.clients.forEach(c=>{
				if(c.readyState===WebSocket.OPEN){
					c.send(msg);
				}
			});
		});
	});
};
module.exports = createChatServer;