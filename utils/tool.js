//格式化要响应的数据
const jwt = require("jsonwebtoken")
const md5 = require("md5")
const multer = require('multer')
// const { path } = require("../app")
const path = require('path')
//除了生成token，也负责解密token
module.exports.formatResponse = function (code, msg, data) {
    return {
        "code": code,
        "msg": msg,
        "data": data,
    }
}
module.exports.formatResponseBody = function (code, msg, data, req) {
    return {
        "code": code,
        "msg": msg,
        "data": data,
        'reqBody': req
    }
}
module.exports.formatResponseToken = function (code, msg, data, token) {
    return {
        "code": code,
        "msg": msg,
        "data": data,
        "token": token
    }
}

module.exports.analysisToken = function (token) {
    return jwt.verify(token.split(" ")[1], md5(process.env.JWT_SECRET))
}


//设置上传文件的引擎
const storage = multer.diskStorage({
    //文件存储的位置
    destination: function (req, file, cb) {
        //cb是一个回调函数，用于传递错误和结果，第一个参数表示错误，
        //第二个参数表示结果
        cb(null, __dirname + '/../public/static/uploads/')
        //__dirname是Nodejs的一个全局变量，
        //指的是当前模块文件所在目录的绝对路径
        //所在的目录：比如tools的所在目录是utils
    },
    //上传到服务器的文件，文件名要做单独处理，以下是处理其文件名
    filename: function (req, file, cb) {
        // console.log(file, 'file<<<');
        //获取文件名
        //file.originalname是文件原始名
        //path.extname是获取文件的拓展名  比如txt,jpg
        //path.basename是获取文件的基本名称（排除掉后缀）
        const basename = path.basename(file.originalname, path.extname(file.originalname))
        //获取后缀名
        const extname = path.extname(file.originalname)
        //构建新的名字
        const newName = basename + Date.now() + extname
        cb(null, newName)

    }
})
module.exports.uploading = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10,
        files: 1
    },
})