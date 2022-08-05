/**
 * 用户接口模块
 */

const router = require("koa-router")();
const Users = require("../models/userSchema");
const util = require("../utils/util");
const log4j = require("../utils/log4j");
const jwt = require("jsonwebtoken");
router.prefix("/users");

router.post("/login", async (ctx, next) => {
  try {
    const { email, password } = ctx.request.body;
    const res = await Users.findOne(
      {
        email,
        password
      },
      "email status"
    );
    if (res) {
      const res1 = await Users.findOneAndUpdate(
        {
          email: email //Matching condition
        },
        {
          $set: {
            status: "1" //Updates the matched element in the array
          }
        },
        { new: true, select: "email status username image" }
      );
      let data = {};
      const token = jwt.sign(
        {
          data
        },
        "ReginYuan",
        { expiresIn: "1h" }
      );
      data = { token, ...res1 };
      let msg = "登陆成功";
      ctx.body = util.success(data, msg);
    } else {
      ctx.body = util.fail("账号或密码不正确");
    }
  } catch (error) {
    ctx.body = util.fail(error.msg);
  }
});

/**
 * 注册用户
 */
router.post("/sign", async (ctx, next) => {
  try {
    const { username, email, password } = ctx.request.body;
    const res = await Users.findOne(
      {
        username,
        email,
        password
      },
      "email"
    );
    if (res && res.email == email) {
      let msg = "用户已存在,请输入新账号";
      let data = {};
      const existence = "old";
      data = { ...res, existence };
      ctx.body = util.success(data, msg);
    } else {
      const res1 = await Users.insertMany(
        { username, email, password },
        "username email password"
      );
      let msg = "注册成功,请登录";
      let data = {};
      const existence = "new";
      data = { ...res1, existence };
      ctx.body = util.success(data, msg);
    }
  } catch (error) {
    ctx.body = util.fail("注册失败", error.msg);
  }
});

/**
 * 用户退出
 */
router.post("/logout", async (ctx, next) => {
  try {
    const { email, password } = ctx.request.body;
    const res = await Users.findOneAndUpdate(
      {
        email: email //Matching condition
      },
      {
        $set: {
          status: "0" //Updates the matched element in the array
        }
      },
      { new: true, select: "email status" }
    );
    if (res) {
      let msg = "退出成功";
      ctx.body = util.success(res, msg);
    }
  } catch (error) {
    ctx.body = util.fail("退出失败", error.msg);
  }
});

module.exports = router;
