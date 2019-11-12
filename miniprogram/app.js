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


    this.globalData = {
      openId: '',
      nickName: '',
      avatarUrl: '',
      gender: ''
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
  },
  // 时间戳
  dateFormat(fmt){
    let date = new Date();
    let opt = {
      "Y+": date.getFullYear().toString(),        // 年
      "M+": (date.getMonth() + 1).toString(),     // 月
      "D+": date.getDate().toString(),            // 日
      "H+": date.getHours().toString(),           // 时
      "m+": date.getMinutes().toString(),         // 分
      "s+": date.getSeconds().toString()          // 秒
    };
    for(let k in opt) {
      let ret = new RegExp("(" + k + ")").exec(fmt);
      if (ret) {
        fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
      };
    };
    return fmt;
  }
})
