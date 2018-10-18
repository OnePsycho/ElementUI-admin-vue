//获取应用实例
const app = getApp()
// pages/tab3/tab3.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isChecked:true,
    hasUser:false,
    carts:[],
    openid:'',
    payCarts:[],
    trueNum:0,
    hasList: false,          // 列表是否有数据
    totalPrice: 0,           // 总价，初始为0
    selectAllStatus: false    // 全选状态，默认全选,
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var openid = app.globalData.openid;
    var userInfo = app.globalData.userInfo;
    wx.setStorage({
      key: 'openid',
      data: openid,
    });
    wx.setStorage({
      key: 'userInfo',
      data: userInfo,
    });
  },
  //item选中与未选中切换
  changeChecked:function(e){
    var that = this;
    that.setData({
      isChecked:!that.data.isChecked
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    if (app.globalData.userInfo) {
      if (app.globalData.openid) {
        var openid = app.globalData.openid;
        
        that.setData({
          hasUser: true
        });

        wx.request({
          url: 'https://scwxlx.com/php/getCartsDatas.php?openid=' + openid + '',
          method: "GET",
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            if (res.data == 2) {
              that.setData({
                hasUser: false
              });
            } else {
              console.log(res.data);
              that.setData({
                carts: res.data,
              });
              wx.hideLoading();
            }
          }
        })


      }
    } else {
      that.setData({
        hasUser: false
      })
    }
  },


  /**
 * 当前商品选中事件
 */
  selectList(e) {
    var that = this;
    let selectAllStatus = this.data.selectAllStatus;
    var flag = 0;
    const index = e.currentTarget.dataset.index;
    const dbId = e.currentTarget.dataset.dbid;
    let carts = this.data.carts;
    const selected = carts[index].selected*1;
    carts[index].selected = !selected;
    if (carts[index].selected){
      flag = 1
    };

    this.setData({
      carts: carts
    });
    
    this.getTotalPrice();
    this.checkNum();

    //修改后台数据表中的selected
    wx.request({
      url: 'https://scwxlx.com/php/changeFlag.php?dbId=' + dbId +'',
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: "GET",
      data:{
          flag : flag
      },
      success: function (res) {
      },
      fail: function () {
        console.log("获取数据失败！");
      }
    });


  },
  /**
   * 购物车全选事件
   */
  selectAll(e) {
    let selectAllStatus = this.data.selectAllStatus;
    selectAllStatus = !selectAllStatus;
    var openid = app.globalData.openid;
    let carts = this.data.carts;

    for (let i = 0; i < carts.length; i++) {
      carts[i].selected = selectAllStatus;
    }
    
    this.setData({
      selectAllStatus: selectAllStatus,
      carts: carts
    });
    this.getTotalPrice();

    if(selectAllStatus){
      wx.request({
        url: 'https://scwxlx.com/php/changeAll.php?openid=' + openid + '',
        header: {
          'content-type': 'application/json' // 默认值
        },
        method: "GET",
        data: {
          flag: 1
        },
        success: function (res) {
        },
        fail: function () {
          console.log("获取数据失败！");
        }
      });
    } else {
      wx.request({
        url: 'https://scwxlx.com/php/changeAll.php?openid=' + openid + '',
        header: {
          'content-type': 'application/json' // 默认值
        },
        method: "GET",
        data: {
          flag: 0
        },
        success: function (res) {
        },
        fail: function () {
          console.log("获取数据失败！");
        }
      });
      
    }

    
  }, 
   /**
   * 计算总价
   */
  getTotalPrice() {
    let carts = this.data.carts;                  // 获取购物车列表
    let total = 0;
    var num = this.data.trueNum;
    for (let i = 0; i < carts.length; i++) {         // 循环列表得到每个数据
      if (carts[i].selected*1) {                     // 判断选中才会计算价格
        total += 1.00 * carts[i].price;   // 所有价格加起来
      }
    }
    this.setData({                                // 最后赋值到data中渲染到页面
      carts: carts,
      totalPrice: total.toFixed(2),
    });
  },
  /**
* 检查
*/
  checkNum() {
    let selectAllStatus = this.data.selectAllStatus;
    let carts = this.data.carts;                  // 获取购物车列表
    var total = this.data.totalPrice
    var mprice = 0;
    for (let i = 0; i < carts.length; i++) {         // 循环列表得到每个数据
      if (carts[i].selected * 1) {                     // 判断选中才会计算价格
          mprice += 1
          if (mprice == carts.length){
            this.setData({                                // 最后赋值到data中渲染到页面
              selectAllStatus: !selectAllStatus,
            });
          }else{
            this.setData({                                // 最后赋值到data中渲染到页面
              selectAllStatus: false,
            });
          }
      }
    }
  },


  /**
 * 删除购物车当前商品
 */
  deleteList(e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确认从购物车移除该商品吗?',
      success: function (res) {
        if (res.confirm) {
          const index = e.currentTarget.dataset.index;
          let carts = that.data.carts;
          carts.splice(index, 1);
          that.setData({
            carts: carts
          });

          that.delectAction(e.currentTarget.dataset.id);
          if (!carts.length) {
            that.setData({
              hasList: false
            });
          } else {
            that.getTotalPrice();
          }
        } else {
          console.log('用户点击取消')
        }

      }
    })
  },
    /**
 * 后台删除购物车当前商品
 */
  delectAction(id){
    wx.request({
      url: 'https://scwxlx.com/php/deleteGood.php?id=' + id + '',
      method: "GET",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data == 1) {
          wx.showToast({
            title: '删除成功！',
            icon:'suc'
          })
        } 
      }
    })
    
    },
    //去逛逛
  jumpToBuy:function(){
    wx.switchTab({
      url: '../tab2/tab2',
    })
  },
  //微信支付主战场！
  pay: function () {
    var that = this;
    var openid = app.globalData.openid;
    var total = that.data.totalPrice;

    if(total==0){
      wx.showToast({
        title: '您暂未选取任何商品！',
        icon:'none'
      })
    }else{
      wx.request({
        url: 'https://scwxlx.com/php/getPayCartsById.php',
        header: {
          'content-type': 'application/json' // 默认值
        },
        data: {
          openid: openid
        },
        success: function (res) {
          console.log(res.data);
          that.setData({
            payCarts: res.data
          })
          wx.navigateTo({
            url: '../pays/pays?carts=' + JSON.stringify(that.data.payCarts),
          })
        }
      })
    }    
  },
  /**
 * 页面相关事件处理函数--监听用户下拉动作
 */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  }

})