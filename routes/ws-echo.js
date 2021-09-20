const WebSocket = require('ws');
const createEchoServer = server=>{
	const wsServer = new WebSocket.Server({server});
	wsServer.on('connection', (ws, req)=>{
		console.log('連線數:', wsServer.clients.size);
		console.log('ip: ' + req.connection.remoteAddress);
		console.log('port: ' + req.connection.remotePort);
		ws.on('message', message=>{
			ws.send(message);
		});
		ws.send('連線了!');
	});
};
module.exports = createEchoServer;