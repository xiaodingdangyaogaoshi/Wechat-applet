// pages/couse/couse.js
function getRandomColor(){
  var colorStr=Math.floor(Math.random()*0xFFFFFF).toString(16);
  return "#"+"000000".substring(0,6-colorStr)+colorStr;
}
Page({
  inputValue:"",
  data: {
src:'http://mvvideo1.meitudata.com/540d2f68acf7a9581.mp4',
danmulist:[
  {
  text:'111',
  color:'#ff0000',
  time:2
  },{
    text: '555',
    color: '#ff00ff',
    time: 5
  }
]
  },
  onReady:function(res){
this.videoContext=wx.createVideoContext('myVideo')
  },
  bindInputBlur:function(e){
    this.inputValue=e.detail.value
  },
  bindSendDanmu:function(){
this.videoContext.sendDanmu({
  text:this.inputValue,
  color:getRandomColor()
})
  },
  videoErrorCallback:function(e){
    console.log('视频错误信息：')
    console.log(e.detail.errMsg)
  }
})