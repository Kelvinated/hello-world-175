// components/custom-nav/custom-nav.js
Component({
  /**
   * Component properties
   */
  properties: {
    title: {
      type: String,
      value: '',
    },
    showProfile: {
      type: Boolean,
      value: false,
    },
    profilePic: {
      type: String,
      value: null,
    },
    tab: {
      type: Boolean,
      value: false
    }
  },

  /**
   * Component initial data
   */
  data: {
    showBackButton: false,
    tab: false
  },
  ready() {
    if (getCurrentPages().length > 1) {
      this.setData({
        showBackButton: true,
      });
    }
  },

  /**
   * Component methods
   */
  methods: {

  }
})
