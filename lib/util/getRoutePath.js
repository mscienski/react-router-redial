'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getRoutePath;
function getRoutePath(route, routes, name) {
  var matchIndex = routes.indexOf(route);
  if (matchIndex < 0) {
    throw new Error('`route` not found in `routes`');
  }
  var routesUntil = routes.slice(0, matchIndex + 1);
  var routePath = routesUntil.reduce(function (acc, _ref) {
    var path = _ref.path;
    return acc.concat(path);
  }, []).join('/');
  if (name) {
    routePath = routePath + '>' + name;
  }
  return routePath;
}