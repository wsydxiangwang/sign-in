const db = wx.cloud.database(); // 初始化数据库
const app = getApp(); // 获取全局数据

let currentPage = 0, // 当前第几页 0表示第一页
    pageSize = 10;   // 每页显示的数据
Page({
  data: {
    commentList: [], // 心情列表
    swiperList: [], // 当前轮播图片
    swiperCurrent: 0,
    loadMore: false,
    loadAll: false
  },
  // 查看当前图片组
  imageSwiper: function(e){
    let index = e.currentTarget.dataset.index;
    let image = this.data.commentList[index].image;

    // 获取当前图片数组
    this.setData({
      swiperList: image
    })

  },
  // 轮播图切换事件 定位指示点
  swiperChange: function(e){
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  // 关闭图片
  swiperClose: function(e){
    this.setData({
      swiperCurrent: 0,
      swiperList: []
    })
  },
  // 点赞
  like: function(e){
    console.log(e)
    // console.log(e.currentTarget.dataset.index)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData();
  },
  getData(){
    // 加载心情列表
    db.collection('comment')
      .skip(currentPage * pageSize)
      .limit(pageSize)
      .get()
      .then(res => {
        console.log(res.data)

        // 有数据
        if(res.data && res.data.length > 0){
          currentPage++; // +1 方可获取下一页数据
          // 追加数据
          let list = this.data.commentList.concat(res.data);
          // 更新到页面
          this.setData({
            commentList: list,
            loadMore: false
          })

          if(res.data.length < pageSize){
            this.setData({
              loadMore: false,
              loadAll: true
            })
          }
          console.log(this.data.commentList)

        }else{
          console.log(222)
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