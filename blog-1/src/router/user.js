const login = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const { set } = require('../db/redis')

const handleUserRouter = (req, res) => {
    const method = req.method // GET POST

    const path = req.path
    if(method === 'POST' && path === '/api/user/login') {
        const { username, password } = req.body
        // const { username, password } = req.query
        const result = login(username, password)
        return result.then(data => {
            if(data.username) {
                // 设置 session
                req.session.username = data.username
                req.session.realname = data.realname
                console.log('req.session is ', req.session)
                // 同步到redis中
                set(req.sessionId, req.session)
                // 操作cookie
                // res.setHeader('Set-cookie', `username=${data.username};path=/`)
                return new SuccessModel()
            }
            return new ErrorModel('登录失败')
        })
    }

    // 登录验证的测试
    // if(method === 'GET' && req.path === '/api/user/login-test') {
    //     console.log('req.cookie.username', req.cookie)
    //     if(req.session.username) {
    //         return Promise.resolve(new SuccessModel({
    //             session: req.session
    //         }))
    //     }else {
    //         return Promise.resolve(new ErrorModel('尚未登录'))
    //     }
    // }
}

module.exports = handleUserRouter