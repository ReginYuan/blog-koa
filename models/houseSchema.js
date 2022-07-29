const mongoose = require("mongoose");

const houseSchema = mongoose.Schema({
  id: Number, //id
  price: Number,//价格
  title: String, //标题
  pictureUrl: String, //图片
  cityCode:String, //城市
  detail: {
    imgs: Array,
    info: Object,
    owner:Object
  } //民宿详情
});
module.exports = mongoose.model("house", houseSchema, "house");
