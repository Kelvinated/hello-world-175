import utils from '../../utils/index'
let app = getApp()

Page({
  data: {
    bookings: [],
    editMode: false
  },
  
  goBack: function () {
    wx.navigateBack({
      delta: 1
    })
  },

  onShow: function (options) {
    this.fetchBookings()
  },

  fetchBookings() {
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
  },

  toUpdate(e) {
    this.setData({
      curRecordId: e.target.dataset.booking,
    })
    wx.navigateTo({
      url: '../update/update?id=' + this.data.curRecordId
    })
    // utils.updateBooking(this, (res) => {
    //   this.fetchBookings()
    //   this.setData({ curRecordId: '' })
    // })
  }
})