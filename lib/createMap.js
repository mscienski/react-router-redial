"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createMap;
function createMap(possibleKeys, allValues) {
  var keys = [];
  var values = [];

  var set = function set(index, value) {
    var i = keys.indexOf(index);
    if (i > -1) {
      values[i] = value;
    } else {
      keys.push(index);
      values.push(value);
    }
  };

  var size = function size() {
    return keys.length;
  };

  var get = function get(index) {
    return values[keys.indexOf(index)];
  };

  var dehydrate = function dehydrate(allPossibleKeys) {
    return allPossibleKeys.map(function (key) {
      return get(key);
    });
  };

  var rehydrate = function rehydrate(allPossibleKeys, state) {
    state.forEach(function (value, index) {
      if (value) {
        set(allPossibleKeys[index], value);
      }
    });
  };

  if (possibleKeys && allValues) {
    rehydrate(possibleKeys, allValues);
  }

  return {
    set: set,
    get: get,
    size: size,
    dehydrate: dehydrate,
    rehydrate: rehydrate
  };
}