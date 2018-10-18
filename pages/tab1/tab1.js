// pages/tab1/tab1.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [{ id: "1", url: "https://hystkj.com/xiang/slide/slide1.jpg" },
      { id: "2", url: "https://hystkj.com/xiang/slide/slide2.jpg" },
      { id: "3", url: "https://hystkj.com/xiang/slide/slide3.jpg" },
      { id: "4", url: "https://hystkj.com/xiang/slide/slide4.jpg" }
      ]
    ,
    sampleUrls: [],
    urlDatas: [],
    evaluateDatas: [],
    indicatorDots: true,
    autoplay: true,
    pageIndex: 1,
    interval: 3000,
    duration: 1000,
    slide_height:0,
    imgHeight:0,
    screenWidth: 0,
    screenHeight: 0 ,
    animated:false,
    animated2: false,
    animated3: false,
    animated4:false,
    Timestamp:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    var getTimestamp = new Date().getTime();

    wx.showLoading({
      title: '努力加载中...',
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          screenHeight: res.windowHeight,
          screenWidth: res.windowWidth,
          imgHeight: res.windowWidth*0.4453125,
          slide_height:(res.windowWidth-20)*0.5625,
          Timestamp: getTimestamp
        });
      }
    });  

    wx.request({
      url: 'https://scwxlx.com/php/getSampleData.php',
      method: "GET",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          sampleUrls: res.data,
        });
      }
    })

  },

  jumpToRoutes:function(e){
    var index = e.currentTarget.dataset.index;
    var route_type = e.currentTarget.dataset.type;
    wx.setStorage({
      key: 'tab2_index',
      data: index,
    });
    wx.setStorage({
      key: 'tab2_type',
      data: route_type,
    })
    wx.switchTab({
      url: '../tab2/tab2',
    })
  },


  jumpToDetails:function(e){
    var index = e.currentTarget.id;
    wx.navigateTo({
      url: '../details/details?id='+index+'',
    })
  },

  imageLoad: function () {
    setTimeout(function(){
      wx.hideLoading();
    },5000);
  },

  toolsTap:function(){
    var that = this;
    that.setData({
      animated4: !that.data.animated4,
    })
    if(that.data.animated2){
      that.setData({
        animated2: !that.data.animated2,
        animated3: !that.data.animated3
      })
    }else{
      setTimeout(function () {
        that.setData({
          animated2: !that.data.animated2,
          animated3: !that.data.animated3
        })
      }, 300)
    }
   
    
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
    var that = this;
    that.setData({
      animated:true
    })



    // setInterval(function(){
    //   //获取当前时间戳  
    //   var timestamp = Date.parse(new Date());
    //   timestamp = timestamp / 1000;

    //   //获取当前时间  
    //   var n = timestamp * 1000;
    //   var date = new Date(n);
    //   //年  
    //   var Y = date.getFullYear();
    //   //月  
    //   var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //   //日  
    //   var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    //   //时  
    //   var h = date.getHours();
    //   //分  
    //   var m = date.getMinutes();
    //   //秒  
    //   var s = date.getSeconds();

    //   var time = Y + "-" + M + "-" + D + " " + h + ":" + m + ":" + s;
    //   console.log(time);
    // },1000);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    var that = this;
    that.setData({
      animated: false
    })
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
    var that = this;

    wx.showLoading({
      title: '努力加载中...',
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          screenHeight: res.windowHeight,
          screenWidth: res.windowWidth,
          imgHeight: res.windowWidth * 0.4453125,
          slide_height: (res.windowWidth - 20) * 0.5625
        });
      }
    });

    wx.request({
      url: 'https://scwxlx.com/php/getSampleData.php',
      method: "GET",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          sampleUrls: res.data,
        });
        wx.hideLoading();
        wx.stopPullDownRefresh();
      }
    })
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