const db = wx.cloud.database(); // 初始化数据库
const app = getApp(); // 获取全局数据

Page({
  data:{
    tempImg: [],  // 临时图片存储
  },
  uploadImgHandle: function(e){
    // 选择图片
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res){
        // this.setData({
        //   tempImg: res.tempFilePaths
        // })
        const tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths)
        wx.cloud.uploadFile({
          cloudPath: new Date().getTime() + '.png', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          success(res) {
            console.log(res.fileID)
          },
          fail(err){
            console.log(err)
          }
        })
      }
    })
  },
  // 发布心情
  bindFormSubmit: function (e) {
    let data = {
      openId: app.globalData.openId,       // ID
      userName: app.globalData.nickName,   // 昵称
      avatarUrl: app.globalData.avatarUrl, // 头像
      time: app.globalData.currentDate,    // 时间
      content: e.detail.value.textarea,    // 内容
      like: 0,      // 点赞
      comment: [],  // 评论
    }

    // 获取用户信息
    wx.getSetting({
      complete: function (res) {
        if (res.authSetting['scope.userInfo']) { // 已授权

          // 添加评论到数据库
          db.collection('comment').add({
            data: data
          }).then(res => {
            console.log('发表成功')
          }).catch(err => {
            console.log('发表失败')
            console.log(err)
          })

        } else {
          console.log('请登录')
        }
      }
    })

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