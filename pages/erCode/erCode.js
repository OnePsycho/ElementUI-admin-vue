// pages/erCode/erCode.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  previewImage: function () {
    var that = this;
    var list = ['https://scwxlx.com/erCode.jpg?js=sss'];
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