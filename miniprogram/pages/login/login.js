const db = wx.cloud.database(); // 初始化数据库
const app = getApp(); // 获取全局数据

Page({
  data: {
    height: 0
  },
  bindGetUserInfo: function(e){
    wx.showLoading({
      title: '登录中...',
    })

    if (e.detail.userInfo) { // 授权成功，向数据库添加用户数据
      // 查找当前用户是否存在
      db.collection('userInfo').where({
        _openid: app.globalData.openId
      })
      .get().then(res => {
        if (res.data.length == 1) { // 用户存在，返回上一页

          app.onLaunch()
          
          wx.hideLoading()
          wx.showToast({
            icon: "none",
            title: '登录成功',
            duration: 2000
          })
          setTimeout(() => {
            const pages = getCurrentPages();
            const prePage = pages[pages.length - 2]
            prePage.onLoad()
            wx.switchTab({
              url: '/pages/index/index'
            });
          }, 2000)

        } else {// 用户不存在，添加
          
          db.collection('userInfo').add({
            data: {
              nickName: e.detail.userInfo.nickName,
              avatarUrl: e.detail.userInfo.avatarUrl, 
              gender: e.detail.userInfo.gender,
              addTime: app.dateFormat('YYYY-MM-DD HH:mm:ss'),
              lastTime: '',
              lastHours: '',
              runningDay: 0,
              longRunningDay: 0,
              count: 0, // 默认点赞天数
              timeList: []
            }
          }).then(res => {
            wx.hideLoading()
            wx.showToast({
              icon: "none",
              title: '登录成功',
              duration: 2000
            })
            setTimeout(() => {
              const pages = getCurrentPages();
              const prePage = pages[pages.length - 2]
              prePage.onLoad()
              wx.switchTab({
                url: '/pages/index/index'
              });
            }, 2000)
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
  back(e){
    wx.navigateBack();
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
    let top = wx.getMenuButtonBoundingClientRect().top;
    let _this = this;
    let titleBarHeight = 48;
    wx.getSystemInfo({
      success(res){
        if (res.platform.toLowerCase() == 'android'){
          titleBarHeight += 4;
        }
        let height = res.statusBarHeight + (titleBarHeight - 32)/2 + 6;
        _this.setData({
          height: height
        })
      }
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