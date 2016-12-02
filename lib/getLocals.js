'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getLocals;
function getLocals(component, locals) {
  return typeof locals === 'function' ? locals(component) : locals;
}