'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = triggerHooks;

var _redial = require('redial');

var _lodash = require('lodash.isplainobject');

var _lodash2 = _interopRequireDefault(_lodash);

var _createMap = require('./createMap');

var _createMap2 = _interopRequireDefault(_createMap);

var _getRoutesProps = require('./getRoutesProps');

var _getRoutesProps2 = _interopRequireDefault(_getRoutesProps);

var _getLocals = require('./getLocals');

var _getLocals2 = _interopRequireDefault(_getLocals);

var _getAllComponents = require('./getAllComponents');

var _getAllComponents2 = _interopRequireDefault(_getAllComponents);

var _mapKeys = require('./util/mapKeys');

var _mapKeys2 = _interopRequireDefault(_mapKeys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function triggerHooks(_ref) {
  var hooks = _ref.hooks,
      components = _ref.components,
      locals = _ref.locals,
      renderProps = _ref.renderProps,
      _ref$force = _ref.force,
      force = _ref$force === undefined ? false : _ref$force,
      _ref$bail = _ref.bail,
      bail = _ref$bail === undefined ? function () {
    return false;
  } : _ref$bail,
      _ref$redialMap = _ref.redialMap,
      redialMap = _ref$redialMap === undefined ? (0, _createMap2.default)() : _ref$redialMap;

  // Set props for specific component
  var setProps = function setProps(key) {
    return function (props) {
      if (!(0, _lodash2.default)(props)) {
        throw new Error('The input to setProps needs to be an object');
      }
      redialMap.set(key, _extends({}, redialMap.get(key), props));
    };
  };

  // Get components for a specific component
  var getProps = function getProps(key) {
    return function () {
      return redialMap.get(key) || {};
    };
  };

  var getMapKeyForComponent = (0, _mapKeys2.default)(renderProps.routes, renderProps.components);

  var completeLocals = function completeLocals(component) {
    var key = getMapKeyForComponent(component);
    return _extends({
      location: renderProps.location,
      params: renderProps.params,
      routeProps: (0, _getRoutesProps2.default)(renderProps.routes),
      setProps: setProps(key),
      getProps: getProps(key),
      isAborted: bail,
      force: force
    }, (0, _getLocals2.default)(component, locals));
  };

  var hookComponents = (0, _getAllComponents2.default)(components || renderProps.components);

  return hooks.reduce(function (promise, parallelHooks) {
    return promise.then(function () {
      if (bail()) {
        throw new Error('Redial was terminated because: ' + bail());
      }
      return Promise.all([].concat(parallelHooks).map(function (hook) {
        return (0, _redial.trigger)(hook, hookComponents, completeLocals);
      }));
    });
  }, Promise.resolve()).then(function () {
    if (bail()) {
      throw new Error('Redial was terminated because: ' + bail());
    }

    return {
      redialMap: redialMap,
      redialProps: redialMap.dehydrate(hookComponents.map(getMapKeyForComponent))
    };
  });
}