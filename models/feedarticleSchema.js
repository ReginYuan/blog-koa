const mongoose = require("mongoose");

const feedarticleSchema = mongoose.Schema({
  id: Number, //id
  username: String, //标题
  favoritedId: Array, //喜欢文章集合
  followingId: Array, //喜欢作者集合
});
module.exports = mongoose.model("feedarticle", feedarticleSchema, "feedarticle");
