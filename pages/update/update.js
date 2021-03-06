import utils from '../../utils/index'
let app = getApp()
const today = new Date()
const week = [
  { value: '周日', class: 'weekend' },
  { value: '周一', class: '' },
  { value: '周二', class: '' },
  { value: '周三', class: '' },
  { value: '周四', class: '' },
  { value: '周五', class: '' },
  { value: '周六', class: 'weekend' },
]

Page({
  properties: {
    date: {
      type: String,
      value: '',
      observer: 'init',
    }
  },

  data: {

  },

  goBack: function () {
    wx.navigateBack({
      delta: 1
    })
  },

  onLoad: function (options) {
    let curRecordId = options.id
    this.setData({
      curRecordId: curRecordId
    })
    this.fetchBooking()
  },
  
  fetchBooking() {
    utils.showBooking(this.data.curRecordId, (res) => {
      this.setData({
        oldBooking: res.data.objects
      })
    })
  },

  onShow(options) {
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
    // reset form
    this.setData({
      datePicked: false,
      date: ""
    })
  },

  onReady(options) {
    this.init()
  },

  // START OF CALENDAR
  isDate(date) {
    if (date == null || date == undefined) {
      return false
    }
    return new Date(date).getDate() == date.substring(date.length - 2)
  },

  isLeapYear(y) {
    return y % 400 == 0 || (y % 4 == 0 && y % 100 != 0)
  },

  isToday(y, m, d) {
    return y == today.getFullYear() && m == today.getMonth() + 1 && d == today.getDate()
  },

  isWeekend(emptyGrids, d) {
    return (emptyGrids + d) % 7 == 0 || (emptyGrids + d - 1) % 7 == 0
  },

  calEmptyGrid(y, m) {
    const result = new Date(`${y}/${m}/01 00:00:00`).getUTCDay()
    return result + 1 || ''
  },

  calDaysInMonth(y, m) {
    let leapYear = this.isLeapYear(y)
    if (m == 2 && leapYear) {
      return 29
    }
    if (m == 2 && !leapYear) {
      return 28
    }
    if ([4, 6, 9, 11].includes(m)) {
      return 30
    }
    return 31
  },

  calWeekDay(y, m, d) {
    return new Date(`${y}/${m}/${d} 00:00:00`).getUTCDay() || ''
  },

  calDays(y, m) {
    let { selected } = this.data
    let emptyGrids = this.calEmptyGrid(y, m)
    let days = []
    for (let i = 1; i <= 31; i++) {
      let ifToday = this.isToday(y, m, i)
      let isSelected = selected[0] == y && selected[1] == m && selected[2] == i
      let today = ifToday ? 'today' : ''
      let select = isSelected ? 'selected' : ''
      let weekend = this.isWeekend(emptyGrids, i) ? 'weekend' : ''
      let todaySelected = ifToday && isSelected ? 'today-selected' : ''
      let day = {
        value: i,
        class: `date-bg ${weekend} ${today} ${select} ${todaySelected}`,
      }
      days.push(day)
    }
    return days.slice(0, this.calDaysInMonth(y, m))
  },

  changeMonth: function (e) {
    let id = e.currentTarget.dataset.id
    let currYear = this.data.currYear
    let currMonth = this.data.currMonth
    currMonth = id == 'prev' ? currMonth - 1 : currMonth + 1
    if (id == 'prev' && currMonth < 1) {
      currYear -= 1
      currMonth = 12
    }
    if (id == 'next' && currMonth > 12) {
      currYear += 1
      currMonth = 1
    }

    const emptyGrids = this.calEmptyGrid(currYear, currMonth)
    const days = this.calDays(currYear, currMonth)
    this.setData({ currYear, currMonth, emptyGrids, days })
  },

  // select year and month
  handleDatePickerChange(e) {
    let [year, month] = e.detail.value.split('-')
    year = parseInt(year)
    month = parseInt(month)
    this.setData({ currYear: year, currMonth: month })
    const emptyGrids = this.calEmptyGrid(year, month)
    const days = this.calDays(year, month)
    this.setData({ emptyGrids, days })
  },

  handleSelectDate: function (e) {
    // get user selected date
    let data = e.target.dataset.selected
    let selected = data[2]
    data.forEach((num, index) => {
      num = num.toString()
      if (num.length < 2) {
        num = ("0").concat(num);
      };
      data[index] = num
    });
    let date = data.join("-")
    this.setData({
      selected: selected,
      date: date,
      datePicked: true,
      // reset timeArray + duration + price
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
      bookingArray: [],
      duration: "",
      price: ""
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
  // END OF CALENDAR

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
  },

  updateBooking(e) {
    utils.updateBooking(this, (res) => {
      this.fetchBooking()
      this.setData({ curRecordId: '' })
    })
    wx.navigateTo({
      url: '../bookings/bookings'
    })
  },

  init() {
    const { date } = this.data
    const dateTime = this.isDate(date) ? new Date(date) : today

    const year = dateTime.getFullYear()
    const month = dateTime.getMonth() + 1
    const dayInMonth = dateTime.getDate()
    const dayInWeek = dateTime.getDay()

    const selected = [year, month, dayInMonth]
    this.setData({ date: date, currYear: year, currMonth: month, dayInMonth, week, selected })
    const emptyGrids = this.calEmptyGrid(year, month)
    const days = this.calDays(year, month)
    this.setData({ emptyGrids, days })
  }
})