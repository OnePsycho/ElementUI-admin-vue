//获取应用实例
const app = getApp();
var showType;
var shareName;
var shareId;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    urlDatas: [],
    evaluateDatas: [],
    imageList:[],
    preImageList:[],
    indicatorDots: true,
    autoplay: true,
    pageIndex: 1,
    interval: 3000,
    duration: 1000,
    imgWidth: 0,
    imgHeight: 0,
    screenWidth: 0,
    screenHeight: 0,
    swiperWidth:0,
    extraHide:true,
    _num:1,
    date_num: '',
    price_num: 1,
    isShow:true ,
    hideFlag:true,
    posterFlag: true,
    chooseFlag:true,
    carts_item: { 'name': '', 'phone': '', 'card_id': '', 'route_id': '', 'route_name': '', 'route_thum': '', 'date': '', 'num': '', 'price': '', 'time': '', 'openid': '', 'extra': ''},
    select_date:'',
    select_num:1,
    phone:'',
    name:'',
    card_id:'',
    liked:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id);
      wx.request({
        url: 'https://scwxlx.com/php/getRouteById.php',
        method: "GET",
        header: {
          'content-type': 'application/json' // 默认值
        },
        data: {
          id: options.id
        },
        success: function (res) {
          console.log(res.data);
          that.setData({
            urlDatas: res.data,
            'carts_item.route_id': options.id,
            'carts_item.num': that.data.select_num,
            preImageList: [res.data.route_slide_a, res.data.route_slide_b, res.data.route_slide_c, res.data.route_slide_d]

          });

          wx.setStorageSync('shareId', options.id);
          wx.setStorageSync('shareName',res.data[0].route_name);
          
          
        }
      })
   

    wx.showLoading({
      title: '正在加载',
    })
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res);
        that.setData({
          screenHeight: res.windowHeight,
          screenWidth: res.windowWidth*0.6,
          swiperWidth:res.windowWidth,
          imgHeight: res.windowWidth*0.6*1.77777
        });
      }
    });  



    //检查是否已收藏
    wx.request({
      url: 'https://scwxlx.com/php/checkCollect.php',
      method: "GET",
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        id: options.id,
        openid: app.globalData.openid
      },
      success: function (res) {
       if(res.data == 111){
         that.setData({
           liked:true
         })
       } else if (res.data == 222){
         that.setData({
           liked: false
         })
       }
      }
    });

    wx.showShareMenu({
      withShareTicket: true,
      success: function (res) {
        // 分享成功
      },
      fail: function (res) {
        // 分享失败
        console.log(res)
      }
    })
  },
  imageLoad:function(){
    wx.hideLoading();
  },
  //轮播图预览
  preSlideImage:function(e){
    var that = this;
    var a = e.currentTarget.dataset.a;
    var b = e.currentTarget.dataset.b;
    var c = e.currentTarget.dataset.c;
    var d = e.currentTarget.dataset.d;
    var index = e.currentTarget.dataset.index;
    var list = [a,b,c,d];
    wx.previewImage({
      current: list[index], // 当前显示图片的http链接   
      urls: list // 需要预览的图片http链接列表   
    })  
  },
  changeLike:function(e){
    var that = this;
    if(that.data.liked){
      // that.setData({
      //   liked: !that.data.liked
      // })
      
      // wx.showToast({
      //   title: '已取消收藏',
      //   icon:'none'
      // })
    }else{
      that.setData({
        liked: !that.data.liked
      })
      var openid = app.globalData.openid;
      var nickname = app.globalData.userInfo.nickName;
      var route_id = e.currentTarget.dataset.route_id;
      var route_name = e.currentTarget.dataset.name;
      var route_img = e.currentTarget.dataset.img;
      var route_summary = e.currentTarget.dataset.summary;
      
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
        url: 'https://scwxlx.com/php/addToCollect.php',
        method: "GET",
        header: {
          'content-type': 'application/json'
        },
        data: {
          openid: openid,
          nickname: nickname,
          route_id: route_id,
          route_name: route_name,
          route_img: route_img,
          route_summary: route_summary,
          time: time
        },
        success: function (res) {
          if (res.data == 1) {
            wx.showToast({
              title: '收藏成功！',
              icon: 'suc',
            });
          }
        }
      }) 
    }
   
  },
  changeChecked: function (e) {
    var that = this;
    var brand = e.currentTarget.id;
    that.setData({
      _num: e.target.dataset.num,
      isShow: true,
    })
  },
  changeChecked2: function (e) {
    var that = this;
    var brand = e.currentTarget.id;
    that.setData({
      date_num: e.target.dataset.num,
      isShow: true,
      'carts_item.date': e.currentTarget.dataset.value
      
    })
  },
  changeChecked3: function (e) {
    var that = this;
    var brand = e.currentTarget.id;
    that.setData({
      price_num: e.target.dataset.num,
      isShow: true
    })
  },
  showSheet:function(){
    var that = this;
    wx.showActionSheet({
      itemList: ['分享给好友', '生成海报'],
      success: function (res) {
        if(res.tapIndex == 1){
          that.setData({
            posterFlag:false
          })
        }
        if (res.tapIndex == 0) {
          wx.showToast({
            title: '点击右上方菜单栏-转发即可',
            icon:'none'
          })
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  onShareAppMessage: function () {
    var name = wx.getStorageSync('shareName');
    var id = wx.getStorageSync('shareId');
    return {
      title: name,
      path: '/pages/details/details?id='+id+'',
      success: function (res) {
        console.log(res.shareTickets[0])
        // console.log
        wx.getShareInfo({
          shareTicket: res.shareTickets[0],
          success: function (res) { console.log(res) },
          fail: function (res) { console.log(res) },
          complete: function (res) { console.log(res) }
        })
      },
      fail: function (res) {
        // 分享失败
        console.log(res)
      }
    }
  },
  showOverlay:function(e){
    var that = this;
    showType = e.currentTarget.dataset.type;
    if (app.globalData.userInfo){
      that.setData({
        hideFlag: !that.data.hideFlag
      })
    }else{
      wx.showToast({
        title: '请先登录',
        icon:'none',
        duration:2000
      })
      wx.switchTab({
        url: '../tab4/tab4',
      })
    }
    
  },
  //选择咨询类型
  chooseKefu:function(){
    var that = this;
    that.setData({
      chooseFlag:!that.data.chooseFlag
    })
  },
  //跳转二维码页面
  jumpToErCode:function(){
    wx.navigateTo({
      url: '../erCode/erCode',
    })
  },
  closeChoose:function(){
    var that = this;
    that.setData({
      chooseFlag:true
    })
  },
  closeOverlay: function () {
    var that = this;
    that.setData({
      hideFlag: !that.data.hideFlag
    })
  },
  //保存海报到手机
  savePoster:function(e){
    var url = e.currentTarget.dataset.url;
    var that = this;
    wx.downloadFile({
      url: url,
      success: function (res) {
        console.log(res)
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (res) {
            wx.showToast({
              title: '保存成功',
              icon:'suc'
            })
            that.setData({
              posterFlag:true
            })
          },
          fail: function (res) {
            console.log(res)
            console.log('fail')
          }
        })
      },
      fail: function () {
        console.log('fail')
      }
    })  
  },
  cancelPoster:function(){
    var that = this;
    that.setData({
      posterFlag:true
    })
  },

  reduceNum:function(){
    var that = this;
    if(that.data.select_num >= 2){
      that.setData({
        select_num:that.data.select_num-1,
        'carts_item.num':that.data.select_num-1
    })
      if (that.data.select_num == 1){
        that.setData({
          extraHide: true
        })
      }
    }
    
  },
  addNum:function(){
    var that = this;
    if (that.data.select_num < 10) {
      that.setData({
        select_num: that.data.select_num + 1,
        'carts_item.num': that.data.select_num+1,
        extraHide:false
      })
    }

  },

  //图片预览
  previewImage: function (e) {
    var url = e.currentTarget.dataset.url;
    var that = this;
    var list = [url];
    that.setData({
      imageList: list
    })
    wx.previewImage({
      current: that.data.imageList, // 当前显示图片的http链接   
      urls: that.data.imageList // 需要预览的图片http链接列表   
    })
    wx.getImageInfo({// 获取图片信息（此处可不要）
      src: url,
      success: function (res) {
        console.log(res)
        console.log(res.height)
      }
    })

  },

  getPhone:function(e){
    var that = this;
    that.setData({
      'carts_item.phone':e.detail.value
    })
  },
  getName: function (e) {
    var that = this;
    that.setData({
      'carts_item.name': e.detail.value
    })
  },
  getId: function (e) {
    var that = this;
    that.setData({
      'carts_item.card_id': e.detail.value
    })
  },
  getExtra: function (e) {
    var that = this;
    that.setData({
      'carts_item.extra': e.detail.value
    })
  },
  jumpToCarts:function(){
    wx.switchTab({
      url: '../tab3/tab3',
    })
  },

  addToCart: function (e) {
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
    var h = date.getHours();
    //分  
    var m = date.getMinutes();
    //秒  
    var s = date.getSeconds();

    var time = Y + "-" + M + "-" + D + " "+ h + ":" + m + ":" + s;

    that.setData({
      'carts_item.openid': app.globalData.openid,
      'carts_item.nickname': app.globalData.userInfo.nickName,
      'carts_item.price': e.target.dataset.price*that.data.select_num,
      'carts_item.route_name': e.target.dataset.route_name,
      'carts_item.route_thum': e.target.dataset.route_thum,
      'carts_item.time':time
    });

    if (that.data.carts_item.phone.length != 11 || that.data.carts_item.card_id.length != 18 || that.data.carts_item.date == '' ){
      wx.showToast({
        title: '请确认信息是否完整及正确！',
        icon: 'none',
      })
    } else if (that.data.carts_item.date == '' || that.data.carts_item.date == null) {
      that.setData({
        'carts_item.extra': ''
      })
    } else{
      console.log(that.data.carts_item);
      var flag = that.data.hideFlag;
      var that = this;


      wx.request({
        url: 'https://scwxlx.com/php/addToCart.php',
        method: "GET",
        header: {
          'content-type': 'application/json'
        },
        data:{
          name: that.data.carts_item.name,
          phone: that.data.carts_item.phone,
          card_id: that.data.carts_item.card_id,
          openid: that.data.carts_item.openid,
          nickname: that.data.carts_item.nickname,
          route_id: that.data.carts_item.route_id,
          route_name: that.data.carts_item.route_name,
          route_thum: that.data.carts_item.route_thum,
          date: that.data.carts_item.date,
          num: that.data.carts_item.num,
          price: that.data.carts_item.price,
          extra: that.data.carts_item.extra,
          time: that.data.carts_item.time
        },
        success: function (res) {
          if(res.data == 1){
            wx.showToast({
              title: '加入购物车成功！',
              icon: 'none',
              duration:2000
            });
            that.setData({
              hideFlag: !flag
            })
          }
        }
      }) 


    }
  },

  //进入付款界面
  payAction:function(e){
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
    var h = date.getHours();
    //分  
    var m = date.getMinutes();
    //秒  
    var s = date.getSeconds();

    var time = Y + "-" + M + "-" + D + " " + h + ":" + m + ":" + s;

    that.setData({
      'carts_item.openid': app.globalData.openid,
      'carts_item.nickname': app.globalData.userInfo.nickName,
      'carts_item.price': e.target.dataset.price * that.data.select_num,
      'carts_item.route_name': e.target.dataset.route_name,
      'carts_item.route_thum': e.target.dataset.route_thum,
      'carts_item.time': time
    });

    if (that.data.carts_item.phone.length != 11 || that.data.carts_item.card_id.length != 18 || that.data.carts_item.date == '') {
      wx.showToast({
        title: '请确认信息是否完整及正确！',
        icon: 'none',
      })
    }else {
      console.log(that.data.carts_item);
      wx.navigateTo({
        url: '../pay/pay?carts=' + JSON.stringify(that.data.carts_item) + '&price=' + e.target.dataset.price+'',
      })
  }
  },
  queryAciton:function(e){
    if(showType == "a"){
      this.addToCart(e);
    } if (showType == "b") {
      this.payAction(e);
    }
    }
})