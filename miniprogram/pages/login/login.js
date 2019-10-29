const db = wx.cloud.database(); // 初始化数据库
const app = getApp(); // 获取全局数据

Page({

  bindGetUserInfo: function(e){

    if (e.detail.userInfo) { // 授权成功，向数据库添加用户数据
      // 查找当前用户是否存在
      db.collection('userInfo').where({
        _openid: app.globalData.openId
      })
      .get().then(res => {
        if (res.data.length == 1) { // 用户存在，返回上一页

          app.onLaunch()
          
          wx.navigateBack()

        } else {// 用户不存在，添加
          
          db.collection('userInfo').add({
            data: {
              nickName: e.detail.userInfo.nickName,
              avatarUrl: e.detail.userInfo.avatarUrl, 
              gender: e.detail.userInfo.gender,
              addTime: app.globalData.currentDate,
              lastTime: 0,
              count: 0 // 默认点赞天数
            }
          }).then(res => {
            wx.navigateBack()
            console.log('添加用户成功')
          }).catch(err => {
            console.log('添加用户失败')
          })

          app.onLaunch();

        }
      })
      .catch(err => {
        console.log(err)
      })
      
      
    } else {
      console.log('授权拒绝')
      wx.showToast({
        title: '请允许授权登录！',
        icon: 'none',
        duration: 3000
      })
    }
  },
  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
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