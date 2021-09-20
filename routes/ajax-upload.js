const express = require('express');
const multer = require('multer');
const uuidv4 = require('uuid/v4');
const fs = require('fs');
const extMap = {  // 檔案類型的副檔名的對應
	'image/jpeg': '.jpg',
	'image/png': '.png',
	'image/gif': '.gif',
};
// multer 儲存的設定
const storage = multer.diskStorage({
	destination: (req, file, cb)=>{
		cb(null, __dirname + '/../public/img-uploads'); // 存放位置
	},
	filename: (req, file, cb)=>{
		let ext = extMap[file.mimetype]; // 副檔名
		if(ext)
			cb(null, uuidv4() + ext);
		else
			cb(new Error('上傳的檔案格式錯誤'));
	}
});
const fileFilter = (req, file, cb)=>{
	if(extMap[file.mimetype])
		cb(null, true); // 接受檔案
	else
		cb(null, false); // 不接受
};
const upload = multer({
	storage: storage,
	fileFilter: fileFilter,
});
const router = express.Router();
router.post('/profile', upload.single('avatar'), function(req, res) {
	let data; // 要存檔的資料
	const output = { body: req.body }; // 輸出給前端，先預放傳入的 POST 資料
	try {
		data = require(__dirname + '/../public/json/profile'); // 取資料
	} catch (ex) {
		data = {}; // 如果找不到檔案，使用預設值
	}
	data.user = req.body.user; // 變更資料
	data.description = req.body.description;
	if(req.file && req.file.originalname){ // 若有上傳檔案
		data.avatar = '/img-uploads/' + req.file.filename; // 儲存包含路徑
		output.upload = data.avatar;
	}
	fs.writeFile(__dirname+'/../public/json/profile.json', JSON.stringify(data), error=>{
		if(error) return console.log(error);
	});
	res.json(output);
});

router.post('/multiple', upload.array('myFiles'), function(req, res) {
	const output = [];
	req.files.forEach(file=>{
		output.push('/img-uploads/' + file.filename);
	});
	res.json(output);
});

module.exports = router;
