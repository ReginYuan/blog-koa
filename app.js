const Koa = require("koa");
const app = new Koa();
const views = require("koa-views");
const json = require("koa-json");
const onerror = require("koa-onerror");
const bodyparser = require("koa-bodyparser");
const jwt = require("jsonwebtoken");
const logger = require("koa-logger");
const koajwt = require("koa-jwt");
const log4j = require("./utils/log4j");
const router = require("koa-router")();
const users = require("./routes/users");
const article = require("./routes/article");
const tags = require("./routes/tags");
const evaluate = require("./routes/evaluate");
const util = require("./utils/util");

// error handler
onerror(app);
// 加载数据库
require("./config/db");
// middlewares
app.use(
  bodyparser({
    enableTypes: ["json", "form", "text"]
  })
);
app.use(json());
app.use(logger());
app.use(require("koa-static")(__dirname + "/public"));

app.use(
  views(__dirname + "/views", {
    extension: "pug"
  })
);

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  const ms = new Date() - start;
  log4j.info(`${ctx.method} ${ctx.url} - ${ms}ms`);
  log4j.info(`get query:${JSON.stringify(ctx.request.query)}`);
  log4j.info(`post body:${JSON.stringify(ctx.request.body)}`);
  log4j.info(`post params:${JSON.stringify(ctx.params)}`);
  log4j.info(`log output info`);
  await next().catch((err) => {
    if (err.status == "401") {
      ctx.status = 200;
      ctx.body = util.fail("Token认证失败", util.CODE.AUTH_ERROR);
    } else {
      return err;
    }
  });
  //设置允许跨域
  ctx.set("Access-Control-Allow-Origin", "*");
  // 表明服务器支持所有头信息字段
  ctx.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild"
  );
  // Content-Type表示具体请求中的媒体类型信息
  ctx.set("Content-Type", "application/json;charset=utf-8");
  // 允许HTTP请求的方法
  ctx.set("Access-Control-Allow-Methods", "OPTIONS,GET,PUT,POST,DELLETE");
});
// secret:密钥 unless:设置不校验的接口
// /^\/api\/users\/login/ || /^\/api\/users\/sign/
app.use(
  koajwt({ secret: "ReginYuan" }).unless({
    path: [/^\/api\/users\/login||sign/]
  })
);
router.prefix("/api");

// 加载用户路由
router.use(users.routes(), users.allowedMethods());
// 加载文章路由
router.use(article.routes(), article.allowedMethods());
// 加载标签路由
router.use(tags.routes(), tags.allowedMethods());
// 加载订单路由
router.use(evaluate.routes(), evaluate.allowedMethods());
// 一级路由
app.use(router.routes(), router.allowedMethods());
// error-handling
app.on("error", (err, ctx) => {
  console.error("server error", err, ctx);
  log4j.error(`${err.stack}`);
});

module.exports = app;
