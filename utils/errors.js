



// 自定义错误
//当错误发生的时候，捕获到发生的错误，然后抛出自定义的错误


const formatResponse = require('./tool').formatResponse
//业务处理错误基类
class ServiceError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
    }

    //方法
    //格式化的返回错误信息
    toResponseJSON() {
        return formatResponse(this.code, this.message, null)
    }
}
// throw new ServiceError('aaa', 1000);
exports.UploadError = class extends ServiceError {
    constructor(message) {
        super(message, 413)
    }
}
// new UploadError('上传文件过大')
exports.ForbiddenError = class extends ServiceError {
    constructor(message) {
        super(message, 401)
    }
}
exports.ValidationError = class extends ServiceError {
    constructor(message) {
        super(message, 406)
    }
}
exports.NotFoundError = class extends ServiceError {
    constructor() {
        super('not found', 406)
    }
}
// new NotFoundError("没有找到")
exports.UnKownError = class extends ServiceError {
    constructor() {
        super('server internal error', 5000)
    }
}
module.exports.ServiceError = ServiceError