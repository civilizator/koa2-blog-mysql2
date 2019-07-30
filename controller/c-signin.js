const userModel = require('../lib/mysql.js')
const md5 = require('md5')
const checkNotLogin = require('../middlewares/check.js').checkNotLogin
const checkLogin = require('../middlewares/check.js').checkLogin

exports.getSignin = async (ctx) => {
    if (await checkNotLogin(ctx) === true) {
        await ctx.render('signin', {
            session: ctx.session,
        })
    }
}

exports.postSignin = async (ctx) => {
    let {name, password} = ctx.request.body
    await userModel.findDataByName(name)
        .then(result => {
            let res = result
            if (res.length && name === res[0]['name'] && md5(password) === res[0]['pass']) {
                ctx.session = {
                    user: res[0]['name'],
                    id: res[0]['id']
                }
                ctx.body = {
                    code: 200,
                    message: 'Login successful'
                }
                console.log('ctx.session.id', ctx.session.id)
                console.log('session', ctx.session)
                console.log('Login successful')
            } else {
                ctx.body = {
                    code: 500,
                    message: 'Wrong user name or password'
                }
                console.log('Wrong user name or password!')
            }
        }).catch(err => {
            console.log(err)
        })
}