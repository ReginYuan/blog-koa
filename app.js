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
const house = require("./routes/house");
const order = require("./routes/order");
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
  log4j.info(`get params:${JSON.stringify(ctx.request.query)}`);
  log4j.info(`post params:${JSON.stringify(ctx.request.body)}`);
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
// 加载民宿路由
router.use(house.routes(), house.allowedMethods());
// 加载订单路由
router.use(order.routes(), order.allowedMethods());
// 一级路由
app.use(router.routes(), router.allowedMethods());
// error-handling
app.on("error", (err, ctx) => {
  console.error("server error", err, ctx);
  log4j.error(`${err.stack}`);
});

module.exports = app;
