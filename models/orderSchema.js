const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  orderId: Number, //id
  title: String, //标题
  personNumber: Number, //人数
  pictureUrl: String, //图片
  price: Number //价格
});
module.exports = mongoose.model("order", orderSchema, "order");
