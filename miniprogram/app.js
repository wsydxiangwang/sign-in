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
      complete: function (res) {
        if (res.authSetting['scope.userInfo']) {
          console.log('授权')
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: res => {
              _this.globalData = {
                ..._this.globalData,
                avatarUrl: res.userInfo.avatarUrl,
                nickName: res.userInfo.nickName,
                gender: res.userInfo.gender
              }
              console.log(_this.globalData.openId)
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
  },
  timestampFormat(timestamp) {
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
      return '今天 ' + zeroize(H) + ':' + zeroize(i);
    } else {
      var newDate = new Date((curTimestamp - 86400) * 1000); // 参数中的时间戳加一天转换成的日期对象
      if (newDate.getFullYear() == Y && newDate.getMonth() + 1 == m && newDate.getDate() == d) {
        return '昨天 ' + zeroize(H) + ':' + zeroize(i);
      } else if (curDate.getFullYear() == Y) {
        return zeroize(m) + '/' + zeroize(d) + ' ' + zeroize(H) + ':' + zeroize(i);
      } else {
        return Y + '/' + zeroize(m) + '/' + zeroize(d) + ' ' + zeroize(H) + ':' + zeroize(i);
      }
    }
  }
})
