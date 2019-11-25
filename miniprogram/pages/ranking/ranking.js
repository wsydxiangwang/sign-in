const db = wx.cloud.database(); // 初始化数据库
const app = getApp(); // 获取全局数据

let currentPage = 0, // 当前第几页 0表示第一页
    pageSize = 10;   // 每页显示的数据
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    todayList: [], // 今日排行
    totalList: [], // 总排行榜
    swiperHeight: 0,
    otherHeight: 0
  },
  // 点赞
  like: function(e){
    let _this = this;
    let index = e.currentTarget.dataset.index;
    let openid = this.data.todayList[index].openid;

    let num = this.data.todayList[index];
    let arr = 'todayList[' + index + '].like';
    let liked = 'todayList[' + index + '].liked';

    wx.getStorage({
      key: `rankLike-${openid}`,
      success(res) {
        // 已点赞
        wx.showToast({
          icon: "none",
          title: '每人只能给予一次鼓励哦～',
        })
        return false;
      },
      fail(err) {
        // 未点赞
        wx.setStorageSync(`rankLike-${openid}`, index); // 设置缓存

        _this.setData({  // 更新页面
          [arr]: num.like + 1,
          [liked]: true
        })
        console.log(num)

        wx.cloud.callFunction({
          name: 'signin',
          data: {
            action: 'like',
            index: index,
            _id: app.dateFormat('YYYY-MM-DD')
          }
        }).then(res => {
          console.log('update:', res.result.stats.updated)
        }).catch(err => {
          console.log(err)
        })
      }
    })
  },
  // 左右切换
  swiperTab: function (e) {
    this.setData({
      currentTab: e.detail.current
    });
  },
  swichNav: function(e){
    let current = e.target.dataset.current;
    if (this.data.currentTab == current){ 
      return false; 
    } else {
      this.setData({
        currentTab: current
      })
    }
  },
  // 获取已点赞
  liked(e) {
    let _this = this;
    wx.getStorageInfo({
      success(res) {
        let keyArr = res.keys;
        keyArr.forEach((item) => {
          wx.getStorage({
            key: item,
            success(res) {
              let index = res.data;
              let num = _this.data.todayList[index];
              console.log(num)
              let liked = 'todayList[' + index + '].liked';
              _this.setData({  // 更新页面
                [liked]: true
              })
              console.log(num)
            }
          })
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: 'loading',
    })
    // 获取当天排行榜
    db.collection('today').doc(app.dateFormat('YYYY-MM-DD'))
    .get()
    .then(res => {
      this.setData({
        todayList: res.data.data
      })
      this.liked(); // 加载已点赞
    })
    .catch(err => {
      console.log('今天还没有签到哦')
    })

    // 总排行榜
    db.collection('userInfo')
    .get()
    .then(res => {
      this.setData({
        totalList: res.data
      })

    })
    .catch(err => {
      console.log(err)
    })

    var height = wx.getSystemInfoSync().windowHeight - 30;
    console.log(height)
    this.setData({
      swiperHeight: height
    })
    
    let _this = this;
    setTimeout(() => {
      let query = wx.createSelectorQuery().in(this);
      query.select('.rankingBg').boundingClientRect(function (e) {
        let height = wx.getSystemInfoSync().windowHeight - 30;
        let otherHeight = height - e.height - 10;
        
        _this.setData({
          otherHeight: otherHeight
        })
      }).exec()
      wx.hideLoading()
    }, 2000)    
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