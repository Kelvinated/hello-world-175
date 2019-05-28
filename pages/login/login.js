Page({
  data: {

  },
  userInfoHandler(data) {
    // let page = this
    wx.BaaS.auth.loginWithWechat(data).then((user) => {
      console.log("Login successful")
    }, (err) => {
      console.log(err)
    })
    wx.navigateTo({
      url: '../first/first'
    })
  }
})
