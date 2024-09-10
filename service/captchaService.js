const svgCaptcha = require('svg-captcha');

module.exports.getCaptchaService = async function () {
    //svgCaptcha可以返回一个验证码
    return svgCaptcha.create({
        size: 4,
        ignoreChars: 'O0o1iIl',//忽略一些容易混淆的字符
        noise: 6,
        color: true
    });
}