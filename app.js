

//启动服务:nodemon npm start


//OPTIONS请求为预检请求，检查服务器是否允许实际请求的方法和头部
//POST为实际请求
//引入包
var express = require('express');
var createError = require('http-errors');//这个包用来创建和管理错误
var path = require('path');//这个包用来处理文件系统路径
var cookieParser = require('cookie-parser');//解析http请求中的cookie
var logger = require('morgan');//记录http请求，监控和分析应用程序的流量
const expressJWT = require('express-jwt');//这个包是专门用来验证客户端传过来的token的
var md5 = require("md5");//md5加密
const { ForbiddenError } = require('./utils/errors');//自定义的错误  401错误
const cors = require('cors')//用于处理跨域请求
const session = require('express-session')//session用于存储用户在多个请求之间的信息
require("dotenv").config();//dotenv这个包用来从.env文件中读取环境变量并且设置到process.env中
require("./dao/db");//引入数据库连接

//引入路由
var adminRouter = require('./routes/admin');
var captchaRouter = require('./routes/captcha');
var uploadRouter = require('./routes/upload');
var testRouter = require('./routes/test');
//captchaRouter这个导出是默认导出，在接受的时候不需要加大括号
//不是默认导出的导出，在接受的时候需要加大括号，因为导出的是一个方法
const { METHODS } = require('http');//http的各种方法  post get put 等等

var app = express();//创建服务器实例
//express-session是另一种记录客户状态的机制，与cookie保存在客户端浏览器不同
//cookie保存在服务器中
// 当客户端访问服务器时，服务器会生成一个session对象，对象中保存的是key:value值，
// 同时服务器会将key传回给客户端的cookie当中；
//比如登录状态 用户偏好
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,//是否每次都重新保存会话
  saveUninitialized: true,//是否保存未初始化的会话
  cookie: {
    secure: false, // 在开发环境中应设置为false
    sameSite: 'none' // 确保在跨域请求中cookie被正确传递
  }
}))
// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');


//使用各种各样的中间件
app.use(logger('dev'));//使用morgan包的logger，来记录http请求的日志  dev是日志格式之一
app.use(express.json());//解析传入请求中json格式的请求体
app.use(express.urlencoded({ extended: false }));//解析url编码的请求体
app.use(cookieParser());//解析http请求中的cookie
app.use(express.static(path.join(__dirname, 'public')));//是express.js能够提供静态文件服务，能够轻松的将前端资源部署到服务器上
app.use(cors({
  origin: true,
  credentials: true
}))//允许跨域

//  配置验证token接口

app.use(expressJWT.expressjwt({//  expressJWT是 JWT 验证中间件
  //process是nodejs的一个全局对象，无需通过require引入,
  //process包含许多方法，.env是其中的一个方法
  secret: md5(process.env.JWT_SECRET),//检测客户端token里面的秘钥和服务器端的秘钥是否一种
  algorithms: ["HS256"],//使用的加密算法
}).unless({
  //需要过滤的路由
  path: [
    { "url": "/api/admin/login", methods: ["POST"] },//登录
    { "url": "/api/admin/register", methods: ["POST"] },//注册
    { "url": "/api/admin/update", methods: ["PUT"] },//修改密码
    { "url": "/res/captcha", methods: ["GET"] },//获取验证码
    { "url": "/api/test", methods: ["POST"] },//上传文件
    // { "url": "/api/upload", methods: ["POST"] },//上传文件
  ]
}));



//使用路由中间件
//在这里调用路由层的东西
// app.use('/api/admin', adminRouter);
// app.use('/res/captcha', captchaRouter);
// app.use('/api/upload', uploadRouter);
// app.use('/api', testRouter);
//使用路由中间件
// localhost:3000/admin
// 上面是一个一级路由
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  console.log('有错误');
  next(createError(404));
});//错误处理的中间件

// error handler
//错误处理，一旦发生了错误就会到这里来
app.use(function (err, req, res, next) {
  console.log('有错误');
  if (err.name === "UnauthorizedError") {
    res.send(new ForbiddenError("未登录或者登录已经过期").toResponseJSON());
  } else if (err instanceof ForbiddenError) {
    res.send(err.toResponseJSON())
  } else {
    res.send({
      code: 500,
      message: err.message
    })
  }
});

module.exports = app;
