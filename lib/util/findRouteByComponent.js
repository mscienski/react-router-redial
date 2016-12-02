'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = findRouteByComponent;

var _lodash = require('lodash.isplainobject');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isNamedComponents = _lodash2.default;

function searchNamedComponents(component, namedComponents, correspondingRoute, result) {
  return Object.keys(namedComponents).some(function (name) {
    var isMatch = namedComponents[name] === component;
    if (isMatch) {
      /* eslint-disable no-param-reassign */
      result.name = name;
      result.route = correspondingRoute;
      /* eslint-enable no-param-reassign */
    }
    return isMatch;
  });
}

function findRouteByComponent(component, matchedRoutes, matchedComponents) {
  var result = {};

  matchedComponents.some(function (matchedComponent, i) {
    if (isNamedComponents(matchedComponent)) {
      return searchNamedComponents(component, matchedComponent, matchedRoutes[i], result);
    }

    var isMatch = component === matchedComponent;
    if (isMatch) {
      result.route = matchedRoutes[i];
    }
    return isMatch;
  });

  return result;
}