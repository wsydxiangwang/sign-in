// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database(); // 初始化数据库
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {

  console.log(event)

  switch (event.action){
    case 'like':{
      try {
        return await db.collection('comment')
          .where({
            _id: event.id
          })
          .update({
            data: {
              like: _.inc(1)
            }
          })
      } catch (e) {
        console.error(e)
      }
    }
    case 'comment':{
      try {
        return await db.collection('comment')
          .where({
            _id: event.id
          })
          .update({
            data: {
              comment: _.push(event.commentData)
            }
          })
      } catch (e) {
        console.error(e)
      }
    }
    default: {
      return
    }
  }
}
