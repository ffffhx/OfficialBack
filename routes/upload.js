var express = require('express');
var router = express.Router();
var multer = require('multer');
const { uploading, formatResponse } = require('../utils/tool');
const { UploadError } = require('../utils/errors');

router.post('/', function (req, res, next) {
    //single方法里面书写上传控件的 name值
    // console.log('aaaa');
    uploading.single("file")(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // next(new UploadError("上传文件过大"))
            res.send(formatResponse(0, "上传文件过大", null))
        } else {
            const resp = {
                mess: "上传文件成功",
                path: "/static/uploads/" + req.file.filename
            }
            res.send(formatResponse(1, "上传文件成功", resp.path))
        }
    })//上传文件
})
module.exports = router