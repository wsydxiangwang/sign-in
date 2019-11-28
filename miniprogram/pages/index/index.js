const db = wx.cloud.database(); // 初始化数据库
const app = getApp(); // 获取全局数据

Page({
  data: {
    count: 0, // 坚持天数
    runningDay: 0, // 当前连续
    longRunningDay: 0, // 最长连续
    hours: ''
  },
  // 点击签到
  singnin: function(e){

    let _this = this;

    // 获取用户信息
    wx.getSetting({
      complete: function (res) {
        if (res.authSetting['scope.userInfo']) { // 已授权

          wx.showLoading({
            title: '签到中...',
          })

          // db.collection('userInfo').where({
          //   _openid: app.globalData.openId
          // })
          //   .get()
          //   .then(res => {
          //     let obj = res.data[0].timeList;

          //     Object.keys(obj)

          //     console.log(Object.keys(obj))
          //   })

          //   return false;

          // 获取当前用户
          db.collection('userInfo').where({
            _openid: app.globalData.openId
          })
            .get().then(res => {

              let todayTime = app.dateFormat('YYYY-MM-DD');
              let todayHours = app.dateFormat('HH');
              let todayHourss = app.dateFormat('HH:mm');
              let lastTime = res.data[0].lastTime;

              // if (lastTime == todayTime){
              //   wx.hideLoading()
              //   wx.showToast({
              //     title: '今天已签到！！',
              //     icon: 'none',
              //     duration: 2000
              //   })
              //   return;
              // }

              // if (todayHours >= 0 && todayHours < 5) {
              //   wx.hideLoading()
              //   wx.showToast({
              //     title: '童靴你起得真早啊，签到时间还没到哦~~',
              //     duration: 2000
              //   })
              //   return;

              // } else if (todayHours >= 9 && todayHours < 24) {
              //   wx.hideLoading()
              //   wx.showToast({
              //     title: '说，你是不是睡懒觉了，时间等你等到花都谢了~~',
              //     icon: 'none',
              //     duration: 2000
              //   })
              //   return;
              // }
              
              // 今天时间与最近签到时间做比较
              let timeInterval = Math.abs(Date.parse(todayTime) - Date.parse(lastTime));
                  timeInterval = Math.floor(timeInterval / (24 * 3600 * 1000));

              let runningDay = res.data[0].runningDay,
                  longRunningDay = res.data[0].longRunningDay;

              if (timeInterval == 1){ // 当前连续 +1
                runningDay++;
              }else{
                runningDay = 1;
              }
              if (runningDay > longRunningDay){ // 最高连续
                longRunningDay = runningDay;               
              }
              
              // 更新天数
              wx.cloud.callFunction({
                name: 'signin',
                data: {
                  action: 'count',
                  lastTime: todayTime,
                  runningDay: runningDay,
                  lastHours: todayHourss,
                  longRunningDay: longRunningDay,
                }
              }).then(res => {

                _this.addRank(); // 添加排行榜
                _this.onLoad(); // 更新页面数据

                wx.hideLoading()
                wx.showToast({
                  title: '签到成功',
                  icon: 'none',
                  duration: 2000
                })

              }).catch(err => {
                wx.hideLoading()
                wx.showToast({
                  title: '出问题了，可能是网络有点慌！',
                  icon: 'none',
                  duration: 2000
                })
              })
            })
        } else {
          console.log('未授权')
          // 未授权则进入授权页面
          wx.navigateTo({
            url: '../login/login'
          })
        }
      }
    })
  },
  // 今日排行榜
  addRank(){
    let todayTime = app.dateFormat('YYYY-MM-DD');
    let data = {
      currentTime: app.dateFormat('HH:mm'),
      openid: app.globalData.openId,
      nickName: app.globalData.nickName,
      avatarUrl: app.globalData.avatarUrl,
      gender: app.globalData.gender,
      like: 0
    }

    db.collection('today').doc(todayTime)
      .get()
      .then(res => { // 添加信息到今日排行榜
        wx.cloud.callFunction({
          name: 'signin',
          data: {
            action: 'today',
            _id: todayTime,
            dataList: data
          }
        }).then(res => {
          console.log('添加排行榜成功')
        }).catch(err => {
          console.log('添加排行榜失败')
        })
      })
      .catch(err => { // 创建今日排行榜
        db.collection('today').add({
          data: {
            _id: todayTime,
            data: [data]
          }
        }).then(res => {
          console.log('创建排行榜成功')
        }).catch(err => {
          console.log('创建排行榜失败')
        })
      })
  },
  // 排行榜
  ranking: function(e){
    wx.navigateTo({
      url: '../ranking/ranking'
    })
  },
  /**
   *  监听页面加载
   */
  onLoad: function (options) {

    let _this = this;

    // 获取用户信息
    wx.getSetting({
      complete: function (res) {
        if (res.authSetting['scope.userInfo']) {
          
          let time = setInterval(() => { // 避免第一次加载获取不到openid

            if (app.globalData.openId) {
              console.log(1)
              clearTimeout(time)

              db.collection('userInfo').where({ // 查找当前用户是否存在
                _openid: app.globalData.openId
              })
                .get().then(res => {
                  if (res.data.length == 1) { // 用户存在 获取数据

                    db.collection('userInfo').where({
                      _openid: app.globalData.openId
                    })
                      .get()
                      .then(res => {

                        let hours = '';
                        if (res.data[0].lastTime == app.dateFormat('YYYY-MM-DD')) {
                          hours = res.data[0].lastHours;
                        }
                        _this.setData({
                          count: res.data[0].count,
                          hours: hours,
                          runningDay: res.data[0].runningDay,
                          longRunningDay: res.data[0].longRunningDay,
                        })

                      })
                      .catch(err => {
                        console.log(err)
                      })
                  }
                })
            }
          }, 100)
          
        }else{
          console.log('未授权')
        }
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
