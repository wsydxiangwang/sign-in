// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();

const db = cloud.database(); // 初始化数据库
const _ = db.command;

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
              lastTime: event.lastTime,
              lastHours: event.lastHours,
              runningDay: event.runningDay, 
              longRunningDay: event.longRunningDay,
              // timeList: _.push(event.timeList)
            }
          })
      } catch (e) {
        console.error(e)
      }
    }
    case 'today': {
      try {
        return await db.collection('today')
          .doc(event._id)
          .update({
            data: {
              data: _.push(event.dataList)
            }
          })
      } catch (e) {
        console.error(e)
      }
    }
    // 今日排行榜点赞
    case 'like': {
      let arr = 'data.' + event.index + '.like';
      try {
        return await db.collection('today')
          .doc(event._id)
          .update({
            data: {
              [arr]: _.inc(1)
            }
          })
      } catch (e) {
        console.error(e)
      }
    }
  }
  

  
}