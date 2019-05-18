//app.js
App({
  onLaunch: function() {
    wx.BaaS = requirePlugin('sdkPlugin')
    //让插件帮助完成登录、支付等功能
    wx.BaaS.wxExtend(wx.login,
      wx.getUserInfo,
      wx.requestPayment)

    wx.BaaS.init('8435d2193cdc61d3423c')
  },

  globalData: {
    clientId: '8435d2193cdc61d3423c', // 从 BaaS 后台获取 ClientID
    tableId: '74475', // 从 https://cloud.minapp.com/dashboard/ 管理后台的数据表中获取
  }
})
