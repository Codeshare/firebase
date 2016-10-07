'use strict'

var kp = require('keypather')()

// hack: override timer globals into firebase-node
var uuid = 0
var activeTimers = {
  _store: {},
  ids: function () {
    return Object.keys(this._store)
  },
  add: function (timer) {
    if (timer) {
      timer.____fbid = uuid++
      this._store[timer.____fbid] = timer
    }
  },
  remove: function (timer) {
    if (timer) {
      delete this._store[timer.____fbid]
    }
  }
}
var firebaseGlobal = global.____firebaseGlobal = {}
firebaseGlobal.setTimeout = function (cb, timeout) {
  var timer = setTimeout(function () {
    cb.call(this)
  }, timeout)
  activeTimers.add(timer)
  return timer
}
firebaseGlobal.clearTimeout = function (timer) {
  activeTimers.remove(timer)
  return clearTimeout(timer)
}

// this require must be below above
var Firebase = require('./firebase-node.js')

Firebase.prototype.close = function () {
  // close websocket
  kp.get(this, 'k.da.La.K.close()')
  // clear known/accessible timers
  firebaseGlobal.clearTimeout(kp.get(this, 'k.da.La.yd'))
  // clear all timers
  activeTimers.ids().forEach(function (id) {
    var timer = activeTimers[id]
    firebaseGlobal.clearTimeout(timer)
  })
}

module.exports = Firebase
