import utils from '../../utils/index'
let app = getApp()

Page({
  data: {
      datePicked: false
  },

  onLoad(options) {
    // load all existing bookings
    let tableId = getApp().globalData.tableId,
      Bookings = new wx.BaaS.TableObject(tableId),
      query = new wx.BaaS.Query()
    Bookings.setQuery(query).find()
      .then((res) =>
        this.setData({
          unavailableObjectArray: res.data.objects
        })
      )
      .catch((err) =>
      console.dir("Failed to load unavailable slots")
      )
  },

  bindDateChange: function (e) {
    // get user selected date
    const date = e.detail.value
    this.setData({
      date: date,
      datePicked: true
    })
    // reset timeArray
    this.setData({
      timeArray: [
        { time: '09:00 - 10:00', active: "", available: "", clickable: "selectTime" },
        { time: '10:00 - 11:00', active: "", available: "", clickable: "selectTime" },
        { time: '11:00 - 12:00', active: "", available: "", clickable: "selectTime" },
        { time: '12:00 - 13:00', active: "", available: "", clickable: "selectTime" },
        { time: '13:00 - 14:00', active: "", available: "", clickable: "selectTime" },
        { time: '14:00 - 15:00', active: "", available: "", clickable: "selectTime" },
        { time: '15:00 - 16:00', active: "", available: "", clickable: "selectTime" },
        { time: '16:00 - 17:00', active: "", available: "", clickable: "selectTime" },
        { time: '17:00 - 18:00', active: "", available: "", clickable: "selectTime" }
      ],
      bookingArray: []
    })
    // create array of unavailable time slots on the selected date
    const unavailableObjectArray = this.data.unavailableObjectArray
    let unavailableArray = []
    unavailableObjectArray.forEach((object) => {
      if (date === object.date.slice(0, 10)) {
        unavailableArray.push(object.bookingArray)
      };
      unavailableArray = [].concat.apply([], unavailableArray);
    });
    // set hour button formatting for unavailable times
    const timeArray = this.data.timeArray
    for (var i = timeArray.length - 1; i >= 0; i--) {
      if (unavailableArray.includes(timeArray[i].time)) {
        timeArray[i].available = "buttonUnavailable";
        timeArray[i].clickable = "";
      }
    };
    this.setData({
      timeArray: timeArray
    })
  },

  selectTime: function (e) {
    // build bookingArray
    const bookingArray = this.data.bookingArray
    const userSelection = e.currentTarget.dataset.hour.time
    if (bookingArray.includes(userSelection)) {
      bookingArray.splice(bookingArray.indexOf(userSelection), 1)
    } else {
    bookingArray.push(userSelection)
    }
    this.setData({
      bookingArray: bookingArray.sort()
    })
    console.log(this.data.bookingArray)

    // set hour button formatting for selected times
    const timeArray = this.data.timeArray
    for (var i = timeArray.length - 1; i >= 0; i--) {
      if (bookingArray.includes(timeArray[i].time)) {
        timeArray[i].active = "buttonActive";
      } else {
        timeArray[i].active = "";
      }
    };
    this.setData({
      timeArray: timeArray
    })

    // calculate duration
    const duration = bookingArray.length
    const price = Math.min(3, duration) * 65 + Math.max(0, (duration - 3)) * 130
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