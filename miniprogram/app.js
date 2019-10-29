//app.js

App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
    }


    var myDate = new Date(),
        year = myDate.getFullYear(),
        month = myDate.getMonth() + 1,
        day = myDate.getDate(),
        hours = myDate.getHours(),
        min = myDate.getMinutes(),
        sec = myDate.getSeconds();

    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;
    hours = hours < 10 ? '0' + hours : hours;
    min = min < 10 ? '0' + min : min;
    sec = sec < 10 ? '0' + sec : sec;

    this.globalData = {
      openId: '',
      nickName: '',
      avatarUrl: '',
      gender: '',
      todayTime: `${year}${month}${day}`,
      currentTime: `${hours}:${min}`,
      currentDate: `${year}-${month}-${day} ${hours}:${min}:${sec}`
    },

    // 获取登录用户的openid
    wx.cloud.callFunction({
      name: 'login'
    })
    .then(res => {
      this.globalData.openId = res.result.openid;
    })
    .catch(err => {
      console.log(err)
    })

    var _this = this;
    // 获取用户信息
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: res => {
              _this.globalData = {
                ..._this.globalData,
                avatarUrl: res.userInfo.avatarUrl,
                nickName: res.userInfo.nickName,
                gender: res.userInfo.gender
              }
              // console.log(_this.globalData)
            }
          })
        }else{
          console.log('未授权')
        }
        
      }
    })
  }
})
