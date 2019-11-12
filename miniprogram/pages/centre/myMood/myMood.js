const db = wx.cloud.database(); // 初始化数据库
const app = getApp(); // 获取全局数据

let currentPage = 0, // 当前第几页 0表示第一页
    pageSize = 10;   // 每页显示的数据

Page({

  /**
   * 页面的初始数据
   */
  data: {
    moodList: [], // 心情列表
    loadMore: false,
    loadAll: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    // 获取用户信息
    wx.getSetting({
      complete: function (res) {
        if (res.authSetting['scope.userInfo']) { // 已授权
          _this.getData();
        } else {
          // 未授权则进入授权页面
          wx.navigateTo({
            url: '/pages/login/login'
          })
        }
      }
    })
  },
  getData() {
    // 加载心情列表
    console.log(app.globalData.openId)
    db.collection('comment')
      .where({
        _openid: app.globalData.openId
      })
      .orderBy('createTime', 'desc')
      .skip(currentPage * pageSize)
      .limit(pageSize)
      .get()
      .then(res => {

        // 有数据
        if (res.data && res.data.length > 0) {

          currentPage++; // +1 方可获取下一页数据

          // 时间戳转换 再追加数据
          res.data.forEach((item) => {
            item.createTime = this.timestampFormat(item.createTime)
          })
          let list = this.data.moodList.concat(res.data);

          // 更新到页面
          this.setData({
            moodList: list,
            loadMore: false
          })

          if (res.data.length < pageSize) {
            this.setData({
              loadMore: false,
              loadAll: true
            })
          }
          // console.log(list)

        } else {
          // 没有数据 则显示加载完毕
          this.setData({
            loadAll: true,
            loadMore: false
          })
        }
      })
  },
  timestampFormat: function (timestamp) {
    function zeroize(num) {
      return (String(num).length == 1 ? '0' : '') + num;
    };

    var curTimestamp = parseInt(new Date().getTime() / 1000);
    var timestamp = Date.parse(timestamp) / 1000;
    var timestampDiff = curTimestamp - timestamp; // 参数时间戳与当前时间戳相差秒数

    var curDate = new Date(curTimestamp * 1000); // 当前时间日期对象
    var tmDate = new Date(timestamp * 1000);  // 参数时间戳转换成的日期对象

    var Y = tmDate.getFullYear(), m = tmDate.getMonth() + 1, d = tmDate.getDate();
    var H = tmDate.getHours(), i = tmDate.getMinutes(), s = tmDate.getSeconds();

    if (timestampDiff < 60) {
      return "刚刚";
    } else if (timestampDiff < 3600) {
      return Math.floor(timestampDiff / 60) + "分钟前";
    } else if (curDate.getFullYear() == Y && curDate.getMonth() + 1 == m && curDate.getDate() == d) {
      return '今天' + zeroize(H) + ':' + zeroize(i);
    } else {
      var newDate = new Date((curTimestamp - 86400) * 1000); // 参数中的时间戳加一天转换成的日期对象
      if (newDate.getFullYear() == Y && newDate.getMonth() + 1 == m && newDate.getDate() == d) {
        return '昨天' + zeroize(H) + ':' + zeroize(i);
      } else if (curDate.getFullYear() == Y) {
        return zeroize(m) + '月' + zeroize(d) + '日 ' + zeroize(H) + ':' + zeroize(i);
      } else {
        return Y + '年' + zeroize(m) + '月' + zeroize(d) + '日 ' + zeroize(H) + ':' + zeroize(i);
      }
    }
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
    console.log("上拉触底事件")
    let that = this
    if (!that.data.loadMore) {
      that.setData({
        loadMore: true, //加载中  
        loadAll: false //是否加载完所有数据
      });

      //加载更多，这里做下延时加载
      setTimeout(function () {
        that.getData()
      }, 500)

    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})