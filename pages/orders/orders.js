// pages/orders/orders.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _num: 1,
    isShow: false,
    hideFlag: true,
    hidden: '',
    orderDatas:[],
    carts:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if(options.num){
      that.setData({
        _num:2
      })
      wx.showLoading({
        title: '加载中',
      }),
        wx.request({
          url: 'https://scwxlx.com/php/getOrdersByState.php?state=1&openid=' + app.globalData.openid + '',
          header: {
            'content-type': 'application/json' // 默认值
          },
          method: "GET",
          success: function (res) {
            console.log(res.data);
            if (res.data == 2) {
              that.setData({
                hideFlag: true
              })
            } else {
              that.setData({
                orderDatas: res.data,
                hideFlag: false
              });
            }
            wx.hideLoading();
          },
          fail: function () {
            console.log("获取数据失败！");
          }
        });
    }else{
      wx.showLoading({
        title: '加载中',
      }),
        wx.request({
          url: 'https://scwxlx.com/php/getOrdersByState.php?state=0&openid=' + app.globalData.openid + '',
          header: {
            'content-type': 'application/json' // 默认值
          },
          method: "GET",
          success: function (res) {
            console.log(res.data);

            if (res.data == 2) {
              that.setData({
                hideFlag: true
              })
            } else {
              that.setData({
                orderDatas: res.data,
                hideFlag: false
              });
            }
            wx.hideLoading();
          },
          fail: function () {
            console.log("获取数据失败！");
          }
        });
    }


  },
  changeChecked: function (e) {
    var that = this;
    var state = e.currentTarget.dataset.state;
    that.setData({
      _num: e.target.dataset.num,
      isShow: true
    })
    wx.showLoading({
      title: '加载中',
    }),
      wx.request({
      url: 'https://scwxlx.com/php/getOrdersByState.php?state='+state+'&openid=' + app.globalData.openid +'',
        header: {
          'content-type': 'application/json' // 默认值
        },
        method: "GET",
        success: function (res) {
          console.log(res.data);
          if (res.data == 2) {
            that.setData({
              hideFlag: true
            })
          } else {
            that.setData({
              orderDatas: res.data,
              hideFlag: false
            });
          }
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

  jumpToPay:function(e){
    var state = e.currentTarget.dataset.state;
    var id = e.currentTarget.dataset.id;
    var that = this;
    if(state == 0){
      wx.showLoading({
        title: '加载中',
      }),
        wx.request({
          url: 'https://scwxlx.com/php/getOrdersById.php?id=' + id + '',
          header: {
            'content-type': 'application/json' // 默认值
          },
          method: "GET",
          success: function (res) {
            console.log(res.data);
              that.setData({
                carts: res.data,
              });

              wx.navigateTo({
                url: '../pay/pay?carts=' + JSON.stringify(res.data) + '&price=' + e.currentTarget.dataset.price + '&flag=order',
              })
            
            wx.hideLoading();
          },
          fail: function () {
            console.log("获取数据失败！");
          }
        });


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