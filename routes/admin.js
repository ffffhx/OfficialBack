//routes对应的是表现层
//express是基于nodejs平台的后端web开发框架
//写代码的时候是从数据持久层开始写
//但是代码运行的逻辑是从表现层开始，逐渐进入到服务层，持久层
var express = require('express');//express框架引入
//创建一个路由实例，用于定义处理特定路径和HTTP方法的请求
var router = express.Router();
var { formatResponse, analysisToken, formatResponseBody } = require("../utils/tool")//引入自定义的各种工具

const { loginService, registerService, updatePwdService } = require("../service/adminService");//Service服务层是和业务逻辑有关的：账号密码验证
const { token } = require('morgan');//引入token函数来创建自定义令牌
const { ValidationError } = require('sequelize');//sequelize是一个ORM（Object Relational Mapping）框架用于和SQL数据库进行交互，从中引入了ValidationError这个类，来处理验证错误
//  /login是二级路由
// 一级路由在app.js
// 登录路由
router.post('/login', async function (req, res, next) {
    //首先是一个验证码的验证
    // console.log(req.body.captcha, 'req.body.captcha<<<<<');
    // console.log(req.session.captcha, 'req.session.captcha');
    //req.body在postman里面指的是body中的raw的那些东西
    // console.log(req.session.captcha, 'req.session.captcha');
    // console.log(req.body.captcha, 'req.body.captcha');
    // console.log(global.captcha, 'global.captcha');
    //req.body.captcha是指客户端传入进来的验证码。
    //req.session.captcha是指服务端生成的验证码
    // 如果验证码错误
    if (String(req.body.captcha).toLowerCase() !== String(global.captcha).toLowerCase()) {//全都转换成小写
        // throw new ValidationError("验证码错误")
        console.log('验证码错误');
        res.send(formatResponse(3, "验证码错误", null))
        return;
    }
    //如果验证码正确
    //接下来需要进行账号密码的验证，它属于业务逻辑所以不在路由这里做
    //由业务逻辑层做好之后暴露给表现层
    //登录成功后,result包括data和token
    const result = await loginService(req.body)//将请求体传过去，放到业务逻辑层去处理
    //如果登录成功:
    if (result.token) {
        //res.setHeader是表现层给客户端的响应头
        //在postman的headers里面可以看到
        // res.setHeader("authentication", result.token)
        console.log('登录成功');
        //登录成功之后，后端会把token，前端的传过来的用户信息传给后端
        res.send(formatResponseBody(1, "登录成功", result.token, req.body))
    } else {
        //res.send是表现层给客户端的响应体
        //在postman的body里面可以看到
        res.send(formatResponse(0, "登陆失败", req.body))//formatResponse是一个工具函数

    }
});


//注册路由
router.post('/register', async function (req, res, next) {
    const result = await registerService(req.body);
    //进入到了表现层routes
    if (result) {
        console.log('进入到了表现层');
        console.log(result, '这是result');
        res.send(formatResponse(1, "注册成功", result.data))
    } else {
        res.send(formatResponse(0, "账号已经被注册过", result.data))
    }
})


//恢复登录状态路由
router.get('/whoami', async function (req, res, next) {
    //Authorization是请求头中的一个字段
    //Bearer是一种token类型

    //1.从客户端的请求拿到token,然后解析token 还原成有用的信息
    const token = analysisToken(req.get("Authorization"))
    //然后返还给客户端
    res.send(formatResponse(0, "",
        {
            "loginId": token.loginId,
        }
    ))
})
//修改用户信息
//修改名字，密码等
router.put('/update', async function (req, res, next) {
    const result = await updatePwdService(req.body)
    console.log(result, '这是更新密码的result');
    if (result) {
        res.send(formatResponse(1, "修改成功", result.data))
    } else {
        res.send(formatResponse(0, "修改失败", result.data))
    }
})

module.exports = router;
