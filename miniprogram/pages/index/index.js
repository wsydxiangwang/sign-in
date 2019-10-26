const db = wx.cloud.database(); // 初始化数据库
const app = getApp(); // 获取全局数据

Page({

  // 点击签到
  singnin: function(e){
    var myDate = new Date(),
      year = myDate.getFullYear(),
      month = myDate.getMonth() + 1,
      day = myDate.getDate(),
      hours = myDate.getHours(),
      min = myDate.getMinutes(),
      sec = myDate.getSeconds();

    // 时间为单位数时，前面添加0
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;
    hours = hours < 10 ? '0' + hours : hours;
    min = min < 10 ? '0' + min : min;
    sec = sec < 10 ? '0' + sec : sec;

    var currentTime = `${year}-${month}-${day} ${hours}:${min}:${sec}`;

    if (hours >= 0 && hours < 5) {
      // 未到签到时间
      wx.showToast({
        title: '未到签到时间',
        icon: 'success',
        duration: 2000
      })
      return;
    } else if (hours >= 8 && hours < 24) {
      // 签到时间已过
      wx.showToast({
        title: '签到时间已过',
        icon: 'success',
        duration: 2000
      })
      return;
    } else {
      console.log('签到时间')
    }

    // 获取当前用户的签到次数
    db.collection('signinCount').where({
      _openid: app.globalData.openId
    })
    .get().then(res => {

      if (res.data.length == 1) { // 用户存在，开始签到

        // 调用云函数进行更新

        wx.cloud.callFunction({
          name: 'updateCount',
          data: {
            openid: app.globalData.openId
          }
        }).then(res => {
          console.log('签到成功')
          console.log(res)
        }).catch(err =>{
          console.log('签到失败')
          console.log(err)
        })
        
      } else { // 用户不存在，添加签到

        db.collection('signinCount').add({
          data: {
            count: 1 //默认签到1天
          }
        }).then(res => {
          console.log('第一次签到成功')
        }).catch(err => {
          console.log('第一次签到失败')
        })

      }
    })
  },
  /**
   *  监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
