/**
 * 通用工具函数
 */
// const jwt = require("koa-jwt");
// const jwt = require("jsonwebtoken");
const log4js = require("./log4j.js");
const CODE = {
  SUCCESS: 200,
  PARAM_ERROR: 10001, // 参数错误
  USER_ACCOUNT_ERROR: 20001, //账号或密码错误
  USER_LOGIN_ERROR: 30001, // 用户未登录
  BUSINESS_ERROR: 40001, //业务请求失败
  AUTH_ERROR: 500001 // 认证失败或TOKEN过期
};

module.exports = {
  /**
   * 分页结构封装
   * @param {number} pageNum
   * @param {number} pageSize
   */
  pager({ pageNum = 1, pageSize = 10 }) {
    // 乘以1转化成数字
    pageNum *= 1;
    pageSize *= 1;
    // 计算下一个索引是多少,即第二页从哪一个索引开始
    const skipIndex = (pageNum - 1) * pageSize;
    return {
      page: {
        pageNum,
        pageSize
      },
      skipIndex
    };
  },
  success(data = "", msg = "", code = CODE.SUCCESS) {
    // log4js.debug(data);
    return {
      code,
      data,
      msg
    };
  },
  fail(msg = "", code = CODE.BUSINESS_ERROR, data = "") {
    log4js.debug(msg);
    return {
      code,
      data,
      msg
    };
  },
  CODE
  // // 解密方法
  // decoded(authorization) {
  //   if (authorization) {
  //     let token = authorization.split(" ")[1];
  //     return jwt.verify(token, "regin");
  //   }
  //   return "";
  // },
  // 递归拼接菜单树形列表
  // getTreeMenu(rootList, id, list) {
  //   // 将所有数据放入list
  //   for (let i = 0; i < rootList.length; i++) {
  //     let item = rootList[i];
  //     if (String(item.parentId.slice().pop()) == String(id)) {
  //       list.push(item._doc);
  //     }
  //   }
  //   // 一级菜单
  //   list.map((item) => {
  //     item.children = [];
  //     // 遍历二级菜单
  //     this.getTreeMenu(rootList, item._id, item.children);
  //     if (item.children.length == 0) {
  //       delete item.children;
  //     } else if (item.children.length > 0 && item.children[0].menuType == 2) {
  //       // 快速区分菜单和按钮,用于后期菜单按钮权限控制
  //       item.action = item.children;
  //       // delete item.children;
  //     }
  //   });

  //   return list;
  // }
};
