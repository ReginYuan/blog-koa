/**
 * 数据库连接
 */

const mongoose = require("mongoose");
const config = require("./index");
const log4j = require('../utils/log4j')


//连接数据库
mongoose.connect(config.URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// 获取mongoose连接对象
const db = mongoose.connection;

db.on("error", () => {
  log4j.error('***数据库连接失败***')
});

db.on("open", () => {
  log4j.info('***数据库连接成功***')
});

