//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carts:[],
    total:0
      },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      carts:JSON.parse(options.carts)
    })
    var carts = that.data.carts;
    var total = that.data.total;
    for(var i=0;i<carts.length;i++){
      total += 1.00 * carts[i].price;
    }
    that.setData({
      total : total
    })
  },

  payAction: function (e) {
    var that = this;
    var openid = app.globalData.openid;
    var fee = e.currentTarget.dataset.fee;

    wx.request({
      url: 'https://scwxlx.com/php/pay/WxPayAPI/example/jsapi.php',
      data: {
        openid: openid,
        fee: parseFloat(fee).toFixed(0)*100
      },
      
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        
        wx.requestPayment(
          {
            'timeStamp': res.data.timeStamp,
            'nonceStr': res.data.nonceStr,
            'package': res.data.package,
            'signType': 'MD5',
            'paySign': res.data.paySign,
            'success': function (res) {
              that.saveOrders(1);
              wx.redirectTo({
                url: '../pay_suc/suc',
              })
            },
            'fail': function (res) {
              that.saveOrders(0);
              wx.showToast({
                title: '支付未成功！',
                icon:'none'
              });
              wx.navigateTo({
                url: '../orders/orders',
              })
            }
          })
      }

    })
  },

  saveOrders(state){
    var that = this;
    var carts = that.data.carts;

    //获取当前时间戳  
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;

    //获取当前时间  
    var n = timestamp * 1000;
    var date = new Date(n);
    //年  
    var Y = date.getFullYear();
    //月  
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //日  
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    //时  
    var h = date.getHours();
    //分  
    var m = date.getMinutes();
    //秒  
    var s = date.getSeconds();

    var time = Y + "-" + M + "-" + D + " " + h + ":" + m + ":" + s;
    for(var i=0;i<carts.length;i++){
      var id = carts[i].id;
      wx.request({
        url: 'https://scwxlx.com/php/saveOrders.php?state='+state+'',
        method: "GET",
        header: {
          'content-type': 'application/json'
        },
        data: {
          name: carts[i].name,
          phone: carts[i].phone,
          card_id: carts[i].cardId,
          openid: app.globalData.openid,
          nickname: app.globalData.userInfo.nickName,
          route_id: carts[i].route_id,
          route_name: carts[i].route_name,
          route_thum:carts[i].route_thum,
          date: carts[i].date,
          num: carts[i].num,
          price: carts[i].price,
          extra: carts[i].extra,
          time: time
        },
        success: function (res) {
          console.log("saveOrder"+res.data);
          that.deleteOrdersFromCarts(id);
          
        }
      }) 
    }
  },
  deleteOrdersFromCarts(id){
    wx.request({
      url: 'https://scwxlx.com/php/deleteGood.php?id=' + id + '',
      method: "GET",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log("购物车移除成功！")
      }
    })
  }
})