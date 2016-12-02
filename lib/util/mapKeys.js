'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createGenerateMapKeyByMatchedRoutes;

var _findRouteByComponent2 = require('./findRouteByComponent');

var _findRouteByComponent3 = _interopRequireDefault(_findRouteByComponent2);

var _getRoutePath = require('./getRoutePath');

var _getRoutePath2 = _interopRequireDefault(_getRoutePath);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createGenerateMapKeyByMatchedRoutes(routes, components) {
  return function (component) {
    var _findRouteByComponent = (0, _findRouteByComponent3.default)(component, routes, components),
        route = _findRouteByComponent.route,
        name = _findRouteByComponent.name;

    if (!route) {
      throw new Error('`component` not found among the matched `routes`');
    }
    return (0, _getRoutePath2.default)(route, routes, name);
  };
}