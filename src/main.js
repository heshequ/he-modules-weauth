const Koa = require('koa')
const OAuth = require('wechat-oauth')
const router = require('koa-router')()
const app = new Koa()

/**
 * 配置信息与client对象
 */
const appid = 'wx6c6398aa27bba6c6'
const secret = '1cff35124bd1875e17fc840682025077'
const scope = 'snsapi_userinfo'
const redirect = encodeURI('http://zihao.test.sgboke.com/openid/return')
const client = new OAuth(appid, secret)

/**
 * getUser Promise
 */
var getUser = function (code) {
  return new Promise(function(resolve, reject) {
    client.getUserByCode(code, function(err, result){
      if (err) reject(err)
      resolve(result)
    })
  })
}

/**
 * 进入
 * 取state，域名，跳转url，执行跳转
 */
router.get('/openid/enter', ctx => {
  var state = ctx.query.state
  var domain = ctx.header.host
  ctx.redirect(client.getAuthorizeURL(redirect, state, scope))
})

/**
 * 从微信返回
 */
router.get('/openid/return', async ctx => {
  // 取code, state
  var code = ctx.query.code
  var state = ctx.query.state

  // 取用户信息
  let user = await getUser(code)
  
  // 输出
  ctx.body = user
})

/**
 * 监听
 */
app.use(router.routes())
app.use(router.allowedMethods())
app.listen(5000)
