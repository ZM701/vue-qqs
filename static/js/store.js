const STORAGE_KEY = 'todos-vuejs'
const STORAGE_KEY2 = 'todos-vuejs2'

export default {

  fetch: function() {

    return window.JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]')

  },

  save: function(items) {

    window.localStorage.setItem(STORAGE_KEY, window.JSON.stringify(items))

  },
  fetch2: function() {

    return window.JSON.parse(window.localStorage.getItem(STORAGE_KEY2) || '[]')

  },

  save2: function(items) {

    window.localStorage.setItem(STORAGE_KEY2, window.JSON.stringify(items))

  }

}
