/**
 * 评论接口模块
 */

const router = require("koa-router")();
const Evaluate = require("../models/evaluateSchema");
const util = require("../utils/util");
const log4j = require("../utils/log4j");
const jwt = require("jsonwebtoken");
router.prefix("/evaluate");

router.get("/:slug/list", async (ctx, next) => {
  try {
    const { slug } = ctx.params;
    const res = await Evaluate.find({
      evaluateId: slug
    });
    if (res) {
      let msg = "获取评论成功";
      ctx.body = util.success(res, msg);
    } else {
      ctx.body = util.fail("暂无评论");
    }
  } catch (error) {
    ctx.body = util.fail(error.msg);
  }
});

module.exports = router;