'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _triggerHooks = require('./triggerHooks');

var _triggerHooks2 = _interopRequireDefault(_triggerHooks);

var _createMap = require('./createMap');

var _createMap2 = _interopRequireDefault(_createMap);

var _mapKeys = require('./util/mapKeys');

var _mapKeys2 = _interopRequireDefault(_mapKeys);

var _getAllComponents = require('./getAllComponents');

var _getAllComponents2 = _interopRequireDefault(_getAllComponents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* global __REDIAL_PROPS__ */

function hydrate(renderProps) {
  if (typeof __REDIAL_PROPS__ !== 'undefined' && Array.isArray(__REDIAL_PROPS__)) {
    var getMapKeyForComponent = (0, _mapKeys2.default)(renderProps.routes, renderProps.components);
    var components = (0, _getAllComponents2.default)(renderProps.components);
    var componentKeys = components.map(getMapKeyForComponent);
    return (0, _createMap2.default)(componentKeys, __REDIAL_PROPS__);
  }

  return (0, _createMap2.default)();
}

var RedialContext = function (_Component) {
  _inherits(RedialContext, _Component);

  function RedialContext(props, context) {
    _classCallCheck(this, RedialContext);

    var _this = _possibleConstructorReturn(this, (RedialContext.__proto__ || Object.getPrototypeOf(RedialContext)).call(this, props, context));

    _this.state = {
      loading: false,
      afterTransitionLoading: false,
      aborted: function aborted() {
        return false;
      },
      abort: function abort() {},
      prevRenderProps: undefined,
      redialMap: props.redialMap || hydrate(props.renderProps),
      initial: props.beforeTransition.length > 0
    };
    _this.completed = {
      beforeTransition: false,
      afterTransition: false,
      error: null
    };
    return _this;
  }

  _createClass(RedialContext, [{
    key: 'getChildContext',
    value: function getChildContext() {
      var _this2 = this;

      var _state = this.state,
          loading = _state.loading,
          afterTransitionLoading = _state.afterTransitionLoading,
          redialMap = _state.redialMap;

      return {
        redialContext: {
          loading: loading,
          afterTransitionLoading: afterTransitionLoading,
          redialMap: redialMap,
          reloadComponent: function reloadComponent(component) {
            _this2.reloadComponent(component);
          },
          abortLoading: function abortLoading() {
            _this2.abort();
          }
        }
      };
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.load(this.props.renderProps.components, this.props.renderProps);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.renderProps.location === this.props.renderProps.location) {
        return;
      }

      this.load(nextProps.renderProps.components, nextProps.renderProps);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.unmounted = true;
    }
  }, {
    key: 'reloadComponent',
    value: function reloadComponent(component) {
      this.load(component, this.props.renderProps, true);
    }
  }, {
    key: 'abort',
    value: function abort(becauseError, _abort) {
      // Make sure we only cancel if it is the correct ongoing request
      if (!_abort || this.state.abort === _abort) {
        // We need to be in a loading state for it to make sense
        // to abort something
        if (this.state.loading || this.state.afterTransitionLoading) {
          this.state.abort();

          this.setState({
            loading: false,
            afterTransitionLoading: false
          });

          if (this.props.onAborted) {
            this.props.onAborted(becauseError);
          }
        }
      }
    }
  }, {
    key: 'load',
    value: function load(components, renderProps) {
      var _this3 = this;

      var force = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      var isAborted = false;
      var _abort2 = function _abort2() {
        isAborted = true;
      };
      var aborted = function aborted() {
        return isAborted;
      };

      var bail = function bail() {
        var currentLocation = _this3.props.renderProps.location;
        if (aborted()) {
          return 'aborted';
        } else if (currentLocation !== renderProps.location) {
          return 'location-changed';
        }

        return false;
      };

      if (this.props.onStarted) {
        this.props.onStarted(force);
      }

      this.completed.beforeTransition = false;

      this.setState({
        aborted: aborted,
        abort: _abort2,
        loading: true,
        prevRenderProps: this.state.aborted() ? this.state.prevRenderProps : this.props.renderProps
      });

      if (this.props.parallel) {
        this.runAfterTransition(this.props.afterTransition, components, renderProps, force, bail).then(function () {
          if (_this3.completed.afterTransition) {
            _this3.props.onCompleted('afterTransition');
          }
        }).catch(function (err) {
          // We will only propagate this error if beforeTransition have been completed
          // This because the beforeTransition error is more critical
          var error = function error() {
            return _this3.props.onError(err, {
              reason: bail() || 'other',
              beforeTransition: false,
              router: _this3.props.renderProps.router,
              abort: function abort() {
                return _this3.abort(true, _abort2);
              }
            });
          };

          if (_this3.completed.beforeTransition) {
            error();
          } else {
            _this3.completed.error = error;
          }
        });
      }

      this.runBeforeTransition(this.props.beforeTransition, components, renderProps, force, bail).catch(function (error) {
        _this3.props.onError(error, {
          reason: bail() || 'other',
          // If not defined before it's a beforeTransition error
          beforeTransition: error.afterTransition === undefined,
          router: _this3.props.renderProps.router,
          abort: function abort() {
            return _this3.abort(true, _abort2);
          }
        });
      });
    }
  }, {
    key: 'runAfterTransition',
    value: function runAfterTransition(hooks, components, renderProps) {
      var _this4 = this;

      var force = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      var bail = arguments[4];

      // Get afterTransition data, will not block route transitions
      this.completed.afterTransition = false;
      this.completed.error = null;

      this.setState({
        afterTransitionLoading: true
      });

      return (0, _triggerHooks2.default)({
        hooks: hooks,
        components: components,
        renderProps: renderProps,
        redialMap: this.state.redialMap,
        locals: this.props.locals,
        force: force,
        bail: bail
      }).then(function (_ref) {
        var redialMap = _ref.redialMap;

        _this4.completed.afterTransition = true;
        _this4.setState({
          afterTransitionLoading: false,
          redialMap: redialMap
        });
      });
    }
  }, {
    key: 'runBeforeTransition',
    value: function runBeforeTransition(hooks, components, renderProps) {
      var _this5 = this;

      var force = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      var bail = arguments[4];

      var completeRouteTransition = function completeRouteTransition(redialMap) {
        if (!bail() && !_this5.unmounted) {
          _this5.setState({
            loading: false,
            redialMap: redialMap,
            prevRenderProps: undefined,
            initial: false
          });

          _this5.props.onCompleted('beforeTransition');

          _this5.completed.beforeTransition = true;

          // Start afterTransition if we are not in parallel
          if (!_this5.props.parallel) {
            return _this5.runAfterTransition(_this5.props.afterTransition, components, renderProps, force, bail).then(function () {
              _this5.props.onCompleted('afterTransition');
            }).catch(function (error) {
              error.afterTransition = true; // eslint-disable-line
              return Promise.reject(error);
            });
          } else if (_this5.completed.afterTransition) {
            _this5.completed.afterTransition = false;
            _this5.props.onCompleted('afterTransition');
          } else if (_this5.completed.error) {
            _this5.completed.error();
          }
        }

        return Promise.resolve();
      };

      return (0, _triggerHooks2.default)({
        hooks: hooks,
        components: components,
        renderProps: renderProps,
        redialMap: this.state.redialMap,
        locals: this.props.locals,
        force: force,
        bail: bail
      }).then(function (_ref2) {
        var redialMap = _ref2.redialMap;
        return completeRouteTransition(redialMap);
      });
    }
  }, {
    key: 'render',
    value: function render() {
      if (this.props.initialLoading && this.state.initial && this.state.redialMap.size() === 0) {
        return this.props.initialLoading();
      }

      var props = (this.state.loading || this.state.aborted()) && this.state.prevRenderProps;
      if (props) {
        /* eslint-disable no-unused-vars */
        // Omit `createElement`. Otherwise we might skip `renderRouteContext` in `applyMiddleware`.
        var createElement = props.createElement,
            prevProps = _objectWithoutProperties(props, ['createElement']);
        /* eslint-enable no-unused-vars */


        return _react2.default.cloneElement(this.props.children, prevProps);
      }

      return this.props.children;
    }
  }]);

  return RedialContext;
}(_react.Component);

RedialContext.displayName = 'RedialContext';
RedialContext.propTypes = {
  children: _react.PropTypes.node.isRequired,

  // RouterContext default
  renderProps: _react.PropTypes.object.isRequired,

  // Custom
  locals: _react.PropTypes.object,
  beforeTransition: _react.PropTypes.array,
  afterTransition: _react.PropTypes.array,
  parallel: _react.PropTypes.bool,
  initialLoading: _react.PropTypes.func,
  onError: _react.PropTypes.func,
  onAborted: _react.PropTypes.func,
  onStarted: _react.PropTypes.func,
  onCompleted: _react.PropTypes.func,

  // Server
  redialMap: _react.PropTypes.object
};
RedialContext.defaultProps = {
  beforeTransition: [],
  afterTransition: [],
  parallel: false,

  onError: function onError(err, _ref3) {
    var type = _ref3.type;

    if (process.env.NODE_ENV !== 'production') {
      console.error(type, err);
    }
  },
  onAborted: function onAborted(becauseError) {
    if (process.env.NODE_ENV !== 'production') {
      if (becauseError) {
        console.warn('Loading was aborted from an error');
      } else {
        console.warn('Loading was aborted manually');
      }
    }
  },
  onStarted: function onStarted(force) {
    if (process.env.NODE_ENV !== 'production') {
      console.info('Loading started. Force:', force);
    }
  },
  onCompleted: function onCompleted(type) {
    if (process.env.NODE_ENV !== 'production') {
      console.info('Loading completed. Type:', type);
    }
  }
};
RedialContext.childContextTypes = {
  redialContext: _react.PropTypes.object
};
exports.default = RedialContext;