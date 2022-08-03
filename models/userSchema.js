const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: String, //用户名字
  email: String, //手机号
  password: String, //密码
  image: String, //用户头像
  status: {
    type: String,
    default: "0"
  } //登陆状态 1登录 0退出
});
module.exports = mongoose.model("users", userSchema, "users");
