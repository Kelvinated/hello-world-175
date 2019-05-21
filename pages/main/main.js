import utils from '../../utils/index'
let app = getApp()

Page({
  data: {
    timeArray: ['09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00']
  },

  // onReady: function (options) {
  //   let page = this
  //   wx.BaaS.auth.getCurrentUser().then((user) => {
  //     page.setData({
  //       user: user
  //     })
  //   })
  // },

  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },

  bindStartTimeChange: function (e) {
    this.setData({
      startTime: e.detail.value
    })
  },

  bindEndTimeChange: function (e) {
    this.setData({
      endTime: e.detail.value
    })
    const startTime = this.data.startTime
    const endTime = this.data.endTime
    const duration = parseInt(endTime.split(':')[0]) - parseInt(startTime.split(':')[0])
    const price = Math.min(3, duration) * 65 + Math.max(0,(duration - 3))*130
    this.setData({
      duration: duration,
      price: price
    })
  },

  createBooking() {
    // let params = {
    //   totalCost: this.data.price,
    //   merchandiseDescription: 'Red Door Studio'
    // }

    // wx.BaaS.pay(params).then(res => {
    //   console.log('Transaction no:', res.transaction_no)
    // }, err => {
    //   if (err.code === 607) {
    //     console.log('用户取消支付')
    //   } else if (err.code === 608) {wx.BaaS.storage.get('uid')
    //     console.log('支付失败', err.message)
    //   }
    // })

    utils.addBooking(this, (res) => {
      console.log(res)
    })
    wx.switchTab({
      url: '../bookings/bookings',
    })
  }
})