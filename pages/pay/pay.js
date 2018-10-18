//获取应用实例
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    item_date: '',
    item_price: '',
    item_total: '',
    item_num: '',
    item_route_name: '',
    item_route_img: '',
    item_name: '',
    item_phone: '',
    item_cardId: '',
    item_extra:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    if(options.flag == "order"){
      var cartss = JSON.parse(options.carts);
      var carts = cartss[0];
      
    }else{
      var carts = JSON.parse(options.carts);
    }
    var that = this;
    that.setData({
      item_route_name:carts.route_name,
      item_route_img:carts.route_thum,
      item_route_id:carts.route_id,
      item_date:carts.date,
      item_num:carts.num,
      item_price:options.price,
      item_total:carts.price,
      item_name:carts.name,
      item_phone:carts.phone,
      item_cardId:carts.card_id,
      item_extra:carts.extra
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
        fee: parseFloat(fee).toFixed(0) * 100
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
                icon: 'none'
              });
              wx.navigateTo({
                url: '../orders/orders',
              })
            }
          })
      }

    })
  },

  saveOrders(state) {
    var that = this;

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
    var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    //分  
    var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    //秒  
    var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();

    var time = Y + "-" + M + "-" + D + " " + h + ":" + m + ":" + s;

      wx.request({
        url: 'https://scwxlx.com/php/saveOrders.php?state=' + state + '',
        method: "GET",
        header: {
          'content-type': 'application/json'
        },
        data: {
          name: that.data.item_name,
          phone: that.data.item_phone,
          card_id: that.data.item_cardId,
          openid: app.globalData.openid,
          nickname: app.globalData.userInfo.nickName,
          route_id: that.data.item_route_id,
          route_name: that.data.item_route_name,
          route_thum:that.data.item_route_img,
          date: that.data.item_date,
          num: that.data.item_num,
          price: that.data.item_total,
          extra: that.data.item_extra,
          time: time
        },
        success: function (res) {
          console.log("saveOrder" + res.data);
        }
      })
  },

})