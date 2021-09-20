var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var serveIndex = require('serve-index');
const axios = require('axios');
const zlib = require('zlib');
const fs = require('fs');
const stream = require('stream');
const sessionParser = require('./routes/session-parser');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(sessionParser);
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/uploads', require(__dirname + '/routes/ajax-upload'));

app.get('/set-sess', (req, res) => {
	req.session.shin = req.session.shin || 1;
	req.session.shin++;
	res.send(req.session.shin.toString());
});

app.get('/try-sse', (req, res) => {
	let id = 30;
	res.writeHead(200, {
		'Content-Type': 'text/event-stream',
		'Cache-Control': 'no-cache',
		'Connection': 'keep-alive',
	});
	setInterval(function () {
		let now = new Date();
		res.write('id: ' + id++ + '\n');
		res.write('data: ' + now.toLocaleString() + '\n\n');
	}, 2000);
});

app.get('/pending', (req, res) => {
	setTimeout(()=>{
		res.send('Hello Shinder!');
	}, 10000);
});


app.get('/bus-loc', (req, res) => {
    // 台北市交通開放資料： https://taipeicity.github.io/traffic_realtime/
    const url = 'https://tcgbusfs.blob.core.windows.net/blobbus/GetBusData.gz';
    res.writeHead(200, {
        'Content-Type': 'text/json; charset=UTF-8',
    });
    axios({
        method: 'get',
        url: url,
        responseType: 'stream'
    })
        .then(response=>{
            console.log(`response.data: ${response.data.constructor.name}`);
            // response.data.pipe(fs.createWriteStream('test1.gz'));
            response.data.pipe(zlib.createGunzip()).pipe(res);
        })
        .catch(error=>{
            console.log(error);
        });
});
/*
let busDataOutput = null;
const getBusDataFromService = ()=>{
    // 台北市交通開放資料： https://taipeicity.github.io/traffic_realtime/
    // 右上角位置： 國父紀念館站/@25.0413848,121.5553443
    // 左下角位置： 師大夜市/@25.0247998,121.5271883

    const url = 'https://tcgbusfs.blob.core.windows.net/blobbus/GetBusData.gz';
    axios({
        method: 'get',
        url: url,
        responseType: 'stream'
    })
        .then(response => {
            // 最好是存到資料庫
            // const fw = fs.createWriteStream('./busData.json');
            const ws = new stream.Writable();
            let dataStr = '';
            ws._write = (chunk, encoding, callback)=>{
                dataStr += chunk.toString();
                callback();
            };
            ws.on('finish', ()=>{
                const json = JSON.parse(dataStr);
                busDataOutput = [];
                json.BusInfo.forEach((el) => {
                    if (el.Longitude > 121.5271883 &&
                        el.Longitude < 121.5553443 &&
                        el.Latitude > 25.0247998 &&
                        el.Latitude < 25.0413848)
                    {
                        busDataOutput.push(el);
                    }
                });
                console.log(JSON.stringify(busDataOutput));
                ws.destroy();
            });
            response.data.pipe(zlib.createGunzip()).pipe(ws);
        })
        .catch(error => {
            console.log(error);
        });
    setTimeout(getBusDataFromService, 60000);
};
getBusDataFromService();

app.get('/bus-loc-sse', (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
    });
    const doRun = ()=> {
        if(busDataOutput){
            res.write(`data: ${JSON.stringify(busDataOutput)}\n\n`);
        } else {
            res.write(`data: []\n\n`);
        }
        setTimeout(doRun, 60000);
    };
    doRun();
});
*/
app.use('/', serveIndex('public', {'icons': true}));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
