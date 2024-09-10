//dao这个文件夹负责和数据库打交道，数据库的增删改查




const adminModel = require('./model/adminModel') //引入model
//adminModel 是一个Sequelize模型，代表数据库中的一个表（通常是管理员表）。
console.log('进入了与数据库打交道');

//登录
//前端需要传过来:
// {
//     loginId:string,
//     loginPwd:string,
// }
module.exports.loginDao = async function (loginInfo) {
    // loginInfo.loginPwd = md5(loginInfo.loginPwd);
    return await adminModel.findOne({
        //where 子句指定查询的条件
        where: {
            loginId: loginInfo.loginId,
            loginPwd: loginInfo.loginPwd
        }
    })
    // console.log(result);
}

//注册
//前端需要传过来:
// {
//     loginId:string,
//     loginPwd:string,
// }
module.exports.registerDao = async function (registerInfo) {
    const ifStay = await adminModel.findOne({
        where: {
            loginId: registerInfo.loginId
        }
    })//如果注册过了那就是true
    if (ifStay) {
        return false//如果已经注册成功，那么返回false
    } else {
        return await adminModel.create({
            loginId: registerInfo.loginId,
            loginPwd: registerInfo.loginPwd
        });
    }
}

//修改密码
//前端需要传过来:
// {
//     loginId:string,
//     loginPwd:string,
//     newPwd:string
// }
//逻辑是通过提供旧的密码，来给出新的密码
module.exports.updatePwdDao = async function (updateInfo) {
    //可以利用登录的loginDao来从查询
    return await adminModel.update({
        loginPwd: updateInfo.newPwd,//updateInfo.newPwd//第一个参数代表的是要更新的值
    }, {
        where: {//where代表的是查询条件
            loginId: updateInfo.loginId,
            loginPwd: updateInfo.loginPwd
        }
    })
        .then(result => {
            if (result == 0) {
                console.log("修改密码失败");
                return false
            } else {
                console.log("修改密码成功");
                return true
            }
        })
        .catch(err => {
            console.log(err);
            return false
        })
}