/* global getApp Page wx */
const app = getApp()

let timeout

function debounce(func, wait) {
  return function() {
    clearTimeout(timeout)
    timeout = setTimeout(func, wait)
  }
}

let timeout2 = null

function throttle(func, wait) {
  return function() {
    if (!timeout2) {
      timeout2 = setTimeout(function() {
        clearTimeout(timeout2)
        timeout2 = null
        func()
      }, wait)
    }
  }
}

Page({
  data: {
    videodetail: [

    ],

    width: wx.getSystemInfoSync().windowWidth,
    height: wx.getSystemInfoSync().windowHeight,

    videoLoading: false,
    videoList: [],

    location: [],
    isLock: false, // 当前栗子无用，如果有些弹窗控制不住背后的视频列表滚动的话，isLock的作用就发挥出来了。
    localIndex: 0,
    noPageScroll: false
  },


  info: {
    videoPlayDetail: {} // 存放所有视频的播放位置

  },
  onLoad(options) {
    this.getVideoList(1)
    var that = this;
    wx.request({
      url: 'http://127.0.0.1:5000/video',
      success: function(res) {
        console.log(res)
        var recs = res.data;
        var temp_video_list = [];
        for (var i in recs) {
          var temp_video = {};

          temp_video.videotitle = recs[i].Videotitle;
          temp_video.videocontent = recs[i].Videocontent;
          temp_video.videonumber = recs[i].Videonumber;
          temp_video.videourl = recs[i].Videourl;
          temp_video.videocount = recs[i].Videocount;
          temp_video.isPlay='false';
          temp_video.height=272;
          temp_video.cover ='https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2956331506,1386719139&fm=26&gp=0.jpg'
          temp_video.width=480;
          temp_video_list.push(temp_video);
        
          console.log(temp_video_list)

        }
        that.setData({
          videodetail: temp_video_list
        })

      }
    })
    
  },
  /**
   * 分页获取视频
   */
  getVideoList(initPage) {
    const {
      videoLoading,
      videoList
    } = this.data
    if (videoLoading) {
      return
    }
    this.setData({
      videoLoading: true
    })
    // 制造模拟数据
    /*let data = [{
      cover: 'https://wx4.sinaimg.cn/mw690/ec4d7780ly1fsvx1996xoj20da07in0t.jpg',
      src: 'http://video19.ifeng.com/video09/2019/04/25/p17213221-102-009-141725.mp4?vid=9a25a566-a652-47ba-910f-e0978f6a13e7&uid=1557219251850_nrtwk71229&from=v_Free&pver=vHTML5Player_v2.0.0&sver=&se=%E4%BD%93%E8%82%B2%E6%BD%9C%E8%83%BD%E6%89%8B&cat=61-62&ptype=61&platform=pc&sourceType=h5&dt=1556173002000&gid=6VnX0WqRggM7&sign=6ba18b01816a959e88fca264657f1e63&tm=1557219377982&vkey=qfxHXEoabyZ%2F3gm4gJ2f1LyLxunZ5xxbJ8ZtLBY6ejNnXkA3%2FPxCI2LzLbu%2BlpYgS8pAlMmQnBM0b490bdMX2CNTdgaEyILlajVml9hkHOShceTgxR8WPKqj3%2BqQapGQG7DJKL8Ew%2B5T1dSy1%2BZZlAJ%2Bqh2r05ICdJVtjPNjB%2BRgPPHuNgRWhBQnsmlDNXrG0El0L7OMonNsETCId6N73cpnDmYqaeBn4I%2B%2FulbTQ%2Bxo3M7VI0csevIV6B%2F2KzF1cd2t2DJg57wXmqgonFgi8859Z4wkNDvTlQNz%2F%2FUImCHrV4T3VCy%2B6o2tAVgpBbaq',
      width: 480,
      height: 272,
      title: '蔡老师打篮球',
      isPlay: false
    }]
    data = data.concat(data)
    data = data.concat(data)
    data = data.concat(data)
  */
   
    // 模拟请求
    setTimeout(() => {
      this.setData({
        videodetail: videoList.concat(this.formatVideodetail(data)),
        videoLoading: false
      })
      // 给数据足够的渲染时间，之后进行视频位置的测量
      setTimeout(() => {
        this.getLocationInfo()
        if (initPage) { // 如果是首次进入，就自动播放第一个视频
          this.showVideoList(0)
        }
      }, 1000)
    }, 1000)
  },
  /**
   * 格式化视频列表
   * @param {Array} videoList 需要格式化的视频列表
   */
  formatVideoList(videodetail) {
    const {
      width,
      height
    } = this.data
    return videodetail.map(value => {
      let styleHight = width * value.height / value.width
      styleHight = styleHight > 0.7 * height ? 0.7 * height : styleHight
      return {
        ...value,
        styleHight: Math.floor(styleHight),
        currentTime: 0,
        isPlay: false
      }
    })
  },
  // 点击播放
  eventPlay(event) {
    const {
      index
    } = event.currentTarget.dataset
    this.showVideoList(index)
  },
  // 视频更新的时候不断的去记录播放的位置
  eventPlayupdate(event) {
    const {
      detail: {
        currentTime
      },
      currentTarget: {
        dataset: {
          index
        }
      }
    } = event

    this.info.videoPlayDetail[index] = currentTime
  },
  // 到底加载更多
  onReachBottom() {
    this.getVideoList()
  },
  // 设置播放的视频
  showVideoList(index) {
   
    let {
      videodetail
    } = this.data
    videodetail = videodetail.map(value => {
      value.isPlay = false
      return value
    })
    if (index >= 0 && videodetail[index]) {
      videodetail[index].isPlay = true
    }
    this.setData({
      videodetail
    })
  },
  // 全屏播放，设置当前页面滚动无效，全屏的时候，会触发滚动事件。
  eventFullScreen(event) {
    console.log(event)
    const {
      fullScreen
    } = event.detail
    this.setData({
      noPageScroll: fullScreen
    })
  },
  onPageScroll({
    scrollTop
  }) {
    if (this.data.noPageScroll) {
      return
    }
    // 获取数据分别放置到各自的节流防抖函数中，防止调用的时候数据已近发生改变

    // 节流，每200毫秒触发一次
    throttle(() => {
      console.log('throttle')
      let {
        location,
        localIndex,
        videodetail
      } = this.data
      let index = 0
      for (let i = 0; i < location.length; i++) {
        if (location[i].start <= scrollTop && location[i].end >= scrollTop) {
          index = i
          break
        }
      }

      if (localIndex !== index) {
        videodetail[localIndex].currentTime = this.info.videoPlayDetail[localIndex]
        this.setData({
          videoList
        })
        this.showVideoList()
      }
    }, 200)()

    // 防抖，只触发一次
    debounce(() => {
      console.log('debounce')
      let {
        location,
        isLock
      } = this.data
      if (!isLock) {
        let index = 0
        for (let i = 0; i < location.length; i++) {
          if (location[i].start <= scrollTop && location[i].end >= scrollTop) {
            index = i
            break
          }
        }

        this.showVideoList(index)
        this.setData({
          localIndex: index
        })
      }
    }, 200)()
  },
  // 测量当前的所有视频的高度，计算出视频播放与否的位置
  getLocationInfo() {
    const {
      videoList
    } = this.data
    var query = wx.createSelectorQuery()
    for (let i = 0; i < videodetail.length; i++) {
      query.select(`#video${i}`).boundingClientRect()
    }

    const length = videoList.length
    const location = []
    query.exec(res => {
      console.log(res)

      let start = 0
      let end = 0
      let lei = 0
      for (let i = 0; i < length; i++) {
        if (i === 0) {
          start = 0
          end = videodetail[i]['styleHight'] / 2
        } else {
          start = end
          end = lei + videodetail[i]['styleHight'] / 2
        }

        location.push({
          start: start,
          end: end
        })
        lei = lei + res[i].height + 10
      }
      this.setData({
        location
      })
    })
  }
})