import utils from '../../utils/index'
const app = getApp()

Page({
  data: {
    editing: false
  },

  goBack: function () {
    wx.navigateBack({
      delta: 1
    })
  },

  onLoad(options) {
    // get CURRENT USER object
    wx.BaaS.auth.getCurrentUser().then(user => {
      this.setData({
        user: user,
        profile: user.get('phoneNumber') != null
      })
      if (user.get('phoneNumber') != null) {
        this.setData({
          firstName: user.get('firstName'),
          lastName: user.get('lastName'),
          phoneNumber: user.get('phoneNumber'),
          email: user.get('_email')
        })
      }
    }).catch(err => {
        console.log(err)
      if (err.code === 604) {
        console.log('用户未登录')
      }
    })
  },

  setProfile (e) {
    this.setData({
      errorMessage: null
    })

    // receive user input from form
    const firstName = e.detail.value.firstName
    const lastName = e.detail.value.lastName
    const email = e.detail.value.email
    const phoneNumber = e.detail.value.phoneNumber

    let user = this.data.user
    const regex = /^\d{11}$/
    let errorMessage = this.data. errorMessage

    // check phone number > check email address > 
    if (regex.test(phoneNumber)) {
      user.setEmail(email, { sendVerificationEmail: false }).then(user => {
        console.log("Set email successful")

        user.set('firstName', firstName).update().then(res => {
          console.log("Set first name successful")
        }).catch(err => {
          console.log(err)
        })

        user.set('lastName', lastName).update().then(res => {
          console.log("Set last name successful")
        }).catch(err => {
          console.log(err)
        })

        user.set('phoneNumber', phoneNumber).update().then(res => {
          console.log("Set phone number successful")
        }).catch(err => {
          console.log(err)
        })

        wx.reLaunch({
          url: '../profile/profile',
        })

      }).catch(err => {
        console.log("Error: email address invalid")
        this.setData({
          errorMessage: "Profile update failed. Please enter a valid email address."
        })
      })
    } else {
      console.log("Error: phone number invalid")
      this.setData({
        errorMessage: "Profile update failed. Please enter a valid phone number."
      })
    }
  },

  toEdit() {
    this.setData({
      editing: true
    })
  }
})