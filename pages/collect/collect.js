//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    urlDatas:[],
    hasUser:'',
    hideFlag:false,
    imgHeight: 0,
    screenWidth: 0,
    screenHeight: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(app.globalData.openid);
    if (app.globalData.userInfo) {
      if (app.globalData.openid) {
        var openid = app.globalData.openid;
        that.setData({
          hasUser: true
        });

        wx.request({
          url: 'https://scwxlx.com/php/getCollectDatasById.php?openid=' + openid + '',
          method: "GET",
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            if (res.data == 2) {
              that.setData({
                hasUser: false,
                hideFlag: false
              });
            } else {
              console.log(res.data);
              that.setData({
                urlDatas: res.data,
                hideFlag:true
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

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          screenHeight: res.windowHeight,
          screenWidth: res.windowWidth,
          imgHeight: res.windowWidth * 0.9 * 0.46875,
        });
      }
    });  
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
  * 删除购物车当前商品
  */
  deleteList(e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确认取消收藏该路线吗?',
      success: function (res) {
        if (res.confirm) {
          const index = e.currentTarget.dataset.index;
          let urlDatas = that.data.urlDatas;
          urlDatas.splice(index, 1);
          that.setData({
            urlDatas: urlDatas
          });
          that.delectAction(e.currentTarget.dataset.id);  
        } else {
          console.log('用户点击取消')
        }

      }
    })
  },
  /**
* 后台删除购物车当前商品
*/
  delectAction(id) {
    wx.request({
      url: 'https://scwxlx.com/php/deleteCollect.php?id=' + id + '',
      method: "GET",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data == 1) {
          wx.showToast({
            title: '删除成功！',
            icon: 'suc'
          })
        }
      }
    })

  }
})