/**
 * 房源订单列表接口模块
 */
const router = require("koa-router")();
const Order = require("../models/orderSchema");
const util = require("../utils/util");
const log4j = require("../utils/log4j");
router.prefix("/order");

router.post("/add", async (ctx, next) => {
  try {
    // 查询所有数据
    const { orderId, personNumber, title, price, pictureUrl } =
      ctx.request.body;
    const res = await Order.findOne({ orderId }, "orderId");
    if (res) {
      const res1 = await Order.findOneAndUpdate(
        {
          orderId
        },
        {
          $set: {
            orderId,
            personNumber,
            title,
            price,
            pictureUrl
          }
        },
        { new: true, select: "orderId personNumber title price pictureUrl" }
      );
      let msg = "订单已存在,并更新";
      ctx.body = util.success(res1, msg);
    } else {
      const res2 = await Order.insertMany({
        orderId,
        personNumber,
        title,
        price,
        pictureUrl
      });
      let msg = "订单保存成功";
      ctx.body = util.success(res2, msg);
    }
  } catch (error) {
    ctx.body = util.fail(error.msg);
  }
});

router.get("/list", async (ctx, next) => {
  try {
    // 查询所有数据
    const res = await Order.find({});
    if (res) {
      let msg = "订单列表，查询成功";
      ctx.body = util.success(res, msg);
    } else {
      let msg = "订单列表，查询失败";
      ctx.body = util.success(res, msg);
    }
  } catch (error) {
    ctx.body = util.fail(error.msg);
  }
});

module.exports = router;
