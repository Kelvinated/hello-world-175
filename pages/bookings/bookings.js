import utils from '../../utils/index'
let app = getApp()

Page({
  data: {
    bookings: []
  },

  onShow: function (options) {
    this.fetchBookings()
  },

  fetchBookings() {
    console.log(wx.BaaS.storage.get('uid'))
    utils.getBookings(wx.BaaS.storage.get('uid'), (res) => {
      this.setData({
        bookings: res.data.objects
      })
    })
  },

  deleteBooking(e) {
    this.setData({
      curRecordId: e.target.dataset.booking,
    })
    utils.deleteBooking(this, (res) => {
      this.fetchBookings()
      this.setData({ curRecordId: '' })
    })
  }
})