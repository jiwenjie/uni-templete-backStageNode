/** 服务程序启动首页，相当于 Java 的 main 方法 */

// 实例化网络请求对象
const Koa = require('koa');

const bodyParser = require('koa-bodyparser');

// 控制器，内部实现注册了各个接口
const controller = require('./controller');

// 对返回格式内容的封装
const rest = require('./rest');

// 实例化网络请求对象
const app = new Koa();

// log request URL: 全局请求拦截，增加日志 log 埋点后在执行下一步方法
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    await next();
});

// static file support:
// let staticFiles = require('./static-files');
// app.use(staticFiles('/static/', __dirname + '/static'));

// parse request body: 本身 node 提供的 http 和 koa 无法解析浏览器请求发起的 json 格式内容，所以引入 bodyParser 插件进行处理
app.use(bodyParser());

// bind .rest() for ctx: 增加接口数据返回的注释部分
app.use(rest.restify());

// add controllers: 把后台实现的相关接口注册到路由中
app.use(controller());

// 设置后台服务监听端口
app.listen(8089);
console.log('app started at port 8089...');
