const Koa = require('koa');
const path = require('path')
const bodyParser = require('koa-bodyparser');
const ejs = require('ejs');
const session = require('koa-session-minimal');
const MysqlStore = require('koa-mysql-session');
const config = require('./config/default.js');
const router = require('koa-router')
const views = require('koa-views')
// const koaStatic = require('koa-static')
const staticCache = require('koa-static-cache')
const app = new Koa()


// Session storage configuration
const sessionMysqlConfig = {
    user: config.database.USERNAME,
    password: config.database.PASSWORD,
    database: config.database.DATABASE,
    host: config.database.HOST,
}

// Configuring session middleware
app.use(session({
    key: 'USER_SID',
    store: new MysqlStore(sessionMysqlConfig)
}))


// Configuring static resource loading middleware
// app.use(koaStatic(
//   path.join(__dirname , './public')
// ))
// Cache
app.use(staticCache(path.join(__dirname, './public'), {dynamic: true}, {
    maxAge: 365 * 24 * 60 * 60
}))

app.use(staticCache(path.join(__dirname, './images'), {dynamic: true}, {
    maxAge: 365 * 24 * 60 * 60
}))

// Configuring server template rendering engine middleware
app.use(views(path.join(__dirname, './views'), {
    extension: 'ejs'
}))

app.use(bodyParser({
    formLimit: '1mb'
}))

//  routing
app.use(require('./routers/signin.js').routes())
app.use(require('./routers/signup.js').routes())
app.use(require('./routers/posts.js').routes())
app.use(require('./routers/signout.js').routes())


app.listen(config.port)

console.log(`listening on port http://127.0.0.1:${config.port}`)
