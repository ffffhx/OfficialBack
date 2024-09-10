var express = require('express');//express框架引入
var router = express.Router();
const { getCaptchaService } = require("../service/captchaService")

// 验证码
router.get('/', async function (req, res, next) {
    //生成一个验证码
    const captcha = await getCaptchaService()
    // console.log(captcha.text,'captcha.text');
    global.captcha = captcha.text // Store the captcha text in a global variable instead of using session
    // console.log(req.session.captcha,'req.session.captcha');
    // console.log(captcha.data,'captcha.data');
    //设置响应头  告诉其返回的是一个图片,下面两句话是将验证码以图片的形式返回给浏览器
    // console.log(req.session.captcha, 'req.session.captcha 获得验证码');
    res.setHeader('Content-type', "image/svg+xml")
    res.send(captcha.data)
}
)
module.exports = router;