const mongoose = require("mongoose");

const tagsSchema = mongoose.Schema({
  orderId: Number, //id
  tag: String //代码
});
module.exports = mongoose.model("tags", tagsSchema, "tags");
