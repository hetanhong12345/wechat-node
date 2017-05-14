/**
 * Created by Administrator on 2017/3/7.
 */
var fs = require('fs');
var express = require('express');
var router = express.Router();
var OAuth = require('wechat-oauth');
var appid = 'wxf94393a3d63776b8';
var secret = 'c22019ff514d4299cd74bf816d5d30d6';

var client = new OAuth(appid, secret);
var location = 'http://47.93.245.70/';

router.use(express.query());
router.get('/', function (req, res, next) {
  // 微信输入信息都在req.weixin上
  var url = client.getAuthorizeURL(location+'/oauth/callback', '', 'snsapi_userinfo');
  console.log(url);
  // 重定向请求到微信服务器
  res.redirect(url);

});

router.get('/callback', function (req, res) {
  var code = req.query.code;
  client.getAccessToken(code, function (err, result) {
    console.dir(err)
    if (err) {
      return res.send(JSON.stringify(err));
    }
    console.dir(result)
    var accessToken = result.data.access_token;
    var openid = result.data.openid;
    console.log('token=' + accessToken);
    console.log('openid=' + openid);

    res.redirect('https://i.mofanghr.com')
  })
});


module.exports = router;