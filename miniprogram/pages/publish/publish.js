const db = wx.cloud.database(); // 初始化数据库
const app = getApp(); // 获取全局数据

Page({
  data:{
    tempImg: [],  // 临时图片存储
    uploadImg: []  // 准备上传的图片集合
  },
  // 上传图片到页面
  uploadImgHandle: function(e){
    let _this = this;
    // 选择图片
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res){
        let tempFilePaths = res.tempFilePaths; // 临时图片
        // 如果有图片 则累加
        if (_this.data.tempImg) {
          let tempImgAdd = _this.data.tempImg.concat(tempFilePaths);
          _this.data.uploadImg = tempImgAdd;  // 添加到准备上传图片的列表
          // 更新页面图片
          _this.setData({
            tempImg: tempImgAdd
          })
        } else {
          _this.data.uploadImg = tempFilePaths;  // 添加到准备上传图片的列表
          // 图片显示到页面
          _this.setData({
            tempImg: tempFilePaths
          })
        }
      }
    })
    console.log(this.data.tempImg.length)
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
      image: this.data.uploadImg
    }

    console.log(data)

    // 获取用户信息
    // wx.getSetting({
    //   complete: function (res) {
    //     if (res.authSetting['scope.userInfo']) { // 已授权

    //       // 添加评论到数据库
    //       db.collection('comment').add({
    //         data: data
    //       }).then(res => {
    //         console.log('发表成功')
    //       }).catch(err => {
    //         console.log('发表失败')
    //         console.log(err)
    //       })

    //     } else {
    //       console.log('请登录')
    //     }
    //   }
    // })

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