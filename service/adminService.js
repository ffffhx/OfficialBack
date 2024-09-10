//admin  模块的业务逻辑层

const md5 = require("md5");//md5加密
const { loginDao } = require("../dao/adminDao");// Data Access Object 用于操作数据库
const { registerDao } = require("../dao/adminDao");
const { updatePwdDao } = require("../dao/adminDao");
const jwt = require("jsonwebtoken")
module.exports.loginService = async function (loginInfo) {
    loginInfo.loginPwd = md5(loginInfo.loginPwd);//进行加密
    // await loginDao(loginInfo)//这一步是数据的验证，查询是否存在数据库里面
    let data = await loginDao(loginInfo);
    //登录成功后，需要将用户的信息和token返回给客户端
    if (data && data.dataValues) {
        //data是要返回给用户的信息
        data = {
            id: data.dataValues.id,
            loginId: data.dataValues.loginId,
        }
        //设置过期时间
        var loginPeriod = null;
        if (loginInfo.remember) {
            //如果用户勾选了登录七天，那么remember里面是
            //有值的，否则就是null，为1天
            loginPeriod = parseInt(loginInfo.remember)
        } else {
            loginPeriod = 1;
        }
        //生成token
        //token会包含很多信息，比如用户的信息，密钥，过期时长
        const token = jwt.sign(
            data,
            md5(process.env.JWT_SECRET),
            { expiresIn: 60 * 60 * 24 * loginPeriod }
        )
        // console.log(token);
        // console.log(data);
        //如果登录成功，那么就返回token和data
        return {
            token,
            data
        }
    }
    //如果没有登录成功，则返回不了token，只有data
    return { data }
    //向上面一层返回（调用它的那一层）  即表现层routes
}

//registerInfo实际上就是req.body
module.exports.registerService = async function (registerInfo) {
    registerInfo.loginPwd = md5(registerInfo.loginPwd);
    //registerDao是对数据库的增删改查
    // console.log(await registerDao(registerInfo),'<<<registerDao');
    let ifRegister = await registerDao(registerInfo);
    //如果注册过,ifRegister就是false
    //如果未注册过，那么ifRegister就是账号密码信息
    if (!ifRegister) {
        console.log("账号已经被注册过");
        return false
    } else {
        console.log("账号注册成功");
        ifRegister = {
            id: ifRegister.dataValues.id,
            loginId: ifRegister.dataValues.loginId
        }
        return { ifRegister }
    }
}

module.exports.updatePwdService = async function (updateInfo) {
    updateInfo.loginPwd = md5(updateInfo.loginPwd);
    updateInfo.newPwd = md5(updateInfo.newPwd);
    let ifUpdate = await updatePwdDao(updateInfo);
    console.log(ifUpdate, '<<<ifUpdate');
    if (ifUpdate) {
        return true
    } else {
        return false
    }
}