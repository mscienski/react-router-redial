'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _getRoutePath = require('./util/getRoutePath');

var _getRoutePath2 = _interopRequireDefault(_getRoutePath);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RedialContainer = function (_Component) {
  _inherits(RedialContainer, _Component);

  function RedialContainer() {
    _classCallCheck(this, RedialContainer);

    return _possibleConstructorReturn(this, (RedialContainer.__proto__ || Object.getPrototypeOf(RedialContainer)).apply(this, arguments));
  }

  _createClass(RedialContainer, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          routerProps = _props.routerProps,
          props = _objectWithoutProperties(_props, ['routerProps']);

      var _context$redialContex = this.context.redialContext,
          abortLoading = _context$redialContex.abortLoading,
          loading = _context$redialContex.loading,
          afterTransitionLoading = _context$redialContex.afterTransitionLoading,
          reloadComponent = _context$redialContex.reloadComponent,
          redialMap = _context$redialContex.redialMap;

      var mapKey = (0, _getRoutePath2.default)(routerProps.route, routerProps.routes, routerProps.key);
      var redialProps = redialMap.get(mapKey);
      var reload = function reload() {
        return reloadComponent(routerProps.route.component);
      };
      var abort = function abort() {
        return abortLoading();
      };

      return _react2.default.cloneElement(this.props.children, _extends({}, props, redialProps, routerProps, {
        loading: loading,
        afterTransitionLoading: afterTransitionLoading,
        reload: reload,
        abort: abort
      }));
    }
  }]);

  return RedialContainer;
}(_react.Component);

RedialContainer.displayName = 'RedialContainer';
RedialContainer.propTypes = {
  children: _react.PropTypes.element.isRequired,
  routerProps: _react.PropTypes.object.isRequired
};
RedialContainer.contextTypes = {
  redialContext: _react.PropTypes.object.isRequired
};
exports.default = RedialContainer;