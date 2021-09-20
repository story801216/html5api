# 建立專案
$ npm init -y

# 安裝 express-generator
$ sudo npm i -g express-generator

# 使用 express-generator
# -e 使用 ejs, -f 強迫使用在非空的資料夾
$ express -e -f ./html5-api-examples

# 安裝 packages
$ npm i

# 將 package.json 的啟動修改，使之使用 nodemon 啟動（之前必須全域安裝 nodemon）
  "scripts": {
    "start": "nodemon ./bin/www"
  },

# 測試啟動伺服器 (http://localhost:3000)
$ npm start

# Ctrl-C 停止伺服器

# 安裝 serve-index
$ npm i serve-index

# 在 app.js 放入：
// app.use('/', indexRouter); // 加入註解
app.use('/', serveIndex('public', {'icons': true})); // 加入此行
# 再到 http://localhost:3000 可以看到 public 內的檔案列表

# input 新的 type 屬性值
# form-input-type.html

# input 新的屬性
# form-input-type.html

# 可編輯的 div
# div-contenteditable.html


