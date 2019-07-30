const router = require('koa-router')()
const controller = require('../controller/c-signup')

// registration page
router.get('/signup', controller.getSignup)

// post registered
router.post('/signup', controller.postSignup)

module.exports = router
