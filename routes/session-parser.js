const session = require('express-session');
const sessionParser = session({
    saveUninitialized: false,
    secret: '$eCuRiTy123',
    resave: false
});
module.exports = sessionParser;