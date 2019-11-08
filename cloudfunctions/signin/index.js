// 云函数入口文件
const cloud = require('wx-server-sdk');
const db = cloud.database(); // 初始化数据库
const _ = db.command;

cloud.init();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  switch (event.action) {
    case 'count': {
      try {
        return await db.collection('userInfo')
          .where({
            _openid: wxContext.OPENID
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
    case 'today': {
      try {
        return await db.collection('userInfo')
          .where({
            _openid: wxContext.OPENID
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
  }
  

  
}