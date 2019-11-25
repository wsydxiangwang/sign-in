const db = wx.cloud.database(); // 初始化数据库
const app = getApp(); // 获取全局数据

Page({

  /**
   * 页面的初始数据
   */
  data: {
    moodData: '',
    replyData: '',
    replyName: ''
  },
  bindFormSubmit: function(e){

    wx.showLoading({
      title: '路途遥远，正在为你加快脚步中...',
    })

    let id;
    if (this.data.replyData){
      id = this.data.replyData.data._id;
    }else{
      id = this.data.moodData.data._id;
    } 

    let time = app.dateFormat('YYYY/MM/DD HH:mm');
    let _this = this;
    let commentData = {
      openId: app.globalData.openId,   // openid
      userName: app.globalData.nickName,   // 昵称
      avatarUrl: app.globalData.avatarUrl, // 头像
      content: e.detail.value.textarea,    // 内容
      createTime: db.serverDate(), // 服务端时间
      time: time,
      replyName: this.data.replyName 
    }

    // 更新数据库
    wx.cloud.callFunction({
      name: 'mood',
      data: {
        action: 'comment',
        id: id,
        commentData: commentData
      }
    }).then(res => {
      console.log('update: ' + res.result.stats.updated)

      wx.hideLoading()
      wx.showToast({
        icon: "none",
        title: '为对方的世界增添一个了闪光点～～',
        duration: 2000
      })
      setTimeout(() => {
        let data = {};
        if (this.data.replyData) {
          data.index = _this.data.replyData.index;
        }else{
          data.index = _this.data.moodData.index;
        }
        commentData.time = app.timestampFormat(time)
        data.data = commentData;
        getApp().globalData.newComment = data;
        wx.switchTab({
          url: '/pages/mood/mood'
        })
      }, 2000)

    }).catch(err => {
      console.log(err)
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel();
    const _this = this;
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      _this.setData({
        moodData: data
      })
    })
    eventChannel.on('replyPageData', (data) => {
      this.setData({
        replyData: data,
        replyName: data.data.comment[data.indexs].userName
      })
    })
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