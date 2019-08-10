const router = require('koa-router')()
const controller = require('../controller/c-signup')

// registration page
router.get('/signup', controller.getSignUp)

// post registered
router.post('/signup', controller.postSignUp)

module.exports = router
