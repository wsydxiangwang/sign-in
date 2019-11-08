const db = wx.cloud.database(); // 初始化数据库
const app = getApp(); // 获取全局数据

Page({

  /**
   * 页面的初始数据
   */
  data: {
    todayList: [], // 今日排行
    totalList: []  // 总排行榜
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // 获取当天排行榜
    db.collection('today').doc(app.dateFormat('YYYY-MM-DD'))
    .get()
    .then(res => {
      this.setData({
        todayList: res.data.data
      })
    })
    .catch(err => {
      console.log('今天还没有签到哦')
    })

    // db.collection('userInfo').get()
    // .then(res => {
    //   console.log(res)
    // })
    // .catch(err => {
    //   console.log(err)
    // })
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