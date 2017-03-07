/**
 * Created by Administrator on 2017/3/7.
 */
var fs =require('fs');
var express = require('express');
var router = express.Router();
var wechat = require('wechat');
var OAuth = require('wechat-oauth');
var appid ='wx615b29c1fe62d055';
var secret ='ca99e6f92581e5b887515d86b51ac277';
var config = {
    token: 'hkktoken',
    appid: appid,
    encodingAESKey: 'uV3tDdxsj6aEvLrYU87NHt4HUaqyGtEj6uHTOtMI7Vf',
    checkSignature: true // 可选，默认为true。由于微信公众平台接口调试工具在明文模式下不发送签名，所以如要使用该测试工具，请将其设置为false
};

router.use(express.query());
function uauth(req, res, next) {
    console.log(req.query);
    new OAuth(appid, secret, function (openid, callback) {
        // 传入一个根据openid获取对应的全局token的方法
        // 在getUser时会通过该方法来获取token
        console.log(openid);
        fs.readFile(openid +':access_token.txt', 'utf8', function (err, txt) {
            if (err) {return callback(err);}
            callback(null, JSON.parse(txt));
        });
        res.redirect('https://i.mofanghr.com/app/offline-index');

    }, function (openid, token, callback) {
        // 请将token存储到全局，跨进程、跨机器级别的全局，比如写到数据库、redis等
        // 这样才能在cluster模式及多机情况下使用，以下为写入到文件的示例
        // 持久化时请注意，每个openid都对应一个唯一的token!
        console.log(openid);
        console.log(token);
        fs.writeFile(openid + ':access_token.txt', JSON.stringify(token), callback);
        res.redirect('https://i.mofanghr.com/app/offline-index');
    });
}
router.use('/uauth',uauth)
router.use('/wechat', wechat(config, function (req, res, next) {
    // 微信输入信息都在req.weixin上
    var message = req.weixin;
    console.log(message);
    if(!message.Content){
        res.reply({
            content: 'what are you say',
            type: 'text'
        });
    }
    if(message.Content.indexOf('美团')>-1){
        res.reply([
            {
                title: '商务专员',
                description: '美团网：美团一次 美一次，为消费者发现值得信赖的商家，让消费者享受超低折扣的优质服务。',
                picurl: 'https://public.mofanghr.com/head/2016/02/29/201602291804355484.jpg',
                url: 'https://i.mofanghr.com/offline-job-detail/503132?slotId=2CC022BE73528CED'
            }
        ]);
        return ;
    }
    if(message.Content.indexOf('人人')>-1){
        res.reply([
            {
                title: '客服专员',
                description: '中国互联网百强企业，以诚信、透明、公平、高效、创新的声誉赢得了良好的用户口碑。',
                picurl: 'http://7xio5n.com1.z0.glb.clouddn.com/%E4%BA%BA%E4%BA%BA%E8%B4%B7logo.png',
                url: 'https://i.mofanghr.com/offline-job-detail/503997?slotId=D1ACA5B3F9110008'
            }
        ]);
        return ;
    }
    if(message.Content.indexOf('魔方')>-1){
        res.reply([
            {
                title: '魔方面面',
                description: '魔方面面-原魔方招聘-专门为年轻求职者提供免费猎头服务的平台',
                picurl: 'https://static1.mofanghr.com/www/img/header-logo.png',
                url: 'https://i.mofanghr.com/app/offline-index'
            }
        ]);
        return ;
    }
    if(message.Content.indexOf('a')>-1){
        res.reply([
            {
                title: '魔方面面',
                description: '魔方面面-原魔方招聘-专门为年轻求职者提供免费猎头服务的平台',
                picurl: 'https://static1.mofanghr.com/www/img/header-logo.png',
                url: 'http://www.kknode.cn/uauth?back=https://i.mofanghr.com/app/offline-index'
            }
        ]);
        return ;
    }
    res.reply({
        content: '你才是'+message.Content,
        type: 'text'
    });
}));
module.exports = router;