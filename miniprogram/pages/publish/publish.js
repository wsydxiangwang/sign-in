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
  // 选择图片
  chooseImage: function(e){
    let _this = this;

    // 选择图片
    wx.chooseImage({
      count: 9 - this.data.tempImg.length,
      sizeType: ['original', 'compressed'],
      sourceType: ['album'],
      success(res){
        if (_this.data.tempImg) {
          _this.setData({
            tempImg: _this.data.tempImg.concat(res.tempFilePaths)
          })
        } else {
          _this.setData({
            tempImg: tempFilePaths
          })
        }
      }
    })
  },
  // 删除图片
  deleteImage: function(e){
    let index = e.currentTarget.dataset.index;
    wx.showModal({
      title: '要删除这张照片吗？',
      content: '',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm){
          this.data.tempImg.splice(index, 1);
          this.setData({
            tempImg: this.data.tempImg
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
        console.log('fail:', err)
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
        console.log('fail:', res)
      }
    })
  },
  // 发布心情
  bindFormSubmit: function (e) {
    if (!e.detail.value.textarea){
      wx.showToast({
        icon: "none",
        title: '嘿嘿，要分享此刻的心情哦～',
      })
      return;
    }


    wx.showLoading({
      title: '您的心情正在游历全世界～～',
    })

    let data = {
      openId: app.globalData.openId,       // ID
      userName: app.globalData.nickName,   // 昵称
      avatarUrl: app.globalData.avatarUrl, // 头像
      content: e.detail.value.textarea,    // 内容
      address: this.data.address, // 地址
      createTime: db.serverDate(), // 服务端时间
      view: 0,      // 查看
      like: 0,      // 点赞
      comment: [],  // 评论
    }

    if(this.data.tempImg.length > 0){ // 发表图片
    
      let promiseArr = [];

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

        data.image = this.data.fileIDs;
        data.time = app.dateFormat('YYYY-MM-DD HH:mm')    // 时间与服务端一致

        db.collection('comment').add({
          data: data
        }).then(res => {
          wx.hideLoading()
          wx.showToast({
            icon: "none",
            title: '心情发布成功，每天都要开心哦，加油～～',
            duration: 2000
          })
          setTimeout(function () {
            // 发表成功回到心情页面，并更新数据
            wx.switchTab({
              url: '/pages/mood/mood',
              success: function (e) {
                var page = getCurrentPages().pop();
                if (page == undefined || page == null) return;
                page.onPullDownRefresh();
              }
            })
          }, 2000)
        }).catch(err => {
          wx.hideLoading();
          wx.showToast({
            icon: 'none',
            title: '心情发布失败，可能是网络原因哦，再试一遍～～',
            duration: 2000
          });

          console.log(err);
        })
      }).catch(err => {
        console.log(err)
      })

    } else {

      data.time = app.dateFormat('YYYY/MM/DD HH:mm:ss')    // 时间与服务端一致

      // 不发表图片 直接添加数据
      db.collection('comment').add({
        data: data
      }).then(res => {
        wx.hideLoading()
        wx.showToast({
          icon: "none",
          title: '心情发布成功，每天都要开心哦，加油～～',
          duration: 2000
        })
        setTimeout(function () {
          // 发表成功回到心情页面，并更新数据
          wx.switchTab({
            url: '/pages/mood/mood',
            success: function(e) {
              var page = getCurrentPages().pop();
              if (page == undefined || page == null) return;
              page.onPullDownRefresh();
            }
          })
        }, 2000)
      }).catch(err => {
        wx.hideLoading();
        wx.showToast({
          icon: 'none',
          title: '心情发布失败，可能是网络原因哦，再试一遍～～',
          duration: 2000
        });

        console.log(err);
      })
    }
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