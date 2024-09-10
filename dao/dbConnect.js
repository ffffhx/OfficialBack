
//该文件负责连接数据库







const { Sequelize, Model } = require('sequelize');
// const sequelizeConnection = new Sequelize(
//     process.env.DB_NAME,//数据库名称
//     process.env.DB_USER,//数据库用户名
//     process.env.DB_PASS,//数据库密码
//     {
//         host: process.env.DB_HOST,//指定数据库服务器的主机地址
//         dialect: 'mysql',//指定使用的数据库类型
//         logging: false//禁用sequelize的日志记录
//     });

const sequelizeConnection = new Sequelize(
    'environment',
    'root',
    'yx1shxr.',
    {
        host: process.env.DB_HOST,//指定数据库服务器的主机地址
        dialect: 'mysql',//指定使用的数据库类型
        logging: false//禁用sequelize的日志记录
    }
)
//向外暴露这个连接实例
module.exports = sequelizeConnection