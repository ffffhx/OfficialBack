
//这里面用于存放和管理员相关的数据模型
//sequelize是一个orm(Object Relational Mapping)框架
//这个框架让我们在具体操作数据库的时候不必去和复杂的SQL语句打交道，
//只要像平常操作对象一样操作他就可以了
const { DataTypes } = require('sequelize')
//引入这个连接实例
const sequelizeConnection = require('../dbConnect.js')
//通过define来定义数据模型
//和表名是关联在一起的
//里面的参数是表的各种字段

console.log('进入到了adminModel');

//这些代码的作用是创建一个表
module.exports = sequelizeConnection.define('test', {
    loginId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    loginPwd: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    freezeTableName: true,//禁用自动复数化表名
    createdAt: false,//禁用createdAt字段  这个字段来存放创建时间的时间戳
    updatedAt: false//禁用updateAT字段   来存放更新时间的时间戳
})
