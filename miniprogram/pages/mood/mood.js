const db = wx.cloud.database(); // 初始化数据库
const app = getApp(); // 获取全局数据

Page({
  data: {
    commentList: [], // 心情列表
    swiperList: [], // 当前轮播图片
    swiperCurrent: 0
  },
  // 查看当前图片组
  imageSwiper: function(e){
    let index = e.currentTarget.dataset.index;
    let image = this.data.commentList[index].image;

    // 获取当前图片数组
    this.setData({
      swiperList: image
    })

  },
  // 轮播图切换事件 定位指示点
  swiperChange: function(e){
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  // 关闭图片
  swiperClose: function(e){
    this.setData({
      swiperCurrent: 0,
      swiperList: []
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // 加载心情列表
    db.collection('comment')
    .get()
    .then(res => {
      this.setData({
        commentList: res.data
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