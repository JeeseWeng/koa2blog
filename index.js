// index.js
const Koa = require('koa')
const path = require('path')
const views = require('koa-views')
const serve = require('koa-static')
const session = require('koa-session')
const flash = require('./middlewares/flash')
const error = require('./middlewares/error_handler')
const bodyParser = require('koa-bodyparser')
const mongoose = require('mongoose')
const marked = require('marked')
const router = require('./routes')
const CONFIG = require('./config/config')

mongoose.connect(CONFIG.mongodb, {
    useCreateIndex: true,
    useNewUrlParser: true
})//数据库配置

marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false
})

const app = new Koa()

app.use(error())

app.use(serve(
    path.join(__dirname, 'public')
))

app.use(views(path.join(__dirname, 'views'), {
    map: { html: 'nunjucks' }
}))

app.keys = ['somethings']

app.use(session({
    key: CONFIG.session.key,
    maxAge: CONFIG.session.maxAge
}, app))

app.use(flash())

app.use(bodyParser())

app.use(async (ctx, next) => {
    ctx.state.ctx = ctx
    ctx.state.marked = marked
    await next()
})

app.on('error', (err, ctx) =>
    console.error('server error', err)
)


router(app)

app.listen(3000, () => {
    console.log('server is running at http://localhost:3000')
})