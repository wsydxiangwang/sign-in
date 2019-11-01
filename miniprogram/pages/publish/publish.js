const db = wx.cloud.database(); // 初始化数据库
const app = getApp(); // 获取全局数据

// 引入SDK核心类
var QQMapWX = require('../../static/qqmap-wx-jssdk.min.js');
var qqmapsdk;

Page({
  data:{
    tempImg: [],  // 临时图片存储
    fileIDs: [],
    address: '',  // 定位
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
          // 更新页面图片
          _this.setData({
            tempImg: tempImgAdd
          })
        } else {
          // 图片显示到页面
          _this.setData({
            tempImg: tempFilePaths
          })
        }
      }
    })
  },
  // 获取位置
  location: function(e){
    let _this = this;
    // 获取经纬度
    wx.getLocation({
      success(res) {
        const latitude = res.latitude;
        const longitude = res.longitude;
        _this.getLocal(latitude, longitude)
      },
      fail(err){
        console.log('fail' + err)
      }
    })
  },
  // 腾讯地图api获取定位
  getLocal: function(latitude, longitude){
    let _this = this;
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success(res){
        let province = res.result.ad_info.province;
        let city = res.result.ad_info.city;
        _this.setData({
          address: province + city
        })
      },
      fail(res){
        console.log('fail' + res)
      }
    })
  },
  // 发布心情
  bindFormSubmit: function (e) {
    wx.showLoading({
      title: '提交中',
    })
    let data = {
      openId: app.globalData.openId,       // ID
      userName: app.globalData.nickName,   // 昵称
      avatarUrl: app.globalData.avatarUrl, // 头像
      time: app.globalData.currentDate,    // 时间
      content: e.detail.value.textarea,    // 内容
      like: 0,      // 点赞
      comment: [],  // 评论
      address: this.data.address
    }

    if(this.data.tempImg){ // 发表图片
    
      let promiseArr = [];
      this.data.fileIDs = [];  // 初始化

      //只能一张张上传 遍历临时的图片数组
      for (let i = 0; i < this.data.tempImg.length; i++) {
        
        let filePath = this.data.tempImg[i]
        let suffix = /\.[^\.]+$/.exec(filePath)[0]; // 正则表达式，获取图片扩展名

        promiseArr.push(new Promise((reslove, reject) => {
          wx.cloud.uploadFile({
            cloudPath: 'comment/' + new Date().getTime() + suffix,
            filePath: filePath, // 文件路径
          })
            .then(res => {
              // fileID添加到image数组
              this.setData({
                fileIDs: this.data.fileIDs.concat(res.fileID)
              });
              console.log(this.data.fileIDs)

              reslove('success')
            }).catch(error => {
              console.log(error)
              return;
            })
        }))

      }
      // 所有图片上传后执行
      Promise.all(promiseArr).then(res => {
        // 添加图片到数据列表
        data.image = this.data.fileIDs;
        console.log(data)

        db.collection('comment').add({
          data: data
        }).then(res => {
          wx.hideLoading()
          wx.showToast({
            title: '提交成功',
          })
          console.log('发表成功')
          wx.navigateBack()
        }).catch(err => {
          console.log('发表失败')
          console.log(err)
        })
      }).catch(err => {
        console.log(err)
      })
    } else {
      console.log(data)
      // 不发表图片 直接添加数据
      db.collection('comment').add({
        data: data
      }).then(res => {
        wx.hideLoading()
        wx.showToast({
          title: '提交成功',
        })
        console.log('发表成功')
        wx.navigateBack()
      }).catch(err => {
        console.log('发表失败')
        console.log(err)
      })
    }
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
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'FVTBZ-O2BW5-7QUI2-QZ5PZ-INFPS-JTBOL'
    });
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