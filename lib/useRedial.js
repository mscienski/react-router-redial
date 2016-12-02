'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = useRedial;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _RedialContext = require('./RedialContext');

var _RedialContext2 = _interopRequireDefault(_RedialContext);

var _RedialContainer = require('./RedialContainer');

var _RedialContainer2 = _interopRequireDefault(_RedialContainer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function useRedial(options) {
  return {
    renderRouterContext: function renderRouterContext(child, props) {
      return _react2.default.createElement(
        _RedialContext2.default,
        _extends({ renderProps: props }, options),
        child
      );
    },
    /* eslint-disable react/prop-types */
    renderRouteComponent: function renderRouteComponent(child, props) {
      return _react2.default.createElement(
        _RedialContainer2.default,
        { routerProps: props },
        child
      );
    }
  };
}