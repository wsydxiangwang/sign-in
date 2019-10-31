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
    let data = {
      openId: app.globalData.openId,       // ID
      userName: app.globalData.nickName,   // 昵称
      avatarUrl: app.globalData.avatarUrl, // 头像
      time: app.globalData.currentDate,    // 时间
      content: e.detail.value.textarea,    // 内容
      like: 0,      // 点赞
      comment: [],  // 评论
      image: this.data.fileIDs,
      address: this.data.address
    }

    if(this.data.tempImg){ // 发表图片
      
      //只能一张张上传 遍历临时的图片数组
      const promiseArr = [];

      for (let i = 0; i < this.data.tempImg.length; i++) {
        
        let filePath = this.data.tempImg[i]
        let suffix = /\.[^\.]+$/.exec(filePath)[0]; // 正则表达式，获取图片扩展名
        
        //在每次上传的时候，就往promiseArr里存一个promise，只有当所有的都返回结果时，才可以继续往下执行
        promiseArr.push(new Promise((reslove, reject) => {

          wx.cloud.uploadFile({
            cloudPath: new Date().getTime() + suffix,
            filePath: filePath, // 文件路径
          }).then(res => {
            
            let newFileID = res.fileID; 

            // 如果有图片 则累加
            if (this.data.fileIDs) {
              let fileIDsAdd = this.data.fileIDs.push(newFileID);

              // console.log(fileIDsAdd)
              // 更新页面图片
              this.setData({
                fileIDs: fileIDsAdd
              })
            } else {
              // let fileIDsAdd = this.data.fileIDs.push(newFileID);
              // // 图片显示到页面
              // this.setData({
              //   fileIDs: fileIDsAdd
              // })
              console.log(typeof this.data.fileIDs)
            }
            // console.log(newFileID)
            console.log(data)

            // console.log(this.data.fileIDs)
          
            reslove()
          }).catch(error => {
            console.log(error)
            return;
          })
        }))
        Promise.all(promiseArr).then(res => {
          console.log('4444')
        })
      }
    } else {
      // 不发表图片 直接添加数据
      db.collection('comment').add({
        data: data
      }).then(res => {
        console.log('发表成功')
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