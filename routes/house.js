/**
 * 所有民宿接口模块
 */

const router = require("koa-router")();
const House = require("../models/houseSchema");
const util = require("../utils/util");
const log4j = require("../utils/log4j");
router.prefix("/house");

router.get("/all", async (ctx, next) => {
  try {
    // 查询所有数据
    const { pageNum, pageSize, cityCode } = ctx.request.query;
    const query = House.find({ cityCode });
    // 根据前端数据快速查询页面和下一个索引
    const { page, skipIndex } = util.pager(pageNum, pageSize);
    // 统计数据总条数
    let total = await House.countDocuments({ cityCode });
    let list;
    // 从skipIndex开始查询数据,page.pageSize条数据
    let skipNum = total - (pageNum - 1) * pageSize;
    // 如果查询的数据小于十条就按正常的数据查询返回
    if (skipNum > 10) {
      list = await query.skip(skipIndex).limit(page.pageSize);
    } else {
      // 如果查询的数据大于十条就按十条查询返回
      list = await query.skip(skipIndex).limit(skipNum);
    }

    if (query) {
      let msg = "民宿列表信息";
      ctx.body = util.success(
        {
          page: {
            ...page,
            total
          },
          list
        },
        msg
      );
    } else {
      ctx.body = util.fail("获取数据失败");
    }
  } catch (error) {
    ctx.body = util.fail(error.msg);
  }
});

// 名宿详情
router.get("/detail", async (ctx, next) => {
  try {
    // 查询所有数据
    const { id } = ctx.request.query;
    const res = await House.find({ id });
    log4j.info("res", `get params:${JSON.stringify(res)}`);
    if (res) {
      let msg = "民宿详情信息";
      ctx.body = util.success(
        res,
        msg
      );
    } else {
      ctx.body = util.fail("获取民宿列表数据失败");
    }
  } catch (error) {
    ctx.body = util.fail(error.msg);
  }
});

module.exports = router;
