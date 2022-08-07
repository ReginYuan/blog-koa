const mongoose = require("mongoose");

const evaluateSchema = mongoose.Schema({
  id: Number, //id
  evaluateId: String,//评论文章id
  createdAt: String,//创建时间
  updatedAt: String,//更新时间
  body: String,
  author: {
    username: String,
    authorId: String,
    image: String,
    bio: String,
    following: Boolean
  }
});
module.exports = mongoose.model("evaluate", evaluateSchema, "evaluate");
