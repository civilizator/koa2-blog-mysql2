const userModel = require('../lib/mysql.js');
const md5 = require('md5')
const checkNotLogin = require('../middlewares/check.js').checkNotLogin
const checkLogin = require('../middlewares/check.js').checkLogin
const moment = require('moment');
const fs = require('fs')

exports.getSignUp = async (ctx) => {
    await checkNotLogin(ctx)
    await ctx.render('signup', {
        session: ctx.session
    })
}

exports.postSignUp = async (ctx) => {
    let { name, password, repeatpass, avatar } = ctx.request.body
    console.log(typeof password)
    await userModel.findDataCountByName(name)
        .then(async (result) => {
            console.log(result)
            if (result[0].count >= 1) {
                // User presence
                ctx.body = {
                    code: 500,
                    message: 'User presence'
                }
            } else if (password !== repeatpass || password.trim() === '') {
                ctx.body = {
                    code: 500,
                    message: 'Inconsistent password entered twice'
                }
            } else if(avatar && avatar.trim() === ''){
                ctx.body = {
                    code: 500,
                    message: 'Please upload an avatar'
                }
            } else {
                let base64Data = avatar.replace(/^data:image\/\w+;base64,/, ""),
                    dataBuffer = new Buffer(base64Data, 'base64'),
                    getName = Number(Math.random().toString().substr(3)).toString(36) + Date.now(),
                    upload = await new Promise((reslove, reject) => {
                        fs.writeFile('./public/images/' + getName + '.png', dataBuffer, err => {
                            if (err) {
                                throw err;
                                reject(false)
                            }
                            reslove(true)
                            console.log('Successful avatar upload')
                        });
                    });
                // console.log('upload', upload)
                if (upload) {
                    await userModel.insertData([name, md5(password), getName + '.png', moment().format('YYYY-MM-DD HH:mm:ss')])
                        .then(res => {
                            console.log('registration success', res)
                            //registration success
                            ctx.body = {
                                code: 200,
                                message: 'registration success'
                            }
                        })
                } else {
                    console.log('Avatar upload failed')
                    ctx.body = {
                        code: 500,
                        message: 'Avatar upload failed'
                    }
                }
            }
        })
}