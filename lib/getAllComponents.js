'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = getAllComponents;
function getAllComponents(components) {
  var arr = Array.isArray(components) ? components : [components];
  var result = [];
  arr.forEach(function (component) {
    if ((typeof component === 'undefined' ? 'undefined' : _typeof(component)) === 'object') {
      Object.keys(component).forEach(function (key) {
        return result.push(component[key]);
      });
    } else {
      result.push(component);
    }
  });
  return result;
}