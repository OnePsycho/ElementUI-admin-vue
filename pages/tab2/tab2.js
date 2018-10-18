// pages/tab2/tab2.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _num:1,
    isShow:false,
    urlDatas:[],
    imgHeight: 0,
    screenWidth: 0,
    screenHeight: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          screenHeight: res.windowHeight,
          screenWidth: res.windowWidth,
          imgHeight: res.windowWidth *0.9* 0.46875,
        });
      }
    });  

    // wx.setStorageSync('tab2_index', "1");
    

  },

  changeChecked: function (e) {
    var that = this;
    var brand = e.currentTarget.id;
    var typee = e.target.dataset.type;
    that.setData({
      _num: e.target.dataset.num,
      isShow: true
    })
    wx.showLoading({
      title: '加载中',
    }),
      wx.request({
      url: 'https://scwxlx.com/php/getRoutesByType.php?type=' + typee + '',
        header: {
          'content-type': 'application/json' // 默认值
        },
        method: "GET",
        success: function (res) {
           wx.setStorageSync('tab2_index', e.target.dataset.num);
           wx.setStorageSync('tab2_type', e.target.dataset.type);          
          that.setData({
            urlDatas: res.data,
          });
          wx.hideLoading();
        },
        fail: function () {
          console.log("获取数据失败！");
        }
      });
    setTimeout(function () {
      that.setData({
        isShow: false
      })
    }, 1000)

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
    var route_type;
    wx.getStorage({
      key: 'tab2_index',
      success: function(res) {
        console.log(res.data);
        that.setData({
          _num:res.data
        })
        if(res.data=="1"){
          route_type = "xiang";
        }else if(res.data == "2"){
          route_type = "eat";
        } else if (res.data == "3") {
          route_type = "young";
        }else{
          route_type = "activity";
        }
        wx.showLoading({
          title: '加载中',
        }),
          wx.request({
            url: 'https://scwxlx.com/php/getRoutesByType.php?type=' + route_type + '',
            header: {
              'content-type': 'application/json' // 默认值
            },
            method: "GET",
            success: function (res) {
              console.log(res.data);
              that.setData({
                urlDatas: res.data,
              });
              wx.hideLoading();
            },
            fail: function () {
              console.log("获取数据失败！");
            }
          });
        setTimeout(function () {
          that.setData({
            isShow: false
          })
        }, 1000)
      },
      fail:function(){
        wx.showLoading({
          title: '加载中',
        }),
          wx.request({
            url: 'https://scwxlx.com/php/getRoutesByType.php?type=xiang',
            header: {
              'content-type': 'application/json' // 默认值
            },
            method: "GET",
            success: function (res) {
              console.log(res.data);
              that.setData({
                urlDatas: res.data,
              });
              wx.hideLoading();
            },
            fail: function () {
              console.log("获取数据失败！");
            }
          });
      }
    })
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
    wx.stopPullDownRefresh();
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