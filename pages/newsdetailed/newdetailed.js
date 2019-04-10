// pages/newsdetailed/newdetailed.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newsdetail: [

    ],
    newsnumber:undefined

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var postID=options.newid;
    console.log("详情页接收到的文章的编号"+postID);
    that.setData({
      newsnumber:postID
    })
    wx.request({
      url: 'http://211.87.227.226:8089/news/wx_getListPaging',
      success: function (res) {
        console.log("jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj")
        var recs = res.data.recs;
        var temp_news_list = [];
        for (var i in recs) {
          var temp_news = {};
          temp_news.newstittle = recs[i].NewsTitle;
          temp_news.newscontent = recs[i].NewsContent;
          temp_news.coverimage = recs[i].CoverImage;
          temp_news.newsid = recs[i].NewsID;
          temp_news.authorname = recs[i].AuthorName;
          temp_news.createtime = recs[i].CreateTime;
          temp_news_list.push(temp_news);
        }
        console.log("详情页接收到的文章的编号" + postID);
        that.setData({
          newsdetail: temp_news_list
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})