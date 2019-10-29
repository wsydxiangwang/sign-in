// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database(); // 初始化数据库
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  try {
    return await db.collection('today').doc(event._id)
      .update({
        data: {
          data: _.push(event.dataList)
        }
      })
      .then(res =>{
        console.log('云排行榜更新成功')
      })
      .catch(err => {
        console.log('云排行榜失败')
      })
  } catch (e) {
    console.error(e)
  }

}
