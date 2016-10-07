var Firebase = require('../')
var firebase = new Firebase('https://firepad.firebaseio.com')

setTimeout(function () {
  firebase.close()
}, 100)
