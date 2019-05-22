// pages/faq/faq.js
var app = getApp()
Page({
  data: {
  },

  goBack: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  
  shoufenqin(e) {
    var listid = e.currentTarget.dataset.listid;
    this.data.did = listid;
    if (this.data.shoufenqinBloo == this.data.did) {
      this.setData({
        shoufenqinName: 0,
        shoufenqinBloo: ''
      })
    } else {
      this.setData({
        shoufenqinName: listid,
        shoufenqinBloo: listid
      })
    }
  }
})