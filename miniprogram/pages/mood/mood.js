const db = wx.cloud.database(); // 初始化数据库
const app = getApp(); // 获取全局数据

let currentPage = 0, // 当前第几页 0表示第一页
    pageSize = 10;   // 每页显示的数据

Page({
  data: {
    moodList: [], // 心情列表
    loadMore: false,
    loadAll: false,
  },
  publish: function(e){
    // 获取用户信息
    wx.getSetting({
      complete: function (res) {
        if (res.authSetting['scope.userInfo']) { // 已授权
          wx.navigateTo({
            url: '/pages/publish/publish'
          })
        }else{
          // 未授权则进入授权页面
          wx.navigateTo({
            url: '/pages/login/login'
          })
        }
      }
    })

    
  },
  // 预览图片
  previewImg: function(e){
    let imgData = e.currentTarget.dataset.img;
    wx.previewImage({
      current: imgData[0], // 当前显示图片
      urls: imgData[1] // 需要预览的图片
    })
  },

  // 点赞
  like(e){
    let _this = this;
    let index = e.currentTarget.dataset.index;
    let num = this.data.moodList[index];
    let arr = 'moodList[' + index + '].like';
    let liked = 'moodList[' + index + '].liked';
    let moodLike = num._id;

    wx.getStorage({
      key: `moodLike-${moodLike}`,
      success(res) {
        // 已点赞
        wx.showToast({
          icon: "none",
          title: '每人只能给予一次鼓励哦～',
        })
        return false;
      },
      fail(err){
        // 未点赞
        wx.setStorageSync(`moodLike-${moodLike}`, 'true'); // 设置缓存

        _this.setData({  // 更新页面
          [arr]: num.like + 1,
          [liked]: true
        })

        console.log(_this.data.moodList)

        // 调用云函数更新
        wx.cloud.callFunction({
          name: 'mood',
          data: {
            action: 'like',
            id: num._id
          }
        }).then(res => {
          console.log('update: ' + res.result.stats.updated)
        }).catch(err => {
          console.log(err)
        })
      }
    })
  },
  // 评论
  comment(e) {
    let index = e.currentTarget.dataset.index;
    let currentMood = {};

    currentMood.index = index;
    currentMood.data = this.data.moodList[index];

    // 获取用户信息
    wx.getSetting({
      complete: function (res) {
        if (res.authSetting['scope.userInfo']) { // 已授权
          // 传递当前的心情数据
          wx.navigateTo({
            url: 'comment/comment',
            success(res) {
              res.eventChannel.emit('acceptDataFromOpenerPage', currentMood)
            }
          })

        }else{
          // 未授权则进入授权页面
          wx.navigateTo({
            url: '../login/login'
          })
        }
      }
    })
    
  },
  // 回复评论
  reply(e){
    let index = e.currentTarget.dataset;
    let replyMood = {};
    replyMood.index = index.index;
    replyMood.indexs = index.indexs;
    replyMood.data = this.data.moodList[index.index];
    // 获取用户信息
    wx.getSetting({
      complete: function (res) {
        if (res.authSetting['scope.userInfo']) { // 已授权
          // 传递当前的心情数据
          wx.navigateTo({
            url: 'comment/comment',
            success(res) {
              res.eventChannel.emit('replyPageData', replyMood)
            }
          })

        } else {
          // 未授权则进入授权页面
          wx.navigateTo({
            url: '../login/login'
          })
        }
      }
    })
  },
  plane(){
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.onPullDownRefresh();
  },
  getData() {
    // console.log(currentPage, currentPage * pageSize)
    // 加载心情列表
    db.collection('comment')
      .orderBy('createTime', 'desc')
      .skip(currentPage * pageSize)
      .limit(pageSize)
      .get()
      .then(res => {

        // 有数据
        if(res.data && res.data.length > 0){

          currentPage++; // +1 方可获取下一页数据
          
          // 时间戳转换 再追加数据
          res.data.forEach((item) => {

            // 同步获取本地数据
            let idArr = item._id;
            try {
              var value = wx.getStorageSync(`moodLike-${idArr}`)
              if (value) {
                item.liked = true;
              }
            } catch (e) {}

            item.createTime = app.timestampFormat(item.createTime)
            if(item.comment.length != 0){
              item.comment.forEach((items) => {
                items.time = app.timestampFormat(items.time)
              })
            }

          })
          let list = this.data.moodList.concat(res.data);
          console.log(list)

          // 更新到页面
          this.setData({
            moodList: list,
            loadMore: false
          })

          if(res.data.length < pageSize){
            this.setData({
              loadMore: false,
              loadAll: true
            })
          }
          // console.log(list)

        }else{
          // 没有数据 则显示加载完毕
          this.setData({
            loadAll: true,
            loadMore: false
          })
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
    // 评论实时更新
    if (getApp().globalData.newComment){
      let index = getApp().globalData.newComment.index;
      let data = getApp().globalData.newComment.data;
      let comment = this.data.moodList[index].comment.concat(data);
      let arr = 'moodList[' + index + '].comment';
      this.setData({
        [arr]: comment
      })
      getApp().globalData.newComment = '';
    }
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
    wx.showToast({
      title: '正在刷新数据...',
      icon: 'loading',
      duration: 2000
    });
    currentPage = 0;
    this.setData({
      moodList: []
    })
    this.getData();
    wx: wx.stopPullDownRefresh();//停止刷新操作
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