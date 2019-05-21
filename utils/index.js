let addBooking = (ctx, cb) => {
  let tableId = getApp().globalData.tableId,
    Bookings = new wx.BaaS.TableObject(tableId),
    Booking = Bookings.create(),
    date = ctx.data.date,
    bookingArray = ctx.data.bookingArray,
    duration = ctx.data.duration,
    price = ctx.data.price
  let startTime = ((bookingArray[0]).split(" - "))[0],
    endTime = ((bookingArray[bookingArray.length - 1]).split(" - "))[1]
  let data = {
    date,
    bookingArray,
    startTime,
    endTime,
    duration,
    price
  }
  Booking.set(data)
    .save()
    .then(res => cb(res))
    .catch(err => console.dir(err))
}

let getBookings = (uid, cb) => {
  let tableId = getApp().globalData.tableId,
    Bookings = new wx.BaaS.TableObject(tableId),
    query = new wx.BaaS.Query()

  query.compare('created_by', '=', uid)
  Bookings.setQuery(query).find()
    .then(res => cb(res))
    .catch(err => console.dir(err))
}

let deleteBooking = (ctx, cb) => {
  let tableId = getApp().globalData.tableId,
    recordId = ctx.data.curRecordId

  let Bookings = new wx.BaaS.TableObject(tableId)

  Bookings.delete(recordId)
    .then(res => cb(res))
    .catch(err => console.dir(err))
}

// let updateProfile = (ctx, cb) => {
//   let tableName = '_userprofile',
//     recordId = ctx.data.curRecordId,
//     firstName = ctx.data.firstName

//   let Users = new wx.BaaS.TableObject(tableName),
//     User = Users.getWithoutData(recordId)

//   let data = {
//     firstName
//   }

//   User.set(data)
//     .update()
//     .then(res => cb(res))
//     .catch(err => console.dir(err))
// }

module.exports = {
  addBooking,
  getBookings,
  deleteBooking
  // updateProfile
}


// let updateBook = (ctx, cb) => {
//   let tableId = getApp().globalData.tableId,
//     recordId = ctx.data.curRecordId,
//     bookName = ctx.data.editingBookName

//   let Books = new wx.BaaS.TableObject(tableId),
//     Book = Books.getWithoutData(recordId)

//   let data = {
//     bookName
//   }

//   Book.set(data)
//     .update()
//     .then(res => cb(res))
//     .catch(err => console.dir(err))
// }

// let deleteBook = (ctx, cb) => {
//   let tableId = getApp().globalData.tableId,
//     recordId = ctx.data.curRecordId

//   let Books = new wx.BaaS.TableObject(tableId)

//   Books.delete(recordId)
//     .then(res => cb(res))
//     .catch(err => console.dir(err))
// }

// module.exports = {
//   getBooks,
//   addBook,
//   updateBook,
//   deleteBook,
// }