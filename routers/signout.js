const router = require('koa-router')()

router.get('/signout', async (ctx, next) => {
    ctx.session = null;
    console.log('Logout success')
    ctx.body = true
})

module.exports = router
