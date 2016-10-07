'use strict'

var kp = require('keypather')()

// hack: override timer globals into firebase-node
var uuid = 0
var activeTimers = {}
var firebaseGlobal = global.____firebaseGlobal = {}
firebaseGlobal.setTimeout = function (cb, timeout) {
  var timer = setTimeout(function () {
    cb.call(this)
  }, timeout)
  timer.____id = uuid++
  activeTimers[timer.____id] = timer
  return timer
}
firebaseGlobal.clearTimeout = function (timer) {
  delete activeTimers[timer.____id]
  return clearTimeout(timer)
}

// this require must be below above
var Firebase = require('./firebase-node.js')


Firebase.prototype.close = function () {
  kp.get(this, 'k.da.La.K.close()')
  firebaseGlobal.clearTimeout(kp.get(this, 'k.da.La.yd'))
  Object.keys(activeTimers).forEach(function (id) {
    var timer = activeTimers[id]
    firebaseGlobal.clearTimeout(timer)
  })
}

module.exports = Firebase
