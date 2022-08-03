/**
 * 标签列表接口模块
 */
const router = require("koa-router")();
const Tags = require("../models/tagsSchema");
const util = require("../utils/util");
const log4j = require("../utils/log4j");
router.prefix("/tags");

router.post("/add", async (ctx, next) => {
  try {
    // 查询所有数据
    const { id, tag } = ctx.request.body;
    const res = await Tags.findOne({ orderId }, "orderId");
    if (res) {
      const res1 = await Tags.findOneAndUpdate(
        {
          id
        },
        {
          $set: {
            id,
            tag
          }
        },
        { new: true, select: "id tag" }
      );
      let msg = "标签已存在,并更新";
      ctx.body = util.success(res1, msg);
    } else {
      const res2 = await Tags.insertMany({
        id,
        tag
      });
      let msg = "标签保存成功";
      ctx.body = util.success(res2, msg);
    }
  } catch (error) {
    ctx.body = util.fail(error.msg);
  }
});

router.get("/list", async (ctx, next) => {
  try {
    // 查询所有标签数据
    const res = await Tags.find({});
    if (res) {
      let msg = "标签列表，查询成功";
      ctx.body = util.success(res, msg);
    } else {
      let msg = "标签列表，查询失败";
      ctx.body = util.success(res, msg);
    }
  } catch (error) {
    ctx.body = util.fail(error.msg);
  }
});

module.exports = router;
