/**
 * 所有文章接口模块
 */

const router = require("koa-router")();
const Article = require("../models/articleSchema");
const Feedarticle = require("../models/feedarticleSchema");
const util = require("../utils/util");
const log4j = require("../utils/log4j");
router.prefix("/article");

router.get("/all", async (ctx, next) => {
  try {
    // 查询所有数据
    const { pageNum, pageSize, tag } = ctx.request.query;
    const query = Article.find({ tag });
    // 根据前端数据快速查询页面和下一个索引
    const { page, skipIndex } = util.pager(pageNum, pageSize);
    // 统计数据总条数
    let total = await Article.countDocuments({ tag });
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
      let msg = "文章列表信息";
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

// 关注人的文章
router.get("/feed", async (ctx, next) => {
  try {
    // 查询所有数据
    const { pageNum, pageSize, tag, email } = ctx.request.query;
   
    const res = await Feedarticle.find({ email });
   
    let { followingId } = res[0];
  
    const query = Article.find({
      $and: [{ tag }, { authorId: { $in: followingId } }]
    });

    // 统计数据总条数
    let total = await Article.countDocuments({
      $and: [{ tag }, { authorId: { $in: followingId } }]
    });
  
    // 根据前端数据快速查询页面和下一个索引
    const { page, skipIndex } = util.pager(pageNum, pageSize);

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
      let msg = "关注文章列表信息";
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

// 文章详情
router.get("/detail", async (ctx, next) => {
  try {
    // 查询所有数据
    const { id } = ctx.request.query;
    const res = await Article.find({ id });
    log4j.info("res", `get params:${JSON.stringify(res)}`);
    if (res) {
      let msg = "文章详情信息";
      ctx.body = util.success(res, msg);
    } else {
      ctx.body = util.fail("获取文章详情数据失败");
    }
  } catch (error) {
    ctx.body = util.fail(error.msg);
  }
});

module.exports = router;
