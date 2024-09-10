//该文件负责对数据库进行一个初始化操作






// dao是数据持久层
// db.js
const sequelizeConnection = require("./dbConnect.js"); // 引入数据库连接实例
const adminModel = require("./model/adminModel"); // 各种数据模型
const md5 = require("md5");//md5加密
// 使用 new 关键字实例化类
// const modelInstance = new AdminModel();

(async function () {
    //将数据模型和表进行同步
    await sequelizeConnection.sync({//这是一个与数据库同步模型的命令
        alter: true//同步过程中允许对现有的表结构进行修改
    });
    //同步完成之后有一些表是要初始化一些数据
    //我们需要先查询这张表有没有内容，没有内容就进行初始化
    // const adminCount = await adminModel.count();//查询表里面有多少条数据
    // console.log(adminCount);
    // if (!adminCount) {
    //进入此if，说明该表没有数据，我们进行一个初始化
    await adminModel.create({
        loginId: "admin8908",   
        loginPwd: md5("123456"),
    })
    console.log("初始化管理员数据完毕(已经为您创建了一个表)");
    // }
    console.log('进入到了db.js');

})();
