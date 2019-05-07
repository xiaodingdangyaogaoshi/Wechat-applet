//wx-drawer
const MENU_WIDTH_SCALE = 0.82;
const FAST_SPEED_SECOND = 300;
const FAST_SPEED_DISTANCE = 5;
const FAST_SPEED_EFF_Y = 50;
var app = getApp()
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo: {
      avatarUrl: "",//用户头像
      nickName: "",//用户昵称
    },
    imageUrls: [
      '../../static/photo.jpg',
      '../../static/photo2.jpg',
      '../../static/photo3.jpg'
    ],
    news: [

    ],
    ui: {
      windowWidth: 0,
      menuWidth: 0,
      offsetLeft: 0,
      tStart: true
    }
  },

  
  /**
     * 进行详情页的跳转
     */
  detail: function (event) {
    var postid = event.currentTarget.dataset.newsid;
    console.log(postid);
    wx:wx.navigateTo({
      url: '../newsdetailed/newdetailed?newid='+postid,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  onLoad(options) {
  
    var that = this;
    /**
     * 获取用户信息
     */
    //查看是否授权
    console.log("执行到检查是否授权")
    wx.getSetting({
      success:function(res){
        if(res.authSetting['scope.userInfo']){
          //已经授权,可以直接调用getuserInfo获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              console.log(res);
              var avatarUrl = 'userInfo.avatarUrl';
              var nickName = 'userInfo.nickName';
              that.setData({
                [avatarUrl]: res.userInfo.avatarUrl,
                [nickName]: res.userInfo.nickName,
              })
              console.log(res.userInfo.avatarUrl)
            }
          })
        }
      }
    })
    
  
    wx.request({
      url: 'http://127.0.0.1:5000',
      success: function (res) {
        console.log(res)
        var recs = res.data;
        
        var temp_news_list = [];
        for (var i in recs) {
          var temp_news = {};
        
          temp_news.newstittle = recs[i].NewsTittle;
          temp_news.newscontent = recs[i].NewsContent;
          temp_news.coverimage = recs[i].CoverImage;
          temp_news.newsid = recs[i].NewsID;
          temp_news.authorname = recs[i].AuthorName;
          temp_news.createtime = recs[i].Creattime;
          temp_news_list.push(temp_news);
          
          
        }
        that.setData({
          news: temp_news_list
        })

      }
    })
    try {
      let res = wx.getSystemInfoSync()
      this.windowWidth = res.windowWidth;
      this.data.ui.menuWidth = this.windowWidth * MENU_WIDTH_SCALE;
      this.data.ui.offsetLeft = 0;
      this.data.ui.windowWidth = res.windowWidth;
      this.setData({ ui: this.data.ui })
    } catch (e) {
    }
  },
  bindGetUserInfo:function(e){
    console.log(e.detail.userInfo)
    var avatarUrl = 'userInfo.avatarUrl';
    var nickName = 'userInfo.nickName';
    that.setData({
      [avatarUrl]: res.userInfo.avatarUrl,
      [nickName]: res.userInfo.nickName,
    })
  },
  handlerStart(e) {
    let { clientX, clientY } = e.touches[0];
    this.tapStartX = clientX;
    this.tapStartY = clientY;
    this.tapStartTime = e.timeStamp;
    this.startX = clientX;
    this.data.ui.tStart = true;
    this.setData({ ui: this.data.ui })
  },
  handlerMove(e) {
    let { clientX } = e.touches[0];
    let { ui } = this.data;
    let offsetX = this.startX - clientX;
    this.startX = clientX;
    ui.offsetLeft -= offsetX;
    if (ui.offsetLeft <= 0) {
      ui.offsetLeft = 0;
    } else if (ui.offsetLeft >= ui.menuWidth) {
      ui.offsetLeft = ui.menuWidth;
    }
    this.setData({ ui: ui })
  },
  handlerCancel(e) {
    // console.log(e);
  },
  handlerEnd(e) {
    this.data.ui.tStart = false;
    this.setData({ ui: this.data.ui })
    let { ui } = this.data;
    let { clientX, clientY } = e.changedTouches[0];
    let endTime = e.timeStamp;
    //快速滑动
    if (endTime - this.tapStartTime <= FAST_SPEED_SECOND) {
      //向左
      if (this.tapStartX - clientX > FAST_SPEED_DISTANCE) {
        ui.offsetLeft = 0;
      } else if (this.tapStartX - clientX < -FAST_SPEED_DISTANCE && Math.abs(this.tapStartY - clientY) < FAST_SPEED_EFF_Y) {
        ui.offsetLeft = ui.menuWidth;
      } else {
        if (ui.offsetLeft >= ui.menuWidth / 2) {
          ui.offsetLeft = ui.menuWidth;
        } else {
          ui.offsetLeft = 0;
        }
      }
    } else {
      if (ui.offsetLeft >= ui.menuWidth / 2) {
        ui.offsetLeft = ui.menuWidth;
      } else {
        ui.offsetLeft = 0;
      }
    }
    this.setData({ ui: ui })
  },
  handlerPageTap(e) {
    let { ui } = this.data;
    if (ui.offsetLeft != 0) {
      ui.offsetLeft = 0;
      this.setData({ ui: ui })
    }
  },
  handlerAvatarTap(e) {
    let { ui } = this.data;
    if (ui.offsetLeft == 0) {
      ui.offsetLeft = ui.menuWidth;
      this.setData({ ui: ui })
    }
  }
})
