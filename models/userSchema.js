const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  mobile: String, //手机号
  password: String, //密码
  status: {
    type: String,
    default: "0"
  } //登陆状态 1登录 0退出
});
module.exports = mongoose.model("users", userSchema, "users");
