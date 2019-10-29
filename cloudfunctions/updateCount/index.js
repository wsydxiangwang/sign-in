// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database(); // 初始化数据库
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {

  try {
    return await db.collection('userInfo')
    .where({
      _openid: event.openid
    })
    .update({
      data: {
        count: _.inc(1),
        lastTime: event.lastTime
      }
    })
  } catch (e) {
    console.error(e)
  }

}
