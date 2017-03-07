var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session')
var cookieParser = require('cookie-parser');
var app = express();
var port = 80;
var router = require('./bluebird/router');
app.use(cookieParser());
app.use(session({
    secret: 'abcdefg',
    name: 'mfSystem',
    cookie: {maxAge: 60 * 60 * 1000},
    resave: true,
    saveUninitialized: true,
}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(router);
var wechat = require('wechat');
var config = {
    token: 'hkktoken',
    appid: 'wx615b29c1fe62d055',
    encodingAESKey: 'uV3tDdxsj6aEvLrYU87NHt4HUaqyGtEj6uHTOtMI7Vf',
    checkSignature: true // 可选，默认为true。由于微信公众平台接口调试工具在明文模式下不发送签名，所以如要使用该测试工具，请将其设置为false
};

app.use(express.query());
app.use('/wechat', wechat(config, function (req, res, next) {
    // 微信输入信息都在req.weixin上
    var message = req.weixin;
    console.log(message);
    if (message.FromUserName === 'diaosi') {
        // 回复屌丝(普通回复)
        res.reply('hehe');
    } else if (message.FromUserName === 'text') {
        //你也可以这样回复text类型的信息
        res.reply({
            content: 'text object',
            type: 'text'
        });
    } else if (message.FromUserName === 'hehe') {
        // 回复一段音乐
        res.reply({
            type: "music",
            content: {
                title: "来段音乐吧",
                description: "一无所有",
                musicUrl: "http://mp3.com/xx.mp3",
                hqMusicUrl: "http://mp3.com/xx.mp3",
                thumbMediaId: "thisThumbMediaId"
            }
        });
    } else {
        // 回复高富帅(图文回复)
        res.reply([
            {
                title: '你来我家接我吧',
                description: '这是女神与高富帅之间的对话',
                picurl: 'http://nodeapi.cloudfoundry.com/qrcode.jpg',
                url: 'http://nodeapi.cloudfoundry.com/'
            }
        ]);
    }
}));

app.get("*", function (req, res) {
    res.sendFile(__dirname + '/index.html');
})
app.listen(port, function (error) {
    if (error) {
        console.error(error)
    } else {
        console.info(new Buffer('travis').toString('base64'))
        console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port)
    }
})
