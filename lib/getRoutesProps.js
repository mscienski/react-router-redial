"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = getRoutesProps;

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function getRoutesProps(routes) {
  return routes.reduce(function (previous, route) {
    // eslint-disable-next-line no-unused-vars
    var childRoutes = route.childRoutes,
        indexRoute = route.indexRoute,
        rest = _objectWithoutProperties(route, ["childRoutes", "indexRoute"]);

    return _extends({}, previous, rest);
  }, {});
}