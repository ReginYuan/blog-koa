const mongoose = require("mongoose");

const articleSchema = mongoose.Schema({
  id: Number, //id
  slug: String,
  title: String, //标题
  description: String,
  body: String,
  tagList: Array,
  createdAt: String,//创建时间
  updatedAt: String,//更新时间
  favorited: Boolean,//
  favoritesCount: Number,
  author: {
    username: String,
    authorId: String,
    image: String,
    bio: String,
    following: Boolean
  }
});
module.exports = mongoose.model("article", articleSchema, "article");
