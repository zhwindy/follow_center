/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Vue, _, director, router, routes, v_messages;

	__webpack_require__(1);

	_ = __webpack_require__(5);

	Vue = __webpack_require__(6);

	v_messages = new Vue({
	  el: '#v_messages',
	  data: {
	    user_info: '',
	    user_infos: {},
	    messages: [],
	    loading: false,
	    new_loading: false,
	    old_loading: false,
	    current_message_id: null,
	    god_name: null,
	    last_message: null,
	    last_message_id: '',
	    unreadCount: 0
	  },
	  created: function() {
	    return this.bindScroll();
	  },
	  methods: {
	    "new": function() {
	      if (this.new_loading) {
	        return;
	      }
	      if (this.god_name) {
	        return this.newGod();
	      } else {
	        return this.newAll();
	      }
	    },
	    old: function() {
	      if (this.old_loading) {
	        return;
	      }
	      if (this.god_name) {
	        return this.oldGod();
	      } else {
	        return this.oldAll();
	      }
	    },
	    main: function() {
	      this.god_name = null;
	      this.user_info = '';
	      return this.newAll();
	    },
	    newAll: function() {
	      this.new_loading = true;
	      return $.ajax({
	        url: '/new',
	        type: 'POST',
	        success: (function(_this) {
	          return function(data, status, response) {
	            if (data.messages.length !== 0) {
	              _this.messages = _.uniq(_.union(_this.messages, data.messages.reverse()), false, function(item, key, a) {
	                return item.row_num;
	              });
	              _this.setTitleUnreadCount(data.messages.length);
	            } else {
	              if (_this.messages.length === 0) {
	                _this.oldAll();
	              }
	            }
	            return _this.new_loading = false;
	          };
	        })(this)
	      });
	    },
	    oldAll: function() {
	      var parm;
	      parm = JSON.stringify({
	        offset: this.messages.length
	      });
	      this.old_loading = true;
	      return $.ajax({
	        url: '/old',
	        type: 'POST',
	        data: parm,
	        success: (function(_this) {
	          return function(data, status, response) {
	            var el;
	            _this.messages = _.uniq(_.union(data.messages.reverse(), _this.messages), false, function(item, key, a) {
	              return item.row_num;
	            });
	            _this.old_loading = false;
	            el = _this.getLastMessageEl();
	            if (el !== null) {
	              return _.delay(_this.scrollTo, 500, el, -50);
	            }
	          };
	        })(this)
	      });
	    },
	    mainGod: function(god_name) {
	      this.god_name = god_name;
	      this.messages = [];
	      return this.newGod();
	    },
	    newGod: function() {
	      var parm;
	      this.new_loading = true;
	      parm = JSON.stringify({
	        god_name: this.god_name
	      });
	      $.ajax({
	        url: '/god',
	        type: 'POST',
	        data: parm,
	        success: (function(_this) {
	          return function(data, status, response) {
	            _this.messages = _.uniq(_.union(_this.messages, data.messages.reverse()), false, function(item, key, a) {
	              return item.row_num;
	            });
	            _this.setTitleUnreadCount(data.messages.length);
	            return _this.new_loading = false;
	          };
	        })(this)
	      });
	      return this.getUserInfo(this.god_name);
	    },
	    oldGod: function() {
	      var parm;
	      parm = JSON.stringify({
	        offset: this.messages.length + 1,
	        god_name: this.god_name
	      });
	      this.old_loading = true;
	      return $.ajax({
	        url: '/god',
	        type: 'POST',
	        data: parm,
	        success: (function(_this) {
	          return function(data, status, response) {
	            var el;
	            _this.messages = _.uniq(_.union(data.messages.reverse(), _this.messages), false, function(item, key, a) {
	              return item.row_num;
	            });
	            _this.old_loading = false;
	            el = _this.getLastMessageEl();
	            if (el !== null) {
	              return _.delay(_this.scrollTo, 500, el, -50);
	            }
	          };
	        })(this)
	      });
	    },
	    getLastMessageEl: function() {
	      var el;
	      if (this.$.c_messages.length !== 0) {
	        el = this.$.c_messages[0].$el;
	      } else {
	        el = null;
	      }
	      return el;
	    },
	    setTitleUnreadCount: function(count) {
	      this.unreadCount = count;
	      if (count === 0) {
	        return document.title = "Follow Center";
	      } else {
	        return document.title = "(" + count + ") Follow Center";
	      }
	    },
	    getUnreadCount: function(message) {
	      var index;
	      index = _.findIndex(this.messages, (function(_this) {
	        return function(d) {
	          return d.row_num === message.row_num;
	        };
	      })(this));
	      return this.messages.length - index - 1;
	    },
	    saveLast: function(last_message) {
	      var parm;
	      this.last_message_id = last_message.m_type + '_' + last_message.id;
	      parm = JSON.stringify({
	        last_time: last_message.created_at,
	        last_message_id: last_message.m_type + '_' + last_message.id
	      });
	      return $.ajax({
	        url: '/save_last',
	        type: 'POST',
	        data: parm,
	        success: (function(_this) {
	          return function(data, status, response) {
	            var count;
	            _this.last_message = last_message;
	            if (data.count === 1) {
	              count = _this.getUnreadCount(last_message);
	              return _this.setTitleUnreadCount(count);
	            }
	          };
	        })(this)
	      });
	    },
	    scrollTo: function(target, offset) {
	      var y;
	      if (offset == null) {
	        offset = 0;
	      }
	      y = $(target).offset().top;
	      y = y + offset;
	      return window.scrollTo(0, y);
	    },
	    getUserInfo: function(user_name) {
	      var parm;
	      if (this.user_infos[user_name]) {
	        this.user_info = this.user_infos[user_name];
	        return;
	      }
	      parm = JSON.stringify({
	        user_name: user_name
	      });
	      return $.ajax({
	        url: '/user_info',
	        type: 'POST',
	        data: parm,
	        success: (function(_this) {
	          return function(data, status, response) {
	            _this.user_info = data.user_info;
	            _this.user_infos[user_name] = data.user_info;
	            return _this.loading = false;
	          };
	        })(this)
	      });
	    },
	    bindScroll: function() {
	      var v;
	      v = this;
	      return $(window).scroll(function() {
	        var $top;
	        $top = $('#v_messages').offset().top;
	        if ($(this).scrollTop() === 0) {
	          null;
	        } else if (($('#v_messages .col-md-8').height() + $top - $(this).scrollTop() - $(this).height()) <= 0) {
	          if (v.new_loading === false) {
	            v["new"]();
	          }
	        }
	        return $('#v_messages .col-md-8 .box').each(function() {
	          var message, message_position, scroll_bottom;
	          message_position = $(this).offset().top + $(this).height();
	          scroll_bottom = $(window).scrollTop() + $(window).height();
	          message_position = parseInt(message_position / 10);
	          scroll_bottom = parseInt(scroll_bottom / 10);
	          if (message_position === scroll_bottom) {
	            if (v.god_name !== null) {
	              return false;
	            }
	            message = $(this)[0].__vue__.message;
	            if (v.last_message === null || v.last_message.created_at < message.created_at) {
	              log($(this).attr('id'));
	              v.saveLast(message);
	            }
	            return false;
	          }
	        });
	      });
	    }
	  },
	  components: {
	    'follow': __webpack_require__(74),
	    'simditor': __webpack_require__(79),
	    'twitter': __webpack_require__(90),
	    'github': __webpack_require__(95),
	    'instagram': __webpack_require__(99),
	    'user_info': __webpack_require__(103),
	    'god_list': __webpack_require__(107),
	    'add_god': __webpack_require__(115)
	  },
	  directives: {
	    'btn-loading': __webpack_require__(119)
	  }
	});

	routes = {
	  '/god/:god_name': v_messages.mainGod,
	  '/': v_messages.main
	};

	director = __webpack_require__(122);

	router = director.Router(routes);

	router.init('/');


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(2);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./node_modules/css-loader/index.js!./node_modules/less-loader/index.js!./main.less", function() {
				var newContent = require("!!./node_modules/css-loader/index.js!./node_modules/less-loader/index.js!./main.less");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, "body {\n  background-color: #F9F9F9!important;\n}\n.box.box-solid > .box-header .a-icon:hover {\n  background: rgba(0, 0, 0, 0) !important;\n}\n", ""]);

	// exports


/***/ },
/* 3 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0;

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function createStyleElement() {
		var styleElement = document.createElement("style");
		var head = getHeadElement();
		styleElement.type = "text/css";
		head.appendChild(styleElement);
		return styleElement;
	}

	function createLinkElement() {
		var linkElement = document.createElement("link");
		var head = getHeadElement();
		linkElement.rel = "stylesheet";
		head.appendChild(linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement());
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement();
			update = updateLink.bind(null, styleElement);
			remove = function() {
				styleElement.parentNode.removeChild(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement();
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				styleElement.parentNode.removeChild(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;//     Underscore.js 1.8.3
	//     http://underscorejs.org
	//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	//     Underscore may be freely distributed under the MIT license.

	(function() {

	  // Baseline setup
	  // --------------

	  // Establish the root object, `window` in the browser, or `exports` on the server.
	  var root = this;

	  // Save the previous value of the `_` variable.
	  var previousUnderscore = root._;

	  // Save bytes in the minified (but not gzipped) version:
	  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

	  // Create quick reference variables for speed access to core prototypes.
	  var
	    push             = ArrayProto.push,
	    slice            = ArrayProto.slice,
	    toString         = ObjProto.toString,
	    hasOwnProperty   = ObjProto.hasOwnProperty;

	  // All **ECMAScript 5** native function implementations that we hope to use
	  // are declared here.
	  var
	    nativeIsArray      = Array.isArray,
	    nativeKeys         = Object.keys,
	    nativeBind         = FuncProto.bind,
	    nativeCreate       = Object.create;

	  // Naked function reference for surrogate-prototype-swapping.
	  var Ctor = function(){};

	  // Create a safe reference to the Underscore object for use below.
	  var _ = function(obj) {
	    if (obj instanceof _) return obj;
	    if (!(this instanceof _)) return new _(obj);
	    this._wrapped = obj;
	  };

	  // Export the Underscore object for **Node.js**, with
	  // backwards-compatibility for the old `require()` API. If we're in
	  // the browser, add `_` as a global object.
	  if (true) {
	    if (typeof module !== 'undefined' && module.exports) {
	      exports = module.exports = _;
	    }
	    exports._ = _;
	  } else {
	    root._ = _;
	  }

	  // Current version.
	  _.VERSION = '1.8.3';

	  // Internal function that returns an efficient (for current engines) version
	  // of the passed-in callback, to be repeatedly applied in other Underscore
	  // functions.
	  var optimizeCb = function(func, context, argCount) {
	    if (context === void 0) return func;
	    switch (argCount == null ? 3 : argCount) {
	      case 1: return function(value) {
	        return func.call(context, value);
	      };
	      case 2: return function(value, other) {
	        return func.call(context, value, other);
	      };
	      case 3: return function(value, index, collection) {
	        return func.call(context, value, index, collection);
	      };
	      case 4: return function(accumulator, value, index, collection) {
	        return func.call(context, accumulator, value, index, collection);
	      };
	    }
	    return function() {
	      return func.apply(context, arguments);
	    };
	  };

	  // A mostly-internal function to generate callbacks that can be applied
	  // to each element in a collection, returning the desired result — either
	  // identity, an arbitrary callback, a property matcher, or a property accessor.
	  var cb = function(value, context, argCount) {
	    if (value == null) return _.identity;
	    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
	    if (_.isObject(value)) return _.matcher(value);
	    return _.property(value);
	  };
	  _.iteratee = function(value, context) {
	    return cb(value, context, Infinity);
	  };

	  // An internal function for creating assigner functions.
	  var createAssigner = function(keysFunc, undefinedOnly) {
	    return function(obj) {
	      var length = arguments.length;
	      if (length < 2 || obj == null) return obj;
	      for (var index = 1; index < length; index++) {
	        var source = arguments[index],
	            keys = keysFunc(source),
	            l = keys.length;
	        for (var i = 0; i < l; i++) {
	          var key = keys[i];
	          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
	        }
	      }
	      return obj;
	    };
	  };

	  // An internal function for creating a new object that inherits from another.
	  var baseCreate = function(prototype) {
	    if (!_.isObject(prototype)) return {};
	    if (nativeCreate) return nativeCreate(prototype);
	    Ctor.prototype = prototype;
	    var result = new Ctor;
	    Ctor.prototype = null;
	    return result;
	  };

	  var property = function(key) {
	    return function(obj) {
	      return obj == null ? void 0 : obj[key];
	    };
	  };

	  // Helper for collection methods to determine whether a collection
	  // should be iterated as an array or as an object
	  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
	  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
	  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
	  var getLength = property('length');
	  var isArrayLike = function(collection) {
	    var length = getLength(collection);
	    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
	  };

	  // Collection Functions
	  // --------------------

	  // The cornerstone, an `each` implementation, aka `forEach`.
	  // Handles raw objects in addition to array-likes. Treats all
	  // sparse array-likes as if they were dense.
	  _.each = _.forEach = function(obj, iteratee, context) {
	    iteratee = optimizeCb(iteratee, context);
	    var i, length;
	    if (isArrayLike(obj)) {
	      for (i = 0, length = obj.length; i < length; i++) {
	        iteratee(obj[i], i, obj);
	      }
	    } else {
	      var keys = _.keys(obj);
	      for (i = 0, length = keys.length; i < length; i++) {
	        iteratee(obj[keys[i]], keys[i], obj);
	      }
	    }
	    return obj;
	  };

	  // Return the results of applying the iteratee to each element.
	  _.map = _.collect = function(obj, iteratee, context) {
	    iteratee = cb(iteratee, context);
	    var keys = !isArrayLike(obj) && _.keys(obj),
	        length = (keys || obj).length,
	        results = Array(length);
	    for (var index = 0; index < length; index++) {
	      var currentKey = keys ? keys[index] : index;
	      results[index] = iteratee(obj[currentKey], currentKey, obj);
	    }
	    return results;
	  };

	  // Create a reducing function iterating left or right.
	  function createReduce(dir) {
	    // Optimized iterator function as using arguments.length
	    // in the main function will deoptimize the, see #1991.
	    function iterator(obj, iteratee, memo, keys, index, length) {
	      for (; index >= 0 && index < length; index += dir) {
	        var currentKey = keys ? keys[index] : index;
	        memo = iteratee(memo, obj[currentKey], currentKey, obj);
	      }
	      return memo;
	    }

	    return function(obj, iteratee, memo, context) {
	      iteratee = optimizeCb(iteratee, context, 4);
	      var keys = !isArrayLike(obj) && _.keys(obj),
	          length = (keys || obj).length,
	          index = dir > 0 ? 0 : length - 1;
	      // Determine the initial value if none is provided.
	      if (arguments.length < 3) {
	        memo = obj[keys ? keys[index] : index];
	        index += dir;
	      }
	      return iterator(obj, iteratee, memo, keys, index, length);
	    };
	  }

	  // **Reduce** builds up a single result from a list of values, aka `inject`,
	  // or `foldl`.
	  _.reduce = _.foldl = _.inject = createReduce(1);

	  // The right-associative version of reduce, also known as `foldr`.
	  _.reduceRight = _.foldr = createReduce(-1);

	  // Return the first value which passes a truth test. Aliased as `detect`.
	  _.find = _.detect = function(obj, predicate, context) {
	    var key;
	    if (isArrayLike(obj)) {
	      key = _.findIndex(obj, predicate, context);
	    } else {
	      key = _.findKey(obj, predicate, context);
	    }
	    if (key !== void 0 && key !== -1) return obj[key];
	  };

	  // Return all the elements that pass a truth test.
	  // Aliased as `select`.
	  _.filter = _.select = function(obj, predicate, context) {
	    var results = [];
	    predicate = cb(predicate, context);
	    _.each(obj, function(value, index, list) {
	      if (predicate(value, index, list)) results.push(value);
	    });
	    return results;
	  };

	  // Return all the elements for which a truth test fails.
	  _.reject = function(obj, predicate, context) {
	    return _.filter(obj, _.negate(cb(predicate)), context);
	  };

	  // Determine whether all of the elements match a truth test.
	  // Aliased as `all`.
	  _.every = _.all = function(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var keys = !isArrayLike(obj) && _.keys(obj),
	        length = (keys || obj).length;
	    for (var index = 0; index < length; index++) {
	      var currentKey = keys ? keys[index] : index;
	      if (!predicate(obj[currentKey], currentKey, obj)) return false;
	    }
	    return true;
	  };

	  // Determine if at least one element in the object matches a truth test.
	  // Aliased as `any`.
	  _.some = _.any = function(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var keys = !isArrayLike(obj) && _.keys(obj),
	        length = (keys || obj).length;
	    for (var index = 0; index < length; index++) {
	      var currentKey = keys ? keys[index] : index;
	      if (predicate(obj[currentKey], currentKey, obj)) return true;
	    }
	    return false;
	  };

	  // Determine if the array or object contains a given item (using `===`).
	  // Aliased as `includes` and `include`.
	  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
	    if (!isArrayLike(obj)) obj = _.values(obj);
	    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
	    return _.indexOf(obj, item, fromIndex) >= 0;
	  };

	  // Invoke a method (with arguments) on every item in a collection.
	  _.invoke = function(obj, method) {
	    var args = slice.call(arguments, 2);
	    var isFunc = _.isFunction(method);
	    return _.map(obj, function(value) {
	      var func = isFunc ? method : value[method];
	      return func == null ? func : func.apply(value, args);
	    });
	  };

	  // Convenience version of a common use case of `map`: fetching a property.
	  _.pluck = function(obj, key) {
	    return _.map(obj, _.property(key));
	  };

	  // Convenience version of a common use case of `filter`: selecting only objects
	  // containing specific `key:value` pairs.
	  _.where = function(obj, attrs) {
	    return _.filter(obj, _.matcher(attrs));
	  };

	  // Convenience version of a common use case of `find`: getting the first object
	  // containing specific `key:value` pairs.
	  _.findWhere = function(obj, attrs) {
	    return _.find(obj, _.matcher(attrs));
	  };

	  // Return the maximum element (or element-based computation).
	  _.max = function(obj, iteratee, context) {
	    var result = -Infinity, lastComputed = -Infinity,
	        value, computed;
	    if (iteratee == null && obj != null) {
	      obj = isArrayLike(obj) ? obj : _.values(obj);
	      for (var i = 0, length = obj.length; i < length; i++) {
	        value = obj[i];
	        if (value > result) {
	          result = value;
	        }
	      }
	    } else {
	      iteratee = cb(iteratee, context);
	      _.each(obj, function(value, index, list) {
	        computed = iteratee(value, index, list);
	        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
	          result = value;
	          lastComputed = computed;
	        }
	      });
	    }
	    return result;
	  };

	  // Return the minimum element (or element-based computation).
	  _.min = function(obj, iteratee, context) {
	    var result = Infinity, lastComputed = Infinity,
	        value, computed;
	    if (iteratee == null && obj != null) {
	      obj = isArrayLike(obj) ? obj : _.values(obj);
	      for (var i = 0, length = obj.length; i < length; i++) {
	        value = obj[i];
	        if (value < result) {
	          result = value;
	        }
	      }
	    } else {
	      iteratee = cb(iteratee, context);
	      _.each(obj, function(value, index, list) {
	        computed = iteratee(value, index, list);
	        if (computed < lastComputed || computed === Infinity && result === Infinity) {
	          result = value;
	          lastComputed = computed;
	        }
	      });
	    }
	    return result;
	  };

	  // Shuffle a collection, using the modern version of the
	  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
	  _.shuffle = function(obj) {
	    var set = isArrayLike(obj) ? obj : _.values(obj);
	    var length = set.length;
	    var shuffled = Array(length);
	    for (var index = 0, rand; index < length; index++) {
	      rand = _.random(0, index);
	      if (rand !== index) shuffled[index] = shuffled[rand];
	      shuffled[rand] = set[index];
	    }
	    return shuffled;
	  };

	  // Sample **n** random values from a collection.
	  // If **n** is not specified, returns a single random element.
	  // The internal `guard` argument allows it to work with `map`.
	  _.sample = function(obj, n, guard) {
	    if (n == null || guard) {
	      if (!isArrayLike(obj)) obj = _.values(obj);
	      return obj[_.random(obj.length - 1)];
	    }
	    return _.shuffle(obj).slice(0, Math.max(0, n));
	  };

	  // Sort the object's values by a criterion produced by an iteratee.
	  _.sortBy = function(obj, iteratee, context) {
	    iteratee = cb(iteratee, context);
	    return _.pluck(_.map(obj, function(value, index, list) {
	      return {
	        value: value,
	        index: index,
	        criteria: iteratee(value, index, list)
	      };
	    }).sort(function(left, right) {
	      var a = left.criteria;
	      var b = right.criteria;
	      if (a !== b) {
	        if (a > b || a === void 0) return 1;
	        if (a < b || b === void 0) return -1;
	      }
	      return left.index - right.index;
	    }), 'value');
	  };

	  // An internal function used for aggregate "group by" operations.
	  var group = function(behavior) {
	    return function(obj, iteratee, context) {
	      var result = {};
	      iteratee = cb(iteratee, context);
	      _.each(obj, function(value, index) {
	        var key = iteratee(value, index, obj);
	        behavior(result, value, key);
	      });
	      return result;
	    };
	  };

	  // Groups the object's values by a criterion. Pass either a string attribute
	  // to group by, or a function that returns the criterion.
	  _.groupBy = group(function(result, value, key) {
	    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
	  });

	  // Indexes the object's values by a criterion, similar to `groupBy`, but for
	  // when you know that your index values will be unique.
	  _.indexBy = group(function(result, value, key) {
	    result[key] = value;
	  });

	  // Counts instances of an object that group by a certain criterion. Pass
	  // either a string attribute to count by, or a function that returns the
	  // criterion.
	  _.countBy = group(function(result, value, key) {
	    if (_.has(result, key)) result[key]++; else result[key] = 1;
	  });

	  // Safely create a real, live array from anything iterable.
	  _.toArray = function(obj) {
	    if (!obj) return [];
	    if (_.isArray(obj)) return slice.call(obj);
	    if (isArrayLike(obj)) return _.map(obj, _.identity);
	    return _.values(obj);
	  };

	  // Return the number of elements in an object.
	  _.size = function(obj) {
	    if (obj == null) return 0;
	    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
	  };

	  // Split a collection into two arrays: one whose elements all satisfy the given
	  // predicate, and one whose elements all do not satisfy the predicate.
	  _.partition = function(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var pass = [], fail = [];
	    _.each(obj, function(value, key, obj) {
	      (predicate(value, key, obj) ? pass : fail).push(value);
	    });
	    return [pass, fail];
	  };

	  // Array Functions
	  // ---------------

	  // Get the first element of an array. Passing **n** will return the first N
	  // values in the array. Aliased as `head` and `take`. The **guard** check
	  // allows it to work with `_.map`.
	  _.first = _.head = _.take = function(array, n, guard) {
	    if (array == null) return void 0;
	    if (n == null || guard) return array[0];
	    return _.initial(array, array.length - n);
	  };

	  // Returns everything but the last entry of the array. Especially useful on
	  // the arguments object. Passing **n** will return all the values in
	  // the array, excluding the last N.
	  _.initial = function(array, n, guard) {
	    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
	  };

	  // Get the last element of an array. Passing **n** will return the last N
	  // values in the array.
	  _.last = function(array, n, guard) {
	    if (array == null) return void 0;
	    if (n == null || guard) return array[array.length - 1];
	    return _.rest(array, Math.max(0, array.length - n));
	  };

	  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
	  // Especially useful on the arguments object. Passing an **n** will return
	  // the rest N values in the array.
	  _.rest = _.tail = _.drop = function(array, n, guard) {
	    return slice.call(array, n == null || guard ? 1 : n);
	  };

	  // Trim out all falsy values from an array.
	  _.compact = function(array) {
	    return _.filter(array, _.identity);
	  };

	  // Internal implementation of a recursive `flatten` function.
	  var flatten = function(input, shallow, strict, startIndex) {
	    var output = [], idx = 0;
	    for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
	      var value = input[i];
	      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
	        //flatten current level of array or arguments object
	        if (!shallow) value = flatten(value, shallow, strict);
	        var j = 0, len = value.length;
	        output.length += len;
	        while (j < len) {
	          output[idx++] = value[j++];
	        }
	      } else if (!strict) {
	        output[idx++] = value;
	      }
	    }
	    return output;
	  };

	  // Flatten out an array, either recursively (by default), or just one level.
	  _.flatten = function(array, shallow) {
	    return flatten(array, shallow, false);
	  };

	  // Return a version of the array that does not contain the specified value(s).
	  _.without = function(array) {
	    return _.difference(array, slice.call(arguments, 1));
	  };

	  // Produce a duplicate-free version of the array. If the array has already
	  // been sorted, you have the option of using a faster algorithm.
	  // Aliased as `unique`.
	  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
	    if (!_.isBoolean(isSorted)) {
	      context = iteratee;
	      iteratee = isSorted;
	      isSorted = false;
	    }
	    if (iteratee != null) iteratee = cb(iteratee, context);
	    var result = [];
	    var seen = [];
	    for (var i = 0, length = getLength(array); i < length; i++) {
	      var value = array[i],
	          computed = iteratee ? iteratee(value, i, array) : value;
	      if (isSorted) {
	        if (!i || seen !== computed) result.push(value);
	        seen = computed;
	      } else if (iteratee) {
	        if (!_.contains(seen, computed)) {
	          seen.push(computed);
	          result.push(value);
	        }
	      } else if (!_.contains(result, value)) {
	        result.push(value);
	      }
	    }
	    return result;
	  };

	  // Produce an array that contains the union: each distinct element from all of
	  // the passed-in arrays.
	  _.union = function() {
	    return _.uniq(flatten(arguments, true, true));
	  };

	  // Produce an array that contains every item shared between all the
	  // passed-in arrays.
	  _.intersection = function(array) {
	    var result = [];
	    var argsLength = arguments.length;
	    for (var i = 0, length = getLength(array); i < length; i++) {
	      var item = array[i];
	      if (_.contains(result, item)) continue;
	      for (var j = 1; j < argsLength; j++) {
	        if (!_.contains(arguments[j], item)) break;
	      }
	      if (j === argsLength) result.push(item);
	    }
	    return result;
	  };

	  // Take the difference between one array and a number of other arrays.
	  // Only the elements present in just the first array will remain.
	  _.difference = function(array) {
	    var rest = flatten(arguments, true, true, 1);
	    return _.filter(array, function(value){
	      return !_.contains(rest, value);
	    });
	  };

	  // Zip together multiple lists into a single array -- elements that share
	  // an index go together.
	  _.zip = function() {
	    return _.unzip(arguments);
	  };

	  // Complement of _.zip. Unzip accepts an array of arrays and groups
	  // each array's elements on shared indices
	  _.unzip = function(array) {
	    var length = array && _.max(array, getLength).length || 0;
	    var result = Array(length);

	    for (var index = 0; index < length; index++) {
	      result[index] = _.pluck(array, index);
	    }
	    return result;
	  };

	  // Converts lists into objects. Pass either a single array of `[key, value]`
	  // pairs, or two parallel arrays of the same length -- one of keys, and one of
	  // the corresponding values.
	  _.object = function(list, values) {
	    var result = {};
	    for (var i = 0, length = getLength(list); i < length; i++) {
	      if (values) {
	        result[list[i]] = values[i];
	      } else {
	        result[list[i][0]] = list[i][1];
	      }
	    }
	    return result;
	  };

	  // Generator function to create the findIndex and findLastIndex functions
	  function createPredicateIndexFinder(dir) {
	    return function(array, predicate, context) {
	      predicate = cb(predicate, context);
	      var length = getLength(array);
	      var index = dir > 0 ? 0 : length - 1;
	      for (; index >= 0 && index < length; index += dir) {
	        if (predicate(array[index], index, array)) return index;
	      }
	      return -1;
	    };
	  }

	  // Returns the first index on an array-like that passes a predicate test
	  _.findIndex = createPredicateIndexFinder(1);
	  _.findLastIndex = createPredicateIndexFinder(-1);

	  // Use a comparator function to figure out the smallest index at which
	  // an object should be inserted so as to maintain order. Uses binary search.
	  _.sortedIndex = function(array, obj, iteratee, context) {
	    iteratee = cb(iteratee, context, 1);
	    var value = iteratee(obj);
	    var low = 0, high = getLength(array);
	    while (low < high) {
	      var mid = Math.floor((low + high) / 2);
	      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
	    }
	    return low;
	  };

	  // Generator function to create the indexOf and lastIndexOf functions
	  function createIndexFinder(dir, predicateFind, sortedIndex) {
	    return function(array, item, idx) {
	      var i = 0, length = getLength(array);
	      if (typeof idx == 'number') {
	        if (dir > 0) {
	            i = idx >= 0 ? idx : Math.max(idx + length, i);
	        } else {
	            length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
	        }
	      } else if (sortedIndex && idx && length) {
	        idx = sortedIndex(array, item);
	        return array[idx] === item ? idx : -1;
	      }
	      if (item !== item) {
	        idx = predicateFind(slice.call(array, i, length), _.isNaN);
	        return idx >= 0 ? idx + i : -1;
	      }
	      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
	        if (array[idx] === item) return idx;
	      }
	      return -1;
	    };
	  }

	  // Return the position of the first occurrence of an item in an array,
	  // or -1 if the item is not included in the array.
	  // If the array is large and already in sort order, pass `true`
	  // for **isSorted** to use binary search.
	  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
	  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

	  // Generate an integer Array containing an arithmetic progression. A port of
	  // the native Python `range()` function. See
	  // [the Python documentation](http://docs.python.org/library/functions.html#range).
	  _.range = function(start, stop, step) {
	    if (stop == null) {
	      stop = start || 0;
	      start = 0;
	    }
	    step = step || 1;

	    var length = Math.max(Math.ceil((stop - start) / step), 0);
	    var range = Array(length);

	    for (var idx = 0; idx < length; idx++, start += step) {
	      range[idx] = start;
	    }

	    return range;
	  };

	  // Function (ahem) Functions
	  // ------------------

	  // Determines whether to execute a function as a constructor
	  // or a normal function with the provided arguments
	  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
	    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
	    var self = baseCreate(sourceFunc.prototype);
	    var result = sourceFunc.apply(self, args);
	    if (_.isObject(result)) return result;
	    return self;
	  };

	  // Create a function bound to a given object (assigning `this`, and arguments,
	  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
	  // available.
	  _.bind = function(func, context) {
	    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
	    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
	    var args = slice.call(arguments, 2);
	    var bound = function() {
	      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
	    };
	    return bound;
	  };

	  // Partially apply a function by creating a version that has had some of its
	  // arguments pre-filled, without changing its dynamic `this` context. _ acts
	  // as a placeholder, allowing any combination of arguments to be pre-filled.
	  _.partial = function(func) {
	    var boundArgs = slice.call(arguments, 1);
	    var bound = function() {
	      var position = 0, length = boundArgs.length;
	      var args = Array(length);
	      for (var i = 0; i < length; i++) {
	        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
	      }
	      while (position < arguments.length) args.push(arguments[position++]);
	      return executeBound(func, bound, this, this, args);
	    };
	    return bound;
	  };

	  // Bind a number of an object's methods to that object. Remaining arguments
	  // are the method names to be bound. Useful for ensuring that all callbacks
	  // defined on an object belong to it.
	  _.bindAll = function(obj) {
	    var i, length = arguments.length, key;
	    if (length <= 1) throw new Error('bindAll must be passed function names');
	    for (i = 1; i < length; i++) {
	      key = arguments[i];
	      obj[key] = _.bind(obj[key], obj);
	    }
	    return obj;
	  };

	  // Memoize an expensive function by storing its results.
	  _.memoize = function(func, hasher) {
	    var memoize = function(key) {
	      var cache = memoize.cache;
	      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
	      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
	      return cache[address];
	    };
	    memoize.cache = {};
	    return memoize;
	  };

	  // Delays a function for the given number of milliseconds, and then calls
	  // it with the arguments supplied.
	  _.delay = function(func, wait) {
	    var args = slice.call(arguments, 2);
	    return setTimeout(function(){
	      return func.apply(null, args);
	    }, wait);
	  };

	  // Defers a function, scheduling it to run after the current call stack has
	  // cleared.
	  _.defer = _.partial(_.delay, _, 1);

	  // Returns a function, that, when invoked, will only be triggered at most once
	  // during a given window of time. Normally, the throttled function will run
	  // as much as it can, without ever going more than once per `wait` duration;
	  // but if you'd like to disable the execution on the leading edge, pass
	  // `{leading: false}`. To disable execution on the trailing edge, ditto.
	  _.throttle = function(func, wait, options) {
	    var context, args, result;
	    var timeout = null;
	    var previous = 0;
	    if (!options) options = {};
	    var later = function() {
	      previous = options.leading === false ? 0 : _.now();
	      timeout = null;
	      result = func.apply(context, args);
	      if (!timeout) context = args = null;
	    };
	    return function() {
	      var now = _.now();
	      if (!previous && options.leading === false) previous = now;
	      var remaining = wait - (now - previous);
	      context = this;
	      args = arguments;
	      if (remaining <= 0 || remaining > wait) {
	        if (timeout) {
	          clearTimeout(timeout);
	          timeout = null;
	        }
	        previous = now;
	        result = func.apply(context, args);
	        if (!timeout) context = args = null;
	      } else if (!timeout && options.trailing !== false) {
	        timeout = setTimeout(later, remaining);
	      }
	      return result;
	    };
	  };

	  // Returns a function, that, as long as it continues to be invoked, will not
	  // be triggered. The function will be called after it stops being called for
	  // N milliseconds. If `immediate` is passed, trigger the function on the
	  // leading edge, instead of the trailing.
	  _.debounce = function(func, wait, immediate) {
	    var timeout, args, context, timestamp, result;

	    var later = function() {
	      var last = _.now() - timestamp;

	      if (last < wait && last >= 0) {
	        timeout = setTimeout(later, wait - last);
	      } else {
	        timeout = null;
	        if (!immediate) {
	          result = func.apply(context, args);
	          if (!timeout) context = args = null;
	        }
	      }
	    };

	    return function() {
	      context = this;
	      args = arguments;
	      timestamp = _.now();
	      var callNow = immediate && !timeout;
	      if (!timeout) timeout = setTimeout(later, wait);
	      if (callNow) {
	        result = func.apply(context, args);
	        context = args = null;
	      }

	      return result;
	    };
	  };

	  // Returns the first function passed as an argument to the second,
	  // allowing you to adjust arguments, run code before and after, and
	  // conditionally execute the original function.
	  _.wrap = function(func, wrapper) {
	    return _.partial(wrapper, func);
	  };

	  // Returns a negated version of the passed-in predicate.
	  _.negate = function(predicate) {
	    return function() {
	      return !predicate.apply(this, arguments);
	    };
	  };

	  // Returns a function that is the composition of a list of functions, each
	  // consuming the return value of the function that follows.
	  _.compose = function() {
	    var args = arguments;
	    var start = args.length - 1;
	    return function() {
	      var i = start;
	      var result = args[start].apply(this, arguments);
	      while (i--) result = args[i].call(this, result);
	      return result;
	    };
	  };

	  // Returns a function that will only be executed on and after the Nth call.
	  _.after = function(times, func) {
	    return function() {
	      if (--times < 1) {
	        return func.apply(this, arguments);
	      }
	    };
	  };

	  // Returns a function that will only be executed up to (but not including) the Nth call.
	  _.before = function(times, func) {
	    var memo;
	    return function() {
	      if (--times > 0) {
	        memo = func.apply(this, arguments);
	      }
	      if (times <= 1) func = null;
	      return memo;
	    };
	  };

	  // Returns a function that will be executed at most one time, no matter how
	  // often you call it. Useful for lazy initialization.
	  _.once = _.partial(_.before, 2);

	  // Object Functions
	  // ----------------

	  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
	  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
	  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
	                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

	  function collectNonEnumProps(obj, keys) {
	    var nonEnumIdx = nonEnumerableProps.length;
	    var constructor = obj.constructor;
	    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

	    // Constructor is a special case.
	    var prop = 'constructor';
	    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

	    while (nonEnumIdx--) {
	      prop = nonEnumerableProps[nonEnumIdx];
	      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
	        keys.push(prop);
	      }
	    }
	  }

	  // Retrieve the names of an object's own properties.
	  // Delegates to **ECMAScript 5**'s native `Object.keys`
	  _.keys = function(obj) {
	    if (!_.isObject(obj)) return [];
	    if (nativeKeys) return nativeKeys(obj);
	    var keys = [];
	    for (var key in obj) if (_.has(obj, key)) keys.push(key);
	    // Ahem, IE < 9.
	    if (hasEnumBug) collectNonEnumProps(obj, keys);
	    return keys;
	  };

	  // Retrieve all the property names of an object.
	  _.allKeys = function(obj) {
	    if (!_.isObject(obj)) return [];
	    var keys = [];
	    for (var key in obj) keys.push(key);
	    // Ahem, IE < 9.
	    if (hasEnumBug) collectNonEnumProps(obj, keys);
	    return keys;
	  };

	  // Retrieve the values of an object's properties.
	  _.values = function(obj) {
	    var keys = _.keys(obj);
	    var length = keys.length;
	    var values = Array(length);
	    for (var i = 0; i < length; i++) {
	      values[i] = obj[keys[i]];
	    }
	    return values;
	  };

	  // Returns the results of applying the iteratee to each element of the object
	  // In contrast to _.map it returns an object
	  _.mapObject = function(obj, iteratee, context) {
	    iteratee = cb(iteratee, context);
	    var keys =  _.keys(obj),
	          length = keys.length,
	          results = {},
	          currentKey;
	      for (var index = 0; index < length; index++) {
	        currentKey = keys[index];
	        results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
	      }
	      return results;
	  };

	  // Convert an object into a list of `[key, value]` pairs.
	  _.pairs = function(obj) {
	    var keys = _.keys(obj);
	    var length = keys.length;
	    var pairs = Array(length);
	    for (var i = 0; i < length; i++) {
	      pairs[i] = [keys[i], obj[keys[i]]];
	    }
	    return pairs;
	  };

	  // Invert the keys and values of an object. The values must be serializable.
	  _.invert = function(obj) {
	    var result = {};
	    var keys = _.keys(obj);
	    for (var i = 0, length = keys.length; i < length; i++) {
	      result[obj[keys[i]]] = keys[i];
	    }
	    return result;
	  };

	  // Return a sorted list of the function names available on the object.
	  // Aliased as `methods`
	  _.functions = _.methods = function(obj) {
	    var names = [];
	    for (var key in obj) {
	      if (_.isFunction(obj[key])) names.push(key);
	    }
	    return names.sort();
	  };

	  // Extend a given object with all the properties in passed-in object(s).
	  _.extend = createAssigner(_.allKeys);

	  // Assigns a given object with all the own properties in the passed-in object(s)
	  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
	  _.extendOwn = _.assign = createAssigner(_.keys);

	  // Returns the first key on an object that passes a predicate test
	  _.findKey = function(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var keys = _.keys(obj), key;
	    for (var i = 0, length = keys.length; i < length; i++) {
	      key = keys[i];
	      if (predicate(obj[key], key, obj)) return key;
	    }
	  };

	  // Return a copy of the object only containing the whitelisted properties.
	  _.pick = function(object, oiteratee, context) {
	    var result = {}, obj = object, iteratee, keys;
	    if (obj == null) return result;
	    if (_.isFunction(oiteratee)) {
	      keys = _.allKeys(obj);
	      iteratee = optimizeCb(oiteratee, context);
	    } else {
	      keys = flatten(arguments, false, false, 1);
	      iteratee = function(value, key, obj) { return key in obj; };
	      obj = Object(obj);
	    }
	    for (var i = 0, length = keys.length; i < length; i++) {
	      var key = keys[i];
	      var value = obj[key];
	      if (iteratee(value, key, obj)) result[key] = value;
	    }
	    return result;
	  };

	   // Return a copy of the object without the blacklisted properties.
	  _.omit = function(obj, iteratee, context) {
	    if (_.isFunction(iteratee)) {
	      iteratee = _.negate(iteratee);
	    } else {
	      var keys = _.map(flatten(arguments, false, false, 1), String);
	      iteratee = function(value, key) {
	        return !_.contains(keys, key);
	      };
	    }
	    return _.pick(obj, iteratee, context);
	  };

	  // Fill in a given object with default properties.
	  _.defaults = createAssigner(_.allKeys, true);

	  // Creates an object that inherits from the given prototype object.
	  // If additional properties are provided then they will be added to the
	  // created object.
	  _.create = function(prototype, props) {
	    var result = baseCreate(prototype);
	    if (props) _.extendOwn(result, props);
	    return result;
	  };

	  // Create a (shallow-cloned) duplicate of an object.
	  _.clone = function(obj) {
	    if (!_.isObject(obj)) return obj;
	    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
	  };

	  // Invokes interceptor with the obj, and then returns obj.
	  // The primary purpose of this method is to "tap into" a method chain, in
	  // order to perform operations on intermediate results within the chain.
	  _.tap = function(obj, interceptor) {
	    interceptor(obj);
	    return obj;
	  };

	  // Returns whether an object has a given set of `key:value` pairs.
	  _.isMatch = function(object, attrs) {
	    var keys = _.keys(attrs), length = keys.length;
	    if (object == null) return !length;
	    var obj = Object(object);
	    for (var i = 0; i < length; i++) {
	      var key = keys[i];
	      if (attrs[key] !== obj[key] || !(key in obj)) return false;
	    }
	    return true;
	  };


	  // Internal recursive comparison function for `isEqual`.
	  var eq = function(a, b, aStack, bStack) {
	    // Identical objects are equal. `0 === -0`, but they aren't identical.
	    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
	    if (a === b) return a !== 0 || 1 / a === 1 / b;
	    // A strict comparison is necessary because `null == undefined`.
	    if (a == null || b == null) return a === b;
	    // Unwrap any wrapped objects.
	    if (a instanceof _) a = a._wrapped;
	    if (b instanceof _) b = b._wrapped;
	    // Compare `[[Class]]` names.
	    var className = toString.call(a);
	    if (className !== toString.call(b)) return false;
	    switch (className) {
	      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
	      case '[object RegExp]':
	      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
	      case '[object String]':
	        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
	        // equivalent to `new String("5")`.
	        return '' + a === '' + b;
	      case '[object Number]':
	        // `NaN`s are equivalent, but non-reflexive.
	        // Object(NaN) is equivalent to NaN
	        if (+a !== +a) return +b !== +b;
	        // An `egal` comparison is performed for other numeric values.
	        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
	      case '[object Date]':
	      case '[object Boolean]':
	        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
	        // millisecond representations. Note that invalid dates with millisecond representations
	        // of `NaN` are not equivalent.
	        return +a === +b;
	    }

	    var areArrays = className === '[object Array]';
	    if (!areArrays) {
	      if (typeof a != 'object' || typeof b != 'object') return false;

	      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
	      // from different frames are.
	      var aCtor = a.constructor, bCtor = b.constructor;
	      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
	                               _.isFunction(bCtor) && bCtor instanceof bCtor)
	                          && ('constructor' in a && 'constructor' in b)) {
	        return false;
	      }
	    }
	    // Assume equality for cyclic structures. The algorithm for detecting cyclic
	    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

	    // Initializing stack of traversed objects.
	    // It's done here since we only need them for objects and arrays comparison.
	    aStack = aStack || [];
	    bStack = bStack || [];
	    var length = aStack.length;
	    while (length--) {
	      // Linear search. Performance is inversely proportional to the number of
	      // unique nested structures.
	      if (aStack[length] === a) return bStack[length] === b;
	    }

	    // Add the first object to the stack of traversed objects.
	    aStack.push(a);
	    bStack.push(b);

	    // Recursively compare objects and arrays.
	    if (areArrays) {
	      // Compare array lengths to determine if a deep comparison is necessary.
	      length = a.length;
	      if (length !== b.length) return false;
	      // Deep compare the contents, ignoring non-numeric properties.
	      while (length--) {
	        if (!eq(a[length], b[length], aStack, bStack)) return false;
	      }
	    } else {
	      // Deep compare objects.
	      var keys = _.keys(a), key;
	      length = keys.length;
	      // Ensure that both objects contain the same number of properties before comparing deep equality.
	      if (_.keys(b).length !== length) return false;
	      while (length--) {
	        // Deep compare each member
	        key = keys[length];
	        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
	      }
	    }
	    // Remove the first object from the stack of traversed objects.
	    aStack.pop();
	    bStack.pop();
	    return true;
	  };

	  // Perform a deep comparison to check if two objects are equal.
	  _.isEqual = function(a, b) {
	    return eq(a, b);
	  };

	  // Is a given array, string, or object empty?
	  // An "empty" object has no enumerable own-properties.
	  _.isEmpty = function(obj) {
	    if (obj == null) return true;
	    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
	    return _.keys(obj).length === 0;
	  };

	  // Is a given value a DOM element?
	  _.isElement = function(obj) {
	    return !!(obj && obj.nodeType === 1);
	  };

	  // Is a given value an array?
	  // Delegates to ECMA5's native Array.isArray
	  _.isArray = nativeIsArray || function(obj) {
	    return toString.call(obj) === '[object Array]';
	  };

	  // Is a given variable an object?
	  _.isObject = function(obj) {
	    var type = typeof obj;
	    return type === 'function' || type === 'object' && !!obj;
	  };

	  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
	  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
	    _['is' + name] = function(obj) {
	      return toString.call(obj) === '[object ' + name + ']';
	    };
	  });

	  // Define a fallback version of the method in browsers (ahem, IE < 9), where
	  // there isn't any inspectable "Arguments" type.
	  if (!_.isArguments(arguments)) {
	    _.isArguments = function(obj) {
	      return _.has(obj, 'callee');
	    };
	  }

	  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
	  // IE 11 (#1621), and in Safari 8 (#1929).
	  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
	    _.isFunction = function(obj) {
	      return typeof obj == 'function' || false;
	    };
	  }

	  // Is a given object a finite number?
	  _.isFinite = function(obj) {
	    return isFinite(obj) && !isNaN(parseFloat(obj));
	  };

	  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
	  _.isNaN = function(obj) {
	    return _.isNumber(obj) && obj !== +obj;
	  };

	  // Is a given value a boolean?
	  _.isBoolean = function(obj) {
	    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
	  };

	  // Is a given value equal to null?
	  _.isNull = function(obj) {
	    return obj === null;
	  };

	  // Is a given variable undefined?
	  _.isUndefined = function(obj) {
	    return obj === void 0;
	  };

	  // Shortcut function for checking if an object has a given property directly
	  // on itself (in other words, not on a prototype).
	  _.has = function(obj, key) {
	    return obj != null && hasOwnProperty.call(obj, key);
	  };

	  // Utility Functions
	  // -----------------

	  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
	  // previous owner. Returns a reference to the Underscore object.
	  _.noConflict = function() {
	    root._ = previousUnderscore;
	    return this;
	  };

	  // Keep the identity function around for default iteratees.
	  _.identity = function(value) {
	    return value;
	  };

	  // Predicate-generating functions. Often useful outside of Underscore.
	  _.constant = function(value) {
	    return function() {
	      return value;
	    };
	  };

	  _.noop = function(){};

	  _.property = property;

	  // Generates a function for a given object that returns a given property.
	  _.propertyOf = function(obj) {
	    return obj == null ? function(){} : function(key) {
	      return obj[key];
	    };
	  };

	  // Returns a predicate for checking whether an object has a given set of
	  // `key:value` pairs.
	  _.matcher = _.matches = function(attrs) {
	    attrs = _.extendOwn({}, attrs);
	    return function(obj) {
	      return _.isMatch(obj, attrs);
	    };
	  };

	  // Run a function **n** times.
	  _.times = function(n, iteratee, context) {
	    var accum = Array(Math.max(0, n));
	    iteratee = optimizeCb(iteratee, context, 1);
	    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
	    return accum;
	  };

	  // Return a random integer between min and max (inclusive).
	  _.random = function(min, max) {
	    if (max == null) {
	      max = min;
	      min = 0;
	    }
	    return min + Math.floor(Math.random() * (max - min + 1));
	  };

	  // A (possibly faster) way to get the current timestamp as an integer.
	  _.now = Date.now || function() {
	    return new Date().getTime();
	  };

	   // List of HTML entities for escaping.
	  var escapeMap = {
	    '&': '&amp;',
	    '<': '&lt;',
	    '>': '&gt;',
	    '"': '&quot;',
	    "'": '&#x27;',
	    '`': '&#x60;'
	  };
	  var unescapeMap = _.invert(escapeMap);

	  // Functions for escaping and unescaping strings to/from HTML interpolation.
	  var createEscaper = function(map) {
	    var escaper = function(match) {
	      return map[match];
	    };
	    // Regexes for identifying a key that needs to be escaped
	    var source = '(?:' + _.keys(map).join('|') + ')';
	    var testRegexp = RegExp(source);
	    var replaceRegexp = RegExp(source, 'g');
	    return function(string) {
	      string = string == null ? '' : '' + string;
	      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
	    };
	  };
	  _.escape = createEscaper(escapeMap);
	  _.unescape = createEscaper(unescapeMap);

	  // If the value of the named `property` is a function then invoke it with the
	  // `object` as context; otherwise, return it.
	  _.result = function(object, property, fallback) {
	    var value = object == null ? void 0 : object[property];
	    if (value === void 0) {
	      value = fallback;
	    }
	    return _.isFunction(value) ? value.call(object) : value;
	  };

	  // Generate a unique integer id (unique within the entire client session).
	  // Useful for temporary DOM ids.
	  var idCounter = 0;
	  _.uniqueId = function(prefix) {
	    var id = ++idCounter + '';
	    return prefix ? prefix + id : id;
	  };

	  // By default, Underscore uses ERB-style template delimiters, change the
	  // following template settings to use alternative delimiters.
	  _.templateSettings = {
	    evaluate    : /<%([\s\S]+?)%>/g,
	    interpolate : /<%=([\s\S]+?)%>/g,
	    escape      : /<%-([\s\S]+?)%>/g
	  };

	  // When customizing `templateSettings`, if you don't want to define an
	  // interpolation, evaluation or escaping regex, we need one that is
	  // guaranteed not to match.
	  var noMatch = /(.)^/;

	  // Certain characters need to be escaped so that they can be put into a
	  // string literal.
	  var escapes = {
	    "'":      "'",
	    '\\':     '\\',
	    '\r':     'r',
	    '\n':     'n',
	    '\u2028': 'u2028',
	    '\u2029': 'u2029'
	  };

	  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

	  var escapeChar = function(match) {
	    return '\\' + escapes[match];
	  };

	  // JavaScript micro-templating, similar to John Resig's implementation.
	  // Underscore templating handles arbitrary delimiters, preserves whitespace,
	  // and correctly escapes quotes within interpolated code.
	  // NB: `oldSettings` only exists for backwards compatibility.
	  _.template = function(text, settings, oldSettings) {
	    if (!settings && oldSettings) settings = oldSettings;
	    settings = _.defaults({}, settings, _.templateSettings);

	    // Combine delimiters into one regular expression via alternation.
	    var matcher = RegExp([
	      (settings.escape || noMatch).source,
	      (settings.interpolate || noMatch).source,
	      (settings.evaluate || noMatch).source
	    ].join('|') + '|$', 'g');

	    // Compile the template source, escaping string literals appropriately.
	    var index = 0;
	    var source = "__p+='";
	    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
	      source += text.slice(index, offset).replace(escaper, escapeChar);
	      index = offset + match.length;

	      if (escape) {
	        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
	      } else if (interpolate) {
	        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
	      } else if (evaluate) {
	        source += "';\n" + evaluate + "\n__p+='";
	      }

	      // Adobe VMs need the match returned to produce the correct offest.
	      return match;
	    });
	    source += "';\n";

	    // If a variable is not specified, place data values in local scope.
	    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

	    source = "var __t,__p='',__j=Array.prototype.join," +
	      "print=function(){__p+=__j.call(arguments,'');};\n" +
	      source + 'return __p;\n';

	    try {
	      var render = new Function(settings.variable || 'obj', '_', source);
	    } catch (e) {
	      e.source = source;
	      throw e;
	    }

	    var template = function(data) {
	      return render.call(this, data, _);
	    };

	    // Provide the compiled source as a convenience for precompilation.
	    var argument = settings.variable || 'obj';
	    template.source = 'function(' + argument + '){\n' + source + '}';

	    return template;
	  };

	  // Add a "chain" function. Start chaining a wrapped Underscore object.
	  _.chain = function(obj) {
	    var instance = _(obj);
	    instance._chain = true;
	    return instance;
	  };

	  // OOP
	  // ---------------
	  // If Underscore is called as a function, it returns a wrapped object that
	  // can be used OO-style. This wrapper holds altered versions of all the
	  // underscore functions. Wrapped objects may be chained.

	  // Helper function to continue chaining intermediate results.
	  var result = function(instance, obj) {
	    return instance._chain ? _(obj).chain() : obj;
	  };

	  // Add your own custom functions to the Underscore object.
	  _.mixin = function(obj) {
	    _.each(_.functions(obj), function(name) {
	      var func = _[name] = obj[name];
	      _.prototype[name] = function() {
	        var args = [this._wrapped];
	        push.apply(args, arguments);
	        return result(this, func.apply(_, args));
	      };
	    });
	  };

	  // Add all of the Underscore functions to the wrapper object.
	  _.mixin(_);

	  // Add all mutator Array functions to the wrapper.
	  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
	    var method = ArrayProto[name];
	    _.prototype[name] = function() {
	      var obj = this._wrapped;
	      method.apply(obj, arguments);
	      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
	      return result(this, obj);
	    };
	  });

	  // Add all accessor Array functions to the wrapper.
	  _.each(['concat', 'join', 'slice'], function(name) {
	    var method = ArrayProto[name];
	    _.prototype[name] = function() {
	      return result(this, method.apply(this._wrapped, arguments));
	    };
	  });

	  // Extracts the result from a wrapped and chained object.
	  _.prototype.value = function() {
	    return this._wrapped;
	  };

	  // Provide unwrapping proxy for some methods used in engine operations
	  // such as arithmetic and JSON stringification.
	  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

	  _.prototype.toString = function() {
	    return '' + this._wrapped;
	  };

	  // AMD registration happens at the end for compatibility with AMD loaders
	  // that may not enforce next-turn semantics on modules. Even though general
	  // practice for AMD registration is to be anonymous, underscore registers
	  // as a named module because, like jQuery, it is a base library that is
	  // popular enough to be bundled in a third party lib, but not be part of
	  // an AMD load request. Those cases could generate an error when an
	  // anonymous define() is called outside of a loader request.
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
	      return _;
	    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  }
	}.call(this));


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var Vue;

	Vue = __webpack_require__(7);

	Vue.config.debug = false;

	Vue.config.silent = true;

	Vue.config.delimiters = ['(%', '%)'];

	Vue.transition('fade', {
	  enter: function(el, done) {
	    $(el).css('opacity', 0).animate({
	      opacity: 1
	    }, 2000, done);
	  },
	  enterCancelled: function(el) {
	    $(el).stop();
	  },
	  leave: function(el, done) {
	    $(el).animate({
	      opacity: 0
	    }, 2000, done);
	  },
	  leaveCancelled: function(el) {
	    $(el).stop();
	  }
	});

	module.exports = Vue;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(8)
	var extend = _.extend

	/**
	 * The exposed Vue constructor.
	 *
	 * API conventions:
	 * - public API methods/properties are prefiexed with `$`
	 * - internal methods/properties are prefixed with `_`
	 * - non-prefixed properties are assumed to be proxied user
	 *   data.
	 *
	 * @constructor
	 * @param {Object} [options]
	 * @public
	 */

	function Vue (options) {
	  this._init(options)
	}

	/**
	 * Mixin global API
	 */

	extend(Vue, __webpack_require__(17))

	/**
	 * Vue and every constructor that extends Vue has an
	 * associated options object, which can be accessed during
	 * compilation steps as `this.constructor.options`.
	 *
	 * These can be seen as the default options of every
	 * Vue instance.
	 */

	Vue.options = {
	  replace: true,
	  directives: __webpack_require__(33),
	  elementDirectives: __webpack_require__(55),
	  filters: __webpack_require__(58),
	  transitions: {},
	  components: {},
	  partials: {}
	}

	/**
	 * Build up the prototype
	 */

	var p = Vue.prototype

	/**
	 * $data has a setter which does a bunch of
	 * teardown/setup work
	 */

	Object.defineProperty(p, '$data', {
	  get: function () {
	    return this._data
	  },
	  set: function (newData) {
	    if (newData !== this._data) {
	      this._setData(newData)
	    }
	  }
	})

	/**
	 * Mixin internal instance methods
	 */

	extend(p, __webpack_require__(60))
	extend(p, __webpack_require__(61))
	extend(p, __webpack_require__(62))
	extend(p, __webpack_require__(66))
	extend(p, __webpack_require__(68))

	/**
	 * Mixin public API methods
	 */

	extend(p, __webpack_require__(69))
	extend(p, __webpack_require__(70))
	extend(p, __webpack_require__(71))
	extend(p, __webpack_require__(72))
	extend(p, __webpack_require__(73))

	module.exports = _.Vue = Vue


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var lang = __webpack_require__(9)
	var extend = lang.extend

	extend(exports, lang)
	extend(exports, __webpack_require__(10))
	extend(exports, __webpack_require__(11))
	extend(exports, __webpack_require__(14))
	extend(exports, __webpack_require__(15))
	extend(exports, __webpack_require__(16))


/***/ },
/* 9 */
/***/ function(module, exports) {

	/**
	 * Check is a string starts with $ or _
	 *
	 * @param {String} str
	 * @return {Boolean}
	 */

	exports.isReserved = function (str) {
	  var c = (str + '').charCodeAt(0)
	  return c === 0x24 || c === 0x5F
	}

	/**
	 * Guard text output, make sure undefined outputs
	 * empty string
	 *
	 * @param {*} value
	 * @return {String}
	 */

	exports.toString = function (value) {
	  return value == null
	    ? ''
	    : value.toString()
	}

	/**
	 * Check and convert possible numeric strings to numbers
	 * before setting back to data
	 *
	 * @param {*} value
	 * @return {*|Number}
	 */

	exports.toNumber = function (value) {
	  if (typeof value !== 'string') {
	    return value
	  } else {
	    var parsed = Number(value)
	    return isNaN(parsed)
	      ? value
	      : parsed
	  }
	}

	/**
	 * Convert string boolean literals into real booleans.
	 *
	 * @param {*} value
	 * @return {*|Boolean}
	 */

	exports.toBoolean = function (value) {
	  return value === 'true'
	    ? true
	    : value === 'false'
	      ? false
	      : value
	}

	/**
	 * Strip quotes from a string
	 *
	 * @param {String} str
	 * @return {String | false}
	 */

	exports.stripQuotes = function (str) {
	  var a = str.charCodeAt(0)
	  var b = str.charCodeAt(str.length - 1)
	  return a === b && (a === 0x22 || a === 0x27)
	    ? str.slice(1, -1)
	    : false
	}

	/**
	 * Camelize a hyphen-delmited string.
	 *
	 * @param {String} str
	 * @return {String}
	 */

	exports.camelize = function (str) {
	  return str.replace(/-(\w)/g, toUpper)
	}

	function toUpper (_, c) {
	  return c ? c.toUpperCase() : ''
	}

	/**
	 * Hyphenate a camelCase string.
	 *
	 * @param {String} str
	 * @return {String}
	 */

	exports.hyphenate = function (str) {
	  return str
	    .replace(/([a-z\d])([A-Z])/g, '$1-$2')
	    .toLowerCase()
	}

	/**
	 * Converts hyphen/underscore/slash delimitered names into
	 * camelized classNames.
	 *
	 * e.g. my-component => MyComponent
	 *      some_else    => SomeElse
	 *      some/comp    => SomeComp
	 *
	 * @param {String} str
	 * @return {String}
	 */

	var classifyRE = /(?:^|[-_\/])(\w)/g
	exports.classify = function (str) {
	  return str.replace(classifyRE, toUpper)
	}

	/**
	 * Simple bind, faster than native
	 *
	 * @param {Function} fn
	 * @param {Object} ctx
	 * @return {Function}
	 */

	exports.bind = function (fn, ctx) {
	  return function (a) {
	    var l = arguments.length
	    return l
	      ? l > 1
	        ? fn.apply(ctx, arguments)
	        : fn.call(ctx, a)
	      : fn.call(ctx)
	  }
	}

	/**
	 * Convert an Array-like object to a real Array.
	 *
	 * @param {Array-like} list
	 * @param {Number} [start] - start index
	 * @return {Array}
	 */

	exports.toArray = function (list, start) {
	  start = start || 0
	  var i = list.length - start
	  var ret = new Array(i)
	  while (i--) {
	    ret[i] = list[i + start]
	  }
	  return ret
	}

	/**
	 * Mix properties into target object.
	 *
	 * @param {Object} to
	 * @param {Object} from
	 */

	exports.extend = function (to, from) {
	  for (var key in from) {
	    to[key] = from[key]
	  }
	  return to
	}

	/**
	 * Quick object check - this is primarily used to tell
	 * Objects from primitive values when we know the value
	 * is a JSON-compliant type.
	 *
	 * @param {*} obj
	 * @return {Boolean}
	 */

	exports.isObject = function (obj) {
	  return obj !== null && typeof obj === 'object'
	}

	/**
	 * Strict object type check. Only returns true
	 * for plain JavaScript objects.
	 *
	 * @param {*} obj
	 * @return {Boolean}
	 */

	var toString = Object.prototype.toString
	exports.isPlainObject = function (obj) {
	  return toString.call(obj) === '[object Object]'
	}

	/**
	 * Array type check.
	 *
	 * @param {*} obj
	 * @return {Boolean}
	 */

	exports.isArray = Array.isArray

	/**
	 * Define a non-enumerable property
	 *
	 * @param {Object} obj
	 * @param {String} key
	 * @param {*} val
	 * @param {Boolean} [enumerable]
	 */

	exports.define = function (obj, key, val, enumerable) {
	  Object.defineProperty(obj, key, {
	    value: val,
	    enumerable: !!enumerable,
	    writable: true,
	    configurable: true
	  })
	}

	/**
	 * Debounce a function so it only gets called after the
	 * input stops arriving after the given wait period.
	 *
	 * @param {Function} func
	 * @param {Number} wait
	 * @return {Function} - the debounced function
	 */

	exports.debounce = function (func, wait) {
	  var timeout, args, context, timestamp, result
	  var later = function () {
	    var last = Date.now() - timestamp
	    if (last < wait && last >= 0) {
	      timeout = setTimeout(later, wait - last)
	    } else {
	      timeout = null
	      result = func.apply(context, args)
	      if (!timeout) context = args = null
	    }
	  }
	  return function () {
	    context = this
	    args = arguments
	    timestamp = Date.now()
	    if (!timeout) {
	      timeout = setTimeout(later, wait)
	    }
	    return result
	  }
	}

	/**
	 * Manual indexOf because it's slightly faster than
	 * native.
	 *
	 * @param {Array} arr
	 * @param {*} obj
	 */

	exports.indexOf = function (arr, obj) {
	  for (var i = 0, l = arr.length; i < l; i++) {
	    if (arr[i] === obj) return i
	  }
	  return -1
	}

	/**
	 * Make a cancellable version of an async callback.
	 *
	 * @param {Function} fn
	 * @return {Function}
	 */

	exports.cancellable = function (fn) {
	  var cb = function () {
	    if (!cb.cancelled) {
	      return fn.apply(this, arguments)
	    }
	  }
	  cb.cancel = function () {
	    cb.cancelled = true
	  }
	  return cb
	}

	/**
	 * Check if two values are loosely equal - that is,
	 * if they are plain objects, do they have the same shape?
	 *
	 * @param {*} a
	 * @param {*} b
	 * @return {Boolean}
	 */

	exports.looseEqual = function (a, b) {
	  /* eslint-disable eqeqeq */
	  return a == b || (
	    exports.isObject(a) && exports.isObject(b)
	      ? JSON.stringify(a) === JSON.stringify(b)
	      : false
	  )
	  /* eslint-enable eqeqeq */
	}


/***/ },
/* 10 */
/***/ function(module, exports) {

	// can we use __proto__?
	exports.hasProto = '__proto__' in {}

	// Browser environment sniffing
	var inBrowser = exports.inBrowser =
	  typeof window !== 'undefined' &&
	  Object.prototype.toString.call(window) !== '[object Object]'

	exports.isIE9 =
	  inBrowser &&
	  navigator.userAgent.toLowerCase().indexOf('msie 9.0') > 0

	exports.isAndroid =
	  inBrowser &&
	  navigator.userAgent.toLowerCase().indexOf('android') > 0

	// Transition property/event sniffing
	if (inBrowser && !exports.isIE9) {
	  var isWebkitTrans =
	    window.ontransitionend === undefined &&
	    window.onwebkittransitionend !== undefined
	  var isWebkitAnim =
	    window.onanimationend === undefined &&
	    window.onwebkitanimationend !== undefined
	  exports.transitionProp = isWebkitTrans
	    ? 'WebkitTransition'
	    : 'transition'
	  exports.transitionEndEvent = isWebkitTrans
	    ? 'webkitTransitionEnd'
	    : 'transitionend'
	  exports.animationProp = isWebkitAnim
	    ? 'WebkitAnimation'
	    : 'animation'
	  exports.animationEndEvent = isWebkitAnim
	    ? 'webkitAnimationEnd'
	    : 'animationend'
	}

	/**
	 * Defer a task to execute it asynchronously. Ideally this
	 * should be executed as a microtask, so we leverage
	 * MutationObserver if it's available, and fallback to
	 * setTimeout(0).
	 *
	 * @param {Function} cb
	 * @param {Object} ctx
	 */

	exports.nextTick = (function () {
	  var callbacks = []
	  var pending = false
	  var timerFunc
	  function nextTickHandler () {
	    pending = false
	    var copies = callbacks.slice(0)
	    callbacks = []
	    for (var i = 0; i < copies.length; i++) {
	      copies[i]()
	    }
	  }
	  /* istanbul ignore if */
	  if (typeof MutationObserver !== 'undefined') {
	    var counter = 1
	    var observer = new MutationObserver(nextTickHandler)
	    var textNode = document.createTextNode(counter)
	    observer.observe(textNode, {
	      characterData: true
	    })
	    timerFunc = function () {
	      counter = (counter + 1) % 2
	      textNode.data = counter
	    }
	  } else {
	    timerFunc = setTimeout
	  }
	  return function (cb, ctx) {
	    var func = ctx
	      ? function () { cb.call(ctx) }
	      : cb
	    callbacks.push(func)
	    if (pending) return
	    pending = true
	    timerFunc(nextTickHandler, 0)
	  }
	})()


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var _ = __webpack_require__(8)
	var config = __webpack_require__(13)

	/**
	 * Query an element selector if it's not an element already.
	 *
	 * @param {String|Element} el
	 * @return {Element}
	 */

	exports.query = function (el) {
	  if (typeof el === 'string') {
	    var selector = el
	    el = document.querySelector(el)
	    if (!el) {
	      process.env.NODE_ENV !== 'production' && _.warn(
	        'Cannot find element: ' + selector
	      )
	    }
	  }
	  return el
	}

	/**
	 * Check if a node is in the document.
	 * Note: document.documentElement.contains should work here
	 * but always returns false for comment nodes in phantomjs,
	 * making unit tests difficult. This is fixed byy doing the
	 * contains() check on the node's parentNode instead of
	 * the node itself.
	 *
	 * @param {Node} node
	 * @return {Boolean}
	 */

	exports.inDoc = function (node) {
	  var doc = document.documentElement
	  var parent = node && node.parentNode
	  return doc === node ||
	    doc === parent ||
	    !!(parent && parent.nodeType === 1 && (doc.contains(parent)))
	}

	/**
	 * Extract an attribute from a node.
	 *
	 * @param {Node} node
	 * @param {String} attr
	 */

	exports.attr = function (node, attr) {
	  attr = config.prefix + attr
	  var val = node.getAttribute(attr)
	  if (val !== null) {
	    node.removeAttribute(attr)
	  }
	  return val
	}

	/**
	 * Insert el before target
	 *
	 * @param {Element} el
	 * @param {Element} target
	 */

	exports.before = function (el, target) {
	  target.parentNode.insertBefore(el, target)
	}

	/**
	 * Insert el after target
	 *
	 * @param {Element} el
	 * @param {Element} target
	 */

	exports.after = function (el, target) {
	  if (target.nextSibling) {
	    exports.before(el, target.nextSibling)
	  } else {
	    target.parentNode.appendChild(el)
	  }
	}

	/**
	 * Remove el from DOM
	 *
	 * @param {Element} el
	 */

	exports.remove = function (el) {
	  el.parentNode.removeChild(el)
	}

	/**
	 * Prepend el to target
	 *
	 * @param {Element} el
	 * @param {Element} target
	 */

	exports.prepend = function (el, target) {
	  if (target.firstChild) {
	    exports.before(el, target.firstChild)
	  } else {
	    target.appendChild(el)
	  }
	}

	/**
	 * Replace target with el
	 *
	 * @param {Element} target
	 * @param {Element} el
	 */

	exports.replace = function (target, el) {
	  var parent = target.parentNode
	  if (parent) {
	    parent.replaceChild(el, target)
	  }
	}

	/**
	 * Add event listener shorthand.
	 *
	 * @param {Element} el
	 * @param {String} event
	 * @param {Function} cb
	 */

	exports.on = function (el, event, cb) {
	  el.addEventListener(event, cb)
	}

	/**
	 * Remove event listener shorthand.
	 *
	 * @param {Element} el
	 * @param {String} event
	 * @param {Function} cb
	 */

	exports.off = function (el, event, cb) {
	  el.removeEventListener(event, cb)
	}

	/**
	 * Add class with compatibility for IE & SVG
	 *
	 * @param {Element} el
	 * @param {Strong} cls
	 */

	exports.addClass = function (el, cls) {
	  if (el.classList) {
	    el.classList.add(cls)
	  } else {
	    var cur = ' ' + (el.getAttribute('class') || '') + ' '
	    if (cur.indexOf(' ' + cls + ' ') < 0) {
	      el.setAttribute('class', (cur + cls).trim())
	    }
	  }
	}

	/**
	 * Remove class with compatibility for IE & SVG
	 *
	 * @param {Element} el
	 * @param {Strong} cls
	 */

	exports.removeClass = function (el, cls) {
	  if (el.classList) {
	    el.classList.remove(cls)
	  } else {
	    var cur = ' ' + (el.getAttribute('class') || '') + ' '
	    var tar = ' ' + cls + ' '
	    while (cur.indexOf(tar) >= 0) {
	      cur = cur.replace(tar, ' ')
	    }
	    el.setAttribute('class', cur.trim())
	  }
	}

	/**
	 * Extract raw content inside an element into a temporary
	 * container div
	 *
	 * @param {Element} el
	 * @param {Boolean} asFragment
	 * @return {Element}
	 */

	exports.extractContent = function (el, asFragment) {
	  var child
	  var rawContent
	  /* istanbul ignore if */
	  if (
	    exports.isTemplate(el) &&
	    el.content instanceof DocumentFragment
	  ) {
	    el = el.content
	  }
	  if (el.hasChildNodes()) {
	    exports.trimNode(el)
	    rawContent = asFragment
	      ? document.createDocumentFragment()
	      : document.createElement('div')
	    /* eslint-disable no-cond-assign */
	    while (child = el.firstChild) {
	    /* eslint-enable no-cond-assign */
	      rawContent.appendChild(child)
	    }
	  }
	  return rawContent
	}

	/**
	 * Trim possible empty head/tail textNodes inside a parent.
	 *
	 * @param {Node} node
	 */

	exports.trimNode = function (node) {
	  trim(node, node.firstChild)
	  trim(node, node.lastChild)
	}

	function trim (parent, node) {
	  if (node && node.nodeType === 3 && !node.data.trim()) {
	    parent.removeChild(node)
	  }
	}

	/**
	 * Check if an element is a template tag.
	 * Note if the template appears inside an SVG its tagName
	 * will be in lowercase.
	 *
	 * @param {Element} el
	 */

	exports.isTemplate = function (el) {
	  return el.tagName &&
	    el.tagName.toLowerCase() === 'template'
	}

	/**
	 * Create an "anchor" for performing dom insertion/removals.
	 * This is used in a number of scenarios:
	 * - fragment instance
	 * - v-html
	 * - v-if
	 * - component
	 * - repeat
	 *
	 * @param {String} content
	 * @param {Boolean} persist - IE trashes empty textNodes on
	 *                            cloneNode(true), so in certain
	 *                            cases the anchor needs to be
	 *                            non-empty to be persisted in
	 *                            templates.
	 * @return {Comment|Text}
	 */

	exports.createAnchor = function (content, persist) {
	  return config.debug
	    ? document.createComment(content)
	    : document.createTextNode(persist ? ' ' : '')
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(12)))

/***/ },
/* 12 */
/***/ function(module, exports) {

	// shim for using process in browser

	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            currentQueue[queueIndex].run();
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	// TODO(shtylman)
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 13 */
/***/ function(module, exports) {

	module.exports = {

	  /**
	   * The prefix to look for when parsing directives.
	   *
	   * @type {String}
	   */

	  prefix: 'v-',

	  /**
	   * Whether to print debug messages.
	   * Also enables stack trace for warnings.
	   *
	   * @type {Boolean}
	   */

	  debug: false,

	  /**
	   * Strict mode.
	   * Disables asset lookup in the view parent chain.
	   */

	  strict: false,

	  /**
	   * Whether to suppress warnings.
	   *
	   * @type {Boolean}
	   */

	  silent: false,

	  /**
	   * Whether allow observer to alter data objects'
	   * __proto__.
	   *
	   * @type {Boolean}
	   */

	  proto: true,

	  /**
	   * Whether to parse mustache tags in templates.
	   *
	   * @type {Boolean}
	   */

	  interpolate: true,

	  /**
	   * Whether to use async rendering.
	   */

	  async: true,

	  /**
	   * Whether to warn against errors caught when evaluating
	   * expressions.
	   */

	  warnExpressionErrors: true,

	  /**
	   * Internal flag to indicate the delimiters have been
	   * changed.
	   *
	   * @type {Boolean}
	   */

	  _delimitersChanged: true,

	  /**
	   * List of asset types that a component can own.
	   *
	   * @type {Array}
	   */

	  _assetTypes: [
	    'component',
	    'directive',
	    'elementDirective',
	    'filter',
	    'transition',
	    'partial'
	  ],

	  /**
	   * prop binding modes
	   */

	  _propBindingModes: {
	    ONE_WAY: 0,
	    TWO_WAY: 1,
	    ONE_TIME: 2
	  },

	  /**
	   * Max circular updates allowed in a batcher flush cycle.
	   */

	  _maxUpdateCount: 100

	}

	/**
	 * Interpolation delimiters.
	 * We need to mark the changed flag so that the text parser
	 * knows it needs to recompile the regex.
	 *
	 * @type {Array<String>}
	 */

	var delimiters = ['{{', '}}']
	Object.defineProperty(module.exports, 'delimiters', {
	  get: function () {
	    return delimiters
	  },
	  set: function (val) {
	    delimiters = val
	    this._delimitersChanged = true
	  }
	})


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var _ = __webpack_require__(8)
	var config = __webpack_require__(13)
	var extend = _.extend

	/**
	 * Option overwriting strategies are functions that handle
	 * how to merge a parent option value and a child option
	 * value into the final value.
	 *
	 * All strategy functions follow the same signature:
	 *
	 * @param {*} parentVal
	 * @param {*} childVal
	 * @param {Vue} [vm]
	 */

	var strats = Object.create(null)

	/**
	 * Helper that recursively merges two data objects together.
	 */

	function mergeData (to, from) {
	  var key, toVal, fromVal
	  for (key in from) {
	    toVal = to[key]
	    fromVal = from[key]
	    if (!to.hasOwnProperty(key)) {
	      to.$add(key, fromVal)
	    } else if (_.isObject(toVal) && _.isObject(fromVal)) {
	      mergeData(toVal, fromVal)
	    }
	  }
	  return to
	}

	/**
	 * Data
	 */

	strats.data = function (parentVal, childVal, vm) {
	  if (!vm) {
	    // in a Vue.extend merge, both should be functions
	    if (!childVal) {
	      return parentVal
	    }
	    if (typeof childVal !== 'function') {
	      process.env.NODE_ENV !== 'production' && _.warn(
	        'The "data" option should be a function ' +
	        'that returns a per-instance value in component ' +
	        'definitions.'
	      )
	      return parentVal
	    }
	    if (!parentVal) {
	      return childVal
	    }
	    // when parentVal & childVal are both present,
	    // we need to return a function that returns the
	    // merged result of both functions... no need to
	    // check if parentVal is a function here because
	    // it has to be a function to pass previous merges.
	    return function mergedDataFn () {
	      return mergeData(
	        childVal.call(this),
	        parentVal.call(this)
	      )
	    }
	  } else if (parentVal || childVal) {
	    return function mergedInstanceDataFn () {
	      // instance merge
	      var instanceData = typeof childVal === 'function'
	        ? childVal.call(vm)
	        : childVal
	      var defaultData = typeof parentVal === 'function'
	        ? parentVal.call(vm)
	        : undefined
	      if (instanceData) {
	        return mergeData(instanceData, defaultData)
	      } else {
	        return defaultData
	      }
	    }
	  }
	}

	/**
	 * El
	 */

	strats.el = function (parentVal, childVal, vm) {
	  if (!vm && childVal && typeof childVal !== 'function') {
	    process.env.NODE_ENV !== 'production' && _.warn(
	      'The "el" option should be a function ' +
	      'that returns a per-instance value in component ' +
	      'definitions.'
	    )
	    return
	  }
	  var ret = childVal || parentVal
	  // invoke the element factory if this is instance merge
	  return vm && typeof ret === 'function'
	    ? ret.call(vm)
	    : ret
	}

	/**
	 * Hooks and param attributes are merged as arrays.
	 */

	strats.created =
	strats.ready =
	strats.attached =
	strats.detached =
	strats.beforeCompile =
	strats.compiled =
	strats.beforeDestroy =
	strats.destroyed =
	strats.props = function (parentVal, childVal) {
	  return childVal
	    ? parentVal
	      ? parentVal.concat(childVal)
	      : _.isArray(childVal)
	        ? childVal
	        : [childVal]
	    : parentVal
	}

	/**
	 * 0.11 deprecation warning
	 */

	strats.paramAttributes = function () {
	  /* istanbul ignore next */
	  process.env.NODE_ENV !== 'production' && _.warn(
	    '"paramAttributes" option has been deprecated in 0.12. ' +
	    'Use "props" instead.'
	  )
	}

	/**
	 * Assets
	 *
	 * When a vm is present (instance creation), we need to do
	 * a three-way merge between constructor options, instance
	 * options and parent options.
	 */

	function mergeAssets (parentVal, childVal) {
	  var res = Object.create(parentVal)
	  return childVal
	    ? extend(res, guardArrayAssets(childVal))
	    : res
	}

	config._assetTypes.forEach(function (type) {
	  strats[type + 's'] = mergeAssets
	})

	/**
	 * Events & Watchers.
	 *
	 * Events & watchers hashes should not overwrite one
	 * another, so we merge them as arrays.
	 */

	strats.watch =
	strats.events = function (parentVal, childVal) {
	  if (!childVal) return parentVal
	  if (!parentVal) return childVal
	  var ret = {}
	  extend(ret, parentVal)
	  for (var key in childVal) {
	    var parent = ret[key]
	    var child = childVal[key]
	    if (parent && !_.isArray(parent)) {
	      parent = [parent]
	    }
	    ret[key] = parent
	      ? parent.concat(child)
	      : [child]
	  }
	  return ret
	}

	/**
	 * Other object hashes.
	 */

	strats.methods =
	strats.computed = function (parentVal, childVal) {
	  if (!childVal) return parentVal
	  if (!parentVal) return childVal
	  var ret = Object.create(parentVal)
	  extend(ret, childVal)
	  return ret
	}

	/**
	 * Default strategy.
	 */

	var defaultStrat = function (parentVal, childVal) {
	  return childVal === undefined
	    ? parentVal
	    : childVal
	}

	/**
	 * Make sure component options get converted to actual
	 * constructors.
	 *
	 * @param {Object} options
	 */

	function guardComponents (options) {
	  if (options.components) {
	    var components = options.components =
	      guardArrayAssets(options.components)
	    var def
	    var ids = Object.keys(components)
	    for (var i = 0, l = ids.length; i < l; i++) {
	      var key = ids[i]
	      if (_.commonTagRE.test(key)) {
	        process.env.NODE_ENV !== 'production' && _.warn(
	          'Do not use built-in HTML elements as component ' +
	          'id: ' + key
	        )
	        continue
	      }
	      def = components[key]
	      if (_.isPlainObject(def)) {
	        def.id = def.id || key
	        components[key] = def._Ctor || (def._Ctor = _.Vue.extend(def))
	      }
	    }
	  }
	}

	/**
	 * Ensure all props option syntax are normalized into the
	 * Object-based format.
	 *
	 * @param {Object} options
	 */

	function guardProps (options) {
	  var props = options.props
	  if (_.isPlainObject(props)) {
	    options.props = Object.keys(props).map(function (key) {
	      var val = props[key]
	      if (!_.isPlainObject(val)) {
	        val = { type: val }
	      }
	      val.name = key
	      return val
	    })
	  } else if (_.isArray(props)) {
	    options.props = props.map(function (prop) {
	      return typeof prop === 'string'
	        ? { name: prop }
	        : prop
	    })
	  }
	}

	/**
	 * Guard an Array-format assets option and converted it
	 * into the key-value Object format.
	 *
	 * @param {Object|Array} assets
	 * @return {Object}
	 */

	function guardArrayAssets (assets) {
	  if (_.isArray(assets)) {
	    var res = {}
	    var i = assets.length
	    var asset
	    while (i--) {
	      asset = assets[i]
	      var id = asset.id || (asset.options && asset.options.id)
	      if (!id) {
	        process.env.NODE_ENV !== 'production' && _.warn(
	          'Array-syntax assets must provide an id field.'
	        )
	      } else {
	        res[id] = asset
	      }
	    }
	    return res
	  }
	  return assets
	}

	/**
	 * Merge two option objects into a new one.
	 * Core utility used in both instantiation and inheritance.
	 *
	 * @param {Object} parent
	 * @param {Object} child
	 * @param {Vue} [vm] - if vm is present, indicates this is
	 *                     an instantiation merge.
	 */

	exports.mergeOptions = function merge (parent, child, vm) {
	  guardComponents(child)
	  guardProps(child)
	  var options = {}
	  var key
	  if (child.mixins) {
	    for (var i = 0, l = child.mixins.length; i < l; i++) {
	      parent = merge(parent, child.mixins[i], vm)
	    }
	  }
	  for (key in parent) {
	    mergeField(key)
	  }
	  for (key in child) {
	    if (!(parent.hasOwnProperty(key))) {
	      mergeField(key)
	    }
	  }
	  function mergeField (key) {
	    var strat = strats[key] || defaultStrat
	    options[key] = strat(parent[key], child[key], vm, key)
	  }
	  return options
	}

	/**
	 * Resolve an asset.
	 * This function is used because child instances need access
	 * to assets defined in its ancestor chain.
	 *
	 * @param {Object} options
	 * @param {String} type
	 * @param {String} id
	 * @return {Object|Function}
	 */

	exports.resolveAsset = function resolve (options, type, id) {
	  var camelizedId = _.camelize(id)
	  var pascalizedId = camelizedId.charAt(0).toUpperCase() + camelizedId.slice(1)
	  var assets = options[type]
	  var asset = assets[id] || assets[camelizedId] || assets[pascalizedId]
	  while (
	    !asset &&
	    options._parent &&
	    (!config.strict || options._repeat)
	  ) {
	    options = (options._context || options._parent).$options
	    assets = options[type]
	    asset = assets[id] || assets[camelizedId] || assets[pascalizedId]
	  }
	  return asset
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(12)))

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var _ = __webpack_require__(8)

	/**
	 * Check if an element is a component, if yes return its
	 * component id.
	 *
	 * @param {Element} el
	 * @param {Object} options
	 * @return {String|undefined}
	 */

	exports.commonTagRE = /^(div|p|span|img|a|br|ul|ol|li|h1|h2|h3|h4|h5|code|pre)$/
	exports.checkComponent = function (el, options) {
	  var tag = el.tagName.toLowerCase()
	  if (tag === 'component') {
	    // dynamic syntax
	    var exp = el.getAttribute('is')
	    el.removeAttribute('is')
	    return exp
	  } else if (
	    !exports.commonTagRE.test(tag) &&
	    _.resolveAsset(options, 'components', tag)
	  ) {
	    return tag
	  /* eslint-disable no-cond-assign */
	  } else if (tag = _.attr(el, 'component')) {
	  /* eslint-enable no-cond-assign */
	    return tag
	  }
	}

	/**
	 * Set a prop's initial value on a vm and its data object.
	 * The vm may have inherit:true so we need to make sure
	 * we don't accidentally overwrite parent value.
	 *
	 * @param {Vue} vm
	 * @param {Object} prop
	 * @param {*} value
	 */

	exports.initProp = function (vm, prop, value) {
	  if (exports.assertProp(prop, value)) {
	    var key = prop.path
	    if (key in vm) {
	      _.define(vm, key, value, true)
	    } else {
	      vm[key] = value
	    }
	    vm._data[key] = value
	  }
	}

	/**
	 * Assert whether a prop is valid.
	 *
	 * @param {Object} prop
	 * @param {*} value
	 */

	exports.assertProp = function (prop, value) {
	  // if a prop is not provided and is not required,
	  // skip the check.
	  if (prop.raw === null && !prop.required) {
	    return true
	  }
	  var options = prop.options
	  var type = options.type
	  var valid = true
	  var expectedType
	  if (type) {
	    if (type === String) {
	      expectedType = 'string'
	      valid = typeof value === expectedType
	    } else if (type === Number) {
	      expectedType = 'number'
	      valid = typeof value === 'number'
	    } else if (type === Boolean) {
	      expectedType = 'boolean'
	      valid = typeof value === 'boolean'
	    } else if (type === Function) {
	      expectedType = 'function'
	      valid = typeof value === 'function'
	    } else if (type === Object) {
	      expectedType = 'object'
	      valid = _.isPlainObject(value)
	    } else if (type === Array) {
	      expectedType = 'array'
	      valid = _.isArray(value)
	    } else {
	      valid = value instanceof type
	    }
	  }
	  if (!valid) {
	    process.env.NODE_ENV !== 'production' && _.warn(
	      'Invalid prop: type check failed for ' +
	      prop.path + '="' + prop.raw + '".' +
	      ' Expected ' + formatType(expectedType) +
	      ', got ' + formatValue(value) + '.'
	    )
	    return false
	  }
	  var validator = options.validator
	  if (validator) {
	    if (!validator.call(null, value)) {
	      process.env.NODE_ENV !== 'production' && _.warn(
	        'Invalid prop: custom validator check failed for ' +
	        prop.path + '="' + prop.raw + '"'
	      )
	      return false
	    }
	  }
	  return true
	}

	function formatType (val) {
	  return val
	    ? val.charAt(0).toUpperCase() + val.slice(1)
	    : 'custom type'
	}

	function formatValue (val) {
	  return Object.prototype.toString.call(val).slice(8, -1)
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(12)))

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Enable debug utilities.
	 */

	if (process.env.NODE_ENV !== 'production') {

	  var config = __webpack_require__(13)
	  var hasConsole = typeof console !== 'undefined'

	  /**
	   * Log a message.
	   *
	   * @param {String} msg
	   */

	  exports.log = function (msg) {
	    if (hasConsole && config.debug) {
	      console.log('[Vue info]: ' + msg)
	    }
	  }

	  /**
	   * We've got a problem here.
	   *
	   * @param {String} msg
	   */

	  exports.warn = function (msg, e) {
	    if (hasConsole && (!config.silent || config.debug)) {
	      console.warn('[Vue warn]: ' + msg)
	      /* istanbul ignore if */
	      if (config.debug) {
	        console.warn((e || new Error('Warning Stack Trace')).stack)
	      }
	    }
	  }

	  /**
	   * Assert asset exists
	   */

	  exports.assertAsset = function (val, type, id) {
	    /* istanbul ignore if */
	    if (type === 'directive') {
	      if (id === 'with') {
	        exports.warn(
	          'v-with has been deprecated in ^0.12.0. ' +
	          'Use props instead.'
	        )
	        return
	      }
	      if (id === 'events') {
	        exports.warn(
	          'v-events has been deprecated in ^0.12.0. ' +
	          'Pass down methods as callback props instead.'
	        )
	        return
	      }
	    }
	    if (!val) {
	      exports.warn('Failed to resolve ' + type + ': ' + id)
	    }
	  }
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(12)))

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(8)
	var config = __webpack_require__(13)

	/**
	 * Expose useful internals
	 */

	exports.util = _
	exports.config = config
	exports.nextTick = _.nextTick
	exports.compiler = __webpack_require__(18)

	exports.parsers = {
	  path: __webpack_require__(28),
	  text: __webpack_require__(21),
	  template: __webpack_require__(30),
	  directive: __webpack_require__(23),
	  expression: __webpack_require__(27)
	}

	/**
	 * Each instance constructor, including Vue, has a unique
	 * cid. This enables us to create wrapped "child
	 * constructors" for prototypal inheritance and cache them.
	 */

	exports.cid = 0
	var cid = 1

	/**
	 * Class inheritance
	 *
	 * @param {Object} extendOptions
	 */

	exports.extend = function (extendOptions) {
	  extendOptions = extendOptions || {}
	  var Super = this
	  var Sub = createClass(
	    extendOptions.name ||
	    Super.options.name ||
	    'VueComponent'
	  )
	  Sub.prototype = Object.create(Super.prototype)
	  Sub.prototype.constructor = Sub
	  Sub.cid = cid++
	  Sub.options = _.mergeOptions(
	    Super.options,
	    extendOptions
	  )
	  Sub['super'] = Super
	  // allow further extension
	  Sub.extend = Super.extend
	  // create asset registers, so extended classes
	  // can have their private assets too.
	  config._assetTypes.forEach(function (type) {
	    Sub[type] = Super[type]
	  })
	  return Sub
	}

	/**
	 * A function that returns a sub-class constructor with the
	 * given name. This gives us much nicer output when
	 * logging instances in the console.
	 *
	 * @param {String} name
	 * @return {Function}
	 */

	function createClass (name) {
	  return new Function(
	    'return function ' + _.classify(name) +
	    ' (options) { this._init(options) }'
	  )()
	}

	/**
	 * Plugin system
	 *
	 * @param {Object} plugin
	 */

	exports.use = function (plugin) {
	  // additional parameters
	  var args = _.toArray(arguments, 1)
	  args.unshift(this)
	  if (typeof plugin.install === 'function') {
	    plugin.install.apply(plugin, args)
	  } else {
	    plugin.apply(null, args)
	  }
	  return this
	}

	/**
	 * Create asset registration methods with the following
	 * signature:
	 *
	 * @param {String} id
	 * @param {*} definition
	 */

	config._assetTypes.forEach(function (type) {
	  exports[type] = function (id, definition) {
	    if (!definition) {
	      return this.options[type + 's'][id]
	    } else {
	      if (
	        type === 'component' &&
	        _.isPlainObject(definition)
	      ) {
	        definition.name = id
	        definition = _.Vue.extend(definition)
	      }
	      this.options[type + 's'][id] = definition
	    }
	  }
	})


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(8)

	_.extend(exports, __webpack_require__(19))
	_.extend(exports, __webpack_require__(32))


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var _ = __webpack_require__(8)
	var compileProps = __webpack_require__(20)
	var config = __webpack_require__(13)
	var textParser = __webpack_require__(21)
	var dirParser = __webpack_require__(23)
	var templateParser = __webpack_require__(30)
	var resolveAsset = _.resolveAsset
	var componentDef = __webpack_require__(31)

	// terminal directives
	var terminalDirectives = [
	  'repeat',
	  'if'
	]

	/**
	 * Compile a template and return a reusable composite link
	 * function, which recursively contains more link functions
	 * inside. This top level compile function would normally
	 * be called on instance root nodes, but can also be used
	 * for partial compilation if the partial argument is true.
	 *
	 * The returned composite link function, when called, will
	 * return an unlink function that tearsdown all directives
	 * created during the linking phase.
	 *
	 * @param {Element|DocumentFragment} el
	 * @param {Object} options
	 * @param {Boolean} partial
	 * @return {Function}
	 */

	exports.compile = function (el, options, partial) {
	  // link function for the node itself.
	  var nodeLinkFn = partial || !options._asComponent
	    ? compileNode(el, options)
	    : null
	  // link function for the childNodes
	  var childLinkFn =
	    !(nodeLinkFn && nodeLinkFn.terminal) &&
	    el.tagName !== 'SCRIPT' &&
	    el.hasChildNodes()
	      ? compileNodeList(el.childNodes, options)
	      : null

	  /**
	   * A composite linker function to be called on a already
	   * compiled piece of DOM, which instantiates all directive
	   * instances.
	   *
	   * @param {Vue} vm
	   * @param {Element|DocumentFragment} el
	   * @param {Vue} [host] - host vm of transcluded content
	   * @return {Function|undefined}
	   */

	  return function compositeLinkFn (vm, el, host) {
	    // cache childNodes before linking parent, fix #657
	    var childNodes = _.toArray(el.childNodes)
	    // link
	    var dirs = linkAndCapture(function () {
	      if (nodeLinkFn) nodeLinkFn(vm, el, host)
	      if (childLinkFn) childLinkFn(vm, childNodes, host)
	    }, vm)
	    return makeUnlinkFn(vm, dirs)
	  }
	}

	/**
	 * Apply a linker to a vm/element pair and capture the
	 * directives created during the process.
	 *
	 * @param {Function} linker
	 * @param {Vue} vm
	 */

	function linkAndCapture (linker, vm) {
	  var originalDirCount = vm._directives.length
	  linker()
	  return vm._directives.slice(originalDirCount)
	}

	/**
	 * Linker functions return an unlink function that
	 * tearsdown all directives instances generated during
	 * the process.
	 *
	 * We create unlink functions with only the necessary
	 * information to avoid retaining additional closures.
	 *
	 * @param {Vue} vm
	 * @param {Array} dirs
	 * @param {Vue} [context]
	 * @param {Array} [contextDirs]
	 * @return {Function}
	 */

	function makeUnlinkFn (vm, dirs, context, contextDirs) {
	  return function unlink (destroying) {
	    teardownDirs(vm, dirs, destroying)
	    if (context && contextDirs) {
	      teardownDirs(context, contextDirs)
	    }
	  }
	}

	/**
	 * Teardown partial linked directives.
	 *
	 * @param {Vue} vm
	 * @param {Array} dirs
	 * @param {Boolean} destroying
	 */

	function teardownDirs (vm, dirs, destroying) {
	  var i = dirs.length
	  while (i--) {
	    dirs[i]._teardown()
	    if (!destroying) {
	      vm._directives.$remove(dirs[i])
	    }
	  }
	}

	/**
	 * Compile link props on an instance.
	 *
	 * @param {Vue} vm
	 * @param {Element} el
	 * @param {Object} options
	 * @return {Function}
	 */

	exports.compileAndLinkProps = function (vm, el, props) {
	  var propsLinkFn = compileProps(el, props)
	  var propDirs = linkAndCapture(function () {
	    propsLinkFn(vm, null)
	  }, vm)
	  return makeUnlinkFn(vm, propDirs)
	}

	/**
	 * Compile the root element of an instance.
	 *
	 * 1. attrs on context container (context scope)
	 * 2. attrs on the component template root node, if
	 *    replace:true (child scope)
	 *
	 * If this is a fragment instance, we only need to compile 1.
	 *
	 * @param {Vue} vm
	 * @param {Element} el
	 * @param {Object} options
	 * @return {Function}
	 */

	exports.compileRoot = function (el, options) {
	  var containerAttrs = options._containerAttrs
	  var replacerAttrs = options._replacerAttrs
	  var contextLinkFn, replacerLinkFn

	  // only need to compile other attributes for
	  // non-fragment instances
	  if (el.nodeType !== 11) {
	    // for components, container and replacer need to be
	    // compiled separately and linked in different scopes.
	    if (options._asComponent) {
	      // 2. container attributes
	      if (containerAttrs) {
	        contextLinkFn = compileDirectives(containerAttrs, options)
	      }
	      if (replacerAttrs) {
	        // 3. replacer attributes
	        replacerLinkFn = compileDirectives(replacerAttrs, options)
	      }
	    } else {
	      // non-component, just compile as a normal element.
	      replacerLinkFn = compileDirectives(el.attributes, options)
	    }
	  }

	  return function rootLinkFn (vm, el) {
	    // link context scope dirs
	    var context = vm._context
	    var contextDirs
	    if (context && contextLinkFn) {
	      contextDirs = linkAndCapture(function () {
	        contextLinkFn(context, el)
	      }, context)
	    }

	    // link self
	    var selfDirs = linkAndCapture(function () {
	      if (replacerLinkFn) replacerLinkFn(vm, el)
	    }, vm)

	    // return the unlink function that tearsdown context
	    // container directives.
	    return makeUnlinkFn(vm, selfDirs, context, contextDirs)
	  }
	}

	/**
	 * Compile a node and return a nodeLinkFn based on the
	 * node type.
	 *
	 * @param {Node} node
	 * @param {Object} options
	 * @return {Function|null}
	 */

	function compileNode (node, options) {
	  var type = node.nodeType
	  if (type === 1 && node.tagName !== 'SCRIPT') {
	    return compileElement(node, options)
	  } else if (type === 3 && config.interpolate && node.data.trim()) {
	    return compileTextNode(node, options)
	  } else {
	    return null
	  }
	}

	/**
	 * Compile an element and return a nodeLinkFn.
	 *
	 * @param {Element} el
	 * @param {Object} options
	 * @return {Function|null}
	 */

	function compileElement (el, options) {
	  // preprocess textareas.
	  // textarea treats its text content as the initial value.
	  // just bind it as a v-attr directive for value.
	  if (el.tagName === 'TEXTAREA') {
	    if (textParser.parse(el.value)) {
	      el.setAttribute('value', el.value)
	    }
	  }
	  var linkFn
	  var hasAttrs = el.hasAttributes()
	  // check terminal directives (repeat & if)
	  if (hasAttrs) {
	    linkFn = checkTerminalDirectives(el, options)
	  }
	  // check element directives
	  if (!linkFn) {
	    linkFn = checkElementDirectives(el, options)
	  }
	  // check component
	  if (!linkFn) {
	    linkFn = checkComponent(el, options)
	  }
	  // normal directives
	  if (!linkFn && hasAttrs) {
	    linkFn = compileDirectives(el.attributes, options)
	  }
	  return linkFn
	}

	/**
	 * Compile a textNode and return a nodeLinkFn.
	 *
	 * @param {TextNode} node
	 * @param {Object} options
	 * @return {Function|null} textNodeLinkFn
	 */

	function compileTextNode (node, options) {
	  var tokens = textParser.parse(node.data)
	  if (!tokens) {
	    return null
	  }
	  var frag = document.createDocumentFragment()
	  var el, token
	  for (var i = 0, l = tokens.length; i < l; i++) {
	    token = tokens[i]
	    el = token.tag
	      ? processTextToken(token, options)
	      : document.createTextNode(token.value)
	    frag.appendChild(el)
	  }
	  return makeTextNodeLinkFn(tokens, frag, options)
	}

	/**
	 * Process a single text token.
	 *
	 * @param {Object} token
	 * @param {Object} options
	 * @return {Node}
	 */

	function processTextToken (token, options) {
	  var el
	  if (token.oneTime) {
	    el = document.createTextNode(token.value)
	  } else {
	    if (token.html) {
	      el = document.createComment('v-html')
	      setTokenType('html')
	    } else {
	      // IE will clean up empty textNodes during
	      // frag.cloneNode(true), so we have to give it
	      // something here...
	      el = document.createTextNode(' ')
	      setTokenType('text')
	    }
	  }
	  function setTokenType (type) {
	    token.type = type
	    token.def = resolveAsset(options, 'directives', type)
	    token.descriptor = dirParser.parse(token.value)[0]
	  }
	  return el
	}

	/**
	 * Build a function that processes a textNode.
	 *
	 * @param {Array<Object>} tokens
	 * @param {DocumentFragment} frag
	 */

	function makeTextNodeLinkFn (tokens, frag) {
	  return function textNodeLinkFn (vm, el) {
	    var fragClone = frag.cloneNode(true)
	    var childNodes = _.toArray(fragClone.childNodes)
	    var token, value, node
	    for (var i = 0, l = tokens.length; i < l; i++) {
	      token = tokens[i]
	      value = token.value
	      if (token.tag) {
	        node = childNodes[i]
	        if (token.oneTime) {
	          value = vm.$eval(value)
	          if (token.html) {
	            _.replace(node, templateParser.parse(value, true))
	          } else {
	            node.data = value
	          }
	        } else {
	          vm._bindDir(token.type, node,
	                      token.descriptor, token.def)
	        }
	      }
	    }
	    _.replace(el, fragClone)
	  }
	}

	/**
	 * Compile a node list and return a childLinkFn.
	 *
	 * @param {NodeList} nodeList
	 * @param {Object} options
	 * @return {Function|undefined}
	 */

	function compileNodeList (nodeList, options) {
	  var linkFns = []
	  var nodeLinkFn, childLinkFn, node
	  for (var i = 0, l = nodeList.length; i < l; i++) {
	    node = nodeList[i]
	    nodeLinkFn = compileNode(node, options)
	    childLinkFn =
	      !(nodeLinkFn && nodeLinkFn.terminal) &&
	      node.tagName !== 'SCRIPT' &&
	      node.hasChildNodes()
	        ? compileNodeList(node.childNodes, options)
	        : null
	    linkFns.push(nodeLinkFn, childLinkFn)
	  }
	  return linkFns.length
	    ? makeChildLinkFn(linkFns)
	    : null
	}

	/**
	 * Make a child link function for a node's childNodes.
	 *
	 * @param {Array<Function>} linkFns
	 * @return {Function} childLinkFn
	 */

	function makeChildLinkFn (linkFns) {
	  return function childLinkFn (vm, nodes, host) {
	    var node, nodeLinkFn, childrenLinkFn
	    for (var i = 0, n = 0, l = linkFns.length; i < l; n++) {
	      node = nodes[n]
	      nodeLinkFn = linkFns[i++]
	      childrenLinkFn = linkFns[i++]
	      // cache childNodes before linking parent, fix #657
	      var childNodes = _.toArray(node.childNodes)
	      if (nodeLinkFn) {
	        nodeLinkFn(vm, node, host)
	      }
	      if (childrenLinkFn) {
	        childrenLinkFn(vm, childNodes, host)
	      }
	    }
	  }
	}

	/**
	 * Check for element directives (custom elements that should
	 * be resovled as terminal directives).
	 *
	 * @param {Element} el
	 * @param {Object} options
	 */

	function checkElementDirectives (el, options) {
	  var tag = el.tagName.toLowerCase()
	  if (_.commonTagRE.test(tag)) return
	  var def = resolveAsset(options, 'elementDirectives', tag)
	  if (def) {
	    return makeTerminalNodeLinkFn(el, tag, '', options, def)
	  }
	}

	/**
	 * Check if an element is a component. If yes, return
	 * a component link function.
	 *
	 * @param {Element} el
	 * @param {Object} options
	 * @param {Boolean} hasAttrs
	 * @return {Function|undefined}
	 */

	function checkComponent (el, options, hasAttrs) {
	  var componentId = _.checkComponent(el, options, hasAttrs)
	  if (componentId) {
	    var componentLinkFn = function (vm, el, host) {
	      vm._bindDir('component', el, {
	        expression: componentId
	      }, componentDef, host)
	    }
	    componentLinkFn.terminal = true
	    return componentLinkFn
	  }
	}

	/**
	 * Check an element for terminal directives in fixed order.
	 * If it finds one, return a terminal link function.
	 *
	 * @param {Element} el
	 * @param {Object} options
	 * @return {Function} terminalLinkFn
	 */

	function checkTerminalDirectives (el, options) {
	  if (_.attr(el, 'pre') !== null) {
	    return skip
	  }
	  var value, dirName
	  for (var i = 0, l = terminalDirectives.length; i < l; i++) {
	    dirName = terminalDirectives[i]
	    if ((value = _.attr(el, dirName)) !== null) {
	      return makeTerminalNodeLinkFn(el, dirName, value, options)
	    }
	  }
	}

	function skip () {}
	skip.terminal = true

	/**
	 * Build a node link function for a terminal directive.
	 * A terminal link function terminates the current
	 * compilation recursion and handles compilation of the
	 * subtree in the directive.
	 *
	 * @param {Element} el
	 * @param {String} dirName
	 * @param {String} value
	 * @param {Object} options
	 * @param {Object} [def]
	 * @return {Function} terminalLinkFn
	 */

	function makeTerminalNodeLinkFn (el, dirName, value, options, def) {
	  var descriptor = dirParser.parse(value)[0]
	  // no need to call resolveAsset since terminal directives
	  // are always internal
	  def = def || options.directives[dirName]
	  var fn = function terminalNodeLinkFn (vm, el, host) {
	    vm._bindDir(dirName, el, descriptor, def, host)
	  }
	  fn.terminal = true
	  return fn
	}

	/**
	 * Compile the directives on an element and return a linker.
	 *
	 * @param {Array|NamedNodeMap} attrs
	 * @param {Object} options
	 * @return {Function}
	 */

	function compileDirectives (attrs, options) {
	  var i = attrs.length
	  var dirs = []
	  var attr, name, value, dir, dirName, dirDef
	  while (i--) {
	    attr = attrs[i]
	    name = attr.name
	    value = attr.value
	    if (name.indexOf(config.prefix) === 0) {
	      dirName = name.slice(config.prefix.length)
	      dirDef = resolveAsset(options, 'directives', dirName)
	      if (process.env.NODE_ENV !== 'production') {
	        _.assertAsset(dirDef, 'directive', dirName)
	      }
	      if (dirDef) {
	        dirs.push({
	          name: dirName,
	          descriptors: dirParser.parse(value),
	          def: dirDef
	        })
	      }
	    } else if (config.interpolate) {
	      dir = collectAttrDirective(name, value, options)
	      if (dir) {
	        dirs.push(dir)
	      }
	    }
	  }
	  // sort by priority, LOW to HIGH
	  if (dirs.length) {
	    dirs.sort(directiveComparator)
	    return makeNodeLinkFn(dirs)
	  }
	}

	/**
	 * Build a link function for all directives on a single node.
	 *
	 * @param {Array} directives
	 * @return {Function} directivesLinkFn
	 */

	function makeNodeLinkFn (directives) {
	  return function nodeLinkFn (vm, el, host) {
	    // reverse apply because it's sorted low to high
	    var i = directives.length
	    var dir, j, k
	    while (i--) {
	      dir = directives[i]
	      if (dir._link) {
	        // custom link fn
	        dir._link(vm, el)
	      } else {
	        k = dir.descriptors.length
	        for (j = 0; j < k; j++) {
	          vm._bindDir(dir.name, el,
	            dir.descriptors[j], dir.def, host)
	        }
	      }
	    }
	  }
	}

	/**
	 * Check an attribute for potential dynamic bindings,
	 * and return a directive object.
	 *
	 * Special case: class interpolations are translated into
	 * v-class instead v-attr, so that it can work with user
	 * provided v-class bindings.
	 *
	 * @param {String} name
	 * @param {String} value
	 * @param {Object} options
	 * @return {Object}
	 */

	function collectAttrDirective (name, value, options) {
	  var tokens = textParser.parse(value)
	  var isClass = name === 'class'
	  if (tokens) {
	    var dirName = isClass ? 'class' : 'attr'
	    var def = options.directives[dirName]
	    var i = tokens.length
	    var allOneTime = true
	    while (i--) {
	      var token = tokens[i]
	      if (token.tag && !token.oneTime) {
	        allOneTime = false
	      }
	    }
	    return {
	      def: def,
	      _link: allOneTime
	        ? function (vm, el) {
	            el.setAttribute(name, vm.$interpolate(value))
	          }
	        : function (vm, el) {
	            var exp = textParser.tokensToExp(tokens, vm)
	            var desc = isClass
	              ? dirParser.parse(exp)[0]
	              : dirParser.parse(name + ':' + exp)[0]
	            if (isClass) {
	              desc._rawClass = value
	            }
	            vm._bindDir(dirName, el, desc, def)
	          }
	    }
	  }
	}

	/**
	 * Directive priority sort comparator
	 *
	 * @param {Object} a
	 * @param {Object} b
	 */

	function directiveComparator (a, b) {
	  a = a.def.priority || 0
	  b = b.def.priority || 0
	  return a > b ? 1 : -1
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(12)))

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var _ = __webpack_require__(8)
	var textParser = __webpack_require__(21)
	var propDef = __webpack_require__(24)
	var propBindingModes = __webpack_require__(13)._propBindingModes

	// regexes
	var identRE = __webpack_require__(28).identRE
	var dataAttrRE = /^data-/
	var settablePathRE = /^[A-Za-z_$][\w$]*(\.[A-Za-z_$][\w$]*|\[[^\[\]]+\])*$/
	var literalValueRE = /^(true|false)$|^\d.*/

	/**
	 * Compile param attributes on a root element and return
	 * a props link function.
	 *
	 * @param {Element|DocumentFragment} el
	 * @param {Array} propOptions
	 * @return {Function} propsLinkFn
	 */

	module.exports = function compileProps (el, propOptions) {
	  var props = []
	  var i = propOptions.length
	  var options, name, attr, value, path, prop, literal, single
	  while (i--) {
	    options = propOptions[i]
	    name = options.name
	    // props could contain dashes, which will be
	    // interpreted as minus calculations by the parser
	    // so we need to camelize the path here
	    path = _.camelize(name.replace(dataAttrRE, ''))
	    if (!identRE.test(path)) {
	      process.env.NODE_ENV !== 'production' && _.warn(
	        'Invalid prop key: "' + name + '". Prop keys ' +
	        'must be valid identifiers.'
	      )
	      continue
	    }
	    attr = _.hyphenate(name)
	    value = el.getAttribute(attr)
	    if (value === null) {
	      attr = 'data-' + attr
	      value = el.getAttribute(attr)
	    }
	    // create a prop descriptor
	    prop = {
	      name: name,
	      raw: value,
	      path: path,
	      options: options,
	      mode: propBindingModes.ONE_WAY
	    }
	    if (value !== null) {
	      // important so that this doesn't get compiled
	      // again as a normal attribute binding
	      el.removeAttribute(attr)
	      var tokens = textParser.parse(value)
	      if (tokens) {
	        prop.dynamic = true
	        prop.parentPath = textParser.tokensToExp(tokens)
	        // check prop binding type.
	        single = tokens.length === 1
	        literal = literalValueRE.test(prop.parentPath)
	        // one time: {{* prop}}
	        if (literal || (single && tokens[0].oneTime)) {
	          prop.mode = propBindingModes.ONE_TIME
	        } else if (
	          !literal &&
	          (single && tokens[0].twoWay)
	        ) {
	          if (settablePathRE.test(prop.parentPath)) {
	            prop.mode = propBindingModes.TWO_WAY
	          } else {
	            process.env.NODE_ENV !== 'production' && _.warn(
	              'Cannot bind two-way prop with non-settable ' +
	              'parent path: ' + prop.parentPath
	            )
	          }
	        }
	        if (
	          process.env.NODE_ENV !== 'production' &&
	          options.twoWay &&
	          prop.mode !== propBindingModes.TWO_WAY
	        ) {
	          _.warn(
	            'Prop "' + name + '" expects a two-way binding type.'
	          )
	        }
	      }
	    } else if (options && options.required) {
	      process.env.NODE_ENV !== 'production' && _.warn(
	        'Missing required prop: ' + name
	      )
	    }
	    props.push(prop)
	  }
	  return makePropsLinkFn(props)
	}

	/**
	 * Build a function that applies props to a vm.
	 *
	 * @param {Array} props
	 * @return {Function} propsLinkFn
	 */

	function makePropsLinkFn (props) {
	  return function propsLinkFn (vm, el) {
	    // store resolved props info
	    vm._props = {}
	    var i = props.length
	    var prop, path, options, value
	    while (i--) {
	      prop = props[i]
	      path = prop.path
	      vm._props[path] = prop
	      options = prop.options
	      if (prop.raw === null) {
	        // initialize absent prop
	        _.initProp(vm, prop, getDefault(options))
	      } else if (prop.dynamic) {
	        // dynamic prop
	        if (vm._context) {
	          if (prop.mode === propBindingModes.ONE_TIME) {
	            // one time binding
	            value = vm._context.$get(prop.parentPath)
	            _.initProp(vm, prop, value)
	          } else {
	            // dynamic binding
	            vm._bindDir('prop', el, prop, propDef)
	          }
	        } else {
	          process.env.NODE_ENV !== 'production' && _.warn(
	            'Cannot bind dynamic prop on a root instance' +
	            ' with no parent: ' + prop.name + '="' +
	            prop.raw + '"'
	          )
	        }
	      } else {
	        // literal, cast it and just set once
	        var raw = prop.raw
	        value = options.type === Boolean && raw === ''
	          ? true
	          // do not cast emptry string.
	          // _.toNumber casts empty string to 0.
	          : raw.trim()
	            ? _.toBoolean(_.toNumber(raw))
	            : raw
	        _.initProp(vm, prop, value)
	      }
	    }
	  }
	}

	/**
	 * Get the default value of a prop.
	 *
	 * @param {Object} options
	 * @return {*}
	 */

	function getDefault (options) {
	  // no default, return undefined
	  if (!options.hasOwnProperty('default')) {
	    // absent boolean value defaults to false
	    return options.type === Boolean
	      ? false
	      : undefined
	  }
	  var def = options.default
	  // warn against non-factory defaults for Object & Array
	  if (_.isObject(def)) {
	    process.env.NODE_ENV !== 'production' && _.warn(
	      'Object/Array as default prop values will be shared ' +
	      'across multiple instances. Use a factory function ' +
	      'to return the default value instead.'
	    )
	  }
	  // call factory function for non-Function types
	  return typeof def === 'function' && options.type !== Function
	    ? def()
	    : def
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(12)))

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var Cache = __webpack_require__(22)
	var config = __webpack_require__(13)
	var dirParser = __webpack_require__(23)
	var regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g
	var cache, tagRE, htmlRE, firstChar, lastChar

	/**
	 * Escape a string so it can be used in a RegExp
	 * constructor.
	 *
	 * @param {String} str
	 */

	function escapeRegex (str) {
	  return str.replace(regexEscapeRE, '\\$&')
	}

	/**
	 * Compile the interpolation tag regex.
	 *
	 * @return {RegExp}
	 */

	function compileRegex () {
	  config._delimitersChanged = false
	  var open = config.delimiters[0]
	  var close = config.delimiters[1]
	  firstChar = open.charAt(0)
	  lastChar = close.charAt(close.length - 1)
	  var firstCharRE = escapeRegex(firstChar)
	  var lastCharRE = escapeRegex(lastChar)
	  var openRE = escapeRegex(open)
	  var closeRE = escapeRegex(close)
	  tagRE = new RegExp(
	    firstCharRE + '?' + openRE +
	    '(.+?)' +
	    closeRE + lastCharRE + '?',
	    'g'
	  )
	  htmlRE = new RegExp(
	    '^' + firstCharRE + openRE +
	    '.*' +
	    closeRE + lastCharRE + '$'
	  )
	  // reset cache
	  cache = new Cache(1000)
	}

	/**
	 * Parse a template text string into an array of tokens.
	 *
	 * @param {String} text
	 * @return {Array<Object> | null}
	 *               - {String} type
	 *               - {String} value
	 *               - {Boolean} [html]
	 *               - {Boolean} [oneTime]
	 */

	exports.parse = function (text) {
	  if (config._delimitersChanged) {
	    compileRegex()
	  }
	  var hit = cache.get(text)
	  if (hit) {
	    return hit
	  }
	  text = text.replace(/\n/g, '')
	  if (!tagRE.test(text)) {
	    return null
	  }
	  var tokens = []
	  var lastIndex = tagRE.lastIndex = 0
	  var match, index, value, first, oneTime, twoWay
	  /* eslint-disable no-cond-assign */
	  while (match = tagRE.exec(text)) {
	  /* eslint-enable no-cond-assign */
	    index = match.index
	    // push text token
	    if (index > lastIndex) {
	      tokens.push({
	        value: text.slice(lastIndex, index)
	      })
	    }
	    // tag token
	    first = match[1].charCodeAt(0)
	    oneTime = first === 42 // *
	    twoWay = first === 64  // @
	    value = oneTime || twoWay
	      ? match[1].slice(1)
	      : match[1]
	    tokens.push({
	      tag: true,
	      value: value.trim(),
	      html: htmlRE.test(match[0]),
	      oneTime: oneTime,
	      twoWay: twoWay
	    })
	    lastIndex = index + match[0].length
	  }
	  if (lastIndex < text.length) {
	    tokens.push({
	      value: text.slice(lastIndex)
	    })
	  }
	  cache.put(text, tokens)
	  return tokens
	}

	/**
	 * Format a list of tokens into an expression.
	 * e.g. tokens parsed from 'a {{b}} c' can be serialized
	 * into one single expression as '"a " + b + " c"'.
	 *
	 * @param {Array} tokens
	 * @param {Vue} [vm]
	 * @return {String}
	 */

	exports.tokensToExp = function (tokens, vm) {
	  return tokens.length > 1
	    ? tokens.map(function (token) {
	        return formatToken(token, vm)
	      }).join('+')
	    : formatToken(tokens[0], vm, true)
	}

	/**
	 * Format a single token.
	 *
	 * @param {Object} token
	 * @param {Vue} [vm]
	 * @param {Boolean} single
	 * @return {String}
	 */

	function formatToken (token, vm, single) {
	  return token.tag
	    ? vm && token.oneTime
	      ? '"' + vm.$eval(token.value) + '"'
	      : inlineFilters(token.value, single)
	    : '"' + token.value + '"'
	}

	/**
	 * For an attribute with multiple interpolation tags,
	 * e.g. attr="some-{{thing | filter}}", in order to combine
	 * the whole thing into a single watchable expression, we
	 * have to inline those filters. This function does exactly
	 * that. This is a bit hacky but it avoids heavy changes
	 * to directive parser and watcher mechanism.
	 *
	 * @param {String} exp
	 * @param {Boolean} single
	 * @return {String}
	 */

	var filterRE = /[^|]\|[^|]/
	function inlineFilters (exp, single) {
	  if (!filterRE.test(exp)) {
	    return single
	      ? exp
	      : '(' + exp + ')'
	  } else {
	    var dir = dirParser.parse(exp)[0]
	    if (!dir.filters) {
	      return '(' + exp + ')'
	    } else {
	      return 'this._applyFilters(' +
	        dir.expression + // value
	        ',null,' +       // oldValue (null for read)
	        JSON.stringify(dir.filters) + // filter descriptors
	        ',false)'        // write?
	    }
	  }
	}


/***/ },
/* 22 */
/***/ function(module, exports) {

	/**
	 * A doubly linked list-based Least Recently Used (LRU)
	 * cache. Will keep most recently used items while
	 * discarding least recently used items when its limit is
	 * reached. This is a bare-bone version of
	 * Rasmus Andersson's js-lru:
	 *
	 *   https://github.com/rsms/js-lru
	 *
	 * @param {Number} limit
	 * @constructor
	 */

	function Cache (limit) {
	  this.size = 0
	  this.limit = limit
	  this.head = this.tail = undefined
	  this._keymap = Object.create(null)
	}

	var p = Cache.prototype

	/**
	 * Put <value> into the cache associated with <key>.
	 * Returns the entry which was removed to make room for
	 * the new entry. Otherwise undefined is returned.
	 * (i.e. if there was enough room already).
	 *
	 * @param {String} key
	 * @param {*} value
	 * @return {Entry|undefined}
	 */

	p.put = function (key, value) {
	  var entry = {
	    key: key,
	    value: value
	  }
	  this._keymap[key] = entry
	  if (this.tail) {
	    this.tail.newer = entry
	    entry.older = this.tail
	  } else {
	    this.head = entry
	  }
	  this.tail = entry
	  if (this.size === this.limit) {
	    return this.shift()
	  } else {
	    this.size++
	  }
	}

	/**
	 * Purge the least recently used (oldest) entry from the
	 * cache. Returns the removed entry or undefined if the
	 * cache was empty.
	 */

	p.shift = function () {
	  var entry = this.head
	  if (entry) {
	    this.head = this.head.newer
	    this.head.older = undefined
	    entry.newer = entry.older = undefined
	    this._keymap[entry.key] = undefined
	  }
	  return entry
	}

	/**
	 * Get and register recent use of <key>. Returns the value
	 * associated with <key> or undefined if not in cache.
	 *
	 * @param {String} key
	 * @param {Boolean} returnEntry
	 * @return {Entry|*}
	 */

	p.get = function (key, returnEntry) {
	  var entry = this._keymap[key]
	  if (entry === undefined) return
	  if (entry === this.tail) {
	    return returnEntry
	      ? entry
	      : entry.value
	  }
	  // HEAD--------------TAIL
	  //   <.older   .newer>
	  //  <--- add direction --
	  //   A  B  C  <D>  E
	  if (entry.newer) {
	    if (entry === this.head) {
	      this.head = entry.newer
	    }
	    entry.newer.older = entry.older // C <-- E.
	  }
	  if (entry.older) {
	    entry.older.newer = entry.newer // C. --> E
	  }
	  entry.newer = undefined // D --x
	  entry.older = this.tail // D. --> E
	  if (this.tail) {
	    this.tail.newer = entry // E. <-- D
	  }
	  this.tail = entry
	  return returnEntry
	    ? entry
	    : entry.value
	}

	module.exports = Cache


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(8)
	var Cache = __webpack_require__(22)
	var cache = new Cache(1000)
	var argRE = /^[^\{\?]+$|^'[^']*'$|^"[^"]*"$/
	var filterTokenRE = /[^\s'"]+|'[^']*'|"[^"]*"/g
	var reservedArgRE = /^in$|^-?\d+/

	/**
	 * Parser state
	 */

	var str
	var c, i, l
	var inSingle
	var inDouble
	var curly
	var square
	var paren
	var begin
	var argIndex
	var dirs
	var dir
	var lastFilterIndex
	var arg

	/**
	 * Push a directive object into the result Array
	 */

	function pushDir () {
	  dir.raw = str.slice(begin, i).trim()
	  if (dir.expression === undefined) {
	    dir.expression = str.slice(argIndex, i).trim()
	  } else if (lastFilterIndex !== begin) {
	    pushFilter()
	  }
	  if (i === 0 || dir.expression) {
	    dirs.push(dir)
	  }
	}

	/**
	 * Push a filter to the current directive object
	 */

	function pushFilter () {
	  var exp = str.slice(lastFilterIndex, i).trim()
	  var filter
	  if (exp) {
	    filter = {}
	    var tokens = exp.match(filterTokenRE)
	    filter.name = tokens[0]
	    if (tokens.length > 1) {
	      filter.args = tokens.slice(1).map(processFilterArg)
	    }
	  }
	  if (filter) {
	    (dir.filters = dir.filters || []).push(filter)
	  }
	  lastFilterIndex = i + 1
	}

	/**
	 * Check if an argument is dynamic and strip quotes.
	 *
	 * @param {String} arg
	 * @return {Object}
	 */

	function processFilterArg (arg) {
	  var stripped = reservedArgRE.test(arg)
	    ? arg
	    : _.stripQuotes(arg)
	  var dynamic = stripped === false
	  return {
	    value: dynamic ? arg : stripped,
	    dynamic: dynamic
	  }
	}

	/**
	 * Parse a directive string into an Array of AST-like
	 * objects representing directives.
	 *
	 * Example:
	 *
	 * "click: a = a + 1 | uppercase" will yield:
	 * {
	 *   arg: 'click',
	 *   expression: 'a = a + 1',
	 *   filters: [
	 *     { name: 'uppercase', args: null }
	 *   ]
	 * }
	 *
	 * @param {String} str
	 * @return {Array<Object>}
	 */

	exports.parse = function (s) {

	  var hit = cache.get(s)
	  if (hit) {
	    return hit
	  }

	  // reset parser state
	  str = s
	  inSingle = inDouble = false
	  curly = square = paren = begin = argIndex = 0
	  lastFilterIndex = 0
	  dirs = []
	  dir = {}
	  arg = null

	  for (i = 0, l = str.length; i < l; i++) {
	    c = str.charCodeAt(i)
	    if (inSingle) {
	      // check single quote
	      if (c === 0x27) inSingle = !inSingle
	    } else if (inDouble) {
	      // check double quote
	      if (c === 0x22) inDouble = !inDouble
	    } else if (
	      c === 0x2C && // comma
	      !paren && !curly && !square
	    ) {
	      // reached the end of a directive
	      pushDir()
	      // reset & skip the comma
	      dir = {}
	      begin = argIndex = lastFilterIndex = i + 1
	    } else if (
	      c === 0x3A && // colon
	      !dir.expression &&
	      !dir.arg
	    ) {
	      // argument
	      arg = str.slice(begin, i).trim()
	      // test for valid argument here
	      // since we may have caught stuff like first half of
	      // an object literal or a ternary expression.
	      if (argRE.test(arg)) {
	        argIndex = i + 1
	        dir.arg = _.stripQuotes(arg) || arg
	      }
	    } else if (
	      c === 0x7C && // pipe
	      str.charCodeAt(i + 1) !== 0x7C &&
	      str.charCodeAt(i - 1) !== 0x7C
	    ) {
	      if (dir.expression === undefined) {
	        // first filter, end of expression
	        lastFilterIndex = i + 1
	        dir.expression = str.slice(argIndex, i).trim()
	      } else {
	        // already has filter
	        pushFilter()
	      }
	    } else {
	      switch (c) {
	        case 0x22: inDouble = true; break // "
	        case 0x27: inSingle = true; break // '
	        case 0x28: paren++; break         // (
	        case 0x29: paren--; break         // )
	        case 0x5B: square++; break        // [
	        case 0x5D: square--; break        // ]
	        case 0x7B: curly++; break         // {
	        case 0x7D: curly--; break         // }
	      }
	    }
	  }

	  if (i === 0 || begin !== i) {
	    pushDir()
	  }

	  cache.put(s, dirs)
	  return dirs
	}


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	// NOTE: the prop internal directive is compiled and linked
	// during _initScope(), before the created hook is called.
	// The purpose is to make the initial prop values available
	// inside `created` hooks and `data` functions.

	var _ = __webpack_require__(8)
	var Watcher = __webpack_require__(25)
	var bindingModes = __webpack_require__(13)._propBindingModes

	module.exports = {

	  bind: function () {

	    var child = this.vm
	    var parent = child._context
	    // passed in from compiler directly
	    var prop = this._descriptor
	    var childKey = prop.path
	    var parentKey = prop.parentPath

	    this.parentWatcher = new Watcher(
	      parent,
	      parentKey,
	      function (val) {
	        if (_.assertProp(prop, val)) {
	          child[childKey] = val
	        }
	      }, { sync: true }
	    )

	    // set the child initial value.
	    var value = this.parentWatcher.value
	    if (childKey === '$data') {
	      child._data = value
	    } else {
	      _.initProp(child, prop, value)
	    }

	    // setup two-way binding
	    if (prop.mode === bindingModes.TWO_WAY) {
	      // important: defer the child watcher creation until
	      // the created hook (after data observation)
	      var self = this
	      child.$once('hook:created', function () {
	        self.childWatcher = new Watcher(
	          child,
	          childKey,
	          function (val) {
	            parent.$set(parentKey, val)
	          }, { sync: true }
	        )
	      })
	    }
	  },

	  unbind: function () {
	    this.parentWatcher.teardown()
	    if (this.childWatcher) {
	      this.childWatcher.teardown()
	    }
	  }
	}


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var _ = __webpack_require__(8)
	var config = __webpack_require__(13)
	var Dep = __webpack_require__(26)
	var expParser = __webpack_require__(27)
	var batcher = __webpack_require__(29)
	var uid = 0

	/**
	 * A watcher parses an expression, collects dependencies,
	 * and fires callback when the expression value changes.
	 * This is used for both the $watch() api and directives.
	 *
	 * @param {Vue} vm
	 * @param {String} expression
	 * @param {Function} cb
	 * @param {Object} options
	 *                 - {Array} filters
	 *                 - {Boolean} twoWay
	 *                 - {Boolean} deep
	 *                 - {Boolean} user
	 *                 - {Boolean} sync
	 *                 - {Boolean} lazy
	 *                 - {Function} [preProcess]
	 * @constructor
	 */

	function Watcher (vm, expOrFn, cb, options) {
	  // mix in options
	  if (options) {
	    _.extend(this, options)
	  }
	  var isFn = typeof expOrFn === 'function'
	  this.vm = vm
	  vm._watchers.push(this)
	  this.expression = isFn ? expOrFn.toString() : expOrFn
	  this.cb = cb
	  this.id = ++uid // uid for batching
	  this.active = true
	  this.dirty = this.lazy // for lazy watchers
	  this.deps = []
	  this.newDeps = null
	  this.prevError = null // for async error stacks
	  // parse expression for getter/setter
	  if (isFn) {
	    this.getter = expOrFn
	    this.setter = undefined
	  } else {
	    var res = expParser.parse(expOrFn, this.twoWay)
	    this.getter = res.get
	    this.setter = res.set
	  }
	  this.value = this.lazy
	    ? undefined
	    : this.get()
	  // state for avoiding false triggers for deep and Array
	  // watchers during vm._digest()
	  this.queued = this.shallow = false
	}

	/**
	 * Add a dependency to this directive.
	 *
	 * @param {Dep} dep
	 */

	Watcher.prototype.addDep = function (dep) {
	  var newDeps = this.newDeps
	  var old = this.deps
	  if (_.indexOf(newDeps, dep) < 0) {
	    newDeps.push(dep)
	    var i = _.indexOf(old, dep)
	    if (i < 0) {
	      dep.addSub(this)
	    } else {
	      old[i] = null
	    }
	  }
	}

	/**
	 * Evaluate the getter, and re-collect dependencies.
	 */

	Watcher.prototype.get = function () {
	  this.beforeGet()
	  var vm = this.vm
	  var value
	  try {
	    value = this.getter.call(vm, vm)
	  } catch (e) {
	    if (
	      process.env.NODE_ENV !== 'production' &&
	      config.warnExpressionErrors
	    ) {
	      _.warn(
	        'Error when evaluating expression "' +
	        this.expression + '". ' +
	        (config.debug
	          ? '' :
	          'Turn on debug mode to see stack trace.'
	        ), e
	      )
	    }
	  }
	  // "touch" every property so they are all tracked as
	  // dependencies for deep watching
	  if (this.deep) {
	    traverse(value)
	  }
	  if (this.preProcess) {
	    value = this.preProcess(value)
	  }
	  if (this.filters) {
	    value = vm._applyFilters(value, null, this.filters, false)
	  }
	  this.afterGet()
	  return value
	}

	/**
	 * Set the corresponding value with the setter.
	 *
	 * @param {*} value
	 */

	Watcher.prototype.set = function (value) {
	  var vm = this.vm
	  if (this.filters) {
	    value = vm._applyFilters(
	      value, this.value, this.filters, true)
	  }
	  try {
	    this.setter.call(vm, vm, value)
	  } catch (e) {
	    if (
	      process.env.NODE_ENV !== 'production' &&
	      config.warnExpressionErrors
	    ) {
	      _.warn(
	        'Error when evaluating setter "' +
	        this.expression + '"', e
	      )
	    }
	  }
	}

	/**
	 * Prepare for dependency collection.
	 */

	Watcher.prototype.beforeGet = function () {
	  Dep.target = this
	  this.newDeps = []
	}

	/**
	 * Clean up for dependency collection.
	 */

	Watcher.prototype.afterGet = function () {
	  Dep.target = null
	  var i = this.deps.length
	  while (i--) {
	    var dep = this.deps[i]
	    if (dep) {
	      dep.removeSub(this)
	    }
	  }
	  this.deps = this.newDeps
	  this.newDeps = null
	}

	/**
	 * Subscriber interface.
	 * Will be called when a dependency changes.
	 *
	 * @param {Boolean} shallow
	 */

	Watcher.prototype.update = function (shallow) {
	  if (this.lazy) {
	    this.dirty = true
	  } else if (this.sync || !config.async) {
	    this.run()
	  } else {
	    // if queued, only overwrite shallow with non-shallow,
	    // but not the other way around.
	    this.shallow = this.queued
	      ? shallow
	        ? this.shallow
	        : false
	      : !!shallow
	    this.queued = true
	    // record before-push error stack in debug mode
	    /* istanbul ignore if */
	    if (process.env.NODE_ENV !== 'production' && config.debug) {
	      this.prevError = new Error('[vue] async stack trace')
	    }
	    batcher.push(this)
	  }
	}

	/**
	 * Batcher job interface.
	 * Will be called by the batcher.
	 */

	Watcher.prototype.run = function () {
	  if (this.active) {
	    var value = this.get()
	    if (
	      value !== this.value ||
	      // Deep watchers and Array watchers should fire even
	      // when the value is the same, because the value may
	      // have mutated; but only do so if this is a
	      // non-shallow update (caused by a vm digest).
	      ((_.isArray(value) || this.deep) && !this.shallow)
	    ) {
	      // set new value
	      var oldValue = this.value
	      this.value = value
	      // in debug + async mode, when a watcher callbacks
	      // throws, we also throw the saved before-push error
	      // so the full cross-tick stack trace is available.
	      var prevError = this.prevError
	      /* istanbul ignore if */
	      if (process.env.NODE_ENV !== 'production' &&
	          config.debug && prevError) {
	        this.prevError = null
	        try {
	          this.cb.call(this.vm, value, oldValue)
	        } catch (e) {
	          _.nextTick(function () {
	            throw prevError
	          }, 0)
	          throw e
	        }
	      } else {
	        this.cb.call(this.vm, value, oldValue)
	      }
	    }
	    this.queued = this.shallow = false
	  }
	}

	/**
	 * Evaluate the value of the watcher.
	 * This only gets called for lazy watchers.
	 */

	Watcher.prototype.evaluate = function () {
	  // avoid overwriting another watcher that is being
	  // collected.
	  var current = Dep.target
	  this.value = this.get()
	  this.dirty = false
	  Dep.target = current
	}

	/**
	 * Depend on all deps collected by this watcher.
	 */

	Watcher.prototype.depend = function () {
	  var i = this.deps.length
	  while (i--) {
	    this.deps[i].depend()
	  }
	}

	/**
	 * Remove self from all dependencies' subcriber list.
	 */

	Watcher.prototype.teardown = function () {
	  if (this.active) {
	    // remove self from vm's watcher list
	    // we can skip this if the vm if being destroyed
	    // which can improve teardown performance.
	    if (!this.vm._isBeingDestroyed) {
	      this.vm._watchers.$remove(this)
	    }
	    var i = this.deps.length
	    while (i--) {
	      this.deps[i].removeSub(this)
	    }
	    this.active = false
	    this.vm = this.cb = this.value = null
	  }
	}

	/**
	 * Recrusively traverse an object to evoke all converted
	 * getters, so that every nested property inside the object
	 * is collected as a "deep" dependency.
	 *
	 * @param {Object} obj
	 */

	function traverse (obj) {
	  var key, val, i
	  for (key in obj) {
	    val = obj[key]
	    if (_.isArray(val)) {
	      i = val.length
	      while (i--) traverse(val[i])
	    } else if (_.isObject(val)) {
	      traverse(val)
	    }
	  }
	}

	module.exports = Watcher

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(12)))

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(8)

	/**
	 * A dep is an observable that can have multiple
	 * directives subscribing to it.
	 *
	 * @constructor
	 */

	function Dep () {
	  this.subs = []
	}

	// the current target watcher being evaluated.
	// this is globally unique because there could be only one
	// watcher being evaluated at any time.
	Dep.target = null

	/**
	 * Add a directive subscriber.
	 *
	 * @param {Directive} sub
	 */

	Dep.prototype.addSub = function (sub) {
	  this.subs.push(sub)
	}

	/**
	 * Remove a directive subscriber.
	 *
	 * @param {Directive} sub
	 */

	Dep.prototype.removeSub = function (sub) {
	  this.subs.$remove(sub)
	}

	/**
	 * Add self as a dependency to the target watcher.
	 */

	Dep.prototype.depend = function () {
	  Dep.target.addDep(this)
	}

	/**
	 * Notify all subscribers of a new value.
	 */

	Dep.prototype.notify = function () {
	  // stablize the subscriber list first
	  var subs = _.toArray(this.subs)
	  for (var i = 0, l = subs.length; i < l; i++) {
	    subs[i].update()
	  }
	}

	module.exports = Dep


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var _ = __webpack_require__(8)
	var Path = __webpack_require__(28)
	var Cache = __webpack_require__(22)
	var expressionCache = new Cache(1000)

	var allowedKeywords =
	  'Math,Date,this,true,false,null,undefined,Infinity,NaN,' +
	  'isNaN,isFinite,decodeURI,decodeURIComponent,encodeURI,' +
	  'encodeURIComponent,parseInt,parseFloat'
	var allowedKeywordsRE =
	  new RegExp('^(' + allowedKeywords.replace(/,/g, '\\b|') + '\\b)')

	// keywords that don't make sense inside expressions
	var improperKeywords =
	  'break,case,class,catch,const,continue,debugger,default,' +
	  'delete,do,else,export,extends,finally,for,function,if,' +
	  'import,in,instanceof,let,return,super,switch,throw,try,' +
	  'var,while,with,yield,enum,await,implements,package,' +
	  'proctected,static,interface,private,public'
	var improperKeywordsRE =
	  new RegExp('^(' + improperKeywords.replace(/,/g, '\\b|') + '\\b)')

	var wsRE = /\s/g
	var newlineRE = /\n/g
	var saveRE = /[\{,]\s*[\w\$_]+\s*:|('[^']*'|"[^"]*")|new |typeof |void /g
	var restoreRE = /"(\d+)"/g
	var pathTestRE = /^[A-Za-z_$][\w$]*(\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\]|\[\d+\]|\[[A-Za-z_$][\w$]*\])*$/
	var pathReplaceRE = /[^\w$\.]([A-Za-z_$][\w$]*(\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\])*)/g
	var booleanLiteralRE = /^(true|false)$/

	/**
	 * Save / Rewrite / Restore
	 *
	 * When rewriting paths found in an expression, it is
	 * possible for the same letter sequences to be found in
	 * strings and Object literal property keys. Therefore we
	 * remove and store these parts in a temporary array, and
	 * restore them after the path rewrite.
	 */

	var saved = []

	/**
	 * Save replacer
	 *
	 * The save regex can match two possible cases:
	 * 1. An opening object literal
	 * 2. A string
	 * If matched as a plain string, we need to escape its
	 * newlines, since the string needs to be preserved when
	 * generating the function body.
	 *
	 * @param {String} str
	 * @param {String} isString - str if matched as a string
	 * @return {String} - placeholder with index
	 */

	function save (str, isString) {
	  var i = saved.length
	  saved[i] = isString
	    ? str.replace(newlineRE, '\\n')
	    : str
	  return '"' + i + '"'
	}

	/**
	 * Path rewrite replacer
	 *
	 * @param {String} raw
	 * @return {String}
	 */

	function rewrite (raw) {
	  var c = raw.charAt(0)
	  var path = raw.slice(1)
	  if (allowedKeywordsRE.test(path)) {
	    return raw
	  } else {
	    path = path.indexOf('"') > -1
	      ? path.replace(restoreRE, restore)
	      : path
	    return c + 'scope.' + path
	  }
	}

	/**
	 * Restore replacer
	 *
	 * @param {String} str
	 * @param {String} i - matched save index
	 * @return {String}
	 */

	function restore (str, i) {
	  return saved[i]
	}

	/**
	 * Rewrite an expression, prefixing all path accessors with
	 * `scope.` and generate getter/setter functions.
	 *
	 * @param {String} exp
	 * @param {Boolean} needSet
	 * @return {Function}
	 */

	function compileExpFns (exp, needSet) {
	  if (improperKeywordsRE.test(exp)) {
	    process.env.NODE_ENV !== 'production' && _.warn(
	      'Avoid using reserved keywords in expression: ' + exp
	    )
	  }
	  // reset state
	  saved.length = 0
	  // save strings and object literal keys
	  var body = exp
	    .replace(saveRE, save)
	    .replace(wsRE, '')
	  // rewrite all paths
	  // pad 1 space here becaue the regex matches 1 extra char
	  body = (' ' + body)
	    .replace(pathReplaceRE, rewrite)
	    .replace(restoreRE, restore)
	  var getter = makeGetter(body)
	  if (getter) {
	    return {
	      get: getter,
	      body: body,
	      set: needSet
	        ? makeSetter(body)
	        : null
	    }
	  }
	}

	/**
	 * Compile getter setters for a simple path.
	 *
	 * @param {String} exp
	 * @return {Function}
	 */

	function compilePathFns (exp) {
	  var getter, path
	  if (exp.indexOf('[') < 0) {
	    // really simple path
	    path = exp.split('.')
	    path.raw = exp
	    getter = Path.compileGetter(path)
	  } else {
	    // do the real parsing
	    path = Path.parse(exp)
	    getter = path.get
	  }
	  return {
	    get: getter,
	    // always generate setter for simple paths
	    set: function (obj, val) {
	      Path.set(obj, path, val)
	    }
	  }
	}

	/**
	 * Build a getter function. Requires eval.
	 *
	 * We isolate the try/catch so it doesn't affect the
	 * optimization of the parse function when it is not called.
	 *
	 * @param {String} body
	 * @return {Function|undefined}
	 */

	function makeGetter (body) {
	  try {
	    return new Function('scope', 'return ' + body + ';')
	  } catch (e) {
	    process.env.NODE_ENV !== 'production' && _.warn(
	      'Invalid expression. ' +
	      'Generated function body: ' + body
	    )
	  }
	}

	/**
	 * Build a setter function.
	 *
	 * This is only needed in rare situations like "a[b]" where
	 * a settable path requires dynamic evaluation.
	 *
	 * This setter function may throw error when called if the
	 * expression body is not a valid left-hand expression in
	 * assignment.
	 *
	 * @param {String} body
	 * @return {Function|undefined}
	 */

	function makeSetter (body) {
	  try {
	    return new Function('scope', 'value', body + '=value;')
	  } catch (e) {
	    process.env.NODE_ENV !== 'production' && _.warn(
	      'Invalid setter function body: ' + body
	    )
	  }
	}

	/**
	 * Check for setter existence on a cache hit.
	 *
	 * @param {Function} hit
	 */

	function checkSetter (hit) {
	  if (!hit.set) {
	    hit.set = makeSetter(hit.body)
	  }
	}

	/**
	 * Parse an expression into re-written getter/setters.
	 *
	 * @param {String} exp
	 * @param {Boolean} needSet
	 * @return {Function}
	 */

	exports.parse = function (exp, needSet) {
	  exp = exp.trim()
	  // try cache
	  var hit = expressionCache.get(exp)
	  if (hit) {
	    if (needSet) {
	      checkSetter(hit)
	    }
	    return hit
	  }
	  // we do a simple path check to optimize for them.
	  // the check fails valid paths with unusal whitespaces,
	  // but that's too rare and we don't care.
	  // also skip boolean literals and paths that start with
	  // global "Math"
	  var res = exports.isSimplePath(exp)
	    ? compilePathFns(exp)
	    : compileExpFns(exp, needSet)
	  expressionCache.put(exp, res)
	  return res
	}

	/**
	 * Check if an expression is a simple path.
	 *
	 * @param {String} exp
	 * @return {Boolean}
	 */

	exports.isSimplePath = function (exp) {
	  return pathTestRE.test(exp) &&
	    // don't treat true/false as paths
	    !booleanLiteralRE.test(exp) &&
	    // Math constants e.g. Math.PI, Math.E etc.
	    exp.slice(0, 5) !== 'Math.'
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(12)))

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var _ = __webpack_require__(8)
	var Cache = __webpack_require__(22)
	var pathCache = new Cache(1000)
	var identRE = exports.identRE = /^[$_a-zA-Z]+[\w$]*$/

	// actions
	var APPEND = 0
	var PUSH = 1

	// states
	var BEFORE_PATH = 0
	var IN_PATH = 1
	var BEFORE_IDENT = 2
	var IN_IDENT = 3
	var BEFORE_ELEMENT = 4
	var AFTER_ZERO = 5
	var IN_INDEX = 6
	var IN_SINGLE_QUOTE = 7
	var IN_DOUBLE_QUOTE = 8
	var IN_SUB_PATH = 9
	var AFTER_ELEMENT = 10
	var AFTER_PATH = 11
	var ERROR = 12

	var pathStateMachine = []

	pathStateMachine[BEFORE_PATH] = {
	  'ws': [BEFORE_PATH],
	  'ident': [IN_IDENT, APPEND],
	  '[': [BEFORE_ELEMENT],
	  'eof': [AFTER_PATH]
	}

	pathStateMachine[IN_PATH] = {
	  'ws': [IN_PATH],
	  '.': [BEFORE_IDENT],
	  '[': [BEFORE_ELEMENT],
	  'eof': [AFTER_PATH]
	}

	pathStateMachine[BEFORE_IDENT] = {
	  'ws': [BEFORE_IDENT],
	  'ident': [IN_IDENT, APPEND]
	}

	pathStateMachine[IN_IDENT] = {
	  'ident': [IN_IDENT, APPEND],
	  '0': [IN_IDENT, APPEND],
	  'number': [IN_IDENT, APPEND],
	  'ws': [IN_PATH, PUSH],
	  '.': [BEFORE_IDENT, PUSH],
	  '[': [BEFORE_ELEMENT, PUSH],
	  'eof': [AFTER_PATH, PUSH]
	}

	pathStateMachine[BEFORE_ELEMENT] = {
	  'ws': [BEFORE_ELEMENT],
	  '0': [AFTER_ZERO, APPEND],
	  'number': [IN_INDEX, APPEND],
	  "'": [IN_SINGLE_QUOTE, APPEND, ''],
	  '"': [IN_DOUBLE_QUOTE, APPEND, ''],
	  'ident': [IN_SUB_PATH, APPEND, '*']
	}

	pathStateMachine[AFTER_ZERO] = {
	  'ws': [AFTER_ELEMENT, PUSH],
	  ']': [IN_PATH, PUSH]
	}

	pathStateMachine[IN_INDEX] = {
	  '0': [IN_INDEX, APPEND],
	  'number': [IN_INDEX, APPEND],
	  'ws': [AFTER_ELEMENT],
	  ']': [IN_PATH, PUSH]
	}

	pathStateMachine[IN_SINGLE_QUOTE] = {
	  "'": [AFTER_ELEMENT],
	  'eof': ERROR,
	  'else': [IN_SINGLE_QUOTE, APPEND]
	}

	pathStateMachine[IN_DOUBLE_QUOTE] = {
	  '"': [AFTER_ELEMENT],
	  'eof': ERROR,
	  'else': [IN_DOUBLE_QUOTE, APPEND]
	}

	pathStateMachine[IN_SUB_PATH] = {
	  'ident': [IN_SUB_PATH, APPEND],
	  '0': [IN_SUB_PATH, APPEND],
	  'number': [IN_SUB_PATH, APPEND],
	  'ws': [AFTER_ELEMENT],
	  ']': [IN_PATH, PUSH]
	}

	pathStateMachine[AFTER_ELEMENT] = {
	  'ws': [AFTER_ELEMENT],
	  ']': [IN_PATH, PUSH]
	}

	/**
	 * Determine the type of a character in a keypath.
	 *
	 * @param {Char} ch
	 * @return {String} type
	 */

	function getPathCharType (ch) {
	  if (ch === undefined) {
	    return 'eof'
	  }

	  var code = ch.charCodeAt(0)

	  switch (code) {
	    case 0x5B: // [
	    case 0x5D: // ]
	    case 0x2E: // .
	    case 0x22: // "
	    case 0x27: // '
	    case 0x30: // 0
	      return ch

	    case 0x5F: // _
	    case 0x24: // $
	      return 'ident'

	    case 0x20: // Space
	    case 0x09: // Tab
	    case 0x0A: // Newline
	    case 0x0D: // Return
	    case 0xA0:  // No-break space
	    case 0xFEFF:  // Byte Order Mark
	    case 0x2028:  // Line Separator
	    case 0x2029:  // Paragraph Separator
	      return 'ws'
	  }

	  // a-z, A-Z
	  if (
	    (code >= 0x61 && code <= 0x7A) ||
	    (code >= 0x41 && code <= 0x5A)
	  ) {
	    return 'ident'
	  }

	  // 1-9
	  if (code >= 0x31 && code <= 0x39) {
	    return 'number'
	  }

	  return 'else'
	}

	/**
	 * Parse a string path into an array of segments
	 * Todo implement cache
	 *
	 * @param {String} path
	 * @return {Array|undefined}
	 */

	function parsePath (path) {
	  var keys = []
	  var index = -1
	  var mode = BEFORE_PATH
	  var c, newChar, key, type, transition, action, typeMap

	  var actions = []
	  actions[PUSH] = function () {
	    if (key === undefined) {
	      return
	    }
	    keys.push(key)
	    key = undefined
	  }
	  actions[APPEND] = function () {
	    if (key === undefined) {
	      key = newChar
	    } else {
	      key += newChar
	    }
	  }

	  function maybeUnescapeQuote () {
	    var nextChar = path[index + 1]
	    if ((mode === IN_SINGLE_QUOTE && nextChar === "'") ||
	        (mode === IN_DOUBLE_QUOTE && nextChar === '"')) {
	      index++
	      newChar = nextChar
	      actions[APPEND]()
	      return true
	    }
	  }

	  while (mode != null) {
	    index++
	    c = path[index]

	    if (c === '\\' && maybeUnescapeQuote()) {
	      continue
	    }

	    type = getPathCharType(c)
	    typeMap = pathStateMachine[mode]
	    transition = typeMap[type] || typeMap['else'] || ERROR

	    if (transition === ERROR) {
	      return // parse error
	    }

	    mode = transition[0]
	    action = actions[transition[1]]
	    if (action) {
	      newChar = transition[2]
	      newChar = newChar === undefined
	        ? c
	        : newChar === '*'
	          ? newChar + c
	          : newChar
	      action()
	    }

	    if (mode === AFTER_PATH) {
	      keys.raw = path
	      return keys
	    }
	  }
	}

	/**
	 * Format a accessor segment based on its type.
	 *
	 * @param {String} key
	 * @return {Boolean}
	 */

	function formatAccessor (key) {
	  if (identRE.test(key)) { // identifier
	    return '.' + key
	  } else if (+key === key >>> 0) { // bracket index
	    return '[' + key + ']'
	  } else if (key.charAt(0) === '*') {
	    return '[o' + formatAccessor(key.slice(1)) + ']'
	  } else { // bracket string
	    return '["' + key.replace(/"/g, '\\"') + '"]'
	  }
	}

	/**
	 * Compiles a getter function with a fixed path.
	 * The fixed path getter supresses errors.
	 *
	 * @param {Array} path
	 * @return {Function}
	 */

	exports.compileGetter = function (path) {
	  var body = 'return o' + path.map(formatAccessor).join('')
	  return new Function('o', body)
	}

	/**
	 * External parse that check for a cache hit first
	 *
	 * @param {String} path
	 * @return {Array|undefined}
	 */

	exports.parse = function (path) {
	  var hit = pathCache.get(path)
	  if (!hit) {
	    hit = parsePath(path)
	    if (hit) {
	      hit.get = exports.compileGetter(hit)
	      pathCache.put(path, hit)
	    }
	  }
	  return hit
	}

	/**
	 * Get from an object from a path string
	 *
	 * @param {Object} obj
	 * @param {String} path
	 */

	exports.get = function (obj, path) {
	  path = exports.parse(path)
	  if (path) {
	    return path.get(obj)
	  }
	}

	/**
	 * Set on an object from a path
	 *
	 * @param {Object} obj
	 * @param {String | Array} path
	 * @param {*} val
	 */

	exports.set = function (obj, path, val) {
	  var original = obj
	  if (typeof path === 'string') {
	    path = exports.parse(path)
	  }
	  if (!path || !_.isObject(obj)) {
	    return false
	  }
	  var last, key
	  for (var i = 0, l = path.length; i < l; i++) {
	    last = obj
	    key = path[i]
	    if (key.charAt(0) === '*') {
	      key = original[key.slice(1)]
	    }
	    if (i < l - 1) {
	      obj = obj[key]
	      if (!_.isObject(obj)) {
	        warnNonExistent(path)
	        obj = {}
	        last.$add(key, obj)
	      }
	    } else {
	      if (_.isArray(obj)) {
	        obj.$set(key, val)
	      } else if (key in obj) {
	        obj[key] = val
	      } else {
	        warnNonExistent(path)
	        obj.$add(key, val)
	      }
	    }
	  }
	  return true
	}

	function warnNonExistent (path) {
	  process.env.NODE_ENV !== 'production' && _.warn(
	    'You are setting a non-existent path "' + path.raw + '" ' +
	    'on a vm instance. Consider pre-initializing the property ' +
	    'with the "data" option for more reliable reactivity ' +
	    'and better performance.'
	  )
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(12)))

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var _ = __webpack_require__(8)
	var config = __webpack_require__(13)

	// we have two separate queues: one for directive updates
	// and one for user watcher registered via $watch().
	// we want to guarantee directive updates to be called
	// before user watchers so that when user watchers are
	// triggered, the DOM would have already been in updated
	// state.
	var queue = []
	var userQueue = []
	var has = {}
	var circular = {}
	var waiting = false
	var internalQueueDepleted = false

	/**
	 * Reset the batcher's state.
	 */

	function resetBatcherState () {
	  queue = []
	  userQueue = []
	  has = {}
	  circular = {}
	  waiting = internalQueueDepleted = false
	}

	/**
	 * Flush both queues and run the watchers.
	 */

	function flushBatcherQueue () {
	  runBatcherQueue(queue)
	  internalQueueDepleted = true
	  runBatcherQueue(userQueue)
	  resetBatcherState()
	}

	/**
	 * Run the watchers in a single queue.
	 *
	 * @param {Array} queue
	 */

	function runBatcherQueue (queue) {
	  // do not cache length because more watchers might be pushed
	  // as we run existing watchers
	  for (var i = 0; i < queue.length; i++) {
	    var watcher = queue[i]
	    var id = watcher.id
	    has[id] = null
	    watcher.run()
	    // in dev build, check and stop circular updates.
	    if (process.env.NODE_ENV !== 'production' && has[id] != null) {
	      circular[id] = (circular[id] || 0) + 1
	      if (circular[id] > config._maxUpdateCount) {
	        queue.splice(has[id], 1)
	        _.warn(
	          'You may have an infinite update loop for watcher ' +
	          'with expression: ' + watcher.expression
	        )
	      }
	    }
	  }
	}

	/**
	 * Push a watcher into the watcher queue.
	 * Jobs with duplicate IDs will be skipped unless it's
	 * pushed when the queue is being flushed.
	 *
	 * @param {Watcher} watcher
	 *   properties:
	 *   - {Number} id
	 *   - {Function} run
	 */

	exports.push = function (watcher) {
	  var id = watcher.id
	  if (has[id] == null) {
	    // if an internal watcher is pushed, but the internal
	    // queue is already depleted, we run it immediately.
	    if (internalQueueDepleted && !watcher.user) {
	      watcher.run()
	      return
	    }
	    // push watcher into appropriate queue
	    var q = watcher.user ? userQueue : queue
	    has[id] = q.length
	    q.push(watcher)
	    // queue the flush
	    if (!waiting) {
	      waiting = true
	      _.nextTick(flushBatcherQueue)
	    }
	  }
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(12)))

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(8)
	var Cache = __webpack_require__(22)
	var templateCache = new Cache(1000)
	var idSelectorCache = new Cache(1000)

	var map = {
	  _default: [0, '', ''],
	  legend: [1, '<fieldset>', '</fieldset>'],
	  tr: [2, '<table><tbody>', '</tbody></table>'],
	  col: [
	    2,
	    '<table><tbody></tbody><colgroup>',
	    '</colgroup></table>'
	  ]
	}

	map.td =
	map.th = [
	  3,
	  '<table><tbody><tr>',
	  '</tr></tbody></table>'
	]

	map.option =
	map.optgroup = [
	  1,
	  '<select multiple="multiple">',
	  '</select>'
	]

	map.thead =
	map.tbody =
	map.colgroup =
	map.caption =
	map.tfoot = [1, '<table>', '</table>']

	map.g =
	map.defs =
	map.symbol =
	map.use =
	map.image =
	map.text =
	map.circle =
	map.ellipse =
	map.line =
	map.path =
	map.polygon =
	map.polyline =
	map.rect = [
	  1,
	  '<svg ' +
	    'xmlns="http://www.w3.org/2000/svg" ' +
	    'xmlns:xlink="http://www.w3.org/1999/xlink" ' +
	    'xmlns:ev="http://www.w3.org/2001/xml-events"' +
	    'version="1.1">',
	  '</svg>'
	]

	/**
	 * Check if a node is a supported template node with a
	 * DocumentFragment content.
	 *
	 * @param {Node} node
	 * @return {Boolean}
	 */

	function isRealTemplate (node) {
	  return _.isTemplate(node) &&
	    node.content instanceof DocumentFragment
	}

	var tagRE = /<([\w:]+)/
	var entityRE = /&\w+;/

	/**
	 * Convert a string template to a DocumentFragment.
	 * Determines correct wrapping by tag types. Wrapping
	 * strategy found in jQuery & component/domify.
	 *
	 * @param {String} templateString
	 * @return {DocumentFragment}
	 */

	function stringToFragment (templateString) {
	  // try a cache hit first
	  var hit = templateCache.get(templateString)
	  if (hit) {
	    return hit
	  }

	  var frag = document.createDocumentFragment()
	  var tagMatch = templateString.match(tagRE)
	  var entityMatch = entityRE.test(templateString)

	  if (!tagMatch && !entityMatch) {
	    // text only, return a single text node.
	    frag.appendChild(
	      document.createTextNode(templateString)
	    )
	  } else {

	    var tag = tagMatch && tagMatch[1]
	    var wrap = map[tag] || map._default
	    var depth = wrap[0]
	    var prefix = wrap[1]
	    var suffix = wrap[2]
	    var node = document.createElement('div')

	    node.innerHTML = prefix + templateString.trim() + suffix
	    while (depth--) {
	      node = node.lastChild
	    }

	    var child
	    /* eslint-disable no-cond-assign */
	    while (child = node.firstChild) {
	    /* eslint-enable no-cond-assign */
	      frag.appendChild(child)
	    }
	  }

	  templateCache.put(templateString, frag)
	  return frag
	}

	/**
	 * Convert a template node to a DocumentFragment.
	 *
	 * @param {Node} node
	 * @return {DocumentFragment}
	 */

	function nodeToFragment (node) {
	  // if its a template tag and the browser supports it,
	  // its content is already a document fragment.
	  if (isRealTemplate(node)) {
	    _.trimNode(node.content)
	    return node.content
	  }
	  // script template
	  if (node.tagName === 'SCRIPT') {
	    return stringToFragment(node.textContent)
	  }
	  // normal node, clone it to avoid mutating the original
	  var clone = exports.clone(node)
	  var frag = document.createDocumentFragment()
	  var child
	  /* eslint-disable no-cond-assign */
	  while (child = clone.firstChild) {
	  /* eslint-enable no-cond-assign */
	    frag.appendChild(child)
	  }
	  _.trimNode(frag)
	  return frag
	}

	// Test for the presence of the Safari template cloning bug
	// https://bugs.webkit.org/show_bug.cgi?id=137755
	var hasBrokenTemplate = _.inBrowser
	  ? (function () {
	      var a = document.createElement('div')
	      a.innerHTML = '<template>1</template>'
	      return !a.cloneNode(true).firstChild.innerHTML
	    })()
	  : false

	// Test for IE10/11 textarea placeholder clone bug
	var hasTextareaCloneBug = _.inBrowser
	  ? (function () {
	      var t = document.createElement('textarea')
	      t.placeholder = 't'
	      return t.cloneNode(true).value === 't'
	    })()
	  : false

	/**
	 * 1. Deal with Safari cloning nested <template> bug by
	 *    manually cloning all template instances.
	 * 2. Deal with IE10/11 textarea placeholder bug by setting
	 *    the correct value after cloning.
	 *
	 * @param {Element|DocumentFragment} node
	 * @return {Element|DocumentFragment}
	 */

	exports.clone = function (node) {
	  if (!node.querySelectorAll) {
	    return node.cloneNode()
	  }
	  var res = node.cloneNode(true)
	  var i, original, cloned
	  /* istanbul ignore if */
	  if (hasBrokenTemplate) {
	    var clone = res
	    if (isRealTemplate(node)) {
	      node = node.content
	      clone = res.content
	    }
	    original = node.querySelectorAll('template')
	    if (original.length) {
	      cloned = clone.querySelectorAll('template')
	      i = cloned.length
	      while (i--) {
	        cloned[i].parentNode.replaceChild(
	          exports.clone(original[i]),
	          cloned[i]
	        )
	      }
	    }
	  }
	  /* istanbul ignore if */
	  if (hasTextareaCloneBug) {
	    if (node.tagName === 'TEXTAREA') {
	      res.value = node.value
	    } else {
	      original = node.querySelectorAll('textarea')
	      if (original.length) {
	        cloned = res.querySelectorAll('textarea')
	        i = cloned.length
	        while (i--) {
	          cloned[i].value = original[i].value
	        }
	      }
	    }
	  }
	  return res
	}

	/**
	 * Process the template option and normalizes it into a
	 * a DocumentFragment that can be used as a partial or a
	 * instance template.
	 *
	 * @param {*} template
	 *    Possible values include:
	 *    - DocumentFragment object
	 *    - Node object of type Template
	 *    - id selector: '#some-template-id'
	 *    - template string: '<div><span>{{msg}}</span></div>'
	 * @param {Boolean} clone
	 * @param {Boolean} noSelector
	 * @return {DocumentFragment|undefined}
	 */

	exports.parse = function (template, clone, noSelector) {
	  var node, frag

	  // if the template is already a document fragment,
	  // do nothing
	  if (template instanceof DocumentFragment) {
	    _.trimNode(template)
	    return clone
	      ? exports.clone(template)
	      : template
	  }

	  if (typeof template === 'string') {
	    // id selector
	    if (!noSelector && template.charAt(0) === '#') {
	      // id selector can be cached too
	      frag = idSelectorCache.get(template)
	      if (!frag) {
	        node = document.getElementById(template.slice(1))
	        if (node) {
	          frag = nodeToFragment(node)
	          // save selector to cache
	          idSelectorCache.put(template, frag)
	        }
	      }
	    } else {
	      // normal string template
	      frag = stringToFragment(template)
	    }
	  } else if (template.nodeType) {
	    // a direct node
	    frag = nodeToFragment(template)
	  }

	  return frag && clone
	    ? exports.clone(frag)
	    : frag
	}


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var _ = __webpack_require__(8)
	var config = __webpack_require__(13)
	var templateParser = __webpack_require__(30)

	module.exports = {

	  isLiteral: true,

	  /**
	   * Setup. Two possible usages:
	   *
	   * - static:
	   *   v-component="comp"
	   *
	   * - dynamic:
	   *   v-component="{{currentView}}"
	   */

	  bind: function () {
	    if (!this.el.__vue__) {
	      // create a ref anchor
	      this.anchor = _.createAnchor('v-component')
	      _.replace(this.el, this.anchor)
	      // check keep-alive options.
	      // If yes, instead of destroying the active vm when
	      // hiding (v-if) or switching (dynamic literal) it,
	      // we simply remove it from the DOM and save it in a
	      // cache object, with its constructor id as the key.
	      this.keepAlive = this._checkParam('keep-alive') != null
	      // wait for event before insertion
	      this.waitForEvent = this._checkParam('wait-for')
	      // check ref
	      this.refID = this._checkParam(config.prefix + 'ref')
	      if (this.keepAlive) {
	        this.cache = {}
	      }
	      // check inline-template
	      if (this._checkParam('inline-template') !== null) {
	        // extract inline template as a DocumentFragment
	        this.template = _.extractContent(this.el, true)
	      }
	      // component resolution related state
	      this.pendingComponentCb =
	      this.Component = null
	      // transition related state
	      this.pendingRemovals = 0
	      this.pendingRemovalCb = null
	      // if static, build right now.
	      if (!this._isDynamicLiteral) {
	        this.resolveComponent(this.expression, _.bind(this.initStatic, this))
	      } else {
	        // check dynamic component params
	        this.transMode = this._checkParam('transition-mode')
	      }
	    } else {
	      process.env.NODE_ENV !== 'production' && _.warn(
	        'cannot mount component "' + this.expression + '" ' +
	        'on already mounted element: ' + this.el
	      )
	    }
	  },

	  /**
	   * Initialize a static component.
	   */

	  initStatic: function () {
	    // wait-for
	    var anchor = this.anchor
	    var options
	    var waitFor = this.waitForEvent
	    if (waitFor) {
	      options = {
	        created: function () {
	          this.$once(waitFor, function () {
	            this.$before(anchor)
	          })
	        }
	      }
	    }
	    var child = this.build(options)
	    this.setCurrent(child)
	    if (!this.waitForEvent) {
	      child.$before(anchor)
	    }
	  },

	  /**
	   * Public update, called by the watcher in the dynamic
	   * literal scenario, e.g. v-component="{{view}}"
	   */

	  update: function (value) {
	    this.setComponent(value)
	  },

	  /**
	   * Switch dynamic components. May resolve the component
	   * asynchronously, and perform transition based on
	   * specified transition mode. Accepts a few additional
	   * arguments specifically for vue-router.
	   *
	   * The callback is called when the full transition is
	   * finished.
	   *
	   * @param {String} value
	   * @param {Function} [cb]
	   */

	  setComponent: function (value, cb) {
	    this.invalidatePending()
	    if (!value) {
	      // just remove current
	      this.unbuild(true)
	      this.remove(this.childVM, cb)
	      this.unsetCurrent()
	    } else {
	      this.resolveComponent(value, _.bind(function () {
	        this.unbuild(true)
	        var options
	        var self = this
	        var waitFor = this.waitForEvent
	        if (waitFor) {
	          options = {
	            created: function () {
	              this.$once(waitFor, function () {
	                self.waitingFor = null
	                self.transition(this, cb)
	              })
	            }
	          }
	        }
	        var cached = this.getCached()
	        var newComponent = this.build(options)
	        if (!waitFor || cached) {
	          this.transition(newComponent, cb)
	        } else {
	          this.waitingFor = newComponent
	        }
	      }, this))
	    }
	  },

	  /**
	   * Resolve the component constructor to use when creating
	   * the child vm.
	   */

	  resolveComponent: function (id, cb) {
	    var self = this
	    this.pendingComponentCb = _.cancellable(function (Component) {
	      self.Component = Component
	      cb()
	    })
	    this.vm._resolveComponent(id, this.pendingComponentCb)
	  },

	  /**
	   * When the component changes or unbinds before an async
	   * constructor is resolved, we need to invalidate its
	   * pending callback.
	   */

	  invalidatePending: function () {
	    if (this.pendingComponentCb) {
	      this.pendingComponentCb.cancel()
	      this.pendingComponentCb = null
	    }
	  },

	  /**
	   * Instantiate/insert a new child vm.
	   * If keep alive and has cached instance, insert that
	   * instance; otherwise build a new one and cache it.
	   *
	   * @param {Object} [extraOptions]
	   * @return {Vue} - the created instance
	   */

	  build: function (extraOptions) {
	    var cached = this.getCached()
	    if (cached) {
	      return cached
	    }
	    if (this.Component) {
	      // default options
	      var options = {
	        el: templateParser.clone(this.el),
	        template: this.template,
	        // if no inline-template, then the compiled
	        // linker can be cached for better performance.
	        _linkerCachable: !this.template,
	        _asComponent: true,
	        _isRouterView: this._isRouterView,
	        _context: this.vm
	      }
	      // extra options
	      if (extraOptions) {
	        _.extend(options, extraOptions)
	      }
	      var parent = this._host || this.vm
	      var child = parent.$addChild(options, this.Component)
	      if (this.keepAlive) {
	        this.cache[this.Component.cid] = child
	      }
	      return child
	    }
	  },

	  /**
	   * Try to get a cached instance of the current component.
	   *
	   * @return {Vue|undefined}
	   */

	  getCached: function () {
	    return this.keepAlive && this.cache[this.Component.cid]
	  },

	  /**
	   * Teardown the current child, but defers cleanup so
	   * that we can separate the destroy and removal steps.
	   *
	   * @param {Boolean} defer
	   */

	  unbuild: function (defer) {
	    if (this.waitingFor) {
	      this.waitingFor.$destroy()
	      this.waitingFor = null
	    }
	    var child = this.childVM
	    if (!child || this.keepAlive) {
	      return
	    }
	    // the sole purpose of `deferCleanup` is so that we can
	    // "deactivate" the vm right now and perform DOM removal
	    // later.
	    child.$destroy(false, defer)
	  },

	  /**
	   * Remove current destroyed child and manually do
	   * the cleanup after removal.
	   *
	   * @param {Function} cb
	   */

	  remove: function (child, cb) {
	    var keepAlive = this.keepAlive
	    if (child) {
	      // we may have a component switch when a previous
	      // component is still being transitioned out.
	      // we want to trigger only one lastest insertion cb
	      // when the existing transition finishes. (#1119)
	      this.pendingRemovals++
	      this.pendingRemovalCb = cb
	      var self = this
	      child.$remove(function () {
	        self.pendingRemovals--
	        if (!keepAlive) child._cleanup()
	        if (!self.pendingRemovals && self.pendingRemovalCb) {
	          self.pendingRemovalCb()
	          self.pendingRemovalCb = null
	        }
	      })
	    } else if (cb) {
	      cb()
	    }
	  },

	  /**
	   * Actually swap the components, depending on the
	   * transition mode. Defaults to simultaneous.
	   *
	   * @param {Vue} target
	   * @param {Function} [cb]
	   */

	  transition: function (target, cb) {
	    var self = this
	    var current = this.childVM
	    this.setCurrent(target)
	    switch (self.transMode) {
	      case 'in-out':
	        target.$before(self.anchor, function () {
	          self.remove(current, cb)
	        })
	        break
	      case 'out-in':
	        self.remove(current, function () {
	          target.$before(self.anchor, cb)
	        })
	        break
	      default:
	        self.remove(current)
	        target.$before(self.anchor, cb)
	    }
	  },

	  /**
	   * Set childVM and parent ref
	   */

	  setCurrent: function (child) {
	    this.unsetCurrent()
	    this.childVM = child
	    var refID = child._refID || this.refID
	    if (refID) {
	      this.vm.$[refID] = child
	    }
	  },

	  /**
	   * Unset childVM and parent ref
	   */

	  unsetCurrent: function () {
	    var child = this.childVM
	    this.childVM = null
	    var refID = (child && child._refID) || this.refID
	    if (refID) {
	      this.vm.$[refID] = null
	    }
	  },

	  /**
	   * Unbind.
	   */

	  unbind: function () {
	    this.invalidatePending()
	    // Do not defer cleanup when unbinding
	    this.unbuild()
	    this.unsetCurrent()
	    // destroy all keep-alive cached instances
	    if (this.cache) {
	      for (var key in this.cache) {
	        this.cache[key].$destroy()
	      }
	      this.cache = null
	    }
	  }
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(12)))

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var _ = __webpack_require__(8)
	var config = __webpack_require__(13)
	var templateParser = __webpack_require__(30)

	/**
	 * Process an element or a DocumentFragment based on a
	 * instance option object. This allows us to transclude
	 * a template node/fragment before the instance is created,
	 * so the processed fragment can then be cloned and reused
	 * in v-repeat.
	 *
	 * @param {Element} el
	 * @param {Object} options
	 * @return {Element|DocumentFragment}
	 */

	exports.transclude = function (el, options) {
	  // extract container attributes to pass them down
	  // to compiler, because they need to be compiled in
	  // parent scope. we are mutating the options object here
	  // assuming the same object will be used for compile
	  // right after this.
	  if (options) {
	    options._containerAttrs = extractAttrs(el)
	  }
	  // for template tags, what we want is its content as
	  // a documentFragment (for fragment instances)
	  if (_.isTemplate(el)) {
	    el = templateParser.parse(el)
	  }
	  if (options) {
	    if (options._asComponent && !options.template) {
	      options.template = '<content></content>'
	    }
	    if (options.template) {
	      options._content = _.extractContent(el)
	      el = transcludeTemplate(el, options)
	    }
	  }
	  if (el instanceof DocumentFragment) {
	    // anchors for fragment instance
	    // passing in `persist: true` to avoid them being
	    // discarded by IE during template cloning
	    _.prepend(_.createAnchor('v-start', true), el)
	    el.appendChild(_.createAnchor('v-end', true))
	  }
	  return el
	}

	/**
	 * Process the template option.
	 * If the replace option is true this will swap the $el.
	 *
	 * @param {Element} el
	 * @param {Object} options
	 * @return {Element|DocumentFragment}
	 */

	function transcludeTemplate (el, options) {
	  var template = options.template
	  var frag = templateParser.parse(template, true)
	  if (frag) {
	    var replacer = frag.firstChild
	    var tag = replacer.tagName && replacer.tagName.toLowerCase()
	    if (options.replace) {
	      /* istanbul ignore if */
	      if (el === document.body) {
	        process.env.NODE_ENV !== 'production' && _.warn(
	          'You are mounting an instance with a template to ' +
	          '<body>. This will replace <body> entirely. You ' +
	          'should probably use `replace: false` here.'
	        )
	      }
	      // there are many cases where the instance must
	      // become a fragment instance: basically anything that
	      // can create more than 1 root nodes.
	      if (
	        // multi-children template
	        frag.childNodes.length > 1 ||
	        // non-element template
	        replacer.nodeType !== 1 ||
	        // single nested component
	        tag === 'component' ||
	        _.resolveAsset(options, 'components', tag) ||
	        replacer.hasAttribute(config.prefix + 'component') ||
	        // element directive
	        _.resolveAsset(options, 'elementDirectives', tag) ||
	        // repeat block
	        replacer.hasAttribute(config.prefix + 'repeat')
	      ) {
	        return frag
	      } else {
	        options._replacerAttrs = extractAttrs(replacer)
	        mergeAttrs(el, replacer)
	        return replacer
	      }
	    } else {
	      el.appendChild(frag)
	      return el
	    }
	  } else {
	    process.env.NODE_ENV !== 'production' && _.warn(
	      'Invalid template option: ' + template
	    )
	  }
	}

	/**
	 * Helper to extract a component container's attributes
	 * into a plain object array.
	 *
	 * @param {Element} el
	 * @return {Array}
	 */

	function extractAttrs (el) {
	  if (el.nodeType === 1 && el.hasAttributes()) {
	    return _.toArray(el.attributes)
	  }
	}

	/**
	 * Merge the attributes of two elements, and make sure
	 * the class names are merged properly.
	 *
	 * @param {Element} from
	 * @param {Element} to
	 */

	function mergeAttrs (from, to) {
	  var attrs = from.attributes
	  var i = attrs.length
	  var name, value
	  while (i--) {
	    name = attrs[i].name
	    value = attrs[i].value
	    if (!to.hasAttribute(name)) {
	      to.setAttribute(name, value)
	    } else if (name === 'class') {
	      value = to.getAttribute(name) + ' ' + value
	      to.setAttribute(name, value)
	    }
	  }
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(12)))

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	// manipulation directives
	exports.text = __webpack_require__(34)
	exports.html = __webpack_require__(35)
	exports.attr = __webpack_require__(36)
	exports.show = __webpack_require__(37)
	exports['class'] = __webpack_require__(39)
	exports.el = __webpack_require__(40)
	exports.ref = __webpack_require__(41)
	exports.cloak = __webpack_require__(42)
	exports.style = __webpack_require__(43)
	exports.transition = __webpack_require__(44)

	// event listener directives
	exports.on = __webpack_require__(47)
	exports.model = __webpack_require__(48)

	// logic control directives
	exports.repeat = __webpack_require__(53)
	exports['if'] = __webpack_require__(54)

	// internal directives that should not be used directly
	// but we still want to expose them for advanced usage.
	exports._component = __webpack_require__(31)
	exports._prop = __webpack_require__(24)


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(8)

	module.exports = {

	  bind: function () {
	    this.attr = this.el.nodeType === 3
	      ? 'data'
	      : 'textContent'
	  },

	  update: function (value) {
	    this.el[this.attr] = _.toString(value)
	  }
	}


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(8)
	var templateParser = __webpack_require__(30)

	module.exports = {

	  bind: function () {
	    // a comment node means this is a binding for
	    // {{{ inline unescaped html }}}
	    if (this.el.nodeType === 8) {
	      // hold nodes
	      this.nodes = []
	      // replace the placeholder with proper anchor
	      this.anchor = _.createAnchor('v-html')
	      _.replace(this.el, this.anchor)
	    }
	  },

	  update: function (value) {
	    value = _.toString(value)
	    if (this.nodes) {
	      this.swap(value)
	    } else {
	      this.el.innerHTML = value
	    }
	  },

	  swap: function (value) {
	    // remove old nodes
	    var i = this.nodes.length
	    while (i--) {
	      _.remove(this.nodes[i])
	    }
	    // convert new value to a fragment
	    // do not attempt to retrieve from id selector
	    var frag = templateParser.parse(value, true, true)
	    // save a reference to these nodes so we can remove later
	    this.nodes = _.toArray(frag.childNodes)
	    _.before(frag, this.anchor)
	  }
	}


/***/ },
/* 36 */
/***/ function(module, exports) {

	// xlink
	var xlinkNS = 'http://www.w3.org/1999/xlink'
	var xlinkRE = /^xlink:/
	var inputProps = {
	  value: 1,
	  checked: 1,
	  selected: 1
	}

	module.exports = {

	  priority: 850,

	  update: function (value) {
	    if (this.arg) {
	      this.setAttr(this.arg, value)
	    } else if (typeof value === 'object') {
	      this.objectHandler(value)
	    }
	  },

	  objectHandler: function (value) {
	    // cache object attrs so that only changed attrs
	    // are actually updated.
	    var cache = this.cache || (this.cache = {})
	    var attr, val
	    for (attr in cache) {
	      if (!(attr in value)) {
	        this.setAttr(attr, null)
	        delete cache[attr]
	      }
	    }
	    for (attr in value) {
	      val = value[attr]
	      if (val !== cache[attr]) {
	        cache[attr] = val
	        this.setAttr(attr, val)
	      }
	    }
	  },

	  setAttr: function (attr, value) {
	    if (inputProps[attr] && attr in this.el) {
	      if (!this.valueRemoved) {
	        this.el.removeAttribute(attr)
	        this.valueRemoved = true
	      }
	      this.el[attr] = value
	    } else if (value != null && value !== false) {
	      if (xlinkRE.test(attr)) {
	        this.el.setAttributeNS(xlinkNS, attr, value)
	      } else {
	        this.el.setAttribute(attr, value)
	      }
	    } else {
	      this.el.removeAttribute(attr)
	    }
	  }
	}


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	var transition = __webpack_require__(38)

	module.exports = function (value) {
	  var el = this.el
	  transition.apply(el, value ? 1 : -1, function () {
	    el.style.display = value ? '' : 'none'
	  }, this.vm)
	}


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(8)

	/**
	 * Append with transition.
	 *
	 * @param {Element} el
	 * @param {Element} target
	 * @param {Vue} vm
	 * @param {Function} [cb]
	 */

	exports.append = function (el, target, vm, cb) {
	  apply(el, 1, function () {
	    target.appendChild(el)
	  }, vm, cb)
	}

	/**
	 * InsertBefore with transition.
	 *
	 * @param {Element} el
	 * @param {Element} target
	 * @param {Vue} vm
	 * @param {Function} [cb]
	 */

	exports.before = function (el, target, vm, cb) {
	  apply(el, 1, function () {
	    _.before(el, target)
	  }, vm, cb)
	}

	/**
	 * Remove with transition.
	 *
	 * @param {Element} el
	 * @param {Vue} vm
	 * @param {Function} [cb]
	 */

	exports.remove = function (el, vm, cb) {
	  apply(el, -1, function () {
	    _.remove(el)
	  }, vm, cb)
	}

	/**
	 * Remove by appending to another parent with transition.
	 * This is only used in block operations.
	 *
	 * @param {Element} el
	 * @param {Element} target
	 * @param {Vue} vm
	 * @param {Function} [cb]
	 */

	exports.removeThenAppend = function (el, target, vm, cb) {
	  apply(el, -1, function () {
	    target.appendChild(el)
	  }, vm, cb)
	}

	/**
	 * Append the childNodes of a fragment to target.
	 *
	 * @param {DocumentFragment} block
	 * @param {Node} target
	 * @param {Vue} vm
	 */

	exports.blockAppend = function (block, target, vm) {
	  var nodes = _.toArray(block.childNodes)
	  for (var i = 0, l = nodes.length; i < l; i++) {
	    exports.before(nodes[i], target, vm)
	  }
	}

	/**
	 * Remove a block of nodes between two edge nodes.
	 *
	 * @param {Node} start
	 * @param {Node} end
	 * @param {Vue} vm
	 */

	exports.blockRemove = function (start, end, vm) {
	  var node = start.nextSibling
	  var next
	  while (node !== end) {
	    next = node.nextSibling
	    exports.remove(node, vm)
	    node = next
	  }
	}

	/**
	 * Apply transitions with an operation callback.
	 *
	 * @param {Element} el
	 * @param {Number} direction
	 *                  1: enter
	 *                 -1: leave
	 * @param {Function} op - the actual DOM operation
	 * @param {Vue} vm
	 * @param {Function} [cb]
	 */

	var apply = exports.apply = function (el, direction, op, vm, cb) {
	  var transition = el.__v_trans
	  if (
	    !transition ||
	    // skip if there are no js hooks and CSS transition is
	    // not supported
	    (!transition.hooks && !_.transitionEndEvent) ||
	    // skip transitions for initial compile
	    !vm._isCompiled ||
	    // if the vm is being manipulated by a parent directive
	    // during the parent's compilation phase, skip the
	    // animation.
	    (vm.$parent && !vm.$parent._isCompiled)
	  ) {
	    op()
	    if (cb) cb()
	    return
	  }
	  var action = direction > 0 ? 'enter' : 'leave'
	  transition[action](op, cb)
	}


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(8)
	var addClass = _.addClass
	var removeClass = _.removeClass

	module.exports = {

	  bind: function () {
	    // interpolations like class="{{abc}}" are converted
	    // to v-class, and we need to remove the raw,
	    // uninterpolated className at binding time.
	    var raw = this._descriptor._rawClass
	    if (raw) {
	      this.prevKeys = raw.trim().split(/\s+/)
	    }
	  },

	  update: function (value) {
	    if (this.arg) {
	      // single toggle
	      if (value) {
	        addClass(this.el, this.arg)
	      } else {
	        removeClass(this.el, this.arg)
	      }
	    } else {
	      if (value && typeof value === 'string') {
	        this.handleObject(stringToObject(value))
	      } else if (_.isPlainObject(value)) {
	        this.handleObject(value)
	      } else {
	        this.cleanup()
	      }
	    }
	  },

	  handleObject: function (value) {
	    this.cleanup(value)
	    var keys = this.prevKeys = Object.keys(value)
	    for (var i = 0, l = keys.length; i < l; i++) {
	      var key = keys[i]
	      if (value[key]) {
	        addClass(this.el, key)
	      } else {
	        removeClass(this.el, key)
	      }
	    }
	  },

	  cleanup: function (value) {
	    if (this.prevKeys) {
	      var i = this.prevKeys.length
	      while (i--) {
	        var key = this.prevKeys[i]
	        if (!value || !value.hasOwnProperty(key)) {
	          removeClass(this.el, key)
	        }
	      }
	    }
	  }
	}

	function stringToObject (value) {
	  var res = {}
	  var keys = value.trim().split(/\s+/)
	  var i = keys.length
	  while (i--) {
	    res[keys[i]] = true
	  }
	  return res
	}


/***/ },
/* 40 */
/***/ function(module, exports) {

	module.exports = {

	  isLiteral: true,

	  bind: function () {
	    this.vm.$$[this.expression] = this.el
	  },

	  unbind: function () {
	    delete this.vm.$$[this.expression]
	  }
	}


/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var _ = __webpack_require__(8)

	module.exports = {

	  isLiteral: true,

	  bind: function () {
	    var vm = this.el.__vue__
	    if (!vm) {
	      process.env.NODE_ENV !== 'production' && _.warn(
	        'v-ref should only be used on a component root element.'
	      )
	      return
	    }
	    // If we get here, it means this is a `v-ref` on a
	    // child, because parent scope `v-ref` is stripped in
	    // `v-component` already. So we just record our own ref
	    // here - it will overwrite parent ref in `v-component`,
	    // if any.
	    vm._refID = this.expression
	  }
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(12)))

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	var config = __webpack_require__(13)

	module.exports = {
	  bind: function () {
	    var el = this.el
	    this.vm.$once('hook:compiled', function () {
	      el.removeAttribute(config.prefix + 'cloak')
	    })
	  }
	}


/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(8)
	var prefixes = ['-webkit-', '-moz-', '-ms-']
	var camelPrefixes = ['Webkit', 'Moz', 'ms']
	var importantRE = /!important;?$/
	var camelRE = /([a-z])([A-Z])/g
	var testEl = null
	var propCache = {}

	module.exports = {

	  deep: true,

	  update: function (value) {
	    if (this.arg) {
	      this.setProp(this.arg, value)
	    } else {
	      if (typeof value === 'object') {
	        this.objectHandler(value)
	      } else {
	        this.el.style.cssText = value
	      }
	    }
	  },

	  objectHandler: function (value) {
	    // cache object styles so that only changed props
	    // are actually updated.
	    var cache = this.cache || (this.cache = {})
	    var prop, val
	    for (prop in cache) {
	      if (!(prop in value)) {
	        this.setProp(prop, null)
	        delete cache[prop]
	      }
	    }
	    for (prop in value) {
	      val = value[prop]
	      if (val !== cache[prop]) {
	        cache[prop] = val
	        this.setProp(prop, val)
	      }
	    }
	  },

	  setProp: function (prop, value) {
	    prop = normalize(prop)
	    if (!prop) return // unsupported prop
	    // cast possible numbers/booleans into strings
	    if (value != null) value += ''
	    if (value) {
	      var isImportant = importantRE.test(value)
	        ? 'important'
	        : ''
	      if (isImportant) {
	        value = value.replace(importantRE, '').trim()
	      }
	      this.el.style.setProperty(prop, value, isImportant)
	    } else {
	      this.el.style.removeProperty(prop)
	    }
	  }

	}

	/**
	 * Normalize a CSS property name.
	 * - cache result
	 * - auto prefix
	 * - camelCase -> dash-case
	 *
	 * @param {String} prop
	 * @return {String}
	 */

	function normalize (prop) {
	  if (propCache[prop]) {
	    return propCache[prop]
	  }
	  var res = prefix(prop)
	  propCache[prop] = propCache[res] = res
	  return res
	}

	/**
	 * Auto detect the appropriate prefix for a CSS property.
	 * https://gist.github.com/paulirish/523692
	 *
	 * @param {String} prop
	 * @return {String}
	 */

	function prefix (prop) {
	  prop = prop.replace(camelRE, '$1-$2').toLowerCase()
	  var camel = _.camelize(prop)
	  var upper = camel.charAt(0).toUpperCase() + camel.slice(1)
	  if (!testEl) {
	    testEl = document.createElement('div')
	  }
	  if (camel in testEl.style) {
	    return prop
	  }
	  var i = prefixes.length
	  var prefixed
	  while (i--) {
	    prefixed = camelPrefixes[i] + upper
	    if (prefixed in testEl.style) {
	      return prefixes[i] + prop
	    }
	  }
	}


/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(8)
	var Transition = __webpack_require__(45)

	module.exports = {

	  priority: 1000,
	  isLiteral: true,

	  bind: function () {
	    if (!this._isDynamicLiteral) {
	      this.update(this.expression)
	    }
	  },

	  update: function (id, oldId) {
	    var el = this.el
	    var vm = this.el.__vue__ || this.vm
	    var hooks = _.resolveAsset(vm.$options, 'transitions', id)
	    id = id || 'v'
	    el.__v_trans = new Transition(el, id, hooks, vm)
	    if (oldId) {
	      _.removeClass(el, oldId + '-transition')
	    }
	    _.addClass(el, id + '-transition')
	  }
	}


/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(8)
	var queue = __webpack_require__(46)
	var addClass = _.addClass
	var removeClass = _.removeClass
	var transitionEndEvent = _.transitionEndEvent
	var animationEndEvent = _.animationEndEvent
	var transDurationProp = _.transitionProp + 'Duration'
	var animDurationProp = _.animationProp + 'Duration'

	var TYPE_TRANSITION = 1
	var TYPE_ANIMATION = 2

	var uid = 0

	/**
	 * A Transition object that encapsulates the state and logic
	 * of the transition.
	 *
	 * @param {Element} el
	 * @param {String} id
	 * @param {Object} hooks
	 * @param {Vue} vm
	 */

	function Transition (el, id, hooks, vm) {
	  this.id = uid++
	  this.el = el
	  this.enterClass = id + '-enter'
	  this.leaveClass = id + '-leave'
	  this.hooks = hooks
	  this.vm = vm
	  // async state
	  this.pendingCssEvent =
	  this.pendingCssCb =
	  this.cancel =
	  this.pendingJsCb =
	  this.op =
	  this.cb = null
	  this.justEntered = false
	  this.typeCache = {}
	  // bind
	  var self = this
	  ;['enterNextTick', 'enterDone', 'leaveNextTick', 'leaveDone']
	    .forEach(function (m) {
	      self[m] = _.bind(self[m], self)
	    })
	}

	var p = Transition.prototype

	/**
	 * Start an entering transition.
	 *
	 * 1. enter transition triggered
	 * 2. call beforeEnter hook
	 * 3. add enter class
	 * 4. insert/show element
	 * 5. call enter hook (with possible explicit js callback)
	 * 6. reflow
	 * 7. based on transition type:
	 *    - transition:
	 *        remove class now, wait for transitionend,
	 *        then done if there's no explicit js callback.
	 *    - animation:
	 *        wait for animationend, remove class,
	 *        then done if there's no explicit js callback.
	 *    - no css transition:
	 *        done now if there's no explicit js callback.
	 * 8. wait for either done or js callback, then call
	 *    afterEnter hook.
	 *
	 * @param {Function} op - insert/show the element
	 * @param {Function} [cb]
	 */

	p.enter = function (op, cb) {
	  this.cancelPending()
	  this.callHook('beforeEnter')
	  this.cb = cb
	  addClass(this.el, this.enterClass)
	  op()
	  this.callHookWithCb('enter')
	  this.cancel = this.hooks && this.hooks.enterCancelled
	  queue.push(this.enterNextTick)
	}

	/**
	 * The "nextTick" phase of an entering transition, which is
	 * to be pushed into a queue and executed after a reflow so
	 * that removing the class can trigger a CSS transition.
	 */

	p.enterNextTick = function () {
	  this.justEntered = true
	  _.nextTick(function () {
	    this.justEntered = false
	  }, this)
	  var type = this.getCssTransitionType(this.enterClass)
	  var enterDone = this.enterDone
	  if (type === TYPE_TRANSITION) {
	    // trigger transition by removing enter class now
	    removeClass(this.el, this.enterClass)
	    this.setupCssCb(transitionEndEvent, enterDone)
	  } else if (type === TYPE_ANIMATION) {
	    this.setupCssCb(animationEndEvent, enterDone)
	  } else if (!this.pendingJsCb) {
	    enterDone()
	  }
	}

	/**
	 * The "cleanup" phase of an entering transition.
	 */

	p.enterDone = function () {
	  this.cancel = this.pendingJsCb = null
	  removeClass(this.el, this.enterClass)
	  this.callHook('afterEnter')
	  if (this.cb) this.cb()
	}

	/**
	 * Start a leaving transition.
	 *
	 * 1. leave transition triggered.
	 * 2. call beforeLeave hook
	 * 3. add leave class (trigger css transition)
	 * 4. call leave hook (with possible explicit js callback)
	 * 5. reflow if no explicit js callback is provided
	 * 6. based on transition type:
	 *    - transition or animation:
	 *        wait for end event, remove class, then done if
	 *        there's no explicit js callback.
	 *    - no css transition:
	 *        done if there's no explicit js callback.
	 * 7. wait for either done or js callback, then call
	 *    afterLeave hook.
	 *
	 * @param {Function} op - remove/hide the element
	 * @param {Function} [cb]
	 */

	p.leave = function (op, cb) {
	  this.cancelPending()
	  this.callHook('beforeLeave')
	  this.op = op
	  this.cb = cb
	  addClass(this.el, this.leaveClass)
	  this.callHookWithCb('leave')
	  this.cancel = this.hooks && this.hooks.leaveCancelled
	  // only need to handle leaveDone if
	  // 1. the transition is already done (synchronously called
	  //    by the user, which causes this.op set to null)
	  // 2. there's no explicit js callback
	  if (this.op && !this.pendingJsCb) {
	    // if a CSS transition leaves immediately after enter,
	    // the transitionend event never fires. therefore we
	    // detect such cases and end the leave immediately.
	    if (this.justEntered) {
	      this.leaveDone()
	    } else {
	      queue.push(this.leaveNextTick)
	    }
	  }
	}

	/**
	 * The "nextTick" phase of a leaving transition.
	 */

	p.leaveNextTick = function () {
	  var type = this.getCssTransitionType(this.leaveClass)
	  if (type) {
	    var event = type === TYPE_TRANSITION
	      ? transitionEndEvent
	      : animationEndEvent
	    this.setupCssCb(event, this.leaveDone)
	  } else {
	    this.leaveDone()
	  }
	}

	/**
	 * The "cleanup" phase of a leaving transition.
	 */

	p.leaveDone = function () {
	  this.cancel = this.pendingJsCb = null
	  this.op()
	  removeClass(this.el, this.leaveClass)
	  this.callHook('afterLeave')
	  if (this.cb) this.cb()
	  this.op = null
	}

	/**
	 * Cancel any pending callbacks from a previously running
	 * but not finished transition.
	 */

	p.cancelPending = function () {
	  this.op = this.cb = null
	  var hasPending = false
	  if (this.pendingCssCb) {
	    hasPending = true
	    _.off(this.el, this.pendingCssEvent, this.pendingCssCb)
	    this.pendingCssEvent = this.pendingCssCb = null
	  }
	  if (this.pendingJsCb) {
	    hasPending = true
	    this.pendingJsCb.cancel()
	    this.pendingJsCb = null
	  }
	  if (hasPending) {
	    removeClass(this.el, this.enterClass)
	    removeClass(this.el, this.leaveClass)
	  }
	  if (this.cancel) {
	    this.cancel.call(this.vm, this.el)
	    this.cancel = null
	  }
	}

	/**
	 * Call a user-provided synchronous hook function.
	 *
	 * @param {String} type
	 */

	p.callHook = function (type) {
	  if (this.hooks && this.hooks[type]) {
	    this.hooks[type].call(this.vm, this.el)
	  }
	}

	/**
	 * Call a user-provided, potentially-async hook function.
	 * We check for the length of arguments to see if the hook
	 * expects a `done` callback. If true, the transition's end
	 * will be determined by when the user calls that callback;
	 * otherwise, the end is determined by the CSS transition or
	 * animation.
	 *
	 * @param {String} type
	 */

	p.callHookWithCb = function (type) {
	  var hook = this.hooks && this.hooks[type]
	  if (hook) {
	    if (hook.length > 1) {
	      this.pendingJsCb = _.cancellable(this[type + 'Done'])
	    }
	    hook.call(this.vm, this.el, this.pendingJsCb)
	  }
	}

	/**
	 * Get an element's transition type based on the
	 * calculated styles.
	 *
	 * @param {String} className
	 * @return {Number}
	 */

	p.getCssTransitionType = function (className) {
	  /* istanbul ignore if */
	  if (
	    !transitionEndEvent ||
	    // skip CSS transitions if page is not visible -
	    // this solves the issue of transitionend events not
	    // firing until the page is visible again.
	    // pageVisibility API is supported in IE10+, same as
	    // CSS transitions.
	    document.hidden ||
	    // explicit js-only transition
	    (this.hooks && this.hooks.css === false)
	  ) {
	    return
	  }
	  var type = this.typeCache[className]
	  if (type) return type
	  var inlineStyles = this.el.style
	  var computedStyles = window.getComputedStyle(this.el)
	  var transDuration =
	    inlineStyles[transDurationProp] ||
	    computedStyles[transDurationProp]
	  if (transDuration && transDuration !== '0s') {
	    type = TYPE_TRANSITION
	  } else {
	    var animDuration =
	      inlineStyles[animDurationProp] ||
	      computedStyles[animDurationProp]
	    if (animDuration && animDuration !== '0s') {
	      type = TYPE_ANIMATION
	    }
	  }
	  if (type) {
	    this.typeCache[className] = type
	  }
	  return type
	}

	/**
	 * Setup a CSS transitionend/animationend callback.
	 *
	 * @param {String} event
	 * @param {Function} cb
	 */

	p.setupCssCb = function (event, cb) {
	  this.pendingCssEvent = event
	  var self = this
	  var el = this.el
	  var onEnd = this.pendingCssCb = function (e) {
	    if (e.target === el) {
	      _.off(el, event, onEnd)
	      self.pendingCssEvent = self.pendingCssCb = null
	      if (!self.pendingJsCb && cb) {
	        cb()
	      }
	    }
	  }
	  _.on(el, event, onEnd)
	}

	module.exports = Transition


/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(8)
	var queue = []
	var queued = false

	/**
	 * Push a job into the queue.
	 *
	 * @param {Function} job
	 */

	exports.push = function (job) {
	  queue.push(job)
	  if (!queued) {
	    queued = true
	    _.nextTick(flush)
	  }
	}

	/**
	 * Flush the queue, and do one forced reflow before
	 * triggering transitions.
	 */

	function flush () {
	  // Force layout
	  var f = document.documentElement.offsetHeight
	  for (var i = 0; i < queue.length; i++) {
	    queue[i]()
	  }
	  queue = []
	  queued = false
	  // dummy return, so js linters don't complain about
	  // unused variable f
	  return f
	}


/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var _ = __webpack_require__(8)

	module.exports = {

	  acceptStatement: true,
	  priority: 700,

	  bind: function () {
	    // deal with iframes
	    if (
	      this.el.tagName === 'IFRAME' &&
	      this.arg !== 'load'
	    ) {
	      var self = this
	      this.iframeBind = function () {
	        _.on(self.el.contentWindow, self.arg, self.handler)
	      }
	      this.on('load', this.iframeBind)
	    }
	  },

	  update: function (handler) {
	    if (typeof handler !== 'function') {
	      process.env.NODE_ENV !== 'production' && _.warn(
	        'Directive v-on="' + this.arg + ': ' +
	        this.expression + '" expects a function value, ' +
	        'got ' + handler
	      )
	      return
	    }
	    this.reset()
	    var vm = this.vm
	    this.handler = function (e) {
	      e.targetVM = vm
	      vm.$event = e
	      var res = handler(e)
	      vm.$event = null
	      return res
	    }
	    if (this.iframeBind) {
	      this.iframeBind()
	    } else {
	      _.on(this.el, this.arg, this.handler)
	    }
	  },

	  reset: function () {
	    var el = this.iframeBind
	      ? this.el.contentWindow
	      : this.el
	    if (this.handler) {
	      _.off(el, this.arg, this.handler)
	    }
	  },

	  unbind: function () {
	    this.reset()
	  }
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(12)))

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var _ = __webpack_require__(8)

	var handlers = {
	  text: __webpack_require__(49),
	  radio: __webpack_require__(50),
	  select: __webpack_require__(51),
	  checkbox: __webpack_require__(52)
	}

	module.exports = {

	  priority: 800,
	  twoWay: true,
	  handlers: handlers,

	  /**
	   * Possible elements:
	   *   <select>
	   *   <textarea>
	   *   <input type="*">
	   *     - text
	   *     - checkbox
	   *     - radio
	   *     - number
	   *     - TODO: more types may be supplied as a plugin
	   */

	  bind: function () {
	    // friendly warning...
	    this.checkFilters()
	    if (this.hasRead && !this.hasWrite) {
	      process.env.NODE_ENV !== 'production' && _.warn(
	        'It seems you are using a read-only filter with ' +
	        'v-model. You might want to use a two-way filter ' +
	        'to ensure correct behavior.'
	      )
	    }
	    var el = this.el
	    var tag = el.tagName
	    var handler
	    if (tag === 'INPUT') {
	      handler = handlers[el.type] || handlers.text
	    } else if (tag === 'SELECT') {
	      handler = handlers.select
	    } else if (tag === 'TEXTAREA') {
	      handler = handlers.text
	    } else {
	      process.env.NODE_ENV !== 'production' && _.warn(
	        'v-model does not support element type: ' + tag
	      )
	      return
	    }
	    handler.bind.call(this)
	    this.update = handler.update
	    this.unbind = handler.unbind
	  },

	  /**
	   * Check read/write filter stats.
	   */

	  checkFilters: function () {
	    var filters = this.filters
	    if (!filters) return
	    var i = filters.length
	    while (i--) {
	      var filter = _.resolveAsset(this.vm.$options, 'filters', filters[i].name)
	      if (typeof filter === 'function' || filter.read) {
	        this.hasRead = true
	      }
	      if (filter.write) {
	        this.hasWrite = true
	      }
	    }
	  }
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(12)))

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(8)

	module.exports = {

	  bind: function () {
	    var self = this
	    var el = this.el
	    var isRange = el.type === 'range'

	    // check params
	    // - lazy: update model on "change" instead of "input"
	    var lazy = this._checkParam('lazy') != null
	    // - number: cast value into number when updating model.
	    var number = this._checkParam('number') != null
	    // - debounce: debounce the input listener
	    var debounce = parseInt(this._checkParam('debounce'), 10)

	    // handle composition events.
	    //   http://blog.evanyou.me/2014/01/03/composition-event/
	    // skip this for Android because it handles composition
	    // events quite differently. Android doesn't trigger
	    // composition events for language input methods e.g.
	    // Chinese, but instead triggers them for spelling
	    // suggestions... (see Discussion/#162)
	    var composing = false
	    if (!_.isAndroid && !isRange) {
	      this.on('compositionstart', function () {
	        composing = true
	      })
	      this.on('compositionend', function () {
	        composing = false
	        // in IE11 the "compositionend" event fires AFTER
	        // the "input" event, so the input handler is blocked
	        // at the end... have to call it here.
	        self.listener()
	      })
	    }

	    // prevent messing with the input when user is typing,
	    // and force update on blur.
	    this.focused = false
	    if (!isRange) {
	      this.on('focus', function () {
	        self.focused = true
	      })
	      this.on('blur', function () {
	        self.focused = false
	        self.listener()
	      })
	    }

	    // Now attach the main listener
	    this.listener = function () {
	      if (composing) return
	      var val = number || isRange
	        ? _.toNumber(el.value)
	        : el.value
	      self.set(val)
	      // force update on next tick to avoid lock & same value
	      // also only update when user is not typing
	      _.nextTick(function () {
	        if (self._bound && !self.focused) {
	          self.update(self._watcher.value)
	        }
	      })
	    }
	    if (debounce) {
	      this.listener = _.debounce(this.listener, debounce)
	    }

	    // Support jQuery events, since jQuery.trigger() doesn't
	    // trigger native events in some cases and some plugins
	    // rely on $.trigger()
	    //
	    // We want to make sure if a listener is attached using
	    // jQuery, it is also removed with jQuery, that's why
	    // we do the check for each directive instance and
	    // store that check result on itself. This also allows
	    // easier test coverage control by unsetting the global
	    // jQuery variable in tests.
	    this.hasjQuery = typeof jQuery === 'function'
	    if (this.hasjQuery) {
	      jQuery(el).on('change', this.listener)
	      if (!lazy) {
	        jQuery(el).on('input', this.listener)
	      }
	    } else {
	      this.on('change', this.listener)
	      if (!lazy) {
	        this.on('input', this.listener)
	      }
	    }

	    // IE9 doesn't fire input event on backspace/del/cut
	    if (!lazy && _.isIE9) {
	      this.on('cut', function () {
	        _.nextTick(self.listener)
	      })
	      this.on('keyup', function (e) {
	        if (e.keyCode === 46 || e.keyCode === 8) {
	          self.listener()
	        }
	      })
	    }

	    // set initial value if present
	    if (
	      el.hasAttribute('value') ||
	      (el.tagName === 'TEXTAREA' && el.value.trim())
	    ) {
	      this._initValue = number
	        ? _.toNumber(el.value)
	        : el.value
	    }
	  },

	  update: function (value) {
	    this.el.value = _.toString(value)
	  },

	  unbind: function () {
	    var el = this.el
	    if (this.hasjQuery) {
	      jQuery(el).off('change', this.listener)
	      jQuery(el).off('input', this.listener)
	    }
	  }
	}


/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(8)

	module.exports = {

	  bind: function () {
	    var self = this
	    var el = this.el
	    var number = this._checkParam('number') != null
	    var expression = this._checkParam('exp')

	    this.getValue = function () {
	      var val = el.value
	      if (number) {
	        val = _.toNumber(val)
	      } else if (expression !== null) {
	        val = self.vm.$eval(expression)
	      }
	      return val
	    }

	    this.on('change', function () {
	      self.set(self.getValue())
	    })

	    if (el.checked) {
	      this._initValue = this.getValue()
	    }
	  },

	  update: function (value) {
	    this.el.checked = _.looseEqual(value, this.getValue())
	  }
	}


/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var _ = __webpack_require__(8)
	var Watcher = __webpack_require__(25)
	var dirParser = __webpack_require__(23)

	module.exports = {

	  bind: function () {
	    var self = this
	    var el = this.el

	    // method to force update DOM using latest value.
	    this.forceUpdate = function () {
	      if (self._watcher) {
	        self.update(self._watcher.get())
	      }
	    }

	    // check options param
	    var optionsParam = this._checkParam('options')
	    if (optionsParam) {
	      initOptions.call(this, optionsParam)
	    }
	    this.number = this._checkParam('number') != null
	    this.multiple = el.hasAttribute('multiple')

	    // attach listener
	    this.on('change', function () {
	      var value = getValue(el, self.multiple)
	      value = self.number
	        ? _.isArray(value)
	          ? value.map(_.toNumber)
	          : _.toNumber(value)
	        : value
	      self.set(value)
	    })

	    // check initial value (inline selected attribute)
	    checkInitialValue.call(this)

	    // All major browsers except Firefox resets
	    // selectedIndex with value -1 to 0 when the element
	    // is appended to a new parent, therefore we have to
	    // force a DOM update whenever that happens...
	    this.vm.$on('hook:attached', this.forceUpdate)
	  },

	  update: function (value) {
	    var el = this.el
	    el.selectedIndex = -1
	    if (value == null) {
	      if (this.defaultOption) {
	        this.defaultOption.selected = true
	      }
	      return
	    }
	    var multi = this.multiple && _.isArray(value)
	    var options = el.options
	    var i = options.length
	    var op, val
	    while (i--) {
	      op = options[i]
	      val = op.hasOwnProperty('_value')
	        ? op._value
	        : op.value
	      /* eslint-disable eqeqeq */
	      op.selected = multi
	        ? indexOf(value, val) > -1
	        : _.looseEqual(value, val)
	      /* eslint-enable eqeqeq */
	    }
	  },

	  unbind: function () {
	    this.vm.$off('hook:attached', this.forceUpdate)
	    if (this.optionWatcher) {
	      this.optionWatcher.teardown()
	    }
	  }
	}

	/**
	 * Initialize the option list from the param.
	 *
	 * @param {String} expression
	 */

	function initOptions (expression) {
	  var self = this
	  var el = self.el
	  var defaultOption = self.defaultOption = self.el.options[0]
	  var descriptor = dirParser.parse(expression)[0]
	  function optionUpdateWatcher (value) {
	    if (_.isArray(value)) {
	      // clear old options.
	      // cannot reset innerHTML here because IE family get
	      // confused during compilation.
	      var i = el.options.length
	      while (i--) {
	        var option = el.options[i]
	        if (option !== defaultOption) {
	          el.removeChild(option)
	        }
	      }
	      buildOptions(el, value)
	      self.forceUpdate()
	    } else {
	      process.env.NODE_ENV !== 'production' && _.warn(
	        'Invalid options value for v-model: ' + value
	      )
	    }
	  }
	  this.optionWatcher = new Watcher(
	    this.vm,
	    descriptor.expression,
	    optionUpdateWatcher,
	    {
	      deep: true,
	      filters: descriptor.filters
	    }
	  )
	  // update with initial value
	  optionUpdateWatcher(this.optionWatcher.value)
	}

	/**
	 * Build up option elements. IE9 doesn't create options
	 * when setting innerHTML on <select> elements, so we have
	 * to use DOM API here.
	 *
	 * @param {Element} parent - a <select> or an <optgroup>
	 * @param {Array} options
	 */

	function buildOptions (parent, options) {
	  var op, el
	  for (var i = 0, l = options.length; i < l; i++) {
	    op = options[i]
	    if (!op.options) {
	      el = document.createElement('option')
	      if (typeof op === 'string') {
	        el.text = el.value = op
	      } else {
	        if (op.value != null && !_.isObject(op.value)) {
	          el.value = op.value
	        }
	        // object values gets serialized when set as value,
	        // so we store the raw value as a different property
	        el._value = op.value
	        el.text = op.text || ''
	        if (op.disabled) {
	          el.disabled = true
	        }
	      }
	    } else {
	      el = document.createElement('optgroup')
	      el.label = op.label
	      buildOptions(el, op.options)
	    }
	    parent.appendChild(el)
	  }
	}

	/**
	 * Check the initial value for selected options.
	 */

	function checkInitialValue () {
	  var initValue
	  var options = this.el.options
	  for (var i = 0, l = options.length; i < l; i++) {
	    if (options[i].hasAttribute('selected')) {
	      if (this.multiple) {
	        (initValue || (initValue = []))
	          .push(options[i].value)
	      } else {
	        initValue = options[i].value
	      }
	    }
	  }
	  if (typeof initValue !== 'undefined') {
	    this._initValue = this.number
	      ? _.toNumber(initValue)
	      : initValue
	  }
	}

	/**
	 * Get select value
	 *
	 * @param {SelectElement} el
	 * @param {Boolean} multi
	 * @return {Array|*}
	 */

	function getValue (el, multi) {
	  var res = multi ? [] : null
	  var op, val
	  for (var i = 0, l = el.options.length; i < l; i++) {
	    op = el.options[i]
	    if (op.selected) {
	      val = op.hasOwnProperty('_value')
	        ? op._value
	        : op.value
	      if (multi) {
	        res.push(val)
	      } else {
	        return val
	      }
	    }
	  }
	  return res
	}

	/**
	 * Native Array.indexOf uses strict equal, but in this
	 * case we need to match string/numbers with custom equal.
	 *
	 * @param {Array} arr
	 * @param {*} val
	 */

	function indexOf (arr, val) {
	  var i = arr.length
	  while (i--) {
	    if (_.looseEqual(arr[i], val)) {
	      return i
	    }
	  }
	  return -1
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(12)))

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(8)

	module.exports = {

	  bind: function () {
	    var self = this
	    var el = this.el
	    var trueExp = this._checkParam('true-exp')
	    var falseExp = this._checkParam('false-exp')

	    this._matchValue = function (value) {
	      if (trueExp !== null) {
	        return _.looseEqual(value, self.vm.$eval(trueExp))
	      } else {
	        return !!value
	      }
	    }

	    function getValue () {
	      var val = el.checked
	      if (val && trueExp !== null) {
	        val = self.vm.$eval(trueExp)
	      }
	      if (!val && falseExp !== null) {
	        val = self.vm.$eval(falseExp)
	      }
	      return val
	    }

	    this.on('change', function () {
	      self.set(getValue())
	    })

	    if (el.checked) {
	      this._initValue = getValue()
	    }
	  },

	  update: function (value) {
	    this.el.checked = this._matchValue(value)
	  }
	}


/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var _ = __webpack_require__(8)
	var config = __webpack_require__(13)
	var isObject = _.isObject
	var isPlainObject = _.isPlainObject
	var textParser = __webpack_require__(21)
	var expParser = __webpack_require__(27)
	var templateParser = __webpack_require__(30)
	var compiler = __webpack_require__(18)
	var uid = 0

	// async component resolution states
	var UNRESOLVED = 0
	var PENDING = 1
	var RESOLVED = 2
	var ABORTED = 3

	module.exports = {

	  /**
	   * Setup.
	   */

	  bind: function () {
	    // support for item in array syntax
	    var inMatch = this.expression.match(/(.*) in (.*)/)
	    if (inMatch) {
	      this.arg = inMatch[1]
	      this._watcherExp = inMatch[2]
	    }
	    // uid as a cache identifier
	    this.id = '__v_repeat_' + (++uid)

	    // setup anchor nodes
	    this.start = _.createAnchor('v-repeat-start')
	    this.end = _.createAnchor('v-repeat-end')
	    _.replace(this.el, this.end)
	    _.before(this.start, this.end)

	    // check if this is a block repeat
	    this.template = _.isTemplate(this.el)
	      ? templateParser.parse(this.el, true)
	      : this.el

	    // check for trackby param
	    this.idKey = this._checkParam('track-by')
	    // check for transition stagger
	    var stagger = +this._checkParam('stagger')
	    this.enterStagger = +this._checkParam('enter-stagger') || stagger
	    this.leaveStagger = +this._checkParam('leave-stagger') || stagger

	    // check for v-ref/v-el
	    this.refID = this._checkParam(config.prefix + 'ref')
	    this.elID = this._checkParam(config.prefix + 'el')

	    // check other directives that need to be handled
	    // at v-repeat level
	    this.checkIf()
	    this.checkComponent()

	    // create cache object
	    this.cache = Object.create(null)

	    // some helpful tips...
	    /* istanbul ignore if */
	    if (
	      process.env.NODE_ENV !== 'production' &&
	      this.el.tagName === 'OPTION'
	    ) {
	      _.warn(
	        'Don\'t use v-repeat for v-model options; ' +
	        'use the `options` param instead: ' +
	        'http://vuejs.org/guide/forms.html#Dynamic_Select_Options'
	      )
	    }
	  },

	  /**
	   * Warn against v-if usage.
	   */

	  checkIf: function () {
	    if (_.attr(this.el, 'if') !== null) {
	      process.env.NODE_ENV !== 'production' && _.warn(
	        'Don\'t use v-if with v-repeat. ' +
	        'Use v-show or the "filterBy" filter instead.'
	      )
	    }
	  },

	  /**
	   * Check the component constructor to use for repeated
	   * instances. If static we resolve it now, otherwise it
	   * needs to be resolved at build time with actual data.
	   */

	  checkComponent: function () {
	    this.componentState = UNRESOLVED
	    var options = this.vm.$options
	    var id = _.checkComponent(this.el, options)
	    if (!id) {
	      // default constructor
	      this.Component = _.Vue
	      // inline repeats should inherit
	      this.inline = true
	      // important: transclude with no options, just
	      // to ensure block start and block end
	      this.template = compiler.transclude(this.template)
	      var copy = _.extend({}, options)
	      copy._asComponent = false
	      this._linkFn = compiler.compile(this.template, copy)
	    } else {
	      this.Component = null
	      this.asComponent = true
	      // check inline-template
	      if (this._checkParam('inline-template') !== null) {
	        // extract inline template as a DocumentFragment
	        this.inlineTemplate = _.extractContent(this.el, true)
	      }
	      var tokens = textParser.parse(id)
	      if (tokens) {
	        // dynamic component to be resolved later
	        var componentExp = textParser.tokensToExp(tokens)
	        this.componentGetter = expParser.parse(componentExp).get
	      } else {
	        // static
	        this.componentId = id
	        this.pendingData = null
	      }
	    }
	  },

	  resolveComponent: function () {
	    this.componentState = PENDING
	    this.vm._resolveComponent(this.componentId, _.bind(function (Component) {
	      if (this.componentState === ABORTED) {
	        return
	      }
	      this.Component = Component
	      this.componentState = RESOLVED
	      this.realUpdate(this.pendingData)
	      this.pendingData = null
	    }, this))
	  },

	  /**
	   * Resolve a dynamic component to use for an instance.
	   * The tricky part here is that there could be dynamic
	   * components depending on instance data.
	   *
	   * @param {Object} data
	   * @param {Object} meta
	   * @return {Function}
	   */

	  resolveDynamicComponent: function (data, meta) {
	    // create a temporary context object and copy data
	    // and meta properties onto it.
	    // use _.define to avoid accidentally overwriting scope
	    // properties.
	    var context = Object.create(this.vm)
	    var key
	    for (key in data) {
	      _.define(context, key, data[key])
	    }
	    for (key in meta) {
	      _.define(context, key, meta[key])
	    }
	    var id = this.componentGetter.call(context, context)
	    var Component = _.resolveAsset(this.vm.$options, 'components', id)
	    if (process.env.NODE_ENV !== 'production') {
	      _.assertAsset(Component, 'component', id)
	    }
	    if (!Component.options) {
	      process.env.NODE_ENV !== 'production' && _.warn(
	        'Async resolution is not supported for v-repeat ' +
	        '+ dynamic component. (component: ' + id + ')'
	      )
	      return _.Vue
	    }
	    return Component
	  },

	  /**
	   * Update.
	   * This is called whenever the Array mutates. If we have
	   * a component, we might need to wait for it to resolve
	   * asynchronously.
	   *
	   * @param {Array|Number|String} data
	   */

	  update: function (data) {
	    if (this.componentId) {
	      var state = this.componentState
	      if (state === UNRESOLVED) {
	        this.pendingData = data
	        // once resolved, it will call realUpdate
	        this.resolveComponent()
	      } else if (state === PENDING) {
	        this.pendingData = data
	      } else if (state === RESOLVED) {
	        this.realUpdate(data)
	      }
	    } else {
	      this.realUpdate(data)
	    }
	  },

	  /**
	   * The real update that actually modifies the DOM.
	   *
	   * @param {Array|Number|String} data
	   */

	  realUpdate: function (data) {
	    this.vms = this.diff(data, this.vms)
	    // update v-ref
	    if (this.refID) {
	      this.vm.$[this.refID] = this.converted
	        ? toRefObject(this.vms)
	        : this.vms
	    }
	    if (this.elID) {
	      this.vm.$$[this.elID] = this.vms.map(function (vm) {
	        return vm.$el
	      })
	    }
	  },

	  /**
	   * Diff, based on new data and old data, determine the
	   * minimum amount of DOM manipulations needed to make the
	   * DOM reflect the new data Array.
	   *
	   * The algorithm diffs the new data Array by storing a
	   * hidden reference to an owner vm instance on previously
	   * seen data. This allows us to achieve O(n) which is
	   * better than a levenshtein distance based algorithm,
	   * which is O(m * n).
	   *
	   * @param {Array} data
	   * @param {Array} oldVms
	   * @return {Array}
	   */

	  diff: function (data, oldVms) {
	    var idKey = this.idKey
	    var converted = this.converted
	    var start = this.start
	    var end = this.end
	    var inDoc = _.inDoc(start)
	    var alias = this.arg
	    var init = !oldVms
	    var vms = new Array(data.length)
	    var obj, raw, vm, i, l, primitive
	    // First pass, go through the new Array and fill up
	    // the new vms array. If a piece of data has a cached
	    // instance for it, we reuse it. Otherwise build a new
	    // instance.
	    for (i = 0, l = data.length; i < l; i++) {
	      obj = data[i]
	      raw = converted ? obj.$value : obj
	      primitive = !isObject(raw)
	      vm = !init && this.getVm(raw, i, converted ? obj.$key : null)
	      if (vm) { // reusable instance
	        vm._reused = true
	        vm.$index = i // update $index
	        // update data for track-by or object repeat,
	        // since in these two cases the data is replaced
	        // rather than mutated.
	        if (idKey || converted || primitive) {
	          if (alias) {
	            vm[alias] = raw
	          } else if (_.isPlainObject(raw)) {
	            vm.$data = raw
	          } else {
	            vm.$value = raw
	          }
	        }
	      } else { // new instance
	        vm = this.build(obj, i, true)
	        vm._reused = false
	      }
	      vms[i] = vm
	      // insert if this is first run
	      if (init) {
	        vm.$before(end)
	      }
	    }
	    // if this is the first run, we're done.
	    if (init) {
	      return vms
	    }
	    // Second pass, go through the old vm instances and
	    // destroy those who are not reused (and remove them
	    // from cache)
	    var removalIndex = 0
	    var totalRemoved = oldVms.length - vms.length
	    for (i = 0, l = oldVms.length; i < l; i++) {
	      vm = oldVms[i]
	      if (!vm._reused) {
	        this.uncacheVm(vm)
	        vm.$destroy(false, true) // defer cleanup until removal
	        this.remove(vm, removalIndex++, totalRemoved, inDoc)
	      }
	    }
	    // final pass, move/insert new instances into the
	    // right place.
	    var targetPrev, prevEl, currentPrev
	    var insertionIndex = 0
	    for (i = 0, l = vms.length; i < l; i++) {
	      vm = vms[i]
	      // this is the vm that we should be after
	      targetPrev = vms[i - 1]
	      prevEl = targetPrev
	        ? targetPrev._staggerCb
	          ? targetPrev._staggerAnchor
	          : targetPrev._fragmentEnd || targetPrev.$el
	        : start
	      if (vm._reused && !vm._staggerCb) {
	        currentPrev = findPrevVm(vm, start, this.id)
	        if (currentPrev !== targetPrev) {
	          this.move(vm, prevEl)
	        }
	      } else {
	        // new instance, or still in stagger.
	        // insert with updated stagger index.
	        this.insert(vm, insertionIndex++, prevEl, inDoc)
	      }
	      vm._reused = false
	    }
	    return vms
	  },

	  /**
	   * Build a new instance and cache it.
	   *
	   * @param {Object} data
	   * @param {Number} index
	   * @param {Boolean} needCache
	   */

	  build: function (data, index, needCache) {
	    var meta = { $index: index }
	    if (this.converted) {
	      meta.$key = data.$key
	    }
	    var raw = this.converted ? data.$value : data
	    var alias = this.arg
	    if (alias) {
	      data = {}
	      data[alias] = raw
	    } else if (!isPlainObject(raw)) {
	      // non-object values
	      data = {}
	      meta.$value = raw
	    } else {
	      // default
	      data = raw
	    }
	    // resolve constructor
	    var Component = this.Component || this.resolveDynamicComponent(data, meta)
	    var parent = this._host || this.vm
	    var vm = parent.$addChild({
	      el: templateParser.clone(this.template),
	      data: data,
	      inherit: this.inline,
	      template: this.inlineTemplate,
	      // repeater meta, e.g. $index, $key
	      _meta: meta,
	      // mark this as an inline-repeat instance
	      _repeat: this.inline,
	      // is this a component?
	      _asComponent: this.asComponent,
	      // linker cachable if no inline-template
	      _linkerCachable: !this.inlineTemplate && Component !== _.Vue,
	      // pre-compiled linker for simple repeats
	      _linkFn: this._linkFn,
	      // identifier, shows that this vm belongs to this collection
	      _repeatId: this.id,
	      // transclusion content owner
	      _context: this.vm
	    }, Component)
	    // cache instance
	    if (needCache) {
	      this.cacheVm(raw, vm, index, this.converted ? meta.$key : null)
	    }
	    // sync back changes for two-way bindings of primitive values
	    var dir = this
	    if (this.rawType === 'object' && isPrimitive(raw)) {
	      vm.$watch(alias || '$value', function (val) {
	        if (dir.filters) {
	          process.env.NODE_ENV !== 'production' && _.warn(
	            'You seem to be mutating the $value reference of ' +
	            'a v-repeat instance (likely through v-model) ' +
	            'and filtering the v-repeat at the same time. ' +
	            'This will not work properly with an Array of ' +
	            'primitive values. Please use an Array of ' +
	            'Objects instead.'
	          )
	        }
	        dir._withLock(function () {
	          if (dir.converted) {
	            dir.rawValue[vm.$key] = val
	          } else {
	            dir.rawValue.$set(vm.$index, val)
	          }
	        })
	      })
	    }
	    return vm
	  },

	  /**
	   * Unbind, teardown everything
	   */

	  unbind: function () {
	    this.componentState = ABORTED
	    if (this.refID) {
	      this.vm.$[this.refID] = null
	    }
	    if (this.vms) {
	      var i = this.vms.length
	      var vm
	      while (i--) {
	        vm = this.vms[i]
	        this.uncacheVm(vm)
	        vm.$destroy()
	      }
	    }
	  },

	  /**
	   * Cache a vm instance based on its data.
	   *
	   * If the data is an object, we save the vm's reference on
	   * the data object as a hidden property. Otherwise we
	   * cache them in an object and for each primitive value
	   * there is an array in case there are duplicates.
	   *
	   * @param {Object} data
	   * @param {Vue} vm
	   * @param {Number} index
	   * @param {String} [key]
	   */

	  cacheVm: function (data, vm, index, key) {
	    var idKey = this.idKey
	    var cache = this.cache
	    var primitive = !isObject(data)
	    var id
	    if (key || idKey || primitive) {
	      id = idKey
	        ? idKey === '$index'
	          ? index
	          : data[idKey]
	        : (key || index)
	      if (!cache[id]) {
	        cache[id] = vm
	      } else if (!primitive && idKey !== '$index') {
	        process.env.NODE_ENV !== 'production' && _.warn(
	          'Duplicate track-by key in v-repeat: ' + id
	        )
	      }
	    } else {
	      id = this.id
	      if (data.hasOwnProperty(id)) {
	        if (data[id] === null) {
	          data[id] = vm
	        } else {
	          process.env.NODE_ENV !== 'production' && _.warn(
	            'Duplicate objects are not supported in v-repeat ' +
	            'when using components or transitions.'
	          )
	        }
	      } else {
	        _.define(data, id, vm)
	      }
	    }
	    vm._raw = data
	  },

	  /**
	   * Try to get a cached instance from a piece of data.
	   *
	   * @param {Object} data
	   * @param {Number} index
	   * @param {String} [key]
	   * @return {Vue|undefined}
	   */

	  getVm: function (data, index, key) {
	    var idKey = this.idKey
	    var primitive = !isObject(data)
	    if (key || idKey || primitive) {
	      var id = idKey
	        ? idKey === '$index'
	          ? index
	          : data[idKey]
	        : (key || index)
	      return this.cache[id]
	    } else {
	      return data[this.id]
	    }
	  },

	  /**
	   * Delete a cached vm instance.
	   *
	   * @param {Vue} vm
	   */

	  uncacheVm: function (vm) {
	    var data = vm._raw
	    var idKey = this.idKey
	    var index = vm.$index
	    // fix #948: avoid accidentally fall through to
	    // a parent repeater which happens to have $key.
	    var key = vm.hasOwnProperty('$key') && vm.$key
	    var primitive = !isObject(data)
	    if (idKey || key || primitive) {
	      var id = idKey
	        ? idKey === '$index'
	          ? index
	          : data[idKey]
	        : (key || index)
	      this.cache[id] = null
	    } else {
	      data[this.id] = null
	      vm._raw = null
	    }
	  },

	  /**
	   * Insert an instance.
	   *
	   * @param {Vue} vm
	   * @param {Number} index
	   * @param {Node} prevEl
	   * @param {Boolean} inDoc
	   */

	  insert: function (vm, index, prevEl, inDoc) {
	    if (vm._staggerCb) {
	      vm._staggerCb.cancel()
	      vm._staggerCb = null
	    }
	    var staggerAmount = this.getStagger(vm, index, null, 'enter')
	    if (inDoc && staggerAmount) {
	      // create an anchor and insert it synchronously,
	      // so that we can resolve the correct order without
	      // worrying about some elements not inserted yet
	      var anchor = vm._staggerAnchor
	      if (!anchor) {
	        anchor = vm._staggerAnchor = _.createAnchor('stagger-anchor')
	        anchor.__vue__ = vm
	      }
	      _.after(anchor, prevEl)
	      var op = vm._staggerCb = _.cancellable(function () {
	        vm._staggerCb = null
	        vm.$before(anchor)
	        _.remove(anchor)
	      })
	      setTimeout(op, staggerAmount)
	    } else {
	      vm.$after(prevEl)
	    }
	  },

	  /**
	   * Move an already inserted instance.
	   *
	   * @param {Vue} vm
	   * @param {Node} prevEl
	   */

	  move: function (vm, prevEl) {
	    vm.$after(prevEl, null, false)
	  },

	  /**
	   * Remove an instance.
	   *
	   * @param {Vue} vm
	   * @param {Number} index
	   * @param {Boolean} inDoc
	   */

	  remove: function (vm, index, total, inDoc) {
	    if (vm._staggerCb) {
	      vm._staggerCb.cancel()
	      vm._staggerCb = null
	      // it's not possible for the same vm to be removed
	      // twice, so if we have a pending stagger callback,
	      // it means this vm is queued for enter but removed
	      // before its transition started. Since it is already
	      // destroyed, we can just leave it in detached state.
	      return
	    }
	    var staggerAmount = this.getStagger(vm, index, total, 'leave')
	    if (inDoc && staggerAmount) {
	      var op = vm._staggerCb = _.cancellable(function () {
	        vm._staggerCb = null
	        remove()
	      })
	      setTimeout(op, staggerAmount)
	    } else {
	      remove()
	    }
	    function remove () {
	      vm.$remove(function () {
	        vm._cleanup()
	      })
	    }
	  },

	  /**
	   * Get the stagger amount for an insertion/removal.
	   *
	   * @param {Vue} vm
	   * @param {Number} index
	   * @param {String} type
	   * @param {Number} total
	   */

	  getStagger: function (vm, index, total, type) {
	    type = type + 'Stagger'
	    var transition = vm.$el.__v_trans
	    var hooks = transition && transition.hooks
	    var hook = hooks && (hooks[type] || hooks.stagger)
	    return hook
	      ? hook.call(vm, index, total)
	      : index * this[type]
	  },

	  /**
	   * Pre-process the value before piping it through the
	   * filters, and convert non-Array objects to arrays.
	   *
	   * This function will be bound to this directive instance
	   * and passed into the watcher.
	   *
	   * @param {*} value
	   * @return {Array}
	   * @private
	   */

	  _preProcess: function (value) {
	    // regardless of type, store the un-filtered raw value.
	    this.rawValue = value
	    var type = this.rawType = typeof value
	    if (!isPlainObject(value)) {
	      this.converted = false
	      if (type === 'number') {
	        value = range(value)
	      } else if (type === 'string') {
	        value = _.toArray(value)
	      }
	      return value || []
	    } else {
	      // convert plain object to array.
	      var keys = Object.keys(value)
	      var i = keys.length
	      var res = new Array(i)
	      var key
	      while (i--) {
	        key = keys[i]
	        res[i] = {
	          $key: key,
	          $value: value[key]
	        }
	      }
	      this.converted = true
	      return res
	    }
	  }
	}

	/**
	 * Helper to find the previous element that is an instance
	 * root node. This is necessary because a destroyed vm's
	 * element could still be lingering in the DOM before its
	 * leaving transition finishes, but its __vue__ reference
	 * should have been removed so we can skip them.
	 *
	 * If this is a block repeat, we want to make sure we only
	 * return vm that is bound to this v-repeat. (see #929)
	 *
	 * @param {Vue} vm
	 * @param {Comment|Text} anchor
	 * @return {Vue}
	 */

	function findPrevVm (vm, anchor, id) {
	  var el = vm.$el.previousSibling
	  /* istanbul ignore if */
	  if (!el) return
	  while (
	    (!el.__vue__ || el.__vue__.$options._repeatId !== id) &&
	    el !== anchor
	  ) {
	    el = el.previousSibling
	  }
	  return el.__vue__
	}

	/**
	 * Create a range array from given number.
	 *
	 * @param {Number} n
	 * @return {Array}
	 */

	function range (n) {
	  var i = -1
	  var ret = new Array(n)
	  while (++i < n) {
	    ret[i] = i
	  }
	  return ret
	}

	/**
	 * Convert a vms array to an object ref for v-ref on an
	 * Object value.
	 *
	 * @param {Array} vms
	 * @return {Object}
	 */

	function toRefObject (vms) {
	  var ref = {}
	  for (var i = 0, l = vms.length; i < l; i++) {
	    ref[vms[i].$key] = vms[i]
	  }
	  return ref
	}

	/**
	 * Check if a value is a primitive one:
	 * String, Number, Boolean, null or undefined.
	 *
	 * @param {*} value
	 * @return {Boolean}
	 */

	function isPrimitive (value) {
	  var type = typeof value
	  return value == null ||
	    type === 'string' ||
	    type === 'number' ||
	    type === 'boolean'
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(12)))

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var _ = __webpack_require__(8)
	var compiler = __webpack_require__(18)
	var templateParser = __webpack_require__(30)
	var transition = __webpack_require__(38)
	var Cache = __webpack_require__(22)
	var cache = new Cache(1000)

	module.exports = {

	  bind: function () {
	    var el = this.el
	    if (!el.__vue__) {
	      this.start = _.createAnchor('v-if-start')
	      this.end = _.createAnchor('v-if-end')
	      _.replace(el, this.end)
	      _.before(this.start, this.end)
	      if (_.isTemplate(el)) {
	        this.template = templateParser.parse(el, true)
	      } else {
	        this.template = document.createDocumentFragment()
	        this.template.appendChild(templateParser.clone(el))
	      }
	      // compile the nested partial
	      var cacheId = (this.vm.constructor.cid || '') + el.outerHTML
	      this.linker = cache.get(cacheId)
	      if (!this.linker) {
	        this.linker = compiler.compile(
	          this.template,
	          this.vm.$options,
	          true // partial
	        )
	        cache.put(cacheId, this.linker)
	      }
	    } else {
	      process.env.NODE_ENV !== 'production' && _.warn(
	        'v-if="' + this.expression + '" cannot be ' +
	        'used on an instance root element.'
	      )
	      this.invalid = true
	    }
	  },

	  update: function (value) {
	    if (this.invalid) return
	    if (value) {
	      // avoid duplicate compiles, since update() can be
	      // called with different truthy values
	      if (!this.unlink) {
	        this.link(
	          templateParser.clone(this.template),
	          this.linker
	        )
	      }
	    } else {
	      this.teardown()
	    }
	  },

	  link: function (frag, linker) {
	    var vm = this.vm
	    this.unlink = linker(vm, frag, this._host /* important */)
	    transition.blockAppend(frag, this.end, vm)
	    // call attached for all the child components created
	    // during the compilation
	    if (_.inDoc(vm.$el)) {
	      var children = this.getContainedComponents()
	      if (children) children.forEach(callAttach)
	    }
	  },

	  teardown: function () {
	    if (!this.unlink) return
	    // collect children beforehand
	    var children
	    if (_.inDoc(this.vm.$el)) {
	      children = this.getContainedComponents()
	    }
	    transition.blockRemove(this.start, this.end, this.vm)
	    if (children) children.forEach(callDetach)
	    this.unlink()
	    this.unlink = null
	  },

	  getContainedComponents: function () {
	    var vm = this.vm
	    var start = this.start.nextSibling
	    var end = this.end

	    function contains (c) {
	      var cur = start
	      var next
	      while (next !== end) {
	        next = cur.nextSibling
	        if (
	          cur === c.$el ||
	          cur.contains && cur.contains(c.$el)
	        ) {
	          return true
	        }
	        cur = next
	      }
	      return false
	    }

	    return vm.$children.length &&
	      vm.$children.filter(contains)
	  },

	  unbind: function () {
	    if (this.unlink) this.unlink()
	  }

	}

	function callAttach (child) {
	  if (!child._isAttached) {
	    child._callHook('attached')
	  }
	}

	function callDetach (child) {
	  if (child._isAttached) {
	    child._callHook('detached')
	  }
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(12)))

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	exports.content = __webpack_require__(56)
	exports.partial = __webpack_require__(57)


/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(8)
	var clone = __webpack_require__(30).clone

	// This is the elementDirective that handles <content>
	// transclusions. It relies on the raw content of an
	// instance being stored as `$options._content` during
	// the transclude phase.

	module.exports = {

	  bind: function () {
	    var vm = this.vm
	    var host = vm
	    // we need find the content context, which is the
	    // closest non-inline-repeater instance.
	    while (host.$options._repeat) {
	      host = host.$parent
	    }
	    var raw = host.$options._content
	    var content
	    if (!raw) {
	      this.fallback()
	      return
	    }
	    var context = host._context
	    var selector = this._checkParam('select')
	    if (!selector) {
	      // Default content
	      var self = this
	      var compileDefaultContent = function () {
	        self.compile(
	          extractFragment(raw.childNodes, raw, true),
	          context,
	          vm
	        )
	      }
	      if (!host._isCompiled) {
	        // defer until the end of instance compilation,
	        // because the default outlet must wait until all
	        // other possible outlets with selectors have picked
	        // out their contents.
	        host.$once('hook:compiled', compileDefaultContent)
	      } else {
	        compileDefaultContent()
	      }
	    } else {
	      // select content
	      var nodes = raw.querySelectorAll(selector)
	      if (nodes.length) {
	        content = extractFragment(nodes, raw)
	        if (content.hasChildNodes()) {
	          this.compile(content, context, vm)
	        } else {
	          this.fallback()
	        }
	      } else {
	        this.fallback()
	      }
	    }
	  },

	  fallback: function () {
	    this.compile(_.extractContent(this.el, true), this.vm)
	  },

	  compile: function (content, context, host) {
	    if (content && context) {
	      this.unlink = context.$compile(content, host)
	    }
	    if (content) {
	      _.replace(this.el, content)
	    } else {
	      _.remove(this.el)
	    }
	  },

	  unbind: function () {
	    if (this.unlink) {
	      this.unlink()
	    }
	  }
	}

	/**
	 * Extract qualified content nodes from a node list.
	 *
	 * @param {NodeList} nodes
	 * @param {Element} parent
	 * @param {Boolean} main
	 * @return {DocumentFragment}
	 */

	function extractFragment (nodes, parent, main) {
	  var frag = document.createDocumentFragment()
	  for (var i = 0, l = nodes.length; i < l; i++) {
	    var node = nodes[i]
	    // if this is the main outlet, we want to skip all
	    // previously selected nodes;
	    // otherwise, we want to mark the node as selected.
	    // clone the node so the original raw content remains
	    // intact. this ensures proper re-compilation in cases
	    // where the outlet is inside a conditional block
	    if (main && !node.__v_selected) {
	      frag.appendChild(clone(node))
	    } else if (!main && node.parentNode === parent) {
	      node.__v_selected = true
	      frag.appendChild(clone(node))
	    }
	  }
	  return frag
	}


/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var _ = __webpack_require__(8)
	var templateParser = __webpack_require__(30)
	var textParser = __webpack_require__(21)
	var compiler = __webpack_require__(18)
	var Cache = __webpack_require__(22)
	var cache = new Cache(1000)

	// v-partial reuses logic from v-if
	var vIf = __webpack_require__(54)

	module.exports = {

	  link: vIf.link,
	  teardown: vIf.teardown,
	  getContainedComponents: vIf.getContainedComponents,

	  bind: function () {
	    var el = this.el
	    this.start = _.createAnchor('v-partial-start')
	    this.end = _.createAnchor('v-partial-end')
	    _.replace(el, this.end)
	    _.before(this.start, this.end)
	    var id = el.getAttribute('name')
	    var tokens = textParser.parse(id)
	    if (tokens) {
	      // dynamic partial
	      this.setupDynamic(tokens)
	    } else {
	      // static partial
	      this.insert(id)
	    }
	  },

	  setupDynamic: function (tokens) {
	    var self = this
	    var exp = textParser.tokensToExp(tokens)
	    this.unwatch = this.vm.$watch(exp, function (value) {
	      self.teardown()
	      self.insert(value)
	    }, {
	      immediate: true,
	      user: false
	    })
	  },

	  insert: function (id) {
	    var partial = _.resolveAsset(this.vm.$options, 'partials', id)
	    if (process.env.NODE_ENV !== 'production') {
	      _.assertAsset(partial, 'partial', id)
	    }
	    if (partial) {
	      var frag = templateParser.parse(partial, true)
	      // cache partials based on constructor id.
	      var cacheId = (this.vm.constructor.cid || '') + partial
	      var linker = this.compile(frag, cacheId)
	      // this is provided by v-if
	      this.link(frag, linker)
	    }
	  },

	  compile: function (frag, cacheId) {
	    var hit = cache.get(cacheId)
	    if (hit) return hit
	    var linker = compiler.compile(frag, this.vm.$options, true)
	    cache.put(cacheId, linker)
	    return linker
	  },

	  unbind: function () {
	    if (this.unlink) this.unlink()
	    if (this.unwatch) this.unwatch()
	  }
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(12)))

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(8)

	/**
	 * Stringify value.
	 *
	 * @param {Number} indent
	 */

	exports.json = {
	  read: function (value, indent) {
	    return typeof value === 'string'
	      ? value
	      : JSON.stringify(value, null, Number(indent) || 2)
	  },
	  write: function (value) {
	    try {
	      return JSON.parse(value)
	    } catch (e) {
	      return value
	    }
	  }
	}

	/**
	 * 'abc' => 'Abc'
	 */

	exports.capitalize = function (value) {
	  if (!value && value !== 0) return ''
	  value = value.toString()
	  return value.charAt(0).toUpperCase() + value.slice(1)
	}

	/**
	 * 'abc' => 'ABC'
	 */

	exports.uppercase = function (value) {
	  return (value || value === 0)
	    ? value.toString().toUpperCase()
	    : ''
	}

	/**
	 * 'AbC' => 'abc'
	 */

	exports.lowercase = function (value) {
	  return (value || value === 0)
	    ? value.toString().toLowerCase()
	    : ''
	}

	/**
	 * 12345 => $12,345.00
	 *
	 * @param {String} sign
	 */

	var digitsRE = /(\d{3})(?=\d)/g
	exports.currency = function (value, currency) {
	  value = parseFloat(value)
	  if (!isFinite(value) || (!value && value !== 0)) return ''
	  currency = currency != null ? currency : '$'
	  var stringified = Math.abs(value).toFixed(2)
	  var _int = stringified.slice(0, -3)
	  var i = _int.length % 3
	  var head = i > 0
	    ? (_int.slice(0, i) + (_int.length > 3 ? ',' : ''))
	    : ''
	  var _float = stringified.slice(-3)
	  var sign = value < 0 ? '-' : ''
	  return currency + sign + head +
	    _int.slice(i).replace(digitsRE, '$1,') +
	    _float
	}

	/**
	 * 'item' => 'items'
	 *
	 * @params
	 *  an array of strings corresponding to
	 *  the single, double, triple ... forms of the word to
	 *  be pluralized. When the number to be pluralized
	 *  exceeds the length of the args, it will use the last
	 *  entry in the array.
	 *
	 *  e.g. ['single', 'double', 'triple', 'multiple']
	 */

	exports.pluralize = function (value) {
	  var args = _.toArray(arguments, 1)
	  return args.length > 1
	    ? (args[value % 10 - 1] || args[args.length - 1])
	    : (args[0] + (value === 1 ? '' : 's'))
	}

	/**
	 * A special filter that takes a handler function,
	 * wraps it so it only gets triggered on specific
	 * keypresses. v-on only.
	 *
	 * @param {String} key
	 */

	var keyCodes = {
	  esc: 27,
	  tab: 9,
	  enter: 13,
	  'delete': 46,
	  up: 38,
	  left: 37,
	  right: 39,
	  down: 40
	}

	exports.key = function (handler, key) {
	  if (!handler) return
	  var code = keyCodes[key]
	  if (!code) {
	    code = parseInt(key, 10)
	  }
	  return function (e) {
	    if (e.keyCode === code) {
	      return handler.call(this, e)
	    }
	  }
	}

	// expose keycode hash
	exports.key.keyCodes = keyCodes

	exports.debounce = function (handler, delay) {
	  if (!handler) return
	  if (!delay) {
	    delay = 300
	  }
	  return _.debounce(handler, delay)
	}

	/**
	 * Install special array filters
	 */

	_.extend(exports, __webpack_require__(59))


/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(8)
	var Path = __webpack_require__(28)

	/**
	 * Filter filter for v-repeat
	 *
	 * @param {String} searchKey
	 * @param {String} [delimiter]
	 * @param {String} dataKey
	 */

	exports.filterBy = function (arr, search, delimiter /* ...dataKeys */) {
	  if (search == null) {
	    return arr
	  }
	  if (typeof search === 'function') {
	    return arr.filter(search)
	  }
	  // cast to lowercase string
	  search = ('' + search).toLowerCase()
	  // allow optional `in` delimiter
	  // because why not
	  var n = delimiter === 'in' ? 3 : 2
	  // extract and flatten keys
	  var keys = _.toArray(arguments, n).reduce(function (prev, cur) {
	    return prev.concat(cur)
	  }, [])
	  return arr.filter(function (item) {
	    return keys.length
	      ? keys.some(function (key) {
	          return contains(Path.get(item, key), search)
	        })
	      : contains(item, search)
	  })
	}

	/**
	 * Filter filter for v-repeat
	 *
	 * @param {String} sortKey
	 * @param {String} reverse
	 */

	exports.orderBy = function (arr, sortKey, reverse) {
	  if (!sortKey) {
	    return arr
	  }
	  var order = 1
	  if (arguments.length > 2) {
	    if (reverse === '-1') {
	      order = -1
	    } else {
	      order = reverse ? -1 : 1
	    }
	  }
	  // sort on a copy to avoid mutating original array
	  return arr.slice().sort(function (a, b) {
	    if (sortKey !== '$key' && sortKey !== '$value') {
	      if (a && '$value' in a) a = a.$value
	      if (b && '$value' in b) b = b.$value
	    }
	    a = _.isObject(a) ? Path.get(a, sortKey) : a
	    b = _.isObject(b) ? Path.get(b, sortKey) : b
	    return a === b ? 0 : a > b ? order : -order
	  })
	}

	/**
	 * String contain helper
	 *
	 * @param {*} val
	 * @param {String} search
	 */

	function contains (val, search) {
	  if (_.isPlainObject(val)) {
	    for (var key in val) {
	      if (contains(val[key], search)) {
	        return true
	      }
	    }
	  } else if (_.isArray(val)) {
	    var i = val.length
	    while (i--) {
	      if (contains(val[i], search)) {
	        return true
	      }
	    }
	  } else if (val != null) {
	    return val.toString().toLowerCase().indexOf(search) > -1
	  }
	}


/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	var mergeOptions = __webpack_require__(8).mergeOptions

	/**
	 * The main init sequence. This is called for every
	 * instance, including ones that are created from extended
	 * constructors.
	 *
	 * @param {Object} options - this options object should be
	 *                           the result of merging class
	 *                           options and the options passed
	 *                           in to the constructor.
	 */

	exports._init = function (options) {

	  options = options || {}

	  this.$el = null
	  this.$parent = options._parent
	  this.$root = options._root || this
	  this.$children = []
	  this.$ = {}           // child vm references
	  this.$$ = {}          // element references
	  this._watchers = []   // all watchers as an array
	  this._directives = [] // all directives
	  this._childCtors = {} // inherit:true constructors

	  // a flag to avoid this being observed
	  this._isVue = true

	  // events bookkeeping
	  this._events = {}            // registered callbacks
	  this._eventsCount = {}       // for $broadcast optimization
	  this._eventCancelled = false // for event cancellation

	  // fragment instance properties
	  this._isFragment = false
	  this._fragmentStart =    // @type {CommentNode}
	  this._fragmentEnd = null // @type {CommentNode}

	  // lifecycle state
	  this._isCompiled =
	  this._isDestroyed =
	  this._isReady =
	  this._isAttached =
	  this._isBeingDestroyed = false
	  this._unlinkFn = null

	  // context: the scope in which the component was used,
	  // and the scope in which props and contents of this
	  // instance should be compiled in.
	  this._context =
	    options._context ||
	    options._parent

	  // push self into parent / transclusion host
	  if (this.$parent) {
	    this.$parent.$children.push(this)
	  }

	  // props used in v-repeat diffing
	  this._reused = false
	  this._staggerOp = null

	  // merge options.
	  options = this.$options = mergeOptions(
	    this.constructor.options,
	    options,
	    this
	  )

	  // initialize data as empty object.
	  // it will be filled up in _initScope().
	  this._data = {}

	  // initialize data observation and scope inheritance.
	  this._initScope()

	  // setup event system and option events.
	  this._initEvents()

	  // call created hook
	  this._callHook('created')

	  // if `el` option is passed, start compilation.
	  if (options.el) {
	    this.$mount(options.el)
	  }
	}


/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var _ = __webpack_require__(8)
	var inDoc = _.inDoc

	/**
	 * Setup the instance's option events & watchers.
	 * If the value is a string, we pull it from the
	 * instance's methods by name.
	 */

	exports._initEvents = function () {
	  var options = this.$options
	  registerCallbacks(this, '$on', options.events)
	  registerCallbacks(this, '$watch', options.watch)
	}

	/**
	 * Register callbacks for option events and watchers.
	 *
	 * @param {Vue} vm
	 * @param {String} action
	 * @param {Object} hash
	 */

	function registerCallbacks (vm, action, hash) {
	  if (!hash) return
	  var handlers, key, i, j
	  for (key in hash) {
	    handlers = hash[key]
	    if (_.isArray(handlers)) {
	      for (i = 0, j = handlers.length; i < j; i++) {
	        register(vm, action, key, handlers[i])
	      }
	    } else {
	      register(vm, action, key, handlers)
	    }
	  }
	}

	/**
	 * Helper to register an event/watch callback.
	 *
	 * @param {Vue} vm
	 * @param {String} action
	 * @param {String} key
	 * @param {Function|String|Object} handler
	 * @param {Object} [options]
	 */

	function register (vm, action, key, handler, options) {
	  var type = typeof handler
	  if (type === 'function') {
	    vm[action](key, handler, options)
	  } else if (type === 'string') {
	    var methods = vm.$options.methods
	    var method = methods && methods[handler]
	    if (method) {
	      vm[action](key, method, options)
	    } else {
	      process.env.NODE_ENV !== 'production' && _.warn(
	        'Unknown method: "' + handler + '" when ' +
	        'registering callback for ' + action +
	        ': "' + key + '".'
	      )
	    }
	  } else if (handler && type === 'object') {
	    register(vm, action, key, handler.handler, handler)
	  }
	}

	/**
	 * Setup recursive attached/detached calls
	 */

	exports._initDOMHooks = function () {
	  this.$on('hook:attached', onAttached)
	  this.$on('hook:detached', onDetached)
	}

	/**
	 * Callback to recursively call attached hook on children
	 */

	function onAttached () {
	  if (!this._isAttached) {
	    this._isAttached = true
	    this.$children.forEach(callAttach)
	  }
	}

	/**
	 * Iterator to call attached hook
	 *
	 * @param {Vue} child
	 */

	function callAttach (child) {
	  if (!child._isAttached && inDoc(child.$el)) {
	    child._callHook('attached')
	  }
	}

	/**
	 * Callback to recursively call detached hook on children
	 */

	function onDetached () {
	  if (this._isAttached) {
	    this._isAttached = false
	    this.$children.forEach(callDetach)
	  }
	}

	/**
	 * Iterator to call detached hook
	 *
	 * @param {Vue} child
	 */

	function callDetach (child) {
	  if (child._isAttached && !inDoc(child.$el)) {
	    child._callHook('detached')
	  }
	}

	/**
	 * Trigger all handlers for a hook
	 *
	 * @param {String} hook
	 */

	exports._callHook = function (hook) {
	  var handlers = this.$options[hook]
	  if (handlers) {
	    for (var i = 0, j = handlers.length; i < j; i++) {
	      handlers[i].call(this)
	    }
	  }
	  this.$emit('hook:' + hook)
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(12)))

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var _ = __webpack_require__(8)
	var compiler = __webpack_require__(18)
	var Observer = __webpack_require__(63)
	var Dep = __webpack_require__(26)
	var Watcher = __webpack_require__(25)

	/**
	 * Setup the scope of an instance, which contains:
	 * - observed data
	 * - computed properties
	 * - user methods
	 * - meta properties
	 */

	exports._initScope = function () {
	  this._initProps()
	  this._initMeta()
	  this._initMethods()
	  this._initData()
	  this._initComputed()
	}

	/**
	 * Initialize props.
	 */

	exports._initProps = function () {
	  var options = this.$options
	  var el = options.el
	  var props = options.props
	  if (props && !el) {
	    process.env.NODE_ENV !== 'production' && _.warn(
	      'Props will not be compiled if no `el` option is ' +
	      'provided at instantiation.'
	    )
	  }
	  // make sure to convert string selectors into element now
	  el = options.el = _.query(el)
	  this._propsUnlinkFn = el && el.nodeType === 1 && props
	    ? compiler.compileAndLinkProps(
	        this, el, props
	      )
	    : null
	}

	/**
	 * Initialize the data.
	 */

	exports._initData = function () {
	  var propsData = this._data
	  var optionsDataFn = this.$options.data
	  var optionsData = optionsDataFn && optionsDataFn()
	  if (optionsData) {
	    this._data = optionsData
	    for (var prop in propsData) {
	      if (
	        this._props[prop].raw !== null ||
	        !optionsData.hasOwnProperty(prop)
	      ) {
	        optionsData.$set(prop, propsData[prop])
	      }
	    }
	  }
	  var data = this._data
	  // proxy data on instance
	  var keys = Object.keys(data)
	  var i, key
	  i = keys.length
	  while (i--) {
	    key = keys[i]
	    if (!_.isReserved(key)) {
	      this._proxy(key)
	    }
	  }
	  // observe data
	  Observer.create(data, this)
	}

	/**
	 * Swap the isntance's $data. Called in $data's setter.
	 *
	 * @param {Object} newData
	 */

	exports._setData = function (newData) {
	  newData = newData || {}
	  var oldData = this._data
	  this._data = newData
	  var keys, key, i
	  // copy props.
	  // this should only happen during a v-repeat of component
	  // that also happens to have compiled props.
	  var props = this.$options.props
	  if (props) {
	    i = props.length
	    while (i--) {
	      key = props[i].name
	      if (key !== '$data' && !newData.hasOwnProperty(key)) {
	        newData.$set(key, oldData[key])
	      }
	    }
	  }
	  // unproxy keys not present in new data
	  keys = Object.keys(oldData)
	  i = keys.length
	  while (i--) {
	    key = keys[i]
	    if (!_.isReserved(key) && !(key in newData)) {
	      this._unproxy(key)
	    }
	  }
	  // proxy keys not already proxied,
	  // and trigger change for changed values
	  keys = Object.keys(newData)
	  i = keys.length
	  while (i--) {
	    key = keys[i]
	    if (!this.hasOwnProperty(key) && !_.isReserved(key)) {
	      // new property
	      this._proxy(key)
	    }
	  }
	  oldData.__ob__.removeVm(this)
	  Observer.create(newData, this)
	  this._digest()
	}

	/**
	 * Proxy a property, so that
	 * vm.prop === vm._data.prop
	 *
	 * @param {String} key
	 */

	exports._proxy = function (key) {
	  // need to store ref to self here
	  // because these getter/setters might
	  // be called by child instances!
	  var self = this
	  Object.defineProperty(self, key, {
	    configurable: true,
	    enumerable: true,
	    get: function proxyGetter () {
	      return self._data[key]
	    },
	    set: function proxySetter (val) {
	      self._data[key] = val
	    }
	  })
	}

	/**
	 * Unproxy a property.
	 *
	 * @param {String} key
	 */

	exports._unproxy = function (key) {
	  delete this[key]
	}

	/**
	 * Force update on every watcher in scope.
	 */

	exports._digest = function () {
	  var i = this._watchers.length
	  while (i--) {
	    this._watchers[i].update(true) // shallow updates
	  }
	  var children = this.$children
	  i = children.length
	  while (i--) {
	    var child = children[i]
	    if (child.$options.inherit) {
	      child._digest()
	    }
	  }
	}

	/**
	 * Setup computed properties. They are essentially
	 * special getter/setters
	 */

	function noop () {}
	exports._initComputed = function () {
	  var computed = this.$options.computed
	  if (computed) {
	    for (var key in computed) {
	      var userDef = computed[key]
	      var def = {
	        enumerable: true,
	        configurable: true
	      }
	      if (typeof userDef === 'function') {
	        def.get = makeComputedGetter(userDef, this)
	        def.set = noop
	      } else {
	        def.get = userDef.get
	          ? userDef.cache !== false
	            ? makeComputedGetter(userDef.get, this)
	            : _.bind(userDef.get, this)
	          : noop
	        def.set = userDef.set
	          ? _.bind(userDef.set, this)
	          : noop
	      }
	      Object.defineProperty(this, key, def)
	    }
	  }
	}

	function makeComputedGetter (getter, owner) {
	  var watcher = new Watcher(owner, getter, null, {
	    lazy: true
	  })
	  return function computedGetter () {
	    if (watcher.dirty) {
	      watcher.evaluate()
	    }
	    if (Dep.target) {
	      watcher.depend()
	    }
	    return watcher.value
	  }
	}

	/**
	 * Setup instance methods. Methods must be bound to the
	 * instance since they might be called by children
	 * inheriting them.
	 */

	exports._initMethods = function () {
	  var methods = this.$options.methods
	  if (methods) {
	    for (var key in methods) {
	      this[key] = _.bind(methods[key], this)
	    }
	  }
	}

	/**
	 * Initialize meta information like $index, $key & $value.
	 */

	exports._initMeta = function () {
	  var metas = this.$options._meta
	  if (metas) {
	    for (var key in metas) {
	      this._defineMeta(key, metas[key])
	    }
	  }
	}

	/**
	 * Define a meta property, e.g $index, $key, $value
	 * which only exists on the vm instance but not in $data.
	 *
	 * @param {String} key
	 * @param {*} value
	 */

	exports._defineMeta = function (key, value) {
	  var dep = new Dep()
	  Object.defineProperty(this, key, {
	    get: function metaGetter () {
	      if (Dep.target) {
	        dep.depend()
	      }
	      return value
	    },
	    set: function metaSetter (val) {
	      if (val !== value) {
	        value = val
	        dep.notify()
	      }
	    }
	  })
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(12)))

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(8)
	var config = __webpack_require__(13)
	var Dep = __webpack_require__(26)
	var arrayMethods = __webpack_require__(64)
	var arrayKeys = Object.getOwnPropertyNames(arrayMethods)
	__webpack_require__(65)

	/**
	 * Observer class that are attached to each observed
	 * object. Once attached, the observer converts target
	 * object's property keys into getter/setters that
	 * collect dependencies and dispatches updates.
	 *
	 * @param {Array|Object} value
	 * @constructor
	 */

	function Observer (value) {
	  this.value = value
	  this.dep = new Dep()
	  _.define(value, '__ob__', this)
	  if (_.isArray(value)) {
	    var augment = config.proto && _.hasProto
	      ? protoAugment
	      : copyAugment
	    augment(value, arrayMethods, arrayKeys)
	    this.observeArray(value)
	  } else {
	    this.walk(value)
	  }
	}

	// Static methods

	/**
	 * Attempt to create an observer instance for a value,
	 * returns the new observer if successfully observed,
	 * or the existing observer if the value already has one.
	 *
	 * @param {*} value
	 * @param {Vue} [vm]
	 * @return {Observer|undefined}
	 * @static
	 */

	Observer.create = function (value, vm) {
	  var ob
	  if (
	    value &&
	    value.hasOwnProperty('__ob__') &&
	    value.__ob__ instanceof Observer
	  ) {
	    ob = value.__ob__
	  } else if (
	    _.isObject(value) &&
	    !Object.isFrozen(value) &&
	    !value._isVue
	  ) {
	    ob = new Observer(value)
	  }
	  if (ob && vm) {
	    ob.addVm(vm)
	  }
	  return ob
	}

	// Instance methods

	/**
	 * Walk through each property and convert them into
	 * getter/setters. This method should only be called when
	 * value type is Object. Properties prefixed with `$` or `_`
	 * and accessor properties are ignored.
	 *
	 * @param {Object} obj
	 */

	Observer.prototype.walk = function (obj) {
	  var keys = Object.keys(obj)
	  var i = keys.length
	  while (i--) {
	    this.convert(keys[i], obj[keys[i]])
	  }
	}

	/**
	 * Try to carete an observer for a child value,
	 * and if value is array, link dep to the array.
	 *
	 * @param {*} val
	 * @return {Dep|undefined}
	 */

	Observer.prototype.observe = function (val) {
	  return Observer.create(val)
	}

	/**
	 * Observe a list of Array items.
	 *
	 * @param {Array} items
	 */

	Observer.prototype.observeArray = function (items) {
	  var i = items.length
	  while (i--) {
	    this.observe(items[i])
	  }
	}

	/**
	 * Convert a property into getter/setter so we can emit
	 * the events when the property is accessed/changed.
	 *
	 * @param {String} key
	 * @param {*} val
	 */

	Observer.prototype.convert = function (key, val) {
	  var ob = this
	  var childOb = ob.observe(val)
	  var dep = new Dep()
	  Object.defineProperty(ob.value, key, {
	    enumerable: true,
	    configurable: true,
	    get: function () {
	      if (Dep.target) {
	        dep.depend()
	        if (childOb) {
	          childOb.dep.depend()
	        }
	        if (_.isArray(val)) {
	          for (var e, i = 0, l = val.length; i < l; i++) {
	            e = val[i]
	            e && e.__ob__ && e.__ob__.dep.depend()
	          }
	        }
	      }
	      return val
	    },
	    set: function (newVal) {
	      if (newVal === val) return
	      val = newVal
	      childOb = ob.observe(newVal)
	      dep.notify()
	    }
	  })
	}

	/**
	 * Add an owner vm, so that when $add/$delete mutations
	 * happen we can notify owner vms to proxy the keys and
	 * digest the watchers. This is only called when the object
	 * is observed as an instance's root $data.
	 *
	 * @param {Vue} vm
	 */

	Observer.prototype.addVm = function (vm) {
	  (this.vms || (this.vms = [])).push(vm)
	}

	/**
	 * Remove an owner vm. This is called when the object is
	 * swapped out as an instance's $data object.
	 *
	 * @param {Vue} vm
	 */

	Observer.prototype.removeVm = function (vm) {
	  this.vms.$remove(vm)
	}

	// helpers

	/**
	 * Augment an target Object or Array by intercepting
	 * the prototype chain using __proto__
	 *
	 * @param {Object|Array} target
	 * @param {Object} proto
	 */

	function protoAugment (target, src) {
	  target.__proto__ = src
	}

	/**
	 * Augment an target Object or Array by defining
	 * hidden properties.
	 *
	 * @param {Object|Array} target
	 * @param {Object} proto
	 */

	function copyAugment (target, src, keys) {
	  var i = keys.length
	  var key
	  while (i--) {
	    key = keys[i]
	    _.define(target, key, src[key])
	  }
	}

	module.exports = Observer


/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(8)
	var arrayProto = Array.prototype
	var arrayMethods = Object.create(arrayProto)

	/**
	 * Intercept mutating methods and emit events
	 */

	;[
	  'push',
	  'pop',
	  'shift',
	  'unshift',
	  'splice',
	  'sort',
	  'reverse'
	]
	.forEach(function (method) {
	  // cache original method
	  var original = arrayProto[method]
	  _.define(arrayMethods, method, function mutator () {
	    // avoid leaking arguments:
	    // http://jsperf.com/closure-with-arguments
	    var i = arguments.length
	    var args = new Array(i)
	    while (i--) {
	      args[i] = arguments[i]
	    }
	    var result = original.apply(this, args)
	    var ob = this.__ob__
	    var inserted
	    switch (method) {
	      case 'push':
	        inserted = args
	        break
	      case 'unshift':
	        inserted = args
	        break
	      case 'splice':
	        inserted = args.slice(2)
	        break
	    }
	    if (inserted) ob.observeArray(inserted)
	    // notify change
	    ob.dep.notify()
	    return result
	  })
	})

	/**
	 * Swap the element at the given index with a new value
	 * and emits corresponding event.
	 *
	 * @param {Number} index
	 * @param {*} val
	 * @return {*} - replaced element
	 */

	_.define(
	  arrayProto,
	  '$set',
	  function $set (index, val) {
	    if (index >= this.length) {
	      this.length = index + 1
	    }
	    return this.splice(index, 1, val)[0]
	  }
	)

	/**
	 * Convenience method to remove the element at given index.
	 *
	 * @param {Number} index
	 * @param {*} val
	 */

	_.define(
	  arrayProto,
	  '$remove',
	  function $remove (index) {
	    /* istanbul ignore if */
	    if (!this.length) return
	    if (typeof index !== 'number') {
	      index = _.indexOf(this, index)
	    }
	    if (index > -1) {
	      return this.splice(index, 1)
	    }
	  }
	)

	module.exports = arrayMethods


/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(8)
	var objProto = Object.prototype

	/**
	 * Add a new property to an observed object
	 * and emits corresponding event
	 *
	 * @param {String} key
	 * @param {*} val
	 * @public
	 */

	_.define(
	  objProto,
	  '$add',
	  function $add (key, val) {
	    if (this.hasOwnProperty(key)) return
	    var ob = this.__ob__
	    if (!ob || _.isReserved(key)) {
	      this[key] = val
	      return
	    }
	    ob.convert(key, val)
	    ob.dep.notify()
	    if (ob.vms) {
	      var i = ob.vms.length
	      while (i--) {
	        var vm = ob.vms[i]
	        vm._proxy(key)
	        vm._digest()
	      }
	    }
	  }
	)

	/**
	 * Set a property on an observed object, calling add to
	 * ensure the property is observed.
	 *
	 * @param {String} key
	 * @param {*} val
	 * @public
	 */

	_.define(
	  objProto,
	  '$set',
	  function $set (key, val) {
	    this.$add(key, val)
	    this[key] = val
	  }
	)

	/**
	 * Deletes a property from an observed object
	 * and emits corresponding event
	 *
	 * @param {String} key
	 * @public
	 */

	_.define(
	  objProto,
	  '$delete',
	  function $delete (key) {
	    if (!this.hasOwnProperty(key)) return
	    delete this[key]
	    var ob = this.__ob__
	    if (!ob || _.isReserved(key)) {
	      return
	    }
	    ob.dep.notify()
	    if (ob.vms) {
	      var i = ob.vms.length
	      while (i--) {
	        var vm = ob.vms[i]
	        vm._unproxy(key)
	        vm._digest()
	      }
	    }
	  }
	)


/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(8)
	var Directive = __webpack_require__(67)
	var compiler = __webpack_require__(18)

	/**
	 * Transclude, compile and link element.
	 *
	 * If a pre-compiled linker is available, that means the
	 * passed in element will be pre-transcluded and compiled
	 * as well - all we need to do is to call the linker.
	 *
	 * Otherwise we need to call transclude/compile/link here.
	 *
	 * @param {Element} el
	 * @return {Element}
	 */

	exports._compile = function (el) {
	  var options = this.$options
	  var host = this._host
	  if (options._linkFn) {
	    // pre-transcluded with linker, just use it
	    this._initElement(el)
	    this._unlinkFn = options._linkFn(this, el, host)
	  } else {
	    // transclude and init element
	    // transclude can potentially replace original
	    // so we need to keep reference; this step also injects
	    // the template and caches the original attributes
	    // on the container node and replacer node.
	    var original = el
	    el = compiler.transclude(el, options)
	    this._initElement(el)

	    // root is always compiled per-instance, because
	    // container attrs and props can be different every time.
	    var rootLinker = compiler.compileRoot(el, options)

	    // compile and link the rest
	    var contentLinkFn
	    var ctor = this.constructor
	    // component compilation can be cached
	    // as long as it's not using inline-template
	    if (options._linkerCachable) {
	      contentLinkFn = ctor.linker
	      if (!contentLinkFn) {
	        contentLinkFn = ctor.linker = compiler.compile(el, options)
	      }
	    }

	    // link phase
	    var rootUnlinkFn = rootLinker(this, el)
	    var contentUnlinkFn = contentLinkFn
	      ? contentLinkFn(this, el)
	      : compiler.compile(el, options)(this, el, host)

	    // register composite unlink function
	    // to be called during instance destruction
	    this._unlinkFn = function () {
	      rootUnlinkFn()
	      // passing destroying: true to avoid searching and
	      // splicing the directives
	      contentUnlinkFn(true)
	    }

	    // finally replace original
	    if (options.replace) {
	      _.replace(original, el)
	    }
	  }
	  return el
	}

	/**
	 * Initialize instance element. Called in the public
	 * $mount() method.
	 *
	 * @param {Element} el
	 */

	exports._initElement = function (el) {
	  if (el instanceof DocumentFragment) {
	    this._isFragment = true
	    this.$el = this._fragmentStart = el.firstChild
	    this._fragmentEnd = el.lastChild
	    // set persisted text anchors to empty
	    if (this._fragmentStart.nodeType === 3) {
	      this._fragmentStart.data = this._fragmentEnd.data = ''
	    }
	    this._blockFragment = el
	  } else {
	    this.$el = el
	  }
	  this.$el.__vue__ = this
	  this._callHook('beforeCompile')
	}

	/**
	 * Create and bind a directive to an element.
	 *
	 * @param {String} name - directive name
	 * @param {Node} node   - target node
	 * @param {Object} desc - parsed directive descriptor
	 * @param {Object} def  - directive definition object
	 * @param {Vue|undefined} host - transclusion host component
	 */

	exports._bindDir = function (name, node, desc, def, host) {
	  this._directives.push(
	    new Directive(name, node, this, desc, def, host)
	  )
	}

	/**
	 * Teardown an instance, unobserves the data, unbind all the
	 * directives, turn off all the event listeners, etc.
	 *
	 * @param {Boolean} remove - whether to remove the DOM node.
	 * @param {Boolean} deferCleanup - if true, defer cleanup to
	 *                                 be called later
	 */

	exports._destroy = function (remove, deferCleanup) {
	  if (this._isBeingDestroyed) {
	    return
	  }
	  this._callHook('beforeDestroy')
	  this._isBeingDestroyed = true
	  var i
	  // remove self from parent. only necessary
	  // if parent is not being destroyed as well.
	  var parent = this.$parent
	  if (parent && !parent._isBeingDestroyed) {
	    parent.$children.$remove(this)
	  }
	  // destroy all children.
	  i = this.$children.length
	  while (i--) {
	    this.$children[i].$destroy()
	  }
	  // teardown props
	  if (this._propsUnlinkFn) {
	    this._propsUnlinkFn()
	  }
	  // teardown all directives. this also tearsdown all
	  // directive-owned watchers.
	  if (this._unlinkFn) {
	    this._unlinkFn()
	  }
	  i = this._watchers.length
	  while (i--) {
	    this._watchers[i].teardown()
	  }
	  // remove reference to self on $el
	  if (this.$el) {
	    this.$el.__vue__ = null
	  }
	  // remove DOM element
	  var self = this
	  if (remove && this.$el) {
	    this.$remove(function () {
	      self._cleanup()
	    })
	  } else if (!deferCleanup) {
	    this._cleanup()
	  }
	}

	/**
	 * Clean up to ensure garbage collection.
	 * This is called after the leave transition if there
	 * is any.
	 */

	exports._cleanup = function () {
	  // remove reference from data ob
	  // frozen object may not have observer.
	  if (this._data.__ob__) {
	    this._data.__ob__.removeVm(this)
	  }
	  // Clean up references to private properties and other
	  // instances. preserve reference to _data so that proxy
	  // accessors still work. The only potential side effect
	  // here is that mutating the instance after it's destroyed
	  // may affect the state of other components that are still
	  // observing the same object, but that seems to be a
	  // reasonable responsibility for the user rather than
	  // always throwing an error on them.
	  this.$el =
	  this.$parent =
	  this.$root =
	  this.$children =
	  this._watchers =
	  this._directives = null
	  // call the last hook...
	  this._isDestroyed = true
	  this._callHook('destroyed')
	  // turn off all instance listeners.
	  this.$off()
	}


/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var _ = __webpack_require__(8)
	var config = __webpack_require__(13)
	var Watcher = __webpack_require__(25)
	var textParser = __webpack_require__(21)
	var expParser = __webpack_require__(27)

	/**
	 * A directive links a DOM element with a piece of data,
	 * which is the result of evaluating an expression.
	 * It registers a watcher with the expression and calls
	 * the DOM update function when a change is triggered.
	 *
	 * @param {String} name
	 * @param {Node} el
	 * @param {Vue} vm
	 * @param {Object} descriptor
	 *                 - {String} expression
	 *                 - {String} [arg]
	 *                 - {Array<Object>} [filters]
	 * @param {Object} def - directive definition object
	 * @param {Vue|undefined} host - transclusion host target
	 * @constructor
	 */

	function Directive (name, el, vm, descriptor, def, host) {
	  // public
	  this.name = name
	  this.el = el
	  this.vm = vm
	  // copy descriptor props
	  this.raw = descriptor.raw
	  this.expression = descriptor.expression
	  this.arg = descriptor.arg
	  this.filters = descriptor.filters
	  // private
	  this._descriptor = descriptor
	  this._host = host
	  this._locked = false
	  this._bound = false
	  this._listeners = null
	  // init
	  this._bind(def)
	}

	/**
	 * Initialize the directive, mixin definition properties,
	 * setup the watcher, call definition bind() and update()
	 * if present.
	 *
	 * @param {Object} def
	 */

	Directive.prototype._bind = function (def) {
	  if (
	    (this.name !== 'cloak' || this.vm._isCompiled) &&
	    this.el && this.el.removeAttribute
	  ) {
	    this.el.removeAttribute(config.prefix + this.name)
	  }
	  if (typeof def === 'function') {
	    this.update = def
	  } else {
	    _.extend(this, def)
	  }
	  this._watcherExp = this.expression
	  this._checkDynamicLiteral()
	  if (this.bind) {
	    this.bind()
	  }
	  if (this._watcherExp &&
	      (this.update || this.twoWay) &&
	      (!this.isLiteral || this._isDynamicLiteral) &&
	      !this._checkStatement()) {
	    // wrapped updater for context
	    var dir = this
	    var update = this._update = this.update
	      ? function (val, oldVal) {
	          if (!dir._locked) {
	            dir.update(val, oldVal)
	          }
	        }
	      : function () {} // noop if no update is provided
	    // pre-process hook called before the value is piped
	    // through the filters. used in v-repeat.
	    var preProcess = this._preProcess
	      ? _.bind(this._preProcess, this)
	      : null
	    var watcher = this._watcher = new Watcher(
	      this.vm,
	      this._watcherExp,
	      update, // callback
	      {
	        filters: this.filters,
	        twoWay: this.twoWay,
	        deep: this.deep,
	        preProcess: preProcess
	      }
	    )
	    if (this._initValue != null) {
	      watcher.set(this._initValue)
	    } else if (this.update) {
	      this.update(watcher.value)
	    }
	  }
	  this._bound = true
	}

	/**
	 * check if this is a dynamic literal binding.
	 *
	 * e.g. v-component="{{currentView}}"
	 */

	Directive.prototype._checkDynamicLiteral = function () {
	  var expression = this.expression
	  if (expression && this.isLiteral) {
	    var tokens = textParser.parse(expression)
	    if (tokens) {
	      var exp = textParser.tokensToExp(tokens)
	      this.expression = this.vm.$get(exp)
	      this._watcherExp = exp
	      this._isDynamicLiteral = true
	    }
	  }
	}

	/**
	 * Check if the directive is a function caller
	 * and if the expression is a callable one. If both true,
	 * we wrap up the expression and use it as the event
	 * handler.
	 *
	 * e.g. v-on="click: a++"
	 *
	 * @return {Boolean}
	 */

	Directive.prototype._checkStatement = function () {
	  var expression = this.expression
	  if (
	    expression && this.acceptStatement &&
	    !expParser.isSimplePath(expression)
	  ) {
	    var fn = expParser.parse(expression).get
	    var vm = this.vm
	    var handler = function () {
	      fn.call(vm, vm)
	    }
	    if (this.filters) {
	      handler = vm._applyFilters(handler, null, this.filters)
	    }
	    this.update(handler)
	    return true
	  }
	}

	/**
	 * Check for an attribute directive param, e.g. lazy
	 *
	 * @param {String} name
	 * @return {String}
	 */

	Directive.prototype._checkParam = function (name) {
	  var param = this.el.getAttribute(name)
	  if (param !== null) {
	    this.el.removeAttribute(name)
	    param = this.vm.$interpolate(param)
	  }
	  return param
	}

	/**
	 * Set the corresponding value with the setter.
	 * This should only be used in two-way directives
	 * e.g. v-model.
	 *
	 * @param {*} value
	 * @public
	 */

	Directive.prototype.set = function (value) {
	  /* istanbul ignore else */
	  if (this.twoWay) {
	    this._withLock(function () {
	      this._watcher.set(value)
	    })
	  } else if (process.env.NODE_ENV !== 'production') {
	    _.warn(
	      'Directive.set() can only be used inside twoWay' +
	      'directives.'
	    )
	  }
	}

	/**
	 * Execute a function while preventing that function from
	 * triggering updates on this directive instance.
	 *
	 * @param {Function} fn
	 */

	Directive.prototype._withLock = function (fn) {
	  var self = this
	  self._locked = true
	  fn.call(self)
	  _.nextTick(function () {
	    self._locked = false
	  })
	}

	/**
	 * Convenience method that attaches a DOM event listener
	 * to the directive element and autometically tears it down
	 * during unbind.
	 *
	 * @param {String} event
	 * @param {Function} handler
	 */

	Directive.prototype.on = function (event, handler) {
	  _.on(this.el, event, handler)
	  ;(this._listeners || (this._listeners = []))
	    .push([event, handler])
	}

	/**
	 * Teardown the watcher and call unbind.
	 */

	Directive.prototype._teardown = function () {
	  if (this._bound) {
	    this._bound = false
	    if (this.unbind) {
	      this.unbind()
	    }
	    if (this._watcher) {
	      this._watcher.teardown()
	    }
	    var listeners = this._listeners
	    if (listeners) {
	      for (var i = 0; i < listeners.length; i++) {
	        _.off(this.el, listeners[i][0], listeners[i][1])
	      }
	    }
	    this.vm = this.el =
	    this._watcher = this._listeners = null
	  }
	}

	module.exports = Directive

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(12)))

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var _ = __webpack_require__(8)

	/**
	 * Apply a list of filter (descriptors) to a value.
	 * Using plain for loops here because this will be called in
	 * the getter of any watcher with filters so it is very
	 * performance sensitive.
	 *
	 * @param {*} value
	 * @param {*} [oldValue]
	 * @param {Array} filters
	 * @param {Boolean} write
	 * @return {*}
	 */

	exports._applyFilters = function (value, oldValue, filters, write) {
	  var filter, fn, args, arg, offset, i, l, j, k
	  for (i = 0, l = filters.length; i < l; i++) {
	    filter = filters[i]
	    fn = _.resolveAsset(this.$options, 'filters', filter.name)
	    if (process.env.NODE_ENV !== 'production') {
	      _.assertAsset(fn, 'filter', filter.name)
	    }
	    if (!fn) continue
	    fn = write ? fn.write : (fn.read || fn)
	    if (typeof fn !== 'function') continue
	    args = write ? [value, oldValue] : [value]
	    offset = write ? 2 : 1
	    if (filter.args) {
	      for (j = 0, k = filter.args.length; j < k; j++) {
	        arg = filter.args[j]
	        args[j + offset] = arg.dynamic
	          ? this.$get(arg.value)
	          : arg.value
	      }
	    }
	    value = fn.apply(this, args)
	  }
	  return value
	}

	/**
	 * Resolve a component, depending on whether the component
	 * is defined normally or using an async factory function.
	 * Resolves synchronously if already resolved, otherwise
	 * resolves asynchronously and caches the resolved
	 * constructor on the factory.
	 *
	 * @param {String} id
	 * @param {Function} cb
	 */

	exports._resolveComponent = function (id, cb) {
	  var factory = _.resolveAsset(this.$options, 'components', id)
	  if (process.env.NODE_ENV !== 'production') {
	    _.assertAsset(factory, 'component', id)
	  }
	  if (!factory) {
	    return
	  }
	  // async component factory
	  if (!factory.options) {
	    if (factory.resolved) {
	      // cached
	      cb(factory.resolved)
	    } else if (factory.requested) {
	      // pool callbacks
	      factory.pendingCallbacks.push(cb)
	    } else {
	      factory.requested = true
	      var cbs = factory.pendingCallbacks = [cb]
	      factory(function resolve (res) {
	        if (_.isPlainObject(res)) {
	          res = _.Vue.extend(res)
	        }
	        // cache resolved
	        factory.resolved = res
	        // invoke callbacks
	        for (var i = 0, l = cbs.length; i < l; i++) {
	          cbs[i](res)
	        }
	      }, function reject (reason) {
	        process.env.NODE_ENV !== 'production' && _.warn(
	          'Failed to resolve async component: ' + id + '. ' +
	          (reason ? '\nReason: ' + reason : '')
	        )
	      })
	    }
	  } else {
	    // normal component
	    cb(factory)
	  }
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(12)))

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	var Watcher = __webpack_require__(25)
	var Path = __webpack_require__(28)
	var textParser = __webpack_require__(21)
	var dirParser = __webpack_require__(23)
	var expParser = __webpack_require__(27)
	var filterRE = /[^|]\|[^|]/

	/**
	 * Get the value from an expression on this vm.
	 *
	 * @param {String} exp
	 * @return {*}
	 */

	exports.$get = function (exp) {
	  var res = expParser.parse(exp)
	  if (res) {
	    try {
	      return res.get.call(this, this)
	    } catch (e) {}
	  }
	}

	/**
	 * Set the value from an expression on this vm.
	 * The expression must be a valid left-hand
	 * expression in an assignment.
	 *
	 * @param {String} exp
	 * @param {*} val
	 */

	exports.$set = function (exp, val) {
	  var res = expParser.parse(exp, true)
	  if (res && res.set) {
	    res.set.call(this, this, val)
	  }
	}

	/**
	 * Add a property on the VM
	 *
	 * @param {String} key
	 * @param {*} val
	 */

	exports.$add = function (key, val) {
	  this._data.$add(key, val)
	}

	/**
	 * Delete a property on the VM
	 *
	 * @param {String} key
	 */

	exports.$delete = function (key) {
	  this._data.$delete(key)
	}

	/**
	 * Watch an expression, trigger callback when its
	 * value changes.
	 *
	 * @param {String} exp
	 * @param {Function} cb
	 * @param {Object} [options]
	 *                 - {Boolean} deep
	 *                 - {Boolean} immediate
	 *                 - {Boolean} user
	 * @return {Function} - unwatchFn
	 */

	exports.$watch = function (exp, cb, options) {
	  var vm = this
	  var watcher = new Watcher(vm, exp, cb, {
	    deep: options && options.deep,
	    user: !options || options.user !== false
	  })
	  if (options && options.immediate) {
	    cb.call(vm, watcher.value)
	  }
	  return function unwatchFn () {
	    watcher.teardown()
	  }
	}

	/**
	 * Evaluate a text directive, including filters.
	 *
	 * @param {String} text
	 * @return {String}
	 */

	exports.$eval = function (text) {
	  // check for filters.
	  if (filterRE.test(text)) {
	    var dir = dirParser.parse(text)[0]
	    // the filter regex check might give false positive
	    // for pipes inside strings, so it's possible that
	    // we don't get any filters here
	    var val = this.$get(dir.expression)
	    return dir.filters
	      ? this._applyFilters(val, null, dir.filters)
	      : val
	  } else {
	    // no filter
	    return this.$get(text)
	  }
	}

	/**
	 * Interpolate a piece of template text.
	 *
	 * @param {String} text
	 * @return {String}
	 */

	exports.$interpolate = function (text) {
	  var tokens = textParser.parse(text)
	  var vm = this
	  if (tokens) {
	    return tokens.length === 1
	      ? vm.$eval(tokens[0].value)
	      : tokens.map(function (token) {
	          return token.tag
	            ? vm.$eval(token.value)
	            : token.value
	        }).join('')
	  } else {
	    return text
	  }
	}

	/**
	 * Log instance data as a plain JS object
	 * so that it is easier to inspect in console.
	 * This method assumes console is available.
	 *
	 * @param {String} [path]
	 */

	exports.$log = function (path) {
	  var data = path
	    ? Path.get(this._data, path)
	    : this._data
	  if (data) {
	    data = JSON.parse(JSON.stringify(data))
	  }
	  console.log(data)
	}


/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(8)
	var transition = __webpack_require__(38)

	/**
	 * Convenience on-instance nextTick. The callback is
	 * auto-bound to the instance, and this avoids component
	 * modules having to rely on the global Vue.
	 *
	 * @param {Function} fn
	 */

	exports.$nextTick = function (fn) {
	  _.nextTick(fn, this)
	}

	/**
	 * Append instance to target
	 *
	 * @param {Node} target
	 * @param {Function} [cb]
	 * @param {Boolean} [withTransition] - defaults to true
	 */

	exports.$appendTo = function (target, cb, withTransition) {
	  return insert(
	    this, target, cb, withTransition,
	    append, transition.append
	  )
	}

	/**
	 * Prepend instance to target
	 *
	 * @param {Node} target
	 * @param {Function} [cb]
	 * @param {Boolean} [withTransition] - defaults to true
	 */

	exports.$prependTo = function (target, cb, withTransition) {
	  target = query(target)
	  if (target.hasChildNodes()) {
	    this.$before(target.firstChild, cb, withTransition)
	  } else {
	    this.$appendTo(target, cb, withTransition)
	  }
	  return this
	}

	/**
	 * Insert instance before target
	 *
	 * @param {Node} target
	 * @param {Function} [cb]
	 * @param {Boolean} [withTransition] - defaults to true
	 */

	exports.$before = function (target, cb, withTransition) {
	  return insert(
	    this, target, cb, withTransition,
	    before, transition.before
	  )
	}

	/**
	 * Insert instance after target
	 *
	 * @param {Node} target
	 * @param {Function} [cb]
	 * @param {Boolean} [withTransition] - defaults to true
	 */

	exports.$after = function (target, cb, withTransition) {
	  target = query(target)
	  if (target.nextSibling) {
	    this.$before(target.nextSibling, cb, withTransition)
	  } else {
	    this.$appendTo(target.parentNode, cb, withTransition)
	  }
	  return this
	}

	/**
	 * Remove instance from DOM
	 *
	 * @param {Function} [cb]
	 * @param {Boolean} [withTransition] - defaults to true
	 */

	exports.$remove = function (cb, withTransition) {
	  if (!this.$el.parentNode) {
	    return cb && cb()
	  }
	  var inDoc = this._isAttached && _.inDoc(this.$el)
	  // if we are not in document, no need to check
	  // for transitions
	  if (!inDoc) withTransition = false
	  var op
	  var self = this
	  var realCb = function () {
	    if (inDoc) self._callHook('detached')
	    if (cb) cb()
	  }
	  if (
	    this._isFragment &&
	    !this._blockFragment.hasChildNodes()
	  ) {
	    op = withTransition === false
	      ? append
	      : transition.removeThenAppend
	    blockOp(this, this._blockFragment, op, realCb)
	  } else {
	    op = withTransition === false
	      ? remove
	      : transition.remove
	    op(this.$el, this, realCb)
	  }
	  return this
	}

	/**
	 * Shared DOM insertion function.
	 *
	 * @param {Vue} vm
	 * @param {Element} target
	 * @param {Function} [cb]
	 * @param {Boolean} [withTransition]
	 * @param {Function} op1 - op for non-transition insert
	 * @param {Function} op2 - op for transition insert
	 * @return vm
	 */

	function insert (vm, target, cb, withTransition, op1, op2) {
	  target = query(target)
	  var targetIsDetached = !_.inDoc(target)
	  var op = withTransition === false || targetIsDetached
	    ? op1
	    : op2
	  var shouldCallHook =
	    !targetIsDetached &&
	    !vm._isAttached &&
	    !_.inDoc(vm.$el)
	  if (vm._isFragment) {
	    blockOp(vm, target, op, cb)
	  } else {
	    op(vm.$el, target, vm, cb)
	  }
	  if (shouldCallHook) {
	    vm._callHook('attached')
	  }
	  return vm
	}

	/**
	 * Execute a transition operation on a fragment instance,
	 * iterating through all its block nodes.
	 *
	 * @param {Vue} vm
	 * @param {Node} target
	 * @param {Function} op
	 * @param {Function} cb
	 */

	function blockOp (vm, target, op, cb) {
	  var current = vm._fragmentStart
	  var end = vm._fragmentEnd
	  var next
	  while (next !== end) {
	    next = current.nextSibling
	    op(current, target, vm)
	    current = next
	  }
	  op(end, target, vm, cb)
	}

	/**
	 * Check for selectors
	 *
	 * @param {String|Element} el
	 */

	function query (el) {
	  return typeof el === 'string'
	    ? document.querySelector(el)
	    : el
	}

	/**
	 * Append operation that takes a callback.
	 *
	 * @param {Node} el
	 * @param {Node} target
	 * @param {Vue} vm - unused
	 * @param {Function} [cb]
	 */

	function append (el, target, vm, cb) {
	  target.appendChild(el)
	  if (cb) cb()
	}

	/**
	 * InsertBefore operation that takes a callback.
	 *
	 * @param {Node} el
	 * @param {Node} target
	 * @param {Vue} vm - unused
	 * @param {Function} [cb]
	 */

	function before (el, target, vm, cb) {
	  _.before(el, target)
	  if (cb) cb()
	}

	/**
	 * Remove operation that takes a callback.
	 *
	 * @param {Node} el
	 * @param {Vue} vm - unused
	 * @param {Function} [cb]
	 */

	function remove (el, vm, cb) {
	  _.remove(el)
	  if (cb) cb()
	}


/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(8)

	/**
	 * Listen on the given `event` with `fn`.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 */

	exports.$on = function (event, fn) {
	  (this._events[event] || (this._events[event] = []))
	    .push(fn)
	  modifyListenerCount(this, event, 1)
	  return this
	}

	/**
	 * Adds an `event` listener that will be invoked a single
	 * time then automatically removed.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 */

	exports.$once = function (event, fn) {
	  var self = this
	  function on () {
	    self.$off(event, on)
	    fn.apply(this, arguments)
	  }
	  on.fn = fn
	  this.$on(event, on)
	  return this
	}

	/**
	 * Remove the given callback for `event` or all
	 * registered callbacks.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 */

	exports.$off = function (event, fn) {
	  var cbs
	  // all
	  if (!arguments.length) {
	    if (this.$parent) {
	      for (event in this._events) {
	        cbs = this._events[event]
	        if (cbs) {
	          modifyListenerCount(this, event, -cbs.length)
	        }
	      }
	    }
	    this._events = {}
	    return this
	  }
	  // specific event
	  cbs = this._events[event]
	  if (!cbs) {
	    return this
	  }
	  if (arguments.length === 1) {
	    modifyListenerCount(this, event, -cbs.length)
	    this._events[event] = null
	    return this
	  }
	  // specific handler
	  var cb
	  var i = cbs.length
	  while (i--) {
	    cb = cbs[i]
	    if (cb === fn || cb.fn === fn) {
	      modifyListenerCount(this, event, -1)
	      cbs.splice(i, 1)
	      break
	    }
	  }
	  return this
	}

	/**
	 * Trigger an event on self.
	 *
	 * @param {String} event
	 */

	exports.$emit = function (event) {
	  this._eventCancelled = false
	  var cbs = this._events[event]
	  if (cbs) {
	    // avoid leaking arguments:
	    // http://jsperf.com/closure-with-arguments
	    var i = arguments.length - 1
	    var args = new Array(i)
	    while (i--) {
	      args[i] = arguments[i + 1]
	    }
	    i = 0
	    cbs = cbs.length > 1
	      ? _.toArray(cbs)
	      : cbs
	    for (var l = cbs.length; i < l; i++) {
	      if (cbs[i].apply(this, args) === false) {
	        this._eventCancelled = true
	      }
	    }
	  }
	  return this
	}

	/**
	 * Recursively broadcast an event to all children instances.
	 *
	 * @param {String} event
	 * @param {...*} additional arguments
	 */

	exports.$broadcast = function (event) {
	  // if no child has registered for this event,
	  // then there's no need to broadcast.
	  if (!this._eventsCount[event]) return
	  var children = this.$children
	  for (var i = 0, l = children.length; i < l; i++) {
	    var child = children[i]
	    child.$emit.apply(child, arguments)
	    if (!child._eventCancelled) {
	      child.$broadcast.apply(child, arguments)
	    }
	  }
	  return this
	}

	/**
	 * Recursively propagate an event up the parent chain.
	 *
	 * @param {String} event
	 * @param {...*} additional arguments
	 */

	exports.$dispatch = function () {
	  var parent = this.$parent
	  while (parent) {
	    parent.$emit.apply(parent, arguments)
	    parent = parent._eventCancelled
	      ? null
	      : parent.$parent
	  }
	  return this
	}

	/**
	 * Modify the listener counts on all parents.
	 * This bookkeeping allows $broadcast to return early when
	 * no child has listened to a certain event.
	 *
	 * @param {Vue} vm
	 * @param {String} event
	 * @param {Number} count
	 */

	var hookRE = /^hook:/
	function modifyListenerCount (vm, event, count) {
	  var parent = vm.$parent
	  // hooks do not get broadcasted so no need
	  // to do bookkeeping for them
	  if (!parent || !count || hookRE.test(event)) return
	  while (parent) {
	    parent._eventsCount[event] =
	      (parent._eventsCount[event] || 0) + count
	    parent = parent.$parent
	  }
	}


/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(8)

	/**
	 * Create a child instance that prototypally inherits
	 * data on parent. To achieve that we create an intermediate
	 * constructor with its prototype pointing to parent.
	 *
	 * @param {Object} opts
	 * @param {Function} [BaseCtor]
	 * @return {Vue}
	 * @public
	 */

	exports.$addChild = function (opts, BaseCtor) {
	  BaseCtor = BaseCtor || _.Vue
	  opts = opts || {}
	  var parent = this
	  var ChildVue
	  var inherit = opts.inherit !== undefined
	    ? opts.inherit
	    : BaseCtor.options.inherit
	  if (inherit) {
	    var ctors = parent._childCtors
	    ChildVue = ctors[BaseCtor.cid]
	    if (!ChildVue) {
	      var optionName = BaseCtor.options.name
	      var className = optionName
	        ? _.classify(optionName)
	        : 'VueComponent'
	      ChildVue = new Function(
	        'return function ' + className + ' (options) {' +
	        'this.constructor = ' + className + ';' +
	        'this._init(options) }'
	      )()
	      ChildVue.options = BaseCtor.options
	      ChildVue.linker = BaseCtor.linker
	      // important: transcluded inline repeaters should
	      // inherit from outer scope rather than host
	      ChildVue.prototype = opts._context || this
	      ctors[BaseCtor.cid] = ChildVue
	    }
	  } else {
	    ChildVue = BaseCtor
	  }
	  opts._parent = parent
	  opts._root = parent.$root
	  var child = new ChildVue(opts)
	  return child
	}


/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var _ = __webpack_require__(8)
	var compiler = __webpack_require__(18)

	/**
	 * Set instance target element and kick off the compilation
	 * process. The passed in `el` can be a selector string, an
	 * existing Element, or a DocumentFragment (for block
	 * instances).
	 *
	 * @param {Element|DocumentFragment|string} el
	 * @public
	 */

	exports.$mount = function (el) {
	  if (this._isCompiled) {
	    process.env.NODE_ENV !== 'production' && _.warn(
	      '$mount() should be called only once.'
	    )
	    return
	  }
	  el = _.query(el)
	  if (!el) {
	    el = document.createElement('div')
	  }
	  this._compile(el)
	  this._isCompiled = true
	  this._callHook('compiled')
	  this._initDOMHooks()
	  if (_.inDoc(this.$el)) {
	    this._callHook('attached')
	    ready.call(this)
	  } else {
	    this.$once('hook:attached', ready)
	  }
	  return this
	}

	/**
	 * Mark an instance as ready.
	 */

	function ready () {
	  this._isAttached = true
	  this._isReady = true
	  this._callHook('ready')
	}

	/**
	 * Teardown the instance, simply delegate to the internal
	 * _destroy.
	 */

	exports.$destroy = function (remove, deferCleanup) {
	  this._destroy(remove, deferCleanup)
	}

	/**
	 * Partially compile a piece of DOM and return a
	 * decompile function.
	 *
	 * @param {Element|DocumentFragment} el
	 * @param {Vue} [host]
	 * @return {Function}
	 */

	exports.$compile = function (el, host) {
	  return compiler.compile(el, this.$options, true)(this, el, host)
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(12)))

/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	var bz;

	__webpack_require__(75);

	bz = __webpack_require__(77);

	module.exports = {
	  template: __webpack_require__(78),
	  props: ['followed', 'god_id'],
	  data: {
	    btn_loading: false
	  },
	  ready: function() {
	    this.$watch('followed', function() {
	      if (this.followed === 1) {
	        return this.showFollow();
	      } else {
	        return this.showUnfollow();
	      }
	    });
	    if (this.followed === 1) {
	      return this.showFollow();
	    } else {
	      return this.showUnfollow();
	    }
	  },
	  methods: {
	    showFollow: function() {
	      var target;
	      target = this.$el;
	      $(target).text('Following');
	      return $(target).removeClass('btn-default').addClass('btn-warning');
	    },
	    showUnfollow: function() {
	      var target;
	      target = this.$el;
	      $(target).html('<span class="fa fa-heart yellow" aria-hidden="true">+</span>Follow');
	      return $(target).removeClass('btn-warning').addClass('btn-default');
	    },
	    toggleFollow: function() {
	      var parm, target;
	      if (this.btn_loading) {
	        return;
	      }
	      this.btn_loading = true;
	      target = this.$el;
	      if (this.followed === 1) {
	        parm = JSON.stringify({
	          god_id: this.god_id
	        });
	        return $.ajax({
	          url: '/unfollow',
	          type: 'POST',
	          data: parm,
	          success: (function(_this) {
	            return function(data, status, response) {
	              _this.btn_loading = false;
	              if (data.error !== '0') {
	                throw new Error(data.error);
	              } else {
	                bz.showSuccess5('Unfollow 成功');
	                _this.showUnfollow();
	                return _this.followed = 0;
	              }
	            };
	          })(this)
	        });
	      } else {
	        parm = JSON.stringify({
	          god_id: this.god_id
	        });
	        return $.ajax({
	          url: '/follow',
	          type: 'POST',
	          data: parm,
	          success: (function(_this) {
	            return function(data, status, response) {
	              _this.btn_loading = false;
	              if (data.error !== '0') {
	                if (data.error === 'must login') {
	                  return window.location.href = "/login";
	                } else {
	                  throw new Error(data.error);
	                }
	              } else {
	                bz.showSuccess5('Follow 成功');
	                _this.showFollow();
	                return _this.followed = 1;
	              }
	            };
	          })(this)
	        });
	      }
	    }
	  }
	};


/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(76);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/less-loader/index.js!./style.less", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/less-loader/index.js!./style.less");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, ".yellow {\n  color: #F39C12;\n}\n", ""]);

	// exports


/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	var Vue, getOptions, getValue, setWatch;

	Vue = __webpack_require__(7);

	Vue.config.delimiters = ['(%', '%)'];

	window.log = function(parm) {
	  return console.log(parm);
	};

	setWatch = function(vm, arg, table_name, column_name, el) {
	  return vm.$watch(arg, function(new_value) {
	    if ($(el).is("select")) {
	      return getOptions(table_name, column_name, new_value, function(options) {
	        var hide, i, str;
	        hide = $(el).hasClass("hide");
	        if (options) {
	          $(el).removeClass("hide");
	          str = "<option value='' disabled='true' selected>--请选择--</option>";
	          i = 0;
	          while (i < options.length) {
	            str += "<option value='" + options[i].value + "'>" + options[i].text + "</option>";
	            i++;
	          }
	          return $(el).html(str);
	        } else if (hide) {
	          return $(el).addClass("hide");
	        }
	      });
	    } else {
	      return getValue(table_name, column_name, new_value, function(data) {
	        return $(el).val(data[0].value);
	      });
	    }
	  }, false, false);
	};

	getOptions = function(table_name, column_name, key, callback) {
	  var str;
	  if (!key) {
	    return;
	  }
	  str = [table_name, column_name, key].join("/");
	  return $.get("/cascade/options/" + str, function(data) {
	    if (!data.error === "0") {
	      return window.bz.showError5("获取数据失败，请刷新重试。");
	    } else {
	      return callback(data.options);
	    }
	  });
	};

	getValue = function(table_name, column_name, key, callback) {
	  var str;
	  if (!key) {
	    return;
	  }
	  str = [table_name, column_name, key].join("/");
	  return $.get("/cascade/value/" + str, function(data) {
	    if (!data.error === "0") {
	      return window.bz.showError5("获取数据失败，请刷新重试。");
	    } else {
	      return callback(data.options);
	    }
	  });
	};

	Vue.directive("cascade", function() {
	  var column_name, parms, table_name;
	  parms = this.expression.split(".");
	  table_name = parms[0];
	  column_name = parms[1];
	  return setWatch(this.vm, this.arg, table_name, column_name, this.el);
	});

	Vue.directive('dateformat', function(value) {
	  var date_str, el, mask;
	  if (value) {
	    el = $(this.el);
	    mask = this.arg;
	    date_str = bz.dateFormat(value, mask);
	    return el.html(date_str);
	  }
	});

	Vue.directive('time-len', function(value) {
	  var date_str, el;
	  if (value) {
	    el = $(this.el);
	    date_str = bz.timeLen(value);
	    return el.html(date_str);
	  }
	});

	Vue.directive('ellipsis', function(str) {
	  var el, len;
	  if (str) {
	    el = $(this.el);
	    len = this.arg;
	    if (len < str.length) {
	      return el.html(str.substring(0, len) + "...");
	    } else {
	      return el.html(str);
	    }
	  }
	});

	Vue.directive('datepicker', {
	  bind: function(value) {
	    var _this, datepicker;
	    _this = this;
	    datepicker = $(this.el);
	    return datepicker.datepicker({
	      format: "yyyy-mm-dd",
	      language: "zh-CN",
	      autoclose: true,
	      forceParse: true,
	      clearBtn: true,
	      startDate: '1980-01-01',
	      orientation: "top left"
	    }).on("changeDate", function(e) {
	      var d_str, index, level, levels, results, temp_obj;
	      levels = _this.raw.split(".");
	      d_str = "";
	      if (e.date) {
	        d_str = e.date.valueOf();
	      }
	      temp_obj = _this.vm[levels[0]];
	      index = 1;
	      results = [];
	      while (index <= levels.length - 1) {
	        level = levels[index];
	        if (typeof temp_obj[level] === "undefined" && index < levels.length - 1) {
	          temp_obj.$add(levels[index], {});
	          temp_obj = temp_obj[level];
	        } else if (index === levels.length - 1) {
	          temp_obj[level] = d_str;
	        }
	        results.push(index += 1);
	      }
	      return results;
	    }).siblings(".input-group-addon").on("click", function() {
	      return datepicker.datepicker("show");
	    });
	  },
	  update: function(value) {
	    if (isNaN(value)) {
	      return $(this.el).datepicker('update', value);
	    } else if (value) {
	      return $(this.el).datepicker('update', new Date(parseInt(value)));
	    } else {
	      return $(this.el).datepicker('update', '');
	    }
	  }
	});

	Vue.directive("process-icon", {
	  update: function(value) {
	    var img, path, src;
	    if (value) {
	      src = "";
	      if (/^QQ/.test(value)) {
	        src = "qq.png";
	      } else if (/^Google Chrome/.test(value)) {
	        src = "chrome.png";
	      } else if (/^WeChat/.test(value)) {
	        src = "weixin.png";
	      } else if (/^iTerm/.test(value)) {
	        src = "iterm2.png";
	      } else if (/^node/.test(value)) {
	        src = "nodejs.png";
	      } else if (/python/.test(value) || /Python/.test(value)) {
	        src = "python.png";
	      } else if (/^nginx/.test(value)) {
	        src = "nginx.png";
	      } else if (/postgres/.test(value)) {
	        src = "postgresql.png";
	      } else if (/apache2/.test(value)) {
	        src = "apache.png";
	      } else if (/mysqld/.test(value)) {
	        src = "mysql.png";
	      } else if (/^java/.test(value)) {
	        src = "java.png";
	      } else {
	        src = "default.png";
	      }
	      img = '<img src="/static/favicons/ico/' + src + '" height="16" style="margin-right: 4px;" width="16">';
	      path = "";
	      if (/dropbox/.test(value)) {
	        path = "dropbox.ico";
	      }
	      if (path !== "") {
	        img = '<img src="/static/favicons/' + path + '" height="16" style="margin-right: 4px;" width="16">';
	      }
	      if (value.length > 80) {
	        value = value.substr(0, 80) + "+";
	      }
	      return $(this.el).html(img + value);
	    }
	  }
	});

	Vue.directive('a-active', {
	  bind: function() {
	    var href, path;
	    href = $(this.el).attr('href');
	    href = encodeURI(href);
	    path = window.location.pathname;
	    if (path.search(href) !== -1) {
	      return $(this.el).addClass("active");
	    }
	  }
	});

	Vue.directive('li-a-active', {
	  bind: function() {
	    var href, path;
	    href = $(this.el).find("a").attr('href');
	    href = encodeURI(href);
	    path = window.location.pathname;
	    if (path.search(href) !== -1) {
	      return $(this.el).addClass("active");
	    }
	  }
	});

	Vue.directive("release-icon", {
	  update: function(value) {
	    var file_name;
	    file_name = 'hold.svg';
	    if (value) {
	      if (value.search("Windows") !== -1) {
	        file_name = "windows8.svg";
	      }
	      if (value.search('Fedora') !== -1) {
	        file_name = "fedora.svg";
	      }
	      if (value.search('Ubuntu') !== -1) {
	        file_name = "ubuntu.svg";
	      }
	      if (value.search("CentOS") !== -1) {
	        file_name = "centos.svg";
	      }
	      if (value.search('Windows XP') !== -1) {
	        file_name = "windows.svg";
	      }
	      if (value.search('Windows 7') !== -1) {
	        file_name = "windows.svg";
	      }
	      if (value.search('Windows 8.1') !== -1) {
	        file_name = "windows8.svg";
	      }
	      if (value.search('Darwin') !== -1) {
	        file_name = "osx.svg";
	      }
	      return this.el.src = "/static/images/system_icon/" + file_name;
	    }
	  }
	});

	Vue.directive('disable', function(value) {
	  return this.el.disabled = !!value;
	});

	Vue.directive('active', function(value) {
	  if (!!value) {
	    return $(this.el).addClass("active");
	  } else {
	    return $(this.el).removeClass("active");
	  }
	});

	Vue.directive('regexp', function(value) {
	  var r, reg;
	  if (!window.regexp) {
	    window.regexp = {};
	  }
	  if (value) {
	    reg = new RegExp(this.arg);
	    r = reg.test(value);
	    if (r) {
	      $(this.el).css('border-color', '#d2d6de');
	      return window.regexp[this.expression] = r;
	    } else {
	      return $(this.el).css('border-color', '#ff0000');
	    }
	  } else {
	    return window.regexp[this.expression] = false;
	  }
	});

	if ($().toastmessage) {
	  $().toastmessage({
	    sticky: false,
	    position: 'top-right',
	    stayTime: 5000,
	    closeText: '<i class="fa fa-times"></i>',
	    successText: '<i class="fa fa-check"></i>',
	    warningText: '<i class="fa fa-exclamation-triangle"></i>',
	    noticeText: '<i class="fa fa-exclamation"></i>',
	    errorText: '<i class="fa fa-exclamation-circle"></i>'
	  });
	}

	window.bz = {
	  calculateHeight: function(img_height, img_width, max_width) {
	    var real_height;
	    if (max_width <= img_width) {
	      real_height = max_width * img_height / img_width;
	    } else {
	      real_height = img_height;
	    }
	    return real_height;
	  },
	  getFitHeight: function(img_height, img_width) {
	    var max_width, real_height;
	    max_width = $(window).width() - 50;
	    if (max_width <= 768) {
	      real_height = calculateHeight(img_height, img_width, max_width);
	    } else {
	      max_width = $('#v_messages > .col-md-8').width() - 50;
	      real_height = calculateHeight(img_height, img_width, max_width);
	    }
	    return real_height;
	  },
	  delay: function(ms, func) {
	    return setTimeout(func, ms);
	  },
	  mobilecheck: function() {
	    var check;
	    check = false;
	    (function(a) {
	      if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) {
	        check = true;
	      }
	    })(navigator.userAgent || navigator.vendor || window.opera);
	    return check;
	  },
	  setOnErrorVm: function(vm) {
	    return window.onerror = function(errorMsg, url, lineNumber) {
	      var error;
	      error = errorMsg.replace('Uncaught Error: ', '');
	      vm.$set('error_info', error);
	      return bz.showError5(error);
	    };
	  },
	  isEmpty: function(obj) {
	    var key;
	    if (obj === null) {
	      return true;
	    }
	    if (obj.length > 0) {
	      return false;
	    }
	    if (obj.length === 0) {
	      return true;
	    }
	    for (key in obj) {
	      if (Object.prototype.hasOwnProperty.call(obj, key)) {
	        return false;
	      }
	    }
	    return true;
	  },
	  timeLen: function(that_time) {
	    var day, desc, hour, interval, minute, month, now, second, year;
	    second = 1000;
	    minute = second * 60;
	    hour = minute * 60;
	    day = hour * 24;
	    month = day * 30;
	    year = month * 12;
	    now = Date.now();
	    interval = now - that_time;
	    if (interval < minute) {
	      desc = parseInt(interval / second) + "秒前";
	    } else if (interval < hour) {
	      desc = parseInt(interval / minute) + "分钟前";
	    } else if (interval < day) {
	      desc = parseInt(interval / hour) + "小时前";
	    } else if (interval < month) {
	      desc = parseInt(interval / day) + "天前";
	    } else if (interval < year) {
	      desc = parseInt(interval / month) + "个月前";
	    } else {
	      desc = parseInt(interval / year) + "年前";
	    }
	    return desc;
	  },
	  getLastParm: function() {
	    var parms;
	    parms = window.location.pathname.split('/');
	    return parms[parms.length - 1];
	  },
	  getUrlPath: function(number) {
	    var parms;
	    parms = window.location.pathname.split('/');
	    if (number === 'last') {
	      number = parms.length - 1;
	    }
	    return parms[number];
	  },
	  getUrlParm: function() {
	    var parms;
	    parms = window.location.pathname.split('/');
	    return parms;
	  },
	  getHashParms: function() {
	    var parms;
	    parms = window.location.hash.split('/');
	    return parms;
	  },
	  showSuccess5: function(message) {
	    var successToast;
	    if ($().toastmessage) {
	      return successToast = $().toastmessage('showSuccessToast', message);
	    } else {
	      return console.log("require jquery-toastmessage-plugin");
	    }
	  },
	  showNotice5: function(message) {
	    var myToast;
	    if ($().toastmessage) {
	      return myToast = $().toastmessage('showNoticeToast', message);
	    } else {
	      return console.log("require jquery-toastmessage-plugin");
	    }
	  },
	  showWarning5: function(message) {
	    var warningToast;
	    if ($().toastmessage) {
	      return warningToast = $().toastmessage('showNoticeToast', message);
	    } else {
	      return console.log("require jquery-toastmessage-plugin");
	    }
	  },
	  showError5: function(message) {
	    var errorToast;
	    if ($().toastmessage) {
	      return errorToast = $().toastmessage('showErrorToast', message);
	    } else {
	      return console.log("require jquery-toastmessage-plugin");
	    }
	  },
	  preZero: function(num, len) {
	    var a, numStr;
	    numStr = num.toString();
	    if (len < numStr.length) {
	      return numStr;
	    } else {
	      a = new Array(len + 1).join("0") + numStr;
	      return a.substr(a.length - len, a.length - 1);
	    }
	  },
	  HTMLEncode: function(value) {
	    return $("<div/>").html(value).text();
	  },
	  HTMLDecode: function(value) {
	    return $("<div/>").text(value).html();
	  },
	  dateFormat: function(timestramp, mask) {
	    var _this, date, matched_array, o, regStr, res;
	    date = new Date(timestramp);
	    _this = this;
	    o = {
	      "y+": function(len) {
	        return _this.preZero(date.getFullYear(), len);
	      },
	      "M+": function(len) {
	        return _this.preZero(date.getMonth() + 1, len);
	      },
	      "d+": function(len) {
	        return _this.preZero(date.getDate(), len);
	      },
	      "h+": function(len) {
	        return _this.preZero(date.getHours(), len);
	      },
	      "m+": function(len) {
	        return _this.preZero(date.getMinutes(), len);
	      },
	      "s+": function(len) {
	        return _this.preZero(date.getSeconds(), len);
	      }
	    };
	    for (regStr in o) {
	      matched_array = mask.match(new RegExp(regStr));
	      if (matched_array) {
	        res = o[regStr](matched_array[0].length);
	        mask = mask.replace(matched_array[0], res);
	      }
	    }
	    return mask;
	  },
	  formatUnit: function(value) {
	    var desc, g, m, t;
	    value = parseFloat(value);
	    m = 1024;
	    g = m * 1024;
	    t = g * 1024;
	    if (value > t) {
	      desc = (value / t).toFixed(2) + 'TB';
	    } else if (value > g) {
	      desc = (value / g).toFixed(2) + 'GB';
	    } else if (value > m) {
	      desc = (value / m).toFixed(2) + 'MB';
	    } else {
	      desc = value + 'KB';
	    }
	    return desc;
	  },
	  formatCount: function(value) {
	    var desc, f_value, k, w;
	    f_value = parseFloat(value);
	    w = 10000;
	    k = 1000;
	    if (f_value >= w) {
	      desc = (f_value / w).toFixed(1) + 'W';
	    } else if (f_value >= k) {
	      desc = (f_value / k).toFixed(1) + 'K';
	    } else {
	      desc = parseInt(value);
	    }
	    return desc;
	  },
	  getHashPram: function(key) {
	    var _hash, _hashItem, _hashStr, _hashs, j, len1;
	    _hashStr = window.location.hash.replace('#', '');
	    if (!_hashStr || _hashStr === "") {
	      return void 0;
	    }
	    _hashs = _hashStr.split(";");
	    for (j = 0, len1 = _hashs.length; j < len1; j++) {
	      _hashItem = _hashs[j];
	      _hash = _hashItem.split("=");
	      if (key === _hash[0]) {
	        return _hash[1];
	      }
	    }
	    return void 0;
	  },
	  setHashPram: function(key, value) {
	    var _hash, _hashItem, _hashStr, _hashs, _newHashStr, j, len1;
	    _hashStr = window.location.hash.replace('#', '');
	    if (!window.bz.getHashPram(key) && value) {
	      return window.location.hash = _hashStr + key + "=" + value + ";";
	    } else {
	      _hashs = _hashStr.split(";");
	      _newHashStr = "";
	      for (j = 0, len1 = _hashs.length; j < len1; j++) {
	        _hashItem = _hashs[j];
	        if (!_hashItem || _hashItem === "") {
	          continue;
	        }
	        _hash = _hashItem.split("=");
	        if (key === _hash[0]) {
	          if (value !== "") {
	            _newHashStr = _newHashStr + key + "=" + value + ";";
	          }
	        } else {
	          _newHashStr = _newHashStr + _hash[0] + "=" + _hash[1] + ";";
	        }
	      }
	      return window.location.hash = _newHashStr;
	    }
	  },
	  isInclude: function(key, words) {
	    if (words.toLocaleLowerCase().indexOf(key.toLocaleLowerCase()) > -1) {
	      return true;
	    } else {
	      return false;
	    }
	  },
	  resolve: function(obj, path, value) {
	    var key, r;
	    r = path.split(".");
	    if (r.length > 1) {
	      key = r.shift();
	      if (!obj[key]) {
	        obj[key] = {};
	      }
	      return window.bz.resolve(obj[key], r.join("."), value);
	    } else {
	      obj[path] = value || {};
	    }
	    return this;
	  }
	};

	module.exports = window.bz;


/***/ },
/* 78 */
/***/ function(module, exports) {

	module.exports = "<button v-btn-loading=\"btn_loading\" v-on=\"click:toggleFollow\" type=\"button\" class=\"btn btn-sm\" aria-label=\"Left Align\">\n</button>\n";

/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	var Simditor, bz;

	__webpack_require__(80);

	__webpack_require__(82);

	Simditor = __webpack_require__(84);

	bz = __webpack_require__(77);

	module.exports = {
	  template: __webpack_require__(89),
	  props: ['content'],
	  ready: function() {
	    this.initSimditor();
	    return this.$watch('content', function(newVal, oldVal) {
	      if (newVal !== this.simditor.getValue()) {
	        return this.simditor.setValue(newVal);
	      }
	    });
	  },
	  methods: {
	    initSimditor: function() {
	      var mobileToolbar, small_tool_bar, toolbar;
	      toolbar = ['title', 'bold', 'italic', 'underline', 'strikethrough', 'color', '|', 'ol', 'ul', 'blockquote', 'code', 'table', '|', 'link', 'image', 'hr', '|', 'indent', 'outdent', 'alignment'];
	      mobileToolbar = ['bold', 'underline', 'strikethrough', 'color', 'ul', 'ol'];
	      small_tool_bar = ['title', 'link', 'image', 'bold'];
	      if (bz.mobilecheck()) {
	        toolbar = mobileToolbar;
	      }
	      this.simditor = new Simditor({
	        textarea: this.$el,
	        placeholder: '这里输入文字...',
	        toolbar: small_tool_bar,
	        toolbarFloat: false,
	        pasteImage: true,
	        defaultImage: 'assets/images/image.png',
	        upload: {
	          url: '/upload_image',
	          params: null,
	          fileKey: 'upload_file',
	          connectionCount: 3,
	          leaveConfirm: '正在上传文件，如果离开上传会自动取消'
	        }
	      });
	      return this.simditor.on('valuechanged', (function(_this) {
	        return function(e, src) {
	          return _this.content = _this.simditor.getValue();
	        };
	      })(this));
	    }
	  }
	};


/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(81);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/less-loader/index.js!./style.less", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/less-loader/index.js!./style.less");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, ".simditor .simditor-body {\n  min-height: 2em !important;\n}\n", ""]);

	// exports


/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(83);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../css-loader/index.js!./simditor.css", function() {
				var newContent = require("!!./../../css-loader/index.js!./simditor.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, "/*!\n* Simditor v2.2.2\n* http://simditor.tower.im/\n* 2015-08-03\n*/\n@font-face {\n  font-family: 'Simditor';\n  src: url(data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAABp8AA4AAAAAKmwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABGRlRNAAAaYAAAABoAAAAcdO8GE09TLzIAAAG0AAAARQAAAGAQ+ZFXY21hcAAAAkgAAABRAAABWuA2Gx9jdnQgAAAEgAAAAAoAAAAKAwQAxGZwZ20AAAKcAAABsQAAAmUPtC+nZ2x5ZgAABNgAABPeAAAgZG/p6QxoZWFkAAABRAAAADAAAAA2BvuCgGhoZWEAAAF0AAAAHgAAACQH9QTlaG10eAAAAfwAAABKAAAAlHv7AItsb2NhAAAEjAAAAEwAAABMi4qTXm1heHAAAAGUAAAAIAAAACABRwHNbmFtZQAAGLgAAAEFAAAB12vS/ulwb3N0AAAZwAAAAJ4AAAFsyCrvunByZXAAAARQAAAALgAAAC6w8isUeNpjYGRgYADiKAkPy3h+m68M8swfgCIMF0/IVyDo/84sFswJQC4HAxNIFAAZwAnyeNpjYGRgYE5gmMAQzWLBwPD/O5AEiqAAVQBa6wPkAAAAAQAAACUAoAAKAAAAAAACAAEAAgAWAAABAAEpAAAAAHjaY2BhnsA4gYGVgYGpn+kgAwNDL4RmfMxgxMgCFGVgZWaAAUYBBjTQwMDwQY454X8BQzRzAsMEIJcRSVaBgREAQ9oK6QAAAHjaY8xhUGQAAsYABgbmDwjMYsEgxCzBwMDkAOQnALEEgx1UjhNMr4BjTqBakDxC/wqIPsYMqJoEKIbpk0C1C4zXM3DA5AEzchbtAAB42mNgYGBmgGAZBkYGEAgB8hjBfBYGCyDNxcDBwASEDAy8DAof5P7/B6sCsRmAbOb/3/8/FWCD6oUCRjaIkWA2SCcLAyoAqmZlGN4AALmUC0kAAAB42l1Ru05bQRDdDQ8DgcTYIDnaFLOZkALvhTZIIK4uwsh2YzlC2o1c5GJcwAdQIFGD9msGaChTpE2DkAskPoFPiJSZNYmiNDs7s3POmTNLypGqd2m956lzFkjhboNmm34npNpFgAfS9Y1GRtrBIy02M3rlun2/j8FmNOVOGkB5z1vKQ0bTTqAW7bl/Mj+D4T7/yzwHg5Zmmp5aZyE9hMB8M25p8DWjWXf9QV+xOlwNBoYU01Tc9cdUyv+W5lxtGbY2M5p3cCEiP5gGaGqtjUDTnzqkej6OYgly+WysDSamrD/JRHBhMl3VVC0zvnZwn+wsOtikSnPgAQ6wVZ6Ch+OjCYX0LYkyS0OEg9gqMULEJIdCTjl3sj8pUD6ShDFvktLOuGGtgXHkNTCozdMcvsxmU9tbhzB+EUfw3S/Gkg4+sqE2RoTYjlgKYAKRkFFVvqHGcy+LAbnU/jMQJWB5+u1fJwKtOzYRL2VtnWOMFYKe3zbf+WXF3apc50Whu3dVNVTplOZDL2ff4xFPj4XhoLHgzed9f6NA7Q2LGw2aA8GQ3o3e/9FadcRV3gsf2W81s7EWAAAAuAH/hbABjQBLsAhQWLEBAY5ZsUYGK1ghsBBZS7AUUlghsIBZHbAGK1xYWbAUKwAAAAAAowCFACECfwAAAAAAKgAqACoAKgAqACoAfgEkAcAChAK+A2oElgU2BbQGxgeYCBgIPgjGCU4KZgqKCq4LQAuYDDoMcAzuDXINoA4MDngO4g86D6QQMnjazVl5cBvXeX9vF4tdXHsBuwBBEvdBAgQXxOIgRPGQSEkULcoJJds6Yku2Na6TKJXHsnx0XNptHcvNpLaSJpkczthV68Zu0ulbQE58qXXaHK3j7ThjD6PmmnQmaTydSaqkmdbxkFC/tyApinXiuP2jlcC37/vegX3f8fu+7wExKIkQLjCPIxbxaNjCyNja4l3sTyqWm/vu1hbLQBdZLGVzlN3i3a7lrS1M+aaSVPKmkk5iz+tf/zrz+MrRJHMDgp3US3/tyjEvIQn1oiJCWd6dx7kGrsexLuGwjlm3AXSQ0h5M+5M4D3/1MNbx4b5AoPNmIIDdgQB0v/e9AJ78JqemVLfT4uN0sDtAHzBtvvvYsIK5aqWgcF6XyizRR+f+K9cAhRB9T3TpGTbCRlAARdAEehiRCYNwNulNLCmkzyZ+g6g2GTSIaJKCTUo2JpMGSS0RZBOp0kohb7E9lerzFMlghSDZ4nGRbLGJRpdXbGsKFy2UUlRL7Gk2iaacYzlfeCITbhJeJY0msvycorZj8eYWylMV4JFBtaXlKs1mszyS5UNh3azUqvlhnOLZsAZEvZpLp9gU35jAjfo4lvM5GEzn6xkzXAnrWogXMR/DITfvTuMy9hSyr0XSx+6VXa6+1NFbTrwrPvD+v8OevSHFLzT9cYbZgqXZ+U9cVahEC7nrTo6ZN33w2fdsCykvTOaaCTc+/vn7XbOf27X840CNEYXYRJYp6gEOswb24YPlHbsHtIgSvO1Tt/aNgglRWTJTIMsB9FeIDIAcTZKzidsmIYNoNumpEE0mvSDCQcMqgKDq0ecmDv/sY0grekXil4n0opXCvyTxF4Foi34pWCQpuZ1IxYPFdpK2LWAmPpT4UNotKmqzBTx4kEQTPe0X44lkatj5h6+gyFQUI8s9AErADCghpxChSUIq6W9aWq+iEh0EzeVzKTffqK/+V2sg03wjXKk33FSeImbcYKhhN4/fd9OemVtlr18f6ZF5rjKH9R0+33cKp0KsIC1o7ti2EsbaPoaf9TE+XHZxvoCWEf8N39gvBlhmi0fAkSinC+Kfdr71j6KX8/f3IsaxwaMgt13oOvSHqDWPUJHst4lgUJPbYrSVYGw6EzbJmG2FpioVMiaTCDWwcZMkbLKjgskBgwSWSMZuZQLUIDMxT7EVyNBuIAi2mZGtEbDEg/A3kgGDi/RuGQODQ1aiABSWA3WgrMgWkMa2JhlTyCTIBLxUhbO706lhZhxXc/mUgetmuFGpm3xYc6d4dz+mQgGbBJFN4OowNjCYIp9vmGG9EdZDsFbEwRoYbDIFk0O6mazUmTcx5w8nC4c/c/3p7WF9p8ozvPRZIiZYjLPTXh4L3N6Rxs1jUZ8Wcgksy/T3NAXGODmw0+tiotqg/xavsPwVwesV2K2Cl/ly0tv5m+Nbkjur+2+/7oX3J1hmBPMc5rMcJ/LTyd/77O8O9A6F5NSO04195WQ+hpmymxFwMCDybv/ymxm6EW2o/U5c+g/m28xHURrwSg9J2A0n5mmTq1J0gqZeiYPXQUOHmZdkeY9cVJ94Qi1CR37iiU30Y7+Cv0av4c9F0L2EBtEcWkTENMiMo3vJJmmD6OAuVwEILZGs3Z7IqkKRTNokK1uz4EAl29oDOp2cAMXJTZJVqPpm1afj+kChYlJIKSnnIv3R4qCjbWEGtF0ojU5SbaclIGQ12k+n6QqJUJVXdFCTG9SVA43XzUauVm3UzUoYAEUC7eaom4RA5WHeBPWKbIpqnBoHIFEjhqktgCHkc+z3qVyXq7TtjF6156NX3+4OMLwh9MVGPrhn7u6bzQd+7Ar7hq87cLq0N+lnmKasspMnM/trJQXf2tUIbTKzV98yuyunv6/pYVhmf9zcfnhPKp4+ox3a2j88qgd0r9fDjw8N4giTLrtu7Js5MCBRXHcjz6XbQK6HURiV0RSaR9ejD+BB1KpT3xq3iatCxmXC2hTHAeNlm0QNMmyTsk32GeSQTVIGydvkZoNsN8n7bKqSbZXWzM3UpWau8hQx+W2DsEtkrkIYmzCytQPUMW8TvtLaMU8n7Zj2FNvq/A7QV8IkXruleilbpaFiXrYMX5FE6J7WCVAgwyoqgJYWy+ym2tihtEOl4V1OSFCfllE4lb+KEvOK5RsCCPOqbTc3WHB0KvsB2LwB4NaVtkcMhuhEVrV4DVhIIUCNq8TdtIajYCS9TbIP4lqTlFVSapJDyrlYojCUoWtSKsk2SV4hg2AIDV5L10zNCSSpfMOJQXy+Pom1dK4KCFmrplNAmxWdBhrerHHaBrNJVnRM19fSbgoG2uZBZRP9QH3r87X+5Ph7s4m+SHlMqgT2v8wOhKfi0WA5tnNwNBceZ3ax+73Cyn5qF8wXBO/y6+fHsSsyMD/GXrORv7F/iOm/ZmQbPzhXzVaiiSwX3+a/cFAyG2IuEksmx40Zw5+KJNvH6Xza4J81Gmc8WnHXD//pMi+y3u3aFbr0XfYi8wvIlCQUR3nUANQ+gVoatSvIF1iKyzwkCgap2sRHKfDjccen05TKgz/PQmhcsvwZgHJsW0KiUrF24yKy+jSKxi4OUf+sloDw+AMCJWbGgUhmsgkgyiN1UAqoobL2xJvkiX4Ff7PcL0wemlz7sNddKd63YG7sn3KW/bPTdv5iXUaMsZlzpQAZJ+l6EvAujibRAmpxVG4Zk4puK6QHIDWT+G0yBDFtyiDCEgiI9NitHoE6T48CzoNlawB8LWmTpt1qDlB+c8RTtLaBBAHB4IhFnMrVlGp9bBXOgHaiD6W5txmH9K50oTT51F0ZSdOkzNg1CX2xNInfeEvuDPAmS/jDdz2lSbOSds2Yqiecif+NSY/tXT87tRwDzn81OgK2cx96BD2GHkStj1NZ+G1r6D1gGJxhZfabVDDWnnsrVDTWzB1Ab7Wt4x8GumZYxx4A+lGwp8cN8skl4rGtyCiMeGQLAabIZegP2tbsrfQpWwngTR2F/kHbuvsh+pStdwHvtvuh/xHb+hNHflmI1hvkUafYvpHmNo3j2q8ff6fzN39fQ+maLNWXgysJr3COGtQVzUZu5wdvzf9N5lxuZmvZFX+2Vssyv8hVD62b8A/We69ctvBn3oL5NsOX93lh5VHna46B5Gk+4Ln0ZfYx9jqomhqQDT7u1CNRm+x0ckE3RZBrneC013ayvrklmmLnZCsGPrFgk+10hm6TBdlinFLESfq25yC+JPtmds7vpWiixyBmTO+DALGgWKH98GTUds/4xLVORNkJgeJphm9u2TZNJxfcMHmGTrpWsYp0UUpt53bPvduBomy9CmlBio8xkO+5U8Ns3h2C7KgClZ4zAElUlx5m8hSSYiy3llnlqo38WnLVTan4cL0SZtOyfEoaVlnFzXkTMUnkZVaV7pBLUuer3ec+mCCXNk7A3zfK+4wHyyeNSqV8euTUFdTDsOQUpBcyz/sHEi6fW2FVAzaS8He6zwV5SL5ywr+PPDi8YJTvGDkNTmScuoJCLpqzuUbBj3kkohgaRu9FrbCDY4D/BkV/2SBF0I8BOcQSCUH9I1scaMNL8b6FOYpZ2NPFsl7gJ2yrDFrCUAsSf5P0KiQAemDDgPkCRACnXFSICOK+jOzJWiOMs5BXa0o3rwYPyYU3e8utDowz9y2/fu4QTuDE8r1O4vwAtAu17PK91N3ZB3JVZncXt19YPk4nnt0I9erKfsdCv5CrVimEQZ2HE2wEvwE4piEAKgrYfjiubFjKOghvjDNsJKGv7NcTCZ35gp7Af3ucdmmDOAcTLzr1dz8qoXHI1OqoFaTSjDr5r8upuyEphqoa5DcNJg9ftdewrqYR0yzQsg7RWll1zMo5OhjT5leovUP6a9xZXvR6Rf4sa6wlsuzLTgx81BHMsc39y3PwR/38Wc4r4BnBy53t/OjXwsMrV+QXby8PdoM8fG8tD4Gn8giCLax7l/6/lccFKgrOEQobeacCYYY7L1BR8I5cOrO/uUAEpz56kj2KPGBrSdRE74ZM/r3oJPo2apWpVAbsFiQVxTY7UIZUe4DCH2TycZtca5DDNkVPipR3OEi5HfBRtmTwOB8IT7aOQe+ITY7IVhVT77VOUaycAxEyHOCcrHzRo4fHZ3bMUw/0qWRvkxxT2kMlp3gmR1Qy0CRV5UtGvt44cPD4CcrMqOQk+G60rKhfFELBzFCpStlxhaQBQNV2vTGzgzIOK2R3k0yoX9oytn3uxpuOf4Ay9yrkdif5hpyb3oXpYY36O9VBRc91ExcnbVmvTnN5qLMrkw7YNvRwns+vQS6f24Csrg1r8YY9w+vf9J9nQDmBwJlAdMEre+GzuB4LmbMAp6WHys97xdOfkoYp/H7aKyknLhOqeH5tCr59fV3nQnenH61v/fEzHOd0MuuxdtGZ0tNF2Be8uvfTFI9L0mdOe6Tfukz4/efXpow7K3BifYvr13btYhM6x0wBNgWQiojbcIBJNCzJASZ0OfaAVTNFzbfsSXiWfZqE38BvaHHoAieuOfvM4hnmIdgniJwdeKjYIFtf3ehKsJlxVtH1+O61/STYvBsrwH63OvVCHnK+21CLp3Yrmt3AQG9wIGh4TRo9+rppr7lEhiAHli0MZhmwSUC2PNBT7JZHobHDE+nmu9aQCbY6thVsFSuWKwPPgEomwf4yCRgwyhQHMlWnZqf3hs6zscGzx3AMO1kWFHIsmMhqcjyO012zoLbDvKLFNC32hNNen9CXv0LR+6JvNH0mPeq7qCe+JPSc0aQzknYGsnR12dfnW1adyaufs+foAtoMDCQS+Fp9mSbRy3pYptKWu/eGzv1XDlURFYbk3BjmQHN55+YDxD5A0S0kKeo5jLzRXuotOcVKZegJkexOp3KrHhPDzhVpig/r/Ophqo16HNcT7NFO68a/nPD5592Ka/Cu6bueeur1ffOqV+iBF4K32X0fvp6Jdh7tLMwFfPNuhquNPfXTp+b3ymEdXpeebfauVYxefd8gZGlpVEQm+ghqFalWDUeZoLKwQWIm6YVUrUIPYcJZqgYZWYKMnCbjPaBOzSaabCWh12+TftnKdi90aqBXrQdSMJ87XzAq9KRJpc0yAT/t9qtPS8Fccdh0UrVwAOYJSmawVKaDvUo7OzA04iRmWMRUJhOYiqRC7+dieC17cK0+VTmXcMt6AgSYyMn1BLOo3f7w7Ron9vW5xD037BFdfX1i50eFrYXCVjznPJ57tbP06qu4gHtXOp9eWcG3YHZm374ZsdcjiqXR0ZIoenoxR2eufjp/jAuv0kVMb3fBytq9+zTEORP8wgtZVA61/FR+gMuQT3hAWpJBgRpZnF9RW4ybd+7DsYnT+SSfxmwS15Ia/sZRvGtxrvOZubvwyT/C0ZV76ZYr/mefZe7s/NnKv54/j7o1p+ODEajeG2gvIl6jFUs2TCiefHarN12tQAEEzlc0wNAwGTWsJv1inxdciI+DT2WUViBqwguQotrWI8MGlTVWiOZcklbqZi5Pr0kbE2wDm0HIhGNMHIf4fIoH/KXgXAN0FnEoxgKe83j0SU7jyo3OT3rLW7BY6U8KOD17j7qQjhSjewUWL2l/z8xh3tu7sCI35EQk78J4gMGPnFh5zCWUXALfozE/7/xL4Rt7x09oMpv0cB5BjEkMK8jaeZz7RFT1cC6c9HKrZ/+Y8/uGgnT0eUQ8Br30gvxUMgFPCKoQBo5t0h85ggA+YcOKdC/mXxx/c5FezBN1WCT6i5zFML8UiffF5ya/8eYFOsARDCMijATpSOhFjohyG4k4WCSMDAbrDRbbHtpSvkT5LGp7xZDu3NFP+RFmWI9XlNRgl7X2j0xFaQ7ZSAaT9M4xHcdmrRFM5nGS5bLMvUJHjuID/hMn+Jv8LzMv9XU+4bmE2Mhs5/nOeUa+ufPq/bHY1Y828SgeuQULy986fHhVDmBvzEtgeSEaGVBX2VBV6w6ga2BOWUANiKCN/AQex9gMa+zFlWeDmd7snj/4UEIKM8K7m+cPHnwt0BPfw39wiNVEE3+nuYdi/GrOtlbX51bvNSAv1gx6tZE1KKDXDKjeKcCv3lVkN+VY+U10423G2YuASwcomLJPStoFTeoIlKChBwB5+XVnJNId+aQzcqukHZ+lPdr8w6/tof9H51opU4J5pXuux52Ro92Ru52Rh/5PzvVOc+grz7XxWBtP9T86FIuESyfZZ5ivQkSKoRTUDEQwWu6gTlHOY7c4NUxRLmBArMFQRlgZCnEegUJciKYNCmG6+KrHsZbna3VwPBGHIQPNSbg2gScxZs0gVJ34z3fjqbypLn3zHtfCG2bIJd3w+B2l2jjLYu3I157BLuary52g12X4vcNy9OWTh4WouyT6XEWfznGM2rmEv3XgAMV/qgPmTuf34RQ6hloC1YAO2OTcdSlxeHHJeVfiW6J8XabVJb33S3ZvO1ibnsJKKlA1p5ok5txrs/R3PWTpcDJKasq5YKQ/meqGxIqubSyQsZLm82nFrIUbGtdI19Jamv1cvFCIL5+lLf7p4g1HFheP3IC3PHZk8QbmzkK80+cM/DBe6Aj4dxYXOw+ev+ee8/HvOoHm8t1mEU2hQ6s2lbBbCVrwo0QBCv4ep1im59rm3G52Iz8cg+Y42+E0mX4o+pXhStOJ7z2QxrWH6036gw2RFCfVu1xer1b5EN8hGS1i51e2tdsAsDkIPGYliDdesazes7CRI9OdoekjR6bxa8mk4OL7XB7OJ3aGoMLP4ddyVS7j5kK/36mLGfHnojgBj4/h49BOiPiadnfd9BGRDfJ9nKua6657hIdVGMMiWEOnOmvoYoT+C93/Vj8AAHjafY+/asMwEIc/JU6aQhsyltJBQ6eCg20IgdCt1GTwlNJsHUJijCCxwHaeqVufpM/Qta/Ri31ZOkTipO9Ov/sjYMwXhm7d8qBsGPGs3OOKd+U+j3wqB6L5UR5wY4zykJGxojTBtXj3bdaJDROelHvS91W5z5IP5UA038oD7vhVHjIxY1I8JQ2ObUs1lkz2C6S+bNzWl7XNMnHfRHNgJ2cjykoC7rBzjRdakVNwZM/m9LDKi+N+I3AunrYJhagsCVMiuRdi/0t20Vg0IXOxRJQxs26U1FdFbpNpZBf23FowTsJ5mETx7OKEa+ldyedcO9GpRzcF67yqnS9tLHUvVfgDz/ZF8gAAAHjabc25DgFhGIXh/53B2Pd9J9HPN/bSWolC4iI0OjfgxhFO6SQnT/k6z333errI/dvkc5yHh+98YsRJEJAkRZoMWXLkKVCkRJkKVWrUadCkRZsOXXr0GTBkxDh2vp5O3u4SPO63YxiG0mQkp3Im53Ihl3Il13Ijt3In9/Igjz9NfVPf1Df1TX1T39Q39U19U9/UN/VNfVPfDm8tR0peAAB42mNgYGBkAIKLcceVwfQJ+XIoXQEARe8GegAA) format(\"woff\");\n  font-weight: normal;\n  font-style: normal;\n}\n.simditor-icon {\n  display: inline-block;\n  font: normal normal normal 14px/1 'Simditor';\n  font-size: inherit;\n  text-rendering: auto;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n  transform: translate(0, 0);\n}\n\n.simditor-icon-code:before {\n  content: '\\F000';\n}\n\n.simditor-icon-bold:before {\n  content: '\\F001';\n}\n\n.simditor-icon-italic:before {\n  content: '\\F002';\n}\n\n.simditor-icon-underline:before {\n  content: '\\F003';\n}\n\n.simditor-icon-times:before {\n  content: '\\F004';\n}\n\n.simditor-icon-strikethrough:before {\n  content: '\\F005';\n}\n\n.simditor-icon-list-ol:before {\n  content: '\\F006';\n}\n\n.simditor-icon-list-ul:before {\n  content: '\\F007';\n}\n\n.simditor-icon-quote-left:before {\n  content: '\\F008';\n}\n\n.simditor-icon-table:before {\n  content: '\\F009';\n}\n\n.simditor-icon-link:before {\n  content: '\\F00A';\n}\n\n.simditor-icon-picture-o:before {\n  content: '\\F00B';\n}\n\n.simditor-icon-minus:before {\n  content: '\\F00C';\n}\n\n.simditor-icon-indent:before {\n  content: '\\F00D';\n}\n\n.simditor-icon-outdent:before {\n  content: '\\F00E';\n}\n\n.simditor-icon-unlink:before {\n  content: '\\F00F';\n}\n\n.simditor-icon-caret-down:before {\n  content: '\\F010';\n}\n\n.simditor-icon-caret-right:before {\n  content: '\\F011';\n}\n\n.simditor-icon-upload:before {\n  content: '\\F012';\n}\n\n.simditor-icon-undo:before {\n  content: '\\F013';\n}\n\n.simditor-icon-smile-o:before {\n  content: '\\F014';\n}\n\n.simditor-icon-tint:before {\n  content: '\\F015';\n}\n\n.simditor-icon-font:before {\n  content: '\\F016';\n}\n\n.simditor-icon-html5:before {\n  content: '\\F017';\n}\n\n.simditor-icon-mark:before {\n  content: '\\F018';\n}\n\n.simditor-icon-align-center:before {\n  content: '\\F019';\n}\n\n.simditor-icon-align-left:before {\n  content: '\\F01A';\n}\n\n.simditor-icon-align-right:before {\n  content: '\\F01B';\n}\n\n.simditor-icon-font-minus:before {\n  content: '\\F01C';\n}\n\n.simditor-icon-markdown:before {\n  content: '\\F01D';\n}\n\n.simditor-icon-checklist:before {\n  content: '\\F01E';\n}\n\n.simditor {\n  position: relative;\n  border: 1px solid #c9d8db;\n}\n.simditor .simditor-wrapper {\n  position: relative;\n  background: #ffffff;\n  overflow: hidden;\n}\n.simditor .simditor-wrapper > textarea {\n  display: none !important;\n  width: 100%;\n  box-sizing: border-box;\n  font-family: monaco;\n  font-size: 16px;\n  line-height: 1.6;\n  border: none;\n  padding: 22px 15px 40px;\n  min-height: 300px;\n  outline: none;\n  background: transparent;\n  resize: none;\n}\n.simditor .simditor-wrapper .simditor-placeholder {\n  display: none;\n  position: absolute;\n  left: 0;\n  z-index: 0;\n  padding: 22px 15px;\n  font-size: 16px;\n  font-family: arial, sans-serif;\n  line-height: 1.5;\n  color: #999999;\n  background: transparent;\n}\n.simditor .simditor-wrapper.toolbar-floating .simditor-toolbar {\n  position: fixed;\n  top: 0;\n  z-index: 10;\n  box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);\n}\n.simditor .simditor-wrapper .simditor-image-loading {\n  width: 100%;\n  height: 100%;\n  position: absolute;\n  top: 0;\n  left: 0;\n  z-index: 2;\n}\n.simditor .simditor-wrapper .simditor-image-loading .progress {\n  width: 100%;\n  height: 100%;\n  background: rgba(0, 0, 0, 0.4);\n  position: absolute;\n  bottom: 0;\n  left: 0;\n}\n.simditor .simditor-body {\n  padding: 22px 15px 40px;\n  min-height: 300px;\n  outline: none;\n  cursor: text;\n  position: relative;\n  z-index: 1;\n  background: transparent;\n}\n.simditor .simditor-body a.selected {\n  background: #b3d4fd;\n}\n.simditor .simditor-body a.simditor-mention {\n  cursor: pointer;\n}\n.simditor .simditor-body .simditor-table {\n  position: relative;\n}\n.simditor .simditor-body .simditor-table.resizing {\n  cursor: col-resize;\n}\n.simditor .simditor-body .simditor-table .simditor-resize-handle {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 10px;\n  height: 100%;\n  cursor: col-resize;\n}\n.simditor .simditor-body pre {\n  /*min-height: 28px;*/\n  box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  word-wrap: break-word !important;\n  white-space: pre-wrap !important;\n}\n.simditor .simditor-body img {\n  cursor: pointer;\n}\n.simditor .simditor-body img.selected {\n  box-shadow: 0 0 0 4px #cccccc;\n}\n.simditor .simditor-paste-area,\n.simditor .simditor-clean-paste-area {\n  background: transparent;\n  border: none;\n  outline: none;\n  resize: none;\n  padding: 0;\n  margin: 0;\n}\n.simditor .simditor-toolbar {\n  border-bottom: 1px solid #eeeeee;\n  background: #ffffff;\n  width: 100%;\n}\n.simditor .simditor-toolbar > ul {\n  margin: 0;\n  padding: 0 0 0 6px;\n  list-style: none;\n}\n.simditor .simditor-toolbar > ul:after {\n  content: \"\";\n  display: table;\n  clear: both;\n}\n.simditor .simditor-toolbar > ul > li {\n  position: relative;\n  float: left;\n}\n.simditor .simditor-toolbar > ul > li > span.separator {\n  display: block;\n  float: left;\n  background: #cfcfcf;\n  width: 1px;\n  height: 18px;\n  margin: 11px 15px;\n}\n.simditor .simditor-toolbar > ul > li > .toolbar-item {\n  display: block;\n  float: left;\n  width: 46px;\n  height: 40px;\n  outline: none;\n  color: #333333;\n  font-size: 15px;\n  line-height: 40px;\n  text-align: center;\n  text-decoration: none;\n}\n.simditor .simditor-toolbar > ul > li > .toolbar-item span {\n  opacity: 0.6;\n}\n.simditor .simditor-toolbar > ul > li > .toolbar-item span.simditor-icon {\n  display: inline;\n  line-height: normal;\n}\n.simditor .simditor-toolbar > ul > li > .toolbar-item:hover span {\n  opacity: 1;\n}\n.simditor .simditor-toolbar > ul > li > .toolbar-item.active {\n  background: #eeeeee;\n}\n.simditor .simditor-toolbar > ul > li > .toolbar-item.active span {\n  opacity: 1;\n}\n.simditor .simditor-toolbar > ul > li > .toolbar-item.disabled {\n  cursor: default;\n}\n.simditor .simditor-toolbar > ul > li > .toolbar-item.disabled span {\n  opacity: 0.3;\n}\n.simditor .simditor-toolbar > ul > li > .toolbar-item.toolbar-item-title span:before {\n  content: \"H\";\n  font-size: 19px;\n  font-weight: bold;\n  font-family: 'Times New Roman';\n}\n.simditor .simditor-toolbar > ul > li > .toolbar-item.toolbar-item-title.active-h1 span:before {\n  content: 'H1';\n  font-size: 18px;\n}\n.simditor .simditor-toolbar > ul > li > .toolbar-item.toolbar-item-title.active-h2 span:before {\n  content: 'H2';\n  font-size: 18px;\n}\n.simditor .simditor-toolbar > ul > li > .toolbar-item.toolbar-item-title.active-h3 span:before {\n  content: 'H3';\n  font-size: 18px;\n}\n.simditor .simditor-toolbar > ul > li > .toolbar-item.toolbar-item-image {\n  position: relative;\n  overflow: hidden;\n}\n.simditor .simditor-toolbar > ul > li > .toolbar-item.toolbar-item-image > input[type=file] {\n  position: absolute;\n  right: 0px;\n  top: 0px;\n  opacity: 0;\n  font-size: 100px;\n  cursor: pointer;\n}\n.simditor .simditor-toolbar > ul > li.menu-on .toolbar-item {\n  position: relative;\n  z-index: 21;\n  background: #ffffff;\n  box-shadow: 0 -3px 3px rgba(0, 0, 0, 0.2);\n}\n.simditor .simditor-toolbar > ul > li.menu-on .toolbar-item span {\n  opacity: 1;\n}\n.simditor .simditor-toolbar > ul > li.menu-on .toolbar-menu {\n  display: block;\n}\n.simditor .simditor-toolbar .toolbar-menu {\n  display: none;\n  position: absolute;\n  top: 40px;\n  left: 0;\n  z-index: 20;\n  background: #ffffff;\n  text-align: left;\n  box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);\n}\n.simditor .simditor-toolbar .toolbar-menu ul {\n  min-width: 160px;\n  list-style: none;\n  margin: 0;\n  padding: 10px 1px;\n}\n.simditor .simditor-toolbar .toolbar-menu ul > li .menu-item {\n  display: block;\n  font-size: 16px;\n  line-height: 2em;\n  padding: 0 10px;\n  text-decoration: none;\n  color: #666666;\n}\n.simditor .simditor-toolbar .toolbar-menu ul > li .menu-item:hover {\n  background: #f6f6f6;\n}\n.simditor .simditor-toolbar .toolbar-menu ul > li .menu-item.menu-item-h1 {\n  font-size: 24px;\n  color: #333333;\n}\n.simditor .simditor-toolbar .toolbar-menu ul > li .menu-item.menu-item-h2 {\n  font-size: 22px;\n  color: #333333;\n}\n.simditor .simditor-toolbar .toolbar-menu ul > li .menu-item.menu-item-h3 {\n  font-size: 20px;\n  color: #333333;\n}\n.simditor .simditor-toolbar .toolbar-menu ul > li .menu-item.menu-item-h4 {\n  font-size: 18px;\n  color: #333333;\n}\n.simditor .simditor-toolbar .toolbar-menu ul > li .menu-item.menu-item-h5 {\n  font-size: 16px;\n  color: #333333;\n}\n.simditor .simditor-toolbar .toolbar-menu ul > li .separator {\n  display: block;\n  border-top: 1px solid #cccccc;\n  height: 0;\n  line-height: 0;\n  font-size: 0;\n  margin: 6px 0;\n}\n.simditor .simditor-toolbar .toolbar-menu.toolbar-menu-color {\n  width: 96px;\n}\n.simditor .simditor-toolbar .toolbar-menu.toolbar-menu-color .color-list {\n  height: 40px;\n  margin: 10px 6px 6px 10px;\n  padding: 0;\n  min-width: 0;\n}\n.simditor .simditor-toolbar .toolbar-menu.toolbar-menu-color .color-list li {\n  float: left;\n  margin: 0 4px 4px 0;\n}\n.simditor .simditor-toolbar .toolbar-menu.toolbar-menu-color .color-list li .font-color {\n  display: block;\n  width: 16px;\n  height: 16px;\n  background: #dfdfdf;\n  border-radius: 2px;\n}\n.simditor .simditor-toolbar .toolbar-menu.toolbar-menu-color .color-list li .font-color:hover {\n  opacity: 0.8;\n}\n.simditor .simditor-toolbar .toolbar-menu.toolbar-menu-color .color-list li .font-color.font-color-default {\n  background: #333333;\n}\n.simditor .simditor-toolbar .toolbar-menu.toolbar-menu-color .color-list li .font-color-1 {\n  background: #E33737;\n}\n.simditor .simditor-toolbar .toolbar-menu.toolbar-menu-color .color-list li .font-color-2 {\n  background: #e28b41;\n}\n.simditor .simditor-toolbar .toolbar-menu.toolbar-menu-color .color-list li .font-color-3 {\n  background: #c8a732;\n}\n.simditor .simditor-toolbar .toolbar-menu.toolbar-menu-color .color-list li .font-color-4 {\n  background: #209361;\n}\n.simditor .simditor-toolbar .toolbar-menu.toolbar-menu-color .color-list li .font-color-5 {\n  background: #418caf;\n}\n.simditor .simditor-toolbar .toolbar-menu.toolbar-menu-color .color-list li .font-color-6 {\n  background: #aa8773;\n}\n.simditor .simditor-toolbar .toolbar-menu.toolbar-menu-color .color-list li .font-color-7 {\n  background: #999999;\n}\n.simditor .simditor-toolbar .toolbar-menu.toolbar-menu-table .menu-create-table {\n  background: #ffffff;\n}\n.simditor .simditor-toolbar .toolbar-menu.toolbar-menu-table .menu-create-table table {\n  border: none;\n  border-collapse: collapse;\n  border-spacing: 0;\n  table-layout: fixed;\n}\n.simditor .simditor-toolbar .toolbar-menu.toolbar-menu-table .menu-create-table table td {\n  height: 16px;\n  padding: 0;\n  border: 2px solid #ffffff;\n  background: #f3f3f3;\n  cursor: pointer;\n}\n.simditor .simditor-toolbar .toolbar-menu.toolbar-menu-table .menu-create-table table td:before {\n  width: 16px;\n  display: block;\n  content: \"\";\n}\n.simditor .simditor-toolbar .toolbar-menu.toolbar-menu-table .menu-create-table table td.selected {\n  background: #cfcfcf;\n}\n.simditor .simditor-toolbar .toolbar-menu.toolbar-menu-table .menu-edit-table {\n  display: none;\n}\n.simditor .simditor-toolbar .toolbar-menu.toolbar-menu-table .menu-edit-table ul li {\n  white-space: nowrap;\n}\n.simditor .simditor-toolbar .toolbar-menu.toolbar-menu-image .menu-item-upload-image {\n  position: relative;\n  overflow: hidden;\n}\n.simditor .simditor-toolbar .toolbar-menu.toolbar-menu-image .menu-item-upload-image input[type=file] {\n  position: absolute;\n  right: 0px;\n  top: 0px;\n  opacity: 0;\n  font-size: 100px;\n  cursor: pointer;\n}\n.simditor .simditor-toolbar .toolbar-menu.toolbar-menu-alignment {\n  width: 100%;\n}\n.simditor .simditor-toolbar .toolbar-menu.toolbar-menu-alignment ul {\n  min-width: 100%;\n}\n.simditor .simditor-toolbar .toolbar-menu.toolbar-menu-alignment .menu-item {\n  text-align: center;\n}\n.simditor .simditor-popover {\n  display: none;\n  padding: 5px 8px 0;\n  background: #ffffff;\n  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);\n  border-radius: 2px;\n  position: absolute;\n  z-index: 2;\n}\n.simditor .simditor-popover .settings-field {\n  margin: 0 0 5px 0;\n  font-size: 12px;\n  height: 25px;\n  line-height: 25px;\n}\n.simditor .simditor-popover .settings-field label {\n  margin: 0 8px 0 0;\n  float: left;\n}\n.simditor .simditor-popover .settings-field input[type=text] {\n  float: left;\n  width: 200px;\n  box-sizing: border-box;\n  font-size: 12px;\n}\n.simditor .simditor-popover .settings-field input[type=text].image-size {\n  width: 87px;\n}\n.simditor .simditor-popover .settings-field .times {\n  float: left;\n  width: 26px;\n  font-size: 12px;\n  text-align: center;\n}\n.simditor .simditor-popover.link-popover .btn-unlink, .simditor .simditor-popover.image-popover .btn-upload, .simditor .simditor-popover.image-popover .btn-restore {\n  float: left;\n  margin: 0 0 0 8px;\n  color: #333333;\n  font-size: 14px;\n  outline: 0;\n}\n.simditor .simditor-popover.link-popover .btn-unlink span, .simditor .simditor-popover.image-popover .btn-upload span, .simditor .simditor-popover.image-popover .btn-restore span {\n  opacity: 0.6;\n}\n.simditor .simditor-popover.link-popover .btn-unlink:hover span, .simditor .simditor-popover.image-popover .btn-upload:hover span, .simditor .simditor-popover.image-popover .btn-restore:hover span {\n  opacity: 1;\n}\n.simditor .simditor-popover.image-popover .btn-upload {\n  position: relative;\n  display: inline-block;\n  overflow: hidden;\n}\n.simditor .simditor-popover.image-popover .btn-upload input[type=file] {\n  position: absolute;\n  right: 0px;\n  top: 0px;\n  opacity: 0;\n  height: 100%;\n  width: 28px;\n}\n.simditor.simditor-mobile .simditor-toolbar > ul > li > .toolbar-item {\n  width: 46px;\n}\n.simditor.simditor-mobile .simditor-wrapper.toolbar-floating .simditor-toolbar {\n  position: absolute;\n  top: 0;\n  z-index: 10;\n  box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);\n}\n\n.simditor .simditor-body, .editor-style {\n  font-size: 16px;\n  font-family: arial, sans-serif;\n  line-height: 1.6;\n  color: #333;\n  outline: none;\n  word-wrap: break-word;\n}\n.simditor .simditor-body > :first-child, .editor-style > :first-child {\n  margin-top: 0 !important;\n}\n.simditor .simditor-body a, .editor-style a {\n  color: #4298BA;\n  text-decoration: none;\n  word-break: break-all;\n}\n.simditor .simditor-body a:visited, .editor-style a:visited {\n  color: #4298BA;\n}\n.simditor .simditor-body a:hover, .editor-style a:hover {\n  color: #0F769F;\n}\n.simditor .simditor-body a:active, .editor-style a:active {\n  color: #9E792E;\n}\n.simditor .simditor-body a:hover, .simditor .simditor-body a:active, .editor-style a:hover, .editor-style a:active {\n  outline: 0;\n}\n.simditor .simditor-body h1, .simditor .simditor-body h2, .simditor .simditor-body h3, .simditor .simditor-body h4, .simditor .simditor-body h5, .simditor .simditor-body h6, .editor-style h1, .editor-style h2, .editor-style h3, .editor-style h4, .editor-style h5, .editor-style h6 {\n  font-weight: normal;\n  margin: 40px 0 20px;\n  color: #000000;\n}\n.simditor .simditor-body h1, .editor-style h1 {\n  font-size: 24px;\n}\n.simditor .simditor-body h2, .editor-style h2 {\n  font-size: 22px;\n}\n.simditor .simditor-body h3, .editor-style h3 {\n  font-size: 20px;\n}\n.simditor .simditor-body h4, .editor-style h4 {\n  font-size: 18px;\n}\n.simditor .simditor-body h5, .editor-style h5 {\n  font-size: 16px;\n}\n.simditor .simditor-body h6, .editor-style h6 {\n  font-size: 16px;\n}\n.simditor .simditor-body p, .simditor .simditor-body div, .editor-style p, .editor-style div {\n  word-wrap: break-word;\n  margin: 0 0 15px 0;\n  color: #333;\n  word-wrap: break-word;\n}\n.simditor .simditor-body b, .simditor .simditor-body strong, .editor-style b, .editor-style strong {\n  font-weight: bold;\n}\n.simditor .simditor-body i, .simditor .simditor-body em, .editor-style i, .editor-style em {\n  font-style: italic;\n}\n.simditor .simditor-body u, .editor-style u {\n  text-decoration: underline;\n}\n.simditor .simditor-body strike, .simditor .simditor-body del, .editor-style strike, .editor-style del {\n  text-decoration: line-through;\n}\n.simditor .simditor-body ul, .simditor .simditor-body ol, .editor-style ul, .editor-style ol {\n  list-style: disc outside none;\n  margin: 15px 0;\n  padding: 0 0 0 40px;\n  line-height: 1.6;\n}\n.simditor .simditor-body ul ul, .simditor .simditor-body ul ol, .simditor .simditor-body ol ul, .simditor .simditor-body ol ol, .editor-style ul ul, .editor-style ul ol, .editor-style ol ul, .editor-style ol ol {\n  padding-left: 30px;\n}\n.simditor .simditor-body ul ul, .simditor .simditor-body ol ul, .editor-style ul ul, .editor-style ol ul {\n  list-style: circle outside none;\n}\n.simditor .simditor-body ul ul ul, .simditor .simditor-body ol ul ul, .editor-style ul ul ul, .editor-style ol ul ul {\n  list-style: square outside none;\n}\n.simditor .simditor-body ol, .editor-style ol {\n  list-style: decimal;\n}\n.simditor .simditor-body blockquote, .editor-style blockquote {\n  border-left: 6px solid #ddd;\n  padding: 5px 0 5px 10px;\n  margin: 15px 0 15px 15px;\n}\n.simditor .simditor-body blockquote > :first-child, .editor-style blockquote > :first-child {\n  margin-top: 0;\n}\n.simditor .simditor-body code, .editor-style code {\n  display: inline-block;\n  padding: 0 4px;\n  margin: 0 5px;\n  background: #eeeeee;\n  border-radius: 3px;\n  font-size: 13px;\n  font-family: 'monaco', 'Consolas', \"Liberation Mono\", Courier, monospace;\n}\n.simditor .simditor-body pre, .editor-style pre {\n  padding: 10px 5px 10px 10px;\n  margin: 15px 0;\n  display: block;\n  line-height: 18px;\n  background: #F0F0F0;\n  border-radius: 3px;\n  font-size: 13px;\n  font-family: 'monaco', 'Consolas', \"Liberation Mono\", Courier, monospace;\n  white-space: pre;\n  word-wrap: normal;\n  overflow-x: auto;\n}\n.simditor .simditor-body pre code, .editor-style pre code {\n  display: block;\n  padding: 0;\n  margin: 0;\n  background: none;\n  border-radius: 0;\n}\n.simditor .simditor-body hr, .editor-style hr {\n  display: block;\n  height: 0px;\n  border: 0;\n  border-top: 1px solid #ccc;\n  margin: 15px 0;\n  padding: 0;\n}\n.simditor .simditor-body table, .editor-style table {\n  width: 100%;\n  table-layout: fixed;\n  border-collapse: collapse;\n  border-spacing: 0;\n  margin: 15px 0;\n}\n.simditor .simditor-body table thead, .editor-style table thead {\n  background-color: #f9f9f9;\n}\n.simditor .simditor-body table td, .simditor .simditor-body table th, .editor-style table td, .editor-style table th {\n  min-width: 40px;\n  height: 30px;\n  border: 1px solid #ccc;\n  vertical-align: top;\n  padding: 2px 4px;\n  text-align: left;\n  box-sizing: border-box;\n}\n.simditor .simditor-body table td.active, .simditor .simditor-body table th.active, .editor-style table td.active, .editor-style table th.active {\n  background-color: #ffffee;\n}\n.simditor .simditor-body img, .editor-style img {\n  margin: 0 5px;\n  vertical-align: middle;\n}\n", ""]);

	// exports


/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (root, factory) {
	  if (true) {
	    // AMD. Register as an anonymous module unless amdModuleId is set
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(85),__webpack_require__(86),__webpack_require__(87),__webpack_require__(88)], __WEBPACK_AMD_DEFINE_RESULT__ = function ($, SimpleModule, simpleHotkeys, simpleUploader) {
	      return (root['Simditor'] = factory($, SimpleModule, simpleHotkeys, simpleUploader));
	    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports === 'object') {
	    // Node. Does not work with strict CommonJS, but
	    // only CommonJS-like environments that support module.exports,
	    // like Node.
	    module.exports = factory(require("jquery"),require("simple-module"),require("simple-hotkeys"),require("simple-uploader"));
	  } else {
	    root['Simditor'] = factory(jQuery,SimpleModule,simple.hotkeys,simple.uploader);
	  }
	}(this, function ($, SimpleModule, simpleHotkeys, simpleUploader) {

	var AlignmentButton, BlockquoteButton, BoldButton, Button, CodeButton, CodePopover, ColorButton, Formatter, HrButton, ImageButton, ImagePopover, IndentButton, Indentation, InputManager, ItalicButton, Keystroke, LinkButton, LinkPopover, ListButton, OrderListButton, OutdentButton, Popover, Selection, Simditor, StrikethroughButton, TableButton, TitleButton, Toolbar, UnderlineButton, UndoManager, UnorderListButton, Util,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty,
	  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
	  slice = [].slice;

	Selection = (function(superClass) {
	  extend(Selection, superClass);

	  function Selection() {
	    return Selection.__super__.constructor.apply(this, arguments);
	  }

	  Selection.pluginName = 'Selection';

	  Selection.prototype._range = null;

	  Selection.prototype._startNodes = null;

	  Selection.prototype._endNodes = null;

	  Selection.prototype._containerNode = null;

	  Selection.prototype._nodes = null;

	  Selection.prototype._blockNodes = null;

	  Selection.prototype._rootNodes = null;

	  Selection.prototype._init = function() {
	    this.editor = this._module;
	    this._selection = document.getSelection();
	    this.editor.on('selectionchanged', (function(_this) {
	      return function(e) {
	        _this._reset();
	        return _this._range = _this._selection.getRangeAt(0);
	      };
	    })(this));
	    return this.editor.on('blur', (function(_this) {
	      return function(e) {
	        return _this.clear();
	      };
	    })(this));
	  };

	  Selection.prototype._reset = function() {
	    this._range = null;
	    this._startNodes = null;
	    this._endNodes = null;
	    this._containerNode = null;
	    this._nodes = null;
	    this._blockNodes = null;
	    return this._rootNodes = null;
	  };

	  Selection.prototype.clear = function() {
	    var e;
	    try {
	      this._selection.removeAllRanges();
	    } catch (_error) {
	      e = _error;
	    }
	    return this._reset();
	  };

	  Selection.prototype.range = function(range) {
	    var ffOrIE;
	    if (range) {
	      this.clear();
	      this._selection.addRange(range);
	      this._range = range;
	      ffOrIE = this.editor.util.browser.firefox || this.editor.util.browser.msie;
	      if (!this.editor.inputManager.focused && ffOrIE) {
	        this.editor.body.focus();
	      }
	    } else if (!this._range && this.editor.inputManager.focused && this._selection.rangeCount) {
	      this._range = this._selection.getRangeAt(0);
	    }
	    return this._range;
	  };

	  Selection.prototype.startNodes = function() {
	    if (this._range) {
	      this._startNodes || (this._startNodes = (function(_this) {
	        return function() {
	          var startNodes;
	          startNodes = $(_this._range.startContainer).parentsUntil(_this.editor.body).get();
	          startNodes.unshift(_this._range.startContainer);
	          return $(startNodes);
	        };
	      })(this)());
	    }
	    return this._startNodes;
	  };

	  Selection.prototype.endNodes = function() {
	    var endNodes;
	    if (this._range) {
	      this._endNodes || (this._endNodes = this._range.collapsed ? this.startNodes() : (endNodes = $(this._range.endContainer).parentsUntil(this.editor.body).get(), endNodes.unshift(this._range.endContainer), $(endNodes)));
	    }
	    return this._endNodes;
	  };

	  Selection.prototype.containerNode = function() {
	    if (this._range) {
	      this._containerNode || (this._containerNode = $(this._range.commonAncestorContainer));
	    }
	    return this._containerNode;
	  };

	  Selection.prototype.nodes = function() {
	    if (this._range) {
	      this._nodes || (this._nodes = (function(_this) {
	        return function() {
	          var nodes;
	          nodes = [];
	          if (_this.startNodes().first().is(_this.endNodes().first())) {
	            nodes = _this.startNodes().get();
	          } else {
	            _this.startNodes().each(function(i, node) {
	              var $endNode, $node, $nodes, endIndex, index, sharedIndex, startIndex;
	              $node = $(node);
	              if (_this.endNodes().index($node) > -1) {
	                return nodes.push(node);
	              } else if ($node.parent().is(_this.editor.body) || (sharedIndex = _this.endNodes().index($node.parent())) > -1) {
	                if (sharedIndex && sharedIndex > -1) {
	                  $endNode = _this.endNodes().eq(sharedIndex - 1);
	                } else {
	                  $endNode = _this.endNodes().last();
	                }
	                $nodes = $node.parent().contents();
	                startIndex = $nodes.index($node);
	                endIndex = $nodes.index($endNode);
	                return $.merge(nodes, $nodes.slice(startIndex, endIndex).get());
	              } else {
	                $nodes = $node.parent().contents();
	                index = $nodes.index($node);
	                return $.merge(nodes, $nodes.slice(index).get());
	              }
	            });
	            _this.endNodes().each(function(i, node) {
	              var $node, $nodes, index;
	              $node = $(node);
	              if ($node.parent().is(_this.editor.body) || _this.startNodes().index($node.parent()) > -1) {
	                nodes.push(node);
	                return false;
	              } else {
	                $nodes = $node.parent().contents();
	                index = $nodes.index($node);
	                return $.merge(nodes, $nodes.slice(0, index + 1));
	              }
	            });
	          }
	          return $($.unique(nodes));
	        };
	      })(this)());
	    }
	    return this._nodes;
	  };

	  Selection.prototype.blockNodes = function() {
	    if (!this._range) {
	      return;
	    }
	    this._blockNodes || (this._blockNodes = (function(_this) {
	      return function() {
	        return _this.nodes().filter(function(i, node) {
	          return _this.editor.util.isBlockNode(node);
	        });
	      };
	    })(this)());
	    return this._blockNodes;
	  };

	  Selection.prototype.rootNodes = function() {
	    if (!this._range) {
	      return;
	    }
	    this._rootNodes || (this._rootNodes = (function(_this) {
	      return function() {
	        return _this.nodes().filter(function(i, node) {
	          var $parent;
	          $parent = $(node).parent();
	          return $parent.is(_this.editor.body) || $parent.is('blockquote');
	        });
	      };
	    })(this)());
	    return this._rootNodes;
	  };

	  Selection.prototype.rangeAtEndOf = function(node, range) {
	    var afterLastNode, beforeLastNode, endNode, endNodeLength, lastNodeIsBr, result;
	    if (range == null) {
	      range = this.range();
	    }
	    if (!(range && range.collapsed)) {
	      return;
	    }
	    node = $(node)[0];
	    endNode = range.endContainer;
	    endNodeLength = this.editor.util.getNodeLength(endNode);
	    beforeLastNode = range.endOffset === endNodeLength - 1;
	    lastNodeIsBr = $(endNode).contents().last().is('br');
	    afterLastNode = range.endOffset === endNodeLength;
	    if (!((beforeLastNode && lastNodeIsBr) || afterLastNode)) {
	      return false;
	    }
	    if (node === endNode) {
	      return true;
	    } else if (!$.contains(node, endNode)) {
	      return false;
	    }
	    result = true;
	    $(endNode).parentsUntil(node).addBack().each(function(i, n) {
	      var $lastChild, beforeLastbr, isLastNode, nodes;
	      nodes = $(n).parent().contents().filter(function() {
	        return !(this !== n && this.nodeType === 3 && !this.nodeValue);
	      });
	      $lastChild = nodes.last();
	      isLastNode = $lastChild.get(0) === n;
	      beforeLastbr = $lastChild.is('br') && $lastChild.prev().get(0) === n;
	      if (!(isLastNode || beforeLastbr)) {
	        result = false;
	        return false;
	      }
	    });
	    return result;
	  };

	  Selection.prototype.rangeAtStartOf = function(node, range) {
	    var result, startNode;
	    if (range == null) {
	      range = this.range();
	    }
	    if (!(range && range.collapsed)) {
	      return;
	    }
	    node = $(node)[0];
	    startNode = range.startContainer;
	    if (range.startOffset !== 0) {
	      return false;
	    }
	    if (node === startNode) {
	      return true;
	    } else if (!$.contains(node, startNode)) {
	      return false;
	    }
	    result = true;
	    $(startNode).parentsUntil(node).addBack().each(function(i, n) {
	      var nodes;
	      nodes = $(n).parent().contents().filter(function() {
	        return !(this !== n && this.nodeType === 3 && !this.nodeValue);
	      });
	      if (nodes.first().get(0) !== n) {
	        return result = false;
	      }
	    });
	    return result;
	  };

	  Selection.prototype.insertNode = function(node, range) {
	    if (range == null) {
	      range = this.range();
	    }
	    if (!range) {
	      return;
	    }
	    node = $(node)[0];
	    range.insertNode(node);
	    return this.setRangeAfter(node, range);
	  };

	  Selection.prototype.setRangeAfter = function(node, range) {
	    if (range == null) {
	      range = this.range();
	    }
	    if (range == null) {
	      return;
	    }
	    node = $(node)[0];
	    range.setEndAfter(node);
	    range.collapse(false);
	    return this.range(range);
	  };

	  Selection.prototype.setRangeBefore = function(node, range) {
	    if (range == null) {
	      range = this.range();
	    }
	    if (range == null) {
	      return;
	    }
	    node = $(node)[0];
	    range.setEndBefore(node);
	    range.collapse(false);
	    return this.range(range);
	  };

	  Selection.prototype.setRangeAtStartOf = function(node, range) {
	    if (range == null) {
	      range = this.range();
	    }
	    node = $(node).get(0);
	    range.setEnd(node, 0);
	    range.collapse(false);
	    return this.range(range);
	  };

	  Selection.prototype.setRangeAtEndOf = function(node, range) {
	    var $lastNode, $node, contents, lastChild, lastChildLength, lastText, nodeLength;
	    if (range == null) {
	      range = this.range();
	    }
	    $node = $(node);
	    node = $node[0];
	    if ($node.is('pre')) {
	      contents = $node.contents();
	      if (contents.length > 0) {
	        lastChild = contents.last();
	        lastText = lastChild.text();
	        lastChildLength = this.editor.util.getNodeLength(lastChild[0]);
	        if (lastText.charAt(lastText.length - 1) === '\n') {
	          range.setEnd(lastChild[0], lastChildLength - 1);
	        } else {
	          range.setEnd(lastChild[0], lastChildLength);
	        }
	      } else {
	        range.setEnd(node, 0);
	      }
	    } else {
	      nodeLength = this.editor.util.getNodeLength(node);
	      if (node.nodeType !== 3 && nodeLength > 0) {
	        $lastNode = $(node).contents().last();
	        if ($lastNode.is('br')) {
	          nodeLength -= 1;
	        } else if ($lastNode[0].nodeType !== 3 && this.editor.util.isEmptyNode($lastNode)) {
	          $lastNode.append(this.editor.util.phBr);
	          node = $lastNode[0];
	          nodeLength = 0;
	        }
	      }
	      range.setEnd(node, nodeLength);
	    }
	    range.collapse(false);
	    return this.range(range);
	  };

	  Selection.prototype.deleteRangeContents = function(range) {
	    var atEndOfBody, atStartOfBody, endRange, startRange;
	    if (range == null) {
	      range = this.range();
	    }
	    startRange = range.cloneRange();
	    endRange = range.cloneRange();
	    startRange.collapse(true);
	    endRange.collapse(false);
	    atStartOfBody = this.rangeAtStartOf(this.editor.body, startRange);
	    atEndOfBody = this.rangeAtEndOf(this.editor.body, endRange);
	    if (!range.collapsed && atStartOfBody && atEndOfBody) {
	      this.editor.body.empty();
	      range.setStart(this.editor.body[0], 0);
	      range.collapse(true);
	      this.range(range);
	    } else {
	      range.deleteContents();
	    }
	    return range;
	  };

	  Selection.prototype.breakBlockEl = function(el, range) {
	    var $el;
	    if (range == null) {
	      range = this.range();
	    }
	    $el = $(el);
	    if (!range.collapsed) {
	      return $el;
	    }
	    range.setStartBefore($el.get(0));
	    if (range.collapsed) {
	      return $el;
	    }
	    return $el.before(range.extractContents());
	  };

	  Selection.prototype.save = function(range) {
	    var endCaret, endRange, startCaret;
	    if (range == null) {
	      range = this.range();
	    }
	    if (this._selectionSaved) {
	      return;
	    }
	    endRange = range.cloneRange();
	    endRange.collapse(false);
	    startCaret = $('<span/>').addClass('simditor-caret-start');
	    endCaret = $('<span/>').addClass('simditor-caret-end');
	    endRange.insertNode(endCaret[0]);
	    range.insertNode(startCaret[0]);
	    this.clear();
	    return this._selectionSaved = true;
	  };

	  Selection.prototype.restore = function() {
	    var endCaret, endContainer, endOffset, range, startCaret, startContainer, startOffset;
	    if (!this._selectionSaved) {
	      return false;
	    }
	    startCaret = this.editor.body.find('.simditor-caret-start');
	    endCaret = this.editor.body.find('.simditor-caret-end');
	    if (startCaret.length && endCaret.length) {
	      startContainer = startCaret.parent();
	      startOffset = startContainer.contents().index(startCaret);
	      endContainer = endCaret.parent();
	      endOffset = endContainer.contents().index(endCaret);
	      if (startContainer[0] === endContainer[0]) {
	        endOffset -= 1;
	      }
	      range = document.createRange();
	      range.setStart(startContainer.get(0), startOffset);
	      range.setEnd(endContainer.get(0), endOffset);
	      startCaret.remove();
	      endCaret.remove();
	      this.range(range);
	    } else {
	      startCaret.remove();
	      endCaret.remove();
	    }
	    this._selectionSaved = false;
	    return range;
	  };

	  return Selection;

	})(SimpleModule);

	Formatter = (function(superClass) {
	  extend(Formatter, superClass);

	  function Formatter() {
	    return Formatter.__super__.constructor.apply(this, arguments);
	  }

	  Formatter.pluginName = 'Formatter';

	  Formatter.prototype.opts = {
	    allowedTags: [],
	    allowedAttributes: {},
	    allowedStyles: {}
	  };

	  Formatter.prototype._init = function() {
	    this.editor = this._module;
	    this._allowedTags = $.merge(['br', 'span', 'a', 'img', 'b', 'strong', 'i', 'u', 'font', 'p', 'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'h1', 'h2', 'h3', 'h4', 'hr'], this.opts.allowedTags);
	    this._allowedAttributes = $.extend({
	      img: ['src', 'alt', 'width', 'height', 'data-non-image'],
	      a: ['href', 'target'],
	      font: ['color'],
	      code: ['class']
	    }, this.opts.allowedAttributes);
	    this._allowedStyles = $.extend({
	      span: ['color'],
	      p: ['margin-left', 'text-align'],
	      h1: ['margin-left', 'text-align'],
	      h2: ['margin-left', 'text-align'],
	      h3: ['margin-left', 'text-align'],
	      h4: ['margin-left', 'text-align']
	    }, this.opts.allowedStyles);
	    return this.editor.body.on('click', 'a', function(e) {
	      return false;
	    });
	  };

	  Formatter.prototype.decorate = function($el) {
	    if ($el == null) {
	      $el = this.editor.body;
	    }
	    this.editor.trigger('decorate', [$el]);
	    return $el;
	  };

	  Formatter.prototype.undecorate = function($el) {
	    if ($el == null) {
	      $el = this.editor.body.clone();
	    }
	    this.editor.trigger('undecorate', [$el]);
	    return $el;
	  };

	  Formatter.prototype.autolink = function($el) {
	    var $link, $node, findLinkNode, k, lastIndex, len, linkNodes, match, re, replaceEls, subStr, text, uri;
	    if ($el == null) {
	      $el = this.editor.body;
	    }
	    linkNodes = [];
	    findLinkNode = function($parentNode) {
	      return $parentNode.contents().each(function(i, node) {
	        var $node, text;
	        $node = $(node);
	        if ($node.is('a') || $node.closest('a, pre', $el).length) {
	          return;
	        }
	        if (!$node.is('iframe') && $node.contents().length) {
	          return findLinkNode($node);
	        } else if ((text = $node.text()) && /https?:\/\/|www\./ig.test(text)) {
	          return linkNodes.push($node);
	        }
	      });
	    };
	    findLinkNode($el);
	    re = /(https?:\/\/|www\.)[\w\-\.\?&=\/#%:,@\!\+]+/ig;
	    for (k = 0, len = linkNodes.length; k < len; k++) {
	      $node = linkNodes[k];
	      text = $node.text();
	      replaceEls = [];
	      match = null;
	      lastIndex = 0;
	      while ((match = re.exec(text)) !== null) {
	        subStr = text.substring(lastIndex, match.index);
	        replaceEls.push(document.createTextNode(subStr));
	        lastIndex = re.lastIndex;
	        uri = /^(http(s)?:\/\/|\/)/.test(match[0]) ? match[0] : 'http://' + match[0];
	        $link = $("<a href=\"" + uri + "\" rel=\"nofollow\"></a>").text(match[0]);
	        replaceEls.push($link[0]);
	      }
	      replaceEls.push(document.createTextNode(text.substring(lastIndex)));
	      $node.replaceWith($(replaceEls));
	    }
	    return $el;
	  };

	  Formatter.prototype.format = function($el) {
	    var $node, blockNode, k, l, len, len1, n, node, ref, ref1;
	    if ($el == null) {
	      $el = this.editor.body;
	    }
	    if ($el.is(':empty')) {
	      $el.append('<p>' + this.editor.util.phBr + '</p>');
	      return $el;
	    }
	    ref = $el.contents();
	    for (k = 0, len = ref.length; k < len; k++) {
	      n = ref[k];
	      this.cleanNode(n, true);
	    }
	    ref1 = $el.contents();
	    for (l = 0, len1 = ref1.length; l < len1; l++) {
	      node = ref1[l];
	      $node = $(node);
	      if ($node.is('br')) {
	        if (typeof blockNode !== "undefined" && blockNode !== null) {
	          blockNode = null;
	        }
	        $node.remove();
	      } else if (this.editor.util.isBlockNode(node)) {
	        if ($node.is('li')) {
	          if (blockNode && blockNode.is('ul, ol')) {
	            blockNode.append(node);
	          } else {
	            blockNode = $('<ul/>').insertBefore(node);
	            blockNode.append(node);
	          }
	        } else {
	          blockNode = null;
	        }
	      } else {
	        if (!blockNode || blockNode.is('ul, ol')) {
	          blockNode = $('<p/>').insertBefore(node);
	        }
	        blockNode.append(node);
	      }
	    }
	    return $el;
	  };

	  Formatter.prototype.cleanNode = function(node, recursive) {
	    var $childImg, $node, $p, $td, allowedAttributes, attr, contents, isDecoration, k, l, len, len1, n, ref, ref1, text, textNode;
	    $node = $(node);
	    if (!($node.length > 0)) {
	      return;
	    }
	    if ($node[0].nodeType === 3) {
	      text = $node.text().replace(/(\r\n|\n|\r)/gm, '');
	      if (text) {
	        textNode = document.createTextNode(text);
	        $node.replaceWith(textNode);
	      } else {
	        $node.remove();
	      }
	      return;
	    }
	    contents = $node.is('iframe') ? null : $node.contents();
	    isDecoration = this.editor.util.isDecoratedNode($node);
	    if ($node.is(this._allowedTags.join(',')) || isDecoration) {
	      if ($node.is('a') && ($childImg = $node.find('img')).length > 0) {
	        $node.replaceWith($childImg);
	        $node = $childImg;
	        contents = null;
	      }
	      if ($node.is('img') && $node.hasClass('uploading')) {
	        $node.remove();
	      }
	      if (!isDecoration) {
	        allowedAttributes = this._allowedAttributes[$node[0].tagName.toLowerCase()];
	        ref = $.makeArray($node[0].attributes);
	        for (k = 0, len = ref.length; k < len; k++) {
	          attr = ref[k];
	          if (attr.name === 'style') {
	            continue;
	          }
	          if (!((allowedAttributes != null) && (ref1 = attr.name, indexOf.call(allowedAttributes, ref1) >= 0))) {
	            $node.removeAttr(attr.name);
	          }
	        }
	        this._cleanNodeStyles($node);
	        if ($node.is('span') && $node[0].attributes.length === 0) {
	          $node.contents().first().unwrap();
	        }
	      }
	    } else if ($node[0].nodeType === 1 && !$node.is(':empty')) {
	      if ($node.is('div, article, dl, header, footer, tr')) {
	        $node.append('<br/>');
	        contents.first().unwrap();
	      } else if ($node.is('table')) {
	        $p = $('<p/>');
	        $node.find('tr').each(function(i, tr) {
	          return $p.append($(tr).text() + '<br/>');
	        });
	        $node.replaceWith($p);
	        contents = null;
	      } else if ($node.is('thead, tfoot')) {
	        $node.remove();
	        contents = null;
	      } else if ($node.is('th')) {
	        $td = $('<td/>').append($node.contents());
	        $node.replaceWith($td);
	      } else {
	        contents.first().unwrap();
	      }
	    } else {
	      $node.remove();
	      contents = null;
	    }
	    if (recursive && (contents != null) && !$node.is('pre')) {
	      for (l = 0, len1 = contents.length; l < len1; l++) {
	        n = contents[l];
	        this.cleanNode(n, true);
	      }
	    }
	    return null;
	  };

	  Formatter.prototype._cleanNodeStyles = function($node) {
	    var allowedStyles, k, len, pair, ref, ref1, style, styleStr, styles;
	    styleStr = $node.attr('style');
	    if (!styleStr) {
	      return;
	    }
	    $node.removeAttr('style');
	    allowedStyles = this._allowedStyles[$node[0].tagName.toLowerCase()];
	    if (!(allowedStyles && allowedStyles.length > 0)) {
	      return $node;
	    }
	    styles = {};
	    ref = styleStr.split(';');
	    for (k = 0, len = ref.length; k < len; k++) {
	      style = ref[k];
	      style = $.trim(style);
	      pair = style.split(':');
	      if (!(pair.length = 2)) {
	        continue;
	      }
	      if (ref1 = pair[0], indexOf.call(allowedStyles, ref1) >= 0) {
	        styles[$.trim(pair[0])] = $.trim(pair[1]);
	      }
	    }
	    if (Object.keys(styles).length > 0) {
	      $node.css(styles);
	    }
	    return $node;
	  };

	  Formatter.prototype.clearHtml = function(html, lineBreak) {
	    var container, contents, result;
	    if (lineBreak == null) {
	      lineBreak = true;
	    }
	    container = $('<div/>').append(html);
	    contents = container.contents();
	    result = '';
	    contents.each((function(_this) {
	      return function(i, node) {
	        var $node, children;
	        if (node.nodeType === 3) {
	          return result += node.nodeValue;
	        } else if (node.nodeType === 1) {
	          $node = $(node);
	          children = $node.is('iframe') ? null : $node.contents();
	          if (children && children.length > 0) {
	            result += _this.clearHtml(children);
	          }
	          if (lineBreak && i < contents.length - 1 && $node.is('br, p, div, li,tr, pre, address, artticle, aside, dl, figcaption, footer, h1, h2,h3, h4, header')) {
	            return result += '\n';
	          }
	        }
	      };
	    })(this));
	    return result;
	  };

	  Formatter.prototype.beautify = function($contents) {
	    var uselessP;
	    uselessP = function($el) {
	      return !!($el.is('p') && !$el.text() && $el.children(':not(br)').length < 1);
	    };
	    return $contents.each(function(i, el) {
	      var $el, invalid;
	      $el = $(el);
	      invalid = $el.is(':not(img, br, col, td, hr, [class^="simditor-"]):empty');
	      if (invalid || uselessP($el)) {
	        $el.remove();
	      }
	      return $el.find(':not(img, br, col, td, hr, [class^="simditor-"]):empty').remove();
	    });
	  };

	  return Formatter;

	})(SimpleModule);

	InputManager = (function(superClass) {
	  extend(InputManager, superClass);

	  function InputManager() {
	    return InputManager.__super__.constructor.apply(this, arguments);
	  }

	  InputManager.pluginName = 'InputManager';

	  InputManager.prototype.opts = {
	    pasteImage: false
	  };

	  InputManager.prototype._modifierKeys = [16, 17, 18, 91, 93, 224];

	  InputManager.prototype._arrowKeys = [37, 38, 39, 40];

	  InputManager.prototype._init = function() {
	    var submitKey;
	    this.editor = this._module;
	    this.throttledValueChanged = this.editor.util.throttle((function(_this) {
	      return function(params) {
	        return setTimeout(function() {
	          return _this.editor.trigger('valuechanged', params);
	        }, 10);
	      };
	    })(this), 300);
	    this.throttledSelectionChanged = this.editor.util.throttle((function(_this) {
	      return function() {
	        return _this.editor.trigger('selectionchanged');
	      };
	    })(this), 50);
	    if (this.opts.pasteImage && typeof this.opts.pasteImage !== 'string') {
	      this.opts.pasteImage = 'inline';
	    }
	    this._keystrokeHandlers = {};
	    this.hotkeys = simpleHotkeys({
	      el: this.editor.body
	    });
	    this._pasteArea = $('<div/>').css({
	      width: '1px',
	      height: '1px',
	      overflow: 'hidden',
	      position: 'fixed',
	      right: '0',
	      bottom: '100px'
	    }).attr({
	      tabIndex: '-1',
	      contentEditable: true
	    }).addClass('simditor-paste-area').appendTo(this.editor.el);
	    $(document).on('selectionchange.simditor' + this.editor.id, (function(_this) {
	      return function(e) {
	        if (!_this.focused) {
	          return;
	        }
	        return _this.throttledSelectionChanged();
	      };
	    })(this));
	    this.editor.on('valuechanged', (function(_this) {
	      return function() {
	        _this.lastCaretPosition = null;
	        if (_this.focused && !_this.editor.selection.blockNodes().length) {
	          _this.editor.selection.save();
	          _this.editor.formatter.format();
	          _this.editor.selection.restore();
	        }
	        _this.editor.body.find('hr, pre, .simditor-table').each(function(i, el) {
	          var $el, formatted;
	          $el = $(el);
	          if ($el.parent().is('blockquote') || $el.parent()[0] === _this.editor.body[0]) {
	            formatted = false;
	            if ($el.next().length === 0) {
	              $('<p/>').append(_this.editor.util.phBr).insertAfter($el);
	              formatted = true;
	            }
	            if ($el.prev().length === 0) {
	              $('<p/>').append(_this.editor.util.phBr).insertBefore($el);
	              formatted = true;
	            }
	            if (formatted) {
	              return _this.throttledValueChanged();
	            }
	          }
	        });
	        _this.editor.body.find('pre:empty').append(_this.editor.util.phBr);
	        if (!_this.editor.util.support.onselectionchange && _this.focused) {
	          return _this.throttledSelectionChanged();
	        }
	      };
	    })(this));
	    this.editor.body.on('keydown', $.proxy(this._onKeyDown, this)).on('keypress', $.proxy(this._onKeyPress, this)).on('keyup', $.proxy(this._onKeyUp, this)).on('mouseup', $.proxy(this._onMouseUp, this)).on('focus', $.proxy(this._onFocus, this)).on('blur', $.proxy(this._onBlur, this)).on('paste', $.proxy(this._onPaste, this)).on('drop', $.proxy(this._onDrop, this)).on('input', $.proxy(this._onInput, this));
	    if (this.editor.util.browser.firefox) {
	      this.addShortcut('cmd+left', (function(_this) {
	        return function(e) {
	          e.preventDefault();
	          _this.editor.selection._selection.modify('move', 'backward', 'lineboundary');
	          return false;
	        };
	      })(this));
	      this.addShortcut('cmd+right', (function(_this) {
	        return function(e) {
	          e.preventDefault();
	          _this.editor.selection._selection.modify('move', 'forward', 'lineboundary');
	          return false;
	        };
	      })(this));
	      this.addShortcut((this.editor.util.os.mac ? 'cmd+a' : 'ctrl+a'), (function(_this) {
	        return function(e) {
	          var $children, firstBlock, lastBlock, range;
	          $children = _this.editor.body.children();
	          if (!($children.length > 0)) {
	            return;
	          }
	          firstBlock = $children.first().get(0);
	          lastBlock = $children.last().get(0);
	          range = document.createRange();
	          range.setStart(firstBlock, 0);
	          range.setEnd(lastBlock, _this.editor.util.getNodeLength(lastBlock));
	          _this.editor.selection.range(range);
	          return false;
	        };
	      })(this));
	    }
	    submitKey = this.editor.util.os.mac ? 'cmd+enter' : 'ctrl+enter';
	    this.addShortcut(submitKey, (function(_this) {
	      return function(e) {
	        _this.editor.el.closest('form').find('button:submit').click();
	        return false;
	      };
	    })(this));
	    if (this.editor.textarea.attr('autofocus')) {
	      return setTimeout((function(_this) {
	        return function() {
	          return _this.editor.focus();
	        };
	      })(this), 0);
	    }
	  };

	  InputManager.prototype._onFocus = function(e) {
	    this.editor.el.addClass('focus').removeClass('error');
	    this.focused = true;
	    this.lastCaretPosition = null;
	    return setTimeout((function(_this) {
	      return function() {
	        _this.editor.triggerHandler('focus');
	        if (!_this.editor.util.support.onselectionchange) {
	          return _this.throttledSelectionChanged();
	        }
	      };
	    })(this), 0);
	  };

	  InputManager.prototype._onBlur = function(e) {
	    var ref;
	    this.editor.el.removeClass('focus');
	    this.editor.sync();
	    this.focused = false;
	    this.lastCaretPosition = (ref = this.editor.undoManager.currentState()) != null ? ref.caret : void 0;
	    return this.editor.triggerHandler('blur');
	  };

	  InputManager.prototype._onMouseUp = function(e) {
	    if (!this.editor.util.support.onselectionchange) {
	      return this.throttledSelectionChanged();
	    }
	  };

	  InputManager.prototype._onKeyDown = function(e) {
	    var base, ref, ref1, result;
	    if (this.editor.triggerHandler(e) === false) {
	      return false;
	    }
	    if (this.hotkeys.respondTo(e)) {
	      return;
	    }
	    if (e.which in this._keystrokeHandlers) {
	      result = typeof (base = this._keystrokeHandlers[e.which])['*'] === "function" ? base['*'](e) : void 0;
	      if (result) {
	        this.throttledValueChanged();
	        return false;
	      }
	      this.editor.selection.startNodes().each((function(_this) {
	        return function(i, node) {
	          var handler, ref;
	          if (node.nodeType !== Node.ELEMENT_NODE) {
	            return;
	          }
	          handler = (ref = _this._keystrokeHandlers[e.which]) != null ? ref[node.tagName.toLowerCase()] : void 0;
	          result = typeof handler === "function" ? handler(e, $(node)) : void 0;
	          if (result === true || result === false) {
	            return false;
	          }
	        };
	      })(this));
	      if (result) {
	        this.throttledValueChanged();
	        return false;
	      }
	    }
	    if ((ref = e.which, indexOf.call(this._modifierKeys, ref) >= 0) || (ref1 = e.which, indexOf.call(this._arrowKeys, ref1) >= 0)) {
	      return;
	    }
	    if (this.editor.util.metaKey(e) && e.which === 86) {
	      return;
	    }
	    if (!this.editor.util.support.oninput) {
	      this.throttledValueChanged(['typing']);
	    }
	    return null;
	  };

	  InputManager.prototype._onKeyPress = function(e) {
	    if (this.editor.triggerHandler(e) === false) {
	      return false;
	    }
	  };

	  InputManager.prototype._onKeyUp = function(e) {
	    var p, ref;
	    if (this.editor.triggerHandler(e) === false) {
	      return false;
	    }
	    if (!this.editor.util.support.onselectionchange && (ref = e.which, indexOf.call(this._arrowKeys, ref) >= 0)) {
	      this.throttledValueChanged();
	      return;
	    }
	    if ((e.which === 8 || e.which === 46) && this.editor.util.isEmptyNode(this.editor.body)) {
	      this.editor.body.empty();
	      p = $('<p/>').append(this.editor.util.phBr).appendTo(this.editor.body);
	      this.editor.selection.setRangeAtStartOf(p);
	    }
	  };

	  InputManager.prototype._onPaste = function(e) {
	    var $blockEl, cleanPaste, imageFile, pasteContent, pasteItem, processPasteContent, range, ref, uploadOpt;
	    if (this.editor.triggerHandler(e) === false) {
	      return false;
	    }
	    range = this.editor.selection.deleteRangeContents();
	    if (!range.collapsed) {
	      range.collapse(true);
	    }
	    this.editor.selection.range(range);
	    $blockEl = this.editor.selection.blockNodes().last();
	    cleanPaste = $blockEl.is('pre, table');
	    if (e.originalEvent.clipboardData && e.originalEvent.clipboardData.items && e.originalEvent.clipboardData.items.length > 0) {
	      pasteItem = e.originalEvent.clipboardData.items[0];
	      if (/^image\//.test(pasteItem.type) && !cleanPaste) {
	        imageFile = pasteItem.getAsFile();
	        if (!((imageFile != null) && this.opts.pasteImage)) {
	          return;
	        }
	        if (!imageFile.name) {
	          imageFile.name = "Clipboard Image.png";
	        }
	        uploadOpt = {};
	        uploadOpt[this.opts.pasteImage] = true;
	        if ((ref = this.editor.uploader) != null) {
	          ref.upload(imageFile, uploadOpt);
	        }
	        return false;
	      }
	    }
	    processPasteContent = (function(_this) {
	      return function(pasteContent) {
	        var $img, blob, children, insertPosition, k, l, lastLine, len, len1, len2, len3, len4, line, lines, m, node, o, q, ref1, ref2, ref3;
	        if (_this.editor.triggerHandler('pasting', [pasteContent]) === false) {
	          return;
	        }
	        if (!pasteContent) {
	          return;
	        } else if (cleanPaste) {
	          if ($blockEl.is('table')) {
	            lines = pasteContent.split('\n');
	            lastLine = lines.pop();
	            for (k = 0, len = lines.length; k < len; k++) {
	              line = lines[k];
	              _this.editor.selection.insertNode(document.createTextNode(line));
	              _this.editor.selection.insertNode($('<br/>'));
	            }
	            _this.editor.selection.insertNode(document.createTextNode(lastLine));
	          } else {
	            pasteContent = $('<div/>').text(pasteContent);
	            ref1 = pasteContent.contents();
	            for (l = 0, len1 = ref1.length; l < len1; l++) {
	              node = ref1[l];
	              _this.editor.selection.insertNode($(node)[0], range);
	            }
	          }
	        } else if ($blockEl.is(_this.editor.body)) {
	          for (m = 0, len2 = pasteContent.length; m < len2; m++) {
	            node = pasteContent[m];
	            _this.editor.selection.insertNode(node, range);
	          }
	        } else if (pasteContent.length < 1) {
	          return;
	        } else if (pasteContent.length === 1) {
	          if (pasteContent.is('p')) {
	            children = pasteContent.contents();
	            if (children.length === 1 && children.is('img')) {
	              $img = children;
	              if (/^data:image/.test($img.attr('src'))) {
	                if (!_this.opts.pasteImage) {
	                  return;
	                }
	                blob = _this.editor.util.dataURLtoBlob($img.attr("src"));
	                blob.name = "Clipboard Image.png";
	                uploadOpt = {};
	                uploadOpt[_this.opts.pasteImage] = true;
	                if ((ref2 = _this.editor.uploader) != null) {
	                  ref2.upload(blob, uploadOpt);
	                }
	                return;
	              } else if ($img.is('img[src^="webkit-fake-url://"]')) {
	                return;
	              }
	            }
	            for (o = 0, len3 = children.length; o < len3; o++) {
	              node = children[o];
	              _this.editor.selection.insertNode(node, range);
	            }
	          } else if ($blockEl.is('p') && _this.editor.util.isEmptyNode($blockEl)) {
	            $blockEl.replaceWith(pasteContent);
	            _this.editor.selection.setRangeAtEndOf(pasteContent, range);
	          } else if (pasteContent.is('ul, ol')) {
	            if (pasteContent.find('li').length === 1) {
	              pasteContent = $('<div/>').text(pasteContent.text());
	              ref3 = pasteContent.contents();
	              for (q = 0, len4 = ref3.length; q < len4; q++) {
	                node = ref3[q];
	                _this.editor.selection.insertNode($(node)[0], range);
	              }
	            } else if ($blockEl.is('li')) {
	              $blockEl.parent().after(pasteContent);
	              _this.editor.selection.setRangeAtEndOf(pasteContent, range);
	            } else {
	              $blockEl.after(pasteContent);
	              _this.editor.selection.setRangeAtEndOf(pasteContent, range);
	            }
	          } else {
	            $blockEl.after(pasteContent);
	            _this.editor.selection.setRangeAtEndOf(pasteContent, range);
	          }
	        } else {
	          if ($blockEl.is('li')) {
	            $blockEl = $blockEl.parent();
	          }
	          if (_this.editor.selection.rangeAtStartOf($blockEl, range)) {
	            insertPosition = 'before';
	          } else if (_this.editor.selection.rangeAtEndOf($blockEl, range)) {
	            insertPosition = 'after';
	          } else {
	            _this.editor.selection.breakBlockEl($blockEl, range);
	            insertPosition = 'before';
	          }
	          $blockEl[insertPosition](pasteContent);
	          _this.editor.selection.setRangeAtEndOf(pasteContent.last(), range);
	        }
	        return _this.throttledValueChanged();
	      };
	    })(this);
	    if (cleanPaste) {
	      e.preventDefault();
	      if (this.editor.util.browser.msie) {
	        pasteContent = window.clipboardData.getData('Text');
	      } else {
	        pasteContent = e.originalEvent.clipboardData.getData('text/plain');
	      }
	      return processPasteContent(pasteContent);
	    } else {
	      this.editor.selection.save(range);
	      this._pasteArea.focus();
	      if (this.editor.util.browser.msie && this.editor.util.browser.version === 10) {
	        e.preventDefault();
	        this._pasteArea.html(window.clipboardData.getData('Text'));
	      }
	      return setTimeout((function(_this) {
	        return function() {
	          if (_this._pasteArea.is(':empty')) {
	            pasteContent = null;
	          } else {
	            pasteContent = $('<div/>').append(_this._pasteArea.contents());
	            pasteContent.find('table colgroup').remove();
	            _this.editor.formatter.format(pasteContent);
	            _this.editor.formatter.decorate(pasteContent);
	            _this.editor.formatter.beautify(pasteContent.children());
	            pasteContent = pasteContent.contents();
	          }
	          _this._pasteArea.empty();
	          range = _this.editor.selection.restore();
	          return processPasteContent(pasteContent);
	        };
	      })(this), 10);
	    }
	  };

	  InputManager.prototype._onDrop = function(e) {
	    if (this.editor.triggerHandler(e) === false) {
	      return false;
	    }
	    return this.throttledValueChanged();
	  };

	  InputManager.prototype._onInput = function(e) {
	    return this.throttledValueChanged(['oninput']);
	  };

	  InputManager.prototype.addKeystrokeHandler = function(key, node, handler) {
	    if (!this._keystrokeHandlers[key]) {
	      this._keystrokeHandlers[key] = {};
	    }
	    return this._keystrokeHandlers[key][node] = handler;
	  };

	  InputManager.prototype.addShortcut = function(keys, handler) {
	    return this.hotkeys.add(keys, $.proxy(handler, this));
	  };

	  return InputManager;

	})(SimpleModule);

	Keystroke = (function(superClass) {
	  extend(Keystroke, superClass);

	  function Keystroke() {
	    return Keystroke.__super__.constructor.apply(this, arguments);
	  }

	  Keystroke.pluginName = 'Keystroke';

	  Keystroke.prototype._init = function() {
	    var titleEnterHandler;
	    this.editor = this._module;
	    if (this.editor.util.browser.safari) {
	      this.editor.inputManager.addKeystrokeHandler('13', '*', (function(_this) {
	        return function(e) {
	          var $blockEl, $br;
	          if (!e.shiftKey) {
	            return;
	          }
	          $blockEl = _this.editor.selection.blockNodes().last();
	          if ($blockEl.is('pre')) {
	            return;
	          }
	          $br = $('<br/>');
	          if (_this.editor.selection.rangeAtEndOf($blockEl)) {
	            _this.editor.selection.insertNode($br);
	            _this.editor.selection.insertNode($('<br/>'));
	            _this.editor.selection.setRangeBefore($br);
	          } else {
	            _this.editor.selection.insertNode($br);
	          }
	          return true;
	        };
	      })(this));
	    }
	    if (this.editor.util.browser.webkit || this.editor.util.browser.msie) {
	      titleEnterHandler = (function(_this) {
	        return function(e, $node) {
	          var $p;
	          if (!_this.editor.selection.rangeAtEndOf($node)) {
	            return;
	          }
	          $p = $('<p/>').append(_this.editor.util.phBr).insertAfter($node);
	          _this.editor.selection.setRangeAtStartOf($p);
	          return true;
	        };
	      })(this);
	      this.editor.inputManager.addKeystrokeHandler('13', 'h1', titleEnterHandler);
	      this.editor.inputManager.addKeystrokeHandler('13', 'h2', titleEnterHandler);
	      this.editor.inputManager.addKeystrokeHandler('13', 'h3', titleEnterHandler);
	      this.editor.inputManager.addKeystrokeHandler('13', 'h4', titleEnterHandler);
	      this.editor.inputManager.addKeystrokeHandler('13', 'h5', titleEnterHandler);
	      this.editor.inputManager.addKeystrokeHandler('13', 'h6', titleEnterHandler);
	    }
	    this.editor.inputManager.addKeystrokeHandler('8', '*', (function(_this) {
	      return function(e) {
	        var $blockEl, $prevBlockEl, $rootBlock, isWebkit;
	        $rootBlock = _this.editor.selection.rootNodes().first();
	        $prevBlockEl = $rootBlock.prev();
	        if ($prevBlockEl.is('hr') && _this.editor.selection.rangeAtStartOf($rootBlock)) {
	          _this.editor.selection.save();
	          $prevBlockEl.remove();
	          _this.editor.selection.restore();
	          return true;
	        }
	        $blockEl = _this.editor.selection.blockNodes().last();
	        isWebkit = _this.editor.util.browser.webkit;
	        if (isWebkit && _this.editor.selection.rangeAtStartOf($blockEl)) {
	          _this.editor.selection.save();
	          _this.editor.formatter.cleanNode($blockEl, true);
	          _this.editor.selection.restore();
	          return null;
	        }
	      };
	    })(this));
	    this.editor.inputManager.addKeystrokeHandler('13', 'li', (function(_this) {
	      return function(e, $node) {
	        var $cloneNode, listEl, newBlockEl, newListEl;
	        $cloneNode = $node.clone();
	        $cloneNode.find('ul, ol').remove();
	        if (!(_this.editor.util.isEmptyNode($cloneNode) && $node.is(_this.editor.selection.blockNodes().last()))) {
	          return;
	        }
	        listEl = $node.parent();
	        if ($node.next('li').length > 0) {
	          if (!_this.editor.util.isEmptyNode($node)) {
	            return;
	          }
	          if (listEl.parent('li').length > 0) {
	            newBlockEl = $('<li/>').append(_this.editor.util.phBr).insertAfter(listEl.parent('li'));
	            newListEl = $('<' + listEl[0].tagName + '/>').append($node.nextAll('li'));
	            newBlockEl.append(newListEl);
	          } else {
	            newBlockEl = $('<p/>').append(_this.editor.util.phBr).insertAfter(listEl);
	            newListEl = $('<' + listEl[0].tagName + '/>').append($node.nextAll('li'));
	            newBlockEl.after(newListEl);
	          }
	        } else {
	          if (listEl.parent('li').length > 0) {
	            newBlockEl = $('<li/>').insertAfter(listEl.parent('li'));
	            if ($node.contents().length > 0) {
	              newBlockEl.append($node.contents());
	            } else {
	              newBlockEl.append(_this.editor.util.phBr);
	            }
	          } else {
	            newBlockEl = $('<p/>').append(_this.editor.util.phBr).insertAfter(listEl);
	            if ($node.children('ul, ol').length > 0) {
	              newBlockEl.after($node.children('ul, ol'));
	            }
	          }
	        }
	        if ($node.prev('li').length) {
	          $node.remove();
	        } else {
	          listEl.remove();
	        }
	        _this.editor.selection.setRangeAtStartOf(newBlockEl);
	        return true;
	      };
	    })(this));
	    this.editor.inputManager.addKeystrokeHandler('13', 'pre', (function(_this) {
	      return function(e, $node) {
	        var $p, breakNode, range;
	        e.preventDefault();
	        if (e.shiftKey) {
	          $p = $('<p/>').append(_this.editor.util.phBr).insertAfter($node);
	          _this.editor.selection.setRangeAtStartOf($p);
	          return true;
	        }
	        range = _this.editor.selection.range();
	        breakNode = null;
	        range.deleteContents();
	        if (!_this.editor.util.browser.msie && _this.editor.selection.rangeAtEndOf($node)) {
	          breakNode = document.createTextNode('\n\n');
	          range.insertNode(breakNode);
	          range.setEnd(breakNode, 1);
	        } else {
	          breakNode = document.createTextNode('\n');
	          range.insertNode(breakNode);
	          range.setStartAfter(breakNode);
	        }
	        range.collapse(false);
	        _this.editor.selection.range(range);
	        return true;
	      };
	    })(this));
	    this.editor.inputManager.addKeystrokeHandler('13', 'blockquote', (function(_this) {
	      return function(e, $node) {
	        var $closestBlock, range;
	        $closestBlock = _this.editor.selection.blockNodes().last();
	        if (!($closestBlock.is('p') && !$closestBlock.next().length && _this.editor.util.isEmptyNode($closestBlock))) {
	          return;
	        }
	        $node.after($closestBlock);
	        range = document.createRange();
	        _this.editor.selection.setRangeAtStartOf($closestBlock, range);
	        return true;
	      };
	    })(this));
	    this.editor.inputManager.addKeystrokeHandler('8', 'li', (function(_this) {
	      return function(e, $node) {
	        var $br, $childList, $newLi, $prevChildList, $prevNode, $textNode, isFF, range, text;
	        $childList = $node.children('ul, ol');
	        $prevNode = $node.prev('li');
	        if (!($childList.length > 0 && $prevNode.length > 0)) {
	          return false;
	        }
	        text = '';
	        $textNode = null;
	        $node.contents().each(function(i, n) {
	          if (n.nodeType === 1 && /UL|OL/.test(n.nodeName)) {
	            return false;
	          }
	          if (n.nodeType === 1 && /BR/.test(n.nodeName)) {
	            return;
	          }
	          if (n.nodeType === 3 && n.nodeValue) {
	            text += n.nodeValue;
	          } else if (n.nodeType === 1) {
	            text += $(n).text();
	          }
	          return $textNode = $(n);
	        });
	        isFF = _this.editor.util.browser.firefox && !$textNode.next('br').length;
	        if ($textNode && text.length === 1 && isFF) {
	          $br = $(_this.editor.util.phBr).insertAfter($textNode);
	          $textNode.remove();
	          _this.editor.selection.setRangeBefore($br);
	          return true;
	        } else if (text.length > 0) {
	          return false;
	        }
	        range = document.createRange();
	        $prevChildList = $prevNode.children('ul, ol');
	        if ($prevChildList.length > 0) {
	          $newLi = $('<li/>').append(_this.editor.util.phBr).appendTo($prevChildList);
	          $prevChildList.append($childList.children('li'));
	          $node.remove();
	          _this.editor.selection.setRangeAtEndOf($newLi, range);
	        } else {
	          _this.editor.selection.setRangeAtEndOf($prevNode, range);
	          $prevNode.append($childList);
	          $node.remove();
	          _this.editor.selection.range(range);
	        }
	        return true;
	      };
	    })(this));
	    this.editor.inputManager.addKeystrokeHandler('8', 'pre', (function(_this) {
	      return function(e, $node) {
	        var $newNode, codeStr, range;
	        if (!_this.editor.selection.rangeAtStartOf($node)) {
	          return;
	        }
	        codeStr = $node.html().replace('\n', '<br/>') || _this.editor.util.phBr;
	        $newNode = $('<p/>').append(codeStr).insertAfter($node);
	        $node.remove();
	        range = document.createRange();
	        _this.editor.selection.setRangeAtStartOf($newNode, range);
	        return true;
	      };
	    })(this));
	    return this.editor.inputManager.addKeystrokeHandler('8', 'blockquote', (function(_this) {
	      return function(e, $node) {
	        var $firstChild, range;
	        if (!_this.editor.selection.rangeAtStartOf($node)) {
	          return;
	        }
	        $firstChild = $node.children().first().unwrap();
	        range = document.createRange();
	        _this.editor.selection.setRangeAtStartOf($firstChild, range);
	        return true;
	      };
	    })(this));
	  };

	  return Keystroke;

	})(SimpleModule);

	UndoManager = (function(superClass) {
	  extend(UndoManager, superClass);

	  function UndoManager() {
	    return UndoManager.__super__.constructor.apply(this, arguments);
	  }

	  UndoManager.pluginName = 'UndoManager';

	  UndoManager.prototype._index = -1;

	  UndoManager.prototype._capacity = 20;

	  UndoManager.prototype._startPosition = null;

	  UndoManager.prototype._endPosition = null;

	  UndoManager.prototype._init = function() {
	    var redoShortcut, throttledPushState, undoShortcut;
	    this.editor = this._module;
	    this._stack = [];
	    if (this.editor.util.os.mac) {
	      undoShortcut = 'cmd+z';
	      redoShortcut = 'shift+cmd+z';
	    } else if (this.editor.util.os.win) {
	      undoShortcut = 'ctrl+z';
	      redoShortcut = 'ctrl+y';
	    } else {
	      undoShortcut = 'ctrl+z';
	      redoShortcut = 'shift+ctrl+z';
	    }
	    this.editor.inputManager.addShortcut(undoShortcut, (function(_this) {
	      return function(e) {
	        e.preventDefault();
	        _this.undo();
	        return false;
	      };
	    })(this));
	    this.editor.inputManager.addShortcut(redoShortcut, (function(_this) {
	      return function(e) {
	        e.preventDefault();
	        _this.redo();
	        return false;
	      };
	    })(this));
	    throttledPushState = this.editor.util.throttle((function(_this) {
	      return function() {
	        return _this._pushUndoState();
	      };
	    })(this), 500);
	    this.editor.on('valuechanged', function(e, src) {
	      if (src === 'undo' || src === 'redo') {
	        return;
	      }
	      return throttledPushState();
	    });
	    this.editor.on('selectionchanged', (function(_this) {
	      return function(e) {
	        _this._startPosition = null;
	        _this._endPosition = null;
	        return _this.update();
	      };
	    })(this));
	    return this.editor.on('blur', (function(_this) {
	      return function(e) {
	        _this._startPosition = null;
	        return _this._endPosition = null;
	      };
	    })(this));
	  };

	  UndoManager.prototype.startPosition = function() {
	    if (this.editor.selection._range) {
	      this._startPosition || (this._startPosition = this._getPosition('start'));
	    }
	    return this._startPosition;
	  };

	  UndoManager.prototype.endPosition = function() {
	    if (this.editor.selection._range) {
	      this._endPosition || (this._endPosition = (function(_this) {
	        return function() {
	          var range;
	          range = _this.editor.selection.range();
	          if (range.collapsed) {
	            return _this._startPosition;
	          }
	          return _this._getPosition('end');
	        };
	      })(this)());
	    }
	    return this._endPosition;
	  };

	  UndoManager.prototype._pushUndoState = function() {
	    var currentState, html;
	    if (this.editor.triggerHandler('pushundostate') === false) {
	      return;
	    }
	    currentState = this.currentState();
	    html = this.editor.body.html();
	    if (currentState && currentState.html === html) {
	      return;
	    }
	    this._index += 1;
	    this._stack.length = this._index;
	    this._stack.push({
	      html: html,
	      caret: this.caretPosition()
	    });
	    if (this._stack.length > this._capacity) {
	      this._stack.shift();
	      return this._index -= 1;
	    }
	  };

	  UndoManager.prototype.currentState = function() {
	    if (this._stack.length && this._index > -1) {
	      return this._stack[this._index];
	    } else {
	      return null;
	    }
	  };

	  UndoManager.prototype.undo = function() {
	    var state;
	    if (this._index < 1 || this._stack.length < 2) {
	      return;
	    }
	    this.editor.hidePopover();
	    this._index -= 1;
	    state = this._stack[this._index];
	    this.editor.body.html(state.html);
	    this.caretPosition(state.caret);
	    this.editor.body.find('.selected').removeClass('selected');
	    this.editor.sync();
	    return this.editor.trigger('valuechanged', ['undo']);
	  };

	  UndoManager.prototype.redo = function() {
	    var state;
	    if (this._index < 0 || this._stack.length < this._index + 2) {
	      return;
	    }
	    this.editor.hidePopover();
	    this._index += 1;
	    state = this._stack[this._index];
	    this.editor.body.html(state.html);
	    this.caretPosition(state.caret);
	    this.editor.body.find('.selected').removeClass('selected');
	    this.editor.sync();
	    return this.editor.trigger('valuechanged', ['redo']);
	  };

	  UndoManager.prototype.update = function() {
	    var currentState, html;
	    if (this._timer) {
	      return;
	    }
	    currentState = this.currentState();
	    if (!currentState) {
	      return;
	    }
	    html = this.editor.body.html();
	    if (html !== currentState.html) {
	      return;
	    }
	    currentState.html = html;
	    return currentState.caret = this.caretPosition();
	  };

	  UndoManager.prototype._getNodeOffset = function(node, index) {
	    var $parent, merging, offset;
	    if (index) {
	      $parent = $(node);
	    } else {
	      $parent = $(node).parent();
	    }
	    offset = 0;
	    merging = false;
	    $parent.contents().each(function(i, child) {
	      if (index === i || node === child) {
	        return false;
	      }
	      if (child.nodeType === 3) {
	        if (!merging) {
	          offset += 1;
	          merging = true;
	        }
	      } else {
	        offset += 1;
	        merging = false;
	      }
	      return null;
	    });
	    return offset;
	  };

	  UndoManager.prototype._getPosition = function(type) {
	    var $nodes, node, nodes, offset, position, prevNode, range;
	    if (type == null) {
	      type = 'start';
	    }
	    range = this.editor.selection.range();
	    offset = range[type + "Offset"];
	    $nodes = this.editor.selection[type + "Nodes"]();
	    if ((node = $nodes.first()[0]).nodeType === Node.TEXT_NODE) {
	      prevNode = node.previousSibling;
	      while (prevNode && prevNode.nodeType === Node.TEXT_NODE) {
	        node = prevNode;
	        offset += this.editor.util.getNodeLength(prevNode);
	        prevNode = prevNode.previousSibling;
	      }
	      nodes = $nodes.get();
	      nodes[0] = node;
	      $nodes = $(nodes);
	    }
	    position = [offset];
	    $nodes.each((function(_this) {
	      return function(i, node) {
	        return position.unshift(_this._getNodeOffset(node));
	      };
	    })(this));
	    return position;
	  };

	  UndoManager.prototype._getNodeByPosition = function(position) {
	    var child, childNodes, i, k, len, node, offset, ref;
	    node = this.editor.body[0];
	    ref = position.slice(0, position.length - 1);
	    for (i = k = 0, len = ref.length; k < len; i = ++k) {
	      offset = ref[i];
	      childNodes = node.childNodes;
	      if (offset > childNodes.length - 1) {
	        if (i === position.length - 2 && $(node).is('pre')) {
	          child = document.createTextNode('');
	          node.appendChild(child);
	          childNodes = node.childNodes;
	        } else {
	          node = null;
	          break;
	        }
	      }
	      node = childNodes[offset];
	    }
	    return node;
	  };

	  UndoManager.prototype.caretPosition = function(caret) {
	    var endContainer, endOffset, range, startContainer, startOffset;
	    if (!caret) {
	      range = this.editor.selection.range();
	      caret = this.editor.inputManager.focused && (range != null) ? {
	        start: this.startPosition(),
	        end: this.endPosition(),
	        collapsed: range.collapsed
	      } : {};
	      return caret;
	    } else {
	      if (!caret.start) {
	        return;
	      }
	      startContainer = this._getNodeByPosition(caret.start);
	      startOffset = caret.start[caret.start.length - 1];
	      if (caret.collapsed) {
	        endContainer = startContainer;
	        endOffset = startOffset;
	      } else {
	        endContainer = this._getNodeByPosition(caret.end);
	        endOffset = caret.start[caret.start.length - 1];
	      }
	      if (!startContainer || !endContainer) {
	        throw new Error('simditor: invalid caret state');
	        return;
	      }
	      range = document.createRange();
	      range.setStart(startContainer, startOffset);
	      range.setEnd(endContainer, endOffset);
	      return this.editor.selection.range(range);
	    }
	  };

	  return UndoManager;

	})(SimpleModule);

	Util = (function(superClass) {
	  extend(Util, superClass);

	  function Util() {
	    return Util.__super__.constructor.apply(this, arguments);
	  }

	  Util.pluginName = 'Util';

	  Util.prototype._init = function() {
	    this.editor = this._module;
	    if (this.browser.msie && this.browser.version < 11) {
	      return this.phBr = '';
	    }
	  };

	  Util.prototype.phBr = '<br/>';

	  Util.prototype.os = (function() {
	    var os;
	    os = {};
	    if (/Mac/.test(navigator.appVersion)) {
	      os.mac = true;
	    } else if (/Linux/.test(navigator.appVersion)) {
	      os.linux = true;
	    } else if (/Win/.test(navigator.appVersion)) {
	      os.win = true;
	    } else if (/X11/.test(navigator.appVersion)) {
	      os.unix = true;
	    }
	    if (/Mobi/.test(navigator.appVersion)) {
	      os.mobile = true;
	    }
	    return os;
	  })();

	  Util.prototype.browser = (function() {
	    var chrome, firefox, ie, ref, ref1, ref2, ref3, safari, ua;
	    ua = navigator.userAgent;
	    ie = /(msie|trident)/i.test(ua);
	    chrome = /chrome|crios/i.test(ua);
	    safari = /safari/i.test(ua) && !chrome;
	    firefox = /firefox/i.test(ua);
	    if (ie) {
	      return {
	        msie: true,
	        version: ((ref = ua.match(/(msie |rv:)(\d+(\.\d+)?)/i)) != null ? ref[2] : void 0) * 1
	      };
	    } else if (chrome) {
	      return {
	        webkit: true,
	        chrome: true,
	        version: ((ref1 = ua.match(/(?:chrome|crios)\/(\d+(\.\d+)?)/i)) != null ? ref1[1] : void 0) * 1
	      };
	    } else if (safari) {
	      return {
	        webkit: true,
	        safari: true,
	        version: ((ref2 = ua.match(/version\/(\d+(\.\d+)?)/i)) != null ? ref2[1] : void 0) * 1
	      };
	    } else if (firefox) {
	      return {
	        mozilla: true,
	        firefox: true,
	        version: ((ref3 = ua.match(/firefox\/(\d+(\.\d+)?)/i)) != null ? ref3[1] : void 0) * 1
	      };
	    } else {
	      return {};
	    }
	  })();

	  Util.prototype.support = (function() {
	    return {
	      onselectionchange: (function() {
	        var e, onselectionchange;
	        onselectionchange = document.onselectionchange;
	        if (onselectionchange !== void 0) {
	          try {
	            document.onselectionchange = 0;
	            return document.onselectionchange === null;
	          } catch (_error) {
	            e = _error;
	          } finally {
	            document.onselectionchange = onselectionchange;
	          }
	        }
	        return false;
	      })(),
	      oninput: (function() {
	        return !/(msie|trident)/i.test(navigator.userAgent);
	      })()
	    };
	  })();

	  Util.prototype.reflow = function(el) {
	    if (el == null) {
	      el = document;
	    }
	    return $(el)[0].offsetHeight;
	  };

	  Util.prototype.metaKey = function(e) {
	    var isMac;
	    isMac = /Mac/.test(navigator.userAgent);
	    if (isMac) {
	      return e.metaKey;
	    } else {
	      return e.ctrlKey;
	    }
	  };

	  Util.prototype.isEmptyNode = function(node) {
	    var $node;
	    $node = $(node);
	    return $node.is(':empty') || (!$node.text() && !$node.find(':not(br, span, div)').length);
	  };

	  Util.prototype.isDecoratedNode = function(node) {
	    return $(node).is('[class^="simditor-"]');
	  };

	  Util.prototype.blockNodes = ["div", "p", "ul", "ol", "li", "blockquote", "hr", "pre", "h1", "h2", "h3", "h4", "table"];

	  Util.prototype.isBlockNode = function(node) {
	    node = $(node)[0];
	    if (!node || node.nodeType === 3) {
	      return false;
	    }
	    return new RegExp("^(" + (this.blockNodes.join('|')) + ")$").test(node.nodeName.toLowerCase());
	  };

	  Util.prototype.getNodeLength = function(node) {
	    node = $(node)[0];
	    switch (node.nodeType) {
	      case 7:
	      case 10:
	        return 0;
	      case 3:
	      case 8:
	        return node.length;
	      default:
	        return node.childNodes.length;
	    }
	  };

	  Util.prototype.dataURLtoBlob = function(dataURL) {
	    var BlobBuilder, arrayBuffer, bb, blobArray, byteString, hasArrayBufferViewSupport, hasBlobConstructor, i, intArray, k, mimeString, ref, supportBlob;
	    hasBlobConstructor = window.Blob && (function() {
	      var e;
	      try {
	        return Boolean(new Blob());
	      } catch (_error) {
	        e = _error;
	        return false;
	      }
	    })();
	    hasArrayBufferViewSupport = hasBlobConstructor && window.Uint8Array && (function() {
	      var e;
	      try {
	        return new Blob([new Uint8Array(100)]).size === 100;
	      } catch (_error) {
	        e = _error;
	        return false;
	      }
	    })();
	    BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;
	    supportBlob = hasBlobConstructor || BlobBuilder;
	    if (!(supportBlob && window.atob && window.ArrayBuffer && window.Uint8Array)) {
	      return false;
	    }
	    if (dataURL.split(',')[0].indexOf('base64') >= 0) {
	      byteString = atob(dataURL.split(',')[1]);
	    } else {
	      byteString = decodeURIComponent(dataURL.split(',')[1]);
	    }
	    arrayBuffer = new ArrayBuffer(byteString.length);
	    intArray = new Uint8Array(arrayBuffer);
	    for (i = k = 0, ref = byteString.length; 0 <= ref ? k <= ref : k >= ref; i = 0 <= ref ? ++k : --k) {
	      intArray[i] = byteString.charCodeAt(i);
	    }
	    mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
	    if (hasBlobConstructor) {
	      blobArray = hasArrayBufferViewSupport ? intArray : arrayBuffer;
	      return new Blob([blobArray], {
	        type: mimeString
	      });
	    }
	    bb = new BlobBuilder();
	    bb.append(arrayBuffer);
	    return bb.getBlob(mimeString);
	  };

	  Util.prototype.throttle = function(func, wait) {
	    var args, call, ctx, last, rtn, throttled, timeoutID;
	    last = 0;
	    timeoutID = 0;
	    ctx = args = rtn = null;
	    call = function() {
	      timeoutID = 0;
	      last = +new Date();
	      rtn = func.apply(ctx, args);
	      ctx = null;
	      return args = null;
	    };
	    return throttled = function() {
	      var delta;
	      ctx = this;
	      args = arguments;
	      delta = new Date() - last;
	      if (!timeoutID) {
	        if (delta >= wait) {
	          call();
	        } else {
	          timeoutID = setTimeout(call, wait - delta);
	        }
	      }
	      return rtn;
	    };
	  };

	  Util.prototype.formatHTML = function(html) {
	    var cursor, indentString, lastMatch, level, match, re, repeatString, result, str;
	    re = /<(\/?)(.+?)(\/?)>/g;
	    result = '';
	    level = 0;
	    lastMatch = null;
	    indentString = '  ';
	    repeatString = function(str, n) {
	      return new Array(n + 1).join(str);
	    };
	    while ((match = re.exec(html)) !== null) {
	      match.isBlockNode = $.inArray(match[2], this.blockNodes) > -1;
	      match.isStartTag = match[1] !== '/' && match[3] !== '/';
	      match.isEndTag = match[1] === '/' || match[3] === '/';
	      cursor = lastMatch ? lastMatch.index + lastMatch[0].length : 0;
	      if ((str = html.substring(cursor, match.index)).length > 0 && $.trim(str)) {
	        result += str;
	      }
	      if (match.isBlockNode && match.isEndTag && !match.isStartTag) {
	        level -= 1;
	      }
	      if (match.isBlockNode && match.isStartTag) {
	        if (!(lastMatch && lastMatch.isBlockNode && lastMatch.isEndTag)) {
	          result += '\n';
	        }
	        result += repeatString(indentString, level);
	      }
	      result += match[0];
	      if (match.isBlockNode && match.isEndTag) {
	        result += '\n';
	      }
	      if (match.isBlockNode && match.isStartTag) {
	        level += 1;
	      }
	      lastMatch = match;
	    }
	    return $.trim(result);
	  };

	  return Util;

	})(SimpleModule);

	Toolbar = (function(superClass) {
	  extend(Toolbar, superClass);

	  function Toolbar() {
	    return Toolbar.__super__.constructor.apply(this, arguments);
	  }

	  Toolbar.pluginName = 'Toolbar';

	  Toolbar.prototype.opts = {
	    toolbar: true,
	    toolbarFloat: true,
	    toolbarHidden: false,
	    toolbarFloatOffset: 0
	  };

	  Toolbar.prototype._tpl = {
	    wrapper: '<div class="simditor-toolbar"><ul></ul></div>',
	    separator: '<li><span class="separator"></span></li>'
	  };

	  Toolbar.prototype._init = function() {
	    var floatInitialized, initToolbarFloat, toolbarHeight;
	    this.editor = this._module;
	    if (!this.opts.toolbar) {
	      return;
	    }
	    if (!$.isArray(this.opts.toolbar)) {
	      this.opts.toolbar = ['bold', 'italic', 'underline', 'strikethrough', '|', 'ol', 'ul', 'blockquote', 'code', '|', 'link', 'image', '|', 'indent', 'outdent'];
	    }
	    this._render();
	    this.list.on('click', function(e) {
	      return false;
	    });
	    this.wrapper.on('mousedown', (function(_this) {
	      return function(e) {
	        return _this.list.find('.menu-on').removeClass('.menu-on');
	      };
	    })(this));
	    $(document).on('mousedown.simditor' + this.editor.id, (function(_this) {
	      return function(e) {
	        return _this.list.find('.menu-on').removeClass('.menu-on');
	      };
	    })(this));
	    if (!this.opts.toolbarHidden && this.opts.toolbarFloat) {
	      this.wrapper.css('top', this.opts.toolbarFloatOffset);
	      toolbarHeight = 0;
	      initToolbarFloat = (function(_this) {
	        return function() {
	          _this.wrapper.css('position', 'static');
	          _this.wrapper.width('auto');
	          _this.editor.util.reflow(_this.wrapper);
	          _this.wrapper.width(_this.wrapper.outerWidth());
	          _this.wrapper.css('left', _this.editor.util.os.mobile ? _this.wrapper.position().left : _this.wrapper.offset().left);
	          _this.wrapper.css('position', '');
	          toolbarHeight = _this.wrapper.outerHeight();
	          _this.editor.placeholderEl.css('top', toolbarHeight);
	          return true;
	        };
	      })(this);
	      $(window).on('resize.simditor-' + this.editor.id, function(e) {
	        var floatInitialized;
	        return floatInitialized = null;
	      });
	      floatInitialized = null;
	      $(window).on('scroll.simditor-' + this.editor.id, (function(_this) {
	        return function(e) {
	          var bottomEdge, scrollTop, topEdge;
	          if (!_this.wrapper.is(':visible')) {
	            return;
	          }
	          topEdge = _this.editor.wrapper.offset().top;
	          bottomEdge = topEdge + _this.editor.wrapper.outerHeight() - 80;
	          scrollTop = $(document).scrollTop() + _this.opts.toolbarFloatOffset;
	          if (scrollTop <= topEdge || scrollTop >= bottomEdge) {
	            _this.editor.wrapper.removeClass('toolbar-floating').css('padding-top', '');
	            if (_this.editor.util.os.mobile) {
	              return _this.wrapper.css('top', _this.opts.toolbarFloatOffset);
	            }
	          } else {
	            floatInitialized || (floatInitialized = initToolbarFloat());
	            _this.editor.wrapper.addClass('toolbar-floating').css('padding-top', toolbarHeight);
	            if (_this.editor.util.os.mobile) {
	              return _this.wrapper.css('top', scrollTop - topEdge + _this.opts.toolbarFloatOffset);
	            }
	          }
	        };
	      })(this));
	    }
	    this.editor.on('destroy', (function(_this) {
	      return function() {
	        return _this.buttons.length = 0;
	      };
	    })(this));
	    return $(document).on("mousedown.simditor-" + this.editor.id, (function(_this) {
	      return function(e) {
	        return _this.list.find('li.menu-on').removeClass('menu-on');
	      };
	    })(this));
	  };

	  Toolbar.prototype._render = function() {
	    var k, len, name, ref;
	    this.buttons = [];
	    this.wrapper = $(this._tpl.wrapper).prependTo(this.editor.wrapper);
	    this.list = this.wrapper.find('ul');
	    ref = this.opts.toolbar;
	    for (k = 0, len = ref.length; k < len; k++) {
	      name = ref[k];
	      if (name === '|') {
	        $(this._tpl.separator).appendTo(this.list);
	        continue;
	      }
	      if (!this.constructor.buttons[name]) {
	        throw new Error("simditor: invalid toolbar button " + name);
	        continue;
	      }
	      this.buttons.push(new this.constructor.buttons[name]({
	        editor: this.editor
	      }));
	    }
	    if (this.opts.toolbarHidden) {
	      return this.wrapper.hide();
	    }
	  };

	  Toolbar.prototype.findButton = function(name) {
	    var button;
	    button = this.list.find('.toolbar-item-' + name).data('button');
	    return button != null ? button : null;
	  };

	  Toolbar.addButton = function(btn) {
	    return this.buttons[btn.prototype.name] = btn;
	  };

	  Toolbar.buttons = {};

	  return Toolbar;

	})(SimpleModule);

	Indentation = (function(superClass) {
	  extend(Indentation, superClass);

	  function Indentation() {
	    return Indentation.__super__.constructor.apply(this, arguments);
	  }

	  Indentation.pluginName = 'Indentation';

	  Indentation.prototype.opts = {
	    tabIndent: true
	  };

	  Indentation.prototype._init = function() {
	    this.editor = this._module;
	    return this.editor.inputManager.addKeystrokeHandler('9', '*', (function(_this) {
	      return function(e) {
	        var codeButton;
	        codeButton = _this.editor.toolbar.findButton('code');
	        if (!(_this.opts.tabIndent || (codeButton && codeButton.active))) {
	          return;
	        }
	        return _this.indent(e.shiftKey);
	      };
	    })(this));
	  };

	  Indentation.prototype.indent = function(isBackward) {
	    var $blockNodes, $endNodes, $startNodes, nodes, result;
	    $startNodes = this.editor.selection.startNodes();
	    $endNodes = this.editor.selection.endNodes();
	    $blockNodes = this.editor.selection.blockNodes();
	    nodes = [];
	    $blockNodes = $blockNodes.each(function(i, node) {
	      var include, j, k, len, n;
	      include = true;
	      for (j = k = 0, len = nodes.length; k < len; j = ++k) {
	        n = nodes[j];
	        if ($.contains(node, n)) {
	          include = false;
	          break;
	        } else if ($.contains(n, node)) {
	          nodes.splice(j, 1, node);
	          include = false;
	          break;
	        }
	      }
	      if (include) {
	        return nodes.push(node);
	      }
	    });
	    $blockNodes = $(nodes);
	    result = false;
	    $blockNodes.each((function(_this) {
	      return function(i, blockEl) {
	        var r;
	        r = isBackward ? _this.outdentBlock(blockEl) : _this.indentBlock(blockEl);
	        if (r) {
	          return result = r;
	        }
	      };
	    })(this));
	    return result;
	  };

	  Indentation.prototype.indentBlock = function(blockEl) {
	    var $blockEl, $childList, $nextTd, $nextTr, $parentLi, $pre, $td, $tr, marginLeft, tagName;
	    $blockEl = $(blockEl);
	    if (!$blockEl.length) {
	      return;
	    }
	    if ($blockEl.is('pre')) {
	      $pre = this.editor.selection.containerNode();
	      if (!($pre.is($blockEl) || $pre.closest('pre').is($blockEl))) {
	        return;
	      }
	      this.indentText(range);
	    } else if ($blockEl.is('li')) {
	      $parentLi = $blockEl.prev('li');
	      if ($parentLi.length < 1) {
	        return;
	      }
	      this.editor.selection.save();
	      tagName = $blockEl.parent()[0].tagName;
	      $childList = $parentLi.children('ul, ol');
	      if ($childList.length > 0) {
	        $childList.append($blockEl);
	      } else {
	        $('<' + tagName + '/>').append($blockEl).appendTo($parentLi);
	      }
	      this.editor.selection.restore();
	    } else if ($blockEl.is('p, h1, h2, h3, h4')) {
	      marginLeft = parseInt($blockEl.css('margin-left')) || 0;
	      marginLeft = (Math.round(marginLeft / this.opts.indentWidth) + 1) * this.opts.indentWidth;
	      $blockEl.css('margin-left', marginLeft);
	    } else if ($blockEl.is('table') || $blockEl.is('.simditor-table')) {
	      $td = this.editor.selection.containerNode().closest('td, th');
	      $nextTd = $td.next('td, th');
	      if (!($nextTd.length > 0)) {
	        $tr = $td.parent('tr');
	        $nextTr = $tr.next('tr');
	        if ($nextTr.length < 1 && $tr.parent().is('thead')) {
	          $nextTr = $tr.parent('thead').next('tbody').find('tr:first');
	        }
	        $nextTd = $nextTr.find('td:first, th:first');
	      }
	      if (!($td.length > 0 && $nextTd.length > 0)) {
	        return;
	      }
	      this.editor.selection.setRangeAtEndOf($nextTd);
	    } else {
	      return false;
	    }
	    return true;
	  };

	  Indentation.prototype.indentText = function(range) {
	    var text, textNode;
	    text = range.toString().replace(/^(?=.+)/mg, '\u00A0\u00A0');
	    textNode = document.createTextNode(text || '\u00A0\u00A0');
	    range.deleteContents();
	    range.insertNode(textNode);
	    if (text) {
	      range.selectNode(textNode);
	      return this.editor.selection.range(range);
	    } else {
	      return this.editor.selection.setRangeAfter(textNode);
	    }
	  };

	  Indentation.prototype.outdentBlock = function(blockEl) {
	    var $blockEl, $parent, $parentLi, $pre, $prevTd, $prevTr, $td, $tr, marginLeft, range;
	    $blockEl = $(blockEl);
	    if (!($blockEl && $blockEl.length > 0)) {
	      return;
	    }
	    if ($blockEl.is('pre')) {
	      $pre = this.editor.selection.containerNode();
	      if (!($pre.is($blockEl) || $pre.closest('pre').is($blockEl))) {
	        return;
	      }
	      this.outdentText(range);
	    } else if ($blockEl.is('li')) {
	      $parent = $blockEl.parent();
	      $parentLi = $parent.parent('li');
	      this.editor.selection.save();
	      if ($parentLi.length < 1) {
	        range = document.createRange();
	        range.setStartBefore($parent[0]);
	        range.setEndBefore($blockEl[0]);
	        $parent.before(range.extractContents());
	        $('<p/>').insertBefore($parent).after($blockEl.children('ul, ol')).append($blockEl.contents());
	        $blockEl.remove();
	      } else {
	        if ($blockEl.next('li').length > 0) {
	          $('<' + $parent[0].tagName + '/>').append($blockEl.nextAll('li')).appendTo($blockEl);
	        }
	        $blockEl.insertAfter($parentLi);
	        if ($parent.children('li').length < 1) {
	          $parent.remove();
	        }
	      }
	      this.editor.selection.restore();
	    } else if ($blockEl.is('p, h1, h2, h3, h4')) {
	      marginLeft = parseInt($blockEl.css('margin-left')) || 0;
	      marginLeft = Math.max(Math.round(marginLeft / this.opts.indentWidth) - 1, 0) * this.opts.indentWidth;
	      $blockEl.css('margin-left', marginLeft === 0 ? '' : marginLeft);
	    } else if ($blockEl.is('table') || $blockEl.is('.simditor-table')) {
	      $td = this.editor.selection.containerNode().closest('td, th');
	      $prevTd = $td.prev('td, th');
	      if (!($prevTd.length > 0)) {
	        $tr = $td.parent('tr');
	        $prevTr = $tr.prev('tr');
	        if ($prevTr.length < 1 && $tr.parent().is('tbody')) {
	          $prevTr = $tr.parent('tbody').prev('thead').find('tr:first');
	        }
	        $prevTd = $prevTr.find('td:last, th:last');
	      }
	      if (!($td.length > 0 && $prevTd.length > 0)) {
	        return;
	      }
	      this.editor.selection.setRangeAtEndOf($prevTd);
	    } else {
	      return false;
	    }
	    return true;
	  };

	  Indentation.prototype.outdentText = function(range) {};

	  return Indentation;

	})(SimpleModule);

	Simditor = (function(superClass) {
	  extend(Simditor, superClass);

	  function Simditor() {
	    return Simditor.__super__.constructor.apply(this, arguments);
	  }

	  Simditor.connect(Util);

	  Simditor.connect(InputManager);

	  Simditor.connect(Selection);

	  Simditor.connect(UndoManager);

	  Simditor.connect(Keystroke);

	  Simditor.connect(Formatter);

	  Simditor.connect(Toolbar);

	  Simditor.connect(Indentation);

	  Simditor.count = 0;

	  Simditor.prototype.opts = {
	    textarea: null,
	    placeholder: '',
	    defaultImage: 'images/image.png',
	    params: {},
	    upload: false,
	    indentWidth: 40
	  };

	  Simditor.prototype._init = function() {
	    var e, editor, form, uploadOpts;
	    this.textarea = $(this.opts.textarea);
	    this.opts.placeholder = this.opts.placeholder || this.textarea.attr('placeholder');
	    if (!this.textarea.length) {
	      throw new Error('simditor: param textarea is required.');
	      return;
	    }
	    editor = this.textarea.data('simditor');
	    if (editor != null) {
	      editor.destroy();
	    }
	    this.id = ++Simditor.count;
	    this._render();
	    if (this.opts.upload && simpleUploader) {
	      uploadOpts = typeof this.opts.upload === 'object' ? this.opts.upload : {};
	      this.uploader = simpleUploader(uploadOpts);
	    }
	    form = this.textarea.closest('form');
	    if (form.length) {
	      form.on('submit.simditor-' + this.id, (function(_this) {
	        return function() {
	          return _this.sync();
	        };
	      })(this));
	      form.on('reset.simditor-' + this.id, (function(_this) {
	        return function() {
	          return _this.setValue('');
	        };
	      })(this));
	    }
	    this.on('initialized', (function(_this) {
	      return function() {
	        if (_this.opts.placeholder) {
	          _this.on('valuechanged', function() {
	            return _this._placeholder();
	          });
	        }
	        return _this.setValue(_this.textarea.val().trim() || '');
	      };
	    })(this));
	    if (this.util.browser.mozilla) {
	      this.util.reflow();
	      try {
	        document.execCommand('enableObjectResizing', false, false);
	        return document.execCommand('enableInlineTableEditing', false, false);
	      } catch (_error) {
	        e = _error;
	      }
	    }
	  };

	  Simditor.prototype._tpl = "<div class=\"simditor\">\n  <div class=\"simditor-wrapper\">\n    <div class=\"simditor-placeholder\"></div>\n    <div class=\"simditor-body\" contenteditable=\"true\">\n    </div>\n  </div>\n</div>";

	  Simditor.prototype._render = function() {
	    var key, ref, results, val;
	    this.el = $(this._tpl).insertBefore(this.textarea);
	    this.wrapper = this.el.find('.simditor-wrapper');
	    this.body = this.wrapper.find('.simditor-body');
	    this.placeholderEl = this.wrapper.find('.simditor-placeholder').append(this.opts.placeholder);
	    this.el.data('simditor', this);
	    this.wrapper.append(this.textarea);
	    this.textarea.data('simditor', this).blur();
	    this.body.attr('tabindex', this.textarea.attr('tabindex'));
	    if (this.util.os.mac) {
	      this.el.addClass('simditor-mac');
	    } else if (this.util.os.linux) {
	      this.el.addClass('simditor-linux');
	    }
	    if (this.util.os.mobile) {
	      this.el.addClass('simditor-mobile');
	    }
	    if (this.opts.params) {
	      ref = this.opts.params;
	      results = [];
	      for (key in ref) {
	        val = ref[key];
	        results.push($('<input/>', {
	          type: 'hidden',
	          name: key,
	          value: val
	        }).insertAfter(this.textarea));
	      }
	      return results;
	    }
	  };

	  Simditor.prototype._placeholder = function() {
	    var children;
	    children = this.body.children();
	    if (children.length === 0 || (children.length === 1 && this.util.isEmptyNode(children) && parseInt(children.css('margin-left') || 0) < this.opts.indentWidth)) {
	      return this.placeholderEl.show();
	    } else {
	      return this.placeholderEl.hide();
	    }
	  };

	  Simditor.prototype.setValue = function(val) {
	    this.hidePopover();
	    this.textarea.val(val);
	    this.body.html(val);
	    this.formatter.format();
	    this.formatter.decorate();
	    this.util.reflow(this.body);
	    this.inputManager.lastCaretPosition = null;
	    return this.trigger('valuechanged');
	  };

	  Simditor.prototype.getValue = function() {
	    return this.sync();
	  };

	  Simditor.prototype.sync = function() {
	    var children, cloneBody, emptyP, firstP, lastP, val;
	    cloneBody = this.body.clone();
	    this.formatter.undecorate(cloneBody);
	    this.formatter.format(cloneBody);
	    this.formatter.autolink(cloneBody);
	    children = cloneBody.children();
	    lastP = children.last('p');
	    firstP = children.first('p');
	    while (lastP.is('p') && this.util.isEmptyNode(lastP)) {
	      emptyP = lastP;
	      lastP = lastP.prev('p');
	      emptyP.remove();
	    }
	    while (firstP.is('p') && this.util.isEmptyNode(firstP)) {
	      emptyP = firstP;
	      firstP = lastP.next('p');
	      emptyP.remove();
	    }
	    cloneBody.find('img.uploading').remove();
	    val = $.trim(cloneBody.html());
	    this.textarea.val(val);
	    return val;
	  };

	  Simditor.prototype.focus = function() {
	    if (!(this.body.is(':visible') && this.body.is('[contenteditable]'))) {
	      this.el.find('textarea:visible').focus();
	      return;
	    }
	    if (this.inputManager.lastCaretPosition) {
	      return this.undoManager.caretPosition(this.inputManager.lastCaretPosition);
	    } else {
	      return this.body.focus();
	    }
	  };

	  Simditor.prototype.blur = function() {
	    if (this.body.is(':visible') && this.body.is('[contenteditable]')) {
	      return this.body.blur();
	    } else {
	      return this.body.find('textarea:visible').blur();
	    }
	  };

	  Simditor.prototype.hidePopover = function() {
	    return this.el.find('.simditor-popover').each(function(i, popover) {
	      popover = $(popover).data('popover');
	      if (popover.active) {
	        return popover.hide();
	      }
	    });
	  };

	  Simditor.prototype.destroy = function() {
	    this.triggerHandler('destroy');
	    this.textarea.closest('form').off('.simditor .simditor-' + this.id);
	    this.selection.clear();
	    this.inputManager.focused = false;
	    this.textarea.insertBefore(this.el).hide().val('').removeData('simditor');
	    this.el.remove();
	    $(document).off('.simditor-' + this.id);
	    $(window).off('.simditor-' + this.id);
	    return this.off();
	  };

	  return Simditor;

	})(SimpleModule);

	Simditor.i18n = {
	  'zh-CN': {
	    'blockquote': '引用',
	    'bold': '加粗文字',
	    'code': '插入代码',
	    'color': '文字颜色',
	    'coloredText': '彩色文字',
	    'hr': '分隔线',
	    'image': '插入图片',
	    'externalImage': '外链图片',
	    'uploadImage': '上传图片',
	    'uploadFailed': '上传失败了',
	    'uploadError': '上传出错了',
	    'imageUrl': '图片地址',
	    'imageSize': '图片尺寸',
	    'imageAlt': '图片描述',
	    'restoreImageSize': '还原图片尺寸',
	    'uploading': '正在上传',
	    'indent': '向右缩进',
	    'outdent': '向左缩进',
	    'italic': '斜体文字',
	    'link': '插入链接',
	    'text': '文本',
	    'linkText': '链接文字',
	    'linkUrl': '地址',
	    'removeLink': '移除链接',
	    'ol': '有序列表',
	    'ul': '无序列表',
	    'strikethrough': '删除线文字',
	    'table': '表格',
	    'deleteRow': '删除行',
	    'insertRowAbove': '在上面插入行',
	    'insertRowBelow': '在下面插入行',
	    'deleteColumn': '删除列',
	    'insertColumnLeft': '在左边插入列',
	    'insertColumnRight': '在右边插入列',
	    'deleteTable': '删除表格',
	    'title': '标题',
	    'normalText': '普通文本',
	    'underline': '下划线文字',
	    'alignment': '水平对齐',
	    'alignCenter': '居中',
	    'alignLeft': '居左',
	    'alignRight': '居右',
	    'selectLanguage': '选择程序语言'
	  },
	  'en-US': {
	    'blockquote': 'Block Quote',
	    'bold': 'Bold',
	    'code': 'Code',
	    'color': 'Text Color',
	    'coloredText': 'Colored Text',
	    'hr': 'Horizontal Line',
	    'image': 'Insert Image',
	    'externalImage': 'External Image',
	    'uploadImage': 'Upload Image',
	    'uploadFailed': 'Upload failed',
	    'uploadError': 'Error occurs during upload',
	    'imageUrl': 'Url',
	    'imageSize': 'Size',
	    'imageAlt': 'Alt',
	    'restoreImageSize': 'Restore Origin Size',
	    'uploading': 'Uploading',
	    'indent': 'Indent',
	    'outdent': 'Outdent',
	    'italic': 'Italic',
	    'link': 'Insert Link',
	    'text': 'Text',
	    'linkText': 'Link Text',
	    'linkUrl': 'Link Url',
	    'removeLink': 'Remove Link',
	    'ol': 'Ordered List',
	    'ul': 'Unordered List',
	    'strikethrough': 'Strikethrough',
	    'table': 'Table',
	    'deleteRow': 'Delete Row',
	    'insertRowAbove': 'Insert Row Above',
	    'insertRowBelow': 'Insert Row Below',
	    'deleteColumn': 'Delete Column',
	    'insertColumnLeft': 'Insert Column Left',
	    'insertColumnRight': 'Insert Column Right',
	    'deleteTable': 'Delete Table',
	    'title': 'Title',
	    'normalText': 'Text',
	    'underline': 'Underline',
	    'alignment': 'Alignment',
	    'alignCenter': 'Align Center',
	    'alignLeft': 'Align Left',
	    'alignRight': 'Align Right',
	    'selectLanguage': 'Select Language'
	  }
	};

	Button = (function(superClass) {
	  extend(Button, superClass);

	  Button.prototype._tpl = {
	    item: '<li><a tabindex="-1" unselectable="on" class="toolbar-item" href="javascript:;"><span></span></a></li>',
	    menuWrapper: '<div class="toolbar-menu"></div>',
	    menuItem: '<li><a tabindex="-1" unselectable="on" class="menu-item" href="javascript:;"><span></span></a></li>',
	    separator: '<li><span class="separator"></span></li>'
	  };

	  Button.prototype.name = '';

	  Button.prototype.icon = '';

	  Button.prototype.title = '';

	  Button.prototype.text = '';

	  Button.prototype.htmlTag = '';

	  Button.prototype.disableTag = '';

	  Button.prototype.menu = false;

	  Button.prototype.active = false;

	  Button.prototype.disabled = false;

	  Button.prototype.needFocus = true;

	  Button.prototype.shortcut = null;

	  function Button(opts) {
	    this.editor = opts.editor;
	    this.title = this._t(this.name);
	    Button.__super__.constructor.call(this, opts);
	  }

	  Button.prototype._init = function() {
	    var k, len, ref, tag;
	    this.render();
	    this.el.on('mousedown', (function(_this) {
	      return function(e) {
	        var exceed, noFocus, param;
	        e.preventDefault();
	        noFocus = _this.needFocus && !_this.editor.inputManager.focused;
	        if (_this.el.hasClass('disabled') || noFocus) {
	          return false;
	        }
	        if (_this.menu) {
	          _this.wrapper.toggleClass('menu-on').siblings('li').removeClass('menu-on');
	          if (_this.wrapper.is('.menu-on')) {
	            exceed = _this.menuWrapper.offset().left + _this.menuWrapper.outerWidth() + 5 - _this.editor.wrapper.offset().left - _this.editor.wrapper.outerWidth();
	            if (exceed > 0) {
	              _this.menuWrapper.css({
	                'left': 'auto',
	                'right': 0
	              });
	            }
	            _this.trigger('menuexpand');
	          }
	          return false;
	        }
	        param = _this.el.data('param');
	        _this.command(param);
	        return false;
	      };
	    })(this));
	    this.wrapper.on('click', 'a.menu-item', (function(_this) {
	      return function(e) {
	        var btn, noFocus, param;
	        e.preventDefault();
	        btn = $(e.currentTarget);
	        _this.wrapper.removeClass('menu-on');
	        noFocus = _this.needFocus && !_this.editor.inputManager.focused;
	        if (btn.hasClass('disabled') || noFocus) {
	          return false;
	        }
	        _this.editor.toolbar.wrapper.removeClass('menu-on');
	        param = btn.data('param');
	        _this.command(param);
	        return false;
	      };
	    })(this));
	    this.wrapper.on('mousedown', 'a.menu-item', function(e) {
	      return false;
	    });
	    this.editor.on('blur', (function(_this) {
	      return function() {
	        var editorActive;
	        editorActive = _this.editor.body.is(':visible') && _this.editor.body.is('[contenteditable]');
	        if (!editorActive) {
	          return;
	        }
	        _this.setActive(false);
	        return _this.setDisabled(false);
	      };
	    })(this));
	    if (this.shortcut != null) {
	      this.editor.inputManager.addShortcut(this.shortcut, (function(_this) {
	        return function(e) {
	          _this.el.mousedown();
	          return false;
	        };
	      })(this));
	    }
	    ref = this.htmlTag.split(',');
	    for (k = 0, len = ref.length; k < len; k++) {
	      tag = ref[k];
	      tag = $.trim(tag);
	      if (tag && $.inArray(tag, this.editor.formatter._allowedTags) < 0) {
	        this.editor.formatter._allowedTags.push(tag);
	      }
	    }
	    return this.editor.on('selectionchanged', (function(_this) {
	      return function(e) {
	        if (_this.editor.inputManager.focused) {
	          return _this._status();
	        }
	      };
	    })(this));
	  };

	  Button.prototype.iconClassOf = function(icon) {
	    if (icon) {
	      return "simditor-icon simditor-icon-" + icon;
	    } else {
	      return '';
	    }
	  };

	  Button.prototype.setIcon = function(icon) {
	    return this.el.find('span').removeClass().addClass(this.iconClassOf(icon)).text(this.text);
	  };

	  Button.prototype.render = function() {
	    this.wrapper = $(this._tpl.item).appendTo(this.editor.toolbar.list);
	    this.el = this.wrapper.find('a.toolbar-item');
	    this.el.attr('title', this.title).addClass("toolbar-item-" + this.name).data('button', this);
	    this.setIcon(this.icon);
	    if (!this.menu) {
	      return;
	    }
	    this.menuWrapper = $(this._tpl.menuWrapper).appendTo(this.wrapper);
	    this.menuWrapper.addClass("toolbar-menu-" + this.name);
	    return this.renderMenu();
	  };

	  Button.prototype.renderMenu = function() {
	    var $menuBtnEl, $menuItemEl, k, len, menuItem, ref, ref1, results;
	    if (!$.isArray(this.menu)) {
	      return;
	    }
	    this.menuEl = $('<ul/>').appendTo(this.menuWrapper);
	    ref = this.menu;
	    results = [];
	    for (k = 0, len = ref.length; k < len; k++) {
	      menuItem = ref[k];
	      if (menuItem === '|') {
	        $(this._tpl.separator).appendTo(this.menuEl);
	        continue;
	      }
	      $menuItemEl = $(this._tpl.menuItem).appendTo(this.menuEl);
	      $menuBtnEl = $menuItemEl.find('a.menu-item').attr({
	        'title': (ref1 = menuItem.title) != null ? ref1 : menuItem.text,
	        'data-param': menuItem.param
	      }).addClass('menu-item-' + menuItem.name);
	      if (menuItem.icon) {
	        results.push($menuBtnEl.find('span').addClass(this.iconClassOf(menuItem.icon)));
	      } else {
	        results.push($menuBtnEl.find('span').text(menuItem.text));
	      }
	    }
	    return results;
	  };

	  Button.prototype.setActive = function(active) {
	    if (active === this.active) {
	      return;
	    }
	    this.active = active;
	    return this.el.toggleClass('active', this.active);
	  };

	  Button.prototype.setDisabled = function(disabled) {
	    if (disabled === this.disabled) {
	      return;
	    }
	    this.disabled = disabled;
	    return this.el.toggleClass('disabled', this.disabled);
	  };

	  Button.prototype._disableStatus = function() {
	    var disabled, endNodes, startNodes;
	    startNodes = this.editor.selection.startNodes();
	    endNodes = this.editor.selection.endNodes();
	    disabled = startNodes.filter(this.disableTag).length > 0 || endNodes.filter(this.disableTag).length > 0;
	    this.setDisabled(disabled);
	    if (this.disabled) {
	      this.setActive(false);
	    }
	    return this.disabled;
	  };

	  Button.prototype._activeStatus = function() {
	    var active, endNode, endNodes, startNode, startNodes;
	    startNodes = this.editor.selection.startNodes();
	    endNodes = this.editor.selection.endNodes();
	    startNode = startNodes.filter(this.htmlTag);
	    endNode = endNodes.filter(this.htmlTag);
	    active = startNode.length > 0 && endNode.length > 0 && startNode.is(endNode);
	    this.node = active ? startNode : null;
	    this.setActive(active);
	    return this.active;
	  };

	  Button.prototype._status = function() {
	    this._disableStatus();
	    if (this.disabled) {
	      return;
	    }
	    return this._activeStatus();
	  };

	  Button.prototype.command = function(param) {};

	  Button.prototype._t = function() {
	    var args, ref, result;
	    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
	    result = Button.__super__._t.apply(this, args);
	    if (!result) {
	      result = (ref = this.editor)._t.apply(ref, args);
	    }
	    return result;
	  };

	  return Button;

	})(SimpleModule);

	Simditor.Button = Button;

	Popover = (function(superClass) {
	  extend(Popover, superClass);

	  Popover.prototype.offset = {
	    top: 4,
	    left: 0
	  };

	  Popover.prototype.target = null;

	  Popover.prototype.active = false;

	  function Popover(opts) {
	    this.button = opts.button;
	    this.editor = opts.button.editor;
	    Popover.__super__.constructor.call(this, opts);
	  }

	  Popover.prototype._init = function() {
	    this.el = $('<div class="simditor-popover"></div>').appendTo(this.editor.el).data('popover', this);
	    this.render();
	    this.el.on('mouseenter', (function(_this) {
	      return function(e) {
	        return _this.el.addClass('hover');
	      };
	    })(this));
	    return this.el.on('mouseleave', (function(_this) {
	      return function(e) {
	        return _this.el.removeClass('hover');
	      };
	    })(this));
	  };

	  Popover.prototype.render = function() {};

	  Popover.prototype.show = function($target, position) {
	    if (position == null) {
	      position = 'bottom';
	    }
	    if ($target == null) {
	      return;
	    }
	    this.el.siblings('.simditor-popover').each(function(i, popover) {
	      popover = $(popover).data('popover');
	      if (popover.active) {
	        return popover.hide();
	      }
	    });
	    if (this.active && this.target) {
	      this.target.removeClass('selected');
	    }
	    this.target = $target.addClass('selected');
	    if (this.active) {
	      this.refresh(position);
	      return this.trigger('popovershow');
	    } else {
	      this.active = true;
	      this.el.css({
	        left: -9999
	      }).show();
	      this.editor.util.reflow();
	      this.refresh(position);
	      return this.trigger('popovershow');
	    }
	  };

	  Popover.prototype.hide = function() {
	    if (!this.active) {
	      return;
	    }
	    if (this.target) {
	      this.target.removeClass('selected');
	    }
	    this.target = null;
	    this.active = false;
	    this.el.hide();
	    return this.trigger('popoverhide');
	  };

	  Popover.prototype.refresh = function(position) {
	    var editorOffset, left, maxLeft, targetH, targetOffset, top;
	    if (position == null) {
	      position = 'bottom';
	    }
	    if (!this.active) {
	      return;
	    }
	    editorOffset = this.editor.el.offset();
	    targetOffset = this.target.offset();
	    targetH = this.target.outerHeight();
	    if (position === 'bottom') {
	      top = targetOffset.top - editorOffset.top + targetH;
	    } else if (position === 'top') {
	      top = targetOffset.top - editorOffset.top - this.el.height();
	    }
	    maxLeft = this.editor.wrapper.width() - this.el.outerWidth() - 10;
	    left = Math.min(targetOffset.left - editorOffset.left, maxLeft);
	    return this.el.css({
	      top: top + this.offset.top,
	      left: left + this.offset.left
	    });
	  };

	  Popover.prototype.destroy = function() {
	    this.target = null;
	    this.active = false;
	    this.editor.off('.linkpopover');
	    return this.el.remove();
	  };

	  Popover.prototype._t = function() {
	    var args, ref, result;
	    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
	    result = Popover.__super__._t.apply(this, args);
	    if (!result) {
	      result = (ref = this.button)._t.apply(ref, args);
	    }
	    return result;
	  };

	  return Popover;

	})(SimpleModule);

	Simditor.Popover = Popover;

	TitleButton = (function(superClass) {
	  extend(TitleButton, superClass);

	  function TitleButton() {
	    return TitleButton.__super__.constructor.apply(this, arguments);
	  }

	  TitleButton.prototype.name = 'title';

	  TitleButton.prototype.htmlTag = 'h1, h2, h3, h4';

	  TitleButton.prototype.disableTag = 'pre, table';

	  TitleButton.prototype._init = function() {
	    this.menu = [
	      {
	        name: 'normal',
	        text: this._t('normalText'),
	        param: 'p'
	      }, '|', {
	        name: 'h1',
	        text: this._t('title') + ' 1',
	        param: 'h1'
	      }, {
	        name: 'h2',
	        text: this._t('title') + ' 2',
	        param: 'h2'
	      }, {
	        name: 'h3',
	        text: this._t('title') + ' 3',
	        param: 'h3'
	      }, {
	        name: 'h4',
	        text: this._t('title') + ' 4',
	        param: 'h4'
	      }, {
	        name: 'h5',
	        text: this._t('title') + ' 5',
	        param: 'h5'
	      }
	    ];
	    return TitleButton.__super__._init.call(this);
	  };

	  TitleButton.prototype.setActive = function(active, param) {
	    TitleButton.__super__.setActive.call(this, active);
	    if (active) {
	      param || (param = this.node[0].tagName.toLowerCase());
	    }
	    this.el.removeClass('active-p active-h1 active-h2 active-h3');
	    if (active) {
	      return this.el.addClass('active active-' + param);
	    }
	  };

	  TitleButton.prototype.command = function(param) {
	    var $rootNodes;
	    $rootNodes = this.editor.selection.rootNodes();
	    this.editor.selection.save();
	    $rootNodes.each((function(_this) {
	      return function(i, node) {
	        var $node;
	        $node = $(node);
	        if ($node.is('blockquote') || $node.is(param) || $node.is(_this.disableTag) || _this.editor.util.isDecoratedNode($node)) {
	          return;
	        }
	        return $('<' + param + '/>').append($node.contents()).replaceAll($node);
	      };
	    })(this));
	    this.editor.selection.restore();
	    return this.editor.trigger('valuechanged');
	  };

	  return TitleButton;

	})(Button);

	Simditor.Toolbar.addButton(TitleButton);

	BoldButton = (function(superClass) {
	  extend(BoldButton, superClass);

	  function BoldButton() {
	    return BoldButton.__super__.constructor.apply(this, arguments);
	  }

	  BoldButton.prototype.name = 'bold';

	  BoldButton.prototype.icon = 'bold';

	  BoldButton.prototype.htmlTag = 'b, strong';

	  BoldButton.prototype.disableTag = 'pre';

	  BoldButton.prototype.shortcut = 'cmd+b';

	  BoldButton.prototype._init = function() {
	    if (this.editor.util.os.mac) {
	      this.title = this.title + ' ( Cmd + b )';
	    } else {
	      this.title = this.title + ' ( Ctrl + b )';
	      this.shortcut = 'ctrl+b';
	    }
	    return BoldButton.__super__._init.call(this);
	  };

	  BoldButton.prototype._activeStatus = function() {
	    var active;
	    active = document.queryCommandState('bold') === true;
	    this.setActive(active);
	    return this.active;
	  };

	  BoldButton.prototype.command = function() {
	    document.execCommand('bold');
	    if (!this.editor.util.support.oninput) {
	      this.editor.trigger('valuechanged');
	    }
	    return $(document).trigger('selectionchange');
	  };

	  return BoldButton;

	})(Button);

	Simditor.Toolbar.addButton(BoldButton);

	ItalicButton = (function(superClass) {
	  extend(ItalicButton, superClass);

	  function ItalicButton() {
	    return ItalicButton.__super__.constructor.apply(this, arguments);
	  }

	  ItalicButton.prototype.name = 'italic';

	  ItalicButton.prototype.icon = 'italic';

	  ItalicButton.prototype.htmlTag = 'i';

	  ItalicButton.prototype.disableTag = 'pre';

	  ItalicButton.prototype.shortcut = 'cmd+i';

	  ItalicButton.prototype._init = function() {
	    if (this.editor.util.os.mac) {
	      this.title = this.title + " ( Cmd + i )";
	    } else {
	      this.title = this.title + " ( Ctrl + i )";
	      this.shortcut = 'ctrl+i';
	    }
	    return ItalicButton.__super__._init.call(this);
	  };

	  ItalicButton.prototype._activeStatus = function() {
	    var active;
	    active = document.queryCommandState('italic') === true;
	    this.setActive(active);
	    return this.active;
	  };

	  ItalicButton.prototype.command = function() {
	    document.execCommand('italic');
	    if (!this.editor.util.support.oninput) {
	      this.editor.trigger('valuechanged');
	    }
	    return $(document).trigger('selectionchange');
	  };

	  return ItalicButton;

	})(Button);

	Simditor.Toolbar.addButton(ItalicButton);

	UnderlineButton = (function(superClass) {
	  extend(UnderlineButton, superClass);

	  function UnderlineButton() {
	    return UnderlineButton.__super__.constructor.apply(this, arguments);
	  }

	  UnderlineButton.prototype.name = 'underline';

	  UnderlineButton.prototype.icon = 'underline';

	  UnderlineButton.prototype.htmlTag = 'u';

	  UnderlineButton.prototype.disableTag = 'pre';

	  UnderlineButton.prototype.shortcut = 'cmd+u';

	  UnderlineButton.prototype.render = function() {
	    if (this.editor.util.os.mac) {
	      this.title = this.title + ' ( Cmd + u )';
	    } else {
	      this.title = this.title + ' ( Ctrl + u )';
	      this.shortcut = 'ctrl+u';
	    }
	    return UnderlineButton.__super__.render.call(this);
	  };

	  UnderlineButton.prototype._activeStatus = function() {
	    var active;
	    active = document.queryCommandState('underline') === true;
	    this.setActive(active);
	    return this.active;
	  };

	  UnderlineButton.prototype.command = function() {
	    document.execCommand('underline');
	    if (!this.editor.util.support.oninput) {
	      this.editor.trigger('valuechanged');
	    }
	    return $(document).trigger('selectionchange');
	  };

	  return UnderlineButton;

	})(Button);

	Simditor.Toolbar.addButton(UnderlineButton);

	ColorButton = (function(superClass) {
	  extend(ColorButton, superClass);

	  function ColorButton() {
	    return ColorButton.__super__.constructor.apply(this, arguments);
	  }

	  ColorButton.prototype.name = 'color';

	  ColorButton.prototype.icon = 'tint';

	  ColorButton.prototype.disableTag = 'pre';

	  ColorButton.prototype.menu = true;

	  ColorButton.prototype.render = function() {
	    var args;
	    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
	    return ColorButton.__super__.render.apply(this, args);
	  };

	  ColorButton.prototype.renderMenu = function() {
	    $('<ul class="color-list">\n  <li><a href="javascript:;" class="font-color font-color-1"></a></li>\n  <li><a href="javascript:;" class="font-color font-color-2"></a></li>\n  <li><a href="javascript:;" class="font-color font-color-3"></a></li>\n  <li><a href="javascript:;" class="font-color font-color-4"></a></li>\n  <li><a href="javascript:;" class="font-color font-color-5"></a></li>\n  <li><a href="javascript:;" class="font-color font-color-6"></a></li>\n  <li><a href="javascript:;" class="font-color font-color-7"></a></li>\n  <li><a href="javascript:;" class="font-color font-color-default"></a></li>\n</ul>').appendTo(this.menuWrapper);
	    this.menuWrapper.on('mousedown', '.color-list', function(e) {
	      return false;
	    });
	    return this.menuWrapper.on('click', '.font-color', (function(_this) {
	      return function(e) {
	        var $link, $p, hex, range, rgb, textNode;
	        _this.wrapper.removeClass('menu-on');
	        $link = $(e.currentTarget);
	        if ($link.hasClass('font-color-default')) {
	          $p = _this.editor.body.find('p, li');
	          if (!($p.length > 0)) {
	            return;
	          }
	          rgb = window.getComputedStyle($p[0], null).getPropertyValue('color');
	          hex = _this._convertRgbToHex(rgb);
	        } else {
	          rgb = window.getComputedStyle($link[0], null).getPropertyValue('background-color');
	          hex = _this._convertRgbToHex(rgb);
	        }
	        if (!hex) {
	          return;
	        }
	        range = _this.editor.selection.range();
	        if (!$link.hasClass('font-color-default') && range.collapsed) {
	          textNode = document.createTextNode(_this._t('coloredText'));
	          range.insertNode(textNode);
	          range.selectNodeContents(textNode);
	          _this.editor.selection.range(range);
	        }
	        document.execCommand('styleWithCSS', false, true);
	        document.execCommand('foreColor', false, hex);
	        document.execCommand('styleWithCSS', false, false);
	        if (!_this.editor.util.support.oninput) {
	          return _this.editor.trigger('valuechanged');
	        }
	      };
	    })(this));
	  };

	  ColorButton.prototype._convertRgbToHex = function(rgb) {
	    var match, re, rgbToHex;
	    re = /rgb\((\d+),\s?(\d+),\s?(\d+)\)/g;
	    match = re.exec(rgb);
	    if (!match) {
	      return '';
	    }
	    rgbToHex = function(r, g, b) {
	      var componentToHex;
	      componentToHex = function(c) {
	        var hex;
	        hex = c.toString(16);
	        if (hex.length === 1) {
	          return '0' + hex;
	        } else {
	          return hex;
	        }
	      };
	      return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
	    };
	    return rgbToHex(match[1] * 1, match[2] * 1, match[3] * 1);
	  };

	  return ColorButton;

	})(Button);

	Simditor.Toolbar.addButton(ColorButton);

	ListButton = (function(superClass) {
	  extend(ListButton, superClass);

	  function ListButton() {
	    return ListButton.__super__.constructor.apply(this, arguments);
	  }

	  ListButton.prototype.type = '';

	  ListButton.prototype.disableTag = 'pre, table';

	  ListButton.prototype.command = function(param) {
	    var $list, $rootNodes, anotherType;
	    $rootNodes = this.editor.selection.blockNodes();
	    anotherType = this.type === 'ul' ? 'ol' : 'ul';
	    this.editor.selection.save();
	    $list = null;
	    $rootNodes.each((function(_this) {
	      return function(i, node) {
	        var $node;
	        $node = $(node);
	        if ($node.is('blockquote, li') || $node.is(_this.disableTag) || _this.editor.util.isDecoratedNode($node) || !$.contains(document, node)) {
	          return;
	        }
	        if ($node.is(_this.type)) {
	          $node.children('li').each(function(i, li) {
	            var $childList, $li;
	            $li = $(li);
	            $childList = $li.children('ul, ol').insertAfter($node);
	            return $('<p/>').append($(li).html() || _this.editor.util.phBr).insertBefore($node);
	          });
	          return $node.remove();
	        } else if ($node.is(anotherType)) {
	          return $('<' + _this.type + '/>').append($node.contents()).replaceAll($node);
	        } else if ($list && $node.prev().is($list)) {
	          $('<li/>').append($node.html() || _this.editor.util.phBr).appendTo($list);
	          return $node.remove();
	        } else {
	          $list = $("<" + _this.type + "><li></li></" + _this.type + ">");
	          $list.find('li').append($node.html() || _this.editor.util.phBr);
	          return $list.replaceAll($node);
	        }
	      };
	    })(this));
	    this.editor.selection.restore();
	    return this.editor.trigger('valuechanged');
	  };

	  return ListButton;

	})(Button);

	OrderListButton = (function(superClass) {
	  extend(OrderListButton, superClass);

	  function OrderListButton() {
	    return OrderListButton.__super__.constructor.apply(this, arguments);
	  }

	  OrderListButton.prototype.type = 'ol';

	  OrderListButton.prototype.name = 'ol';

	  OrderListButton.prototype.icon = 'list-ol';

	  OrderListButton.prototype.htmlTag = 'ol';

	  OrderListButton.prototype.shortcut = 'cmd+/';

	  OrderListButton.prototype._init = function() {
	    if (this.editor.util.os.mac) {
	      this.title = this.title + ' ( Cmd + / )';
	    } else {
	      this.title = this.title + ' ( ctrl + / )';
	      this.shortcut = 'ctrl+/';
	    }
	    return OrderListButton.__super__._init.call(this);
	  };

	  return OrderListButton;

	})(ListButton);

	UnorderListButton = (function(superClass) {
	  extend(UnorderListButton, superClass);

	  function UnorderListButton() {
	    return UnorderListButton.__super__.constructor.apply(this, arguments);
	  }

	  UnorderListButton.prototype.type = 'ul';

	  UnorderListButton.prototype.name = 'ul';

	  UnorderListButton.prototype.icon = 'list-ul';

	  UnorderListButton.prototype.htmlTag = 'ul';

	  UnorderListButton.prototype.shortcut = 'cmd+.';

	  UnorderListButton.prototype._init = function() {
	    if (this.editor.util.os.mac) {
	      this.title = this.title + ' ( Cmd + . )';
	    } else {
	      this.title = this.title + ' ( Ctrl + . )';
	      this.shortcut = 'ctrl+.';
	    }
	    return UnorderListButton.__super__._init.call(this);
	  };

	  return UnorderListButton;

	})(ListButton);

	Simditor.Toolbar.addButton(OrderListButton);

	Simditor.Toolbar.addButton(UnorderListButton);

	BlockquoteButton = (function(superClass) {
	  extend(BlockquoteButton, superClass);

	  function BlockquoteButton() {
	    return BlockquoteButton.__super__.constructor.apply(this, arguments);
	  }

	  BlockquoteButton.prototype.name = 'blockquote';

	  BlockquoteButton.prototype.icon = 'quote-left';

	  BlockquoteButton.prototype.htmlTag = 'blockquote';

	  BlockquoteButton.prototype.disableTag = 'pre, table';

	  BlockquoteButton.prototype.command = function() {
	    var $rootNodes, clearCache, nodeCache;
	    $rootNodes = this.editor.selection.rootNodes();
	    this.editor.selection.save();
	    nodeCache = [];
	    clearCache = (function(_this) {
	      return function() {
	        if (nodeCache.length > 0) {
	          $("<" + _this.htmlTag + "/>").insertBefore(nodeCache[0]).append(nodeCache);
	          return nodeCache.length = 0;
	        }
	      };
	    })(this);
	    $rootNodes.each((function(_this) {
	      return function(i, node) {
	        var $node;
	        $node = $(node);
	        if (!$node.parent().is(_this.editor.body)) {
	          return;
	        }
	        if ($node.is(_this.htmlTag)) {
	          clearCache();
	          return $node.children().unwrap();
	        } else if ($node.is(_this.disableTag) || _this.editor.util.isDecoratedNode($node)) {
	          return clearCache();
	        } else {
	          return nodeCache.push(node);
	        }
	      };
	    })(this));
	    clearCache();
	    this.editor.selection.restore();
	    return this.editor.trigger('valuechanged');
	  };

	  return BlockquoteButton;

	})(Button);

	Simditor.Toolbar.addButton(BlockquoteButton);

	CodeButton = (function(superClass) {
	  extend(CodeButton, superClass);

	  function CodeButton() {
	    return CodeButton.__super__.constructor.apply(this, arguments);
	  }

	  CodeButton.prototype.name = 'code';

	  CodeButton.prototype.icon = 'code';

	  CodeButton.prototype.htmlTag = 'pre';

	  CodeButton.prototype.disableTag = 'ul, ol, table';

	  CodeButton.prototype._init = function() {
	    CodeButton.__super__._init.call(this);
	    this.editor.on('decorate', (function(_this) {
	      return function(e, $el) {
	        return $el.find('pre').each(function(i, pre) {
	          return _this.decorate($(pre));
	        });
	      };
	    })(this));
	    return this.editor.on('undecorate', (function(_this) {
	      return function(e, $el) {
	        return $el.find('pre').each(function(i, pre) {
	          return _this.undecorate($(pre));
	        });
	      };
	    })(this));
	  };

	  CodeButton.prototype.render = function() {
	    var args;
	    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
	    CodeButton.__super__.render.apply(this, args);
	    return this.popover = new CodePopover({
	      button: this
	    });
	  };

	  CodeButton.prototype._status = function() {
	    CodeButton.__super__._status.call(this);
	    if (this.active) {
	      return this.popover.show(this.node);
	    } else {
	      return this.popover.hide();
	    }
	  };

	  CodeButton.prototype.decorate = function($pre) {
	    var $code, lang, ref, ref1;
	    $code = $pre.find('> code');
	    if ($code.length > 0) {
	      lang = (ref = $code.attr('class')) != null ? (ref1 = ref.match(/lang-(\S+)/)) != null ? ref1[1] : void 0 : void 0;
	      $code.contents().unwrap();
	      if (lang) {
	        return $pre.attr('data-lang', lang);
	      }
	    }
	  };

	  CodeButton.prototype.undecorate = function($pre) {
	    var $code, lang;
	    lang = $pre.attr('data-lang');
	    $code = $('<code/>');
	    if (lang && lang !== -1) {
	      $code.addClass('lang-' + lang);
	    }
	    return $pre.wrapInner($code).removeAttr('data-lang');
	  };

	  CodeButton.prototype.command = function() {
	    var $rootNodes, clearCache, nodeCache, pres;
	    $rootNodes = this.editor.selection.rootNodes();
	    nodeCache = [];
	    pres = [];
	    clearCache = (function(_this) {
	      return function() {
	        var $pre;
	        if (!(nodeCache.length > 0)) {
	          return;
	        }
	        $pre = $("<" + _this.htmlTag + "/>").insertBefore(nodeCache[0]).text(_this.editor.formatter.clearHtml(nodeCache));
	        pres.push($pre[0]);
	        return nodeCache.length = 0;
	      };
	    })(this);
	    $rootNodes.each((function(_this) {
	      return function(i, node) {
	        var $node;
	        $node = $(node);
	        if ($node.is(_this.htmlTag)) {
	          clearCache();
	          return $('<p/>').append($node.html().replace('\n', '<br/>')).replaceAll($node);
	        } else if ($node.is(_this.disableTag) || _this.editor.util.isDecoratedNode($node) || $node.is('blockquote')) {
	          return clearCache();
	        } else {
	          return nodeCache.push(node);
	        }
	      };
	    })(this));
	    clearCache();
	    this.editor.selection.setRangeAtEndOf($(pres).last());
	    return this.editor.trigger('valuechanged');
	  };

	  return CodeButton;

	})(Button);

	CodePopover = (function(superClass) {
	  extend(CodePopover, superClass);

	  function CodePopover() {
	    return CodePopover.__super__.constructor.apply(this, arguments);
	  }

	  CodePopover.prototype.render = function() {
	    var $option, k, lang, len, ref;
	    this._tpl = "<div class=\"code-settings\">\n  <div class=\"settings-field\">\n    <select class=\"select-lang\">\n      <option value=\"-1\">" + (this._t('selectLanguage')) + "</option>\n    </select>\n  </div>\n</div>";
	    this.langs = this.editor.opts.codeLanguages || [
	      {
	        name: 'Bash',
	        value: 'bash'
	      }, {
	        name: 'C++',
	        value: 'c++'
	      }, {
	        name: 'C#',
	        value: 'cs'
	      }, {
	        name: 'CSS',
	        value: 'css'
	      }, {
	        name: 'Erlang',
	        value: 'erlang'
	      }, {
	        name: 'Less',
	        value: 'less'
	      }, {
	        name: 'Sass',
	        value: 'sass'
	      }, {
	        name: 'Diff',
	        value: 'diff'
	      }, {
	        name: 'CoffeeScript',
	        value: 'coffeescript'
	      }, {
	        name: 'HTML,XML',
	        value: 'html'
	      }, {
	        name: 'JSON',
	        value: 'json'
	      }, {
	        name: 'Java',
	        value: 'java'
	      }, {
	        name: 'JavaScript',
	        value: 'js'
	      }, {
	        name: 'Markdown',
	        value: 'markdown'
	      }, {
	        name: 'Objective C',
	        value: 'oc'
	      }, {
	        name: 'PHP',
	        value: 'php'
	      }, {
	        name: 'Perl',
	        value: 'parl'
	      }, {
	        name: 'Python',
	        value: 'python'
	      }, {
	        name: 'Ruby',
	        value: 'ruby'
	      }, {
	        name: 'SQL',
	        value: 'sql'
	      }
	    ];
	    this.el.addClass('code-popover').append(this._tpl);
	    this.selectEl = this.el.find('.select-lang');
	    ref = this.langs;
	    for (k = 0, len = ref.length; k < len; k++) {
	      lang = ref[k];
	      $option = $('<option/>', {
	        text: lang.name,
	        value: lang.value
	      }).appendTo(this.selectEl);
	    }
	    this.selectEl.on('change', (function(_this) {
	      return function(e) {
	        var selected;
	        _this.lang = _this.selectEl.val();
	        selected = _this.target.hasClass('selected');
	        _this.target.removeClass().removeAttr('data-lang');
	        if (_this.lang !== -1) {
	          _this.target.attr('data-lang', _this.lang);
	        }
	        if (selected) {
	          _this.target.addClass('selected');
	        }
	        return _this.editor.trigger('valuechanged');
	      };
	    })(this));
	    return this.editor.on('valuechanged', (function(_this) {
	      return function(e) {
	        if (_this.active) {
	          return _this.refresh();
	        }
	      };
	    })(this));
	  };

	  CodePopover.prototype.show = function() {
	    var args;
	    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
	    CodePopover.__super__.show.apply(this, args);
	    this.lang = this.target.attr('data-lang');
	    if (this.lang != null) {
	      return this.selectEl.val(this.lang);
	    } else {
	      return this.selectEl.val(-1);
	    }
	  };

	  return CodePopover;

	})(Popover);

	Simditor.Toolbar.addButton(CodeButton);

	LinkButton = (function(superClass) {
	  extend(LinkButton, superClass);

	  function LinkButton() {
	    return LinkButton.__super__.constructor.apply(this, arguments);
	  }

	  LinkButton.prototype.name = 'link';

	  LinkButton.prototype.icon = 'link';

	  LinkButton.prototype.htmlTag = 'a';

	  LinkButton.prototype.disableTag = 'pre';

	  LinkButton.prototype.render = function() {
	    var args;
	    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
	    LinkButton.__super__.render.apply(this, args);
	    return this.popover = new LinkPopover({
	      button: this
	    });
	  };

	  LinkButton.prototype._status = function() {
	    LinkButton.__super__._status.call(this);
	    if (this.active && !this.editor.selection.rangeAtEndOf(this.node)) {
	      return this.popover.show(this.node);
	    } else {
	      return this.popover.hide();
	    }
	  };

	  LinkButton.prototype.command = function() {
	    var $contents, $link, $newBlock, linkText, range, txtNode;
	    range = this.editor.selection.range();
	    if (this.active) {
	      txtNode = document.createTextNode(this.node.text());
	      this.node.replaceWith(txtNode);
	      range.selectNode(txtNode);
	    } else {
	      $contents = $(range.extractContents());
	      linkText = this.editor.formatter.clearHtml($contents.contents(), false);
	      $link = $('<a/>', {
	        href: 'http://www.example.com',
	        target: '_blank',
	        text: linkText || this._t('linkText')
	      });
	      if (this.editor.selection.blockNodes().length === 1) {
	        range.insertNode($link[0]);
	      } else {
	        $newBlock = $('<p/>').append($link);
	        range.insertNode($newBlock[0]);
	      }
	      range.selectNodeContents($link[0]);
	      this.popover.one('popovershow', (function(_this) {
	        return function() {
	          if (linkText) {
	            _this.popover.urlEl.focus();
	            return _this.popover.urlEl[0].select();
	          } else {
	            _this.popover.textEl.focus();
	            return _this.popover.textEl[0].select();
	          }
	        };
	      })(this));
	    }
	    this.editor.selection.range(range);
	    return this.editor.trigger('valuechanged');
	  };

	  return LinkButton;

	})(Button);

	LinkPopover = (function(superClass) {
	  extend(LinkPopover, superClass);

	  function LinkPopover() {
	    return LinkPopover.__super__.constructor.apply(this, arguments);
	  }

	  LinkPopover.prototype.render = function() {
	    var tpl;
	    tpl = "<div class=\"link-settings\">\n  <div class=\"settings-field\">\n    <label>" + (this._t('text')) + "</label>\n    <input class=\"link-text\" type=\"text\"/>\n    <a class=\"btn-unlink\" href=\"javascript:;\" title=\"" + (this._t('removeLink')) + "\"\n      tabindex=\"-1\">\n      <span class=\"simditor-icon simditor-icon-unlink\"></span>\n    </a>\n  </div>\n  <div class=\"settings-field\">\n    <label>" + (this._t('linkUrl')) + "</label>\n    <input class=\"link-url\" type=\"text\"/>\n  </div>\n</div>";
	    this.el.addClass('link-popover').append(tpl);
	    this.textEl = this.el.find('.link-text');
	    this.urlEl = this.el.find('.link-url');
	    this.unlinkEl = this.el.find('.btn-unlink');
	    this.textEl.on('keyup', (function(_this) {
	      return function(e) {
	        if (e.which === 13) {
	          return;
	        }
	        return _this.target.text(_this.textEl.val());
	      };
	    })(this));
	    this.urlEl.on('keyup', (function(_this) {
	      return function(e) {
	        var val;
	        if (e.which === 13) {
	          return;
	        }
	        val = _this.urlEl.val();
	        if (!(/https?:\/\/|^\//ig.test(val) || !val)) {
	          val = 'http://' + val;
	        }
	        return _this.target.attr('href', val);
	      };
	    })(this));
	    $([this.urlEl[0], this.textEl[0]]).on('keydown', (function(_this) {
	      return function(e) {
	        var range;
	        if (e.which === 13 || e.which === 27 || (!e.shiftKey && e.which === 9 && $(e.target).hasClass('link-url'))) {
	          e.preventDefault();
	          range = document.createRange();
	          _this.editor.selection.setRangeAfter(_this.target, range);
	          _this.hide();
	          return _this.editor.trigger('valuechanged');
	        }
	      };
	    })(this));
	    return this.unlinkEl.on('click', (function(_this) {
	      return function(e) {
	        var range, txtNode;
	        txtNode = document.createTextNode(_this.target.text());
	        _this.target.replaceWith(txtNode);
	        _this.hide();
	        range = document.createRange();
	        _this.editor.selection.setRangeAfter(txtNode, range);
	        return _this.editor.trigger('valuechanged');
	      };
	    })(this));
	  };

	  LinkPopover.prototype.show = function() {
	    var args;
	    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
	    LinkPopover.__super__.show.apply(this, args);
	    this.textEl.val(this.target.text());
	    return this.urlEl.val(this.target.attr('href'));
	  };

	  return LinkPopover;

	})(Popover);

	Simditor.Toolbar.addButton(LinkButton);

	ImageButton = (function(superClass) {
	  extend(ImageButton, superClass);

	  function ImageButton() {
	    return ImageButton.__super__.constructor.apply(this, arguments);
	  }

	  ImageButton.prototype.name = 'image';

	  ImageButton.prototype.icon = 'picture-o';

	  ImageButton.prototype.htmlTag = 'img';

	  ImageButton.prototype.disableTag = 'pre, table';

	  ImageButton.prototype.defaultImage = '';

	  ImageButton.prototype.needFocus = false;

	  ImageButton.prototype._init = function() {
	    var item, k, len, ref;
	    if (this.editor.opts.imageButton) {
	      if (Array.isArray(this.editor.opts.imageButton)) {
	        this.menu = [];
	        ref = this.editor.opts.imageButton;
	        for (k = 0, len = ref.length; k < len; k++) {
	          item = ref[k];
	          this.menu.push({
	            name: item + '-image',
	            text: this._t(item + 'Image')
	          });
	        }
	      } else {
	        this.menu = false;
	      }
	    } else {
	      if (this.editor.uploader != null) {
	        this.menu = [
	          {
	            name: 'upload-image',
	            text: this._t('uploadImage')
	          }, {
	            name: 'external-image',
	            text: this._t('externalImage')
	          }
	        ];
	      } else {
	        this.menu = false;
	      }
	    }
	    this.defaultImage = this.editor.opts.defaultImage;
	    this.editor.body.on('click', 'img:not([data-non-image])', (function(_this) {
	      return function(e) {
	        var $img, range;
	        $img = $(e.currentTarget);
	        range = document.createRange();
	        range.selectNode($img[0]);
	        _this.editor.selection.range(range);
	        if (!_this.editor.util.support.onselectionchange) {
	          _this.editor.trigger('selectionchanged');
	        }
	        return false;
	      };
	    })(this));
	    this.editor.body.on('mouseup', 'img:not([data-non-image])', function(e) {
	      return false;
	    });
	    this.editor.on('selectionchanged.image', (function(_this) {
	      return function() {
	        var $contents, $img, range;
	        range = _this.editor.selection.range();
	        if (range == null) {
	          return;
	        }
	        $contents = $(range.cloneContents()).contents();
	        if ($contents.length === 1 && $contents.is('img:not([data-non-image])')) {
	          $img = $(range.startContainer).contents().eq(range.startOffset);
	          return _this.popover.show($img);
	        } else {
	          return _this.popover.hide();
	        }
	      };
	    })(this));
	    this.editor.on('valuechanged.image', (function(_this) {
	      return function() {
	        var $masks;
	        $masks = _this.editor.wrapper.find('.simditor-image-loading');
	        if (!($masks.length > 0)) {
	          return;
	        }
	        return $masks.each(function(i, mask) {
	          var $img, $mask, file;
	          $mask = $(mask);
	          $img = $mask.data('img');
	          if (!($img && $img.parent().length > 0)) {
	            $mask.remove();
	            if ($img) {
	              file = $img.data('file');
	              if (file) {
	                _this.editor.uploader.cancel(file);
	                if (_this.editor.body.find('img.uploading').length < 1) {
	                  return _this.editor.uploader.trigger('uploadready', [file]);
	                }
	              }
	            }
	          }
	        });
	      };
	    })(this));
	    return ImageButton.__super__._init.call(this);
	  };

	  ImageButton.prototype.render = function() {
	    var args;
	    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
	    ImageButton.__super__.render.apply(this, args);
	    this.popover = new ImagePopover({
	      button: this
	    });
	    if (this.editor.opts.imageButton === 'upload') {
	      return this._initUploader(this.el);
	    }
	  };

	  ImageButton.prototype.renderMenu = function() {
	    ImageButton.__super__.renderMenu.call(this);
	    return this._initUploader();
	  };

	  ImageButton.prototype._initUploader = function($uploadItem) {
	    var $input, createInput, uploadProgress;
	    if ($uploadItem == null) {
	      $uploadItem = this.menuEl.find('.menu-item-upload-image');
	    }
	    if (this.editor.uploader == null) {
	      this.el.find('.btn-upload').remove();
	      return;
	    }
	    $input = null;
	    createInput = (function(_this) {
	      return function() {
	        if ($input) {
	          $input.remove();
	        }
	        return $input = $('<input/>', {
	          type: 'file',
	          title: _this._t('uploadImage'),
	          accept: 'image/*'
	        }).appendTo($uploadItem);
	      };
	    })(this);
	    createInput();
	    $uploadItem.on('click mousedown', 'input[type=file]', function(e) {
	      return e.stopPropagation();
	    });
	    $uploadItem.on('change', 'input[type=file]', (function(_this) {
	      return function(e) {
	        if (_this.editor.inputManager.focused) {
	          _this.editor.uploader.upload($input, {
	            inline: true
	          });
	          createInput();
	        } else {
	          _this.editor.one('focus', function(e) {
	            _this.editor.uploader.upload($input, {
	              inline: true
	            });
	            return createInput();
	          });
	          _this.editor.focus();
	        }
	        return _this.wrapper.removeClass('menu-on');
	      };
	    })(this));
	    this.editor.uploader.on('beforeupload', (function(_this) {
	      return function(e, file) {
	        var $img;
	        if (!file.inline) {
	          return;
	        }
	        if (file.img) {
	          $img = $(file.img);
	        } else {
	          $img = _this.createImage(file.name);
	          file.img = $img;
	        }
	        $img.addClass('uploading');
	        $img.data('file', file);
	        return _this.editor.uploader.readImageFile(file.obj, function(img) {
	          var src;
	          if (!$img.hasClass('uploading')) {
	            return;
	          }
	          src = img ? img.src : _this.defaultImage;
	          return _this.loadImage($img, src, function() {
	            if (_this.popover.active) {
	              _this.popover.refresh();
	              return _this.popover.srcEl.val(_this._t('uploading')).prop('disabled', true);
	            }
	          });
	        });
	      };
	    })(this));
	    uploadProgress = $.proxy(this.editor.util.throttle(function(e, file, loaded, total) {
	      var $img, $mask, percent;
	      if (!file.inline) {
	        return;
	      }
	      $mask = file.img.data('mask');
	      if (!$mask) {
	        return;
	      }
	      $img = $mask.data('img');
	      if (!($img.hasClass('uploading') && $img.parent().length > 0)) {
	        $mask.remove();
	        return;
	      }
	      percent = loaded / total;
	      percent = (percent * 100).toFixed(0);
	      if (percent > 99) {
	        percent = 99;
	      }
	      return $mask.find('.progress').height((100 - percent) + "%");
	    }, 500), this);
	    this.editor.uploader.on('uploadprogress', uploadProgress);
	    this.editor.uploader.on('uploadsuccess', (function(_this) {
	      return function(e, file, result) {
	        var $img, $mask, msg;
	        if (!file.inline) {
	          return;
	        }
	        $img = file.img;
	        if (!($img.hasClass('uploading') && $img.parent().length > 0)) {
	          return;
	        }
	        $img.removeData('file');
	        $img.removeClass('uploading').removeClass('loading');
	        $mask = $img.data('mask');
	        if ($mask) {
	          $mask.remove();
	        }
	        $img.removeData('mask');
	        if (typeof result !== 'object') {
	          try {
	            result = $.parseJSON(result);
	          } catch (_error) {
	            e = _error;
	            result = {
	              success: false
	            };
	          }
	        }
	        if (result.success === false) {
	          msg = result.msg || _this._t('uploadFailed');
	          alert(msg);
	          $img.attr('src', _this.defaultImage);
	        } else {
	          $img.attr('src', result.file_path);
	        }
	        if (_this.popover.active) {
	          _this.popover.srcEl.prop('disabled', false);
	          _this.popover.srcEl.val(result.file_path);
	        }
	        _this.editor.trigger('valuechanged');
	        if (_this.editor.body.find('img.uploading').length < 1) {
	          return _this.editor.uploader.trigger('uploadready', [file, result]);
	        }
	      };
	    })(this));
	    return this.editor.uploader.on('uploaderror', (function(_this) {
	      return function(e, file, xhr) {
	        var $img, $mask, msg, result;
	        if (!file.inline) {
	          return;
	        }
	        if (xhr.statusText === 'abort') {
	          return;
	        }
	        if (xhr.responseText) {
	          try {
	            result = $.parseJSON(xhr.responseText);
	            msg = result.msg;
	          } catch (_error) {
	            e = _error;
	            msg = _this._t('uploadError');
	          }
	          alert(msg);
	        }
	        $img = file.img;
	        if (!($img.hasClass('uploading') && $img.parent().length > 0)) {
	          return;
	        }
	        $img.removeData('file');
	        $img.removeClass('uploading').removeClass('loading');
	        $mask = $img.data('mask');
	        if ($mask) {
	          $mask.remove();
	        }
	        $img.removeData('mask');
	        $img.attr('src', _this.defaultImage);
	        if (_this.popover.active) {
	          _this.popover.srcEl.prop('disabled', false);
	          _this.popover.srcEl.val(_this.defaultImage);
	        }
	        _this.editor.trigger('valuechanged');
	        if (_this.editor.body.find('img.uploading').length < 1) {
	          return _this.editor.uploader.trigger('uploadready', [file, result]);
	        }
	      };
	    })(this));
	  };

	  ImageButton.prototype._status = function() {
	    return this._disableStatus();
	  };

	  ImageButton.prototype.loadImage = function($img, src, callback) {
	    var $mask, img, positionMask;
	    positionMask = (function(_this) {
	      return function() {
	        var imgOffset, wrapperOffset;
	        imgOffset = $img.offset();
	        wrapperOffset = _this.editor.wrapper.offset();
	        return $mask.css({
	          top: imgOffset.top - wrapperOffset.top,
	          left: imgOffset.left - wrapperOffset.left,
	          width: $img.width(),
	          height: $img.height()
	        }).show();
	      };
	    })(this);
	    $img.addClass('loading');
	    $mask = $img.data('mask');
	    if (!$mask) {
	      $mask = $('<div class="simditor-image-loading">\n  <div class="progress"></div>\n</div>').hide().appendTo(this.editor.wrapper);
	      positionMask();
	      $img.data('mask', $mask);
	      $mask.data('img', $img);
	    }
	    img = new Image();
	    img.onload = (function(_this) {
	      return function() {
	        var height, width;
	        if (!$img.hasClass('loading') && !$img.hasClass('uploading')) {
	          return;
	        }
	        width = img.width;
	        height = img.height;
	        $img.attr({
	          src: src,
	          width: width,
	          height: height,
	          'data-image-size': width + ',' + height
	        }).removeClass('loading');
	        if ($img.hasClass('uploading')) {
	          _this.editor.util.reflow(_this.editor.body);
	          positionMask();
	        } else {
	          $mask.remove();
	          $img.removeData('mask');
	        }
	        return callback(img);
	      };
	    })(this);
	    img.onerror = function() {
	      callback(false);
	      $mask.remove();
	      return $img.removeData('mask').removeClass('loading');
	    };
	    return img.src = src;
	  };

	  ImageButton.prototype.createImage = function(name) {
	    var $img, range;
	    if (name == null) {
	      name = 'Image';
	    }
	    if (!this.editor.inputManager.focused) {
	      this.editor.focus();
	    }
	    range = this.editor.selection.range();
	    range.deleteContents();
	    this.editor.selection.range(range);
	    $img = $('<img/>').attr('alt', name);
	    range.insertNode($img[0]);
	    this.editor.selection.setRangeAfter($img, range);
	    this.editor.trigger('valuechanged');
	    return $img;
	  };

	  ImageButton.prototype.command = function(src) {
	    var $img;
	    $img = this.createImage();
	    return this.loadImage($img, src || this.defaultImage, (function(_this) {
	      return function() {
	        _this.editor.trigger('valuechanged');
	        _this.editor.util.reflow($img);
	        $img.click();
	        return _this.popover.one('popovershow', function() {
	          _this.popover.srcEl.focus();
	          return _this.popover.srcEl[0].select();
	        });
	      };
	    })(this));
	  };

	  return ImageButton;

	})(Button);

	ImagePopover = (function(superClass) {
	  extend(ImagePopover, superClass);

	  function ImagePopover() {
	    return ImagePopover.__super__.constructor.apply(this, arguments);
	  }

	  ImagePopover.prototype.offset = {
	    top: 6,
	    left: -4
	  };

	  ImagePopover.prototype.render = function() {
	    var tpl;
	    tpl = "<div class=\"link-settings\">\n  <div class=\"settings-field\">\n    <label>" + (this._t('imageUrl')) + "</label>\n    <input class=\"image-src\" type=\"text\" tabindex=\"1\" />\n    <a class=\"btn-upload\" href=\"javascript:;\"\n      title=\"" + (this._t('uploadImage')) + "\" tabindex=\"-1\">\n      <span class=\"simditor-icon simditor-icon-upload\"></span>\n    </a>\n  </div>\n  <div class='settings-field'>\n    <label>" + (this._t('imageAlt')) + "</label>\n    <input class=\"image-alt\" id=\"image-alt\" type=\"text\" tabindex=\"1\" />\n  </div>\n  <div class=\"settings-field\">\n    <label>" + (this._t('imageSize')) + "</label>\n    <input class=\"image-size\" id=\"image-width\" type=\"text\" tabindex=\"2\" />\n    <span class=\"times\">×</span>\n    <input class=\"image-size\" id=\"image-height\" type=\"text\" tabindex=\"3\" />\n    <a class=\"btn-restore\" href=\"javascript:;\"\n      title=\"" + (this._t('restoreImageSize')) + "\" tabindex=\"-1\">\n      <span class=\"simditor-icon simditor-icon-undo\"></span>\n    </a>\n  </div>\n</div>";
	    this.el.addClass('image-popover').append(tpl);
	    this.srcEl = this.el.find('.image-src');
	    this.widthEl = this.el.find('#image-width');
	    this.heightEl = this.el.find('#image-height');
	    this.altEl = this.el.find('#image-alt');
	    this.srcEl.on('keydown', (function(_this) {
	      return function(e) {
	        var range;
	        if (!(e.which === 13 && !_this.target.hasClass('uploading'))) {
	          return;
	        }
	        e.preventDefault();
	        range = document.createRange();
	        _this.button.editor.selection.setRangeAfter(_this.target, range);
	        return _this.hide();
	      };
	    })(this));
	    this.srcEl.on('blur', (function(_this) {
	      return function(e) {
	        return _this._loadImage(_this.srcEl.val());
	      };
	    })(this));
	    this.el.find('.image-size').on('blur', (function(_this) {
	      return function(e) {
	        _this._resizeImg($(e.currentTarget));
	        return _this.el.data('popover').refresh();
	      };
	    })(this));
	    this.el.find('.image-size').on('keyup', (function(_this) {
	      return function(e) {
	        var inputEl;
	        inputEl = $(e.currentTarget);
	        if (!(e.which === 13 || e.which === 27 || e.which === 9)) {
	          return _this._resizeImg(inputEl, true);
	        }
	      };
	    })(this));
	    this.el.find('.image-size').on('keydown', (function(_this) {
	      return function(e) {
	        var $img, inputEl, range;
	        inputEl = $(e.currentTarget);
	        if (e.which === 13 || e.which === 27) {
	          e.preventDefault();
	          if (e.which === 13) {
	            _this._resizeImg(inputEl);
	          } else {
	            _this._restoreImg();
	          }
	          $img = _this.target;
	          _this.hide();
	          range = document.createRange();
	          return _this.button.editor.selection.setRangeAfter($img, range);
	        } else if (e.which === 9) {
	          return _this.el.data('popover').refresh();
	        }
	      };
	    })(this));
	    this.altEl.on('keydown', (function(_this) {
	      return function(e) {
	        var range;
	        if (e.which === 13) {
	          e.preventDefault();
	          range = document.createRange();
	          _this.button.editor.selection.setRangeAfter(_this.target, range);
	          return _this.hide();
	        }
	      };
	    })(this));
	    this.altEl.on('keyup', (function(_this) {
	      return function(e) {
	        if (e.which === 13 || e.which === 27 || e.which === 9) {
	          return;
	        }
	        _this.alt = _this.altEl.val();
	        return _this.target.attr('alt', _this.alt);
	      };
	    })(this));
	    this.el.find('.btn-restore').on('click', (function(_this) {
	      return function(e) {
	        _this._restoreImg();
	        return _this.el.data('popover').refresh();
	      };
	    })(this));
	    this.editor.on('valuechanged', (function(_this) {
	      return function(e) {
	        if (_this.active) {
	          return _this.refresh();
	        }
	      };
	    })(this));
	    return this._initUploader();
	  };

	  ImagePopover.prototype._initUploader = function() {
	    var $uploadBtn, createInput;
	    $uploadBtn = this.el.find('.btn-upload');
	    if (this.editor.uploader == null) {
	      $uploadBtn.remove();
	      return;
	    }
	    createInput = (function(_this) {
	      return function() {
	        if (_this.input) {
	          _this.input.remove();
	        }
	        return _this.input = $('<input/>', {
	          type: 'file',
	          title: _this._t('uploadImage'),
	          accept: 'image/*'
	        }).appendTo($uploadBtn);
	      };
	    })(this);
	    createInput();
	    this.el.on('click mousedown', 'input[type=file]', function(e) {
	      return e.stopPropagation();
	    });
	    return this.el.on('change', 'input[type=file]', (function(_this) {
	      return function(e) {
	        _this.editor.uploader.upload(_this.input, {
	          inline: true,
	          img: _this.target
	        });
	        return createInput();
	      };
	    })(this));
	  };

	  ImagePopover.prototype._resizeImg = function(inputEl, onlySetVal) {
	    var height, value, width;
	    if (onlySetVal == null) {
	      onlySetVal = false;
	    }
	    value = inputEl.val() * 1;
	    if (!(this.target && ($.isNumeric(value) || value < 0))) {
	      return;
	    }
	    if (inputEl.is(this.widthEl)) {
	      width = value;
	      height = this.height * value / this.width;
	      this.heightEl.val(height);
	    } else {
	      height = value;
	      width = this.width * value / this.height;
	      this.widthEl.val(width);
	    }
	    if (!onlySetVal) {
	      this.target.attr({
	        width: width,
	        height: height
	      });
	      return this.editor.trigger('valuechanged');
	    }
	  };

	  ImagePopover.prototype._restoreImg = function() {
	    var ref, size;
	    size = ((ref = this.target.data('image-size')) != null ? ref.split(",") : void 0) || [this.width, this.height];
	    this.target.attr({
	      width: size[0] * 1,
	      height: size[1] * 1
	    });
	    this.widthEl.val(size[0]);
	    this.heightEl.val(size[1]);
	    return this.editor.trigger('valuechanged');
	  };

	  ImagePopover.prototype._loadImage = function(src, callback) {
	    if (/^data:image/.test(src) && !this.editor.uploader) {
	      if (callback) {
	        callback(false);
	      }
	      return;
	    }
	    if (this.target.attr('src') === src) {
	      return;
	    }
	    return this.button.loadImage(this.target, src, (function(_this) {
	      return function(img) {
	        var blob;
	        if (!img) {
	          return;
	        }
	        if (_this.active) {
	          _this.width = img.width;
	          _this.height = img.height;
	          _this.widthEl.val(_this.width);
	          _this.heightEl.val(_this.height);
	        }
	        if (/^data:image/.test(src)) {
	          blob = _this.editor.util.dataURLtoBlob(src);
	          blob.name = "Base64 Image.png";
	          _this.editor.uploader.upload(blob, {
	            inline: true,
	            img: _this.target
	          });
	        } else {
	          _this.editor.trigger('valuechanged');
	        }
	        if (callback) {
	          return callback(img);
	        }
	      };
	    })(this));
	  };

	  ImagePopover.prototype.show = function() {
	    var $img, args;
	    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
	    ImagePopover.__super__.show.apply(this, args);
	    $img = this.target;
	    this.width = $img.width();
	    this.height = $img.height();
	    this.alt = $img.attr('alt');
	    if ($img.hasClass('uploading')) {
	      return this.srcEl.val(this._t('uploading')).prop('disabled', true);
	    } else {
	      this.srcEl.val($img.attr('src')).prop('disabled', false);
	      this.widthEl.val(this.width);
	      this.heightEl.val(this.height);
	      return this.altEl.val(this.alt);
	    }
	  };

	  return ImagePopover;

	})(Popover);

	Simditor.Toolbar.addButton(ImageButton);

	IndentButton = (function(superClass) {
	  extend(IndentButton, superClass);

	  function IndentButton() {
	    return IndentButton.__super__.constructor.apply(this, arguments);
	  }

	  IndentButton.prototype.name = 'indent';

	  IndentButton.prototype.icon = 'indent';

	  IndentButton.prototype._init = function() {
	    this.title = this._t(this.name) + ' (Tab)';
	    return IndentButton.__super__._init.call(this);
	  };

	  IndentButton.prototype._status = function() {};

	  IndentButton.prototype.command = function() {
	    return this.editor.indentation.indent();
	  };

	  return IndentButton;

	})(Button);

	Simditor.Toolbar.addButton(IndentButton);

	OutdentButton = (function(superClass) {
	  extend(OutdentButton, superClass);

	  function OutdentButton() {
	    return OutdentButton.__super__.constructor.apply(this, arguments);
	  }

	  OutdentButton.prototype.name = 'outdent';

	  OutdentButton.prototype.icon = 'outdent';

	  OutdentButton.prototype._init = function() {
	    this.title = this._t(this.name) + ' (Shift + Tab)';
	    return OutdentButton.__super__._init.call(this);
	  };

	  OutdentButton.prototype._status = function() {};

	  OutdentButton.prototype.command = function() {
	    return this.editor.indentation.indent(true);
	  };

	  return OutdentButton;

	})(Button);

	Simditor.Toolbar.addButton(OutdentButton);

	HrButton = (function(superClass) {
	  extend(HrButton, superClass);

	  function HrButton() {
	    return HrButton.__super__.constructor.apply(this, arguments);
	  }

	  HrButton.prototype.name = 'hr';

	  HrButton.prototype.icon = 'minus';

	  HrButton.prototype.htmlTag = 'hr';

	  HrButton.prototype._status = function() {};

	  HrButton.prototype.command = function() {
	    var $hr, $newBlock, $nextBlock, $rootBlock;
	    $rootBlock = this.editor.selection.rootNodes().first();
	    $nextBlock = $rootBlock.next();
	    if ($nextBlock.length > 0) {
	      this.editor.selection.save();
	    } else {
	      $newBlock = $('<p/>').append(this.editor.util.phBr);
	    }
	    $hr = $('<hr/>').insertAfter($rootBlock);
	    if ($newBlock) {
	      $newBlock.insertAfter($hr);
	      this.editor.selection.setRangeAtStartOf($newBlock);
	    } else {
	      this.editor.selection.restore();
	    }
	    return this.editor.trigger('valuechanged');
	  };

	  return HrButton;

	})(Button);

	Simditor.Toolbar.addButton(HrButton);

	TableButton = (function(superClass) {
	  extend(TableButton, superClass);

	  function TableButton() {
	    return TableButton.__super__.constructor.apply(this, arguments);
	  }

	  TableButton.prototype.name = 'table';

	  TableButton.prototype.icon = 'table';

	  TableButton.prototype.htmlTag = 'table';

	  TableButton.prototype.disableTag = 'pre, li, blockquote';

	  TableButton.prototype.menu = true;

	  TableButton.prototype._init = function() {
	    TableButton.__super__._init.call(this);
	    $.merge(this.editor.formatter._allowedTags, ['thead', 'th', 'tbody', 'tr', 'td', 'colgroup', 'col']);
	    $.extend(this.editor.formatter._allowedAttributes, {
	      td: ['rowspan', 'colspan'],
	      col: ['width']
	    });
	    $.extend(this.editor.formatter._allowedStyles, {
	      td: ['text-align'],
	      th: ['text-align']
	    });
	    this._initShortcuts();
	    this.editor.on('decorate', (function(_this) {
	      return function(e, $el) {
	        return $el.find('table').each(function(i, table) {
	          return _this.decorate($(table));
	        });
	      };
	    })(this));
	    this.editor.on('undecorate', (function(_this) {
	      return function(e, $el) {
	        return $el.find('table').each(function(i, table) {
	          return _this.undecorate($(table));
	        });
	      };
	    })(this));
	    this.editor.on('selectionchanged.table', (function(_this) {
	      return function(e) {
	        var $container, range;
	        _this.editor.body.find('.simditor-table td, .simditor-table th').removeClass('active');
	        range = _this.editor.selection.range();
	        if (!range) {
	          return;
	        }
	        $container = _this.editor.selection.containerNode();
	        if (range.collapsed && $container.is('.simditor-table')) {
	          if (_this.editor.selection.rangeAtStartOf($container)) {
	            $container = $container.find('th:first');
	          } else {
	            $container = $container.find('td:last');
	          }
	          _this.editor.selection.setRangeAtEndOf($container);
	        }
	        return $container.closest('td, th', _this.editor.body).addClass('active');
	      };
	    })(this));
	    this.editor.on('blur.table', (function(_this) {
	      return function(e) {
	        return _this.editor.body.find('.simditor-table td, .simditor-table th').removeClass('active');
	      };
	    })(this));
	    this.editor.inputManager.addKeystrokeHandler('38', 'td', (function(_this) {
	      return function(e, $node) {
	        _this._tdNav($node, 'up');
	        return true;
	      };
	    })(this));
	    this.editor.inputManager.addKeystrokeHandler('38', 'th', (function(_this) {
	      return function(e, $node) {
	        _this._tdNav($node, 'up');
	        return true;
	      };
	    })(this));
	    this.editor.inputManager.addKeystrokeHandler('40', 'td', (function(_this) {
	      return function(e, $node) {
	        _this._tdNav($node, 'down');
	        return true;
	      };
	    })(this));
	    return this.editor.inputManager.addKeystrokeHandler('40', 'th', (function(_this) {
	      return function(e, $node) {
	        _this._tdNav($node, 'down');
	        return true;
	      };
	    })(this));
	  };

	  TableButton.prototype._tdNav = function($td, direction) {
	    var $anotherTr, $tr, action, anotherTag, index, parentTag, ref;
	    if (direction == null) {
	      direction = 'up';
	    }
	    action = direction === 'up' ? 'prev' : 'next';
	    ref = direction === 'up' ? ['tbody', 'thead'] : ['thead', 'tbody'], parentTag = ref[0], anotherTag = ref[1];
	    $tr = $td.parent('tr');
	    $anotherTr = this["_" + action + "Row"]($tr);
	    if (!($anotherTr.length > 0)) {
	      return true;
	    }
	    index = $tr.find('td, th').index($td);
	    return this.editor.selection.setRangeAtEndOf($anotherTr.find('td, th').eq(index));
	  };

	  TableButton.prototype._nextRow = function($tr) {
	    var $nextTr;
	    $nextTr = $tr.next('tr');
	    if ($nextTr.length < 1 && $tr.parent('thead').length > 0) {
	      $nextTr = $tr.parent('thead').next('tbody').find('tr:first');
	    }
	    return $nextTr;
	  };

	  TableButton.prototype._prevRow = function($tr) {
	    var $prevTr;
	    $prevTr = $tr.prev('tr');
	    if ($prevTr.length < 1 && $tr.parent('tbody').length > 0) {
	      $prevTr = $tr.parent('tbody').prev('thead').find('tr');
	    }
	    return $prevTr;
	  };

	  TableButton.prototype.initResize = function($table) {
	    var $colgroup, $resizeHandle, $wrapper;
	    $wrapper = $table.parent('.simditor-table');
	    $colgroup = $table.find('colgroup');
	    if ($colgroup.length < 1) {
	      $colgroup = $('<colgroup/>').prependTo($table);
	      $table.find('thead tr th').each(function(i, td) {
	        var $col;
	        return $col = $('<col/>').appendTo($colgroup);
	      });
	      this.refreshTableWidth($table);
	    }
	    $resizeHandle = $('<div />', {
	      "class": 'simditor-resize-handle',
	      contenteditable: 'false'
	    }).appendTo($wrapper);
	    $wrapper.on('mousemove', 'td, th', function(e) {
	      var $col, $td, index, ref, ref1, x;
	      if ($wrapper.hasClass('resizing')) {
	        return;
	      }
	      $td = $(e.currentTarget);
	      x = e.pageX - $(e.currentTarget).offset().left;
	      if (x < 5 && $td.prev().length > 0) {
	        $td = $td.prev();
	      }
	      if ($td.next('td, th').length < 1) {
	        $resizeHandle.hide();
	        return;
	      }
	      if ((ref = $resizeHandle.data('td')) != null ? ref.is($td) : void 0) {
	        $resizeHandle.show();
	        return;
	      }
	      index = $td.parent().find('td, th').index($td);
	      $col = $colgroup.find('col').eq(index);
	      if ((ref1 = $resizeHandle.data('col')) != null ? ref1.is($col) : void 0) {
	        $resizeHandle.show();
	        return;
	      }
	      return $resizeHandle.css('left', $td.position().left + $td.outerWidth() - 5).data('td', $td).data('col', $col).show();
	    });
	    $wrapper.on('mouseleave', function(e) {
	      return $resizeHandle.hide();
	    });
	    return $wrapper.on('mousedown', '.simditor-resize-handle', function(e) {
	      var $handle, $leftCol, $leftTd, $rightCol, $rightTd, minWidth, startHandleLeft, startLeftWidth, startRightWidth, startX, tableWidth;
	      $handle = $(e.currentTarget);
	      $leftTd = $handle.data('td');
	      $leftCol = $handle.data('col');
	      $rightTd = $leftTd.next('td, th');
	      $rightCol = $leftCol.next('col');
	      startX = e.pageX;
	      startLeftWidth = $leftTd.outerWidth() * 1;
	      startRightWidth = $rightTd.outerWidth() * 1;
	      startHandleLeft = parseFloat($handle.css('left'));
	      tableWidth = $leftTd.closest('table').width();
	      minWidth = 50;
	      $(document).on('mousemove.simditor-resize-table', function(e) {
	        var deltaX, leftWidth, rightWidth;
	        deltaX = e.pageX - startX;
	        leftWidth = startLeftWidth + deltaX;
	        rightWidth = startRightWidth - deltaX;
	        if (leftWidth < minWidth) {
	          leftWidth = minWidth;
	          deltaX = minWidth - startLeftWidth;
	          rightWidth = startRightWidth - deltaX;
	        } else if (rightWidth < minWidth) {
	          rightWidth = minWidth;
	          deltaX = startRightWidth - minWidth;
	          leftWidth = startLeftWidth + deltaX;
	        }
	        $leftCol.attr('width', (leftWidth / tableWidth * 100) + '%');
	        $rightCol.attr('width', (rightWidth / tableWidth * 100) + '%');
	        return $handle.css('left', startHandleLeft + deltaX);
	      });
	      $(document).one('mouseup.simditor-resize-table', function(e) {
	        $(document).off('.simditor-resize-table');
	        return $wrapper.removeClass('resizing');
	      });
	      $wrapper.addClass('resizing');
	      return false;
	    });
	  };

	  TableButton.prototype._initShortcuts = function() {
	    this.editor.inputManager.addShortcut('ctrl+alt+up', (function(_this) {
	      return function(e) {
	        _this.editMenu.find('.menu-item[data-param=insertRowAbove]').click();
	        return false;
	      };
	    })(this));
	    this.editor.inputManager.addShortcut('ctrl+alt+down', (function(_this) {
	      return function(e) {
	        _this.editMenu.find('.menu-item[data-param=insertRowBelow]').click();
	        return false;
	      };
	    })(this));
	    this.editor.inputManager.addShortcut('ctrl+alt+left', (function(_this) {
	      return function(e) {
	        _this.editMenu.find('.menu-item[data-param=insertColLeft]').click();
	        return false;
	      };
	    })(this));
	    return this.editor.inputManager.addShortcut('ctrl+alt+right', (function(_this) {
	      return function(e) {
	        _this.editMenu.find('.menu-item[data-param=insertColRight]').click();
	        return false;
	      };
	    })(this));
	  };

	  TableButton.prototype.decorate = function($table) {
	    if ($table.parent('.simditor-table').length > 0) {
	      this.undecorate($table);
	    }
	    $table.wrap('<div class="simditor-table"></div>');
	    this.initResize($table);
	    return $table.parent();
	  };

	  TableButton.prototype.undecorate = function($table) {
	    if (!($table.parent('.simditor-table').length > 0)) {
	      return;
	    }
	    return $table.parent().replaceWith($table);
	  };

	  TableButton.prototype.renderMenu = function() {
	    var $table;
	    $("<div class=\"menu-create-table\">\n</div>\n<div class=\"menu-edit-table\">\n  <ul>\n    <li>\n      <a tabindex=\"-1\" unselectable=\"on\" class=\"menu-item\"\n        href=\"javascript:;\" data-param=\"deleteRow\">\n        <span>" + (this._t('deleteRow')) + "</span>\n      </a>\n    </li>\n    <li>\n      <a tabindex=\"-1\" unselectable=\"on\" class=\"menu-item\"\n        href=\"javascript:;\" data-param=\"insertRowAbove\">\n        <span>" + (this._t('insertRowAbove')) + " ( Ctrl + Alt + ↑ )</span>\n      </a>\n    </li>\n    <li>\n      <a tabindex=\"-1\" unselectable=\"on\" class=\"menu-item\"\n        href=\"javascript:;\" data-param=\"insertRowBelow\">\n        <span>" + (this._t('insertRowBelow')) + " ( Ctrl + Alt + ↓ )</span>\n      </a>\n    </li>\n    <li><span class=\"separator\"></span></li>\n    <li>\n      <a tabindex=\"-1\" unselectable=\"on\" class=\"menu-item\"\n        href=\"javascript:;\" data-param=\"deleteCol\">\n        <span>" + (this._t('deleteColumn')) + "</span>\n      </a>\n    </li>\n    <li>\n      <a tabindex=\"-1\" unselectable=\"on\" class=\"menu-item\"\n        href=\"javascript:;\" data-param=\"insertColLeft\">\n        <span>" + (this._t('insertColumnLeft')) + " ( Ctrl + Alt + ← )</span>\n      </a>\n    </li>\n    <li>\n      <a tabindex=\"-1\" unselectable=\"on\" class=\"menu-item\"\n        href=\"javascript:;\" data-param=\"insertColRight\">\n        <span>" + (this._t('insertColumnRight')) + " ( Ctrl + Alt + → )</span>\n      </a>\n    </li>\n    <li><span class=\"separator\"></span></li>\n    <li>\n      <a tabindex=\"-1\" unselectable=\"on\" class=\"menu-item\"\n        href=\"javascript:;\" data-param=\"deleteTable\">\n        <span>" + (this._t('deleteTable')) + "</span>\n      </a>\n    </li>\n  </ul>\n</div>").appendTo(this.menuWrapper);
	    this.createMenu = this.menuWrapper.find('.menu-create-table');
	    this.editMenu = this.menuWrapper.find('.menu-edit-table');
	    $table = this.createTable(6, 6).appendTo(this.createMenu);
	    this.createMenu.on('mouseenter', 'td, th', (function(_this) {
	      return function(e) {
	        var $td, $tr, $trs, num;
	        _this.createMenu.find('td, th').removeClass('selected');
	        $td = $(e.currentTarget);
	        $tr = $td.parent();
	        num = $tr.find('td, th').index($td) + 1;
	        $trs = $tr.prevAll('tr').addBack();
	        if ($tr.parent().is('tbody')) {
	          $trs = $trs.add($table.find('thead tr'));
	        }
	        return $trs.find("td:lt(" + num + "), th:lt(" + num + ")").addClass('selected');
	      };
	    })(this));
	    this.createMenu.on('mouseleave', function(e) {
	      return $(e.currentTarget).find('td, th').removeClass('selected');
	    });
	    return this.createMenu.on('mousedown', 'td, th', (function(_this) {
	      return function(e) {
	        var $closestBlock, $td, $tr, colNum, rowNum;
	        _this.wrapper.removeClass('menu-on');
	        if (!_this.editor.inputManager.focused) {
	          return;
	        }
	        $td = $(e.currentTarget);
	        $tr = $td.parent();
	        colNum = $tr.find('td').index($td) + 1;
	        rowNum = $tr.prevAll('tr').length + 1;
	        if ($tr.parent().is('tbody')) {
	          rowNum += 1;
	        }
	        $table = _this.createTable(rowNum, colNum, true);
	        $closestBlock = _this.editor.selection.blockNodes().last();
	        if (_this.editor.util.isEmptyNode($closestBlock)) {
	          $closestBlock.replaceWith($table);
	        } else {
	          $closestBlock.after($table);
	        }
	        _this.decorate($table);
	        _this.editor.selection.setRangeAtStartOf($table.find('th:first'));
	        _this.editor.trigger('valuechanged');
	        return false;
	      };
	    })(this));
	  };

	  TableButton.prototype.createTable = function(row, col, phBr) {
	    var $table, $tbody, $td, $thead, $tr, c, k, l, r, ref, ref1;
	    $table = $('<table/>');
	    $thead = $('<thead/>').appendTo($table);
	    $tbody = $('<tbody/>').appendTo($table);
	    for (r = k = 0, ref = row; 0 <= ref ? k < ref : k > ref; r = 0 <= ref ? ++k : --k) {
	      $tr = $('<tr/>');
	      $tr.appendTo(r === 0 ? $thead : $tbody);
	      for (c = l = 0, ref1 = col; 0 <= ref1 ? l < ref1 : l > ref1; c = 0 <= ref1 ? ++l : --l) {
	        $td = $(r === 0 ? '<th/>' : '<td/>').appendTo($tr);
	        if (phBr) {
	          $td.append(this.editor.util.phBr);
	        }
	      }
	    }
	    return $table;
	  };

	  TableButton.prototype.refreshTableWidth = function($table) {
	    var cols, tableWidth;
	    tableWidth = $table.width();
	    cols = $table.find('col');
	    return $table.find('thead tr th').each(function(i, td) {
	      var $col;
	      $col = cols.eq(i);
	      return $col.attr('width', ($(td).outerWidth() / tableWidth * 100) + '%');
	    });
	  };

	  TableButton.prototype.setActive = function(active) {
	    TableButton.__super__.setActive.call(this, active);
	    if (active) {
	      this.createMenu.hide();
	      return this.editMenu.show();
	    } else {
	      this.createMenu.show();
	      return this.editMenu.hide();
	    }
	  };

	  TableButton.prototype._changeCellTag = function($tr, tagName) {
	    return $tr.find('td, th').each(function(i, cell) {
	      var $cell;
	      $cell = $(cell);
	      return $cell.replaceWith("<" + tagName + ">" + ($cell.html()) + "</" + tagName + ">");
	    });
	  };

	  TableButton.prototype.deleteRow = function($td) {
	    var $newTr, $tr, index;
	    $tr = $td.parent('tr');
	    if ($tr.closest('table').find('tr').length < 1) {
	      return this.deleteTable($td);
	    } else {
	      $newTr = this._nextRow($tr);
	      if (!($newTr.length > 0)) {
	        $newTr = this._prevRow($tr);
	      }
	      index = $tr.find('td, th').index($td);
	      if ($tr.parent().is('thead')) {
	        $newTr.appendTo($tr.parent());
	        this._changeCellTag($newTr, 'th');
	      }
	      $tr.remove();
	      return this.editor.selection.setRangeAtEndOf($newTr.find('td, th').eq(index));
	    }
	  };

	  TableButton.prototype.insertRow = function($td, direction) {
	    var $newTr, $table, $tr, cellTag, colNum, i, index, k, ref;
	    if (direction == null) {
	      direction = 'after';
	    }
	    $tr = $td.parent('tr');
	    $table = $tr.closest('table');
	    colNum = 0;
	    $table.find('tr').each(function(i, tr) {
	      return colNum = Math.max(colNum, $(tr).find('td').length);
	    });
	    index = $tr.find('td, th').index($td);
	    $newTr = $('<tr/>');
	    cellTag = 'td';
	    if (direction === 'after' && $tr.parent().is('thead')) {
	      $tr.parent().next('tbody').prepend($newTr);
	    } else if (direction === 'before' && $tr.parent().is('thead')) {
	      $tr.before($newTr);
	      $tr.parent().next('tbody').prepend($tr);
	      this._changeCellTag($tr, 'td');
	      cellTag = 'th';
	    } else {
	      $tr[direction]($newTr);
	    }
	    for (i = k = 1, ref = colNum; 1 <= ref ? k <= ref : k >= ref; i = 1 <= ref ? ++k : --k) {
	      $("<" + cellTag + "/>").append(this.editor.util.phBr).appendTo($newTr);
	    }
	    return this.editor.selection.setRangeAtStartOf($newTr.find('td, th').eq(index));
	  };

	  TableButton.prototype.deleteCol = function($td) {
	    var $newTd, $table, $tr, index, noOtherCol, noOtherRow;
	    $tr = $td.parent('tr');
	    noOtherRow = $tr.closest('table').find('tr').length < 2;
	    noOtherCol = $td.siblings('td, th').length < 1;
	    if (noOtherRow && noOtherCol) {
	      return this.deleteTable($td);
	    } else {
	      index = $tr.find('td, th').index($td);
	      $newTd = $td.next('td, th');
	      if (!($newTd.length > 0)) {
	        $newTd = $tr.prev('td, th');
	      }
	      $table = $tr.closest('table');
	      $table.find('col').eq(index).remove();
	      $table.find('tr').each(function(i, tr) {
	        return $(tr).find('td, th').eq(index).remove();
	      });
	      this.refreshTableWidth($table);
	      return this.editor.selection.setRangeAtEndOf($newTd);
	    }
	  };

	  TableButton.prototype.insertCol = function($td, direction) {
	    var $col, $newCol, $newTd, $table, $tr, index, tableWidth, width;
	    if (direction == null) {
	      direction = 'after';
	    }
	    $tr = $td.parent('tr');
	    index = $tr.find('td, th').index($td);
	    $table = $td.closest('table');
	    $col = $table.find('col').eq(index);
	    $table.find('tr').each((function(_this) {
	      return function(i, tr) {
	        var $newTd, cellTag;
	        cellTag = $(tr).parent().is('thead') ? 'th' : 'td';
	        $newTd = $("<" + cellTag + "/>").append(_this.editor.util.phBr);
	        return $(tr).find('td, th').eq(index)[direction]($newTd);
	      };
	    })(this));
	    $newCol = $('<col/>');
	    $col[direction]($newCol);
	    tableWidth = $table.width();
	    width = Math.max(parseFloat($col.attr('width')) / 2, 50 / tableWidth * 100);
	    $col.attr('width', width + '%');
	    $newCol.attr('width', width + '%');
	    this.refreshTableWidth($table);
	    $newTd = direction === 'after' ? $td.next('td, th') : $td.prev('td, th');
	    return this.editor.selection.setRangeAtStartOf($newTd);
	  };

	  TableButton.prototype.deleteTable = function($td) {
	    var $block, $table;
	    $table = $td.closest('.simditor-table');
	    $block = $table.next('p');
	    $table.remove();
	    if ($block.length > 0) {
	      return this.editor.selection.setRangeAtStartOf($block);
	    }
	  };

	  TableButton.prototype.command = function(param) {
	    var $td;
	    $td = this.editor.selection.containerNode().closest('td, th');
	    if (!($td.length > 0)) {
	      return;
	    }
	    if (param === 'deleteRow') {
	      this.deleteRow($td);
	    } else if (param === 'insertRowAbove') {
	      this.insertRow($td, 'before');
	    } else if (param === 'insertRowBelow') {
	      this.insertRow($td);
	    } else if (param === 'deleteCol') {
	      this.deleteCol($td);
	    } else if (param === 'insertColLeft') {
	      this.insertCol($td, 'before');
	    } else if (param === 'insertColRight') {
	      this.insertCol($td);
	    } else if (param === 'deleteTable') {
	      this.deleteTable($td);
	    } else {
	      return;
	    }
	    return this.editor.trigger('valuechanged');
	  };

	  return TableButton;

	})(Button);

	Simditor.Toolbar.addButton(TableButton);

	StrikethroughButton = (function(superClass) {
	  extend(StrikethroughButton, superClass);

	  function StrikethroughButton() {
	    return StrikethroughButton.__super__.constructor.apply(this, arguments);
	  }

	  StrikethroughButton.prototype.name = 'strikethrough';

	  StrikethroughButton.prototype.icon = 'strikethrough';

	  StrikethroughButton.prototype.htmlTag = 'strike';

	  StrikethroughButton.prototype.disableTag = 'pre';

	  StrikethroughButton.prototype._activeStatus = function() {
	    var active;
	    active = document.queryCommandState('strikethrough') === true;
	    this.setActive(active);
	    return this.active;
	  };

	  StrikethroughButton.prototype.command = function() {
	    document.execCommand('strikethrough');
	    if (!this.editor.util.support.oninput) {
	      this.editor.trigger('valuechanged');
	    }
	    return $(document).trigger('selectionchange');
	  };

	  return StrikethroughButton;

	})(Button);

	Simditor.Toolbar.addButton(StrikethroughButton);

	AlignmentButton = (function(superClass) {
	  extend(AlignmentButton, superClass);

	  function AlignmentButton() {
	    return AlignmentButton.__super__.constructor.apply(this, arguments);
	  }

	  AlignmentButton.prototype.name = "alignment";

	  AlignmentButton.prototype.icon = 'align-left';

	  AlignmentButton.prototype.htmlTag = 'p, h1, h2, h3, h4, td, th';

	  AlignmentButton.prototype._init = function() {
	    this.menu = [
	      {
	        name: 'left',
	        text: this._t('alignLeft'),
	        icon: 'align-left',
	        param: 'left'
	      }, {
	        name: 'center',
	        text: this._t('alignCenter'),
	        icon: 'align-center',
	        param: 'center'
	      }, {
	        name: 'right',
	        text: this._t('alignRight'),
	        icon: 'align-right',
	        param: 'right'
	      }
	    ];
	    return AlignmentButton.__super__._init.call(this);
	  };

	  AlignmentButton.prototype.setActive = function(active, align) {
	    if (align == null) {
	      align = 'left';
	    }
	    if (align !== 'left' && align !== 'center' && align !== 'right') {
	      align = 'left';
	    }
	    if (align === 'left') {
	      AlignmentButton.__super__.setActive.call(this, false);
	    } else {
	      AlignmentButton.__super__.setActive.call(this, active);
	    }
	    this.el.removeClass('align-left align-center align-right');
	    if (active) {
	      this.el.addClass('align-' + align);
	    }
	    this.setIcon('align-' + align);
	    return this.menuEl.find('.menu-item').show().end().find('.menu-item-' + align).hide();
	  };

	  AlignmentButton.prototype._status = function() {
	    this.nodes = this.editor.selection.nodes().filter(this.htmlTag);
	    if (this.nodes.length < 1) {
	      this.setDisabled(true);
	      return this.setActive(false);
	    } else {
	      this.setDisabled(false);
	      return this.setActive(true, this.nodes.first().css('text-align'));
	    }
	  };

	  AlignmentButton.prototype.command = function(align) {
	    if (align !== 'left' && align !== 'center' && align !== 'right') {
	      throw new Error("simditor alignment button: invalid align " + align);
	    }
	    this.nodes.css({
	      'text-align': align === 'left' ? '' : align
	    });
	    return this.editor.trigger('valuechanged');
	  };

	  return AlignmentButton;

	})(Button);

	Simditor.Toolbar.addButton(AlignmentButton);

	return Simditor;

	}));


/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	 * jQuery JavaScript Library v2.1.4
	 * http://jquery.com/
	 *
	 * Includes Sizzle.js
	 * http://sizzlejs.com/
	 *
	 * Copyright 2005, 2014 jQuery Foundation, Inc. and other contributors
	 * Released under the MIT license
	 * http://jquery.org/license
	 *
	 * Date: 2015-04-28T16:01Z
	 */

	(function( global, factory ) {

		if ( typeof module === "object" && typeof module.exports === "object" ) {
			// For CommonJS and CommonJS-like environments where a proper `window`
			// is present, execute the factory and get jQuery.
			// For environments that do not have a `window` with a `document`
			// (such as Node.js), expose a factory as module.exports.
			// This accentuates the need for the creation of a real `window`.
			// e.g. var jQuery = require("jquery")(window);
			// See ticket #14549 for more info.
			module.exports = global.document ?
				factory( global, true ) :
				function( w ) {
					if ( !w.document ) {
						throw new Error( "jQuery requires a window with a document" );
					}
					return factory( w );
				};
		} else {
			factory( global );
		}

	// Pass this if window is not defined yet
	}(typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

	// Support: Firefox 18+
	// Can't be in strict mode, several libs including ASP.NET trace
	// the stack via arguments.caller.callee and Firefox dies if
	// you try to trace through "use strict" call chains. (#13335)
	//

	var arr = [];

	var slice = arr.slice;

	var concat = arr.concat;

	var push = arr.push;

	var indexOf = arr.indexOf;

	var class2type = {};

	var toString = class2type.toString;

	var hasOwn = class2type.hasOwnProperty;

	var support = {};



	var
		// Use the correct document accordingly with window argument (sandbox)
		document = window.document,

		version = "2.1.4",

		// Define a local copy of jQuery
		jQuery = function( selector, context ) {
			// The jQuery object is actually just the init constructor 'enhanced'
			// Need init if jQuery is called (just allow error to be thrown if not included)
			return new jQuery.fn.init( selector, context );
		},

		// Support: Android<4.1
		// Make sure we trim BOM and NBSP
		rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

		// Matches dashed string for camelizing
		rmsPrefix = /^-ms-/,
		rdashAlpha = /-([\da-z])/gi,

		// Used by jQuery.camelCase as callback to replace()
		fcamelCase = function( all, letter ) {
			return letter.toUpperCase();
		};

	jQuery.fn = jQuery.prototype = {
		// The current version of jQuery being used
		jquery: version,

		constructor: jQuery,

		// Start with an empty selector
		selector: "",

		// The default length of a jQuery object is 0
		length: 0,

		toArray: function() {
			return slice.call( this );
		},

		// Get the Nth element in the matched element set OR
		// Get the whole matched element set as a clean array
		get: function( num ) {
			return num != null ?

				// Return just the one element from the set
				( num < 0 ? this[ num + this.length ] : this[ num ] ) :

				// Return all the elements in a clean array
				slice.call( this );
		},

		// Take an array of elements and push it onto the stack
		// (returning the new matched element set)
		pushStack: function( elems ) {

			// Build a new jQuery matched element set
			var ret = jQuery.merge( this.constructor(), elems );

			// Add the old object onto the stack (as a reference)
			ret.prevObject = this;
			ret.context = this.context;

			// Return the newly-formed element set
			return ret;
		},

		// Execute a callback for every element in the matched set.
		// (You can seed the arguments with an array of args, but this is
		// only used internally.)
		each: function( callback, args ) {
			return jQuery.each( this, callback, args );
		},

		map: function( callback ) {
			return this.pushStack( jQuery.map(this, function( elem, i ) {
				return callback.call( elem, i, elem );
			}));
		},

		slice: function() {
			return this.pushStack( slice.apply( this, arguments ) );
		},

		first: function() {
			return this.eq( 0 );
		},

		last: function() {
			return this.eq( -1 );
		},

		eq: function( i ) {
			var len = this.length,
				j = +i + ( i < 0 ? len : 0 );
			return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
		},

		end: function() {
			return this.prevObject || this.constructor(null);
		},

		// For internal use only.
		// Behaves like an Array's method, not like a jQuery method.
		push: push,
		sort: arr.sort,
		splice: arr.splice
	};

	jQuery.extend = jQuery.fn.extend = function() {
		var options, name, src, copy, copyIsArray, clone,
			target = arguments[0] || {},
			i = 1,
			length = arguments.length,
			deep = false;

		// Handle a deep copy situation
		if ( typeof target === "boolean" ) {
			deep = target;

			// Skip the boolean and the target
			target = arguments[ i ] || {};
			i++;
		}

		// Handle case when target is a string or something (possible in deep copy)
		if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
			target = {};
		}

		// Extend jQuery itself if only one argument is passed
		if ( i === length ) {
			target = this;
			i--;
		}

		for ( ; i < length; i++ ) {
			// Only deal with non-null/undefined values
			if ( (options = arguments[ i ]) != null ) {
				// Extend the base object
				for ( name in options ) {
					src = target[ name ];
					copy = options[ name ];

					// Prevent never-ending loop
					if ( target === copy ) {
						continue;
					}

					// Recurse if we're merging plain objects or arrays
					if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
						if ( copyIsArray ) {
							copyIsArray = false;
							clone = src && jQuery.isArray(src) ? src : [];

						} else {
							clone = src && jQuery.isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						target[ name ] = jQuery.extend( deep, clone, copy );

					// Don't bring in undefined values
					} else if ( copy !== undefined ) {
						target[ name ] = copy;
					}
				}
			}
		}

		// Return the modified object
		return target;
	};

	jQuery.extend({
		// Unique for each copy of jQuery on the page
		expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

		// Assume jQuery is ready without the ready module
		isReady: true,

		error: function( msg ) {
			throw new Error( msg );
		},

		noop: function() {},

		isFunction: function( obj ) {
			return jQuery.type(obj) === "function";
		},

		isArray: Array.isArray,

		isWindow: function( obj ) {
			return obj != null && obj === obj.window;
		},

		isNumeric: function( obj ) {
			// parseFloat NaNs numeric-cast false positives (null|true|false|"")
			// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
			// subtraction forces infinities to NaN
			// adding 1 corrects loss of precision from parseFloat (#15100)
			return !jQuery.isArray( obj ) && (obj - parseFloat( obj ) + 1) >= 0;
		},

		isPlainObject: function( obj ) {
			// Not plain objects:
			// - Any object or value whose internal [[Class]] property is not "[object Object]"
			// - DOM nodes
			// - window
			if ( jQuery.type( obj ) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
				return false;
			}

			if ( obj.constructor &&
					!hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
				return false;
			}

			// If the function hasn't returned already, we're confident that
			// |obj| is a plain object, created by {} or constructed with new Object
			return true;
		},

		isEmptyObject: function( obj ) {
			var name;
			for ( name in obj ) {
				return false;
			}
			return true;
		},

		type: function( obj ) {
			if ( obj == null ) {
				return obj + "";
			}
			// Support: Android<4.0, iOS<6 (functionish RegExp)
			return typeof obj === "object" || typeof obj === "function" ?
				class2type[ toString.call(obj) ] || "object" :
				typeof obj;
		},

		// Evaluates a script in a global context
		globalEval: function( code ) {
			var script,
				indirect = eval;

			code = jQuery.trim( code );

			if ( code ) {
				// If the code includes a valid, prologue position
				// strict mode pragma, execute code by injecting a
				// script tag into the document.
				if ( code.indexOf("use strict") === 1 ) {
					script = document.createElement("script");
					script.text = code;
					document.head.appendChild( script ).parentNode.removeChild( script );
				} else {
				// Otherwise, avoid the DOM node creation, insertion
				// and removal by using an indirect global eval
					indirect( code );
				}
			}
		},

		// Convert dashed to camelCase; used by the css and data modules
		// Support: IE9-11+
		// Microsoft forgot to hump their vendor prefix (#9572)
		camelCase: function( string ) {
			return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
		},

		nodeName: function( elem, name ) {
			return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
		},

		// args is for internal usage only
		each: function( obj, callback, args ) {
			var value,
				i = 0,
				length = obj.length,
				isArray = isArraylike( obj );

			if ( args ) {
				if ( isArray ) {
					for ( ; i < length; i++ ) {
						value = callback.apply( obj[ i ], args );

						if ( value === false ) {
							break;
						}
					}
				} else {
					for ( i in obj ) {
						value = callback.apply( obj[ i ], args );

						if ( value === false ) {
							break;
						}
					}
				}

			// A special, fast, case for the most common use of each
			} else {
				if ( isArray ) {
					for ( ; i < length; i++ ) {
						value = callback.call( obj[ i ], i, obj[ i ] );

						if ( value === false ) {
							break;
						}
					}
				} else {
					for ( i in obj ) {
						value = callback.call( obj[ i ], i, obj[ i ] );

						if ( value === false ) {
							break;
						}
					}
				}
			}

			return obj;
		},

		// Support: Android<4.1
		trim: function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},

		// results is for internal usage only
		makeArray: function( arr, results ) {
			var ret = results || [];

			if ( arr != null ) {
				if ( isArraylike( Object(arr) ) ) {
					jQuery.merge( ret,
						typeof arr === "string" ?
						[ arr ] : arr
					);
				} else {
					push.call( ret, arr );
				}
			}

			return ret;
		},

		inArray: function( elem, arr, i ) {
			return arr == null ? -1 : indexOf.call( arr, elem, i );
		},

		merge: function( first, second ) {
			var len = +second.length,
				j = 0,
				i = first.length;

			for ( ; j < len; j++ ) {
				first[ i++ ] = second[ j ];
			}

			first.length = i;

			return first;
		},

		grep: function( elems, callback, invert ) {
			var callbackInverse,
				matches = [],
				i = 0,
				length = elems.length,
				callbackExpect = !invert;

			// Go through the array, only saving the items
			// that pass the validator function
			for ( ; i < length; i++ ) {
				callbackInverse = !callback( elems[ i ], i );
				if ( callbackInverse !== callbackExpect ) {
					matches.push( elems[ i ] );
				}
			}

			return matches;
		},

		// arg is for internal usage only
		map: function( elems, callback, arg ) {
			var value,
				i = 0,
				length = elems.length,
				isArray = isArraylike( elems ),
				ret = [];

			// Go through the array, translating each of the items to their new values
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback( elems[ i ], i, arg );

					if ( value != null ) {
						ret.push( value );
					}
				}

			// Go through every key on the object,
			} else {
				for ( i in elems ) {
					value = callback( elems[ i ], i, arg );

					if ( value != null ) {
						ret.push( value );
					}
				}
			}

			// Flatten any nested arrays
			return concat.apply( [], ret );
		},

		// A global GUID counter for objects
		guid: 1,

		// Bind a function to a context, optionally partially applying any
		// arguments.
		proxy: function( fn, context ) {
			var tmp, args, proxy;

			if ( typeof context === "string" ) {
				tmp = fn[ context ];
				context = fn;
				fn = tmp;
			}

			// Quick check to determine if target is callable, in the spec
			// this throws a TypeError, but we will just return undefined.
			if ( !jQuery.isFunction( fn ) ) {
				return undefined;
			}

			// Simulated bind
			args = slice.call( arguments, 2 );
			proxy = function() {
				return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
			};

			// Set the guid of unique handler to the same of original handler, so it can be removed
			proxy.guid = fn.guid = fn.guid || jQuery.guid++;

			return proxy;
		},

		now: Date.now,

		// jQuery.support is not used in Core but other projects attach their
		// properties to it so it needs to exist.
		support: support
	});

	// Populate the class2type map
	jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
		class2type[ "[object " + name + "]" ] = name.toLowerCase();
	});

	function isArraylike( obj ) {

		// Support: iOS 8.2 (not reproducible in simulator)
		// `in` check used to prevent JIT error (gh-2145)
		// hasOwn isn't used here due to false negatives
		// regarding Nodelist length in IE
		var length = "length" in obj && obj.length,
			type = jQuery.type( obj );

		if ( type === "function" || jQuery.isWindow( obj ) ) {
			return false;
		}

		if ( obj.nodeType === 1 && length ) {
			return true;
		}

		return type === "array" || length === 0 ||
			typeof length === "number" && length > 0 && ( length - 1 ) in obj;
	}
	var Sizzle =
	/*!
	 * Sizzle CSS Selector Engine v2.2.0-pre
	 * http://sizzlejs.com/
	 *
	 * Copyright 2008, 2014 jQuery Foundation, Inc. and other contributors
	 * Released under the MIT license
	 * http://jquery.org/license
	 *
	 * Date: 2014-12-16
	 */
	(function( window ) {

	var i,
		support,
		Expr,
		getText,
		isXML,
		tokenize,
		compile,
		select,
		outermostContext,
		sortInput,
		hasDuplicate,

		// Local document vars
		setDocument,
		document,
		docElem,
		documentIsHTML,
		rbuggyQSA,
		rbuggyMatches,
		matches,
		contains,

		// Instance-specific data
		expando = "sizzle" + 1 * new Date(),
		preferredDoc = window.document,
		dirruns = 0,
		done = 0,
		classCache = createCache(),
		tokenCache = createCache(),
		compilerCache = createCache(),
		sortOrder = function( a, b ) {
			if ( a === b ) {
				hasDuplicate = true;
			}
			return 0;
		},

		// General-purpose constants
		MAX_NEGATIVE = 1 << 31,

		// Instance methods
		hasOwn = ({}).hasOwnProperty,
		arr = [],
		pop = arr.pop,
		push_native = arr.push,
		push = arr.push,
		slice = arr.slice,
		// Use a stripped-down indexOf as it's faster than native
		// http://jsperf.com/thor-indexof-vs-for/5
		indexOf = function( list, elem ) {
			var i = 0,
				len = list.length;
			for ( ; i < len; i++ ) {
				if ( list[i] === elem ) {
					return i;
				}
			}
			return -1;
		},

		booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

		// Regular expressions

		// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
		whitespace = "[\\x20\\t\\r\\n\\f]",
		// http://www.w3.org/TR/css3-syntax/#characters
		characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

		// Loosely modeled on CSS identifier characters
		// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
		// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
		identifier = characterEncoding.replace( "w", "w#" ),

		// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
		attributes = "\\[" + whitespace + "*(" + characterEncoding + ")(?:" + whitespace +
			// Operator (capture 2)
			"*([*^$|!~]?=)" + whitespace +
			// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
			"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
			"*\\]",

		pseudos = ":(" + characterEncoding + ")(?:\\((" +
			// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
			// 1. quoted (capture 3; capture 4 or capture 5)
			"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
			// 2. simple (capture 6)
			"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
			// 3. anything else (capture 2)
			".*" +
			")\\)|)",

		// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
		rwhitespace = new RegExp( whitespace + "+", "g" ),
		rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

		rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
		rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

		rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

		rpseudo = new RegExp( pseudos ),
		ridentifier = new RegExp( "^" + identifier + "$" ),

		matchExpr = {
			"ID": new RegExp( "^#(" + characterEncoding + ")" ),
			"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
			"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
			"ATTR": new RegExp( "^" + attributes ),
			"PSEUDO": new RegExp( "^" + pseudos ),
			"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
				"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
				"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
			"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
			// For use in libraries implementing .is()
			// We use this for POS matching in `select`
			"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
				whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
		},

		rinputs = /^(?:input|select|textarea|button)$/i,
		rheader = /^h\d$/i,

		rnative = /^[^{]+\{\s*\[native \w/,

		// Easily-parseable/retrievable ID or TAG or CLASS selectors
		rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

		rsibling = /[+~]/,
		rescape = /'|\\/g,

		// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
		runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
		funescape = function( _, escaped, escapedWhitespace ) {
			var high = "0x" + escaped - 0x10000;
			// NaN means non-codepoint
			// Support: Firefox<24
			// Workaround erroneous numeric interpretation of +"0x"
			return high !== high || escapedWhitespace ?
				escaped :
				high < 0 ?
					// BMP codepoint
					String.fromCharCode( high + 0x10000 ) :
					// Supplemental Plane codepoint (surrogate pair)
					String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
		},

		// Used for iframes
		// See setDocument()
		// Removing the function wrapper causes a "Permission Denied"
		// error in IE
		unloadHandler = function() {
			setDocument();
		};

	// Optimize for push.apply( _, NodeList )
	try {
		push.apply(
			(arr = slice.call( preferredDoc.childNodes )),
			preferredDoc.childNodes
		);
		// Support: Android<4.0
		// Detect silently failing push.apply
		arr[ preferredDoc.childNodes.length ].nodeType;
	} catch ( e ) {
		push = { apply: arr.length ?

			// Leverage slice if possible
			function( target, els ) {
				push_native.apply( target, slice.call(els) );
			} :

			// Support: IE<9
			// Otherwise append directly
			function( target, els ) {
				var j = target.length,
					i = 0;
				// Can't trust NodeList.length
				while ( (target[j++] = els[i++]) ) {}
				target.length = j - 1;
			}
		};
	}

	function Sizzle( selector, context, results, seed ) {
		var match, elem, m, nodeType,
			// QSA vars
			i, groups, old, nid, newContext, newSelector;

		if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
			setDocument( context );
		}

		context = context || document;
		results = results || [];
		nodeType = context.nodeType;

		if ( typeof selector !== "string" || !selector ||
			nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

			return results;
		}

		if ( !seed && documentIsHTML ) {

			// Try to shortcut find operations when possible (e.g., not under DocumentFragment)
			if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {
				// Speed-up: Sizzle("#ID")
				if ( (m = match[1]) ) {
					if ( nodeType === 9 ) {
						elem = context.getElementById( m );
						// Check parentNode to catch when Blackberry 4.6 returns
						// nodes that are no longer in the document (jQuery #6963)
						if ( elem && elem.parentNode ) {
							// Handle the case where IE, Opera, and Webkit return items
							// by name instead of ID
							if ( elem.id === m ) {
								results.push( elem );
								return results;
							}
						} else {
							return results;
						}
					} else {
						// Context is not a document
						if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
							contains( context, elem ) && elem.id === m ) {
							results.push( elem );
							return results;
						}
					}

				// Speed-up: Sizzle("TAG")
				} else if ( match[2] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Speed-up: Sizzle(".CLASS")
				} else if ( (m = match[3]) && support.getElementsByClassName ) {
					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// QSA path
			if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
				nid = old = expando;
				newContext = context;
				newSelector = nodeType !== 1 && selector;

				// qSA works strangely on Element-rooted queries
				// We can work around this by specifying an extra ID on the root
				// and working up from there (Thanks to Andrew Dupont for the technique)
				// IE 8 doesn't work on object elements
				if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
					groups = tokenize( selector );

					if ( (old = context.getAttribute("id")) ) {
						nid = old.replace( rescape, "\\$&" );
					} else {
						context.setAttribute( "id", nid );
					}
					nid = "[id='" + nid + "'] ";

					i = groups.length;
					while ( i-- ) {
						groups[i] = nid + toSelector( groups[i] );
					}
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) || context;
					newSelector = groups.join(",");
				}

				if ( newSelector ) {
					try {
						push.apply( results,
							newContext.querySelectorAll( newSelector )
						);
						return results;
					} catch(qsaError) {
					} finally {
						if ( !old ) {
							context.removeAttribute("id");
						}
					}
				}
			}
		}

		// All others
		return select( selector.replace( rtrim, "$1" ), context, results, seed );
	}

	/**
	 * Create key-value caches of limited size
	 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
	 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
	 *	deleting the oldest entry
	 */
	function createCache() {
		var keys = [];

		function cache( key, value ) {
			// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
			if ( keys.push( key + " " ) > Expr.cacheLength ) {
				// Only keep the most recent entries
				delete cache[ keys.shift() ];
			}
			return (cache[ key + " " ] = value);
		}
		return cache;
	}

	/**
	 * Mark a function for special use by Sizzle
	 * @param {Function} fn The function to mark
	 */
	function markFunction( fn ) {
		fn[ expando ] = true;
		return fn;
	}

	/**
	 * Support testing using an element
	 * @param {Function} fn Passed the created div and expects a boolean result
	 */
	function assert( fn ) {
		var div = document.createElement("div");

		try {
			return !!fn( div );
		} catch (e) {
			return false;
		} finally {
			// Remove from its parent by default
			if ( div.parentNode ) {
				div.parentNode.removeChild( div );
			}
			// release memory in IE
			div = null;
		}
	}

	/**
	 * Adds the same handler for all of the specified attrs
	 * @param {String} attrs Pipe-separated list of attributes
	 * @param {Function} handler The method that will be applied
	 */
	function addHandle( attrs, handler ) {
		var arr = attrs.split("|"),
			i = attrs.length;

		while ( i-- ) {
			Expr.attrHandle[ arr[i] ] = handler;
		}
	}

	/**
	 * Checks document order of two siblings
	 * @param {Element} a
	 * @param {Element} b
	 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
	 */
	function siblingCheck( a, b ) {
		var cur = b && a,
			diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
				( ~b.sourceIndex || MAX_NEGATIVE ) -
				( ~a.sourceIndex || MAX_NEGATIVE );

		// Use IE sourceIndex if available on both nodes
		if ( diff ) {
			return diff;
		}

		// Check if b follows a
		if ( cur ) {
			while ( (cur = cur.nextSibling) ) {
				if ( cur === b ) {
					return -1;
				}
			}
		}

		return a ? 1 : -1;
	}

	/**
	 * Returns a function to use in pseudos for input types
	 * @param {String} type
	 */
	function createInputPseudo( type ) {
		return function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === type;
		};
	}

	/**
	 * Returns a function to use in pseudos for buttons
	 * @param {String} type
	 */
	function createButtonPseudo( type ) {
		return function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && elem.type === type;
		};
	}

	/**
	 * Returns a function to use in pseudos for positionals
	 * @param {Function} fn
	 */
	function createPositionalPseudo( fn ) {
		return markFunction(function( argument ) {
			argument = +argument;
			return markFunction(function( seed, matches ) {
				var j,
					matchIndexes = fn( [], seed.length, argument ),
					i = matchIndexes.length;

				// Match elements found at the specified indexes
				while ( i-- ) {
					if ( seed[ (j = matchIndexes[i]) ] ) {
						seed[j] = !(matches[j] = seed[j]);
					}
				}
			});
		});
	}

	/**
	 * Checks a node for validity as a Sizzle context
	 * @param {Element|Object=} context
	 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
	 */
	function testContext( context ) {
		return context && typeof context.getElementsByTagName !== "undefined" && context;
	}

	// Expose support vars for convenience
	support = Sizzle.support = {};

	/**
	 * Detects XML nodes
	 * @param {Element|Object} elem An element or a document
	 * @returns {Boolean} True iff elem is a non-HTML XML node
	 */
	isXML = Sizzle.isXML = function( elem ) {
		// documentElement is verified for cases where it doesn't yet exist
		// (such as loading iframes in IE - #4833)
		var documentElement = elem && (elem.ownerDocument || elem).documentElement;
		return documentElement ? documentElement.nodeName !== "HTML" : false;
	};

	/**
	 * Sets document-related variables once based on the current document
	 * @param {Element|Object} [doc] An element or document object to use to set the document
	 * @returns {Object} Returns the current document
	 */
	setDocument = Sizzle.setDocument = function( node ) {
		var hasCompare, parent,
			doc = node ? node.ownerDocument || node : preferredDoc;

		// If no document and documentElement is available, return
		if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
			return document;
		}

		// Set our document
		document = doc;
		docElem = doc.documentElement;
		parent = doc.defaultView;

		// Support: IE>8
		// If iframe document is assigned to "document" variable and if iframe has been reloaded,
		// IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
		// IE6-8 do not support the defaultView property so parent will be undefined
		if ( parent && parent !== parent.top ) {
			// IE11 does not have attachEvent, so all must suffer
			if ( parent.addEventListener ) {
				parent.addEventListener( "unload", unloadHandler, false );
			} else if ( parent.attachEvent ) {
				parent.attachEvent( "onunload", unloadHandler );
			}
		}

		/* Support tests
		---------------------------------------------------------------------- */
		documentIsHTML = !isXML( doc );

		/* Attributes
		---------------------------------------------------------------------- */

		// Support: IE<8
		// Verify that getAttribute really returns attributes and not properties
		// (excepting IE8 booleans)
		support.attributes = assert(function( div ) {
			div.className = "i";
			return !div.getAttribute("className");
		});

		/* getElement(s)By*
		---------------------------------------------------------------------- */

		// Check if getElementsByTagName("*") returns only elements
		support.getElementsByTagName = assert(function( div ) {
			div.appendChild( doc.createComment("") );
			return !div.getElementsByTagName("*").length;
		});

		// Support: IE<9
		support.getElementsByClassName = rnative.test( doc.getElementsByClassName );

		// Support: IE<10
		// Check if getElementById returns elements by name
		// The broken getElementById methods don't pick up programatically-set names,
		// so use a roundabout getElementsByName test
		support.getById = assert(function( div ) {
			docElem.appendChild( div ).id = expando;
			return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
		});

		// ID find and filter
		if ( support.getById ) {
			Expr.find["ID"] = function( id, context ) {
				if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
					var m = context.getElementById( id );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					return m && m.parentNode ? [ m ] : [];
				}
			};
			Expr.filter["ID"] = function( id ) {
				var attrId = id.replace( runescape, funescape );
				return function( elem ) {
					return elem.getAttribute("id") === attrId;
				};
			};
		} else {
			// Support: IE6/7
			// getElementById is not reliable as a find shortcut
			delete Expr.find["ID"];

			Expr.filter["ID"] =  function( id ) {
				var attrId = id.replace( runescape, funescape );
				return function( elem ) {
					var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");
					return node && node.value === attrId;
				};
			};
		}

		// Tag
		Expr.find["TAG"] = support.getElementsByTagName ?
			function( tag, context ) {
				if ( typeof context.getElementsByTagName !== "undefined" ) {
					return context.getElementsByTagName( tag );

				// DocumentFragment nodes don't have gEBTN
				} else if ( support.qsa ) {
					return context.querySelectorAll( tag );
				}
			} :

			function( tag, context ) {
				var elem,
					tmp = [],
					i = 0,
					// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
					results = context.getElementsByTagName( tag );

				// Filter out possible comments
				if ( tag === "*" ) {
					while ( (elem = results[i++]) ) {
						if ( elem.nodeType === 1 ) {
							tmp.push( elem );
						}
					}

					return tmp;
				}
				return results;
			};

		// Class
		Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
			if ( documentIsHTML ) {
				return context.getElementsByClassName( className );
			}
		};

		/* QSA/matchesSelector
		---------------------------------------------------------------------- */

		// QSA and matchesSelector support

		// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
		rbuggyMatches = [];

		// qSa(:focus) reports false when true (Chrome 21)
		// We allow this because of a bug in IE8/9 that throws an error
		// whenever `document.activeElement` is accessed on an iframe
		// So, we allow :focus to pass through QSA all the time to avoid the IE error
		// See http://bugs.jquery.com/ticket/13378
		rbuggyQSA = [];

		if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
			// Build QSA regex
			// Regex strategy adopted from Diego Perini
			assert(function( div ) {
				// Select is set to empty string on purpose
				// This is to test IE's treatment of not explicitly
				// setting a boolean content attribute,
				// since its presence should be enough
				// http://bugs.jquery.com/ticket/12359
				docElem.appendChild( div ).innerHTML = "<a id='" + expando + "'></a>" +
					"<select id='" + expando + "-\f]' msallowcapture=''>" +
					"<option selected=''></option></select>";

				// Support: IE8, Opera 11-12.16
				// Nothing should be selected when empty strings follow ^= or $= or *=
				// The test attribute must be unknown in Opera but "safe" for WinRT
				// http://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
				if ( div.querySelectorAll("[msallowcapture^='']").length ) {
					rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
				}

				// Support: IE8
				// Boolean attributes and "value" are not treated correctly
				if ( !div.querySelectorAll("[selected]").length ) {
					rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
				}

				// Support: Chrome<29, Android<4.2+, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.7+
				if ( !div.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
					rbuggyQSA.push("~=");
				}

				// Webkit/Opera - :checked should return selected option elements
				// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
				// IE8 throws error here and will not see later tests
				if ( !div.querySelectorAll(":checked").length ) {
					rbuggyQSA.push(":checked");
				}

				// Support: Safari 8+, iOS 8+
				// https://bugs.webkit.org/show_bug.cgi?id=136851
				// In-page `selector#id sibing-combinator selector` fails
				if ( !div.querySelectorAll( "a#" + expando + "+*" ).length ) {
					rbuggyQSA.push(".#.+[+~]");
				}
			});

			assert(function( div ) {
				// Support: Windows 8 Native Apps
				// The type and name attributes are restricted during .innerHTML assignment
				var input = doc.createElement("input");
				input.setAttribute( "type", "hidden" );
				div.appendChild( input ).setAttribute( "name", "D" );

				// Support: IE8
				// Enforce case-sensitivity of name attribute
				if ( div.querySelectorAll("[name=d]").length ) {
					rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
				}

				// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
				// IE8 throws error here and will not see later tests
				if ( !div.querySelectorAll(":enabled").length ) {
					rbuggyQSA.push( ":enabled", ":disabled" );
				}

				// Opera 10-11 does not throw on post-comma invalid pseudos
				div.querySelectorAll("*,:x");
				rbuggyQSA.push(",.*:");
			});
		}

		if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
			docElem.webkitMatchesSelector ||
			docElem.mozMatchesSelector ||
			docElem.oMatchesSelector ||
			docElem.msMatchesSelector) )) ) {

			assert(function( div ) {
				// Check to see if it's possible to do matchesSelector
				// on a disconnected node (IE 9)
				support.disconnectedMatch = matches.call( div, "div" );

				// This should fail with an exception
				// Gecko does not error, returns false instead
				matches.call( div, "[s!='']:x" );
				rbuggyMatches.push( "!=", pseudos );
			});
		}

		rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
		rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

		/* Contains
		---------------------------------------------------------------------- */
		hasCompare = rnative.test( docElem.compareDocumentPosition );

		// Element contains another
		// Purposefully does not implement inclusive descendent
		// As in, an element does not contain itself
		contains = hasCompare || rnative.test( docElem.contains ) ?
			function( a, b ) {
				var adown = a.nodeType === 9 ? a.documentElement : a,
					bup = b && b.parentNode;
				return a === bup || !!( bup && bup.nodeType === 1 && (
					adown.contains ?
						adown.contains( bup ) :
						a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
				));
			} :
			function( a, b ) {
				if ( b ) {
					while ( (b = b.parentNode) ) {
						if ( b === a ) {
							return true;
						}
					}
				}
				return false;
			};

		/* Sorting
		---------------------------------------------------------------------- */

		// Document order sorting
		sortOrder = hasCompare ?
		function( a, b ) {

			// Flag for duplicate removal
			if ( a === b ) {
				hasDuplicate = true;
				return 0;
			}

			// Sort on method existence if only one input has compareDocumentPosition
			var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
			if ( compare ) {
				return compare;
			}

			// Calculate position if both inputs belong to the same document
			compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
				a.compareDocumentPosition( b ) :

				// Otherwise we know they are disconnected
				1;

			// Disconnected nodes
			if ( compare & 1 ||
				(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

				// Choose the first element that is related to our preferred document
				if ( a === doc || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
					return -1;
				}
				if ( b === doc || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
					return 1;
				}

				// Maintain original order
				return sortInput ?
					( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
					0;
			}

			return compare & 4 ? -1 : 1;
		} :
		function( a, b ) {
			// Exit early if the nodes are identical
			if ( a === b ) {
				hasDuplicate = true;
				return 0;
			}

			var cur,
				i = 0,
				aup = a.parentNode,
				bup = b.parentNode,
				ap = [ a ],
				bp = [ b ];

			// Parentless nodes are either documents or disconnected
			if ( !aup || !bup ) {
				return a === doc ? -1 :
					b === doc ? 1 :
					aup ? -1 :
					bup ? 1 :
					sortInput ?
					( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
					0;

			// If the nodes are siblings, we can do a quick check
			} else if ( aup === bup ) {
				return siblingCheck( a, b );
			}

			// Otherwise we need full lists of their ancestors for comparison
			cur = a;
			while ( (cur = cur.parentNode) ) {
				ap.unshift( cur );
			}
			cur = b;
			while ( (cur = cur.parentNode) ) {
				bp.unshift( cur );
			}

			// Walk down the tree looking for a discrepancy
			while ( ap[i] === bp[i] ) {
				i++;
			}

			return i ?
				// Do a sibling check if the nodes have a common ancestor
				siblingCheck( ap[i], bp[i] ) :

				// Otherwise nodes in our document sort first
				ap[i] === preferredDoc ? -1 :
				bp[i] === preferredDoc ? 1 :
				0;
		};

		return doc;
	};

	Sizzle.matches = function( expr, elements ) {
		return Sizzle( expr, null, null, elements );
	};

	Sizzle.matchesSelector = function( elem, expr ) {
		// Set document vars if needed
		if ( ( elem.ownerDocument || elem ) !== document ) {
			setDocument( elem );
		}

		// Make sure that attribute selectors are quoted
		expr = expr.replace( rattributeQuotes, "='$1']" );

		if ( support.matchesSelector && documentIsHTML &&
			( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
			( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

			try {
				var ret = matches.call( elem, expr );

				// IE 9's matchesSelector returns false on disconnected nodes
				if ( ret || support.disconnectedMatch ||
						// As well, disconnected nodes are said to be in a document
						// fragment in IE 9
						elem.document && elem.document.nodeType !== 11 ) {
					return ret;
				}
			} catch (e) {}
		}

		return Sizzle( expr, document, null, [ elem ] ).length > 0;
	};

	Sizzle.contains = function( context, elem ) {
		// Set document vars if needed
		if ( ( context.ownerDocument || context ) !== document ) {
			setDocument( context );
		}
		return contains( context, elem );
	};

	Sizzle.attr = function( elem, name ) {
		// Set document vars if needed
		if ( ( elem.ownerDocument || elem ) !== document ) {
			setDocument( elem );
		}

		var fn = Expr.attrHandle[ name.toLowerCase() ],
			// Don't get fooled by Object.prototype properties (jQuery #13807)
			val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
				fn( elem, name, !documentIsHTML ) :
				undefined;

		return val !== undefined ?
			val :
			support.attributes || !documentIsHTML ?
				elem.getAttribute( name ) :
				(val = elem.getAttributeNode(name)) && val.specified ?
					val.value :
					null;
	};

	Sizzle.error = function( msg ) {
		throw new Error( "Syntax error, unrecognized expression: " + msg );
	};

	/**
	 * Document sorting and removing duplicates
	 * @param {ArrayLike} results
	 */
	Sizzle.uniqueSort = function( results ) {
		var elem,
			duplicates = [],
			j = 0,
			i = 0;

		// Unless we *know* we can detect duplicates, assume their presence
		hasDuplicate = !support.detectDuplicates;
		sortInput = !support.sortStable && results.slice( 0 );
		results.sort( sortOrder );

		if ( hasDuplicate ) {
			while ( (elem = results[i++]) ) {
				if ( elem === results[ i ] ) {
					j = duplicates.push( i );
				}
			}
			while ( j-- ) {
				results.splice( duplicates[ j ], 1 );
			}
		}

		// Clear input after sorting to release objects
		// See https://github.com/jquery/sizzle/pull/225
		sortInput = null;

		return results;
	};

	/**
	 * Utility function for retrieving the text value of an array of DOM nodes
	 * @param {Array|Element} elem
	 */
	getText = Sizzle.getText = function( elem ) {
		var node,
			ret = "",
			i = 0,
			nodeType = elem.nodeType;

		if ( !nodeType ) {
			// If no nodeType, this is expected to be an array
			while ( (node = elem[i++]) ) {
				// Do not traverse comment nodes
				ret += getText( node );
			}
		} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
			// Use textContent for elements
			// innerText usage removed for consistency of new lines (jQuery #11153)
			if ( typeof elem.textContent === "string" ) {
				return elem.textContent;
			} else {
				// Traverse its children
				for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
					ret += getText( elem );
				}
			}
		} else if ( nodeType === 3 || nodeType === 4 ) {
			return elem.nodeValue;
		}
		// Do not include comment or processing instruction nodes

		return ret;
	};

	Expr = Sizzle.selectors = {

		// Can be adjusted by the user
		cacheLength: 50,

		createPseudo: markFunction,

		match: matchExpr,

		attrHandle: {},

		find: {},

		relative: {
			">": { dir: "parentNode", first: true },
			" ": { dir: "parentNode" },
			"+": { dir: "previousSibling", first: true },
			"~": { dir: "previousSibling" }
		},

		preFilter: {
			"ATTR": function( match ) {
				match[1] = match[1].replace( runescape, funescape );

				// Move the given value to match[3] whether quoted or unquoted
				match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

				if ( match[2] === "~=" ) {
					match[3] = " " + match[3] + " ";
				}

				return match.slice( 0, 4 );
			},

			"CHILD": function( match ) {
				/* matches from matchExpr["CHILD"]
					1 type (only|nth|...)
					2 what (child|of-type)
					3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
					4 xn-component of xn+y argument ([+-]?\d*n|)
					5 sign of xn-component
					6 x of xn-component
					7 sign of y-component
					8 y of y-component
				*/
				match[1] = match[1].toLowerCase();

				if ( match[1].slice( 0, 3 ) === "nth" ) {
					// nth-* requires argument
					if ( !match[3] ) {
						Sizzle.error( match[0] );
					}

					// numeric x and y parameters for Expr.filter.CHILD
					// remember that false/true cast respectively to 0/1
					match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
					match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

				// other types prohibit arguments
				} else if ( match[3] ) {
					Sizzle.error( match[0] );
				}

				return match;
			},

			"PSEUDO": function( match ) {
				var excess,
					unquoted = !match[6] && match[2];

				if ( matchExpr["CHILD"].test( match[0] ) ) {
					return null;
				}

				// Accept quoted arguments as-is
				if ( match[3] ) {
					match[2] = match[4] || match[5] || "";

				// Strip excess characters from unquoted arguments
				} else if ( unquoted && rpseudo.test( unquoted ) &&
					// Get excess from tokenize (recursively)
					(excess = tokenize( unquoted, true )) &&
					// advance to the next closing parenthesis
					(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

					// excess is a negative index
					match[0] = match[0].slice( 0, excess );
					match[2] = unquoted.slice( 0, excess );
				}

				// Return only captures needed by the pseudo filter method (type and argument)
				return match.slice( 0, 3 );
			}
		},

		filter: {

			"TAG": function( nodeNameSelector ) {
				var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
				return nodeNameSelector === "*" ?
					function() { return true; } :
					function( elem ) {
						return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
					};
			},

			"CLASS": function( className ) {
				var pattern = classCache[ className + " " ];

				return pattern ||
					(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
					classCache( className, function( elem ) {
						return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
					});
			},

			"ATTR": function( name, operator, check ) {
				return function( elem ) {
					var result = Sizzle.attr( elem, name );

					if ( result == null ) {
						return operator === "!=";
					}
					if ( !operator ) {
						return true;
					}

					result += "";

					return operator === "=" ? result === check :
						operator === "!=" ? result !== check :
						operator === "^=" ? check && result.indexOf( check ) === 0 :
						operator === "*=" ? check && result.indexOf( check ) > -1 :
						operator === "$=" ? check && result.slice( -check.length ) === check :
						operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
						operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
						false;
				};
			},

			"CHILD": function( type, what, argument, first, last ) {
				var simple = type.slice( 0, 3 ) !== "nth",
					forward = type.slice( -4 ) !== "last",
					ofType = what === "of-type";

				return first === 1 && last === 0 ?

					// Shortcut for :nth-*(n)
					function( elem ) {
						return !!elem.parentNode;
					} :

					function( elem, context, xml ) {
						var cache, outerCache, node, diff, nodeIndex, start,
							dir = simple !== forward ? "nextSibling" : "previousSibling",
							parent = elem.parentNode,
							name = ofType && elem.nodeName.toLowerCase(),
							useCache = !xml && !ofType;

						if ( parent ) {

							// :(first|last|only)-(child|of-type)
							if ( simple ) {
								while ( dir ) {
									node = elem;
									while ( (node = node[ dir ]) ) {
										if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
											return false;
										}
									}
									// Reverse direction for :only-* (if we haven't yet done so)
									start = dir = type === "only" && !start && "nextSibling";
								}
								return true;
							}

							start = [ forward ? parent.firstChild : parent.lastChild ];

							// non-xml :nth-child(...) stores cache data on `parent`
							if ( forward && useCache ) {
								// Seek `elem` from a previously-cached index
								outerCache = parent[ expando ] || (parent[ expando ] = {});
								cache = outerCache[ type ] || [];
								nodeIndex = cache[0] === dirruns && cache[1];
								diff = cache[0] === dirruns && cache[2];
								node = nodeIndex && parent.childNodes[ nodeIndex ];

								while ( (node = ++nodeIndex && node && node[ dir ] ||

									// Fallback to seeking `elem` from the start
									(diff = nodeIndex = 0) || start.pop()) ) {

									// When found, cache indexes on `parent` and break
									if ( node.nodeType === 1 && ++diff && node === elem ) {
										outerCache[ type ] = [ dirruns, nodeIndex, diff ];
										break;
									}
								}

							// Use previously-cached element index if available
							} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
								diff = cache[1];

							// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
							} else {
								// Use the same loop as above to seek `elem` from the start
								while ( (node = ++nodeIndex && node && node[ dir ] ||
									(diff = nodeIndex = 0) || start.pop()) ) {

									if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
										// Cache the index of each encountered element
										if ( useCache ) {
											(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}

							// Incorporate the offset, then check against cycle size
							diff -= last;
							return diff === first || ( diff % first === 0 && diff / first >= 0 );
						}
					};
			},

			"PSEUDO": function( pseudo, argument ) {
				// pseudo-class names are case-insensitive
				// http://www.w3.org/TR/selectors/#pseudo-classes
				// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
				// Remember that setFilters inherits from pseudos
				var args,
					fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
						Sizzle.error( "unsupported pseudo: " + pseudo );

				// The user may use createPseudo to indicate that
				// arguments are needed to create the filter function
				// just as Sizzle does
				if ( fn[ expando ] ) {
					return fn( argument );
				}

				// But maintain support for old signatures
				if ( fn.length > 1 ) {
					args = [ pseudo, pseudo, "", argument ];
					return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
						markFunction(function( seed, matches ) {
							var idx,
								matched = fn( seed, argument ),
								i = matched.length;
							while ( i-- ) {
								idx = indexOf( seed, matched[i] );
								seed[ idx ] = !( matches[ idx ] = matched[i] );
							}
						}) :
						function( elem ) {
							return fn( elem, 0, args );
						};
				}

				return fn;
			}
		},

		pseudos: {
			// Potentially complex pseudos
			"not": markFunction(function( selector ) {
				// Trim the selector passed to compile
				// to avoid treating leading and trailing
				// spaces as combinators
				var input = [],
					results = [],
					matcher = compile( selector.replace( rtrim, "$1" ) );

				return matcher[ expando ] ?
					markFunction(function( seed, matches, context, xml ) {
						var elem,
							unmatched = matcher( seed, null, xml, [] ),
							i = seed.length;

						// Match elements unmatched by `matcher`
						while ( i-- ) {
							if ( (elem = unmatched[i]) ) {
								seed[i] = !(matches[i] = elem);
							}
						}
					}) :
					function( elem, context, xml ) {
						input[0] = elem;
						matcher( input, null, xml, results );
						// Don't keep the element (issue #299)
						input[0] = null;
						return !results.pop();
					};
			}),

			"has": markFunction(function( selector ) {
				return function( elem ) {
					return Sizzle( selector, elem ).length > 0;
				};
			}),

			"contains": markFunction(function( text ) {
				text = text.replace( runescape, funescape );
				return function( elem ) {
					return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
				};
			}),

			// "Whether an element is represented by a :lang() selector
			// is based solely on the element's language value
			// being equal to the identifier C,
			// or beginning with the identifier C immediately followed by "-".
			// The matching of C against the element's language value is performed case-insensitively.
			// The identifier C does not have to be a valid language name."
			// http://www.w3.org/TR/selectors/#lang-pseudo
			"lang": markFunction( function( lang ) {
				// lang value must be a valid identifier
				if ( !ridentifier.test(lang || "") ) {
					Sizzle.error( "unsupported lang: " + lang );
				}
				lang = lang.replace( runescape, funescape ).toLowerCase();
				return function( elem ) {
					var elemLang;
					do {
						if ( (elemLang = documentIsHTML ?
							elem.lang :
							elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

							elemLang = elemLang.toLowerCase();
							return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
						}
					} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
					return false;
				};
			}),

			// Miscellaneous
			"target": function( elem ) {
				var hash = window.location && window.location.hash;
				return hash && hash.slice( 1 ) === elem.id;
			},

			"root": function( elem ) {
				return elem === docElem;
			},

			"focus": function( elem ) {
				return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
			},

			// Boolean properties
			"enabled": function( elem ) {
				return elem.disabled === false;
			},

			"disabled": function( elem ) {
				return elem.disabled === true;
			},

			"checked": function( elem ) {
				// In CSS3, :checked should return both checked and selected elements
				// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
				var nodeName = elem.nodeName.toLowerCase();
				return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
			},

			"selected": function( elem ) {
				// Accessing this property makes selected-by-default
				// options in Safari work properly
				if ( elem.parentNode ) {
					elem.parentNode.selectedIndex;
				}

				return elem.selected === true;
			},

			// Contents
			"empty": function( elem ) {
				// http://www.w3.org/TR/selectors/#empty-pseudo
				// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
				//   but not by others (comment: 8; processing instruction: 7; etc.)
				// nodeType < 6 works because attributes (2) do not appear as children
				for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
					if ( elem.nodeType < 6 ) {
						return false;
					}
				}
				return true;
			},

			"parent": function( elem ) {
				return !Expr.pseudos["empty"]( elem );
			},

			// Element/input types
			"header": function( elem ) {
				return rheader.test( elem.nodeName );
			},

			"input": function( elem ) {
				return rinputs.test( elem.nodeName );
			},

			"button": function( elem ) {
				var name = elem.nodeName.toLowerCase();
				return name === "input" && elem.type === "button" || name === "button";
			},

			"text": function( elem ) {
				var attr;
				return elem.nodeName.toLowerCase() === "input" &&
					elem.type === "text" &&

					// Support: IE<8
					// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
					( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
			},

			// Position-in-collection
			"first": createPositionalPseudo(function() {
				return [ 0 ];
			}),

			"last": createPositionalPseudo(function( matchIndexes, length ) {
				return [ length - 1 ];
			}),

			"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
				return [ argument < 0 ? argument + length : argument ];
			}),

			"even": createPositionalPseudo(function( matchIndexes, length ) {
				var i = 0;
				for ( ; i < length; i += 2 ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			}),

			"odd": createPositionalPseudo(function( matchIndexes, length ) {
				var i = 1;
				for ( ; i < length; i += 2 ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			}),

			"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
				var i = argument < 0 ? argument + length : argument;
				for ( ; --i >= 0; ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			}),

			"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
				var i = argument < 0 ? argument + length : argument;
				for ( ; ++i < length; ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			})
		}
	};

	Expr.pseudos["nth"] = Expr.pseudos["eq"];

	// Add button/input type pseudos
	for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
		Expr.pseudos[ i ] = createInputPseudo( i );
	}
	for ( i in { submit: true, reset: true } ) {
		Expr.pseudos[ i ] = createButtonPseudo( i );
	}

	// Easy API for creating new setFilters
	function setFilters() {}
	setFilters.prototype = Expr.filters = Expr.pseudos;
	Expr.setFilters = new setFilters();

	tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
		var matched, match, tokens, type,
			soFar, groups, preFilters,
			cached = tokenCache[ selector + " " ];

		if ( cached ) {
			return parseOnly ? 0 : cached.slice( 0 );
		}

		soFar = selector;
		groups = [];
		preFilters = Expr.preFilter;

		while ( soFar ) {

			// Comma and first run
			if ( !matched || (match = rcomma.exec( soFar )) ) {
				if ( match ) {
					// Don't consume trailing commas as valid
					soFar = soFar.slice( match[0].length ) || soFar;
				}
				groups.push( (tokens = []) );
			}

			matched = false;

			// Combinators
			if ( (match = rcombinators.exec( soFar )) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					// Cast descendant combinators to space
					type: match[0].replace( rtrim, " " )
				});
				soFar = soFar.slice( matched.length );
			}

			// Filters
			for ( type in Expr.filter ) {
				if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
					(match = preFilters[ type ]( match ))) ) {
					matched = match.shift();
					tokens.push({
						value: matched,
						type: type,
						matches: match
					});
					soFar = soFar.slice( matched.length );
				}
			}

			if ( !matched ) {
				break;
			}
		}

		// Return the length of the invalid excess
		// if we're just parsing
		// Otherwise, throw an error or return tokens
		return parseOnly ?
			soFar.length :
			soFar ?
				Sizzle.error( selector ) :
				// Cache the tokens
				tokenCache( selector, groups ).slice( 0 );
	};

	function toSelector( tokens ) {
		var i = 0,
			len = tokens.length,
			selector = "";
		for ( ; i < len; i++ ) {
			selector += tokens[i].value;
		}
		return selector;
	}

	function addCombinator( matcher, combinator, base ) {
		var dir = combinator.dir,
			checkNonElements = base && dir === "parentNode",
			doneName = done++;

		return combinator.first ?
			// Check against closest ancestor/preceding element
			function( elem, context, xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						return matcher( elem, context, xml );
					}
				}
			} :

			// Check against all ancestor/preceding elements
			function( elem, context, xml ) {
				var oldCache, outerCache,
					newCache = [ dirruns, doneName ];

				// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
				if ( xml ) {
					while ( (elem = elem[ dir ]) ) {
						if ( elem.nodeType === 1 || checkNonElements ) {
							if ( matcher( elem, context, xml ) ) {
								return true;
							}
						}
					}
				} else {
					while ( (elem = elem[ dir ]) ) {
						if ( elem.nodeType === 1 || checkNonElements ) {
							outerCache = elem[ expando ] || (elem[ expando ] = {});
							if ( (oldCache = outerCache[ dir ]) &&
								oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

								// Assign to newCache so results back-propagate to previous elements
								return (newCache[ 2 ] = oldCache[ 2 ]);
							} else {
								// Reuse newcache so results back-propagate to previous elements
								outerCache[ dir ] = newCache;

								// A match means we're done; a fail means we have to keep checking
								if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
									return true;
								}
							}
						}
					}
				}
			};
	}

	function elementMatcher( matchers ) {
		return matchers.length > 1 ?
			function( elem, context, xml ) {
				var i = matchers.length;
				while ( i-- ) {
					if ( !matchers[i]( elem, context, xml ) ) {
						return false;
					}
				}
				return true;
			} :
			matchers[0];
	}

	function multipleContexts( selector, contexts, results ) {
		var i = 0,
			len = contexts.length;
		for ( ; i < len; i++ ) {
			Sizzle( selector, contexts[i], results );
		}
		return results;
	}

	function condense( unmatched, map, filter, context, xml ) {
		var elem,
			newUnmatched = [],
			i = 0,
			len = unmatched.length,
			mapped = map != null;

		for ( ; i < len; i++ ) {
			if ( (elem = unmatched[i]) ) {
				if ( !filter || filter( elem, context, xml ) ) {
					newUnmatched.push( elem );
					if ( mapped ) {
						map.push( i );
					}
				}
			}
		}

		return newUnmatched;
	}

	function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
		if ( postFilter && !postFilter[ expando ] ) {
			postFilter = setMatcher( postFilter );
		}
		if ( postFinder && !postFinder[ expando ] ) {
			postFinder = setMatcher( postFinder, postSelector );
		}
		return markFunction(function( seed, results, context, xml ) {
			var temp, i, elem,
				preMap = [],
				postMap = [],
				preexisting = results.length,

				// Get initial elements from seed or context
				elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

				// Prefilter to get matcher input, preserving a map for seed-results synchronization
				matcherIn = preFilter && ( seed || !selector ) ?
					condense( elems, preMap, preFilter, context, xml ) :
					elems,

				matcherOut = matcher ?
					// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
					postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

						// ...intermediate processing is necessary
						[] :

						// ...otherwise use results directly
						results :
					matcherIn;

			// Find primary matches
			if ( matcher ) {
				matcher( matcherIn, matcherOut, context, xml );
			}

			// Apply postFilter
			if ( postFilter ) {
				temp = condense( matcherOut, postMap );
				postFilter( temp, [], context, xml );

				// Un-match failing elements by moving them back to matcherIn
				i = temp.length;
				while ( i-- ) {
					if ( (elem = temp[i]) ) {
						matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
					}
				}
			}

			if ( seed ) {
				if ( postFinder || preFilter ) {
					if ( postFinder ) {
						// Get the final matcherOut by condensing this intermediate into postFinder contexts
						temp = [];
						i = matcherOut.length;
						while ( i-- ) {
							if ( (elem = matcherOut[i]) ) {
								// Restore matcherIn since elem is not yet a final match
								temp.push( (matcherIn[i] = elem) );
							}
						}
						postFinder( null, (matcherOut = []), temp, xml );
					}

					// Move matched elements from seed to results to keep them synchronized
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) &&
							(temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {

							seed[temp] = !(results[temp] = elem);
						}
					}
				}

			// Add elements to results, through postFinder if defined
			} else {
				matcherOut = condense(
					matcherOut === results ?
						matcherOut.splice( preexisting, matcherOut.length ) :
						matcherOut
				);
				if ( postFinder ) {
					postFinder( null, results, matcherOut, xml );
				} else {
					push.apply( results, matcherOut );
				}
			}
		});
	}

	function matcherFromTokens( tokens ) {
		var checkContext, matcher, j,
			len = tokens.length,
			leadingRelative = Expr.relative[ tokens[0].type ],
			implicitRelative = leadingRelative || Expr.relative[" "],
			i = leadingRelative ? 1 : 0,

			// The foundational matcher ensures that elements are reachable from top-level context(s)
			matchContext = addCombinator( function( elem ) {
				return elem === checkContext;
			}, implicitRelative, true ),
			matchAnyContext = addCombinator( function( elem ) {
				return indexOf( checkContext, elem ) > -1;
			}, implicitRelative, true ),
			matchers = [ function( elem, context, xml ) {
				var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
					(checkContext = context).nodeType ?
						matchContext( elem, context, xml ) :
						matchAnyContext( elem, context, xml ) );
				// Avoid hanging onto element (issue #299)
				checkContext = null;
				return ret;
			} ];

		for ( ; i < len; i++ ) {
			if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
				matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
			} else {
				matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

				// Return special upon seeing a positional matcher
				if ( matcher[ expando ] ) {
					// Find the next relative operator (if any) for proper handling
					j = ++i;
					for ( ; j < len; j++ ) {
						if ( Expr.relative[ tokens[j].type ] ) {
							break;
						}
					}
					return setMatcher(
						i > 1 && elementMatcher( matchers ),
						i > 1 && toSelector(
							// If the preceding token was a descendant combinator, insert an implicit any-element `*`
							tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
						).replace( rtrim, "$1" ),
						matcher,
						i < j && matcherFromTokens( tokens.slice( i, j ) ),
						j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
						j < len && toSelector( tokens )
					);
				}
				matchers.push( matcher );
			}
		}

		return elementMatcher( matchers );
	}

	function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
		var bySet = setMatchers.length > 0,
			byElement = elementMatchers.length > 0,
			superMatcher = function( seed, context, xml, results, outermost ) {
				var elem, j, matcher,
					matchedCount = 0,
					i = "0",
					unmatched = seed && [],
					setMatched = [],
					contextBackup = outermostContext,
					// We must always have either seed elements or outermost context
					elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
					// Use integer dirruns iff this is the outermost matcher
					dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
					len = elems.length;

				if ( outermost ) {
					outermostContext = context !== document && context;
				}

				// Add elements passing elementMatchers directly to results
				// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
				// Support: IE<9, Safari
				// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
				for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
					if ( byElement && elem ) {
						j = 0;
						while ( (matcher = elementMatchers[j++]) ) {
							if ( matcher( elem, context, xml ) ) {
								results.push( elem );
								break;
							}
						}
						if ( outermost ) {
							dirruns = dirrunsUnique;
						}
					}

					// Track unmatched elements for set filters
					if ( bySet ) {
						// They will have gone through all possible matchers
						if ( (elem = !matcher && elem) ) {
							matchedCount--;
						}

						// Lengthen the array for every element, matched or not
						if ( seed ) {
							unmatched.push( elem );
						}
					}
				}

				// Apply set filters to unmatched elements
				matchedCount += i;
				if ( bySet && i !== matchedCount ) {
					j = 0;
					while ( (matcher = setMatchers[j++]) ) {
						matcher( unmatched, setMatched, context, xml );
					}

					if ( seed ) {
						// Reintegrate element matches to eliminate the need for sorting
						if ( matchedCount > 0 ) {
							while ( i-- ) {
								if ( !(unmatched[i] || setMatched[i]) ) {
									setMatched[i] = pop.call( results );
								}
							}
						}

						// Discard index placeholder values to get only actual matches
						setMatched = condense( setMatched );
					}

					// Add matches to results
					push.apply( results, setMatched );

					// Seedless set matches succeeding multiple successful matchers stipulate sorting
					if ( outermost && !seed && setMatched.length > 0 &&
						( matchedCount + setMatchers.length ) > 1 ) {

						Sizzle.uniqueSort( results );
					}
				}

				// Override manipulation of globals by nested matchers
				if ( outermost ) {
					dirruns = dirrunsUnique;
					outermostContext = contextBackup;
				}

				return unmatched;
			};

		return bySet ?
			markFunction( superMatcher ) :
			superMatcher;
	}

	compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
		var i,
			setMatchers = [],
			elementMatchers = [],
			cached = compilerCache[ selector + " " ];

		if ( !cached ) {
			// Generate a function of recursive functions that can be used to check each element
			if ( !match ) {
				match = tokenize( selector );
			}
			i = match.length;
			while ( i-- ) {
				cached = matcherFromTokens( match[i] );
				if ( cached[ expando ] ) {
					setMatchers.push( cached );
				} else {
					elementMatchers.push( cached );
				}
			}

			// Cache the compiled function
			cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

			// Save selector and tokenization
			cached.selector = selector;
		}
		return cached;
	};

	/**
	 * A low-level selection function that works with Sizzle's compiled
	 *  selector functions
	 * @param {String|Function} selector A selector or a pre-compiled
	 *  selector function built with Sizzle.compile
	 * @param {Element} context
	 * @param {Array} [results]
	 * @param {Array} [seed] A set of elements to match against
	 */
	select = Sizzle.select = function( selector, context, results, seed ) {
		var i, tokens, token, type, find,
			compiled = typeof selector === "function" && selector,
			match = !seed && tokenize( (selector = compiled.selector || selector) );

		results = results || [];

		// Try to minimize operations if there is no seed and only one group
		if ( match.length === 1 ) {

			// Take a shortcut and set the context if the root selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					support.getById && context.nodeType === 9 && documentIsHTML &&
					Expr.relative[ tokens[1].type ] ) {

				context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
				if ( !context ) {
					return results;

				// Precompiled matchers will still verify ancestry, so step up a level
				} else if ( compiled ) {
					context = context.parentNode;
				}

				selector = selector.slice( tokens.shift().value.length );
			}

			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[i];

				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
					)) ) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, seed );
							return results;
						}

						break;
					}
				}
			}
		}

		// Compile and execute a filtering function if one is not provided
		// Provide `match` to avoid retokenization if we modified the selector above
		( compiled || compile( selector, match ) )(
			seed,
			context,
			!documentIsHTML,
			results,
			rsibling.test( selector ) && testContext( context.parentNode ) || context
		);
		return results;
	};

	// One-time assignments

	// Sort stability
	support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

	// Support: Chrome 14-35+
	// Always assume duplicates if they aren't passed to the comparison function
	support.detectDuplicates = !!hasDuplicate;

	// Initialize against the default document
	setDocument();

	// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
	// Detached nodes confoundingly follow *each other*
	support.sortDetached = assert(function( div1 ) {
		// Should return 1, but returns 4 (following)
		return div1.compareDocumentPosition( document.createElement("div") ) & 1;
	});

	// Support: IE<8
	// Prevent attribute/property "interpolation"
	// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
	if ( !assert(function( div ) {
		div.innerHTML = "<a href='#'></a>";
		return div.firstChild.getAttribute("href") === "#" ;
	}) ) {
		addHandle( "type|href|height|width", function( elem, name, isXML ) {
			if ( !isXML ) {
				return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
			}
		});
	}

	// Support: IE<9
	// Use defaultValue in place of getAttribute("value")
	if ( !support.attributes || !assert(function( div ) {
		div.innerHTML = "<input/>";
		div.firstChild.setAttribute( "value", "" );
		return div.firstChild.getAttribute( "value" ) === "";
	}) ) {
		addHandle( "value", function( elem, name, isXML ) {
			if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
				return elem.defaultValue;
			}
		});
	}

	// Support: IE<9
	// Use getAttributeNode to fetch booleans when getAttribute lies
	if ( !assert(function( div ) {
		return div.getAttribute("disabled") == null;
	}) ) {
		addHandle( booleans, function( elem, name, isXML ) {
			var val;
			if ( !isXML ) {
				return elem[ name ] === true ? name.toLowerCase() :
						(val = elem.getAttributeNode( name )) && val.specified ?
						val.value :
					null;
			}
		});
	}

	return Sizzle;

	})( window );



	jQuery.find = Sizzle;
	jQuery.expr = Sizzle.selectors;
	jQuery.expr[":"] = jQuery.expr.pseudos;
	jQuery.unique = Sizzle.uniqueSort;
	jQuery.text = Sizzle.getText;
	jQuery.isXMLDoc = Sizzle.isXML;
	jQuery.contains = Sizzle.contains;



	var rneedsContext = jQuery.expr.match.needsContext;

	var rsingleTag = (/^<(\w+)\s*\/?>(?:<\/\1>|)$/);



	var risSimple = /^.[^:#\[\.,]*$/;

	// Implement the identical functionality for filter and not
	function winnow( elements, qualifier, not ) {
		if ( jQuery.isFunction( qualifier ) ) {
			return jQuery.grep( elements, function( elem, i ) {
				/* jshint -W018 */
				return !!qualifier.call( elem, i, elem ) !== not;
			});

		}

		if ( qualifier.nodeType ) {
			return jQuery.grep( elements, function( elem ) {
				return ( elem === qualifier ) !== not;
			});

		}

		if ( typeof qualifier === "string" ) {
			if ( risSimple.test( qualifier ) ) {
				return jQuery.filter( qualifier, elements, not );
			}

			qualifier = jQuery.filter( qualifier, elements );
		}

		return jQuery.grep( elements, function( elem ) {
			return ( indexOf.call( qualifier, elem ) >= 0 ) !== not;
		});
	}

	jQuery.filter = function( expr, elems, not ) {
		var elem = elems[ 0 ];

		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 && elem.nodeType === 1 ?
			jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
			jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
				return elem.nodeType === 1;
			}));
	};

	jQuery.fn.extend({
		find: function( selector ) {
			var i,
				len = this.length,
				ret = [],
				self = this;

			if ( typeof selector !== "string" ) {
				return this.pushStack( jQuery( selector ).filter(function() {
					for ( i = 0; i < len; i++ ) {
						if ( jQuery.contains( self[ i ], this ) ) {
							return true;
						}
					}
				}) );
			}

			for ( i = 0; i < len; i++ ) {
				jQuery.find( selector, self[ i ], ret );
			}

			// Needed because $( selector, context ) becomes $( context ).find( selector )
			ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
			ret.selector = this.selector ? this.selector + " " + selector : selector;
			return ret;
		},
		filter: function( selector ) {
			return this.pushStack( winnow(this, selector || [], false) );
		},
		not: function( selector ) {
			return this.pushStack( winnow(this, selector || [], true) );
		},
		is: function( selector ) {
			return !!winnow(
				this,

				// If this is a positional/relative selector, check membership in the returned set
				// so $("p:first").is("p:last") won't return true for a doc with two "p".
				typeof selector === "string" && rneedsContext.test( selector ) ?
					jQuery( selector ) :
					selector || [],
				false
			).length;
		}
	});


	// Initialize a jQuery object


	// A central reference to the root jQuery(document)
	var rootjQuery,

		// A simple way to check for HTML strings
		// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
		// Strict HTML recognition (#11290: must start with <)
		rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

		init = jQuery.fn.init = function( selector, context ) {
			var match, elem;

			// HANDLE: $(""), $(null), $(undefined), $(false)
			if ( !selector ) {
				return this;
			}

			// Handle HTML strings
			if ( typeof selector === "string" ) {
				if ( selector[0] === "<" && selector[ selector.length - 1 ] === ">" && selector.length >= 3 ) {
					// Assume that strings that start and end with <> are HTML and skip the regex check
					match = [ null, selector, null ];

				} else {
					match = rquickExpr.exec( selector );
				}

				// Match html or make sure no context is specified for #id
				if ( match && (match[1] || !context) ) {

					// HANDLE: $(html) -> $(array)
					if ( match[1] ) {
						context = context instanceof jQuery ? context[0] : context;

						// Option to run scripts is true for back-compat
						// Intentionally let the error be thrown if parseHTML is not present
						jQuery.merge( this, jQuery.parseHTML(
							match[1],
							context && context.nodeType ? context.ownerDocument || context : document,
							true
						) );

						// HANDLE: $(html, props)
						if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
							for ( match in context ) {
								// Properties of context are called as methods if possible
								if ( jQuery.isFunction( this[ match ] ) ) {
									this[ match ]( context[ match ] );

								// ...and otherwise set as attributes
								} else {
									this.attr( match, context[ match ] );
								}
							}
						}

						return this;

					// HANDLE: $(#id)
					} else {
						elem = document.getElementById( match[2] );

						// Support: Blackberry 4.6
						// gEBID returns nodes no longer in the document (#6963)
						if ( elem && elem.parentNode ) {
							// Inject the element directly into the jQuery object
							this.length = 1;
							this[0] = elem;
						}

						this.context = document;
						this.selector = selector;
						return this;
					}

				// HANDLE: $(expr, $(...))
				} else if ( !context || context.jquery ) {
					return ( context || rootjQuery ).find( selector );

				// HANDLE: $(expr, context)
				// (which is just equivalent to: $(context).find(expr)
				} else {
					return this.constructor( context ).find( selector );
				}

			// HANDLE: $(DOMElement)
			} else if ( selector.nodeType ) {
				this.context = this[0] = selector;
				this.length = 1;
				return this;

			// HANDLE: $(function)
			// Shortcut for document ready
			} else if ( jQuery.isFunction( selector ) ) {
				return typeof rootjQuery.ready !== "undefined" ?
					rootjQuery.ready( selector ) :
					// Execute immediately if ready is not present
					selector( jQuery );
			}

			if ( selector.selector !== undefined ) {
				this.selector = selector.selector;
				this.context = selector.context;
			}

			return jQuery.makeArray( selector, this );
		};

	// Give the init function the jQuery prototype for later instantiation
	init.prototype = jQuery.fn;

	// Initialize central reference
	rootjQuery = jQuery( document );


	var rparentsprev = /^(?:parents|prev(?:Until|All))/,
		// Methods guaranteed to produce a unique set when starting from a unique set
		guaranteedUnique = {
			children: true,
			contents: true,
			next: true,
			prev: true
		};

	jQuery.extend({
		dir: function( elem, dir, until ) {
			var matched = [],
				truncate = until !== undefined;

			while ( (elem = elem[ dir ]) && elem.nodeType !== 9 ) {
				if ( elem.nodeType === 1 ) {
					if ( truncate && jQuery( elem ).is( until ) ) {
						break;
					}
					matched.push( elem );
				}
			}
			return matched;
		},

		sibling: function( n, elem ) {
			var matched = [];

			for ( ; n; n = n.nextSibling ) {
				if ( n.nodeType === 1 && n !== elem ) {
					matched.push( n );
				}
			}

			return matched;
		}
	});

	jQuery.fn.extend({
		has: function( target ) {
			var targets = jQuery( target, this ),
				l = targets.length;

			return this.filter(function() {
				var i = 0;
				for ( ; i < l; i++ ) {
					if ( jQuery.contains( this, targets[i] ) ) {
						return true;
					}
				}
			});
		},

		closest: function( selectors, context ) {
			var cur,
				i = 0,
				l = this.length,
				matched = [],
				pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
					jQuery( selectors, context || this.context ) :
					0;

			for ( ; i < l; i++ ) {
				for ( cur = this[i]; cur && cur !== context; cur = cur.parentNode ) {
					// Always skip document fragments
					if ( cur.nodeType < 11 && (pos ?
						pos.index(cur) > -1 :

						// Don't pass non-elements to Sizzle
						cur.nodeType === 1 &&
							jQuery.find.matchesSelector(cur, selectors)) ) {

						matched.push( cur );
						break;
					}
				}
			}

			return this.pushStack( matched.length > 1 ? jQuery.unique( matched ) : matched );
		},

		// Determine the position of an element within the set
		index: function( elem ) {

			// No argument, return index in parent
			if ( !elem ) {
				return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
			}

			// Index in selector
			if ( typeof elem === "string" ) {
				return indexOf.call( jQuery( elem ), this[ 0 ] );
			}

			// Locate the position of the desired element
			return indexOf.call( this,

				// If it receives a jQuery object, the first element is used
				elem.jquery ? elem[ 0 ] : elem
			);
		},

		add: function( selector, context ) {
			return this.pushStack(
				jQuery.unique(
					jQuery.merge( this.get(), jQuery( selector, context ) )
				)
			);
		},

		addBack: function( selector ) {
			return this.add( selector == null ?
				this.prevObject : this.prevObject.filter(selector)
			);
		}
	});

	function sibling( cur, dir ) {
		while ( (cur = cur[dir]) && cur.nodeType !== 1 ) {}
		return cur;
	}

	jQuery.each({
		parent: function( elem ) {
			var parent = elem.parentNode;
			return parent && parent.nodeType !== 11 ? parent : null;
		},
		parents: function( elem ) {
			return jQuery.dir( elem, "parentNode" );
		},
		parentsUntil: function( elem, i, until ) {
			return jQuery.dir( elem, "parentNode", until );
		},
		next: function( elem ) {
			return sibling( elem, "nextSibling" );
		},
		prev: function( elem ) {
			return sibling( elem, "previousSibling" );
		},
		nextAll: function( elem ) {
			return jQuery.dir( elem, "nextSibling" );
		},
		prevAll: function( elem ) {
			return jQuery.dir( elem, "previousSibling" );
		},
		nextUntil: function( elem, i, until ) {
			return jQuery.dir( elem, "nextSibling", until );
		},
		prevUntil: function( elem, i, until ) {
			return jQuery.dir( elem, "previousSibling", until );
		},
		siblings: function( elem ) {
			return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
		},
		children: function( elem ) {
			return jQuery.sibling( elem.firstChild );
		},
		contents: function( elem ) {
			return elem.contentDocument || jQuery.merge( [], elem.childNodes );
		}
	}, function( name, fn ) {
		jQuery.fn[ name ] = function( until, selector ) {
			var matched = jQuery.map( this, fn, until );

			if ( name.slice( -5 ) !== "Until" ) {
				selector = until;
			}

			if ( selector && typeof selector === "string" ) {
				matched = jQuery.filter( selector, matched );
			}

			if ( this.length > 1 ) {
				// Remove duplicates
				if ( !guaranteedUnique[ name ] ) {
					jQuery.unique( matched );
				}

				// Reverse order for parents* and prev-derivatives
				if ( rparentsprev.test( name ) ) {
					matched.reverse();
				}
			}

			return this.pushStack( matched );
		};
	});
	var rnotwhite = (/\S+/g);



	// String to Object options format cache
	var optionsCache = {};

	// Convert String-formatted options into Object-formatted ones and store in cache
	function createOptions( options ) {
		var object = optionsCache[ options ] = {};
		jQuery.each( options.match( rnotwhite ) || [], function( _, flag ) {
			object[ flag ] = true;
		});
		return object;
	}

	/*
	 * Create a callback list using the following parameters:
	 *
	 *	options: an optional list of space-separated options that will change how
	 *			the callback list behaves or a more traditional option object
	 *
	 * By default a callback list will act like an event callback list and can be
	 * "fired" multiple times.
	 *
	 * Possible options:
	 *
	 *	once:			will ensure the callback list can only be fired once (like a Deferred)
	 *
	 *	memory:			will keep track of previous values and will call any callback added
	 *					after the list has been fired right away with the latest "memorized"
	 *					values (like a Deferred)
	 *
	 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
	 *
	 *	stopOnFalse:	interrupt callings when a callback returns false
	 *
	 */
	jQuery.Callbacks = function( options ) {

		// Convert options from String-formatted to Object-formatted if needed
		// (we check in cache first)
		options = typeof options === "string" ?
			( optionsCache[ options ] || createOptions( options ) ) :
			jQuery.extend( {}, options );

		var // Last fire value (for non-forgettable lists)
			memory,
			// Flag to know if list was already fired
			fired,
			// Flag to know if list is currently firing
			firing,
			// First callback to fire (used internally by add and fireWith)
			firingStart,
			// End of the loop when firing
			firingLength,
			// Index of currently firing callback (modified by remove if needed)
			firingIndex,
			// Actual callback list
			list = [],
			// Stack of fire calls for repeatable lists
			stack = !options.once && [],
			// Fire callbacks
			fire = function( data ) {
				memory = options.memory && data;
				fired = true;
				firingIndex = firingStart || 0;
				firingStart = 0;
				firingLength = list.length;
				firing = true;
				for ( ; list && firingIndex < firingLength; firingIndex++ ) {
					if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
						memory = false; // To prevent further calls using add
						break;
					}
				}
				firing = false;
				if ( list ) {
					if ( stack ) {
						if ( stack.length ) {
							fire( stack.shift() );
						}
					} else if ( memory ) {
						list = [];
					} else {
						self.disable();
					}
				}
			},
			// Actual Callbacks object
			self = {
				// Add a callback or a collection of callbacks to the list
				add: function() {
					if ( list ) {
						// First, we save the current length
						var start = list.length;
						(function add( args ) {
							jQuery.each( args, function( _, arg ) {
								var type = jQuery.type( arg );
								if ( type === "function" ) {
									if ( !options.unique || !self.has( arg ) ) {
										list.push( arg );
									}
								} else if ( arg && arg.length && type !== "string" ) {
									// Inspect recursively
									add( arg );
								}
							});
						})( arguments );
						// Do we need to add the callbacks to the
						// current firing batch?
						if ( firing ) {
							firingLength = list.length;
						// With memory, if we're not firing then
						// we should call right away
						} else if ( memory ) {
							firingStart = start;
							fire( memory );
						}
					}
					return this;
				},
				// Remove a callback from the list
				remove: function() {
					if ( list ) {
						jQuery.each( arguments, function( _, arg ) {
							var index;
							while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
								list.splice( index, 1 );
								// Handle firing indexes
								if ( firing ) {
									if ( index <= firingLength ) {
										firingLength--;
									}
									if ( index <= firingIndex ) {
										firingIndex--;
									}
								}
							}
						});
					}
					return this;
				},
				// Check if a given callback is in the list.
				// If no argument is given, return whether or not list has callbacks attached.
				has: function( fn ) {
					return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
				},
				// Remove all callbacks from the list
				empty: function() {
					list = [];
					firingLength = 0;
					return this;
				},
				// Have the list do nothing anymore
				disable: function() {
					list = stack = memory = undefined;
					return this;
				},
				// Is it disabled?
				disabled: function() {
					return !list;
				},
				// Lock the list in its current state
				lock: function() {
					stack = undefined;
					if ( !memory ) {
						self.disable();
					}
					return this;
				},
				// Is it locked?
				locked: function() {
					return !stack;
				},
				// Call all callbacks with the given context and arguments
				fireWith: function( context, args ) {
					if ( list && ( !fired || stack ) ) {
						args = args || [];
						args = [ context, args.slice ? args.slice() : args ];
						if ( firing ) {
							stack.push( args );
						} else {
							fire( args );
						}
					}
					return this;
				},
				// Call all the callbacks with the given arguments
				fire: function() {
					self.fireWith( this, arguments );
					return this;
				},
				// To know if the callbacks have already been called at least once
				fired: function() {
					return !!fired;
				}
			};

		return self;
	};


	jQuery.extend({

		Deferred: function( func ) {
			var tuples = [
					// action, add listener, listener list, final state
					[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
					[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
					[ "notify", "progress", jQuery.Callbacks("memory") ]
				],
				state = "pending",
				promise = {
					state: function() {
						return state;
					},
					always: function() {
						deferred.done( arguments ).fail( arguments );
						return this;
					},
					then: function( /* fnDone, fnFail, fnProgress */ ) {
						var fns = arguments;
						return jQuery.Deferred(function( newDefer ) {
							jQuery.each( tuples, function( i, tuple ) {
								var fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
								// deferred[ done | fail | progress ] for forwarding actions to newDefer
								deferred[ tuple[1] ](function() {
									var returned = fn && fn.apply( this, arguments );
									if ( returned && jQuery.isFunction( returned.promise ) ) {
										returned.promise()
											.done( newDefer.resolve )
											.fail( newDefer.reject )
											.progress( newDefer.notify );
									} else {
										newDefer[ tuple[ 0 ] + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
									}
								});
							});
							fns = null;
						}).promise();
					},
					// Get a promise for this deferred
					// If obj is provided, the promise aspect is added to the object
					promise: function( obj ) {
						return obj != null ? jQuery.extend( obj, promise ) : promise;
					}
				},
				deferred = {};

			// Keep pipe for back-compat
			promise.pipe = promise.then;

			// Add list-specific methods
			jQuery.each( tuples, function( i, tuple ) {
				var list = tuple[ 2 ],
					stateString = tuple[ 3 ];

				// promise[ done | fail | progress ] = list.add
				promise[ tuple[1] ] = list.add;

				// Handle state
				if ( stateString ) {
					list.add(function() {
						// state = [ resolved | rejected ]
						state = stateString;

					// [ reject_list | resolve_list ].disable; progress_list.lock
					}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
				}

				// deferred[ resolve | reject | notify ]
				deferred[ tuple[0] ] = function() {
					deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
					return this;
				};
				deferred[ tuple[0] + "With" ] = list.fireWith;
			});

			// Make the deferred a promise
			promise.promise( deferred );

			// Call given func if any
			if ( func ) {
				func.call( deferred, deferred );
			}

			// All done!
			return deferred;
		},

		// Deferred helper
		when: function( subordinate /* , ..., subordinateN */ ) {
			var i = 0,
				resolveValues = slice.call( arguments ),
				length = resolveValues.length,

				// the count of uncompleted subordinates
				remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

				// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
				deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

				// Update function for both resolve and progress values
				updateFunc = function( i, contexts, values ) {
					return function( value ) {
						contexts[ i ] = this;
						values[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
						if ( values === progressValues ) {
							deferred.notifyWith( contexts, values );
						} else if ( !( --remaining ) ) {
							deferred.resolveWith( contexts, values );
						}
					};
				},

				progressValues, progressContexts, resolveContexts;

			// Add listeners to Deferred subordinates; treat others as resolved
			if ( length > 1 ) {
				progressValues = new Array( length );
				progressContexts = new Array( length );
				resolveContexts = new Array( length );
				for ( ; i < length; i++ ) {
					if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
						resolveValues[ i ].promise()
							.done( updateFunc( i, resolveContexts, resolveValues ) )
							.fail( deferred.reject )
							.progress( updateFunc( i, progressContexts, progressValues ) );
					} else {
						--remaining;
					}
				}
			}

			// If we're not waiting on anything, resolve the master
			if ( !remaining ) {
				deferred.resolveWith( resolveContexts, resolveValues );
			}

			return deferred.promise();
		}
	});


	// The deferred used on DOM ready
	var readyList;

	jQuery.fn.ready = function( fn ) {
		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	};

	jQuery.extend({
		// Is the DOM ready to be used? Set to true once it occurs.
		isReady: false,

		// A counter to track how many items to wait for before
		// the ready event fires. See #6781
		readyWait: 1,

		// Hold (or release) the ready event
		holdReady: function( hold ) {
			if ( hold ) {
				jQuery.readyWait++;
			} else {
				jQuery.ready( true );
			}
		},

		// Handle when the DOM is ready
		ready: function( wait ) {

			// Abort if there are pending holds or we're already ready
			if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
				return;
			}

			// Remember that the DOM is ready
			jQuery.isReady = true;

			// If a normal DOM Ready event fired, decrement, and wait if need be
			if ( wait !== true && --jQuery.readyWait > 0 ) {
				return;
			}

			// If there are functions bound, to execute
			readyList.resolveWith( document, [ jQuery ] );

			// Trigger any bound ready events
			if ( jQuery.fn.triggerHandler ) {
				jQuery( document ).triggerHandler( "ready" );
				jQuery( document ).off( "ready" );
			}
		}
	});

	/**
	 * The ready event handler and self cleanup method
	 */
	function completed() {
		document.removeEventListener( "DOMContentLoaded", completed, false );
		window.removeEventListener( "load", completed, false );
		jQuery.ready();
	}

	jQuery.ready.promise = function( obj ) {
		if ( !readyList ) {

			readyList = jQuery.Deferred();

			// Catch cases where $(document).ready() is called after the browser event has already occurred.
			// We once tried to use readyState "interactive" here, but it caused issues like the one
			// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
			if ( document.readyState === "complete" ) {
				// Handle it asynchronously to allow scripts the opportunity to delay ready
				setTimeout( jQuery.ready );

			} else {

				// Use the handy event callback
				document.addEventListener( "DOMContentLoaded", completed, false );

				// A fallback to window.onload, that will always work
				window.addEventListener( "load", completed, false );
			}
		}
		return readyList.promise( obj );
	};

	// Kick off the DOM ready check even if the user does not
	jQuery.ready.promise();




	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	var access = jQuery.access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			len = elems.length,
			bulk = key == null;

		// Sets many values
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
			}

		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;

			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}

			if ( bulk ) {
				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;

				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}

			if ( fn ) {
				for ( ; i < len; i++ ) {
					fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
				}
			}
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				len ? fn( elems[0], key ) : emptyGet;
	};


	/**
	 * Determines whether an object can have data
	 */
	jQuery.acceptData = function( owner ) {
		// Accepts only:
		//  - Node
		//    - Node.ELEMENT_NODE
		//    - Node.DOCUMENT_NODE
		//  - Object
		//    - Any
		/* jshint -W018 */
		return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
	};


	function Data() {
		// Support: Android<4,
		// Old WebKit does not have Object.preventExtensions/freeze method,
		// return new empty object instead with no [[set]] accessor
		Object.defineProperty( this.cache = {}, 0, {
			get: function() {
				return {};
			}
		});

		this.expando = jQuery.expando + Data.uid++;
	}

	Data.uid = 1;
	Data.accepts = jQuery.acceptData;

	Data.prototype = {
		key: function( owner ) {
			// We can accept data for non-element nodes in modern browsers,
			// but we should not, see #8335.
			// Always return the key for a frozen object.
			if ( !Data.accepts( owner ) ) {
				return 0;
			}

			var descriptor = {},
				// Check if the owner object already has a cache key
				unlock = owner[ this.expando ];

			// If not, create one
			if ( !unlock ) {
				unlock = Data.uid++;

				// Secure it in a non-enumerable, non-writable property
				try {
					descriptor[ this.expando ] = { value: unlock };
					Object.defineProperties( owner, descriptor );

				// Support: Android<4
				// Fallback to a less secure definition
				} catch ( e ) {
					descriptor[ this.expando ] = unlock;
					jQuery.extend( owner, descriptor );
				}
			}

			// Ensure the cache object
			if ( !this.cache[ unlock ] ) {
				this.cache[ unlock ] = {};
			}

			return unlock;
		},
		set: function( owner, data, value ) {
			var prop,
				// There may be an unlock assigned to this node,
				// if there is no entry for this "owner", create one inline
				// and set the unlock as though an owner entry had always existed
				unlock = this.key( owner ),
				cache = this.cache[ unlock ];

			// Handle: [ owner, key, value ] args
			if ( typeof data === "string" ) {
				cache[ data ] = value;

			// Handle: [ owner, { properties } ] args
			} else {
				// Fresh assignments by object are shallow copied
				if ( jQuery.isEmptyObject( cache ) ) {
					jQuery.extend( this.cache[ unlock ], data );
				// Otherwise, copy the properties one-by-one to the cache object
				} else {
					for ( prop in data ) {
						cache[ prop ] = data[ prop ];
					}
				}
			}
			return cache;
		},
		get: function( owner, key ) {
			// Either a valid cache is found, or will be created.
			// New caches will be created and the unlock returned,
			// allowing direct access to the newly created
			// empty data object. A valid owner object must be provided.
			var cache = this.cache[ this.key( owner ) ];

			return key === undefined ?
				cache : cache[ key ];
		},
		access: function( owner, key, value ) {
			var stored;
			// In cases where either:
			//
			//   1. No key was specified
			//   2. A string key was specified, but no value provided
			//
			// Take the "read" path and allow the get method to determine
			// which value to return, respectively either:
			//
			//   1. The entire cache object
			//   2. The data stored at the key
			//
			if ( key === undefined ||
					((key && typeof key === "string") && value === undefined) ) {

				stored = this.get( owner, key );

				return stored !== undefined ?
					stored : this.get( owner, jQuery.camelCase(key) );
			}

			// [*]When the key is not a string, or both a key and value
			// are specified, set or extend (existing objects) with either:
			//
			//   1. An object of properties
			//   2. A key and value
			//
			this.set( owner, key, value );

			// Since the "set" path can have two possible entry points
			// return the expected data based on which path was taken[*]
			return value !== undefined ? value : key;
		},
		remove: function( owner, key ) {
			var i, name, camel,
				unlock = this.key( owner ),
				cache = this.cache[ unlock ];

			if ( key === undefined ) {
				this.cache[ unlock ] = {};

			} else {
				// Support array or space separated string of keys
				if ( jQuery.isArray( key ) ) {
					// If "name" is an array of keys...
					// When data is initially created, via ("key", "val") signature,
					// keys will be converted to camelCase.
					// Since there is no way to tell _how_ a key was added, remove
					// both plain key and camelCase key. #12786
					// This will only penalize the array argument path.
					name = key.concat( key.map( jQuery.camelCase ) );
				} else {
					camel = jQuery.camelCase( key );
					// Try the string as a key before any manipulation
					if ( key in cache ) {
						name = [ key, camel ];
					} else {
						// If a key with the spaces exists, use it.
						// Otherwise, create an array by matching non-whitespace
						name = camel;
						name = name in cache ?
							[ name ] : ( name.match( rnotwhite ) || [] );
					}
				}

				i = name.length;
				while ( i-- ) {
					delete cache[ name[ i ] ];
				}
			}
		},
		hasData: function( owner ) {
			return !jQuery.isEmptyObject(
				this.cache[ owner[ this.expando ] ] || {}
			);
		},
		discard: function( owner ) {
			if ( owner[ this.expando ] ) {
				delete this.cache[ owner[ this.expando ] ];
			}
		}
	};
	var data_priv = new Data();

	var data_user = new Data();



	//	Implementation Summary
	//
	//	1. Enforce API surface and semantic compatibility with 1.9.x branch
	//	2. Improve the module's maintainability by reducing the storage
	//		paths to a single mechanism.
	//	3. Use the same single mechanism to support "private" and "user" data.
	//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
	//	5. Avoid exposing implementation details on user objects (eg. expando properties)
	//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

	var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
		rmultiDash = /([A-Z])/g;

	function dataAttr( elem, key, data ) {
		var name;

		// If nothing was found internally, try to fetch any
		// data from the HTML5 data-* attribute
		if ( data === undefined && elem.nodeType === 1 ) {
			name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();
			data = elem.getAttribute( name );

			if ( typeof data === "string" ) {
				try {
					data = data === "true" ? true :
						data === "false" ? false :
						data === "null" ? null :
						// Only convert to a number if it doesn't change the string
						+data + "" === data ? +data :
						rbrace.test( data ) ? jQuery.parseJSON( data ) :
						data;
				} catch( e ) {}

				// Make sure we set the data so it isn't changed later
				data_user.set( elem, key, data );
			} else {
				data = undefined;
			}
		}
		return data;
	}

	jQuery.extend({
		hasData: function( elem ) {
			return data_user.hasData( elem ) || data_priv.hasData( elem );
		},

		data: function( elem, name, data ) {
			return data_user.access( elem, name, data );
		},

		removeData: function( elem, name ) {
			data_user.remove( elem, name );
		},

		// TODO: Now that all calls to _data and _removeData have been replaced
		// with direct calls to data_priv methods, these can be deprecated.
		_data: function( elem, name, data ) {
			return data_priv.access( elem, name, data );
		},

		_removeData: function( elem, name ) {
			data_priv.remove( elem, name );
		}
	});

	jQuery.fn.extend({
		data: function( key, value ) {
			var i, name, data,
				elem = this[ 0 ],
				attrs = elem && elem.attributes;

			// Gets all values
			if ( key === undefined ) {
				if ( this.length ) {
					data = data_user.get( elem );

					if ( elem.nodeType === 1 && !data_priv.get( elem, "hasDataAttrs" ) ) {
						i = attrs.length;
						while ( i-- ) {

							// Support: IE11+
							// The attrs elements can be null (#14894)
							if ( attrs[ i ] ) {
								name = attrs[ i ].name;
								if ( name.indexOf( "data-" ) === 0 ) {
									name = jQuery.camelCase( name.slice(5) );
									dataAttr( elem, name, data[ name ] );
								}
							}
						}
						data_priv.set( elem, "hasDataAttrs", true );
					}
				}

				return data;
			}

			// Sets multiple values
			if ( typeof key === "object" ) {
				return this.each(function() {
					data_user.set( this, key );
				});
			}

			return access( this, function( value ) {
				var data,
					camelKey = jQuery.camelCase( key );

				// The calling jQuery object (element matches) is not empty
				// (and therefore has an element appears at this[ 0 ]) and the
				// `value` parameter was not undefined. An empty jQuery object
				// will result in `undefined` for elem = this[ 0 ] which will
				// throw an exception if an attempt to read a data cache is made.
				if ( elem && value === undefined ) {
					// Attempt to get data from the cache
					// with the key as-is
					data = data_user.get( elem, key );
					if ( data !== undefined ) {
						return data;
					}

					// Attempt to get data from the cache
					// with the key camelized
					data = data_user.get( elem, camelKey );
					if ( data !== undefined ) {
						return data;
					}

					// Attempt to "discover" the data in
					// HTML5 custom data-* attrs
					data = dataAttr( elem, camelKey, undefined );
					if ( data !== undefined ) {
						return data;
					}

					// We tried really hard, but the data doesn't exist.
					return;
				}

				// Set the data...
				this.each(function() {
					// First, attempt to store a copy or reference of any
					// data that might've been store with a camelCased key.
					var data = data_user.get( this, camelKey );

					// For HTML5 data-* attribute interop, we have to
					// store property names with dashes in a camelCase form.
					// This might not apply to all properties...*
					data_user.set( this, camelKey, value );

					// *... In the case of properties that might _actually_
					// have dashes, we need to also store a copy of that
					// unchanged property.
					if ( key.indexOf("-") !== -1 && data !== undefined ) {
						data_user.set( this, key, value );
					}
				});
			}, null, value, arguments.length > 1, null, true );
		},

		removeData: function( key ) {
			return this.each(function() {
				data_user.remove( this, key );
			});
		}
	});


	jQuery.extend({
		queue: function( elem, type, data ) {
			var queue;

			if ( elem ) {
				type = ( type || "fx" ) + "queue";
				queue = data_priv.get( elem, type );

				// Speed up dequeue by getting out quickly if this is just a lookup
				if ( data ) {
					if ( !queue || jQuery.isArray( data ) ) {
						queue = data_priv.access( elem, type, jQuery.makeArray(data) );
					} else {
						queue.push( data );
					}
				}
				return queue || [];
			}
		},

		dequeue: function( elem, type ) {
			type = type || "fx";

			var queue = jQuery.queue( elem, type ),
				startLength = queue.length,
				fn = queue.shift(),
				hooks = jQuery._queueHooks( elem, type ),
				next = function() {
					jQuery.dequeue( elem, type );
				};

			// If the fx queue is dequeued, always remove the progress sentinel
			if ( fn === "inprogress" ) {
				fn = queue.shift();
				startLength--;
			}

			if ( fn ) {

				// Add a progress sentinel to prevent the fx queue from being
				// automatically dequeued
				if ( type === "fx" ) {
					queue.unshift( "inprogress" );
				}

				// Clear up the last queue stop function
				delete hooks.stop;
				fn.call( elem, next, hooks );
			}

			if ( !startLength && hooks ) {
				hooks.empty.fire();
			}
		},

		// Not public - generate a queueHooks object, or return the current one
		_queueHooks: function( elem, type ) {
			var key = type + "queueHooks";
			return data_priv.get( elem, key ) || data_priv.access( elem, key, {
				empty: jQuery.Callbacks("once memory").add(function() {
					data_priv.remove( elem, [ type + "queue", key ] );
				})
			});
		}
	});

	jQuery.fn.extend({
		queue: function( type, data ) {
			var setter = 2;

			if ( typeof type !== "string" ) {
				data = type;
				type = "fx";
				setter--;
			}

			if ( arguments.length < setter ) {
				return jQuery.queue( this[0], type );
			}

			return data === undefined ?
				this :
				this.each(function() {
					var queue = jQuery.queue( this, type, data );

					// Ensure a hooks for this queue
					jQuery._queueHooks( this, type );

					if ( type === "fx" && queue[0] !== "inprogress" ) {
						jQuery.dequeue( this, type );
					}
				});
		},
		dequeue: function( type ) {
			return this.each(function() {
				jQuery.dequeue( this, type );
			});
		},
		clearQueue: function( type ) {
			return this.queue( type || "fx", [] );
		},
		// Get a promise resolved when queues of a certain type
		// are emptied (fx is the type by default)
		promise: function( type, obj ) {
			var tmp,
				count = 1,
				defer = jQuery.Deferred(),
				elements = this,
				i = this.length,
				resolve = function() {
					if ( !( --count ) ) {
						defer.resolveWith( elements, [ elements ] );
					}
				};

			if ( typeof type !== "string" ) {
				obj = type;
				type = undefined;
			}
			type = type || "fx";

			while ( i-- ) {
				tmp = data_priv.get( elements[ i ], type + "queueHooks" );
				if ( tmp && tmp.empty ) {
					count++;
					tmp.empty.add( resolve );
				}
			}
			resolve();
			return defer.promise( obj );
		}
	});
	var pnum = (/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/).source;

	var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

	var isHidden = function( elem, el ) {
			// isHidden might be called from jQuery#filter function;
			// in that case, element will be second argument
			elem = el || elem;
			return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
		};

	var rcheckableType = (/^(?:checkbox|radio)$/i);



	(function() {
		var fragment = document.createDocumentFragment(),
			div = fragment.appendChild( document.createElement( "div" ) ),
			input = document.createElement( "input" );

		// Support: Safari<=5.1
		// Check state lost if the name is set (#11217)
		// Support: Windows Web Apps (WWA)
		// `name` and `type` must use .setAttribute for WWA (#14901)
		input.setAttribute( "type", "radio" );
		input.setAttribute( "checked", "checked" );
		input.setAttribute( "name", "t" );

		div.appendChild( input );

		// Support: Safari<=5.1, Android<4.2
		// Older WebKit doesn't clone checked state correctly in fragments
		support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

		// Support: IE<=11+
		// Make sure textarea (and checkbox) defaultValue is properly cloned
		div.innerHTML = "<textarea>x</textarea>";
		support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;
	})();
	var strundefined = typeof undefined;



	support.focusinBubbles = "onfocusin" in window;


	var
		rkeyEvent = /^key/,
		rmouseEvent = /^(?:mouse|pointer|contextmenu)|click/,
		rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
		rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

	function returnTrue() {
		return true;
	}

	function returnFalse() {
		return false;
	}

	function safeActiveElement() {
		try {
			return document.activeElement;
		} catch ( err ) { }
	}

	/*
	 * Helper functions for managing events -- not part of the public interface.
	 * Props to Dean Edwards' addEvent library for many of the ideas.
	 */
	jQuery.event = {

		global: {},

		add: function( elem, types, handler, data, selector ) {

			var handleObjIn, eventHandle, tmp,
				events, t, handleObj,
				special, handlers, type, namespaces, origType,
				elemData = data_priv.get( elem );

			// Don't attach events to noData or text/comment nodes (but allow plain objects)
			if ( !elemData ) {
				return;
			}

			// Caller can pass in an object of custom data in lieu of the handler
			if ( handler.handler ) {
				handleObjIn = handler;
				handler = handleObjIn.handler;
				selector = handleObjIn.selector;
			}

			// Make sure that the handler has a unique ID, used to find/remove it later
			if ( !handler.guid ) {
				handler.guid = jQuery.guid++;
			}

			// Init the element's event structure and main handler, if this is the first
			if ( !(events = elemData.events) ) {
				events = elemData.events = {};
			}
			if ( !(eventHandle = elemData.handle) ) {
				eventHandle = elemData.handle = function( e ) {
					// Discard the second event of a jQuery.event.trigger() and
					// when an event is called after a page has unloaded
					return typeof jQuery !== strundefined && jQuery.event.triggered !== e.type ?
						jQuery.event.dispatch.apply( elem, arguments ) : undefined;
				};
			}

			// Handle multiple events separated by a space
			types = ( types || "" ).match( rnotwhite ) || [ "" ];
			t = types.length;
			while ( t-- ) {
				tmp = rtypenamespace.exec( types[t] ) || [];
				type = origType = tmp[1];
				namespaces = ( tmp[2] || "" ).split( "." ).sort();

				// There *must* be a type, no attaching namespace-only handlers
				if ( !type ) {
					continue;
				}

				// If event changes its type, use the special event handlers for the changed type
				special = jQuery.event.special[ type ] || {};

				// If selector defined, determine special event api type, otherwise given type
				type = ( selector ? special.delegateType : special.bindType ) || type;

				// Update special based on newly reset type
				special = jQuery.event.special[ type ] || {};

				// handleObj is passed to all event handlers
				handleObj = jQuery.extend({
					type: type,
					origType: origType,
					data: data,
					handler: handler,
					guid: handler.guid,
					selector: selector,
					needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
					namespace: namespaces.join(".")
				}, handleObjIn );

				// Init the event handler queue if we're the first
				if ( !(handlers = events[ type ]) ) {
					handlers = events[ type ] = [];
					handlers.delegateCount = 0;

					// Only use addEventListener if the special events handler returns false
					if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
						if ( elem.addEventListener ) {
							elem.addEventListener( type, eventHandle, false );
						}
					}
				}

				if ( special.add ) {
					special.add.call( elem, handleObj );

					if ( !handleObj.handler.guid ) {
						handleObj.handler.guid = handler.guid;
					}
				}

				// Add to the element's handler list, delegates in front
				if ( selector ) {
					handlers.splice( handlers.delegateCount++, 0, handleObj );
				} else {
					handlers.push( handleObj );
				}

				// Keep track of which events have ever been used, for event optimization
				jQuery.event.global[ type ] = true;
			}

		},

		// Detach an event or set of events from an element
		remove: function( elem, types, handler, selector, mappedTypes ) {

			var j, origCount, tmp,
				events, t, handleObj,
				special, handlers, type, namespaces, origType,
				elemData = data_priv.hasData( elem ) && data_priv.get( elem );

			if ( !elemData || !(events = elemData.events) ) {
				return;
			}

			// Once for each type.namespace in types; type may be omitted
			types = ( types || "" ).match( rnotwhite ) || [ "" ];
			t = types.length;
			while ( t-- ) {
				tmp = rtypenamespace.exec( types[t] ) || [];
				type = origType = tmp[1];
				namespaces = ( tmp[2] || "" ).split( "." ).sort();

				// Unbind all events (on this namespace, if provided) for the element
				if ( !type ) {
					for ( type in events ) {
						jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
					}
					continue;
				}

				special = jQuery.event.special[ type ] || {};
				type = ( selector ? special.delegateType : special.bindType ) || type;
				handlers = events[ type ] || [];
				tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

				// Remove matching events
				origCount = j = handlers.length;
				while ( j-- ) {
					handleObj = handlers[ j ];

					if ( ( mappedTypes || origType === handleObj.origType ) &&
						( !handler || handler.guid === handleObj.guid ) &&
						( !tmp || tmp.test( handleObj.namespace ) ) &&
						( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
						handlers.splice( j, 1 );

						if ( handleObj.selector ) {
							handlers.delegateCount--;
						}
						if ( special.remove ) {
							special.remove.call( elem, handleObj );
						}
					}
				}

				// Remove generic event handler if we removed something and no more handlers exist
				// (avoids potential for endless recursion during removal of special event handlers)
				if ( origCount && !handlers.length ) {
					if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
						jQuery.removeEvent( elem, type, elemData.handle );
					}

					delete events[ type ];
				}
			}

			// Remove the expando if it's no longer used
			if ( jQuery.isEmptyObject( events ) ) {
				delete elemData.handle;
				data_priv.remove( elem, "events" );
			}
		},

		trigger: function( event, data, elem, onlyHandlers ) {

			var i, cur, tmp, bubbleType, ontype, handle, special,
				eventPath = [ elem || document ],
				type = hasOwn.call( event, "type" ) ? event.type : event,
				namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

			cur = tmp = elem = elem || document;

			// Don't do events on text and comment nodes
			if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
				return;
			}

			// focus/blur morphs to focusin/out; ensure we're not firing them right now
			if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
				return;
			}

			if ( type.indexOf(".") >= 0 ) {
				// Namespaced trigger; create a regexp to match event type in handle()
				namespaces = type.split(".");
				type = namespaces.shift();
				namespaces.sort();
			}
			ontype = type.indexOf(":") < 0 && "on" + type;

			// Caller can pass in a jQuery.Event object, Object, or just an event type string
			event = event[ jQuery.expando ] ?
				event :
				new jQuery.Event( type, typeof event === "object" && event );

			// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
			event.isTrigger = onlyHandlers ? 2 : 3;
			event.namespace = namespaces.join(".");
			event.namespace_re = event.namespace ?
				new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
				null;

			// Clean up the event in case it is being reused
			event.result = undefined;
			if ( !event.target ) {
				event.target = elem;
			}

			// Clone any incoming data and prepend the event, creating the handler arg list
			data = data == null ?
				[ event ] :
				jQuery.makeArray( data, [ event ] );

			// Allow special events to draw outside the lines
			special = jQuery.event.special[ type ] || {};
			if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
				return;
			}

			// Determine event propagation path in advance, per W3C events spec (#9951)
			// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
			if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

				bubbleType = special.delegateType || type;
				if ( !rfocusMorph.test( bubbleType + type ) ) {
					cur = cur.parentNode;
				}
				for ( ; cur; cur = cur.parentNode ) {
					eventPath.push( cur );
					tmp = cur;
				}

				// Only add window if we got to document (e.g., not plain obj or detached DOM)
				if ( tmp === (elem.ownerDocument || document) ) {
					eventPath.push( tmp.defaultView || tmp.parentWindow || window );
				}
			}

			// Fire handlers on the event path
			i = 0;
			while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

				event.type = i > 1 ?
					bubbleType :
					special.bindType || type;

				// jQuery handler
				handle = ( data_priv.get( cur, "events" ) || {} )[ event.type ] && data_priv.get( cur, "handle" );
				if ( handle ) {
					handle.apply( cur, data );
				}

				// Native handler
				handle = ontype && cur[ ontype ];
				if ( handle && handle.apply && jQuery.acceptData( cur ) ) {
					event.result = handle.apply( cur, data );
					if ( event.result === false ) {
						event.preventDefault();
					}
				}
			}
			event.type = type;

			// If nobody prevented the default action, do it now
			if ( !onlyHandlers && !event.isDefaultPrevented() ) {

				if ( (!special._default || special._default.apply( eventPath.pop(), data ) === false) &&
					jQuery.acceptData( elem ) ) {

					// Call a native DOM method on the target with the same name name as the event.
					// Don't do default actions on window, that's where global variables be (#6170)
					if ( ontype && jQuery.isFunction( elem[ type ] ) && !jQuery.isWindow( elem ) ) {

						// Don't re-trigger an onFOO event when we call its FOO() method
						tmp = elem[ ontype ];

						if ( tmp ) {
							elem[ ontype ] = null;
						}

						// Prevent re-triggering of the same event, since we already bubbled it above
						jQuery.event.triggered = type;
						elem[ type ]();
						jQuery.event.triggered = undefined;

						if ( tmp ) {
							elem[ ontype ] = tmp;
						}
					}
				}
			}

			return event.result;
		},

		dispatch: function( event ) {

			// Make a writable jQuery.Event from the native event object
			event = jQuery.event.fix( event );

			var i, j, ret, matched, handleObj,
				handlerQueue = [],
				args = slice.call( arguments ),
				handlers = ( data_priv.get( this, "events" ) || {} )[ event.type ] || [],
				special = jQuery.event.special[ event.type ] || {};

			// Use the fix-ed jQuery.Event rather than the (read-only) native event
			args[0] = event;
			event.delegateTarget = this;

			// Call the preDispatch hook for the mapped type, and let it bail if desired
			if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
				return;
			}

			// Determine handlers
			handlerQueue = jQuery.event.handlers.call( this, event, handlers );

			// Run delegates first; they may want to stop propagation beneath us
			i = 0;
			while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
				event.currentTarget = matched.elem;

				j = 0;
				while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

					// Triggered event must either 1) have no namespace, or 2) have namespace(s)
					// a subset or equal to those in the bound event (both can have no namespace).
					if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

						event.handleObj = handleObj;
						event.data = handleObj.data;

						ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
								.apply( matched.elem, args );

						if ( ret !== undefined ) {
							if ( (event.result = ret) === false ) {
								event.preventDefault();
								event.stopPropagation();
							}
						}
					}
				}
			}

			// Call the postDispatch hook for the mapped type
			if ( special.postDispatch ) {
				special.postDispatch.call( this, event );
			}

			return event.result;
		},

		handlers: function( event, handlers ) {
			var i, matches, sel, handleObj,
				handlerQueue = [],
				delegateCount = handlers.delegateCount,
				cur = event.target;

			// Find delegate handlers
			// Black-hole SVG <use> instance trees (#13180)
			// Avoid non-left-click bubbling in Firefox (#3861)
			if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

				for ( ; cur !== this; cur = cur.parentNode || this ) {

					// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
					if ( cur.disabled !== true || event.type !== "click" ) {
						matches = [];
						for ( i = 0; i < delegateCount; i++ ) {
							handleObj = handlers[ i ];

							// Don't conflict with Object.prototype properties (#13203)
							sel = handleObj.selector + " ";

							if ( matches[ sel ] === undefined ) {
								matches[ sel ] = handleObj.needsContext ?
									jQuery( sel, this ).index( cur ) >= 0 :
									jQuery.find( sel, this, null, [ cur ] ).length;
							}
							if ( matches[ sel ] ) {
								matches.push( handleObj );
							}
						}
						if ( matches.length ) {
							handlerQueue.push({ elem: cur, handlers: matches });
						}
					}
				}
			}

			// Add the remaining (directly-bound) handlers
			if ( delegateCount < handlers.length ) {
				handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
			}

			return handlerQueue;
		},

		// Includes some event props shared by KeyEvent and MouseEvent
		props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

		fixHooks: {},

		keyHooks: {
			props: "char charCode key keyCode".split(" "),
			filter: function( event, original ) {

				// Add which for key events
				if ( event.which == null ) {
					event.which = original.charCode != null ? original.charCode : original.keyCode;
				}

				return event;
			}
		},

		mouseHooks: {
			props: "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
			filter: function( event, original ) {
				var eventDoc, doc, body,
					button = original.button;

				// Calculate pageX/Y if missing and clientX/Y available
				if ( event.pageX == null && original.clientX != null ) {
					eventDoc = event.target.ownerDocument || document;
					doc = eventDoc.documentElement;
					body = eventDoc.body;

					event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
					event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
				}

				// Add which for click: 1 === left; 2 === middle; 3 === right
				// Note: button is not normalized, so don't use it
				if ( !event.which && button !== undefined ) {
					event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
				}

				return event;
			}
		},

		fix: function( event ) {
			if ( event[ jQuery.expando ] ) {
				return event;
			}

			// Create a writable copy of the event object and normalize some properties
			var i, prop, copy,
				type = event.type,
				originalEvent = event,
				fixHook = this.fixHooks[ type ];

			if ( !fixHook ) {
				this.fixHooks[ type ] = fixHook =
					rmouseEvent.test( type ) ? this.mouseHooks :
					rkeyEvent.test( type ) ? this.keyHooks :
					{};
			}
			copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

			event = new jQuery.Event( originalEvent );

			i = copy.length;
			while ( i-- ) {
				prop = copy[ i ];
				event[ prop ] = originalEvent[ prop ];
			}

			// Support: Cordova 2.5 (WebKit) (#13255)
			// All events should have a target; Cordova deviceready doesn't
			if ( !event.target ) {
				event.target = document;
			}

			// Support: Safari 6.0+, Chrome<28
			// Target should not be a text node (#504, #13143)
			if ( event.target.nodeType === 3 ) {
				event.target = event.target.parentNode;
			}

			return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
		},

		special: {
			load: {
				// Prevent triggered image.load events from bubbling to window.load
				noBubble: true
			},
			focus: {
				// Fire native event if possible so blur/focus sequence is correct
				trigger: function() {
					if ( this !== safeActiveElement() && this.focus ) {
						this.focus();
						return false;
					}
				},
				delegateType: "focusin"
			},
			blur: {
				trigger: function() {
					if ( this === safeActiveElement() && this.blur ) {
						this.blur();
						return false;
					}
				},
				delegateType: "focusout"
			},
			click: {
				// For checkbox, fire native event so checked state will be right
				trigger: function() {
					if ( this.type === "checkbox" && this.click && jQuery.nodeName( this, "input" ) ) {
						this.click();
						return false;
					}
				},

				// For cross-browser consistency, don't fire native .click() on links
				_default: function( event ) {
					return jQuery.nodeName( event.target, "a" );
				}
			},

			beforeunload: {
				postDispatch: function( event ) {

					// Support: Firefox 20+
					// Firefox doesn't alert if the returnValue field is not set.
					if ( event.result !== undefined && event.originalEvent ) {
						event.originalEvent.returnValue = event.result;
					}
				}
			}
		},

		simulate: function( type, elem, event, bubble ) {
			// Piggyback on a donor event to simulate a different one.
			// Fake originalEvent to avoid donor's stopPropagation, but if the
			// simulated event prevents default then we do the same on the donor.
			var e = jQuery.extend(
				new jQuery.Event(),
				event,
				{
					type: type,
					isSimulated: true,
					originalEvent: {}
				}
			);
			if ( bubble ) {
				jQuery.event.trigger( e, null, elem );
			} else {
				jQuery.event.dispatch.call( elem, e );
			}
			if ( e.isDefaultPrevented() ) {
				event.preventDefault();
			}
		}
	};

	jQuery.removeEvent = function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	};

	jQuery.Event = function( src, props ) {
		// Allow instantiation without the 'new' keyword
		if ( !(this instanceof jQuery.Event) ) {
			return new jQuery.Event( src, props );
		}

		// Event object
		if ( src && src.type ) {
			this.originalEvent = src;
			this.type = src.type;

			// Events bubbling up the document may have been marked as prevented
			// by a handler lower down the tree; reflect the correct value.
			this.isDefaultPrevented = src.defaultPrevented ||
					src.defaultPrevented === undefined &&
					// Support: Android<4.0
					src.returnValue === false ?
				returnTrue :
				returnFalse;

		// Event type
		} else {
			this.type = src;
		}

		// Put explicitly provided properties onto the event object
		if ( props ) {
			jQuery.extend( this, props );
		}

		// Create a timestamp if incoming event doesn't have one
		this.timeStamp = src && src.timeStamp || jQuery.now();

		// Mark it as fixed
		this[ jQuery.expando ] = true;
	};

	// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
	// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
	jQuery.Event.prototype = {
		isDefaultPrevented: returnFalse,
		isPropagationStopped: returnFalse,
		isImmediatePropagationStopped: returnFalse,

		preventDefault: function() {
			var e = this.originalEvent;

			this.isDefaultPrevented = returnTrue;

			if ( e && e.preventDefault ) {
				e.preventDefault();
			}
		},
		stopPropagation: function() {
			var e = this.originalEvent;

			this.isPropagationStopped = returnTrue;

			if ( e && e.stopPropagation ) {
				e.stopPropagation();
			}
		},
		stopImmediatePropagation: function() {
			var e = this.originalEvent;

			this.isImmediatePropagationStopped = returnTrue;

			if ( e && e.stopImmediatePropagation ) {
				e.stopImmediatePropagation();
			}

			this.stopPropagation();
		}
	};

	// Create mouseenter/leave events using mouseover/out and event-time checks
	// Support: Chrome 15+
	jQuery.each({
		mouseenter: "mouseover",
		mouseleave: "mouseout",
		pointerenter: "pointerover",
		pointerleave: "pointerout"
	}, function( orig, fix ) {
		jQuery.event.special[ orig ] = {
			delegateType: fix,
			bindType: fix,

			handle: function( event ) {
				var ret,
					target = this,
					related = event.relatedTarget,
					handleObj = event.handleObj;

				// For mousenter/leave call the handler if related is outside the target.
				// NB: No relatedTarget if the mouse left/entered the browser window
				if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
					event.type = handleObj.origType;
					ret = handleObj.handler.apply( this, arguments );
					event.type = fix;
				}
				return ret;
			}
		};
	});

	// Support: Firefox, Chrome, Safari
	// Create "bubbling" focus and blur events
	if ( !support.focusinBubbles ) {
		jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

			// Attach a single capturing handler on the document while someone wants focusin/focusout
			var handler = function( event ) {
					jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
				};

			jQuery.event.special[ fix ] = {
				setup: function() {
					var doc = this.ownerDocument || this,
						attaches = data_priv.access( doc, fix );

					if ( !attaches ) {
						doc.addEventListener( orig, handler, true );
					}
					data_priv.access( doc, fix, ( attaches || 0 ) + 1 );
				},
				teardown: function() {
					var doc = this.ownerDocument || this,
						attaches = data_priv.access( doc, fix ) - 1;

					if ( !attaches ) {
						doc.removeEventListener( orig, handler, true );
						data_priv.remove( doc, fix );

					} else {
						data_priv.access( doc, fix, attaches );
					}
				}
			};
		});
	}

	jQuery.fn.extend({

		on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
			var origFn, type;

			// Types can be a map of types/handlers
			if ( typeof types === "object" ) {
				// ( types-Object, selector, data )
				if ( typeof selector !== "string" ) {
					// ( types-Object, data )
					data = data || selector;
					selector = undefined;
				}
				for ( type in types ) {
					this.on( type, selector, data, types[ type ], one );
				}
				return this;
			}

			if ( data == null && fn == null ) {
				// ( types, fn )
				fn = selector;
				data = selector = undefined;
			} else if ( fn == null ) {
				if ( typeof selector === "string" ) {
					// ( types, selector, fn )
					fn = data;
					data = undefined;
				} else {
					// ( types, data, fn )
					fn = data;
					data = selector;
					selector = undefined;
				}
			}
			if ( fn === false ) {
				fn = returnFalse;
			} else if ( !fn ) {
				return this;
			}

			if ( one === 1 ) {
				origFn = fn;
				fn = function( event ) {
					// Can use an empty set, since event contains the info
					jQuery().off( event );
					return origFn.apply( this, arguments );
				};
				// Use same guid so caller can remove using origFn
				fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
			}
			return this.each( function() {
				jQuery.event.add( this, types, fn, data, selector );
			});
		},
		one: function( types, selector, data, fn ) {
			return this.on( types, selector, data, fn, 1 );
		},
		off: function( types, selector, fn ) {
			var handleObj, type;
			if ( types && types.preventDefault && types.handleObj ) {
				// ( event )  dispatched jQuery.Event
				handleObj = types.handleObj;
				jQuery( types.delegateTarget ).off(
					handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
					handleObj.selector,
					handleObj.handler
				);
				return this;
			}
			if ( typeof types === "object" ) {
				// ( types-object [, selector] )
				for ( type in types ) {
					this.off( type, selector, types[ type ] );
				}
				return this;
			}
			if ( selector === false || typeof selector === "function" ) {
				// ( types [, fn] )
				fn = selector;
				selector = undefined;
			}
			if ( fn === false ) {
				fn = returnFalse;
			}
			return this.each(function() {
				jQuery.event.remove( this, types, fn, selector );
			});
		},

		trigger: function( type, data ) {
			return this.each(function() {
				jQuery.event.trigger( type, data, this );
			});
		},
		triggerHandler: function( type, data ) {
			var elem = this[0];
			if ( elem ) {
				return jQuery.event.trigger( type, data, elem, true );
			}
		}
	});


	var
		rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
		rtagName = /<([\w:]+)/,
		rhtml = /<|&#?\w+;/,
		rnoInnerhtml = /<(?:script|style|link)/i,
		// checked="checked" or checked
		rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
		rscriptType = /^$|\/(?:java|ecma)script/i,
		rscriptTypeMasked = /^true\/(.*)/,
		rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

		// We have to close these tags to support XHTML (#13200)
		wrapMap = {

			// Support: IE9
			option: [ 1, "<select multiple='multiple'>", "</select>" ],

			thead: [ 1, "<table>", "</table>" ],
			col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
			tr: [ 2, "<table><tbody>", "</tbody></table>" ],
			td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

			_default: [ 0, "", "" ]
		};

	// Support: IE9
	wrapMap.optgroup = wrapMap.option;

	wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
	wrapMap.th = wrapMap.td;

	// Support: 1.x compatibility
	// Manipulating tables requires a tbody
	function manipulationTarget( elem, content ) {
		return jQuery.nodeName( elem, "table" ) &&
			jQuery.nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ?

			elem.getElementsByTagName("tbody")[0] ||
				elem.appendChild( elem.ownerDocument.createElement("tbody") ) :
			elem;
	}

	// Replace/restore the type attribute of script elements for safe DOM manipulation
	function disableScript( elem ) {
		elem.type = (elem.getAttribute("type") !== null) + "/" + elem.type;
		return elem;
	}
	function restoreScript( elem ) {
		var match = rscriptTypeMasked.exec( elem.type );

		if ( match ) {
			elem.type = match[ 1 ];
		} else {
			elem.removeAttribute("type");
		}

		return elem;
	}

	// Mark scripts as having already been evaluated
	function setGlobalEval( elems, refElements ) {
		var i = 0,
			l = elems.length;

		for ( ; i < l; i++ ) {
			data_priv.set(
				elems[ i ], "globalEval", !refElements || data_priv.get( refElements[ i ], "globalEval" )
			);
		}
	}

	function cloneCopyEvent( src, dest ) {
		var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

		if ( dest.nodeType !== 1 ) {
			return;
		}

		// 1. Copy private data: events, handlers, etc.
		if ( data_priv.hasData( src ) ) {
			pdataOld = data_priv.access( src );
			pdataCur = data_priv.set( dest, pdataOld );
			events = pdataOld.events;

			if ( events ) {
				delete pdataCur.handle;
				pdataCur.events = {};

				for ( type in events ) {
					for ( i = 0, l = events[ type ].length; i < l; i++ ) {
						jQuery.event.add( dest, type, events[ type ][ i ] );
					}
				}
			}
		}

		// 2. Copy user data
		if ( data_user.hasData( src ) ) {
			udataOld = data_user.access( src );
			udataCur = jQuery.extend( {}, udataOld );

			data_user.set( dest, udataCur );
		}
	}

	function getAll( context, tag ) {
		var ret = context.getElementsByTagName ? context.getElementsByTagName( tag || "*" ) :
				context.querySelectorAll ? context.querySelectorAll( tag || "*" ) :
				[];

		return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
			jQuery.merge( [ context ], ret ) :
			ret;
	}

	// Fix IE bugs, see support tests
	function fixInput( src, dest ) {
		var nodeName = dest.nodeName.toLowerCase();

		// Fails to persist the checked state of a cloned checkbox or radio button.
		if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
			dest.checked = src.checked;

		// Fails to return the selected option to the default selected state when cloning options
		} else if ( nodeName === "input" || nodeName === "textarea" ) {
			dest.defaultValue = src.defaultValue;
		}
	}

	jQuery.extend({
		clone: function( elem, dataAndEvents, deepDataAndEvents ) {
			var i, l, srcElements, destElements,
				clone = elem.cloneNode( true ),
				inPage = jQuery.contains( elem.ownerDocument, elem );

			// Fix IE cloning issues
			if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
					!jQuery.isXMLDoc( elem ) ) {

				// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
				destElements = getAll( clone );
				srcElements = getAll( elem );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					fixInput( srcElements[ i ], destElements[ i ] );
				}
			}

			// Copy the events from the original to the clone
			if ( dataAndEvents ) {
				if ( deepDataAndEvents ) {
					srcElements = srcElements || getAll( elem );
					destElements = destElements || getAll( clone );

					for ( i = 0, l = srcElements.length; i < l; i++ ) {
						cloneCopyEvent( srcElements[ i ], destElements[ i ] );
					}
				} else {
					cloneCopyEvent( elem, clone );
				}
			}

			// Preserve script evaluation history
			destElements = getAll( clone, "script" );
			if ( destElements.length > 0 ) {
				setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
			}

			// Return the cloned set
			return clone;
		},

		buildFragment: function( elems, context, scripts, selection ) {
			var elem, tmp, tag, wrap, contains, j,
				fragment = context.createDocumentFragment(),
				nodes = [],
				i = 0,
				l = elems.length;

			for ( ; i < l; i++ ) {
				elem = elems[ i ];

				if ( elem || elem === 0 ) {

					// Add nodes directly
					if ( jQuery.type( elem ) === "object" ) {
						// Support: QtWebKit, PhantomJS
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

					// Convert non-html into a text node
					} else if ( !rhtml.test( elem ) ) {
						nodes.push( context.createTextNode( elem ) );

					// Convert html into DOM nodes
					} else {
						tmp = tmp || fragment.appendChild( context.createElement("div") );

						// Deserialize a standard representation
						tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
						wrap = wrapMap[ tag ] || wrapMap._default;
						tmp.innerHTML = wrap[ 1 ] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[ 2 ];

						// Descend through wrappers to the right content
						j = wrap[ 0 ];
						while ( j-- ) {
							tmp = tmp.lastChild;
						}

						// Support: QtWebKit, PhantomJS
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge( nodes, tmp.childNodes );

						// Remember the top-level container
						tmp = fragment.firstChild;

						// Ensure the created nodes are orphaned (#12392)
						tmp.textContent = "";
					}
				}
			}

			// Remove wrapper from fragment
			fragment.textContent = "";

			i = 0;
			while ( (elem = nodes[ i++ ]) ) {

				// #4087 - If origin and destination elements are the same, and this is
				// that element, do not do anything
				if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
					continue;
				}

				contains = jQuery.contains( elem.ownerDocument, elem );

				// Append to fragment
				tmp = getAll( fragment.appendChild( elem ), "script" );

				// Preserve script evaluation history
				if ( contains ) {
					setGlobalEval( tmp );
				}

				// Capture executables
				if ( scripts ) {
					j = 0;
					while ( (elem = tmp[ j++ ]) ) {
						if ( rscriptType.test( elem.type || "" ) ) {
							scripts.push( elem );
						}
					}
				}
			}

			return fragment;
		},

		cleanData: function( elems ) {
			var data, elem, type, key,
				special = jQuery.event.special,
				i = 0;

			for ( ; (elem = elems[ i ]) !== undefined; i++ ) {
				if ( jQuery.acceptData( elem ) ) {
					key = elem[ data_priv.expando ];

					if ( key && (data = data_priv.cache[ key ]) ) {
						if ( data.events ) {
							for ( type in data.events ) {
								if ( special[ type ] ) {
									jQuery.event.remove( elem, type );

								// This is a shortcut to avoid jQuery.event.remove's overhead
								} else {
									jQuery.removeEvent( elem, type, data.handle );
								}
							}
						}
						if ( data_priv.cache[ key ] ) {
							// Discard any remaining `private` data
							delete data_priv.cache[ key ];
						}
					}
				}
				// Discard any remaining `user` data
				delete data_user.cache[ elem[ data_user.expando ] ];
			}
		}
	});

	jQuery.fn.extend({
		text: function( value ) {
			return access( this, function( value ) {
				return value === undefined ?
					jQuery.text( this ) :
					this.empty().each(function() {
						if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
							this.textContent = value;
						}
					});
			}, null, value, arguments.length );
		},

		append: function() {
			return this.domManip( arguments, function( elem ) {
				if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
					var target = manipulationTarget( this, elem );
					target.appendChild( elem );
				}
			});
		},

		prepend: function() {
			return this.domManip( arguments, function( elem ) {
				if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
					var target = manipulationTarget( this, elem );
					target.insertBefore( elem, target.firstChild );
				}
			});
		},

		before: function() {
			return this.domManip( arguments, function( elem ) {
				if ( this.parentNode ) {
					this.parentNode.insertBefore( elem, this );
				}
			});
		},

		after: function() {
			return this.domManip( arguments, function( elem ) {
				if ( this.parentNode ) {
					this.parentNode.insertBefore( elem, this.nextSibling );
				}
			});
		},

		remove: function( selector, keepData /* Internal Use Only */ ) {
			var elem,
				elems = selector ? jQuery.filter( selector, this ) : this,
				i = 0;

			for ( ; (elem = elems[i]) != null; i++ ) {
				if ( !keepData && elem.nodeType === 1 ) {
					jQuery.cleanData( getAll( elem ) );
				}

				if ( elem.parentNode ) {
					if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
						setGlobalEval( getAll( elem, "script" ) );
					}
					elem.parentNode.removeChild( elem );
				}
			}

			return this;
		},

		empty: function() {
			var elem,
				i = 0;

			for ( ; (elem = this[i]) != null; i++ ) {
				if ( elem.nodeType === 1 ) {

					// Prevent memory leaks
					jQuery.cleanData( getAll( elem, false ) );

					// Remove any remaining nodes
					elem.textContent = "";
				}
			}

			return this;
		},

		clone: function( dataAndEvents, deepDataAndEvents ) {
			dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
			deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

			return this.map(function() {
				return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
			});
		},

		html: function( value ) {
			return access( this, function( value ) {
				var elem = this[ 0 ] || {},
					i = 0,
					l = this.length;

				if ( value === undefined && elem.nodeType === 1 ) {
					return elem.innerHTML;
				}

				// See if we can take a shortcut and just use innerHTML
				if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
					!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

					value = value.replace( rxhtmlTag, "<$1></$2>" );

					try {
						for ( ; i < l; i++ ) {
							elem = this[ i ] || {};

							// Remove element nodes and prevent memory leaks
							if ( elem.nodeType === 1 ) {
								jQuery.cleanData( getAll( elem, false ) );
								elem.innerHTML = value;
							}
						}

						elem = 0;

					// If using innerHTML throws an exception, use the fallback method
					} catch( e ) {}
				}

				if ( elem ) {
					this.empty().append( value );
				}
			}, null, value, arguments.length );
		},

		replaceWith: function() {
			var arg = arguments[ 0 ];

			// Make the changes, replacing each context element with the new content
			this.domManip( arguments, function( elem ) {
				arg = this.parentNode;

				jQuery.cleanData( getAll( this ) );

				if ( arg ) {
					arg.replaceChild( elem, this );
				}
			});

			// Force removal if there was no new content (e.g., from empty arguments)
			return arg && (arg.length || arg.nodeType) ? this : this.remove();
		},

		detach: function( selector ) {
			return this.remove( selector, true );
		},

		domManip: function( args, callback ) {

			// Flatten any nested arrays
			args = concat.apply( [], args );

			var fragment, first, scripts, hasScripts, node, doc,
				i = 0,
				l = this.length,
				set = this,
				iNoClone = l - 1,
				value = args[ 0 ],
				isFunction = jQuery.isFunction( value );

			// We can't cloneNode fragments that contain checked, in WebKit
			if ( isFunction ||
					( l > 1 && typeof value === "string" &&
						!support.checkClone && rchecked.test( value ) ) ) {
				return this.each(function( index ) {
					var self = set.eq( index );
					if ( isFunction ) {
						args[ 0 ] = value.call( this, index, self.html() );
					}
					self.domManip( args, callback );
				});
			}

			if ( l ) {
				fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, this );
				first = fragment.firstChild;

				if ( fragment.childNodes.length === 1 ) {
					fragment = first;
				}

				if ( first ) {
					scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
					hasScripts = scripts.length;

					// Use the original fragment for the last item instead of the first because it can end up
					// being emptied incorrectly in certain situations (#8070).
					for ( ; i < l; i++ ) {
						node = fragment;

						if ( i !== iNoClone ) {
							node = jQuery.clone( node, true, true );

							// Keep references to cloned scripts for later restoration
							if ( hasScripts ) {
								// Support: QtWebKit
								// jQuery.merge because push.apply(_, arraylike) throws
								jQuery.merge( scripts, getAll( node, "script" ) );
							}
						}

						callback.call( this[ i ], node, i );
					}

					if ( hasScripts ) {
						doc = scripts[ scripts.length - 1 ].ownerDocument;

						// Reenable scripts
						jQuery.map( scripts, restoreScript );

						// Evaluate executable scripts on first document insertion
						for ( i = 0; i < hasScripts; i++ ) {
							node = scripts[ i ];
							if ( rscriptType.test( node.type || "" ) &&
								!data_priv.access( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

								if ( node.src ) {
									// Optional AJAX dependency, but won't run scripts if not present
									if ( jQuery._evalUrl ) {
										jQuery._evalUrl( node.src );
									}
								} else {
									jQuery.globalEval( node.textContent.replace( rcleanScript, "" ) );
								}
							}
						}
					}
				}
			}

			return this;
		}
	});

	jQuery.each({
		appendTo: "append",
		prependTo: "prepend",
		insertBefore: "before",
		insertAfter: "after",
		replaceAll: "replaceWith"
	}, function( name, original ) {
		jQuery.fn[ name ] = function( selector ) {
			var elems,
				ret = [],
				insert = jQuery( selector ),
				last = insert.length - 1,
				i = 0;

			for ( ; i <= last; i++ ) {
				elems = i === last ? this : this.clone( true );
				jQuery( insert[ i ] )[ original ]( elems );

				// Support: QtWebKit
				// .get() because push.apply(_, arraylike) throws
				push.apply( ret, elems.get() );
			}

			return this.pushStack( ret );
		};
	});


	var iframe,
		elemdisplay = {};

	/**
	 * Retrieve the actual display of a element
	 * @param {String} name nodeName of the element
	 * @param {Object} doc Document object
	 */
	// Called only from within defaultDisplay
	function actualDisplay( name, doc ) {
		var style,
			elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),

			// getDefaultComputedStyle might be reliably used only on attached element
			display = window.getDefaultComputedStyle && ( style = window.getDefaultComputedStyle( elem[ 0 ] ) ) ?

				// Use of this method is a temporary fix (more like optimization) until something better comes along,
				// since it was removed from specification and supported only in FF
				style.display : jQuery.css( elem[ 0 ], "display" );

		// We don't have any data stored on the element,
		// so use "detach" method as fast way to get rid of the element
		elem.detach();

		return display;
	}

	/**
	 * Try to determine the default display value of an element
	 * @param {String} nodeName
	 */
	function defaultDisplay( nodeName ) {
		var doc = document,
			display = elemdisplay[ nodeName ];

		if ( !display ) {
			display = actualDisplay( nodeName, doc );

			// If the simple way fails, read from inside an iframe
			if ( display === "none" || !display ) {

				// Use the already-created iframe if possible
				iframe = (iframe || jQuery( "<iframe frameborder='0' width='0' height='0'/>" )).appendTo( doc.documentElement );

				// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
				doc = iframe[ 0 ].contentDocument;

				// Support: IE
				doc.write();
				doc.close();

				display = actualDisplay( nodeName, doc );
				iframe.detach();
			}

			// Store the correct default display
			elemdisplay[ nodeName ] = display;
		}

		return display;
	}
	var rmargin = (/^margin/);

	var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

	var getStyles = function( elem ) {
			// Support: IE<=11+, Firefox<=30+ (#15098, #14150)
			// IE throws on elements created in popups
			// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
			if ( elem.ownerDocument.defaultView.opener ) {
				return elem.ownerDocument.defaultView.getComputedStyle( elem, null );
			}

			return window.getComputedStyle( elem, null );
		};



	function curCSS( elem, name, computed ) {
		var width, minWidth, maxWidth, ret,
			style = elem.style;

		computed = computed || getStyles( elem );

		// Support: IE9
		// getPropertyValue is only needed for .css('filter') (#12537)
		if ( computed ) {
			ret = computed.getPropertyValue( name ) || computed[ name ];
		}

		if ( computed ) {

			if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
				ret = jQuery.style( elem, name );
			}

			// Support: iOS < 6
			// A tribute to the "awesome hack by Dean Edwards"
			// iOS < 6 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
			// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
			if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		return ret !== undefined ?
			// Support: IE
			// IE returns zIndex value as an integer.
			ret + "" :
			ret;
	}


	function addGetHookIf( conditionFn, hookFn ) {
		// Define the hook, we'll check on the first run if it's really needed.
		return {
			get: function() {
				if ( conditionFn() ) {
					// Hook not needed (or it's not possible to use it due
					// to missing dependency), remove it.
					delete this.get;
					return;
				}

				// Hook needed; redefine it so that the support test is not executed again.
				return (this.get = hookFn).apply( this, arguments );
			}
		};
	}


	(function() {
		var pixelPositionVal, boxSizingReliableVal,
			docElem = document.documentElement,
			container = document.createElement( "div" ),
			div = document.createElement( "div" );

		if ( !div.style ) {
			return;
		}

		// Support: IE9-11+
		// Style of cloned element affects source element cloned (#8908)
		div.style.backgroundClip = "content-box";
		div.cloneNode( true ).style.backgroundClip = "";
		support.clearCloneStyle = div.style.backgroundClip === "content-box";

		container.style.cssText = "border:0;width:0;height:0;top:0;left:-9999px;margin-top:1px;" +
			"position:absolute";
		container.appendChild( div );

		// Executing both pixelPosition & boxSizingReliable tests require only one layout
		// so they're executed at the same time to save the second computation.
		function computePixelPositionAndBoxSizingReliable() {
			div.style.cssText =
				// Support: Firefox<29, Android 2.3
				// Vendor-prefix box-sizing
				"-webkit-box-sizing:border-box;-moz-box-sizing:border-box;" +
				"box-sizing:border-box;display:block;margin-top:1%;top:1%;" +
				"border:1px;padding:1px;width:4px;position:absolute";
			div.innerHTML = "";
			docElem.appendChild( container );

			var divStyle = window.getComputedStyle( div, null );
			pixelPositionVal = divStyle.top !== "1%";
			boxSizingReliableVal = divStyle.width === "4px";

			docElem.removeChild( container );
		}

		// Support: node.js jsdom
		// Don't assume that getComputedStyle is a property of the global object
		if ( window.getComputedStyle ) {
			jQuery.extend( support, {
				pixelPosition: function() {

					// This test is executed only once but we still do memoizing
					// since we can use the boxSizingReliable pre-computing.
					// No need to check if the test was already performed, though.
					computePixelPositionAndBoxSizingReliable();
					return pixelPositionVal;
				},
				boxSizingReliable: function() {
					if ( boxSizingReliableVal == null ) {
						computePixelPositionAndBoxSizingReliable();
					}
					return boxSizingReliableVal;
				},
				reliableMarginRight: function() {

					// Support: Android 2.3
					// Check if div with explicit width and no margin-right incorrectly
					// gets computed margin-right based on width of container. (#3333)
					// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
					// This support function is only executed once so no memoizing is needed.
					var ret,
						marginDiv = div.appendChild( document.createElement( "div" ) );

					// Reset CSS: box-sizing; display; margin; border; padding
					marginDiv.style.cssText = div.style.cssText =
						// Support: Firefox<29, Android 2.3
						// Vendor-prefix box-sizing
						"-webkit-box-sizing:content-box;-moz-box-sizing:content-box;" +
						"box-sizing:content-box;display:block;margin:0;border:0;padding:0";
					marginDiv.style.marginRight = marginDiv.style.width = "0";
					div.style.width = "1px";
					docElem.appendChild( container );

					ret = !parseFloat( window.getComputedStyle( marginDiv, null ).marginRight );

					docElem.removeChild( container );
					div.removeChild( marginDiv );

					return ret;
				}
			});
		}
	})();


	// A method for quickly swapping in/out CSS properties to get correct calculations.
	jQuery.swap = function( elem, options, callback, args ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.apply( elem, args || [] );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	};


	var
		// Swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
		// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
		rdisplayswap = /^(none|table(?!-c[ea]).+)/,
		rnumsplit = new RegExp( "^(" + pnum + ")(.*)$", "i" ),
		rrelNum = new RegExp( "^([+-])=(" + pnum + ")", "i" ),

		cssShow = { position: "absolute", visibility: "hidden", display: "block" },
		cssNormalTransform = {
			letterSpacing: "0",
			fontWeight: "400"
		},

		cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

	// Return a css property mapped to a potentially vendor prefixed property
	function vendorPropName( style, name ) {

		// Shortcut for names that are not vendor prefixed
		if ( name in style ) {
			return name;
		}

		// Check for vendor prefixed names
		var capName = name[0].toUpperCase() + name.slice(1),
			origName = name,
			i = cssPrefixes.length;

		while ( i-- ) {
			name = cssPrefixes[ i ] + capName;
			if ( name in style ) {
				return name;
			}
		}

		return origName;
	}

	function setPositiveNumber( elem, value, subtract ) {
		var matches = rnumsplit.exec( value );
		return matches ?
			// Guard against undefined "subtract", e.g., when used as in cssHooks
			Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
			value;
	}

	function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
		var i = extra === ( isBorderBox ? "border" : "content" ) ?
			// If we already have the right measurement, avoid augmentation
			4 :
			// Otherwise initialize for horizontal or vertical properties
			name === "width" ? 1 : 0,

			val = 0;

		for ( ; i < 4; i += 2 ) {
			// Both box models exclude margin, so add it if we want it
			if ( extra === "margin" ) {
				val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
			}

			if ( isBorderBox ) {
				// border-box includes padding, so remove it if we want content
				if ( extra === "content" ) {
					val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
				}

				// At this point, extra isn't border nor margin, so remove border
				if ( extra !== "margin" ) {
					val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
				}
			} else {
				// At this point, extra isn't content, so add padding
				val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

				// At this point, extra isn't content nor padding, so add border
				if ( extra !== "padding" ) {
					val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
				}
			}
		}

		return val;
	}

	function getWidthOrHeight( elem, name, extra ) {

		// Start with offset property, which is equivalent to the border-box value
		var valueIsBorderBox = true,
			val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
			styles = getStyles( elem ),
			isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

		// Some non-html elements return undefined for offsetWidth, so check for null/undefined
		// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
		// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
		if ( val <= 0 || val == null ) {
			// Fall back to computed then uncomputed css if necessary
			val = curCSS( elem, name, styles );
			if ( val < 0 || val == null ) {
				val = elem.style[ name ];
			}

			// Computed unit is not pixels. Stop here and return.
			if ( rnumnonpx.test(val) ) {
				return val;
			}

			// Check for style in case a browser which returns unreliable values
			// for getComputedStyle silently falls back to the reliable elem.style
			valueIsBorderBox = isBorderBox &&
				( support.boxSizingReliable() || val === elem.style[ name ] );

			// Normalize "", auto, and prepare for extra
			val = parseFloat( val ) || 0;
		}

		// Use the active box-sizing model to add/subtract irrelevant styles
		return ( val +
			augmentWidthOrHeight(
				elem,
				name,
				extra || ( isBorderBox ? "border" : "content" ),
				valueIsBorderBox,
				styles
			)
		) + "px";
	}

	function showHide( elements, show ) {
		var display, elem, hidden,
			values = [],
			index = 0,
			length = elements.length;

		for ( ; index < length; index++ ) {
			elem = elements[ index ];
			if ( !elem.style ) {
				continue;
			}

			values[ index ] = data_priv.get( elem, "olddisplay" );
			display = elem.style.display;
			if ( show ) {
				// Reset the inline display of this element to learn if it is
				// being hidden by cascaded rules or not
				if ( !values[ index ] && display === "none" ) {
					elem.style.display = "";
				}

				// Set elements which have been overridden with display: none
				// in a stylesheet to whatever the default browser style is
				// for such an element
				if ( elem.style.display === "" && isHidden( elem ) ) {
					values[ index ] = data_priv.access( elem, "olddisplay", defaultDisplay(elem.nodeName) );
				}
			} else {
				hidden = isHidden( elem );

				if ( display !== "none" || !hidden ) {
					data_priv.set( elem, "olddisplay", hidden ? display : jQuery.css( elem, "display" ) );
				}
			}
		}

		// Set the display of most of the elements in a second loop
		// to avoid the constant reflow
		for ( index = 0; index < length; index++ ) {
			elem = elements[ index ];
			if ( !elem.style ) {
				continue;
			}
			if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
				elem.style.display = show ? values[ index ] || "" : "none";
			}
		}

		return elements;
	}

	jQuery.extend({

		// Add in style property hooks for overriding the default
		// behavior of getting and setting a style property
		cssHooks: {
			opacity: {
				get: function( elem, computed ) {
					if ( computed ) {

						// We should always get a number back from opacity
						var ret = curCSS( elem, "opacity" );
						return ret === "" ? "1" : ret;
					}
				}
			}
		},

		// Don't automatically add "px" to these possibly-unitless properties
		cssNumber: {
			"columnCount": true,
			"fillOpacity": true,
			"flexGrow": true,
			"flexShrink": true,
			"fontWeight": true,
			"lineHeight": true,
			"opacity": true,
			"order": true,
			"orphans": true,
			"widows": true,
			"zIndex": true,
			"zoom": true
		},

		// Add in properties whose names you wish to fix before
		// setting or getting the value
		cssProps: {
			"float": "cssFloat"
		},

		// Get and set the style property on a DOM Node
		style: function( elem, name, value, extra ) {

			// Don't set styles on text and comment nodes
			if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
				return;
			}

			// Make sure that we're working with the right name
			var ret, type, hooks,
				origName = jQuery.camelCase( name ),
				style = elem.style;

			name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

			// Gets hook for the prefixed version, then unprefixed version
			hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

			// Check if we're setting a value
			if ( value !== undefined ) {
				type = typeof value;

				// Convert "+=" or "-=" to relative numbers (#7345)
				if ( type === "string" && (ret = rrelNum.exec( value )) ) {
					value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
					// Fixes bug #9237
					type = "number";
				}

				// Make sure that null and NaN values aren't set (#7116)
				if ( value == null || value !== value ) {
					return;
				}

				// If a number, add 'px' to the (except for certain CSS properties)
				if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
					value += "px";
				}

				// Support: IE9-11+
				// background-* props affect original clone's values
				if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
					style[ name ] = "inherit";
				}

				// If a hook was provided, use that value, otherwise just set the specified value
				if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {
					style[ name ] = value;
				}

			} else {
				// If a hook was provided get the non-computed value from there
				if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
					return ret;
				}

				// Otherwise just get the value from the style object
				return style[ name ];
			}
		},

		css: function( elem, name, extra, styles ) {
			var val, num, hooks,
				origName = jQuery.camelCase( name );

			// Make sure that we're working with the right name
			name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

			// Try prefixed name followed by the unprefixed name
			hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

			// If a hook was provided get the computed value from there
			if ( hooks && "get" in hooks ) {
				val = hooks.get( elem, true, extra );
			}

			// Otherwise, if a way to get the computed value exists, use that
			if ( val === undefined ) {
				val = curCSS( elem, name, styles );
			}

			// Convert "normal" to computed value
			if ( val === "normal" && name in cssNormalTransform ) {
				val = cssNormalTransform[ name ];
			}

			// Make numeric if forced or a qualifier was provided and val looks numeric
			if ( extra === "" || extra ) {
				num = parseFloat( val );
				return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
			}
			return val;
		}
	});

	jQuery.each([ "height", "width" ], function( i, name ) {
		jQuery.cssHooks[ name ] = {
			get: function( elem, computed, extra ) {
				if ( computed ) {

					// Certain elements can have dimension info if we invisibly show them
					// but it must have a current display style that would benefit
					return rdisplayswap.test( jQuery.css( elem, "display" ) ) && elem.offsetWidth === 0 ?
						jQuery.swap( elem, cssShow, function() {
							return getWidthOrHeight( elem, name, extra );
						}) :
						getWidthOrHeight( elem, name, extra );
				}
			},

			set: function( elem, value, extra ) {
				var styles = extra && getStyles( elem );
				return setPositiveNumber( elem, value, extra ?
					augmentWidthOrHeight(
						elem,
						name,
						extra,
						jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
						styles
					) : 0
				);
			}
		};
	});

	// Support: Android 2.3
	jQuery.cssHooks.marginRight = addGetHookIf( support.reliableMarginRight,
		function( elem, computed ) {
			if ( computed ) {
				return jQuery.swap( elem, { "display": "inline-block" },
					curCSS, [ elem, "marginRight" ] );
			}
		}
	);

	// These hooks are used by animate to expand properties
	jQuery.each({
		margin: "",
		padding: "",
		border: "Width"
	}, function( prefix, suffix ) {
		jQuery.cssHooks[ prefix + suffix ] = {
			expand: function( value ) {
				var i = 0,
					expanded = {},

					// Assumes a single number if not a string
					parts = typeof value === "string" ? value.split(" ") : [ value ];

				for ( ; i < 4; i++ ) {
					expanded[ prefix + cssExpand[ i ] + suffix ] =
						parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
				}

				return expanded;
			}
		};

		if ( !rmargin.test( prefix ) ) {
			jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
		}
	});

	jQuery.fn.extend({
		css: function( name, value ) {
			return access( this, function( elem, name, value ) {
				var styles, len,
					map = {},
					i = 0;

				if ( jQuery.isArray( name ) ) {
					styles = getStyles( elem );
					len = name.length;

					for ( ; i < len; i++ ) {
						map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
					}

					return map;
				}

				return value !== undefined ?
					jQuery.style( elem, name, value ) :
					jQuery.css( elem, name );
			}, name, value, arguments.length > 1 );
		},
		show: function() {
			return showHide( this, true );
		},
		hide: function() {
			return showHide( this );
		},
		toggle: function( state ) {
			if ( typeof state === "boolean" ) {
				return state ? this.show() : this.hide();
			}

			return this.each(function() {
				if ( isHidden( this ) ) {
					jQuery( this ).show();
				} else {
					jQuery( this ).hide();
				}
			});
		}
	});


	function Tween( elem, options, prop, end, easing ) {
		return new Tween.prototype.init( elem, options, prop, end, easing );
	}
	jQuery.Tween = Tween;

	Tween.prototype = {
		constructor: Tween,
		init: function( elem, options, prop, end, easing, unit ) {
			this.elem = elem;
			this.prop = prop;
			this.easing = easing || "swing";
			this.options = options;
			this.start = this.now = this.cur();
			this.end = end;
			this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
		},
		cur: function() {
			var hooks = Tween.propHooks[ this.prop ];

			return hooks && hooks.get ?
				hooks.get( this ) :
				Tween.propHooks._default.get( this );
		},
		run: function( percent ) {
			var eased,
				hooks = Tween.propHooks[ this.prop ];

			if ( this.options.duration ) {
				this.pos = eased = jQuery.easing[ this.easing ](
					percent, this.options.duration * percent, 0, 1, this.options.duration
				);
			} else {
				this.pos = eased = percent;
			}
			this.now = ( this.end - this.start ) * eased + this.start;

			if ( this.options.step ) {
				this.options.step.call( this.elem, this.now, this );
			}

			if ( hooks && hooks.set ) {
				hooks.set( this );
			} else {
				Tween.propHooks._default.set( this );
			}
			return this;
		}
	};

	Tween.prototype.init.prototype = Tween.prototype;

	Tween.propHooks = {
		_default: {
			get: function( tween ) {
				var result;

				if ( tween.elem[ tween.prop ] != null &&
					(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
					return tween.elem[ tween.prop ];
				}

				// Passing an empty string as a 3rd parameter to .css will automatically
				// attempt a parseFloat and fallback to a string if the parse fails.
				// Simple values such as "10px" are parsed to Float;
				// complex values such as "rotate(1rad)" are returned as-is.
				result = jQuery.css( tween.elem, tween.prop, "" );
				// Empty strings, null, undefined and "auto" are converted to 0.
				return !result || result === "auto" ? 0 : result;
			},
			set: function( tween ) {
				// Use step hook for back compat.
				// Use cssHook if its there.
				// Use .style if available and use plain properties where available.
				if ( jQuery.fx.step[ tween.prop ] ) {
					jQuery.fx.step[ tween.prop ]( tween );
				} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
					jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
				} else {
					tween.elem[ tween.prop ] = tween.now;
				}
			}
		}
	};

	// Support: IE9
	// Panic based approach to setting things on disconnected nodes
	Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
		set: function( tween ) {
			if ( tween.elem.nodeType && tween.elem.parentNode ) {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	};

	jQuery.easing = {
		linear: function( p ) {
			return p;
		},
		swing: function( p ) {
			return 0.5 - Math.cos( p * Math.PI ) / 2;
		}
	};

	jQuery.fx = Tween.prototype.init;

	// Back Compat <1.8 extension point
	jQuery.fx.step = {};




	var
		fxNow, timerId,
		rfxtypes = /^(?:toggle|show|hide)$/,
		rfxnum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" ),
		rrun = /queueHooks$/,
		animationPrefilters = [ defaultPrefilter ],
		tweeners = {
			"*": [ function( prop, value ) {
				var tween = this.createTween( prop, value ),
					target = tween.cur(),
					parts = rfxnum.exec( value ),
					unit = parts && parts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

					// Starting value computation is required for potential unit mismatches
					start = ( jQuery.cssNumber[ prop ] || unit !== "px" && +target ) &&
						rfxnum.exec( jQuery.css( tween.elem, prop ) ),
					scale = 1,
					maxIterations = 20;

				if ( start && start[ 3 ] !== unit ) {
					// Trust units reported by jQuery.css
					unit = unit || start[ 3 ];

					// Make sure we update the tween properties later on
					parts = parts || [];

					// Iteratively approximate from a nonzero starting point
					start = +target || 1;

					do {
						// If previous iteration zeroed out, double until we get *something*.
						// Use string for doubling so we don't accidentally see scale as unchanged below
						scale = scale || ".5";

						// Adjust and apply
						start = start / scale;
						jQuery.style( tween.elem, prop, start + unit );

					// Update scale, tolerating zero or NaN from tween.cur(),
					// break the loop if scale is unchanged or perfect, or if we've just had enough
					} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
				}

				// Update tween properties
				if ( parts ) {
					start = tween.start = +start || +target || 0;
					tween.unit = unit;
					// If a +=/-= token was provided, we're doing a relative animation
					tween.end = parts[ 1 ] ?
						start + ( parts[ 1 ] + 1 ) * parts[ 2 ] :
						+parts[ 2 ];
				}

				return tween;
			} ]
		};

	// Animations created synchronously will run synchronously
	function createFxNow() {
		setTimeout(function() {
			fxNow = undefined;
		});
		return ( fxNow = jQuery.now() );
	}

	// Generate parameters to create a standard animation
	function genFx( type, includeWidth ) {
		var which,
			i = 0,
			attrs = { height: type };

		// If we include width, step value is 1 to do all cssExpand values,
		// otherwise step value is 2 to skip over Left and Right
		includeWidth = includeWidth ? 1 : 0;
		for ( ; i < 4 ; i += 2 - includeWidth ) {
			which = cssExpand[ i ];
			attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
		}

		if ( includeWidth ) {
			attrs.opacity = attrs.width = type;
		}

		return attrs;
	}

	function createTween( value, prop, animation ) {
		var tween,
			collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
			index = 0,
			length = collection.length;
		for ( ; index < length; index++ ) {
			if ( (tween = collection[ index ].call( animation, prop, value )) ) {

				// We're done with this property
				return tween;
			}
		}
	}

	function defaultPrefilter( elem, props, opts ) {
		/* jshint validthis: true */
		var prop, value, toggle, tween, hooks, oldfire, display, checkDisplay,
			anim = this,
			orig = {},
			style = elem.style,
			hidden = elem.nodeType && isHidden( elem ),
			dataShow = data_priv.get( elem, "fxshow" );

		// Handle queue: false promises
		if ( !opts.queue ) {
			hooks = jQuery._queueHooks( elem, "fx" );
			if ( hooks.unqueued == null ) {
				hooks.unqueued = 0;
				oldfire = hooks.empty.fire;
				hooks.empty.fire = function() {
					if ( !hooks.unqueued ) {
						oldfire();
					}
				};
			}
			hooks.unqueued++;

			anim.always(function() {
				// Ensure the complete handler is called before this completes
				anim.always(function() {
					hooks.unqueued--;
					if ( !jQuery.queue( elem, "fx" ).length ) {
						hooks.empty.fire();
					}
				});
			});
		}

		// Height/width overflow pass
		if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
			// Make sure that nothing sneaks out
			// Record all 3 overflow attributes because IE9-10 do not
			// change the overflow attribute when overflowX and
			// overflowY are set to the same value
			opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

			// Set display property to inline-block for height/width
			// animations on inline elements that are having width/height animated
			display = jQuery.css( elem, "display" );

			// Test default display if display is currently "none"
			checkDisplay = display === "none" ?
				data_priv.get( elem, "olddisplay" ) || defaultDisplay( elem.nodeName ) : display;

			if ( checkDisplay === "inline" && jQuery.css( elem, "float" ) === "none" ) {
				style.display = "inline-block";
			}
		}

		if ( opts.overflow ) {
			style.overflow = "hidden";
			anim.always(function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			});
		}

		// show/hide pass
		for ( prop in props ) {
			value = props[ prop ];
			if ( rfxtypes.exec( value ) ) {
				delete props[ prop ];
				toggle = toggle || value === "toggle";
				if ( value === ( hidden ? "hide" : "show" ) ) {

					// If there is dataShow left over from a stopped hide or show and we are going to proceed with show, we should pretend to be hidden
					if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
						hidden = true;
					} else {
						continue;
					}
				}
				orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );

			// Any non-fx value stops us from restoring the original display value
			} else {
				display = undefined;
			}
		}

		if ( !jQuery.isEmptyObject( orig ) ) {
			if ( dataShow ) {
				if ( "hidden" in dataShow ) {
					hidden = dataShow.hidden;
				}
			} else {
				dataShow = data_priv.access( elem, "fxshow", {} );
			}

			// Store state if its toggle - enables .stop().toggle() to "reverse"
			if ( toggle ) {
				dataShow.hidden = !hidden;
			}
			if ( hidden ) {
				jQuery( elem ).show();
			} else {
				anim.done(function() {
					jQuery( elem ).hide();
				});
			}
			anim.done(function() {
				var prop;

				data_priv.remove( elem, "fxshow" );
				for ( prop in orig ) {
					jQuery.style( elem, prop, orig[ prop ] );
				}
			});
			for ( prop in orig ) {
				tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

				if ( !( prop in dataShow ) ) {
					dataShow[ prop ] = tween.start;
					if ( hidden ) {
						tween.end = tween.start;
						tween.start = prop === "width" || prop === "height" ? 1 : 0;
					}
				}
			}

		// If this is a noop like .hide().hide(), restore an overwritten display value
		} else if ( (display === "none" ? defaultDisplay( elem.nodeName ) : display) === "inline" ) {
			style.display = display;
		}
	}

	function propFilter( props, specialEasing ) {
		var index, name, easing, value, hooks;

		// camelCase, specialEasing and expand cssHook pass
		for ( index in props ) {
			name = jQuery.camelCase( index );
			easing = specialEasing[ name ];
			value = props[ index ];
			if ( jQuery.isArray( value ) ) {
				easing = value[ 1 ];
				value = props[ index ] = value[ 0 ];
			}

			if ( index !== name ) {
				props[ name ] = value;
				delete props[ index ];
			}

			hooks = jQuery.cssHooks[ name ];
			if ( hooks && "expand" in hooks ) {
				value = hooks.expand( value );
				delete props[ name ];

				// Not quite $.extend, this won't overwrite existing keys.
				// Reusing 'index' because we have the correct "name"
				for ( index in value ) {
					if ( !( index in props ) ) {
						props[ index ] = value[ index ];
						specialEasing[ index ] = easing;
					}
				}
			} else {
				specialEasing[ name ] = easing;
			}
		}
	}

	function Animation( elem, properties, options ) {
		var result,
			stopped,
			index = 0,
			length = animationPrefilters.length,
			deferred = jQuery.Deferred().always( function() {
				// Don't match elem in the :animated selector
				delete tick.elem;
			}),
			tick = function() {
				if ( stopped ) {
					return false;
				}
				var currentTime = fxNow || createFxNow(),
					remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
					// Support: Android 2.3
					// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
					temp = remaining / animation.duration || 0,
					percent = 1 - temp,
					index = 0,
					length = animation.tweens.length;

				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( percent );
				}

				deferred.notifyWith( elem, [ animation, percent, remaining ]);

				if ( percent < 1 && length ) {
					return remaining;
				} else {
					deferred.resolveWith( elem, [ animation ] );
					return false;
				}
			},
			animation = deferred.promise({
				elem: elem,
				props: jQuery.extend( {}, properties ),
				opts: jQuery.extend( true, { specialEasing: {} }, options ),
				originalProperties: properties,
				originalOptions: options,
				startTime: fxNow || createFxNow(),
				duration: options.duration,
				tweens: [],
				createTween: function( prop, end ) {
					var tween = jQuery.Tween( elem, animation.opts, prop, end,
							animation.opts.specialEasing[ prop ] || animation.opts.easing );
					animation.tweens.push( tween );
					return tween;
				},
				stop: function( gotoEnd ) {
					var index = 0,
						// If we are going to the end, we want to run all the tweens
						// otherwise we skip this part
						length = gotoEnd ? animation.tweens.length : 0;
					if ( stopped ) {
						return this;
					}
					stopped = true;
					for ( ; index < length ; index++ ) {
						animation.tweens[ index ].run( 1 );
					}

					// Resolve when we played the last frame; otherwise, reject
					if ( gotoEnd ) {
						deferred.resolveWith( elem, [ animation, gotoEnd ] );
					} else {
						deferred.rejectWith( elem, [ animation, gotoEnd ] );
					}
					return this;
				}
			}),
			props = animation.props;

		propFilter( props, animation.opts.specialEasing );

		for ( ; index < length ; index++ ) {
			result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
			if ( result ) {
				return result;
			}
		}

		jQuery.map( props, createTween, animation );

		if ( jQuery.isFunction( animation.opts.start ) ) {
			animation.opts.start.call( elem, animation );
		}

		jQuery.fx.timer(
			jQuery.extend( tick, {
				elem: elem,
				anim: animation,
				queue: animation.opts.queue
			})
		);

		// attach callbacks from options
		return animation.progress( animation.opts.progress )
			.done( animation.opts.done, animation.opts.complete )
			.fail( animation.opts.fail )
			.always( animation.opts.always );
	}

	jQuery.Animation = jQuery.extend( Animation, {

		tweener: function( props, callback ) {
			if ( jQuery.isFunction( props ) ) {
				callback = props;
				props = [ "*" ];
			} else {
				props = props.split(" ");
			}

			var prop,
				index = 0,
				length = props.length;

			for ( ; index < length ; index++ ) {
				prop = props[ index ];
				tweeners[ prop ] = tweeners[ prop ] || [];
				tweeners[ prop ].unshift( callback );
			}
		},

		prefilter: function( callback, prepend ) {
			if ( prepend ) {
				animationPrefilters.unshift( callback );
			} else {
				animationPrefilters.push( callback );
			}
		}
	});

	jQuery.speed = function( speed, easing, fn ) {
		var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
			complete: fn || !fn && easing ||
				jQuery.isFunction( speed ) && speed,
			duration: speed,
			easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
		};

		opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
			opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

		// Normalize opt.queue - true/undefined/null -> "fx"
		if ( opt.queue == null || opt.queue === true ) {
			opt.queue = "fx";
		}

		// Queueing
		opt.old = opt.complete;

		opt.complete = function() {
			if ( jQuery.isFunction( opt.old ) ) {
				opt.old.call( this );
			}

			if ( opt.queue ) {
				jQuery.dequeue( this, opt.queue );
			}
		};

		return opt;
	};

	jQuery.fn.extend({
		fadeTo: function( speed, to, easing, callback ) {

			// Show any hidden elements after setting opacity to 0
			return this.filter( isHidden ).css( "opacity", 0 ).show()

				// Animate to the value specified
				.end().animate({ opacity: to }, speed, easing, callback );
		},
		animate: function( prop, speed, easing, callback ) {
			var empty = jQuery.isEmptyObject( prop ),
				optall = jQuery.speed( speed, easing, callback ),
				doAnimation = function() {
					// Operate on a copy of prop so per-property easing won't be lost
					var anim = Animation( this, jQuery.extend( {}, prop ), optall );

					// Empty animations, or finishing resolves immediately
					if ( empty || data_priv.get( this, "finish" ) ) {
						anim.stop( true );
					}
				};
				doAnimation.finish = doAnimation;

			return empty || optall.queue === false ?
				this.each( doAnimation ) :
				this.queue( optall.queue, doAnimation );
		},
		stop: function( type, clearQueue, gotoEnd ) {
			var stopQueue = function( hooks ) {
				var stop = hooks.stop;
				delete hooks.stop;
				stop( gotoEnd );
			};

			if ( typeof type !== "string" ) {
				gotoEnd = clearQueue;
				clearQueue = type;
				type = undefined;
			}
			if ( clearQueue && type !== false ) {
				this.queue( type || "fx", [] );
			}

			return this.each(function() {
				var dequeue = true,
					index = type != null && type + "queueHooks",
					timers = jQuery.timers,
					data = data_priv.get( this );

				if ( index ) {
					if ( data[ index ] && data[ index ].stop ) {
						stopQueue( data[ index ] );
					}
				} else {
					for ( index in data ) {
						if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
							stopQueue( data[ index ] );
						}
					}
				}

				for ( index = timers.length; index--; ) {
					if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
						timers[ index ].anim.stop( gotoEnd );
						dequeue = false;
						timers.splice( index, 1 );
					}
				}

				// Start the next in the queue if the last step wasn't forced.
				// Timers currently will call their complete callbacks, which
				// will dequeue but only if they were gotoEnd.
				if ( dequeue || !gotoEnd ) {
					jQuery.dequeue( this, type );
				}
			});
		},
		finish: function( type ) {
			if ( type !== false ) {
				type = type || "fx";
			}
			return this.each(function() {
				var index,
					data = data_priv.get( this ),
					queue = data[ type + "queue" ],
					hooks = data[ type + "queueHooks" ],
					timers = jQuery.timers,
					length = queue ? queue.length : 0;

				// Enable finishing flag on private data
				data.finish = true;

				// Empty the queue first
				jQuery.queue( this, type, [] );

				if ( hooks && hooks.stop ) {
					hooks.stop.call( this, true );
				}

				// Look for any active animations, and finish them
				for ( index = timers.length; index--; ) {
					if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
						timers[ index ].anim.stop( true );
						timers.splice( index, 1 );
					}
				}

				// Look for any animations in the old queue and finish them
				for ( index = 0; index < length; index++ ) {
					if ( queue[ index ] && queue[ index ].finish ) {
						queue[ index ].finish.call( this );
					}
				}

				// Turn off finishing flag
				delete data.finish;
			});
		}
	});

	jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
		var cssFn = jQuery.fn[ name ];
		jQuery.fn[ name ] = function( speed, easing, callback ) {
			return speed == null || typeof speed === "boolean" ?
				cssFn.apply( this, arguments ) :
				this.animate( genFx( name, true ), speed, easing, callback );
		};
	});

	// Generate shortcuts for custom animations
	jQuery.each({
		slideDown: genFx("show"),
		slideUp: genFx("hide"),
		slideToggle: genFx("toggle"),
		fadeIn: { opacity: "show" },
		fadeOut: { opacity: "hide" },
		fadeToggle: { opacity: "toggle" }
	}, function( name, props ) {
		jQuery.fn[ name ] = function( speed, easing, callback ) {
			return this.animate( props, speed, easing, callback );
		};
	});

	jQuery.timers = [];
	jQuery.fx.tick = function() {
		var timer,
			i = 0,
			timers = jQuery.timers;

		fxNow = jQuery.now();

		for ( ; i < timers.length; i++ ) {
			timer = timers[ i ];
			// Checks the timer has not already been removed
			if ( !timer() && timers[ i ] === timer ) {
				timers.splice( i--, 1 );
			}
		}

		if ( !timers.length ) {
			jQuery.fx.stop();
		}
		fxNow = undefined;
	};

	jQuery.fx.timer = function( timer ) {
		jQuery.timers.push( timer );
		if ( timer() ) {
			jQuery.fx.start();
		} else {
			jQuery.timers.pop();
		}
	};

	jQuery.fx.interval = 13;

	jQuery.fx.start = function() {
		if ( !timerId ) {
			timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
		}
	};

	jQuery.fx.stop = function() {
		clearInterval( timerId );
		timerId = null;
	};

	jQuery.fx.speeds = {
		slow: 600,
		fast: 200,
		// Default speed
		_default: 400
	};


	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	jQuery.fn.delay = function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	};


	(function() {
		var input = document.createElement( "input" ),
			select = document.createElement( "select" ),
			opt = select.appendChild( document.createElement( "option" ) );

		input.type = "checkbox";

		// Support: iOS<=5.1, Android<=4.2+
		// Default value for a checkbox should be "on"
		support.checkOn = input.value !== "";

		// Support: IE<=11+
		// Must access selectedIndex to make default options select
		support.optSelected = opt.selected;

		// Support: Android<=2.3
		// Options inside disabled selects are incorrectly marked as disabled
		select.disabled = true;
		support.optDisabled = !opt.disabled;

		// Support: IE<=11+
		// An input loses its value after becoming a radio
		input = document.createElement( "input" );
		input.value = "t";
		input.type = "radio";
		support.radioValue = input.value === "t";
	})();


	var nodeHook, boolHook,
		attrHandle = jQuery.expr.attrHandle;

	jQuery.fn.extend({
		attr: function( name, value ) {
			return access( this, jQuery.attr, name, value, arguments.length > 1 );
		},

		removeAttr: function( name ) {
			return this.each(function() {
				jQuery.removeAttr( this, name );
			});
		}
	});

	jQuery.extend({
		attr: function( elem, name, value ) {
			var hooks, ret,
				nType = elem.nodeType;

			// don't get/set attributes on text, comment and attribute nodes
			if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
				return;
			}

			// Fallback to prop when attributes are not supported
			if ( typeof elem.getAttribute === strundefined ) {
				return jQuery.prop( elem, name, value );
			}

			// All attributes are lowercase
			// Grab necessary hook if one is defined
			if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
				name = name.toLowerCase();
				hooks = jQuery.attrHooks[ name ] ||
					( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
			}

			if ( value !== undefined ) {

				if ( value === null ) {
					jQuery.removeAttr( elem, name );

				} else if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
					return ret;

				} else {
					elem.setAttribute( name, value + "" );
					return value;
				}

			} else if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
				return ret;

			} else {
				ret = jQuery.find.attr( elem, name );

				// Non-existent attributes return null, we normalize to undefined
				return ret == null ?
					undefined :
					ret;
			}
		},

		removeAttr: function( elem, value ) {
			var name, propName,
				i = 0,
				attrNames = value && value.match( rnotwhite );

			if ( attrNames && elem.nodeType === 1 ) {
				while ( (name = attrNames[i++]) ) {
					propName = jQuery.propFix[ name ] || name;

					// Boolean attributes get special treatment (#10870)
					if ( jQuery.expr.match.bool.test( name ) ) {
						// Set corresponding property to false
						elem[ propName ] = false;
					}

					elem.removeAttribute( name );
				}
			}
		},

		attrHooks: {
			type: {
				set: function( elem, value ) {
					if ( !support.radioValue && value === "radio" &&
						jQuery.nodeName( elem, "input" ) ) {
						var val = elem.value;
						elem.setAttribute( "type", value );
						if ( val ) {
							elem.value = val;
						}
						return value;
					}
				}
			}
		}
	});

	// Hooks for boolean attributes
	boolHook = {
		set: function( elem, value, name ) {
			if ( value === false ) {
				// Remove boolean attributes when set to false
				jQuery.removeAttr( elem, name );
			} else {
				elem.setAttribute( name, name );
			}
			return name;
		}
	};
	jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
		var getter = attrHandle[ name ] || jQuery.find.attr;

		attrHandle[ name ] = function( elem, name, isXML ) {
			var ret, handle;
			if ( !isXML ) {
				// Avoid an infinite loop by temporarily removing this function from the getter
				handle = attrHandle[ name ];
				attrHandle[ name ] = ret;
				ret = getter( elem, name, isXML ) != null ?
					name.toLowerCase() :
					null;
				attrHandle[ name ] = handle;
			}
			return ret;
		};
	});




	var rfocusable = /^(?:input|select|textarea|button)$/i;

	jQuery.fn.extend({
		prop: function( name, value ) {
			return access( this, jQuery.prop, name, value, arguments.length > 1 );
		},

		removeProp: function( name ) {
			return this.each(function() {
				delete this[ jQuery.propFix[ name ] || name ];
			});
		}
	});

	jQuery.extend({
		propFix: {
			"for": "htmlFor",
			"class": "className"
		},

		prop: function( elem, name, value ) {
			var ret, hooks, notxml,
				nType = elem.nodeType;

			// Don't get/set properties on text, comment and attribute nodes
			if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
				return;
			}

			notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

			if ( notxml ) {
				// Fix name and attach hooks
				name = jQuery.propFix[ name ] || name;
				hooks = jQuery.propHooks[ name ];
			}

			if ( value !== undefined ) {
				return hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ?
					ret :
					( elem[ name ] = value );

			} else {
				return hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ?
					ret :
					elem[ name ];
			}
		},

		propHooks: {
			tabIndex: {
				get: function( elem ) {
					return elem.hasAttribute( "tabindex" ) || rfocusable.test( elem.nodeName ) || elem.href ?
						elem.tabIndex :
						-1;
				}
			}
		}
	});

	if ( !support.optSelected ) {
		jQuery.propHooks.selected = {
			get: function( elem ) {
				var parent = elem.parentNode;
				if ( parent && parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
				return null;
			}
		};
	}

	jQuery.each([
		"tabIndex",
		"readOnly",
		"maxLength",
		"cellSpacing",
		"cellPadding",
		"rowSpan",
		"colSpan",
		"useMap",
		"frameBorder",
		"contentEditable"
	], function() {
		jQuery.propFix[ this.toLowerCase() ] = this;
	});




	var rclass = /[\t\r\n\f]/g;

	jQuery.fn.extend({
		addClass: function( value ) {
			var classes, elem, cur, clazz, j, finalValue,
				proceed = typeof value === "string" && value,
				i = 0,
				len = this.length;

			if ( jQuery.isFunction( value ) ) {
				return this.each(function( j ) {
					jQuery( this ).addClass( value.call( this, j, this.className ) );
				});
			}

			if ( proceed ) {
				// The disjunction here is for better compressibility (see removeClass)
				classes = ( value || "" ).match( rnotwhite ) || [];

				for ( ; i < len; i++ ) {
					elem = this[ i ];
					cur = elem.nodeType === 1 && ( elem.className ?
						( " " + elem.className + " " ).replace( rclass, " " ) :
						" "
					);

					if ( cur ) {
						j = 0;
						while ( (clazz = classes[j++]) ) {
							if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
								cur += clazz + " ";
							}
						}

						// only assign if different to avoid unneeded rendering.
						finalValue = jQuery.trim( cur );
						if ( elem.className !== finalValue ) {
							elem.className = finalValue;
						}
					}
				}
			}

			return this;
		},

		removeClass: function( value ) {
			var classes, elem, cur, clazz, j, finalValue,
				proceed = arguments.length === 0 || typeof value === "string" && value,
				i = 0,
				len = this.length;

			if ( jQuery.isFunction( value ) ) {
				return this.each(function( j ) {
					jQuery( this ).removeClass( value.call( this, j, this.className ) );
				});
			}
			if ( proceed ) {
				classes = ( value || "" ).match( rnotwhite ) || [];

				for ( ; i < len; i++ ) {
					elem = this[ i ];
					// This expression is here for better compressibility (see addClass)
					cur = elem.nodeType === 1 && ( elem.className ?
						( " " + elem.className + " " ).replace( rclass, " " ) :
						""
					);

					if ( cur ) {
						j = 0;
						while ( (clazz = classes[j++]) ) {
							// Remove *all* instances
							while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
								cur = cur.replace( " " + clazz + " ", " " );
							}
						}

						// Only assign if different to avoid unneeded rendering.
						finalValue = value ? jQuery.trim( cur ) : "";
						if ( elem.className !== finalValue ) {
							elem.className = finalValue;
						}
					}
				}
			}

			return this;
		},

		toggleClass: function( value, stateVal ) {
			var type = typeof value;

			if ( typeof stateVal === "boolean" && type === "string" ) {
				return stateVal ? this.addClass( value ) : this.removeClass( value );
			}

			if ( jQuery.isFunction( value ) ) {
				return this.each(function( i ) {
					jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
				});
			}

			return this.each(function() {
				if ( type === "string" ) {
					// Toggle individual class names
					var className,
						i = 0,
						self = jQuery( this ),
						classNames = value.match( rnotwhite ) || [];

					while ( (className = classNames[ i++ ]) ) {
						// Check each className given, space separated list
						if ( self.hasClass( className ) ) {
							self.removeClass( className );
						} else {
							self.addClass( className );
						}
					}

				// Toggle whole class name
				} else if ( type === strundefined || type === "boolean" ) {
					if ( this.className ) {
						// store className if set
						data_priv.set( this, "__className__", this.className );
					}

					// If the element has a class name or if we're passed `false`,
					// then remove the whole classname (if there was one, the above saved it).
					// Otherwise bring back whatever was previously saved (if anything),
					// falling back to the empty string if nothing was stored.
					this.className = this.className || value === false ? "" : data_priv.get( this, "__className__" ) || "";
				}
			});
		},

		hasClass: function( selector ) {
			var className = " " + selector + " ",
				i = 0,
				l = this.length;
			for ( ; i < l; i++ ) {
				if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
					return true;
				}
			}

			return false;
		}
	});




	var rreturn = /\r/g;

	jQuery.fn.extend({
		val: function( value ) {
			var hooks, ret, isFunction,
				elem = this[0];

			if ( !arguments.length ) {
				if ( elem ) {
					hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

					if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
						return ret;
					}

					ret = elem.value;

					return typeof ret === "string" ?
						// Handle most common string cases
						ret.replace(rreturn, "") :
						// Handle cases where value is null/undef or number
						ret == null ? "" : ret;
				}

				return;
			}

			isFunction = jQuery.isFunction( value );

			return this.each(function( i ) {
				var val;

				if ( this.nodeType !== 1 ) {
					return;
				}

				if ( isFunction ) {
					val = value.call( this, i, jQuery( this ).val() );
				} else {
					val = value;
				}

				// Treat null/undefined as ""; convert numbers to string
				if ( val == null ) {
					val = "";

				} else if ( typeof val === "number" ) {
					val += "";

				} else if ( jQuery.isArray( val ) ) {
					val = jQuery.map( val, function( value ) {
						return value == null ? "" : value + "";
					});
				}

				hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

				// If set returns undefined, fall back to normal setting
				if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
					this.value = val;
				}
			});
		}
	});

	jQuery.extend({
		valHooks: {
			option: {
				get: function( elem ) {
					var val = jQuery.find.attr( elem, "value" );
					return val != null ?
						val :
						// Support: IE10-11+
						// option.text throws exceptions (#14686, #14858)
						jQuery.trim( jQuery.text( elem ) );
				}
			},
			select: {
				get: function( elem ) {
					var value, option,
						options = elem.options,
						index = elem.selectedIndex,
						one = elem.type === "select-one" || index < 0,
						values = one ? null : [],
						max = one ? index + 1 : options.length,
						i = index < 0 ?
							max :
							one ? index : 0;

					// Loop through all the selected options
					for ( ; i < max; i++ ) {
						option = options[ i ];

						// IE6-9 doesn't update selected after form reset (#2551)
						if ( ( option.selected || i === index ) &&
								// Don't return options that are disabled or in a disabled optgroup
								( support.optDisabled ? !option.disabled : option.getAttribute( "disabled" ) === null ) &&
								( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

							// Get the specific value for the option
							value = jQuery( option ).val();

							// We don't need an array for one selects
							if ( one ) {
								return value;
							}

							// Multi-Selects return an array
							values.push( value );
						}
					}

					return values;
				},

				set: function( elem, value ) {
					var optionSet, option,
						options = elem.options,
						values = jQuery.makeArray( value ),
						i = options.length;

					while ( i-- ) {
						option = options[ i ];
						if ( (option.selected = jQuery.inArray( option.value, values ) >= 0) ) {
							optionSet = true;
						}
					}

					// Force browsers to behave consistently when non-matching value is set
					if ( !optionSet ) {
						elem.selectedIndex = -1;
					}
					return values;
				}
			}
		}
	});

	// Radios and checkboxes getter/setter
	jQuery.each([ "radio", "checkbox" ], function() {
		jQuery.valHooks[ this ] = {
			set: function( elem, value ) {
				if ( jQuery.isArray( value ) ) {
					return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
				}
			}
		};
		if ( !support.checkOn ) {
			jQuery.valHooks[ this ].get = function( elem ) {
				return elem.getAttribute("value") === null ? "on" : elem.value;
			};
		}
	});




	// Return jQuery for attributes-only inclusion


	jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
		"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
		"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

		// Handle event binding
		jQuery.fn[ name ] = function( data, fn ) {
			return arguments.length > 0 ?
				this.on( name, null, data, fn ) :
				this.trigger( name );
		};
	});

	jQuery.fn.extend({
		hover: function( fnOver, fnOut ) {
			return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
		},

		bind: function( types, data, fn ) {
			return this.on( types, null, data, fn );
		},
		unbind: function( types, fn ) {
			return this.off( types, null, fn );
		},

		delegate: function( selector, types, data, fn ) {
			return this.on( types, selector, data, fn );
		},
		undelegate: function( selector, types, fn ) {
			// ( namespace ) or ( selector, types [, fn] )
			return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
		}
	});


	var nonce = jQuery.now();

	var rquery = (/\?/);



	// Support: Android 2.3
	// Workaround failure to string-cast null input
	jQuery.parseJSON = function( data ) {
		return JSON.parse( data + "" );
	};


	// Cross-browser xml parsing
	jQuery.parseXML = function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}

		// Support: IE9
		try {
			tmp = new DOMParser();
			xml = tmp.parseFromString( data, "text/xml" );
		} catch ( e ) {
			xml = undefined;
		}

		if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	};


	var
		rhash = /#.*$/,
		rts = /([?&])_=[^&]*/,
		rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,
		// #7653, #8125, #8152: local protocol detection
		rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
		rnoContent = /^(?:GET|HEAD)$/,
		rprotocol = /^\/\//,
		rurl = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,

		/* Prefilters
		 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
		 * 2) These are called:
		 *    - BEFORE asking for a transport
		 *    - AFTER param serialization (s.data is a string if s.processData is true)
		 * 3) key is the dataType
		 * 4) the catchall symbol "*" can be used
		 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
		 */
		prefilters = {},

		/* Transports bindings
		 * 1) key is the dataType
		 * 2) the catchall symbol "*" can be used
		 * 3) selection will start with transport dataType and THEN go to "*" if needed
		 */
		transports = {},

		// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
		allTypes = "*/".concat( "*" ),

		// Document location
		ajaxLocation = window.location.href,

		// Segment location into parts
		ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

	// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
	function addToPrefiltersOrTransports( structure ) {

		// dataTypeExpression is optional and defaults to "*"
		return function( dataTypeExpression, func ) {

			if ( typeof dataTypeExpression !== "string" ) {
				func = dataTypeExpression;
				dataTypeExpression = "*";
			}

			var dataType,
				i = 0,
				dataTypes = dataTypeExpression.toLowerCase().match( rnotwhite ) || [];

			if ( jQuery.isFunction( func ) ) {
				// For each dataType in the dataTypeExpression
				while ( (dataType = dataTypes[i++]) ) {
					// Prepend if requested
					if ( dataType[0] === "+" ) {
						dataType = dataType.slice( 1 ) || "*";
						(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

					// Otherwise append
					} else {
						(structure[ dataType ] = structure[ dataType ] || []).push( func );
					}
				}
			}
		};
	}

	// Base inspection function for prefilters and transports
	function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

		var inspected = {},
			seekingTransport = ( structure === transports );

		function inspect( dataType ) {
			var selected;
			inspected[ dataType ] = true;
			jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
				var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
				if ( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
					options.dataTypes.unshift( dataTypeOrTransport );
					inspect( dataTypeOrTransport );
					return false;
				} else if ( seekingTransport ) {
					return !( selected = dataTypeOrTransport );
				}
			});
			return selected;
		}

		return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
	}

	// A special extend for ajax options
	// that takes "flat" options (not to be deep extended)
	// Fixes #9887
	function ajaxExtend( target, src ) {
		var key, deep,
			flatOptions = jQuery.ajaxSettings.flatOptions || {};

		for ( key in src ) {
			if ( src[ key ] !== undefined ) {
				( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
			}
		}
		if ( deep ) {
			jQuery.extend( true, target, deep );
		}

		return target;
	}

	/* Handles responses to an ajax request:
	 * - finds the right dataType (mediates between content-type and expected dataType)
	 * - returns the corresponding response
	 */
	function ajaxHandleResponses( s, jqXHR, responses ) {

		var ct, type, finalDataType, firstDataType,
			contents = s.contents,
			dataTypes = s.dataTypes;

		// Remove auto dataType and get content-type in the process
		while ( dataTypes[ 0 ] === "*" ) {
			dataTypes.shift();
			if ( ct === undefined ) {
				ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
			}
		}

		// Check if we're dealing with a known content-type
		if ( ct ) {
			for ( type in contents ) {
				if ( contents[ type ] && contents[ type ].test( ct ) ) {
					dataTypes.unshift( type );
					break;
				}
			}
		}

		// Check to see if we have a response for the expected dataType
		if ( dataTypes[ 0 ] in responses ) {
			finalDataType = dataTypes[ 0 ];
		} else {
			// Try convertible dataTypes
			for ( type in responses ) {
				if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
					finalDataType = type;
					break;
				}
				if ( !firstDataType ) {
					firstDataType = type;
				}
			}
			// Or just use first one
			finalDataType = finalDataType || firstDataType;
		}

		// If we found a dataType
		// We add the dataType to the list if needed
		// and return the corresponding response
		if ( finalDataType ) {
			if ( finalDataType !== dataTypes[ 0 ] ) {
				dataTypes.unshift( finalDataType );
			}
			return responses[ finalDataType ];
		}
	}

	/* Chain conversions given the request and the original response
	 * Also sets the responseXXX fields on the jqXHR instance
	 */
	function ajaxConvert( s, response, jqXHR, isSuccess ) {
		var conv2, current, conv, tmp, prev,
			converters = {},
			// Work with a copy of dataTypes in case we need to modify it for conversion
			dataTypes = s.dataTypes.slice();

		// Create converters map with lowercased keys
		if ( dataTypes[ 1 ] ) {
			for ( conv in s.converters ) {
				converters[ conv.toLowerCase() ] = s.converters[ conv ];
			}
		}

		current = dataTypes.shift();

		// Convert to each sequential dataType
		while ( current ) {

			if ( s.responseFields[ current ] ) {
				jqXHR[ s.responseFields[ current ] ] = response;
			}

			// Apply the dataFilter if provided
			if ( !prev && isSuccess && s.dataFilter ) {
				response = s.dataFilter( response, s.dataType );
			}

			prev = current;
			current = dataTypes.shift();

			if ( current ) {

			// There's only work to do if current dataType is non-auto
				if ( current === "*" ) {

					current = prev;

				// Convert response if prev dataType is non-auto and differs from current
				} else if ( prev !== "*" && prev !== current ) {

					// Seek a direct converter
					conv = converters[ prev + " " + current ] || converters[ "* " + current ];

					// If none found, seek a pair
					if ( !conv ) {
						for ( conv2 in converters ) {

							// If conv2 outputs current
							tmp = conv2.split( " " );
							if ( tmp[ 1 ] === current ) {

								// If prev can be converted to accepted input
								conv = converters[ prev + " " + tmp[ 0 ] ] ||
									converters[ "* " + tmp[ 0 ] ];
								if ( conv ) {
									// Condense equivalence converters
									if ( conv === true ) {
										conv = converters[ conv2 ];

									// Otherwise, insert the intermediate dataType
									} else if ( converters[ conv2 ] !== true ) {
										current = tmp[ 0 ];
										dataTypes.unshift( tmp[ 1 ] );
									}
									break;
								}
							}
						}
					}

					// Apply converter (if not an equivalence)
					if ( conv !== true ) {

						// Unless errors are allowed to bubble, catch and return them
						if ( conv && s[ "throws" ] ) {
							response = conv( response );
						} else {
							try {
								response = conv( response );
							} catch ( e ) {
								return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
							}
						}
					}
				}
			}
		}

		return { state: "success", data: response };
	}

	jQuery.extend({

		// Counter for holding the number of active queries
		active: 0,

		// Last-Modified header cache for next request
		lastModified: {},
		etag: {},

		ajaxSettings: {
			url: ajaxLocation,
			type: "GET",
			isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
			global: true,
			processData: true,
			async: true,
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			/*
			timeout: 0,
			data: null,
			dataType: null,
			username: null,
			password: null,
			cache: null,
			throws: false,
			traditional: false,
			headers: {},
			*/

			accepts: {
				"*": allTypes,
				text: "text/plain",
				html: "text/html",
				xml: "application/xml, text/xml",
				json: "application/json, text/javascript"
			},

			contents: {
				xml: /xml/,
				html: /html/,
				json: /json/
			},

			responseFields: {
				xml: "responseXML",
				text: "responseText",
				json: "responseJSON"
			},

			// Data converters
			// Keys separate source (or catchall "*") and destination types with a single space
			converters: {

				// Convert anything to text
				"* text": String,

				// Text to html (true = no transformation)
				"text html": true,

				// Evaluate text as a json expression
				"text json": jQuery.parseJSON,

				// Parse text as xml
				"text xml": jQuery.parseXML
			},

			// For options that shouldn't be deep extended:
			// you can add your own custom options here if
			// and when you create one that shouldn't be
			// deep extended (see ajaxExtend)
			flatOptions: {
				url: true,
				context: true
			}
		},

		// Creates a full fledged settings object into target
		// with both ajaxSettings and settings fields.
		// If target is omitted, writes into ajaxSettings.
		ajaxSetup: function( target, settings ) {
			return settings ?

				// Building a settings object
				ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

				// Extending ajaxSettings
				ajaxExtend( jQuery.ajaxSettings, target );
		},

		ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
		ajaxTransport: addToPrefiltersOrTransports( transports ),

		// Main method
		ajax: function( url, options ) {

			// If url is an object, simulate pre-1.5 signature
			if ( typeof url === "object" ) {
				options = url;
				url = undefined;
			}

			// Force options to be an object
			options = options || {};

			var transport,
				// URL without anti-cache param
				cacheURL,
				// Response headers
				responseHeadersString,
				responseHeaders,
				// timeout handle
				timeoutTimer,
				// Cross-domain detection vars
				parts,
				// To know if global events are to be dispatched
				fireGlobals,
				// Loop variable
				i,
				// Create the final options object
				s = jQuery.ajaxSetup( {}, options ),
				// Callbacks context
				callbackContext = s.context || s,
				// Context for global events is callbackContext if it is a DOM node or jQuery collection
				globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
					jQuery( callbackContext ) :
					jQuery.event,
				// Deferreds
				deferred = jQuery.Deferred(),
				completeDeferred = jQuery.Callbacks("once memory"),
				// Status-dependent callbacks
				statusCode = s.statusCode || {},
				// Headers (they are sent all at once)
				requestHeaders = {},
				requestHeadersNames = {},
				// The jqXHR state
				state = 0,
				// Default abort message
				strAbort = "canceled",
				// Fake xhr
				jqXHR = {
					readyState: 0,

					// Builds headers hashtable if needed
					getResponseHeader: function( key ) {
						var match;
						if ( state === 2 ) {
							if ( !responseHeaders ) {
								responseHeaders = {};
								while ( (match = rheaders.exec( responseHeadersString )) ) {
									responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
								}
							}
							match = responseHeaders[ key.toLowerCase() ];
						}
						return match == null ? null : match;
					},

					// Raw string
					getAllResponseHeaders: function() {
						return state === 2 ? responseHeadersString : null;
					},

					// Caches the header
					setRequestHeader: function( name, value ) {
						var lname = name.toLowerCase();
						if ( !state ) {
							name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
							requestHeaders[ name ] = value;
						}
						return this;
					},

					// Overrides response content-type header
					overrideMimeType: function( type ) {
						if ( !state ) {
							s.mimeType = type;
						}
						return this;
					},

					// Status-dependent callbacks
					statusCode: function( map ) {
						var code;
						if ( map ) {
							if ( state < 2 ) {
								for ( code in map ) {
									// Lazy-add the new callback in a way that preserves old ones
									statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
								}
							} else {
								// Execute the appropriate callbacks
								jqXHR.always( map[ jqXHR.status ] );
							}
						}
						return this;
					},

					// Cancel the request
					abort: function( statusText ) {
						var finalText = statusText || strAbort;
						if ( transport ) {
							transport.abort( finalText );
						}
						done( 0, finalText );
						return this;
					}
				};

			// Attach deferreds
			deferred.promise( jqXHR ).complete = completeDeferred.add;
			jqXHR.success = jqXHR.done;
			jqXHR.error = jqXHR.fail;

			// Remove hash character (#7531: and string promotion)
			// Add protocol if not provided (prefilters might expect it)
			// Handle falsy url in the settings object (#10093: consistency with old signature)
			// We also use the url parameter if available
			s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" )
				.replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

			// Alias method option to type as per ticket #12004
			s.type = options.method || options.type || s.method || s.type;

			// Extract dataTypes list
			s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( rnotwhite ) || [ "" ];

			// A cross-domain request is in order when we have a protocol:host:port mismatch
			if ( s.crossDomain == null ) {
				parts = rurl.exec( s.url.toLowerCase() );
				s.crossDomain = !!( parts &&
					( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
						( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
							( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
				);
			}

			// Convert data if not already a string
			if ( s.data && s.processData && typeof s.data !== "string" ) {
				s.data = jQuery.param( s.data, s.traditional );
			}

			// Apply prefilters
			inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

			// If request was aborted inside a prefilter, stop there
			if ( state === 2 ) {
				return jqXHR;
			}

			// We can fire global events as of now if asked to
			// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
			fireGlobals = jQuery.event && s.global;

			// Watch for a new set of requests
			if ( fireGlobals && jQuery.active++ === 0 ) {
				jQuery.event.trigger("ajaxStart");
			}

			// Uppercase the type
			s.type = s.type.toUpperCase();

			// Determine if request has content
			s.hasContent = !rnoContent.test( s.type );

			// Save the URL in case we're toying with the If-Modified-Since
			// and/or If-None-Match header later on
			cacheURL = s.url;

			// More options handling for requests with no content
			if ( !s.hasContent ) {

				// If data is available, append data to url
				if ( s.data ) {
					cacheURL = ( s.url += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
					// #9682: remove data so that it's not used in an eventual retry
					delete s.data;
				}

				// Add anti-cache in url if needed
				if ( s.cache === false ) {
					s.url = rts.test( cacheURL ) ?

						// If there is already a '_' parameter, set its value
						cacheURL.replace( rts, "$1_=" + nonce++ ) :

						// Otherwise add one to the end
						cacheURL + ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + nonce++;
				}
			}

			// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
			if ( s.ifModified ) {
				if ( jQuery.lastModified[ cacheURL ] ) {
					jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
				}
				if ( jQuery.etag[ cacheURL ] ) {
					jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
				}
			}

			// Set the correct header, if data is being sent
			if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
				jqXHR.setRequestHeader( "Content-Type", s.contentType );
			}

			// Set the Accepts header for the server, depending on the dataType
			jqXHR.setRequestHeader(
				"Accept",
				s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
					s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
					s.accepts[ "*" ]
			);

			// Check for headers option
			for ( i in s.headers ) {
				jqXHR.setRequestHeader( i, s.headers[ i ] );
			}

			// Allow custom headers/mimetypes and early abort
			if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
				// Abort if not done already and return
				return jqXHR.abort();
			}

			// Aborting is no longer a cancellation
			strAbort = "abort";

			// Install callbacks on deferreds
			for ( i in { success: 1, error: 1, complete: 1 } ) {
				jqXHR[ i ]( s[ i ] );
			}

			// Get transport
			transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

			// If no transport, we auto-abort
			if ( !transport ) {
				done( -1, "No Transport" );
			} else {
				jqXHR.readyState = 1;

				// Send global event
				if ( fireGlobals ) {
					globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
				}
				// Timeout
				if ( s.async && s.timeout > 0 ) {
					timeoutTimer = setTimeout(function() {
						jqXHR.abort("timeout");
					}, s.timeout );
				}

				try {
					state = 1;
					transport.send( requestHeaders, done );
				} catch ( e ) {
					// Propagate exception as error if not done
					if ( state < 2 ) {
						done( -1, e );
					// Simply rethrow otherwise
					} else {
						throw e;
					}
				}
			}

			// Callback for when everything is done
			function done( status, nativeStatusText, responses, headers ) {
				var isSuccess, success, error, response, modified,
					statusText = nativeStatusText;

				// Called once
				if ( state === 2 ) {
					return;
				}

				// State is "done" now
				state = 2;

				// Clear timeout if it exists
				if ( timeoutTimer ) {
					clearTimeout( timeoutTimer );
				}

				// Dereference transport for early garbage collection
				// (no matter how long the jqXHR object will be used)
				transport = undefined;

				// Cache response headers
				responseHeadersString = headers || "";

				// Set readyState
				jqXHR.readyState = status > 0 ? 4 : 0;

				// Determine if successful
				isSuccess = status >= 200 && status < 300 || status === 304;

				// Get response data
				if ( responses ) {
					response = ajaxHandleResponses( s, jqXHR, responses );
				}

				// Convert no matter what (that way responseXXX fields are always set)
				response = ajaxConvert( s, response, jqXHR, isSuccess );

				// If successful, handle type chaining
				if ( isSuccess ) {

					// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
					if ( s.ifModified ) {
						modified = jqXHR.getResponseHeader("Last-Modified");
						if ( modified ) {
							jQuery.lastModified[ cacheURL ] = modified;
						}
						modified = jqXHR.getResponseHeader("etag");
						if ( modified ) {
							jQuery.etag[ cacheURL ] = modified;
						}
					}

					// if no content
					if ( status === 204 || s.type === "HEAD" ) {
						statusText = "nocontent";

					// if not modified
					} else if ( status === 304 ) {
						statusText = "notmodified";

					// If we have data, let's convert it
					} else {
						statusText = response.state;
						success = response.data;
						error = response.error;
						isSuccess = !error;
					}
				} else {
					// Extract error from statusText and normalize for non-aborts
					error = statusText;
					if ( status || !statusText ) {
						statusText = "error";
						if ( status < 0 ) {
							status = 0;
						}
					}
				}

				// Set data for the fake xhr object
				jqXHR.status = status;
				jqXHR.statusText = ( nativeStatusText || statusText ) + "";

				// Success/Error
				if ( isSuccess ) {
					deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
				} else {
					deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
				}

				// Status-dependent callbacks
				jqXHR.statusCode( statusCode );
				statusCode = undefined;

				if ( fireGlobals ) {
					globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
						[ jqXHR, s, isSuccess ? success : error ] );
				}

				// Complete
				completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

				if ( fireGlobals ) {
					globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
					// Handle the global AJAX counter
					if ( !( --jQuery.active ) ) {
						jQuery.event.trigger("ajaxStop");
					}
				}
			}

			return jqXHR;
		},

		getJSON: function( url, data, callback ) {
			return jQuery.get( url, data, callback, "json" );
		},

		getScript: function( url, callback ) {
			return jQuery.get( url, undefined, callback, "script" );
		}
	});

	jQuery.each( [ "get", "post" ], function( i, method ) {
		jQuery[ method ] = function( url, data, callback, type ) {
			// Shift arguments if data argument was omitted
			if ( jQuery.isFunction( data ) ) {
				type = type || callback;
				callback = data;
				data = undefined;
			}

			return jQuery.ajax({
				url: url,
				type: method,
				dataType: type,
				data: data,
				success: callback
			});
		};
	});


	jQuery._evalUrl = function( url ) {
		return jQuery.ajax({
			url: url,
			type: "GET",
			dataType: "script",
			async: false,
			global: false,
			"throws": true
		});
	};


	jQuery.fn.extend({
		wrapAll: function( html ) {
			var wrap;

			if ( jQuery.isFunction( html ) ) {
				return this.each(function( i ) {
					jQuery( this ).wrapAll( html.call(this, i) );
				});
			}

			if ( this[ 0 ] ) {

				// The elements to wrap the target around
				wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

				if ( this[ 0 ].parentNode ) {
					wrap.insertBefore( this[ 0 ] );
				}

				wrap.map(function() {
					var elem = this;

					while ( elem.firstElementChild ) {
						elem = elem.firstElementChild;
					}

					return elem;
				}).append( this );
			}

			return this;
		},

		wrapInner: function( html ) {
			if ( jQuery.isFunction( html ) ) {
				return this.each(function( i ) {
					jQuery( this ).wrapInner( html.call(this, i) );
				});
			}

			return this.each(function() {
				var self = jQuery( this ),
					contents = self.contents();

				if ( contents.length ) {
					contents.wrapAll( html );

				} else {
					self.append( html );
				}
			});
		},

		wrap: function( html ) {
			var isFunction = jQuery.isFunction( html );

			return this.each(function( i ) {
				jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
			});
		},

		unwrap: function() {
			return this.parent().each(function() {
				if ( !jQuery.nodeName( this, "body" ) ) {
					jQuery( this ).replaceWith( this.childNodes );
				}
			}).end();
		}
	});


	jQuery.expr.filters.hidden = function( elem ) {
		// Support: Opera <= 12.12
		// Opera reports offsetWidths and offsetHeights less than zero on some elements
		return elem.offsetWidth <= 0 && elem.offsetHeight <= 0;
	};
	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};




	var r20 = /%20/g,
		rbracket = /\[\]$/,
		rCRLF = /\r?\n/g,
		rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
		rsubmittable = /^(?:input|select|textarea|keygen)/i;

	function buildParams( prefix, obj, traditional, add ) {
		var name;

		if ( jQuery.isArray( obj ) ) {
			// Serialize array item.
			jQuery.each( obj, function( i, v ) {
				if ( traditional || rbracket.test( prefix ) ) {
					// Treat each array item as a scalar.
					add( prefix, v );

				} else {
					// Item is non-scalar (array or object), encode its numeric index.
					buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
				}
			});

		} else if ( !traditional && jQuery.type( obj ) === "object" ) {
			// Serialize object item.
			for ( name in obj ) {
				buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
			}

		} else {
			// Serialize scalar item.
			add( prefix, obj );
		}
	}

	// Serialize an array of form elements or a set of
	// key/values into a query string
	jQuery.param = function( a, traditional ) {
		var prefix,
			s = [],
			add = function( key, value ) {
				// If value is a function, invoke it and return its value
				value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
				s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
			};

		// Set traditional to true for jQuery <= 1.3.2 behavior.
		if ( traditional === undefined ) {
			traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
		}

		// If an array was passed in, assume that it is an array of form elements.
		if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
			// Serialize the form elements
			jQuery.each( a, function() {
				add( this.name, this.value );
			});

		} else {
			// If traditional, encode the "old" way (the way 1.3.2 or older
			// did it), otherwise encode params recursively.
			for ( prefix in a ) {
				buildParams( prefix, a[ prefix ], traditional, add );
			}
		}

		// Return the resulting serialization
		return s.join( "&" ).replace( r20, "+" );
	};

	jQuery.fn.extend({
		serialize: function() {
			return jQuery.param( this.serializeArray() );
		},
		serializeArray: function() {
			return this.map(function() {
				// Can add propHook for "elements" to filter or add form elements
				var elements = jQuery.prop( this, "elements" );
				return elements ? jQuery.makeArray( elements ) : this;
			})
			.filter(function() {
				var type = this.type;

				// Use .is( ":disabled" ) so that fieldset[disabled] works
				return this.name && !jQuery( this ).is( ":disabled" ) &&
					rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
					( this.checked || !rcheckableType.test( type ) );
			})
			.map(function( i, elem ) {
				var val = jQuery( this ).val();

				return val == null ?
					null :
					jQuery.isArray( val ) ?
						jQuery.map( val, function( val ) {
							return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
						}) :
						{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
			}).get();
		}
	});


	jQuery.ajaxSettings.xhr = function() {
		try {
			return new XMLHttpRequest();
		} catch( e ) {}
	};

	var xhrId = 0,
		xhrCallbacks = {},
		xhrSuccessStatus = {
			// file protocol always yields status code 0, assume 200
			0: 200,
			// Support: IE9
			// #1450: sometimes IE returns 1223 when it should be 204
			1223: 204
		},
		xhrSupported = jQuery.ajaxSettings.xhr();

	// Support: IE9
	// Open requests must be manually aborted on unload (#5280)
	// See https://support.microsoft.com/kb/2856746 for more info
	if ( window.attachEvent ) {
		window.attachEvent( "onunload", function() {
			for ( var key in xhrCallbacks ) {
				xhrCallbacks[ key ]();
			}
		});
	}

	support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
	support.ajax = xhrSupported = !!xhrSupported;

	jQuery.ajaxTransport(function( options ) {
		var callback;

		// Cross domain only allowed if supported through XMLHttpRequest
		if ( support.cors || xhrSupported && !options.crossDomain ) {
			return {
				send: function( headers, complete ) {
					var i,
						xhr = options.xhr(),
						id = ++xhrId;

					xhr.open( options.type, options.url, options.async, options.username, options.password );

					// Apply custom fields if provided
					if ( options.xhrFields ) {
						for ( i in options.xhrFields ) {
							xhr[ i ] = options.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( options.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( options.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !options.crossDomain && !headers["X-Requested-With"] ) {
						headers["X-Requested-With"] = "XMLHttpRequest";
					}

					// Set headers
					for ( i in headers ) {
						xhr.setRequestHeader( i, headers[ i ] );
					}

					// Callback
					callback = function( type ) {
						return function() {
							if ( callback ) {
								delete xhrCallbacks[ id ];
								callback = xhr.onload = xhr.onerror = null;

								if ( type === "abort" ) {
									xhr.abort();
								} else if ( type === "error" ) {
									complete(
										// file: protocol always yields status 0; see #8605, #14207
										xhr.status,
										xhr.statusText
									);
								} else {
									complete(
										xhrSuccessStatus[ xhr.status ] || xhr.status,
										xhr.statusText,
										// Support: IE9
										// Accessing binary-data responseText throws an exception
										// (#11426)
										typeof xhr.responseText === "string" ? {
											text: xhr.responseText
										} : undefined,
										xhr.getAllResponseHeaders()
									);
								}
							}
						};
					};

					// Listen to events
					xhr.onload = callback();
					xhr.onerror = callback("error");

					// Create the abort callback
					callback = xhrCallbacks[ id ] = callback("abort");

					try {
						// Do send the request (this may raise an exception)
						xhr.send( options.hasContent && options.data || null );
					} catch ( e ) {
						// #14683: Only rethrow if this hasn't been notified as an error yet
						if ( callback ) {
							throw e;
						}
					}
				},

				abort: function() {
					if ( callback ) {
						callback();
					}
				}
			};
		}
	});




	// Install script dataType
	jQuery.ajaxSetup({
		accepts: {
			script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
		},
		contents: {
			script: /(?:java|ecma)script/
		},
		converters: {
			"text script": function( text ) {
				jQuery.globalEval( text );
				return text;
			}
		}
	});

	// Handle cache's special case and crossDomain
	jQuery.ajaxPrefilter( "script", function( s ) {
		if ( s.cache === undefined ) {
			s.cache = false;
		}
		if ( s.crossDomain ) {
			s.type = "GET";
		}
	});

	// Bind script tag hack transport
	jQuery.ajaxTransport( "script", function( s ) {
		// This transport only deals with cross domain requests
		if ( s.crossDomain ) {
			var script, callback;
			return {
				send: function( _, complete ) {
					script = jQuery("<script>").prop({
						async: true,
						charset: s.scriptCharset,
						src: s.url
					}).on(
						"load error",
						callback = function( evt ) {
							script.remove();
							callback = null;
							if ( evt ) {
								complete( evt.type === "error" ? 404 : 200, evt.type );
							}
						}
					);
					document.head.appendChild( script[ 0 ] );
				},
				abort: function() {
					if ( callback ) {
						callback();
					}
				}
			};
		}
	});




	var oldCallbacks = [],
		rjsonp = /(=)\?(?=&|$)|\?\?/;

	// Default jsonp settings
	jQuery.ajaxSetup({
		jsonp: "callback",
		jsonpCallback: function() {
			var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
			this[ callback ] = true;
			return callback;
		}
	});

	// Detect, normalize options and install callbacks for jsonp requests
	jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

		var callbackName, overwritten, responseContainer,
			jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
				"url" :
				typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
			);

		// Handle iff the expected data type is "jsonp" or we have a parameter to set
		if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

			// Get callback name, remembering preexisting value associated with it
			callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
				s.jsonpCallback() :
				s.jsonpCallback;

			// Insert callback into url or form data
			if ( jsonProp ) {
				s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
			} else if ( s.jsonp !== false ) {
				s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
			}

			// Use data converter to retrieve json after script execution
			s.converters["script json"] = function() {
				if ( !responseContainer ) {
					jQuery.error( callbackName + " was not called" );
				}
				return responseContainer[ 0 ];
			};

			// force json dataType
			s.dataTypes[ 0 ] = "json";

			// Install callback
			overwritten = window[ callbackName ];
			window[ callbackName ] = function() {
				responseContainer = arguments;
			};

			// Clean-up function (fires after converters)
			jqXHR.always(function() {
				// Restore preexisting value
				window[ callbackName ] = overwritten;

				// Save back as free
				if ( s[ callbackName ] ) {
					// make sure that re-using the options doesn't screw things around
					s.jsonpCallback = originalSettings.jsonpCallback;

					// save the callback name for future use
					oldCallbacks.push( callbackName );
				}

				// Call if it was a function and we have a response
				if ( responseContainer && jQuery.isFunction( overwritten ) ) {
					overwritten( responseContainer[ 0 ] );
				}

				responseContainer = overwritten = undefined;
			});

			// Delegate to script
			return "script";
		}
	});




	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	jQuery.parseHTML = function( data, context, keepScripts ) {
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}
		context = context || document;

		var parsed = rsingleTag.exec( data ),
			scripts = !keepScripts && [];

		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[1] ) ];
		}

		parsed = jQuery.buildFragment( [ data ], context, scripts );

		if ( scripts && scripts.length ) {
			jQuery( scripts ).remove();
		}

		return jQuery.merge( [], parsed.childNodes );
	};


	// Keep a copy of the old load method
	var _load = jQuery.fn.load;

	/**
	 * Load a url into a page
	 */
	jQuery.fn.load = function( url, params, callback ) {
		if ( typeof url !== "string" && _load ) {
			return _load.apply( this, arguments );
		}

		var selector, type, response,
			self = this,
			off = url.indexOf(" ");

		if ( off >= 0 ) {
			selector = jQuery.trim( url.slice( off ) );
			url = url.slice( 0, off );
		}

		// If it's a function
		if ( jQuery.isFunction( params ) ) {

			// We assume that it's the callback
			callback = params;
			params = undefined;

		// Otherwise, build a param string
		} else if ( params && typeof params === "object" ) {
			type = "POST";
		}

		// If we have elements to modify, make the request
		if ( self.length > 0 ) {
			jQuery.ajax({
				url: url,

				// if "type" variable is undefined, then "GET" method will be used
				type: type,
				dataType: "html",
				data: params
			}).done(function( responseText ) {

				// Save response for use in complete callback
				response = arguments;

				self.html( selector ?

					// If a selector was specified, locate the right elements in a dummy div
					// Exclude scripts to avoid IE 'Permission Denied' errors
					jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

					// Otherwise use the full result
					responseText );

			}).complete( callback && function( jqXHR, status ) {
				self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
			});
		}

		return this;
	};




	// Attach a bunch of functions for handling common AJAX events
	jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ) {
		jQuery.fn[ type ] = function( fn ) {
			return this.on( type, fn );
		};
	});




	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};




	var docElem = window.document.documentElement;

	/**
	 * Gets a window from an element
	 */
	function getWindow( elem ) {
		return jQuery.isWindow( elem ) ? elem : elem.nodeType === 9 && elem.defaultView;
	}

	jQuery.offset = {
		setOffset: function( elem, options, i ) {
			var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
				position = jQuery.css( elem, "position" ),
				curElem = jQuery( elem ),
				props = {};

			// Set position first, in-case top/left are set even on static elem
			if ( position === "static" ) {
				elem.style.position = "relative";
			}

			curOffset = curElem.offset();
			curCSSTop = jQuery.css( elem, "top" );
			curCSSLeft = jQuery.css( elem, "left" );
			calculatePosition = ( position === "absolute" || position === "fixed" ) &&
				( curCSSTop + curCSSLeft ).indexOf("auto") > -1;

			// Need to be able to calculate position if either
			// top or left is auto and position is either absolute or fixed
			if ( calculatePosition ) {
				curPosition = curElem.position();
				curTop = curPosition.top;
				curLeft = curPosition.left;

			} else {
				curTop = parseFloat( curCSSTop ) || 0;
				curLeft = parseFloat( curCSSLeft ) || 0;
			}

			if ( jQuery.isFunction( options ) ) {
				options = options.call( elem, i, curOffset );
			}

			if ( options.top != null ) {
				props.top = ( options.top - curOffset.top ) + curTop;
			}
			if ( options.left != null ) {
				props.left = ( options.left - curOffset.left ) + curLeft;
			}

			if ( "using" in options ) {
				options.using.call( elem, props );

			} else {
				curElem.css( props );
			}
		}
	};

	jQuery.fn.extend({
		offset: function( options ) {
			if ( arguments.length ) {
				return options === undefined ?
					this :
					this.each(function( i ) {
						jQuery.offset.setOffset( this, options, i );
					});
			}

			var docElem, win,
				elem = this[ 0 ],
				box = { top: 0, left: 0 },
				doc = elem && elem.ownerDocument;

			if ( !doc ) {
				return;
			}

			docElem = doc.documentElement;

			// Make sure it's not a disconnected DOM node
			if ( !jQuery.contains( docElem, elem ) ) {
				return box;
			}

			// Support: BlackBerry 5, iOS 3 (original iPhone)
			// If we don't have gBCR, just use 0,0 rather than error
			if ( typeof elem.getBoundingClientRect !== strundefined ) {
				box = elem.getBoundingClientRect();
			}
			win = getWindow( doc );
			return {
				top: box.top + win.pageYOffset - docElem.clientTop,
				left: box.left + win.pageXOffset - docElem.clientLeft
			};
		},

		position: function() {
			if ( !this[ 0 ] ) {
				return;
			}

			var offsetParent, offset,
				elem = this[ 0 ],
				parentOffset = { top: 0, left: 0 };

			// Fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is its only offset parent
			if ( jQuery.css( elem, "position" ) === "fixed" ) {
				// Assume getBoundingClientRect is there when computed position is fixed
				offset = elem.getBoundingClientRect();

			} else {
				// Get *real* offsetParent
				offsetParent = this.offsetParent();

				// Get correct offsets
				offset = this.offset();
				if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
					parentOffset = offsetParent.offset();
				}

				// Add offsetParent borders
				parentOffset.top += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
				parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
			}

			// Subtract parent offsets and element margins
			return {
				top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
				left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
			};
		},

		offsetParent: function() {
			return this.map(function() {
				var offsetParent = this.offsetParent || docElem;

				while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position" ) === "static" ) ) {
					offsetParent = offsetParent.offsetParent;
				}

				return offsetParent || docElem;
			});
		}
	});

	// Create scrollLeft and scrollTop methods
	jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
		var top = "pageYOffset" === prop;

		jQuery.fn[ method ] = function( val ) {
			return access( this, function( elem, method, val ) {
				var win = getWindow( elem );

				if ( val === undefined ) {
					return win ? win[ prop ] : elem[ method ];
				}

				if ( win ) {
					win.scrollTo(
						!top ? val : window.pageXOffset,
						top ? val : window.pageYOffset
					);

				} else {
					elem[ method ] = val;
				}
			}, method, val, arguments.length, null );
		};
	});

	// Support: Safari<7+, Chrome<37+
	// Add the top/left cssHooks using jQuery.fn.position
	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// Blink bug: https://code.google.com/p/chromium/issues/detail?id=229280
	// getComputedStyle returns percent when specified for top/left/bottom/right;
	// rather than make the css module depend on the offset module, just check for it here
	jQuery.each( [ "top", "left" ], function( i, prop ) {
		jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
			function( elem, computed ) {
				if ( computed ) {
					computed = curCSS( elem, prop );
					// If curCSS returns percentage, fallback to offset
					return rnumnonpx.test( computed ) ?
						jQuery( elem ).position()[ prop ] + "px" :
						computed;
				}
			}
		);
	});


	// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
	jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
		jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
			// Margin is only for outerHeight, outerWidth
			jQuery.fn[ funcName ] = function( margin, value ) {
				var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
					extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

				return access( this, function( elem, type, value ) {
					var doc;

					if ( jQuery.isWindow( elem ) ) {
						// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
						// isn't a whole lot we can do. See pull request at this URL for discussion:
						// https://github.com/jquery/jquery/pull/764
						return elem.document.documentElement[ "client" + name ];
					}

					// Get document width or height
					if ( elem.nodeType === 9 ) {
						doc = elem.documentElement;

						// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
						// whichever is greatest
						return Math.max(
							elem.body[ "scroll" + name ], doc[ "scroll" + name ],
							elem.body[ "offset" + name ], doc[ "offset" + name ],
							doc[ "client" + name ]
						);
					}

					return value === undefined ?
						// Get width or height on the element, requesting but not forcing parseFloat
						jQuery.css( elem, type, extra ) :

						// Set width or height on the element
						jQuery.style( elem, type, value, extra );
				}, type, chainable ? margin : undefined, chainable, null );
			};
		});
	});


	// The number of elements contained in the matched element set
	jQuery.fn.size = function() {
		return this.length;
	};

	jQuery.fn.andSelf = jQuery.fn.addBack;




	// Register as a named AMD module, since jQuery can be concatenated with other
	// files that may use define, but not via a proper concatenation script that
	// understands anonymous AMD modules. A named AMD is safest and most robust
	// way to register. Lowercase jquery is used because AMD module names are
	// derived from file names, and jQuery is normally delivered in a lowercase
	// file name. Do this after creating the global so that if an AMD module wants
	// to call noConflict to hide this version of jQuery, it will work.

	// Note that for maximum portability, libraries that are not jQuery should
	// declare themselves as anonymous modules, and avoid setting a global if an
	// AMD loader is present. jQuery is a special case. For more information, see
	// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

	if ( true ) {
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
			return jQuery;
		}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}




	var
		// Map over jQuery in case of overwrite
		_jQuery = window.jQuery,

		// Map over the $ in case of overwrite
		_$ = window.$;

	jQuery.noConflict = function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	};

	// Expose jQuery and $ identifiers, even in AMD
	// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
	// and CommonJS for browser emulators (#13566)
	if ( typeof noGlobal === strundefined ) {
		window.jQuery = window.$ = jQuery;
	}




	return jQuery;

	}));


/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (root, factory) {
	  if (true) {
	    // AMD. Register as an anonymous module unless amdModuleId is set
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(85)], __WEBPACK_AMD_DEFINE_RESULT__ = function (a0) {
	      return (root['Module'] = factory(a0));
	    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports === 'object') {
	    // Node. Does not work with strict CommonJS, but
	    // only CommonJS-like environments that support module.exports,
	    // like Node.
	    module.exports = factory(require("jquery"));
	  } else {
	    root['SimpleModule'] = factory(jQuery);
	  }
	}(this, function ($) {

	var Module,
	  slice = [].slice;

	Module = (function() {
	  Module.extend = function(obj) {
	    var key, ref, val;
	    if (!((obj != null) && typeof obj === 'object')) {
	      return;
	    }
	    for (key in obj) {
	      val = obj[key];
	      if (key !== 'included' && key !== 'extended') {
	        this[key] = val;
	      }
	    }
	    return (ref = obj.extended) != null ? ref.call(this) : void 0;
	  };

	  Module.include = function(obj) {
	    var key, ref, val;
	    if (!((obj != null) && typeof obj === 'object')) {
	      return;
	    }
	    for (key in obj) {
	      val = obj[key];
	      if (key !== 'included' && key !== 'extended') {
	        this.prototype[key] = val;
	      }
	    }
	    return (ref = obj.included) != null ? ref.call(this) : void 0;
	  };

	  Module.connect = function(cls) {
	    if (typeof cls !== 'function') {
	      return;
	    }
	    if (!cls.pluginName) {
	      throw new Error('Module.connect: cannot connect plugin without pluginName');
	      return;
	    }
	    cls.prototype._connected = true;
	    if (!this._connectedClasses) {
	      this._connectedClasses = [];
	    }
	    this._connectedClasses.push(cls);
	    if (cls.pluginName) {
	      return this[cls.pluginName] = cls;
	    }
	  };

	  Module.prototype.opts = {};

	  function Module(opts) {
	    var base, cls, i, instance, instances, len, name;
	    this.opts = $.extend({}, this.opts, opts);
	    (base = this.constructor)._connectedClasses || (base._connectedClasses = []);
	    instances = (function() {
	      var i, len, ref, results;
	      ref = this.constructor._connectedClasses;
	      results = [];
	      for (i = 0, len = ref.length; i < len; i++) {
	        cls = ref[i];
	        name = cls.pluginName.charAt(0).toLowerCase() + cls.pluginName.slice(1);
	        if (cls.prototype._connected) {
	          cls.prototype._module = this;
	        }
	        results.push(this[name] = new cls());
	      }
	      return results;
	    }).call(this);
	    if (this._connected) {
	      this.opts = $.extend({}, this.opts, this._module.opts);
	    } else {
	      this._init();
	      for (i = 0, len = instances.length; i < len; i++) {
	        instance = instances[i];
	        if (typeof instance._init === "function") {
	          instance._init();
	        }
	      }
	    }
	    this.trigger('initialized');
	  }

	  Module.prototype._init = function() {};

	  Module.prototype.on = function() {
	    var args, ref;
	    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
	    (ref = $(this)).on.apply(ref, args);
	    return this;
	  };

	  Module.prototype.one = function() {
	    var args, ref;
	    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
	    (ref = $(this)).one.apply(ref, args);
	    return this;
	  };

	  Module.prototype.off = function() {
	    var args, ref;
	    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
	    (ref = $(this)).off.apply(ref, args);
	    return this;
	  };

	  Module.prototype.trigger = function() {
	    var args, ref;
	    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
	    (ref = $(this)).trigger.apply(ref, args);
	    return this;
	  };

	  Module.prototype.triggerHandler = function() {
	    var args, ref;
	    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
	    return (ref = $(this)).triggerHandler.apply(ref, args);
	  };

	  Module.prototype._t = function() {
	    var args, ref;
	    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
	    return (ref = this.constructor)._t.apply(ref, args);
	  };

	  Module._t = function() {
	    var args, key, ref, result;
	    key = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
	    result = ((ref = this.i18n[this.locale]) != null ? ref[key] : void 0) || '';
	    if (!(args.length > 0)) {
	      return result;
	    }
	    result = result.replace(/([^%]|^)%(?:(\d+)\$)?s/g, function(p0, p, position) {
	      if (position) {
	        return p + args[parseInt(position) - 1];
	      } else {
	        return p + args.shift();
	      }
	    });
	    return result.replace(/%%s/g, '%s');
	  };

	  Module.i18n = {
	    'zh-CN': {}
	  };

	  Module.locale = 'zh-CN';

	  return Module;

	})();

	return Module;

	}));


/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (root, factory) {
	  if (true) {
	    // AMD. Register as an anonymous module unless amdModuleId is set
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(85),__webpack_require__(86)], __WEBPACK_AMD_DEFINE_RESULT__ = function ($, SimpleModule) {
	      return (root['hotkeys'] = factory($, SimpleModule));
	    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports === 'object') {
	    // Node. Does not work with strict CommonJS, but
	    // only CommonJS-like environments that support module.exports,
	    // like Node.
	    module.exports = factory(require("jquery"),require("simple-module"));
	  } else {
	    root.simple = root.simple || {};
	    root.simple['hotkeys'] = factory(jQuery,SimpleModule);
	  }
	}(this, function ($, SimpleModule) {

	var Hotkeys, hotkeys,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;

	Hotkeys = (function(superClass) {
	  extend(Hotkeys, superClass);

	  function Hotkeys() {
	    return Hotkeys.__super__.constructor.apply(this, arguments);
	  }

	  Hotkeys.count = 0;

	  Hotkeys.keyNameMap = {
	    8: "Backspace",
	    9: "Tab",
	    13: "Enter",
	    16: "Shift",
	    17: "Control",
	    18: "Alt",
	    19: "Pause",
	    20: "CapsLock",
	    27: "Esc",
	    32: "Spacebar",
	    33: "PageUp",
	    34: "PageDown",
	    35: "End",
	    36: "Home",
	    37: "Left",
	    38: "Up",
	    39: "Right",
	    40: "Down",
	    45: "Insert",
	    46: "Del",
	    91: "Meta",
	    93: "Meta",
	    48: "0",
	    49: "1",
	    50: "2",
	    51: "3",
	    52: "4",
	    53: "5",
	    54: "6",
	    55: "7",
	    56: "8",
	    57: "9",
	    65: "A",
	    66: "B",
	    67: "C",
	    68: "D",
	    69: "E",
	    70: "F",
	    71: "G",
	    72: "H",
	    73: "I",
	    74: "J",
	    75: "K",
	    76: "L",
	    77: "M",
	    78: "N",
	    79: "O",
	    80: "P",
	    81: "Q",
	    82: "R",
	    83: "S",
	    84: "T",
	    85: "U",
	    86: "V",
	    87: "W",
	    88: "X",
	    89: "Y",
	    90: "Z",
	    96: "0",
	    97: "1",
	    98: "2",
	    99: "3",
	    100: "4",
	    101: "5",
	    102: "6",
	    103: "7",
	    104: "8",
	    105: "9",
	    106: "Multiply",
	    107: "Add",
	    109: "Subtract",
	    110: "Decimal",
	    111: "Divide",
	    112: "F1",
	    113: "F2",
	    114: "F3",
	    115: "F4",
	    116: "F5",
	    117: "F6",
	    118: "F7",
	    119: "F8",
	    120: "F9",
	    121: "F10",
	    122: "F11",
	    123: "F12",
	    124: "F13",
	    125: "F14",
	    126: "F15",
	    127: "F16",
	    128: "F17",
	    129: "F18",
	    130: "F19",
	    131: "F20",
	    132: "F21",
	    133: "F22",
	    134: "F23",
	    135: "F24",
	    59: ";",
	    61: "=",
	    186: ";",
	    187: "=",
	    188: ",",
	    190: ".",
	    191: "/",
	    192: "`",
	    219: "[",
	    220: "\\",
	    221: "]",
	    222: "'"
	  };

	  Hotkeys.aliases = {
	    "escape": "esc",
	    "delete": "del",
	    "return": "enter",
	    "ctrl": "control",
	    "space": "spacebar",
	    "ins": "insert",
	    "cmd": "meta",
	    "command": "meta",
	    "wins": "meta",
	    "windows": "meta"
	  };

	  Hotkeys.normalize = function(shortcut) {
	    var i, j, key, keyname, keys, len;
	    keys = shortcut.toLowerCase().replace(/\s+/gi, "").split("+");
	    for (i = j = 0, len = keys.length; j < len; i = ++j) {
	      key = keys[i];
	      keys[i] = this.aliases[key] || key;
	    }
	    keyname = keys.pop();
	    keys.sort().push(keyname);
	    return keys.join("_");
	  };

	  Hotkeys.prototype.opts = {
	    el: document
	  };

	  Hotkeys.prototype._init = function() {
	    this.id = ++this.constructor.count;
	    this._map = {};
	    this._delegate = typeof this.opts.el === "string" ? document : this.opts.el;
	    return $(this._delegate).on("keydown.simple-hotkeys-" + this.id, this.opts.el, (function(_this) {
	      return function(e) {
	        var ref;
	        return (ref = _this._getHander(e)) != null ? ref.call(_this, e) : void 0;
	      };
	    })(this));
	  };

	  Hotkeys.prototype._getHander = function(e) {
	    var keyname, shortcut;
	    if (!(keyname = this.constructor.keyNameMap[e.which])) {
	      return;
	    }
	    shortcut = "";
	    if (e.altKey) {
	      shortcut += "alt_";
	    }
	    if (e.ctrlKey) {
	      shortcut += "control_";
	    }
	    if (e.metaKey) {
	      shortcut += "meta_";
	    }
	    if (e.shiftKey) {
	      shortcut += "shift_";
	    }
	    shortcut += keyname.toLowerCase();
	    return this._map[shortcut];
	  };

	  Hotkeys.prototype.respondTo = function(subject) {
	    if (typeof subject === 'string') {
	      return this._map[this.constructor.normalize(subject)] != null;
	    } else {
	      return this._getHander(subject) != null;
	    }
	  };

	  Hotkeys.prototype.add = function(shortcut, handler) {
	    this._map[this.constructor.normalize(shortcut)] = handler;
	    return this;
	  };

	  Hotkeys.prototype.remove = function(shortcut) {
	    delete this._map[this.constructor.normalize(shortcut)];
	    return this;
	  };

	  Hotkeys.prototype.destroy = function() {
	    $(this._delegate).off(".simple-hotkeys-" + this.id);
	    this._map = {};
	    return this;
	  };

	  return Hotkeys;

	})(SimpleModule);

	hotkeys = function(opts) {
	  return new Hotkeys(opts);
	};

	return hotkeys;

	}));



/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (root, factory) {
	  if (true) {
	    // AMD. Register as an anonymous module unless amdModuleId is set
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(85),__webpack_require__(86)], __WEBPACK_AMD_DEFINE_RESULT__ = function ($, SimpleModule) {
	      return (root['uploader'] = factory($, SimpleModule));
	    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports === 'object') {
	    // Node. Does not work with strict CommonJS, but
	    // only CommonJS-like environments that support module.exports,
	    // like Node.
	    module.exports = factory(require("jquery"),require("simple-module"));
	  } else {
	    root.simple = root.simple || {};
	    root.simple['uploader'] = factory(jQuery,SimpleModule);
	  }
	}(this, function ($, SimpleModule) {

	var Uploader, uploader,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;

	Uploader = (function(superClass) {
	  extend(Uploader, superClass);

	  function Uploader() {
	    return Uploader.__super__.constructor.apply(this, arguments);
	  }

	  Uploader.count = 0;

	  Uploader.prototype.opts = {
	    url: '',
	    params: null,
	    fileKey: 'upload_file',
	    connectionCount: 3
	  };

	  Uploader.prototype._init = function() {
	    this.files = [];
	    this.queue = [];
	    this.id = ++Uploader.count;
	    this.on('uploadcomplete', (function(_this) {
	      return function(e, file) {
	        _this.files.splice($.inArray(file, _this.files), 1);
	        if (_this.queue.length > 0 && _this.files.length < _this.opts.connectionCount) {
	          return _this.upload(_this.queue.shift());
	        } else {
	          return _this.uploading = false;
	        }
	      };
	    })(this));
	    return $(window).on('beforeunload.uploader-' + this.id, (function(_this) {
	      return function(e) {
	        if (!_this.uploading) {
	          return;
	        }
	        e.originalEvent.returnValue = _this._t('leaveConfirm');
	        return _this._t('leaveConfirm');
	      };
	    })(this));
	  };

	  Uploader.prototype.generateId = (function() {
	    var id;
	    id = 0;
	    return function() {
	      return id += 1;
	    };
	  })();

	  Uploader.prototype.upload = function(file, opts) {
	    var f, i, key, len;
	    if (opts == null) {
	      opts = {};
	    }
	    if (file == null) {
	      return;
	    }
	    if ($.isArray(file) || file instanceof FileList) {
	      for (i = 0, len = file.length; i < len; i++) {
	        f = file[i];
	        this.upload(f, opts);
	      }
	    } else if ($(file).is('input:file')) {
	      key = $(file).attr('name');
	      if (key) {
	        opts.fileKey = key;
	      }
	      this.upload($.makeArray($(file)[0].files), opts);
	    } else if (!file.id || !file.obj) {
	      file = this.getFile(file);
	    }
	    if (!(file && file.obj)) {
	      return;
	    }
	    $.extend(file, opts);
	    if (this.files.length >= this.opts.connectionCount) {
	      this.queue.push(file);
	      return;
	    }
	    if (this.triggerHandler('beforeupload', [file]) === false) {
	      return;
	    }
	    this.files.push(file);
	    this._xhrUpload(file);
	    return this.uploading = true;
	  };

	  Uploader.prototype.getFile = function(fileObj) {
	    var name, ref, ref1;
	    if (fileObj instanceof window.File || fileObj instanceof window.Blob) {
	      name = (ref = fileObj.fileName) != null ? ref : fileObj.name;
	    } else {
	      return null;
	    }
	    return {
	      id: this.generateId(),
	      url: this.opts.url,
	      params: this.opts.params,
	      fileKey: this.opts.fileKey,
	      name: name,
	      size: (ref1 = fileObj.fileSize) != null ? ref1 : fileObj.size,
	      ext: name ? name.split('.').pop().toLowerCase() : '',
	      obj: fileObj
	    };
	  };

	  Uploader.prototype._xhrUpload = function(file) {
	    var formData, k, ref, v;
	    formData = new FormData();
	    formData.append(file.fileKey, file.obj);
	    formData.append("original_filename", file.name);
	    if (file.params) {
	      ref = file.params;
	      for (k in ref) {
	        v = ref[k];
	        formData.append(k, v);
	      }
	    }
	    return file.xhr = $.ajax({
	      url: file.url,
	      data: formData,
	      processData: false,
	      contentType: false,
	      type: 'POST',
	      headers: {
	        'X-File-Name': encodeURIComponent(file.name)
	      },
	      xhr: function() {
	        var req;
	        req = $.ajaxSettings.xhr();
	        if (req) {
	          req.upload.onprogress = (function(_this) {
	            return function(e) {
	              return _this.progress(e);
	            };
	          })(this);
	        }
	        return req;
	      },
	      progress: (function(_this) {
	        return function(e) {
	          if (!e.lengthComputable) {
	            return;
	          }
	          return _this.trigger('uploadprogress', [file, e.loaded, e.total]);
	        };
	      })(this),
	      error: (function(_this) {
	        return function(xhr, status, err) {
	          return _this.trigger('uploaderror', [file, xhr, status]);
	        };
	      })(this),
	      success: (function(_this) {
	        return function(result) {
	          _this.trigger('uploadprogress', [file, file.size, file.size]);
	          _this.trigger('uploadsuccess', [file, result]);
	          return $(document).trigger('uploadsuccess', [file, result, _this]);
	        };
	      })(this),
	      complete: (function(_this) {
	        return function(xhr, status) {
	          return _this.trigger('uploadcomplete', [file, xhr.responseText]);
	        };
	      })(this)
	    });
	  };

	  Uploader.prototype.cancel = function(file) {
	    var f, i, len, ref;
	    if (!file.id) {
	      ref = this.files;
	      for (i = 0, len = ref.length; i < len; i++) {
	        f = ref[i];
	        if (f.id === file * 1) {
	          file = f;
	          break;
	        }
	      }
	    }
	    this.trigger('uploadcancel', [file]);
	    if (file.xhr) {
	      file.xhr.abort();
	    }
	    return file.xhr = null;
	  };

	  Uploader.prototype.readImageFile = function(fileObj, callback) {
	    var fileReader, img;
	    if (!$.isFunction(callback)) {
	      return;
	    }
	    img = new Image();
	    img.onload = function() {
	      return callback(img);
	    };
	    img.onerror = function() {
	      return callback();
	    };
	    if (window.FileReader && FileReader.prototype.readAsDataURL && /^image/.test(fileObj.type)) {
	      fileReader = new FileReader();
	      fileReader.onload = function(e) {
	        return img.src = e.target.result;
	      };
	      return fileReader.readAsDataURL(fileObj);
	    } else {
	      return callback();
	    }
	  };

	  Uploader.prototype.destroy = function() {
	    var file, i, len, ref;
	    this.queue.length = 0;
	    ref = this.files;
	    for (i = 0, len = ref.length; i < len; i++) {
	      file = ref[i];
	      this.cancel(file);
	    }
	    $(window).off('.uploader-' + this.id);
	    return $(document).off('.uploader-' + this.id);
	  };

	  Uploader.i18n = {
	    'zh-CN': {
	      leaveConfirm: '正在上传文件，如果离开上传会自动取消'
	    }
	  };

	  Uploader.locale = 'zh-CN';

	  return Uploader;

	})(SimpleModule);

	uploader = function(opts) {
	  return new Uploader(opts);
	};

	return uploader;

	}));


/***/ },
/* 89 */
/***/ function(module, exports) {

	module.exports = "<textarea placeholder=\"\"></textarea>\n";

/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	var Autolinker, bz;

	__webpack_require__(91);

	bz = __webpack_require__(77);

	Autolinker = __webpack_require__(93);

	module.exports = {
	  template: __webpack_require__(94),
	  props: ['message'],
	  computed: {
	    avatar: function() {
	      var avatar;
	      avatar = btoa(btoa(this.message.avatar));
	      return '/sp/' + avatar;
	    },
	    medias: function() {
	      if (this.message.extended_entities) {
	        return _.map(this.message.extended_entities.media, function(d) {
	          var height, img_height, img_url, img_width, t;
	          img_url = '/sp/' + btoa(btoa(d.media_url_https));
	          img_height = d.sizes.large.h;
	          img_width = d.sizes.large.w;
	          height = bz.getFitHeight(img_height, img_width);
	          t = {
	            img_url: img_url,
	            height: height
	          };
	          return t;
	        });
	      }
	    },
	    text: function() {
	      return Autolinker.link(this.message.text);
	    }
	  }
	};


/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(92);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/less-loader/index.js!./style.less", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/less-loader/index.js!./style.less");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, ".name {\n  margin-right: 50px;\n  margin-left: 0;\n  position: relative;\n  padding: 5px 10px;\n  margin: 5px 0 0 40px;\n  display: block;\n}\n.form-lable {\n  text-align: left;\n  font-weight: normal;\n}\n.min-form-lable {\n  text-align: left;\n  font-weight: normal;\n  padding-right: 0px;\n}\n.form-horizontal .control-label {\n  text-align: left;\n  font-weight: normal;\n}\n.round-icon {\n  border-radius: 100%;\n  padding: 4px;\n  color: #fff;\n  width: 24px;\n  height: 24px;\n  line-height: 17px;\n  display: inline-block;\n  font-size: 14px;\n  text-align: center;\n}\n.bg-icon-red {\n  background: #a33950;\n}\n.bg-icon-blue {\n  background: #3c83c5;\n}\n.bg-icon-orange {\n  background: #cd7020;\n}\n.bg-icon-black {\n  background: #000;\n}\n.bg-icon-green {\n  background: #33b332;\n}\n.round-icon:hover {\n  font-size: 17px;\n}\n@media screen and (max-width: 768px) {\n  #user_info {\n    display: none;\n  }\n}\n.my-img-responsive {\n  display: block;\n  max-width: 100%;\n}\n", ""]);

	// exports


/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (root, factory) {
	  if (true) {
	    // AMD. Register as an anonymous module unless amdModuleId is set
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
	      return (root['Autolinker'] = factory());
	    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports === 'object') {
	    // Node. Does not work with strict CommonJS, but
	    // only CommonJS-like environments that support module.exports,
	    // like Node.
	    module.exports = factory();
	  } else {
	    root['Autolinker'] = factory();
	  }
	}(this, function () {

	/*!
	 * Autolinker.js
	 * 0.18.1
	 *
	 * Copyright(c) 2015 Gregory Jacobs <greg@greg-jacobs.com>
	 * MIT Licensed. http://www.opensource.org/licenses/mit-license.php
	 *
	 * https://github.com/gregjacobs/Autolinker.js
	 */
	/**
	 * @class Autolinker
	 * @extends Object
	 *
	 * Utility class used to process a given string of text, and wrap the matches in
	 * the appropriate anchor (&lt;a&gt;) tags to turn them into links.
	 *
	 * Any of the configuration options may be provided in an Object (map) provided
	 * to the Autolinker constructor, which will configure how the {@link #link link()}
	 * method will process the links.
	 *
	 * For example:
	 *
	 *     var autolinker = new Autolinker( {
	 *         newWindow : false,
	 *         truncate  : 30
	 *     } );
	 *
	 *     var html = autolinker.link( "Joe went to www.yahoo.com" );
	 *     // produces: 'Joe went to <a href="http://www.yahoo.com">yahoo.com</a>'
	 *
	 *
	 * The {@link #static-link static link()} method may also be used to inline options into a single call, which may
	 * be more convenient for one-off uses. For example:
	 *
	 *     var html = Autolinker.link( "Joe went to www.yahoo.com", {
	 *         newWindow : false,
	 *         truncate  : 30
	 *     } );
	 *     // produces: 'Joe went to <a href="http://www.yahoo.com">yahoo.com</a>'
	 *
	 *
	 * ## Custom Replacements of Links
	 *
	 * If the configuration options do not provide enough flexibility, a {@link #replaceFn}
	 * may be provided to fully customize the output of Autolinker. This function is
	 * called once for each URL/Email/Phone#/Twitter Handle/Hashtag match that is
	 * encountered.
	 *
	 * For example:
	 *
	 *     var input = "...";  // string with URLs, Email Addresses, Phone #s, Twitter Handles, and Hashtags
	 *
	 *     var linkedText = Autolinker.link( input, {
	 *         replaceFn : function( autolinker, match ) {
	 *             console.log( "href = ", match.getAnchorHref() );
	 *             console.log( "text = ", match.getAnchorText() );
	 *
	 *             switch( match.getType() ) {
	 *                 case 'url' :
	 *                     console.log( "url: ", match.getUrl() );
	 *
	 *                     if( match.getUrl().indexOf( 'mysite.com' ) === -1 ) {
	 *                         var tag = autolinker.getTagBuilder().build( match );  // returns an `Autolinker.HtmlTag` instance, which provides mutator methods for easy changes
	 *                         tag.setAttr( 'rel', 'nofollow' );
	 *                         tag.addClass( 'external-link' );
	 *
	 *                         return tag;
	 *
	 *                     } else {
	 *                         return true;  // let Autolinker perform its normal anchor tag replacement
	 *                     }
	 *
	 *                 case 'email' :
	 *                     var email = match.getEmail();
	 *                     console.log( "email: ", email );
	 *
	 *                     if( email === "my@own.address" ) {
	 *                         return false;  // don't auto-link this particular email address; leave as-is
	 *                     } else {
	 *                         return;  // no return value will have Autolinker perform its normal anchor tag replacement (same as returning `true`)
	 *                     }
	 *
	 *                 case 'phone' :
	 *                     var phoneNumber = match.getPhoneNumber();
	 *                     console.log( phoneNumber );
	 *
	 *                     return '<a href="http://newplace.to.link.phone.numbers.to/">' + phoneNumber + '</a>';
	 *
	 *                 case 'twitter' :
	 *                     var twitterHandle = match.getTwitterHandle();
	 *                     console.log( twitterHandle );
	 *
	 *                     return '<a href="http://newplace.to.link.twitter.handles.to/">' + twitterHandle + '</a>';
	 *
	 *                 case 'hashtag' :
	 *                     var hashtag = match.getHashtag();
	 *                     console.log( hashtag );
	 *
	 *                     return '<a href="http://newplace.to.link.hashtag.handles.to/">' + hashtag + '</a>';
	 *             }
	 *         }
	 *     } );
	 *
	 *
	 * The function may return the following values:
	 *
	 * - `true` (Boolean): Allow Autolinker to replace the match as it normally would.
	 * - `false` (Boolean): Do not replace the current match at all - leave as-is.
	 * - Any String: If a string is returned from the function, the string will be used directly as the replacement HTML for
	 *   the match.
	 * - An {@link Autolinker.HtmlTag} instance, which can be used to build/modify an HTML tag before writing out its HTML text.
	 *
	 * @constructor
	 * @param {Object} [config] The configuration options for the Autolinker instance, specified in an Object (map).
	 */
	var Autolinker = function( cfg ) {
		Autolinker.Util.assign( this, cfg );  // assign the properties of `cfg` onto the Autolinker instance. Prototype properties will be used for missing configs.

		// Validate the value of the `hashtag` cfg.
		var hashtag = this.hashtag;
		if( hashtag !== false && hashtag !== 'twitter' && hashtag !== 'facebook' ) {
			throw new Error( "invalid `hashtag` cfg - see docs" );
		}
	};

	Autolinker.prototype = {
		constructor : Autolinker,  // fix constructor property

		/**
		 * @cfg {Boolean} urls
		 *
		 * `true` if miscellaneous URLs should be automatically linked, `false` if they should not be.
		 */
		urls : true,

		/**
		 * @cfg {Boolean} email
		 *
		 * `true` if email addresses should be automatically linked, `false` if they should not be.
		 */
		email : true,

		/**
		 * @cfg {Boolean} twitter
		 *
		 * `true` if Twitter handles ("@example") should be automatically linked, `false` if they should not be.
		 */
		twitter : true,

		/**
		 * @cfg {Boolean} phone
		 *
		 * `true` if Phone numbers ("(555)555-5555") should be automatically linked, `false` if they should not be.
		 */
		phone: true,

		/**
		 * @cfg {Boolean/String} hashtag
		 *
		 * A string for the service name to have hashtags (ex: "#myHashtag")
		 * auto-linked to. The currently-supported values are:
		 *
		 * - 'twitter'
		 * - 'facebook'
		 *
		 * Pass `false` to skip auto-linking of hashtags.
		 */
		hashtag : false,

		/**
		 * @cfg {Boolean} newWindow
		 *
		 * `true` if the links should open in a new window, `false` otherwise.
		 */
		newWindow : true,

		/**
		 * @cfg {Boolean} stripPrefix
		 *
		 * `true` if 'http://' or 'https://' and/or the 'www.' should be stripped
		 * from the beginning of URL links' text, `false` otherwise.
		 */
		stripPrefix : true,

		/**
		 * @cfg {Number} truncate
		 *
		 * A number for how many characters long matched text should be truncated to inside the text of
		 * a link. If the matched text is over this number of characters, it will be truncated to this length by
		 * adding a two period ellipsis ('..') to the end of the string.
		 *
		 * For example: A url like 'http://www.yahoo.com/some/long/path/to/a/file' truncated to 25 characters might look
		 * something like this: 'yahoo.com/some/long/pat..'
		 */
		truncate : undefined,

		/**
		 * @cfg {String} className
		 *
		 * A CSS class name to add to the generated links. This class will be added to all links, as well as this class
		 * plus match suffixes for styling url/email/phone/twitter/hashtag links differently.
		 *
		 * For example, if this config is provided as "myLink", then:
		 *
		 * - URL links will have the CSS classes: "myLink myLink-url"
		 * - Email links will have the CSS classes: "myLink myLink-email", and
		 * - Twitter links will have the CSS classes: "myLink myLink-twitter"
		 * - Phone links will have the CSS classes: "myLink myLink-phone"
		 * - Hashtag links will have the CSS classes: "myLink myLink-hashtag"
		 */
		className : "",

		/**
		 * @cfg {Function} replaceFn
		 *
		 * A function to individually process each match found in the input string.
		 *
		 * See the class's description for usage.
		 *
		 * This function is called with the following parameters:
		 *
		 * @cfg {Autolinker} replaceFn.autolinker The Autolinker instance, which may be used to retrieve child objects from (such
		 *   as the instance's {@link #getTagBuilder tag builder}).
		 * @cfg {Autolinker.match.Match} replaceFn.match The Match instance which can be used to retrieve information about the
		 *   match that the `replaceFn` is currently processing. See {@link Autolinker.match.Match} subclasses for details.
		 */


		/**
		 * @private
		 * @property {Autolinker.htmlParser.HtmlParser} htmlParser
		 *
		 * The HtmlParser instance used to skip over HTML tags, while finding text nodes to process. This is lazily instantiated
		 * in the {@link #getHtmlParser} method.
		 */
		htmlParser : undefined,

		/**
		 * @private
		 * @property {Autolinker.matchParser.MatchParser} matchParser
		 *
		 * The MatchParser instance used to find matches in the text nodes of an input string passed to
		 * {@link #link}. This is lazily instantiated in the {@link #getMatchParser} method.
		 */
		matchParser : undefined,

		/**
		 * @private
		 * @property {Autolinker.AnchorTagBuilder} tagBuilder
		 *
		 * The AnchorTagBuilder instance used to build match replacement anchor tags. Note: this is lazily instantiated
		 * in the {@link #getTagBuilder} method.
		 */
		tagBuilder : undefined,

		/**
		 * Automatically links URLs, Email addresses, Phone numbers, Twitter
		 * handles, and Hashtags found in the given chunk of HTML. Does not link
		 * URLs found within HTML tags.
		 *
		 * For instance, if given the text: `You should go to http://www.yahoo.com`,
		 * then the result will be `You should go to
		 * &lt;a href="http://www.yahoo.com"&gt;http://www.yahoo.com&lt;/a&gt;`
		 *
		 * This method finds the text around any HTML elements in the input
		 * `textOrHtml`, which will be the text that is processed. Any original HTML
		 * elements will be left as-is, as well as the text that is already wrapped
		 * in anchor (&lt;a&gt;) tags.
		 *
		 * @param {String} textOrHtml The HTML or text to autolink matches within
		 *   (depending on if the {@link #urls}, {@link #email}, {@link #phone},
		 *   {@link #twitter}, and {@link #hashtag} options are enabled).
		 * @return {String} The HTML, with matches automatically linked.
		 */
		link : function( textOrHtml ) {
			if( !textOrHtml ) { return ""; }  // handle `null` and `undefined`

			var htmlParser = this.getHtmlParser(),
			    htmlNodes = htmlParser.parse( textOrHtml ),
			    anchorTagStackCount = 0,  // used to only process text around anchor tags, and any inner text/html they may have
			    resultHtml = [];

			for( var i = 0, len = htmlNodes.length; i < len; i++ ) {
				var node = htmlNodes[ i ],
				    nodeType = node.getType(),
				    nodeText = node.getText();

				if( nodeType === 'element' ) {
					// Process HTML nodes in the input `textOrHtml`
					if( node.getTagName() === 'a' ) {
						if( !node.isClosing() ) {  // it's the start <a> tag
							anchorTagStackCount++;
						} else {   // it's the end </a> tag
							anchorTagStackCount = Math.max( anchorTagStackCount - 1, 0 );  // attempt to handle extraneous </a> tags by making sure the stack count never goes below 0
						}
					}
					resultHtml.push( nodeText );  // now add the text of the tag itself verbatim

				} else if( nodeType === 'entity' || nodeType === 'comment' ) {
					resultHtml.push( nodeText );  // append HTML entity nodes (such as '&nbsp;') or HTML comments (such as '<!-- Comment -->') verbatim

				} else {
					// Process text nodes in the input `textOrHtml`
					if( anchorTagStackCount === 0 ) {
						// If we're not within an <a> tag, process the text node to linkify
						var linkifiedStr = this.linkifyStr( nodeText );
						resultHtml.push( linkifiedStr );

					} else {
						// `text` is within an <a> tag, simply append the text - we do not want to autolink anything
						// already within an <a>...</a> tag
						resultHtml.push( nodeText );
					}
				}
			}

			return resultHtml.join( "" );
		},

		/**
		 * Process the text that lies in between HTML tags, performing the anchor
		 * tag replacements for the matches, and returns the string with the
		 * replacements made.
		 *
		 * This method does the actual wrapping of matches with anchor tags.
		 *
		 * @private
		 * @param {String} str The string of text to auto-link.
		 * @return {String} The text with anchor tags auto-filled.
		 */
		linkifyStr : function( str ) {
			return this.getMatchParser().replace( str, this.createMatchReturnVal, this );
		},


		/**
		 * Creates the return string value for a given match in the input string,
		 * for the {@link #linkifyStr} method.
		 *
		 * This method handles the {@link #replaceFn}, if one was provided.
		 *
		 * @private
		 * @param {Autolinker.match.Match} match The Match object that represents the match.
		 * @return {String} The string that the `match` should be replaced with. This is usually the anchor tag string, but
		 *   may be the `matchStr` itself if the match is not to be replaced.
		 */
		createMatchReturnVal : function( match ) {
			// Handle a custom `replaceFn` being provided
			var replaceFnResult;
			if( this.replaceFn ) {
				replaceFnResult = this.replaceFn.call( this, this, match );  // Autolinker instance is the context, and the first arg
			}

			if( typeof replaceFnResult === 'string' ) {
				return replaceFnResult;  // `replaceFn` returned a string, use that

			} else if( replaceFnResult === false ) {
				return match.getMatchedText();  // no replacement for the match

			} else if( replaceFnResult instanceof Autolinker.HtmlTag ) {
				return replaceFnResult.toAnchorString();

			} else {  // replaceFnResult === true, or no/unknown return value from function
				// Perform Autolinker's default anchor tag generation
				var tagBuilder = this.getTagBuilder(),
				    anchorTag = tagBuilder.build( match );  // returns an Autolinker.HtmlTag instance

				return anchorTag.toAnchorString();
			}
		},


		/**
		 * Lazily instantiates and returns the {@link #htmlParser} instance for this Autolinker instance.
		 *
		 * @protected
		 * @return {Autolinker.htmlParser.HtmlParser}
		 */
		getHtmlParser : function() {
			var htmlParser = this.htmlParser;

			if( !htmlParser ) {
				htmlParser = this.htmlParser = new Autolinker.htmlParser.HtmlParser();
			}

			return htmlParser;
		},


		/**
		 * Lazily instantiates and returns the {@link #matchParser} instance for this Autolinker instance.
		 *
		 * @protected
		 * @return {Autolinker.matchParser.MatchParser}
		 */
		getMatchParser : function() {
			var matchParser = this.matchParser;

			if( !matchParser ) {
				matchParser = this.matchParser = new Autolinker.matchParser.MatchParser( {
					urls        : this.urls,
					email       : this.email,
					twitter     : this.twitter,
					phone       : this.phone,
					hashtag     : this.hashtag,
					stripPrefix : this.stripPrefix
				} );
			}

			return matchParser;
		},


		/**
		 * Returns the {@link #tagBuilder} instance for this Autolinker instance, lazily instantiating it
		 * if it does not yet exist.
		 *
		 * This method may be used in a {@link #replaceFn} to generate the {@link Autolinker.HtmlTag HtmlTag} instance that
		 * Autolinker would normally generate, and then allow for modifications before returning it. For example:
		 *
		 *     var html = Autolinker.link( "Test google.com", {
		 *         replaceFn : function( autolinker, match ) {
		 *             var tag = autolinker.getTagBuilder().build( match );  // returns an {@link Autolinker.HtmlTag} instance
		 *             tag.setAttr( 'rel', 'nofollow' );
		 *
		 *             return tag;
		 *         }
		 *     } );
		 *
		 *     // generated html:
		 *     //   Test <a href="http://google.com" target="_blank" rel="nofollow">google.com</a>
		 *
		 * @return {Autolinker.AnchorTagBuilder}
		 */
		getTagBuilder : function() {
			var tagBuilder = this.tagBuilder;

			if( !tagBuilder ) {
				tagBuilder = this.tagBuilder = new Autolinker.AnchorTagBuilder( {
					newWindow   : this.newWindow,
					truncate    : this.truncate,
					className   : this.className
				} );
			}

			return tagBuilder;
		}

	};


	/**
	 * Automatically links URLs, Email addresses, Phone Numbers, Twitter handles,
	 * and Hashtags found in the given chunk of HTML. Does not link URLs found
	 * within HTML tags.
	 *
	 * For instance, if given the text: `You should go to http://www.yahoo.com`,
	 * then the result will be `You should go to &lt;a href="http://www.yahoo.com"&gt;http://www.yahoo.com&lt;/a&gt;`
	 *
	 * Example:
	 *
	 *     var linkedText = Autolinker.link( "Go to google.com", { newWindow: false } );
	 *     // Produces: "Go to <a href="http://google.com">google.com</a>"
	 *
	 * @static
	 * @param {String} textOrHtml The HTML or text to find matches within (depending
	 *   on if the {@link #urls}, {@link #email}, {@link #phone}, {@link #twitter},
	 *   and {@link #hashtag} options are enabled).
	 * @param {Object} [options] Any of the configuration options for the Autolinker
	 *   class, specified in an Object (map). See the class description for an
	 *   example call.
	 * @return {String} The HTML text, with matches automatically linked.
	 */
	Autolinker.link = function( textOrHtml, options ) {
		var autolinker = new Autolinker( options );
		return autolinker.link( textOrHtml );
	};


	// Autolinker Namespaces
	Autolinker.match = {};
	Autolinker.htmlParser = {};
	Autolinker.matchParser = {};

	/*global Autolinker */
	/*jshint eqnull:true, boss:true */
	/**
	 * @class Autolinker.Util
	 * @singleton
	 *
	 * A few utility methods for Autolinker.
	 */
	Autolinker.Util = {

		/**
		 * @property {Function} abstractMethod
		 *
		 * A function object which represents an abstract method.
		 */
		abstractMethod : function() { throw "abstract"; },


		/**
		 * @private
		 * @property {RegExp} trimRegex
		 *
		 * The regular expression used to trim the leading and trailing whitespace
		 * from a string.
		 */
		trimRegex : /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,


		/**
		 * Assigns (shallow copies) the properties of `src` onto `dest`.
		 *
		 * @param {Object} dest The destination object.
		 * @param {Object} src The source object.
		 * @return {Object} The destination object (`dest`)
		 */
		assign : function( dest, src ) {
			for( var prop in src ) {
				if( src.hasOwnProperty( prop ) ) {
					dest[ prop ] = src[ prop ];
				}
			}

			return dest;
		},


		/**
		 * Extends `superclass` to create a new subclass, adding the `protoProps` to the new subclass's prototype.
		 *
		 * @param {Function} superclass The constructor function for the superclass.
		 * @param {Object} protoProps The methods/properties to add to the subclass's prototype. This may contain the
		 *   special property `constructor`, which will be used as the new subclass's constructor function.
		 * @return {Function} The new subclass function.
		 */
		extend : function( superclass, protoProps ) {
			var superclassProto = superclass.prototype;

			var F = function() {};
			F.prototype = superclassProto;

			var subclass;
			if( protoProps.hasOwnProperty( 'constructor' ) ) {
				subclass = protoProps.constructor;
			} else {
				subclass = function() { superclassProto.constructor.apply( this, arguments ); };
			}

			var subclassProto = subclass.prototype = new F();  // set up prototype chain
			subclassProto.constructor = subclass;  // fix constructor property
			subclassProto.superclass = superclassProto;

			delete protoProps.constructor;  // don't re-assign constructor property to the prototype, since a new function may have been created (`subclass`), which is now already there
			Autolinker.Util.assign( subclassProto, protoProps );

			return subclass;
		},


		/**
		 * Truncates the `str` at `len - ellipsisChars.length`, and adds the `ellipsisChars` to the
		 * end of the string (by default, two periods: '..'). If the `str` length does not exceed
		 * `len`, the string will be returned unchanged.
		 *
		 * @param {String} str The string to truncate and add an ellipsis to.
		 * @param {Number} truncateLen The length to truncate the string at.
		 * @param {String} [ellipsisChars=..] The ellipsis character(s) to add to the end of `str`
		 *   when truncated. Defaults to '..'
		 */
		ellipsis : function( str, truncateLen, ellipsisChars ) {
			if( str.length > truncateLen ) {
				ellipsisChars = ( ellipsisChars == null ) ? '..' : ellipsisChars;
				str = str.substring( 0, truncateLen - ellipsisChars.length ) + ellipsisChars;
			}
			return str;
		},


		/**
		 * Supports `Array.prototype.indexOf()` functionality for old IE (IE8 and below).
		 *
		 * @param {Array} arr The array to find an element of.
		 * @param {*} element The element to find in the array, and return the index of.
		 * @return {Number} The index of the `element`, or -1 if it was not found.
		 */
		indexOf : function( arr, element ) {
			if( Array.prototype.indexOf ) {
				return arr.indexOf( element );

			} else {
				for( var i = 0, len = arr.length; i < len; i++ ) {
					if( arr[ i ] === element ) return i;
				}
				return -1;
			}
		},



		/**
		 * Performs the functionality of what modern browsers do when `String.prototype.split()` is called
		 * with a regular expression that contains capturing parenthesis.
		 *
		 * For example:
		 *
		 *     // Modern browsers:
		 *     "a,b,c".split( /(,)/ );  // --> [ 'a', ',', 'b', ',', 'c' ]
		 *
		 *     // Old IE (including IE8):
		 *     "a,b,c".split( /(,)/ );  // --> [ 'a', 'b', 'c' ]
		 *
		 * This method emulates the functionality of modern browsers for the old IE case.
		 *
		 * @param {String} str The string to split.
		 * @param {RegExp} splitRegex The regular expression to split the input `str` on. The splitting
		 *   character(s) will be spliced into the array, as in the "modern browsers" example in the
		 *   description of this method.
		 *   Note #1: the supplied regular expression **must** have the 'g' flag specified.
		 *   Note #2: for simplicity's sake, the regular expression does not need
		 *   to contain capturing parenthesis - it will be assumed that any match has them.
		 * @return {String[]} The split array of strings, with the splitting character(s) included.
		 */
		splitAndCapture : function( str, splitRegex ) {
			if( !splitRegex.global ) throw new Error( "`splitRegex` must have the 'g' flag set" );

			var result = [],
			    lastIdx = 0,
			    match;

			while( match = splitRegex.exec( str ) ) {
				result.push( str.substring( lastIdx, match.index ) );
				result.push( match[ 0 ] );  // push the splitting char(s)

				lastIdx = match.index + match[ 0 ].length;
			}
			result.push( str.substring( lastIdx ) );

			return result;
		},


		/**
		 * Trims the leading and trailing whitespace from a string.
		 *
		 * @param {String} str The string to trim.
		 * @return {String}
		 */
		trim : function( str ) {
			return str.replace( this.trimRegex, '' );
		}

	};
	/*global Autolinker */
	/*jshint boss:true */
	/**
	 * @class Autolinker.HtmlTag
	 * @extends Object
	 *
	 * Represents an HTML tag, which can be used to easily build/modify HTML tags programmatically.
	 *
	 * Autolinker uses this abstraction to create HTML tags, and then write them out as strings. You may also use
	 * this class in your code, especially within a {@link Autolinker#replaceFn replaceFn}.
	 *
	 * ## Examples
	 *
	 * Example instantiation:
	 *
	 *     var tag = new Autolinker.HtmlTag( {
	 *         tagName : 'a',
	 *         attrs   : { 'href': 'http://google.com', 'class': 'external-link' },
	 *         innerHtml : 'Google'
	 *     } );
	 *
	 *     tag.toAnchorString();  // <a href="http://google.com" class="external-link">Google</a>
	 *
	 *     // Individual accessor methods
	 *     tag.getTagName();                 // 'a'
	 *     tag.getAttr( 'href' );            // 'http://google.com'
	 *     tag.hasClass( 'external-link' );  // true
	 *
	 *
	 * Using mutator methods (which may be used in combination with instantiation config properties):
	 *
	 *     var tag = new Autolinker.HtmlTag();
	 *     tag.setTagName( 'a' );
	 *     tag.setAttr( 'href', 'http://google.com' );
	 *     tag.addClass( 'external-link' );
	 *     tag.setInnerHtml( 'Google' );
	 *
	 *     tag.getTagName();                 // 'a'
	 *     tag.getAttr( 'href' );            // 'http://google.com'
	 *     tag.hasClass( 'external-link' );  // true
	 *
	 *     tag.toAnchorString();  // <a href="http://google.com" class="external-link">Google</a>
	 *
	 *
	 * ## Example use within a {@link Autolinker#replaceFn replaceFn}
	 *
	 *     var html = Autolinker.link( "Test google.com", {
	 *         replaceFn : function( autolinker, match ) {
	 *             var tag = autolinker.getTagBuilder().build( match );  // returns an {@link Autolinker.HtmlTag} instance, configured with the Match's href and anchor text
	 *             tag.setAttr( 'rel', 'nofollow' );
	 *
	 *             return tag;
	 *         }
	 *     } );
	 *
	 *     // generated html:
	 *     //   Test <a href="http://google.com" target="_blank" rel="nofollow">google.com</a>
	 *
	 *
	 * ## Example use with a new tag for the replacement
	 *
	 *     var html = Autolinker.link( "Test google.com", {
	 *         replaceFn : function( autolinker, match ) {
	 *             var tag = new Autolinker.HtmlTag( {
	 *                 tagName : 'button',
	 *                 attrs   : { 'title': 'Load URL: ' + match.getAnchorHref() },
	 *                 innerHtml : 'Load URL: ' + match.getAnchorText()
	 *             } );
	 *
	 *             return tag;
	 *         }
	 *     } );
	 *
	 *     // generated html:
	 *     //   Test <button title="Load URL: http://google.com">Load URL: google.com</button>
	 */
	Autolinker.HtmlTag = Autolinker.Util.extend( Object, {

		/**
		 * @cfg {String} tagName
		 *
		 * The tag name. Ex: 'a', 'button', etc.
		 *
		 * Not required at instantiation time, but should be set using {@link #setTagName} before {@link #toAnchorString}
		 * is executed.
		 */

		/**
		 * @cfg {Object.<String, String>} attrs
		 *
		 * An key/value Object (map) of attributes to create the tag with. The keys are the attribute names, and the
		 * values are the attribute values.
		 */

		/**
		 * @cfg {String} innerHtml
		 *
		 * The inner HTML for the tag.
		 *
		 * Note the camel case name on `innerHtml`. Acronyms are camelCased in this utility (such as not to run into the acronym
		 * naming inconsistency that the DOM developers created with `XMLHttpRequest`). You may alternatively use {@link #innerHTML}
		 * if you prefer, but this one is recommended.
		 */

		/**
		 * @cfg {String} innerHTML
		 *
		 * Alias of {@link #innerHtml}, accepted for consistency with the browser DOM api, but prefer the camelCased version
		 * for acronym names.
		 */


		/**
		 * @protected
		 * @property {RegExp} whitespaceRegex
		 *
		 * Regular expression used to match whitespace in a string of CSS classes.
		 */
		whitespaceRegex : /\s+/,


		/**
		 * @constructor
		 * @param {Object} [cfg] The configuration properties for this class, in an Object (map)
		 */
		constructor : function( cfg ) {
			Autolinker.Util.assign( this, cfg );

			this.innerHtml = this.innerHtml || this.innerHTML;  // accept either the camelCased form or the fully capitalized acronym
		},


		/**
		 * Sets the tag name that will be used to generate the tag with.
		 *
		 * @param {String} tagName
		 * @return {Autolinker.HtmlTag} This HtmlTag instance, so that method calls may be chained.
		 */
		setTagName : function( tagName ) {
			this.tagName = tagName;
			return this;
		},


		/**
		 * Retrieves the tag name.
		 *
		 * @return {String}
		 */
		getTagName : function() {
			return this.tagName || "";
		},


		/**
		 * Sets an attribute on the HtmlTag.
		 *
		 * @param {String} attrName The attribute name to set.
		 * @param {String} attrValue The attribute value to set.
		 * @return {Autolinker.HtmlTag} This HtmlTag instance, so that method calls may be chained.
		 */
		setAttr : function( attrName, attrValue ) {
			var tagAttrs = this.getAttrs();
			tagAttrs[ attrName ] = attrValue;

			return this;
		},


		/**
		 * Retrieves an attribute from the HtmlTag. If the attribute does not exist, returns `undefined`.
		 *
		 * @param {String} name The attribute name to retrieve.
		 * @return {String} The attribute's value, or `undefined` if it does not exist on the HtmlTag.
		 */
		getAttr : function( attrName ) {
			return this.getAttrs()[ attrName ];
		},


		/**
		 * Sets one or more attributes on the HtmlTag.
		 *
		 * @param {Object.<String, String>} attrs A key/value Object (map) of the attributes to set.
		 * @return {Autolinker.HtmlTag} This HtmlTag instance, so that method calls may be chained.
		 */
		setAttrs : function( attrs ) {
			var tagAttrs = this.getAttrs();
			Autolinker.Util.assign( tagAttrs, attrs );

			return this;
		},


		/**
		 * Retrieves the attributes Object (map) for the HtmlTag.
		 *
		 * @return {Object.<String, String>} A key/value object of the attributes for the HtmlTag.
		 */
		getAttrs : function() {
			return this.attrs || ( this.attrs = {} );
		},


		/**
		 * Sets the provided `cssClass`, overwriting any current CSS classes on the HtmlTag.
		 *
		 * @param {String} cssClass One or more space-separated CSS classes to set (overwrite).
		 * @return {Autolinker.HtmlTag} This HtmlTag instance, so that method calls may be chained.
		 */
		setClass : function( cssClass ) {
			return this.setAttr( 'class', cssClass );
		},


		/**
		 * Convenience method to add one or more CSS classes to the HtmlTag. Will not add duplicate CSS classes.
		 *
		 * @param {String} cssClass One or more space-separated CSS classes to add.
		 * @return {Autolinker.HtmlTag} This HtmlTag instance, so that method calls may be chained.
		 */
		addClass : function( cssClass ) {
			var classAttr = this.getClass(),
			    whitespaceRegex = this.whitespaceRegex,
			    indexOf = Autolinker.Util.indexOf,  // to support IE8 and below
			    classes = ( !classAttr ) ? [] : classAttr.split( whitespaceRegex ),
			    newClasses = cssClass.split( whitespaceRegex ),
			    newClass;

			while( newClass = newClasses.shift() ) {
				if( indexOf( classes, newClass ) === -1 ) {
					classes.push( newClass );
				}
			}

			this.getAttrs()[ 'class' ] = classes.join( " " );
			return this;
		},


		/**
		 * Convenience method to remove one or more CSS classes from the HtmlTag.
		 *
		 * @param {String} cssClass One or more space-separated CSS classes to remove.
		 * @return {Autolinker.HtmlTag} This HtmlTag instance, so that method calls may be chained.
		 */
		removeClass : function( cssClass ) {
			var classAttr = this.getClass(),
			    whitespaceRegex = this.whitespaceRegex,
			    indexOf = Autolinker.Util.indexOf,  // to support IE8 and below
			    classes = ( !classAttr ) ? [] : classAttr.split( whitespaceRegex ),
			    removeClasses = cssClass.split( whitespaceRegex ),
			    removeClass;

			while( classes.length && ( removeClass = removeClasses.shift() ) ) {
				var idx = indexOf( classes, removeClass );
				if( idx !== -1 ) {
					classes.splice( idx, 1 );
				}
			}

			this.getAttrs()[ 'class' ] = classes.join( " " );
			return this;
		},


		/**
		 * Convenience method to retrieve the CSS class(es) for the HtmlTag, which will each be separated by spaces when
		 * there are multiple.
		 *
		 * @return {String}
		 */
		getClass : function() {
			return this.getAttrs()[ 'class' ] || "";
		},


		/**
		 * Convenience method to check if the tag has a CSS class or not.
		 *
		 * @param {String} cssClass The CSS class to check for.
		 * @return {Boolean} `true` if the HtmlTag has the CSS class, `false` otherwise.
		 */
		hasClass : function( cssClass ) {
			return ( ' ' + this.getClass() + ' ' ).indexOf( ' ' + cssClass + ' ' ) !== -1;
		},


		/**
		 * Sets the inner HTML for the tag.
		 *
		 * @param {String} html The inner HTML to set.
		 * @return {Autolinker.HtmlTag} This HtmlTag instance, so that method calls may be chained.
		 */
		setInnerHtml : function( html ) {
			this.innerHtml = html;

			return this;
		},


		/**
		 * Retrieves the inner HTML for the tag.
		 *
		 * @return {String}
		 */
		getInnerHtml : function() {
			return this.innerHtml || "";
		},


		/**
		 * Override of superclass method used to generate the HTML string for the tag.
		 *
		 * @return {String}
		 */
		toAnchorString : function() {
			var tagName = this.getTagName(),
			    attrsStr = this.buildAttrsStr();

			attrsStr = ( attrsStr ) ? ' ' + attrsStr : '';  // prepend a space if there are actually attributes

			return [ '<', tagName, attrsStr, '>', this.getInnerHtml(), '</', tagName, '>' ].join( "" );
		},


		/**
		 * Support method for {@link #toAnchorString}, returns the string space-separated key="value" pairs, used to populate
		 * the stringified HtmlTag.
		 *
		 * @protected
		 * @return {String} Example return: `attr1="value1" attr2="value2"`
		 */
		buildAttrsStr : function() {
			if( !this.attrs ) return "";  // no `attrs` Object (map) has been set, return empty string

			var attrs = this.getAttrs(),
			    attrsArr = [];

			for( var prop in attrs ) {
				if( attrs.hasOwnProperty( prop ) ) {
					attrsArr.push( prop + '="' + attrs[ prop ] + '"' );
				}
			}
			return attrsArr.join( " " );
		}

	} );

	/*global Autolinker */
	/*jshint sub:true */
	/**
	 * @protected
	 * @class Autolinker.AnchorTagBuilder
	 * @extends Object
	 *
	 * Builds anchor (&lt;a&gt;) tags for the Autolinker utility when a match is found.
	 *
	 * Normally this class is instantiated, configured, and used internally by an {@link Autolinker} instance, but may
	 * actually be retrieved in a {@link Autolinker#replaceFn replaceFn} to create {@link Autolinker.HtmlTag HtmlTag} instances
	 * which may be modified before returning from the {@link Autolinker#replaceFn replaceFn}. For example:
	 *
	 *     var html = Autolinker.link( "Test google.com", {
	 *         replaceFn : function( autolinker, match ) {
	 *             var tag = autolinker.getTagBuilder().build( match );  // returns an {@link Autolinker.HtmlTag} instance
	 *             tag.setAttr( 'rel', 'nofollow' );
	 *
	 *             return tag;
	 *         }
	 *     } );
	 *
	 *     // generated html:
	 *     //   Test <a href="http://google.com" target="_blank" rel="nofollow">google.com</a>
	 */
	Autolinker.AnchorTagBuilder = Autolinker.Util.extend( Object, {

		/**
		 * @cfg {Boolean} newWindow
		 * @inheritdoc Autolinker#newWindow
		 */

		/**
		 * @cfg {Number} truncate
		 * @inheritdoc Autolinker#truncate
		 */

		/**
		 * @cfg {String} className
		 * @inheritdoc Autolinker#className
		 */


		/**
		 * @constructor
		 * @param {Object} [cfg] The configuration options for the AnchorTagBuilder instance, specified in an Object (map).
		 */
		constructor : function( cfg ) {
			Autolinker.Util.assign( this, cfg );
		},


		/**
		 * Generates the actual anchor (&lt;a&gt;) tag to use in place of the
		 * matched text, via its `match` object.
		 *
		 * @param {Autolinker.match.Match} match The Match instance to generate an
		 *   anchor tag from.
		 * @return {Autolinker.HtmlTag} The HtmlTag instance for the anchor tag.
		 */
		build : function( match ) {
			var tag = new Autolinker.HtmlTag( {
				tagName   : 'a',
				attrs     : this.createAttrs( match.getType(), match.getAnchorHref() ),
				innerHtml : this.processAnchorText( match.getAnchorText() )
			} );

			return tag;
		},


		/**
		 * Creates the Object (map) of the HTML attributes for the anchor (&lt;a&gt;)
		 *   tag being generated.
		 *
		 * @protected
		 * @param {"url"/"email"/"phone"/"twitter"/"hashtag"} matchType The type of
		 *   match that an anchor tag is being generated for.
		 * @param {String} href The href for the anchor tag.
		 * @return {Object} A key/value Object (map) of the anchor tag's attributes.
		 */
		createAttrs : function( matchType, anchorHref ) {
			var attrs = {
				'href' : anchorHref  // we'll always have the `href` attribute
			};

			var cssClass = this.createCssClass( matchType );
			if( cssClass ) {
				attrs[ 'class' ] = cssClass;
			}
			if( this.newWindow ) {
				attrs[ 'target' ] = "_blank";
			}

			return attrs;
		},


		/**
		 * Creates the CSS class that will be used for a given anchor tag, based on
		 * the `matchType` and the {@link #className} config.
		 *
		 * @private
		 * @param {"url"/"email"/"phone"/"twitter"/"hashtag"} matchType The type of
		 *   match that an anchor tag is being generated for.
		 * @return {String} The CSS class string for the link. Example return:
		 *   "myLink myLink-url". If no {@link #className} was configured, returns
		 *   an empty string.
		 */
		createCssClass : function( matchType ) {
			var className = this.className;

			if( !className )
				return "";
			else
				return className + " " + className + "-" + matchType;  // ex: "myLink myLink-url", "myLink myLink-email", "myLink myLink-phone", "myLink myLink-twitter", or "myLink myLink-hashtag"
		},


		/**
		 * Processes the `anchorText` by truncating the text according to the
		 * {@link #truncate} config.
		 *
		 * @private
		 * @param {String} anchorText The anchor tag's text (i.e. what will be
		 *   displayed).
		 * @return {String} The processed `anchorText`.
		 */
		processAnchorText : function( anchorText ) {
			anchorText = this.doTruncate( anchorText );

			return anchorText;
		},


		/**
		 * Performs the truncation of the `anchorText`, if the `anchorText` is
		 * longer than the {@link #truncate} option. Truncates the text to 2
		 * characters fewer than the {@link #truncate} option, and adds ".." to the
		 * end.
		 *
		 * @private
		 * @param {String} text The anchor tag's text (i.e. what will be displayed).
		 * @return {String} The truncated anchor text.
		 */
		doTruncate : function( anchorText ) {
			return Autolinker.Util.ellipsis( anchorText, this.truncate || Number.POSITIVE_INFINITY );
		}

	} );
	/*global Autolinker */
	/**
	 * @private
	 * @class Autolinker.htmlParser.HtmlParser
	 * @extends Object
	 *
	 * An HTML parser implementation which simply walks an HTML string and returns an array of
	 * {@link Autolinker.htmlParser.HtmlNode HtmlNodes} that represent the basic HTML structure of the input string.
	 *
	 * Autolinker uses this to only link URLs/emails/Twitter handles within text nodes, effectively ignoring / "walking
	 * around" HTML tags.
	 */
	Autolinker.htmlParser.HtmlParser = Autolinker.Util.extend( Object, {

		/**
		 * @private
		 * @property {RegExp} htmlRegex
		 *
		 * The regular expression used to pull out HTML tags from a string. Handles namespaced HTML tags and
		 * attribute names, as specified by http://www.w3.org/TR/html-markup/syntax.html.
		 *
		 * Capturing groups:
		 *
		 * 1. The "!DOCTYPE" tag name, if a tag is a &lt;!DOCTYPE&gt; tag.
		 * 2. If it is an end tag, this group will have the '/'.
		 * 3. If it is a comment tag, this group will hold the comment text (i.e.
		 *    the text inside the `&lt;!--` and `--&gt;`.
		 * 4. The tag name for all tags (other than the &lt;!DOCTYPE&gt; tag)
		 */
		htmlRegex : (function() {
			var commentTagRegex = /!--([\s\S]+?)--/,
			    tagNameRegex = /[0-9a-zA-Z][0-9a-zA-Z:]*/,
			    attrNameRegex = /[^\s\0"'>\/=\x01-\x1F\x7F]+/,   // the unicode range accounts for excluding control chars, and the delete char
			    attrValueRegex = /(?:"[^"]*?"|'[^']*?'|[^'"=<>`\s]+)/, // double quoted, single quoted, or unquoted attribute values
			    nameEqualsValueRegex = attrNameRegex.source + '(?:\\s*=\\s*' + attrValueRegex.source + ')?';  // optional '=[value]'

			return new RegExp( [
				// for <!DOCTYPE> tag. Ex: <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">)
				'(?:',
					'<(!DOCTYPE)',  // *** Capturing Group 1 - If it's a doctype tag

						// Zero or more attributes following the tag name
						'(?:',
							'\\s+',  // one or more whitespace chars before an attribute

							// Either:
							// A. attr="value", or
							// B. "value" alone (To cover example doctype tag: <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">)
							'(?:', nameEqualsValueRegex, '|', attrValueRegex.source + ')',
						')*',
					'>',
				')',

				'|',

				// All other HTML tags (i.e. tags that are not <!DOCTYPE>)
				'(?:',
					'<(/)?',  // Beginning of a tag or comment. Either '<' for a start tag, or '</' for an end tag.
					          // *** Capturing Group 2: The slash or an empty string. Slash ('/') for end tag, empty string for start or self-closing tag.

						'(?:',
							commentTagRegex.source,  // *** Capturing Group 3 - A Comment Tag's Text

							'|',

							'(?:',

								// *** Capturing Group 4 - The tag name
								'(' + tagNameRegex.source + ')',

								// Zero or more attributes following the tag name
								'(?:',
									'\\s+',                // one or more whitespace chars before an attribute
									nameEqualsValueRegex,  // attr="value" (with optional ="value" part)
								')*',

								'\\s*/?',  // any trailing spaces and optional '/' before the closing '>'

							')',
						')',
					'>',
				')'
			].join( "" ), 'gi' );
		} )(),

		/**
		 * @private
		 * @property {RegExp} htmlCharacterEntitiesRegex
		 *
		 * The regular expression that matches common HTML character entities.
		 *
		 * Ignoring &amp; as it could be part of a query string -- handling it separately.
		 */
		htmlCharacterEntitiesRegex: /(&nbsp;|&#160;|&lt;|&#60;|&gt;|&#62;|&quot;|&#34;|&#39;)/gi,


		/**
		 * Parses an HTML string and returns a simple array of {@link Autolinker.htmlParser.HtmlNode HtmlNodes}
		 * to represent the HTML structure of the input string.
		 *
		 * @param {String} html The HTML to parse.
		 * @return {Autolinker.htmlParser.HtmlNode[]}
		 */
		parse : function( html ) {
			var htmlRegex = this.htmlRegex,
			    currentResult,
			    lastIndex = 0,
			    textAndEntityNodes,
			    nodes = [];  // will be the result of the method

			while( ( currentResult = htmlRegex.exec( html ) ) !== null ) {
				var tagText = currentResult[ 0 ],
				    commentText = currentResult[ 3 ], // if we've matched a comment
				    tagName = currentResult[ 1 ] || currentResult[ 4 ],  // The <!DOCTYPE> tag (ex: "!DOCTYPE"), or another tag (ex: "a" or "img")
				    isClosingTag = !!currentResult[ 2 ],
				    inBetweenTagsText = html.substring( lastIndex, currentResult.index );

				// Push TextNodes and EntityNodes for any text found between tags
				if( inBetweenTagsText ) {
					textAndEntityNodes = this.parseTextAndEntityNodes( inBetweenTagsText );
					nodes.push.apply( nodes, textAndEntityNodes );
				}

				// Push the CommentNode or ElementNode
				if( commentText ) {
					nodes.push( this.createCommentNode( tagText, commentText ) );
				} else {
					nodes.push( this.createElementNode( tagText, tagName, isClosingTag ) );
				}

				lastIndex = currentResult.index + tagText.length;
			}

			// Process any remaining text after the last HTML element. Will process all of the text if there were no HTML elements.
			if( lastIndex < html.length ) {
				var text = html.substring( lastIndex );

				// Push TextNodes and EntityNodes for any text found between tags
				if( text ) {
					textAndEntityNodes = this.parseTextAndEntityNodes( text );
					nodes.push.apply( nodes, textAndEntityNodes );
				}
			}

			return nodes;
		},


		/**
		 * Parses text and HTML entity nodes from a given string. The input string
		 * should not have any HTML tags (elements) within it.
		 *
		 * @private
		 * @param {String} text The text to parse.
		 * @return {Autolinker.htmlParser.HtmlNode[]} An array of HtmlNodes to
		 *   represent the {@link Autolinker.htmlParser.TextNode TextNodes} and
		 *   {@link Autolinker.htmlParser.EntityNode EntityNodes} found.
		 */
		parseTextAndEntityNodes : function( text ) {
			var nodes = [],
			    textAndEntityTokens = Autolinker.Util.splitAndCapture( text, this.htmlCharacterEntitiesRegex );  // split at HTML entities, but include the HTML entities in the results array

			// Every even numbered token is a TextNode, and every odd numbered token is an EntityNode
			// For example: an input `text` of "Test &quot;this&quot; today" would turn into the
			//   `textAndEntityTokens`: [ 'Test ', '&quot;', 'this', '&quot;', ' today' ]
			for( var i = 0, len = textAndEntityTokens.length; i < len; i += 2 ) {
				var textToken = textAndEntityTokens[ i ],
				    entityToken = textAndEntityTokens[ i + 1 ];

				if( textToken ) nodes.push( this.createTextNode( textToken ) );
				if( entityToken ) nodes.push( this.createEntityNode( entityToken ) );
			}
			return nodes;
		},


		/**
		 * Factory method to create an {@link Autolinker.htmlParser.CommentNode CommentNode}.
		 *
		 * @private
		 * @param {String} tagText The full text of the tag (comment) that was
		 *   matched, including its &lt;!-- and --&gt;.
		 * @param {String} comment The full text of the comment that was matched.
		 */
		createCommentNode : function( tagText, commentText ) {
			return new Autolinker.htmlParser.CommentNode( {
				text: tagText,
				comment: Autolinker.Util.trim( commentText )
			} );
		},


		/**
		 * Factory method to create an {@link Autolinker.htmlParser.ElementNode ElementNode}.
		 *
		 * @private
		 * @param {String} tagText The full text of the tag (element) that was
		 *   matched, including its attributes.
		 * @param {String} tagName The name of the tag. Ex: An &lt;img&gt; tag would
		 *   be passed to this method as "img".
		 * @param {Boolean} isClosingTag `true` if it's a closing tag, false
		 *   otherwise.
		 * @return {Autolinker.htmlParser.ElementNode}
		 */
		createElementNode : function( tagText, tagName, isClosingTag ) {
			return new Autolinker.htmlParser.ElementNode( {
				text    : tagText,
				tagName : tagName.toLowerCase(),
				closing : isClosingTag
			} );
		},


		/**
		 * Factory method to create a {@link Autolinker.htmlParser.EntityNode EntityNode}.
		 *
		 * @private
		 * @param {String} text The text that was matched for the HTML entity (such
		 *   as '&amp;nbsp;').
		 * @return {Autolinker.htmlParser.EntityNode}
		 */
		createEntityNode : function( text ) {
			return new Autolinker.htmlParser.EntityNode( { text: text } );
		},


		/**
		 * Factory method to create a {@link Autolinker.htmlParser.TextNode TextNode}.
		 *
		 * @private
		 * @param {String} text The text that was matched.
		 * @return {Autolinker.htmlParser.TextNode}
		 */
		createTextNode : function( text ) {
			return new Autolinker.htmlParser.TextNode( { text: text } );
		}

	} );
	/*global Autolinker */
	/**
	 * @abstract
	 * @class Autolinker.htmlParser.HtmlNode
	 *
	 * Represents an HTML node found in an input string. An HTML node is one of the
	 * following:
	 *
	 * 1. An {@link Autolinker.htmlParser.ElementNode ElementNode}, which represents
	 *    HTML tags.
	 * 2. A {@link Autolinker.htmlParser.CommentNode CommentNode}, which represents
	 *    HTML comments.
	 * 3. A {@link Autolinker.htmlParser.TextNode TextNode}, which represents text
	 *    outside or within HTML tags.
	 * 4. A {@link Autolinker.htmlParser.EntityNode EntityNode}, which represents
	 *    one of the known HTML entities that Autolinker looks for. This includes
	 *    common ones such as &amp;quot; and &amp;nbsp;
	 */
	Autolinker.htmlParser.HtmlNode = Autolinker.Util.extend( Object, {

		/**
		 * @cfg {String} text (required)
		 *
		 * The original text that was matched for the HtmlNode.
		 *
		 * - In the case of an {@link Autolinker.htmlParser.ElementNode ElementNode},
		 *   this will be the tag's text.
		 * - In the case of an {@link Autolinker.htmlParser.CommentNode CommentNode},
		 *   this will be the comment's text.
		 * - In the case of a {@link Autolinker.htmlParser.TextNode TextNode}, this
		 *   will be the text itself.
		 * - In the case of a {@link Autolinker.htmlParser.EntityNode EntityNode},
		 *   this will be the text of the HTML entity.
		 */
		text : "",


		/**
		 * @constructor
		 * @param {Object} cfg The configuration properties for the Match instance,
		 * specified in an Object (map).
		 */
		constructor : function( cfg ) {
			Autolinker.Util.assign( this, cfg );
		},


		/**
		 * Returns a string name for the type of node that this class represents.
		 *
		 * @abstract
		 * @return {String}
		 */
		getType : Autolinker.Util.abstractMethod,


		/**
		 * Retrieves the {@link #text} for the HtmlNode.
		 *
		 * @return {String}
		 */
		getText : function() {
			return this.text;
		}

	} );
	/*global Autolinker */
	/**
	 * @class Autolinker.htmlParser.CommentNode
	 * @extends Autolinker.htmlParser.HtmlNode
	 *
	 * Represents an HTML comment node that has been parsed by the
	 * {@link Autolinker.htmlParser.HtmlParser}.
	 *
	 * See this class's superclass ({@link Autolinker.htmlParser.HtmlNode}) for more
	 * details.
	 */
	Autolinker.htmlParser.CommentNode = Autolinker.Util.extend( Autolinker.htmlParser.HtmlNode, {

		/**
		 * @cfg {String} comment (required)
		 *
		 * The text inside the comment tag. This text is stripped of any leading or
		 * trailing whitespace.
		 */
		comment : '',


		/**
		 * Returns a string name for the type of node that this class represents.
		 *
		 * @return {String}
		 */
		getType : function() {
			return 'comment';
		},


		/**
		 * Returns the comment inside the comment tag.
		 *
		 * @return {String}
		 */
		getComment : function() {
			return this.comment;
		}

	} );
	/*global Autolinker */
	/**
	 * @class Autolinker.htmlParser.ElementNode
	 * @extends Autolinker.htmlParser.HtmlNode
	 *
	 * Represents an HTML element node that has been parsed by the {@link Autolinker.htmlParser.HtmlParser}.
	 *
	 * See this class's superclass ({@link Autolinker.htmlParser.HtmlNode}) for more
	 * details.
	 */
	Autolinker.htmlParser.ElementNode = Autolinker.Util.extend( Autolinker.htmlParser.HtmlNode, {

		/**
		 * @cfg {String} tagName (required)
		 *
		 * The name of the tag that was matched.
		 */
		tagName : '',

		/**
		 * @cfg {Boolean} closing (required)
		 *
		 * `true` if the element (tag) is a closing tag, `false` if its an opening
		 * tag.
		 */
		closing : false,


		/**
		 * Returns a string name for the type of node that this class represents.
		 *
		 * @return {String}
		 */
		getType : function() {
			return 'element';
		},


		/**
		 * Returns the HTML element's (tag's) name. Ex: for an &lt;img&gt; tag,
		 * returns "img".
		 *
		 * @return {String}
		 */
		getTagName : function() {
			return this.tagName;
		},


		/**
		 * Determines if the HTML element (tag) is a closing tag. Ex: &lt;div&gt;
		 * returns `false`, while &lt;/div&gt; returns `true`.
		 *
		 * @return {Boolean}
		 */
		isClosing : function() {
			return this.closing;
		}

	} );
	/*global Autolinker */
	/**
	 * @class Autolinker.htmlParser.EntityNode
	 * @extends Autolinker.htmlParser.HtmlNode
	 *
	 * Represents a known HTML entity node that has been parsed by the {@link Autolinker.htmlParser.HtmlParser}.
	 * Ex: '&amp;nbsp;', or '&amp#160;' (which will be retrievable from the {@link #getText}
	 * method.
	 *
	 * Note that this class will only be returned from the HtmlParser for the set of
	 * checked HTML entity nodes  defined by the {@link Autolinker.htmlParser.HtmlParser#htmlCharacterEntitiesRegex}.
	 *
	 * See this class's superclass ({@link Autolinker.htmlParser.HtmlNode}) for more
	 * details.
	 */
	Autolinker.htmlParser.EntityNode = Autolinker.Util.extend( Autolinker.htmlParser.HtmlNode, {

		/**
		 * Returns a string name for the type of node that this class represents.
		 *
		 * @return {String}
		 */
		getType : function() {
			return 'entity';
		}

	} );
	/*global Autolinker */
	/**
	 * @class Autolinker.htmlParser.TextNode
	 * @extends Autolinker.htmlParser.HtmlNode
	 *
	 * Represents a text node that has been parsed by the {@link Autolinker.htmlParser.HtmlParser}.
	 *
	 * See this class's superclass ({@link Autolinker.htmlParser.HtmlNode}) for more
	 * details.
	 */
	Autolinker.htmlParser.TextNode = Autolinker.Util.extend( Autolinker.htmlParser.HtmlNode, {

		/**
		 * Returns a string name for the type of node that this class represents.
		 *
		 * @return {String}
		 */
		getType : function() {
			return 'text';
		}

	} );
	/*global Autolinker */
	/**
	 * @private
	 * @class Autolinker.matchParser.MatchParser
	 * @extends Object
	 *
	 * Used by Autolinker to parse potential matches, given an input string of text.
	 *
	 * The MatchParser is fed a non-HTML string in order to search for matches.
	 * Autolinker first uses the {@link Autolinker.htmlParser.HtmlParser} to "walk
	 * around" HTML tags, and then the text around the HTML tags is passed into the
	 * MatchParser in order to find the actual matches.
	 */
	Autolinker.matchParser.MatchParser = Autolinker.Util.extend( Object, {

		/**
		 * @cfg {Boolean} urls
		 * @inheritdoc Autolinker#urls
		 */
		urls : true,

		/**
		 * @cfg {Boolean} email
		 * @inheritdoc Autolinker#email
		 */
		email : true,

		/**
		 * @cfg {Boolean} twitter
		 * @inheritdoc Autolinker#twitter
		 */
		twitter : true,

		/**
		 * @cfg {Boolean} phone
		 * @inheritdoc Autolinker#phone
		 */
		phone: true,

		/**
		 * @cfg {Boolean/String} hashtag
		 * @inheritdoc Autolinker#hashtag
		 */
		hashtag : false,

		/**
		 * @cfg {Boolean} stripPrefix
		 * @inheritdoc Autolinker#stripPrefix
		 */
		stripPrefix : true,


		/**
		 * @private
		 * @property {RegExp} matcherRegex
		 *
		 * The regular expression that matches URLs, email addresses, phone #s,
		 * Twitter handles, and Hashtags.
		 *
		 * This regular expression has the following capturing groups:
		 *
		 * 1.  Group that is used to determine if there is a Twitter handle match
		 *     (i.e. \@someTwitterUser). Simply check for its existence to determine
		 *     if there is a Twitter handle match. The next couple of capturing
		 *     groups give information about the Twitter handle match.
		 * 2.  The whitespace character before the \@sign in a Twitter handle. This
		 *     is needed because there are no lookbehinds in JS regular expressions,
		 *     and can be used to reconstruct the original string in a replace().
		 * 3.  The Twitter handle itself in a Twitter match. If the match is
		 *     '@someTwitterUser', the handle is 'someTwitterUser'.
		 * 4.  Group that matches an email address. Used to determine if the match
		 *     is an email address, as well as holding the full address. Ex:
		 *     'me@my.com'
		 * 5.  Group that matches a URL in the input text. Ex: 'http://google.com',
		 *     'www.google.com', or just 'google.com'. This also includes a path,
		 *     url parameters, or hash anchors. Ex: google.com/path/to/file?q1=1&q2=2#myAnchor
		 * 6.  Group that matches a protocol URL (i.e. 'http://google.com'). This is
		 *     used to match protocol URLs with just a single word, like 'http://localhost',
		 *     where we won't double check that the domain name has at least one '.'
		 *     in it.
		 * 7.  A protocol-relative ('//') match for the case of a 'www.' prefixed
		 *     URL. Will be an empty string if it is not a protocol-relative match.
		 *     We need to know the character before the '//' in order to determine
		 *     if it is a valid match or the // was in a string we don't want to
		 *     auto-link.
		 * 8.  A protocol-relative ('//') match for the case of a known TLD prefixed
		 *     URL. Will be an empty string if it is not a protocol-relative match.
		 *     See #6 for more info.
		 * 9.  Group that is used to determine if there is a phone number match. The
		 *     next 3 groups give segments of the phone number.
		 * 10. Group that is used to determine if there is a Hashtag match
		 *     (i.e. \#someHashtag). Simply check for its existence to determine if
		 *     there is a Hashtag match. The next couple of capturing groups give
		 *     information about the Hashtag match.
		 * 11. The whitespace character before the #sign in a Hashtag handle. This
		 *     is needed because there are no look-behinds in JS regular
		 *     expressions, and can be used to reconstruct the original string in a
		 *     replace().
		 * 12. The Hashtag itself in a Hashtag match. If the match is
		 *     '#someHashtag', the hashtag is 'someHashtag'.
		 */
		matcherRegex : (function() {
			var twitterRegex = /(^|[^\w])@(\w{1,15})/,              // For matching a twitter handle. Ex: @gregory_jacobs

			    hashtagRegex = /(^|[^\w])#(\w{1,139})/,              // For matching a Hashtag. Ex: #games

			    emailRegex = /(?:[\-;:&=\+\$,\w\.]+@)/,             // something@ for email addresses (a.k.a. local-part)
			    phoneRegex = /(?:\+?\d{1,3}[-\s.])?\(?\d{3}\)?[-\s.]?\d{3}[-\s.]\d{4}/,  // ex: (123) 456-7890, 123 456 7890, 123-456-7890, etc.
			    protocolRegex = /(?:[A-Za-z][-.+A-Za-z0-9]+:(?![A-Za-z][-.+A-Za-z0-9]+:\/\/)(?!\d+\/?)(?:\/\/)?)/,  // match protocol, allow in format "http://" or "mailto:". However, do not match the first part of something like 'link:http://www.google.com' (i.e. don't match "link:"). Also, make sure we don't interpret 'google.com:8000' as if 'google.com' was a protocol here (i.e. ignore a trailing port number in this regex)
			    wwwRegex = /(?:www\.)/,                             // starting with 'www.'
			    domainNameRegex = /[A-Za-z0-9\.\-]*[A-Za-z0-9\-]/,  // anything looking at all like a domain, non-unicode domains, not ending in a period
			    tldRegex = /\.(?:international|construction|contractors|enterprises|photography|productions|foundation|immobilien|industries|management|properties|technology|christmas|community|directory|education|equipment|institute|marketing|solutions|vacations|bargains|boutique|builders|catering|cleaning|clothing|computer|democrat|diamonds|graphics|holdings|lighting|partners|plumbing|supplies|training|ventures|academy|careers|company|cruises|domains|exposed|flights|florist|gallery|guitars|holiday|kitchen|neustar|okinawa|recipes|rentals|reviews|shiksha|singles|support|systems|agency|berlin|camera|center|coffee|condos|dating|estate|events|expert|futbol|kaufen|luxury|maison|monash|museum|nagoya|photos|repair|report|social|supply|tattoo|tienda|travel|viajes|villas|vision|voting|voyage|actor|build|cards|cheap|codes|dance|email|glass|house|mango|ninja|parts|photo|shoes|solar|today|tokyo|tools|watch|works|aero|arpa|asia|best|bike|blue|buzz|camp|club|cool|coop|farm|fish|gift|guru|info|jobs|kiwi|kred|land|limo|link|menu|mobi|moda|name|pics|pink|post|qpon|rich|ruhr|sexy|tips|vote|voto|wang|wien|wiki|zone|bar|bid|biz|cab|cat|ceo|com|edu|gov|int|kim|mil|net|onl|org|pro|pub|red|tel|uno|wed|xxx|xyz|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cu|cv|cw|cx|cy|cz|de|dj|dk|dm|do|dz|ec|ee|eg|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|sl|sm|sn|so|sr|st|su|sv|sx|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|za|zm|zw)\b/,   // match our known top level domains (TLDs)

			    // Allow optional path, query string, and hash anchor, not ending in the following characters: "?!:,.;"
			    // http://blog.codinghorror.com/the-problem-with-urls/
			    urlSuffixRegex = /[\-A-Za-z0-9+&@#\/%=~_()|'$*\[\]?!:,.;]*[\-A-Za-z0-9+&@#\/%=~_()|'$*\[\]]/;

			return new RegExp( [
				'(',  // *** Capturing group $1, which can be used to check for a twitter handle match. Use group $3 for the actual twitter handle though. $2 may be used to reconstruct the original string in a replace()
					// *** Capturing group $2, which matches the whitespace character before the '@' sign (needed because of no lookbehinds), and
					// *** Capturing group $3, which matches the actual twitter handle
					twitterRegex.source,
				')',

				'|',

				'(',  // *** Capturing group $4, which is used to determine an email match
					emailRegex.source,
					domainNameRegex.source,
					tldRegex.source,
				')',

				'|',

				'(',  // *** Capturing group $5, which is used to match a URL
					'(?:', // parens to cover match for protocol (optional), and domain
						'(',  // *** Capturing group $6, for a protocol-prefixed url (ex: http://google.com)
							protocolRegex.source,
							domainNameRegex.source,
						')',

						'|',

						'(?:',  // non-capturing paren for a 'www.' prefixed url (ex: www.google.com)
							'(.?//)?',  // *** Capturing group $7 for an optional protocol-relative URL. Must be at the beginning of the string or start with a non-word character
							wwwRegex.source,
							domainNameRegex.source,
						')',

						'|',

						'(?:',  // non-capturing paren for known a TLD url (ex: google.com)
							'(.?//)?',  // *** Capturing group $8 for an optional protocol-relative URL. Must be at the beginning of the string or start with a non-word character
							domainNameRegex.source,
							tldRegex.source,
						')',
					')',

					'(?:' + urlSuffixRegex.source + ')?',  // match for path, query string, and/or hash anchor - optional
				')',

				'|',

				// this setup does not scale well for open extension :( Need to rethink design of autolinker...
				// ***  Capturing group $9, which matches a (USA for now) phone number
				'(',
					phoneRegex.source,
				')',

				'|',

				'(',  // *** Capturing group $10, which can be used to check for a Hashtag match. Use group $12 for the actual Hashtag though. $11 may be used to reconstruct the original string in a replace()
					// *** Capturing group $11, which matches the whitespace character before the '#' sign (needed because of no lookbehinds), and
					// *** Capturing group $12, which matches the actual Hashtag
					hashtagRegex.source,
				')'
			].join( "" ), 'gi' );
		} )(),

		/**
		 * @private
		 * @property {RegExp} charBeforeProtocolRelMatchRegex
		 *
		 * The regular expression used to retrieve the character before a
		 * protocol-relative URL match.
		 *
		 * This is used in conjunction with the {@link #matcherRegex}, which needs
		 * to grab the character before a protocol-relative '//' due to the lack of
		 * a negative look-behind in JavaScript regular expressions. The character
		 * before the match is stripped from the URL.
		 */
		charBeforeProtocolRelMatchRegex : /^(.)?\/\//,

		/**
		 * @private
		 * @property {Autolinker.MatchValidator} matchValidator
		 *
		 * The MatchValidator object, used to filter out any false positives from
		 * the {@link #matcherRegex}. See {@link Autolinker.MatchValidator} for details.
		 */


		/**
		 * @constructor
		 * @param {Object} [cfg] The configuration options for the AnchorTagBuilder
		 * instance, specified in an Object (map).
		 */
		constructor : function( cfg ) {
			Autolinker.Util.assign( this, cfg );

			this.matchValidator = new Autolinker.MatchValidator();
		},


		/**
		 * Parses the input `text` to search for matches, and calls the `replaceFn`
		 * to allow replacements of the matches. Returns the `text` with matches
		 * replaced.
		 *
		 * @param {String} text The text to search and repace matches in.
		 * @param {Function} replaceFn The iterator function to handle the
		 *   replacements. The function takes a single argument, a {@link Autolinker.match.Match}
		 *   object, and should return the text that should make the replacement.
		 * @param {Object} [contextObj=window] The context object ("scope") to run
		 *   the `replaceFn` in.
		 * @return {String}
		 */
		replace : function( text, replaceFn, contextObj ) {
			var me = this;  // for closure

			return text.replace( this.matcherRegex, function( matchStr, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12 ) {
				var matchDescObj = me.processCandidateMatch( matchStr, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12 );  // "match description" object

				// Return out with no changes for match types that are disabled (url,
				// email, phone, etc.), or for matches that are invalid (false
				// positives from the matcherRegex, which can't use look-behinds
				// since they are unavailable in JS).
				if( !matchDescObj ) {
					return matchStr;

				} else {
					// Generate replacement text for the match from the `replaceFn`
					var replaceStr = replaceFn.call( contextObj, matchDescObj.match );
					return matchDescObj.prefixStr + replaceStr + matchDescObj.suffixStr;
				}
			} );
		},


		/**
		 * Processes a candidate match from the {@link #matcherRegex}.
		 *
		 * Not all matches found by the regex are actual URL/Email/Phone/Twitter/Hashtag
		 * matches, as determined by the {@link #matchValidator}. In this case, the
		 * method returns `null`. Otherwise, a valid Object with `prefixStr`,
		 * `match`, and `suffixStr` is returned.
		 *
		 * @private
		 * @param {String} matchStr The full match that was found by the
		 *   {@link #matcherRegex}.
		 * @param {String} twitterMatch The matched text of a Twitter handle, if the
		 *   match is a Twitter match.
		 * @param {String} twitterHandlePrefixWhitespaceChar The whitespace char
		 *   before the @ sign in a Twitter handle match. This is needed because of
		 *   no lookbehinds in JS regexes, and is need to re-include the character
		 *   for the anchor tag replacement.
		 * @param {String} twitterHandle The actual Twitter user (i.e the word after
		 *   the @ sign in a Twitter match).
		 * @param {String} emailAddressMatch The matched email address for an email
		 *   address match.
		 * @param {String} urlMatch The matched URL string for a URL match.
		 * @param {String} protocolUrlMatch The match URL string for a protocol
		 *   match. Ex: 'http://yahoo.com'. This is used to match something like
		 *   'http://localhost', where we won't double check that the domain name
		 *   has at least one '.' in it.
		 * @param {String} wwwProtocolRelativeMatch The '//' for a protocol-relative
		 *   match from a 'www' url, with the character that comes before the '//'.
		 * @param {String} tldProtocolRelativeMatch The '//' for a protocol-relative
		 *   match from a TLD (top level domain) match, with the character that
		 *   comes before the '//'.
		 * @param {String} phoneMatch The matched text of a phone number
		 * @param {String} hashtagMatch The matched text of a Twitter
		 *   Hashtag, if the match is a Hashtag match.
		 * @param {String} hashtagPrefixWhitespaceChar The whitespace char
		 *   before the # sign in a Hashtag match. This is needed because of no
		 *   lookbehinds in JS regexes, and is need to re-include the character for
		 *   the anchor tag replacement.
		 * @param {String} hashtag The actual Hashtag (i.e the word
		 *   after the # sign in a Hashtag match).
		 *
		 * @return {Object} A "match description object". This will be `null` if the
		 *   match was invalid, or if a match type is disabled. Otherwise, this will
		 *   be an Object (map) with the following properties:
		 * @return {String} return.prefixStr The char(s) that should be prepended to
		 *   the replacement string. These are char(s) that were needed to be
		 *   included from the regex match that were ignored by processing code, and
		 *   should be re-inserted into the replacement stream.
		 * @return {String} return.suffixStr The char(s) that should be appended to
		 *   the replacement string. These are char(s) that were needed to be
		 *   included from the regex match that were ignored by processing code, and
		 *   should be re-inserted into the replacement stream.
		 * @return {Autolinker.match.Match} return.match The Match object that
		 *   represents the match that was found.
		 */
		processCandidateMatch : function(
			matchStr, twitterMatch, twitterHandlePrefixWhitespaceChar, twitterHandle,
			emailAddressMatch, urlMatch, protocolUrlMatch, wwwProtocolRelativeMatch,
			tldProtocolRelativeMatch, phoneMatch, hashtagMatch,
			hashtagPrefixWhitespaceChar, hashtag
		) {
			// Note: The `matchStr` variable wil be fixed up to remove characters that are no longer needed (which will
			// be added to `prefixStr` and `suffixStr`).

			var protocolRelativeMatch = wwwProtocolRelativeMatch || tldProtocolRelativeMatch,
			    match,  // Will be an Autolinker.match.Match object

			    prefixStr = "",  // A string to use to prefix the anchor tag that is created. This is needed for the Twitter and Hashtag matches.
			    suffixStr = "";  // A string to suffix the anchor tag that is created. This is used if there is a trailing parenthesis that should not be auto-linked.

			// Return out with `null` for match types that are disabled (url, email,
			// twitter, hashtag), or for matches that are invalid (false positives
			// from the matcherRegex, which can't use look-behinds since they are
			// unavailable in JS).
			if(
				( urlMatch && !this.urls ) ||
				( emailAddressMatch && !this.email ) ||
				( phoneMatch && !this.phone ) ||
				( twitterMatch && !this.twitter ) ||
				( hashtagMatch && !this.hashtag ) ||
				!this.matchValidator.isValidMatch( urlMatch, protocolUrlMatch, protocolRelativeMatch )
			) {
				return null;
			}

			// Handle a closing parenthesis at the end of the match, and exclude it
			// if there is not a matching open parenthesis
			// in the match itself.
			if( this.matchHasUnbalancedClosingParen( matchStr ) ) {
				matchStr = matchStr.substr( 0, matchStr.length - 1 );  // remove the trailing ")"
				suffixStr = ")";  // this will be added after the generated <a> tag
			} else {
				// Handle an invalid character after the TLD
				var pos = this.matchHasInvalidCharAfterTld( urlMatch, protocolUrlMatch );
				if( pos > -1 ) {
					suffixStr = matchStr.substr(pos);  // this will be added after the generated <a> tag
					matchStr = matchStr.substr( 0, pos ); // remove the trailing invalid chars
				}
			}

			if( emailAddressMatch ) {
				match = new Autolinker.match.Email( { matchedText: matchStr, email: emailAddressMatch } );

			} else if( twitterMatch ) {
				// fix up the `matchStr` if there was a preceding whitespace char,
				// which was needed to determine the match itself (since there are
				// no look-behinds in JS regexes)
				if( twitterHandlePrefixWhitespaceChar ) {
					prefixStr = twitterHandlePrefixWhitespaceChar;
					matchStr = matchStr.slice( 1 );  // remove the prefixed whitespace char from the match
				}
				match = new Autolinker.match.Twitter( { matchedText: matchStr, twitterHandle: twitterHandle } );

			} else if( phoneMatch ) {
				// remove non-numeric values from phone number string
				var cleanNumber = matchStr.replace( /\D/g, '' );
	 			match = new Autolinker.match.Phone( { matchedText: matchStr, number: cleanNumber } );

			} else if( hashtagMatch ) {
				// fix up the `matchStr` if there was a preceding whitespace char,
				// which was needed to determine the match itself (since there are
				// no look-behinds in JS regexes)
				if( hashtagPrefixWhitespaceChar ) {
					prefixStr = hashtagPrefixWhitespaceChar;
					matchStr = matchStr.slice( 1 );  // remove the prefixed whitespace char from the match
				}
				match = new Autolinker.match.Hashtag( { matchedText: matchStr, serviceName: this.hashtag, hashtag: hashtag } );

			} else {  // url match
				// If it's a protocol-relative '//' match, remove the character
				// before the '//' (which the matcherRegex needed to match due to
				// the lack of a negative look-behind in JavaScript regular
				// expressions)
				if( protocolRelativeMatch ) {
					var charBeforeMatch = protocolRelativeMatch.match( this.charBeforeProtocolRelMatchRegex )[ 1 ] || "";

					if( charBeforeMatch ) {  // fix up the `matchStr` if there was a preceding char before a protocol-relative match, which was needed to determine the match itself (since there are no look-behinds in JS regexes)
						prefixStr = charBeforeMatch;
						matchStr = matchStr.slice( 1 );  // remove the prefixed char from the match
					}
				}

				match = new Autolinker.match.Url( {
					matchedText : matchStr,
					url : matchStr,
					protocolUrlMatch : !!protocolUrlMatch,
					protocolRelativeMatch : !!protocolRelativeMatch,
					stripPrefix : this.stripPrefix
				} );
			}

			return {
				prefixStr : prefixStr,
				suffixStr : suffixStr,
				match     : match
			};
		},


		/**
		 * Determines if a match found has an unmatched closing parenthesis. If so,
		 * this parenthesis will be removed from the match itself, and appended
		 * after the generated anchor tag in {@link #processCandidateMatch}.
		 *
		 * A match may have an extra closing parenthesis at the end of the match
		 * because the regular expression must include parenthesis for URLs such as
		 * "wikipedia.com/something_(disambiguation)", which should be auto-linked.
		 *
		 * However, an extra parenthesis *will* be included when the URL itself is
		 * wrapped in parenthesis, such as in the case of "(wikipedia.com/something_(disambiguation))".
		 * In this case, the last closing parenthesis should *not* be part of the
		 * URL itself, and this method will return `true`.
		 *
		 * @private
		 * @param {String} matchStr The full match string from the {@link #matcherRegex}.
		 * @return {Boolean} `true` if there is an unbalanced closing parenthesis at
		 *   the end of the `matchStr`, `false` otherwise.
		 */
		matchHasUnbalancedClosingParen : function( matchStr ) {
			var lastChar = matchStr.charAt( matchStr.length - 1 );

			if( lastChar === ')' ) {
				var openParensMatch = matchStr.match( /\(/g ),
				    closeParensMatch = matchStr.match( /\)/g ),
				    numOpenParens = ( openParensMatch && openParensMatch.length ) || 0,
				    numCloseParens = ( closeParensMatch && closeParensMatch.length ) || 0;

				if( numOpenParens < numCloseParens ) {
					return true;
				}
			}

			return false;
		},


		/**
		 * Determine if there's an invalid character after the TLD in a URL. Valid
		 * characters after TLD are ':/?#'. Exclude protocol matched URLs from this
		 * check.
		 *
		 * @private
		 * @param {String} urlMatch The matched URL, if there was one. Will be an
		 *   empty string if the match is not a URL match.
		 * @param {String} protocolUrlMatch The match URL string for a protocol
		 *   match. Ex: 'http://yahoo.com'. This is used to match something like
		 *   'http://localhost', where we won't double check that the domain name
		 *   has at least one '.' in it.
		 * @return {Number} the position where the invalid character was found. If
		 *   no such character was found, returns -1
		 */
		matchHasInvalidCharAfterTld : function( urlMatch, protocolUrlMatch ) {
			if ( !urlMatch ) {
				return -1;
			}

			var offset = 0;
			if ( protocolUrlMatch ) {
				offset = urlMatch.indexOf(':');
				urlMatch = urlMatch.slice(offset);
			}

			var re = /^((.?\/\/)?[A-Za-z0-9\.\-]*[A-Za-z0-9\-]\.[A-Za-z]+)/;
			var res = re.exec( urlMatch );
			if ( res === null ) {
				return -1;
			}

			offset += res[1].length;
			urlMatch = urlMatch.slice(res[1].length);
			if (/^[^.A-Za-z:\/?#]/.test(urlMatch)) {
				return offset;
			}

			return -1;
		}

	} );

	/*global Autolinker */
	/*jshint scripturl:true */
	/**
	 * @private
	 * @class Autolinker.MatchValidator
	 * @extends Object
	 *
	 * Used by Autolinker to filter out false positives from the
	 * {@link Autolinker.matchParser.MatchParser#matcherRegex}.
	 *
	 * Due to the limitations of regular expressions (including the missing feature
	 * of look-behinds in JS regular expressions), we cannot always determine the
	 * validity of a given match. This class applies a bit of additional logic to
	 * filter out any false positives that have been matched by the
	 * {@link Autolinker.matchParser.MatchParser#matcherRegex}.
	 */
	Autolinker.MatchValidator = Autolinker.Util.extend( Object, {

		/**
		 * @private
		 * @property {RegExp} invalidProtocolRelMatchRegex
		 *
		 * The regular expression used to check a potential protocol-relative URL
		 * match, coming from the {@link Autolinker.matchParser.MatchParser#matcherRegex}.
		 * A protocol-relative URL is, for example, "//yahoo.com"
		 *
		 * This regular expression checks to see if there is a word character before
		 * the '//' match in order to determine if we should actually autolink a
		 * protocol-relative URL. This is needed because there is no negative
		 * look-behind in JavaScript regular expressions.
		 *
		 * For instance, we want to autolink something like "Go to: //google.com",
		 * but we don't want to autolink something like "abc//google.com"
		 */
		invalidProtocolRelMatchRegex : /^[\w]\/\//,

		/**
		 * Regex to test for a full protocol, with the two trailing slashes. Ex: 'http://'
		 *
		 * @private
		 * @property {RegExp} hasFullProtocolRegex
		 */
		hasFullProtocolRegex : /^[A-Za-z][-.+A-Za-z0-9]+:\/\//,

		/**
		 * Regex to find the URI scheme, such as 'mailto:'.
		 *
		 * This is used to filter out 'javascript:' and 'vbscript:' schemes.
		 *
		 * @private
		 * @property {RegExp} uriSchemeRegex
		 */
		uriSchemeRegex : /^[A-Za-z][-.+A-Za-z0-9]+:/,

		/**
		 * Regex to determine if at least one word char exists after the protocol (i.e. after the ':')
		 *
		 * @private
		 * @property {RegExp} hasWordCharAfterProtocolRegex
		 */
		hasWordCharAfterProtocolRegex : /:[^\s]*?[A-Za-z]/,


		/**
		 * Determines if a given match found by the {@link Autolinker.matchParser.MatchParser}
		 * is valid. Will return `false` for:
		 *
		 * 1) URL matches which do not have at least have one period ('.') in the
		 *    domain name (effectively skipping over matches like "abc:def").
		 *    However, URL matches with a protocol will be allowed (ex: 'http://localhost')
		 * 2) URL matches which do not have at least one word character in the
		 *    domain name (effectively skipping over matches like "git:1.0").
		 * 3) A protocol-relative url match (a URL beginning with '//') whose
		 *    previous character is a word character (effectively skipping over
		 *    strings like "abc//google.com")
		 *
		 * Otherwise, returns `true`.
		 *
		 * @param {String} urlMatch The matched URL, if there was one. Will be an
		 *   empty string if the match is not a URL match.
		 * @param {String} protocolUrlMatch The match URL string for a protocol
		 *   match. Ex: 'http://yahoo.com'. This is used to match something like
		 *   'http://localhost', where we won't double check that the domain name
		 *   has at least one '.' in it.
		 * @param {String} protocolRelativeMatch The protocol-relative string for a
		 *   URL match (i.e. '//'), possibly with a preceding character (ex, a
		 *   space, such as: ' //', or a letter, such as: 'a//'). The match is
		 *   invalid if there is a word character preceding the '//'.
		 * @return {Boolean} `true` if the match given is valid and should be
		 *   processed, or `false` if the match is invalid and/or should just not be
		 *   processed.
		 */
		isValidMatch : function( urlMatch, protocolUrlMatch, protocolRelativeMatch ) {
			if(
				( protocolUrlMatch && !this.isValidUriScheme( protocolUrlMatch ) ) ||
				this.urlMatchDoesNotHaveProtocolOrDot( urlMatch, protocolUrlMatch ) ||       // At least one period ('.') must exist in the URL match for us to consider it an actual URL, *unless* it was a full protocol match (like 'http://localhost')
				this.urlMatchDoesNotHaveAtLeastOneWordChar( urlMatch, protocolUrlMatch ) ||  // At least one letter character must exist in the domain name after a protocol match. Ex: skip over something like "git:1.0"
				this.isInvalidProtocolRelativeMatch( protocolRelativeMatch )                 // A protocol-relative match which has a word character in front of it (so we can skip something like "abc//google.com")
			) {
				return false;
			}

			return true;
		},


		/**
		 * Determines if the URI scheme is a valid scheme to be autolinked. Returns
		 * `false` if the scheme is 'javascript:' or 'vbscript:'
		 *
		 * @private
		 * @param {String} uriSchemeMatch The match URL string for a full URI scheme
		 *   match. Ex: 'http://yahoo.com' or 'mailto:a@a.com'.
		 * @return {Boolean} `true` if the scheme is a valid one, `false` otherwise.
		 */
		isValidUriScheme : function( uriSchemeMatch ) {
			var uriScheme = uriSchemeMatch.match( this.uriSchemeRegex )[ 0 ].toLowerCase();

			return ( uriScheme !== 'javascript:' && uriScheme !== 'vbscript:' );
		},


		/**
		 * Determines if a URL match does not have either:
		 *
		 * a) a full protocol (i.e. 'http://'), or
		 * b) at least one dot ('.') in the domain name (for a non-full-protocol
		 *    match).
		 *
		 * Either situation is considered an invalid URL (ex: 'git:d' does not have
		 * either the '://' part, or at least one dot in the domain name. If the
		 * match was 'git:abc.com', we would consider this valid.)
		 *
		 * @private
		 * @param {String} urlMatch The matched URL, if there was one. Will be an
		 *   empty string if the match is not a URL match.
		 * @param {String} protocolUrlMatch The match URL string for a protocol
		 *   match. Ex: 'http://yahoo.com'. This is used to match something like
		 *   'http://localhost', where we won't double check that the domain name
		 *   has at least one '.' in it.
		 * @return {Boolean} `true` if the URL match does not have a full protocol,
		 *   or at least one dot ('.') in a non-full-protocol match.
		 */
		urlMatchDoesNotHaveProtocolOrDot : function( urlMatch, protocolUrlMatch ) {
			return ( !!urlMatch && ( !protocolUrlMatch || !this.hasFullProtocolRegex.test( protocolUrlMatch ) ) && urlMatch.indexOf( '.' ) === -1 );
		},


		/**
		 * Determines if a URL match does not have at least one word character after
		 * the protocol (i.e. in the domain name).
		 *
		 * At least one letter character must exist in the domain name after a
		 * protocol match. Ex: skip over something like "git:1.0"
		 *
		 * @private
		 * @param {String} urlMatch The matched URL, if there was one. Will be an
		 *   empty string if the match is not a URL match.
		 * @param {String} protocolUrlMatch The match URL string for a protocol
		 *   match. Ex: 'http://yahoo.com'. This is used to know whether or not we
		 *   have a protocol in the URL string, in order to check for a word
		 *   character after the protocol separator (':').
		 * @return {Boolean} `true` if the URL match does not have at least one word
		 *   character in it after the protocol, `false` otherwise.
		 */
		urlMatchDoesNotHaveAtLeastOneWordChar : function( urlMatch, protocolUrlMatch ) {
			if( urlMatch && protocolUrlMatch ) {
				return !this.hasWordCharAfterProtocolRegex.test( urlMatch );
			} else {
				return false;
			}
		},


		/**
		 * Determines if a protocol-relative match is an invalid one. This method
		 * returns `true` if there is a `protocolRelativeMatch`, and that match
		 * contains a word character before the '//' (i.e. it must contain
		 * whitespace or nothing before the '//' in order to be considered valid).
		 *
		 * @private
		 * @param {String} protocolRelativeMatch The protocol-relative string for a
		 *   URL match (i.e. '//'), possibly with a preceding character (ex, a
		 *   space, such as: ' //', or a letter, such as: 'a//'). The match is
		 *   invalid if there is a word character preceding the '//'.
		 * @return {Boolean} `true` if it is an invalid protocol-relative match,
		 *   `false` otherwise.
		 */
		isInvalidProtocolRelativeMatch : function( protocolRelativeMatch ) {
			return ( !!protocolRelativeMatch && this.invalidProtocolRelMatchRegex.test( protocolRelativeMatch ) );
		}

	} );
	/*global Autolinker */
	/**
	 * @abstract
	 * @class Autolinker.match.Match
	 * 
	 * Represents a match found in an input string which should be Autolinked. A Match object is what is provided in a 
	 * {@link Autolinker#replaceFn replaceFn}, and may be used to query for details about the match.
	 * 
	 * For example:
	 * 
	 *     var input = "...";  // string with URLs, Email Addresses, and Twitter Handles
	 *     
	 *     var linkedText = Autolinker.link( input, {
	 *         replaceFn : function( autolinker, match ) {
	 *             console.log( "href = ", match.getAnchorHref() );
	 *             console.log( "text = ", match.getAnchorText() );
	 *         
	 *             switch( match.getType() ) {
	 *                 case 'url' : 
	 *                     console.log( "url: ", match.getUrl() );
	 *                     
	 *                 case 'email' :
	 *                     console.log( "email: ", match.getEmail() );
	 *                     
	 *                 case 'twitter' :
	 *                     console.log( "twitter: ", match.getTwitterHandle() );
	 *             }
	 *         }
	 *     } );
	 *     
	 * See the {@link Autolinker} class for more details on using the {@link Autolinker#replaceFn replaceFn}.
	 */
	Autolinker.match.Match = Autolinker.Util.extend( Object, {
		
		/**
		 * @cfg {String} matchedText (required)
		 * 
		 * The original text that was matched.
		 */
		
		
		/**
		 * @constructor
		 * @param {Object} cfg The configuration properties for the Match instance, specified in an Object (map).
		 */
		constructor : function( cfg ) {
			Autolinker.Util.assign( this, cfg );
		},

		
		/**
		 * Returns a string name for the type of match that this class represents.
		 * 
		 * @abstract
		 * @return {String}
		 */
		getType : Autolinker.Util.abstractMethod,
		
		
		/**
		 * Returns the original text that was matched.
		 * 
		 * @return {String}
		 */
		getMatchedText : function() {
			return this.matchedText;
		},
		

		/**
		 * Returns the anchor href that should be generated for the match.
		 * 
		 * @abstract
		 * @return {String}
		 */
		getAnchorHref : Autolinker.Util.abstractMethod,
		
		
		/**
		 * Returns the anchor text that should be generated for the match.
		 * 
		 * @abstract
		 * @return {String}
		 */
		getAnchorText : Autolinker.Util.abstractMethod

	} );
	/*global Autolinker */
	/**
	 * @class Autolinker.match.Email
	 * @extends Autolinker.match.Match
	 * 
	 * Represents a Email match found in an input string which should be Autolinked.
	 * 
	 * See this class's superclass ({@link Autolinker.match.Match}) for more details.
	 */
	Autolinker.match.Email = Autolinker.Util.extend( Autolinker.match.Match, {
		
		/**
		 * @cfg {String} email (required)
		 * 
		 * The email address that was matched.
		 */
		

		/**
		 * Returns a string name for the type of match that this class represents.
		 * 
		 * @return {String}
		 */
		getType : function() {
			return 'email';
		},
		
		
		/**
		 * Returns the email address that was matched.
		 * 
		 * @return {String}
		 */
		getEmail : function() {
			return this.email;
		},
		

		/**
		 * Returns the anchor href that should be generated for the match.
		 * 
		 * @return {String}
		 */
		getAnchorHref : function() {
			return 'mailto:' + this.email;
		},
		
		
		/**
		 * Returns the anchor text that should be generated for the match.
		 * 
		 * @return {String}
		 */
		getAnchorText : function() {
			return this.email;
		}
		
	} );
	/*global Autolinker */
	/**
	 * @class Autolinker.match.Hashtag
	 * @extends Autolinker.match.Match
	 *
	 * Represents a Hashtag match found in an input string which should be
	 * Autolinked.
	 *
	 * See this class's superclass ({@link Autolinker.match.Match}) for more
	 * details.
	 */
	Autolinker.match.Hashtag = Autolinker.Util.extend( Autolinker.match.Match, {

		/**
		 * @cfg {String} serviceName (required)
		 *
		 * The service to point hashtag matches to. See {@link Autolinker#hashtag}
		 * for available values.
		 */

		/**
		 * @cfg {String} hashtag (required)
		 *
		 * The Hashtag that was matched, without the '#'.
		 */


		/**
		 * Returns the type of match that this class represents.
		 *
		 * @return {String}
		 */
		getType : function() {
			return 'hashtag';
		},


		/**
		 * Returns the matched hashtag.
		 *
		 * @return {String}
		 */
		getHashtag : function() {
			return this.hashtag;
		},


		/**
		 * Returns the anchor href that should be generated for the match.
		 *
		 * @return {String}
		 */
		getAnchorHref : function() {
			var serviceName = this.serviceName,
			    hashtag = this.hashtag;

			switch( serviceName ) {
				case 'twitter' :
					return 'https://twitter.com/hashtag/' + hashtag;
				case 'facebook' :
					return 'https://www.facebook.com/hashtag/' + hashtag;

				default :  // Shouldn't happen because Autolinker's constructor should block any invalid values, but just in case.
					throw new Error( 'Unknown service name to point hashtag to: ', serviceName );
			}
		},


		/**
		 * Returns the anchor text that should be generated for the match.
		 *
		 * @return {String}
		 */
		getAnchorText : function() {
			return '#' + this.hashtag;
		}

	} );
	/*global Autolinker */
	/**
	 * @class Autolinker.match.Phone
	 * @extends Autolinker.match.Match
	 *
	 * Represents a Phone number match found in an input string which should be
	 * Autolinked.
	 *
	 * See this class's superclass ({@link Autolinker.match.Match}) for more
	 * details.
	 */
	Autolinker.match.Phone = Autolinker.Util.extend( Autolinker.match.Match, {

		/**
		 * @cfg {String} number (required)
		 *
		 * The phone number that was matched.
		 */


		/**
		 * Returns a string name for the type of match that this class represents.
		 *
		 * @return {String}
		 */
		getType : function() {
			return 'phone';
		},


		/**
		 * Returns the phone number that was matched.
		 *
		 * @return {String}
		 */
		getNumber: function() {
			return this.number;
		},


		/**
		 * Returns the anchor href that should be generated for the match.
		 *
		 * @return {String}
		 */
		getAnchorHref : function() {
			return 'tel:' + this.number;
		},


		/**
		 * Returns the anchor text that should be generated for the match.
		 *
		 * @return {String}
		 */
		getAnchorText : function() {
			return this.matchedText;
		}

	} );

	/*global Autolinker */
	/**
	 * @class Autolinker.match.Twitter
	 * @extends Autolinker.match.Match
	 * 
	 * Represents a Twitter match found in an input string which should be Autolinked.
	 * 
	 * See this class's superclass ({@link Autolinker.match.Match}) for more details.
	 */
	Autolinker.match.Twitter = Autolinker.Util.extend( Autolinker.match.Match, {
		
		/**
		 * @cfg {String} twitterHandle (required)
		 * 
		 * The Twitter handle that was matched.
		 */
		

		/**
		 * Returns the type of match that this class represents.
		 * 
		 * @return {String}
		 */
		getType : function() {
			return 'twitter';
		},
		
		
		/**
		 * Returns a string name for the type of match that this class represents.
		 * 
		 * @return {String}
		 */
		getTwitterHandle : function() {
			return this.twitterHandle;
		},
		

		/**
		 * Returns the anchor href that should be generated for the match.
		 * 
		 * @return {String}
		 */
		getAnchorHref : function() {
			return 'https://twitter.com/' + this.twitterHandle;
		},
		
		
		/**
		 * Returns the anchor text that should be generated for the match.
		 * 
		 * @return {String}
		 */
		getAnchorText : function() {
			return '@' + this.twitterHandle;
		}
		
	} );
	/*global Autolinker */
	/**
	 * @class Autolinker.match.Url
	 * @extends Autolinker.match.Match
	 * 
	 * Represents a Url match found in an input string which should be Autolinked.
	 * 
	 * See this class's superclass ({@link Autolinker.match.Match}) for more details.
	 */
	Autolinker.match.Url = Autolinker.Util.extend( Autolinker.match.Match, {
		
		/**
		 * @cfg {String} url (required)
		 * 
		 * The url that was matched.
		 */
		
		/**
		 * @cfg {Boolean} protocolUrlMatch (required)
		 * 
		 * `true` if the URL is a match which already has a protocol (i.e. 'http://'), `false` if the match was from a 'www' or
		 * known TLD match.
		 */
		
		/**
		 * @cfg {Boolean} protocolRelativeMatch (required)
		 * 
		 * `true` if the URL is a protocol-relative match. A protocol-relative match is a URL that starts with '//',
		 * and will be either http:// or https:// based on the protocol that the site is loaded under.
		 */
		
		/**
		 * @cfg {Boolean} stripPrefix (required)
		 * @inheritdoc Autolinker#stripPrefix
		 */
		

		/**
		 * @private
		 * @property {RegExp} urlPrefixRegex
		 * 
		 * A regular expression used to remove the 'http://' or 'https://' and/or the 'www.' from URLs.
		 */
		urlPrefixRegex: /^(https?:\/\/)?(www\.)?/i,
		
		/**
		 * @private
		 * @property {RegExp} protocolRelativeRegex
		 * 
		 * The regular expression used to remove the protocol-relative '//' from the {@link #url} string, for purposes
		 * of {@link #getAnchorText}. A protocol-relative URL is, for example, "//yahoo.com"
		 */
		protocolRelativeRegex : /^\/\//,
		
		/**
		 * @private
		 * @property {Boolean} protocolPrepended
		 * 
		 * Will be set to `true` if the 'http://' protocol has been prepended to the {@link #url} (because the
		 * {@link #url} did not have a protocol)
		 */
		protocolPrepended : false,
		

		/**
		 * Returns a string name for the type of match that this class represents.
		 * 
		 * @return {String}
		 */
		getType : function() {
			return 'url';
		},
		
		
		/**
		 * Returns the url that was matched, assuming the protocol to be 'http://' if the original
		 * match was missing a protocol.
		 * 
		 * @return {String}
		 */
		getUrl : function() {
			var url = this.url;
			
			// if the url string doesn't begin with a protocol, assume 'http://'
			if( !this.protocolRelativeMatch && !this.protocolUrlMatch && !this.protocolPrepended ) {
				url = this.url = 'http://' + url;
				
				this.protocolPrepended = true;
			}
			
			return url;
		},
		

		/**
		 * Returns the anchor href that should be generated for the match.
		 * 
		 * @return {String}
		 */
		getAnchorHref : function() {
			var url = this.getUrl();
			
			return url.replace( /&amp;/g, '&' );  // any &amp;'s in the URL should be converted back to '&' if they were displayed as &amp; in the source html 
		},
		
		
		/**
		 * Returns the anchor text that should be generated for the match.
		 * 
		 * @return {String}
		 */
		getAnchorText : function() {
			var anchorText = this.getUrl();
			
			if( this.protocolRelativeMatch ) {
				// Strip off any protocol-relative '//' from the anchor text
				anchorText = this.stripProtocolRelativePrefix( anchorText );
			}
			if( this.stripPrefix ) {
				anchorText = this.stripUrlPrefix( anchorText );
			}
			anchorText = this.removeTrailingSlash( anchorText );  // remove trailing slash, if there is one
			
			return anchorText;
		},
		
		
		// ---------------------------------------
		
		// Utility Functionality
		
		/**
		 * Strips the URL prefix (such as "http://" or "https://") from the given text.
		 * 
		 * @private
		 * @param {String} text The text of the anchor that is being generated, for which to strip off the
		 *   url prefix (such as stripping off "http://")
		 * @return {String} The `anchorText`, with the prefix stripped.
		 */
		stripUrlPrefix : function( text ) {
			return text.replace( this.urlPrefixRegex, '' );
		},
		
		
		/**
		 * Strips any protocol-relative '//' from the anchor text.
		 * 
		 * @private
		 * @param {String} text The text of the anchor that is being generated, for which to strip off the
		 *   protocol-relative prefix (such as stripping off "//")
		 * @return {String} The `anchorText`, with the protocol-relative prefix stripped.
		 */
		stripProtocolRelativePrefix : function( text ) {
			return text.replace( this.protocolRelativeRegex, '' );
		},
		
		
		/**
		 * Removes any trailing slash from the given `anchorText`, in preparation for the text to be displayed.
		 * 
		 * @private
		 * @param {String} anchorText The text of the anchor that is being generated, for which to remove any trailing
		 *   slash ('/') that may exist.
		 * @return {String} The `anchorText`, with the trailing slash removed.
		 */
		removeTrailingSlash : function( anchorText ) {
			if( anchorText.charAt( anchorText.length - 1 ) === '/' ) {
				anchorText = anchorText.slice( 0, -1 );
			}
			return anchorText;
		}
		
	} );
	return Autolinker;

	}));


/***/ },
/* 94 */
/***/ function(module, exports) {

	module.exports = "<div id=\"twitter_(%message.id%)\" class=\"box box-solid item\">\n    <div class=\"box-header\">\n        <h2 class=\"box-title\">\n            <a href=\"#/god/(%message.user_name%)\">\n                <img v-attr=\"src:avatar\" class=\"direct-chat-img\">\n                <div class=\"name\">\n                    (%message.name%)\n                </div>\n            </a>\n        </h2>\n        <div class=\"box-tools pull-right\">\n            <a class=\"a-icon\" target=\"_blank\" href=\"(%message.href%)\">\n                <span class=\"round-icon bg-icon-blue\">\n                    <i class=\"fa fa-twitter\"></i>\n                </span>\n            </a>\n            <a href=\"/message?t=(%message.m_type%)&id=(%message.id%)\">\n                <sub v-time-len=\"message.created_at\"></sub>\n            </a>\n        </div>\n    </div>\n    <div class=\"box-body\">\n        <p class=\"description_bz\" v-html=\"text\"></p>\n        <template v-repeat=\"media:medias\">\n            <img v-attr=\"src:media.img_url, height:media.height\" class=\"my-img-responsive\" >\n            <br>\n        </template>\n    </div>\n</div>\n";

/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	var bz;

	__webpack_require__(96);

	bz = __webpack_require__(77);

	module.exports = {
	  template: __webpack_require__(98),
	  props: ['message'],
	  computed: {
	    avatar: function() {
	      return this.message.avatar;
	    },
	    repo_url: function() {
	      var repo_url;
	      repo_url = this.message.content.repo.url.replace('api.github.com/repos', 'github.com');
	      return repo_url;
	    },
	    repo_name: function() {
	      return this.message.content.repo.name;
	    },
	    repo_link: function() {
	      var repo_link;
	      repo_link = "<a href='" + this.repo_url + "' target='_blank'>" + this.repo_name + "</a>";
	      return repo_link;
	    },
	    type: function() {
	      return this.message.content.type;
	    },
	    payload: function() {
	      return this.message.content.payload;
	    },
	    commits: function() {
	      return this.payload.commits;
	    },
	    issue_comment_link: function() {
	      var issue_comment_link, issue_comment_url, issue_title;
	      issue_title = this.payload['issue']['title'];
	      issue_comment_url = this.payload['comment']['html_url'];
	      issue_comment_link = "<a target='_blank' href='" + issue_comment_url + "' >" + issue_title + "</a>";
	      return issue_comment_link;
	    },
	    issue_comment_body: function() {
	      return this.payload['comment']['body'];
	    }
	  }
	};


/***/ },
/* 96 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(97);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/less-loader/index.js!./style.less", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/less-loader/index.js!./style.less");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 97 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 98 */
/***/ function(module, exports) {

	module.exports = "<div id=\"github_(%message.id%)\" class=\"box box-solid item\">\n    <div class=\"box-header\">\n        <h2 class=\"box-title\">\n            <a href=\"#/god/(%message.user_name%)\">\n                <img v-attr=\"src:avatar\" class=\"direct-chat-img\">\n                <div class=\"name\">\n                    (%message.name%)\n                </div>\n            </a>\n        </h2>\n        <div class=\"box-tools pull-right\">\n            <a class=\"a-icon\" target=\"_blank\" href=\"(%repo_url%)\">\n                <span class=\"round-icon bg-icon-black\">\n                    <i class=\"fa fa-github\"></i>\n                </span>\n            </a>\n            <a href=\"/message?t=(%message.m_type%)&id=(%message.id%)\">\n                <sub v-time-len=\"message.created_at\"></sub>\n            </a>\n        </div>\n    </div>\n    <div class=\"box-body\">\n        (%type%) <a href='(%repo_url%)' target='_blank'>(%repo_name%)</a>\n        <li v-repeat=\"commits\">\n            <a target=\"_blank\" href=\"(%url.replace('api.github.com/repos', 'github.com')%)\">\n                (%message%)\n            </a>\n        </li>\n        <p v-html=\"issue_comment_link\">\n        </p>\n        <p v-show=\"issue_comment_body\" class='description_bz'>\n        (%issue_comment_body%)\n        </p>\n    </div>\n</div>\n";

/***/ },
/* 99 */
/***/ function(module, exports, __webpack_require__) {

	var bz;

	__webpack_require__(100);

	bz = __webpack_require__(77);

	module.exports = {
	  template: __webpack_require__(102),
	  props: ['message'],
	  computed: {
	    avatar: function() {
	      var avatar;
	      avatar = btoa(btoa(this.message.avatar));
	      return '/sp/' + avatar;
	    },
	    img_url: function() {
	      var img_url;
	      img_url = btoa(btoa(this.message.extended_entities.url));
	      return '/sp/' + img_url;
	    },
	    height: function() {
	      var img_height, img_width;
	      img_height = this.message.extended_entities.height;
	      img_width = this.message.extended_entities.width;
	      return bz.getFitHeight(img_height, img_width);
	    }
	  }
	};


/***/ },
/* 100 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(101);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/less-loader/index.js!./style.less", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/less-loader/index.js!./style.less");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 101 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 102 */
/***/ function(module, exports) {

	module.exports = "<div id=\"instagram_(%message.id%)\" class=\"box box-solid item\">\n    <div class=\"box-header\">\n        <h2 class=\"box-title\">\n            <a href=\"#/god/(%message.user_name%)\">\n                <img v-attr=\"src:avatar\" class=\"direct-chat-img\">\n                <div class=\"name\">\n                    (%message.name%)\n                </div>\n            </a>\n        </h2>\n        <div class=\"box-tools pull-right\">\n            <a class=\"a-icon\" target=\"_blank\" href=\"(%message.href%)\">\n                <span class=\"round-icon bg-icon-orange\">\n                    <i class=\"fa fa-instagram\"></i>\n                </span>\n            </a>\n            <a href=\"/message?t=(%message.m_type%)&id=(%message.id%)\">\n                <sub v-time-len=\"message.created_at\"></sub>\n            </a>\n        </div>\n    </div>\n    <div class=\"box-body\">\n        <p class=\"description_bz\">(%message.text%)</p>\n        <br>\n        <img v-attr=\"src:img_url,height:height\" class=\"my-img-responsive\">\n    </div>\n</div>\n";

/***/ },
/* 103 */
/***/ function(module, exports, __webpack_require__) {

	var bz;

	__webpack_require__(104);

	bz = __webpack_require__(77);

	module.exports = {
	  template: __webpack_require__(106),
	  props: ['user_info'],
	  computed: {
	    avatar: function() {
	      if (this.user_info.picture) {
	        return this.user_info.picture;
	      } else {
	        return '/lib_static/images/avatar.svg';
	      }
	    }
	  },
	  ready: function() {
	    return bz.setOnErrorVm(this);
	  },
	  data: function() {
	    return {
	      loading: false,
	      disable_edit: true,
	      button_text: '修改资料'
	    };
	  },
	  methods: {
	    autoInsert: function(key, scheme) {
	      if (scheme == null) {
	        scheme = 'http://';
	      }
	      if (!this.user_info[key]) {
	        return this.user_info.$set(key, scheme);
	      }
	    },
	    changeImg: function() {
	      return $('#profile-image-upload').click();
	    },
	    previewImg: function(e) {
	      var file, reader;
	      file = e.target.files[0];
	      if (!file) {
	        return;
	      }
	      if (file.size > (10 * 1024 * 1024)) {
	        throw new Error("图片大小只能小于10m哦~");
	      }
	      reader = new FileReader();
	      reader.onload = function(e) {
	        return $("#profile-image-upload").attr("src", e.target.result);
	      };
	      reader.readAsDataURL(file);
	      return this.uploadImage();
	    },
	    uploadImage: function() {
	      var fd, file;
	      fd = new FormData();
	      file = $("#profile-image-upload")[0].files[0];
	      if (file) {
	        fd.append("img", file);
	        return $.ajax({
	          url: '/upload_image',
	          type: 'POST',
	          data: fd,
	          processData: false,
	          contentType: false,
	          success: (function(_this) {
	            return function(data, status, response) {
	              _this.loading = false;
	              if (!data.success) {
	                throw new Error(data.msg);
	              } else {
	                bz.showSuccess5("保存成功");
	                _this.user_info.picture = data.file_path;
	                return $("#profile-image").attr("src", _this.user_info.picture);
	              }
	            };
	          })(this),
	          error: function(error_info) {
	            this.loading = false;
	            throw new Error(error_info);
	          }
	        });
	      }
	    },
	    save: function() {
	      var parm, path;
	      if (this.disable_edit) {
	        this.disable_edit = false;
	        return $("#btn-edit").text('保存');
	      } else {
	        this.loading = true;
	        parm = JSON.stringify({
	          user_name: this.user_info.user_name,
	          blog: this.user_info.blog,
	          twitter: this.user_info.twitter,
	          github: this.user_info.github,
	          instagram: this.user_info.instagram,
	          slogan: this.user_info.slogan,
	          picture: this.user_info.picture
	        });
	        path = bz.getUrlPath(1);
	        return $.ajax({
	          url: '/add',
	          type: 'POST',
	          data: parm,
	          success: (function(_this) {
	            return function(data, status, response) {
	              _this.loading = false;
	              _this.disable_edit = true;
	              $("#btn-edit").text('编辑');
	              if (data.error !== '0') {
	                throw new Error(data.error);
	              } else {
	                return bz.showSuccess5("保存成功");
	              }
	            };
	          })(this)
	        });
	      }
	    }
	  }
	};


/***/ },
/* 104 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(105);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/less-loader/index.js!./style.less", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/less-loader/index.js!./style.less");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 105 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 106 */
/***/ function(module, exports) {

	module.exports = "<div class=\"fixed\" v-show=\"user_info\" v-transition=\"fade\">\n    <h3 class=\"box-title text-center\">(%user_info.user_name%)</h3>\n    <input v-disable=\"disable_edit\" id=\"profile-image-upload\" class=\"hide\" type=\"file\" v-on=\"change:previewImg\" accept=\"image/*\"/>\n    <a v-on=\"click:changeImg\" href=\"javascript:void(0)\">\n        <img v-attr=\"src:avatar\" id=\"profile-image\" class=\"img-responsive center-block avatar\" />\n    </a>\n    <div class=\"text-center\">\n        <sub v-show=\"!disable_edit\" >点击更换头像</sub>\n    </div>\n    <div v-html=\"user_info.slogan\">\n    </div>\n    <br>\n    <hr>\n    <form class=\"form-horizontal\">\n        <div class=\"form-group\">\n            <label for=\"user_name\" class=\"col-sm-3 control-label min-form-lable\">用户名</label>\n            <div class=\"col-sm-9\">\n                <input v-disable=\"disable_edit\" type=\"text\"  class=\"form-control\" id=\"user_name\" v-model=\"user_info.user_name\">\n            </div>\n        </div>\n        <div class=\"form-group\">\n            <label for=\"blog\" class=\"col-sm-3 control-label min-form-lable\">个人博客</label>\n            <div class=\"col-sm-9\">\n                <input v-disable=\"disable_edit\" type=\"text\"  class=\"form-control editable\" id=\"blog\" placeholder=\"\"  v-model=\"user_info.blog\"  v-on=\"focus:autoInsert('blog')\">\n            </div>\n        </div>\n        <div v-show=\"!disable_edit\" class=\"form-group\" id=\"slogan-group\">\n            <label for=\"editor\" class=\"col-sm-3 control-label min-form-lable\">个性签名</label>\n            <div class=\"col-sm-9\">\n                <simditor content=\"(%@ user_info.slogan%)\"></simditor>\n            </div>\n        </div>\n        <hr>\n        <div class=\"form-group\">\n            <a href=\"https://twitter.com/(%user_info.twitter%)\" target=\"_blank\">\n                <label class=\"col-sm-5 control-label\">\n                    <span class=\"round-icon bg-icon-blue\">\n                        <i class=\"fa fa-twitter\"></i>\n                    </span>\n                    Twitter\n                </label>\n            </a>\n            <div class=\"col-sm-7\">\n                <input v-disable=\"disable_edit\" type=\"text\" class=\"form-control editable\" id=\"twitter\" placeholder=\"\"   v-model=\"user_info.twitter\" v-on=\"focus:autoInsert('twitter', user_info.user_name)\">\n            </div>\n        </div>\n        <div class=\"form-group\">\n            <a href=\"https://github.com/(%user_info.github%)\" target=\"_blank\">\n                <label class=\"col-sm-5 control-label\"><span class=\"round-icon bg-icon-black\"><i class=\"fa fa-github\"></i></span> Github</label>\n            </a>\n            <div class=\"col-sm-7\">\n                <input v-disable=\"disable_edit\" type=\"text\" class=\"form-control editable\" placeholder=\"\"  v-model=\"user_info.github\" v-on=\"focus:autoInsert('github', user_info.user_name)\">\n            </div>\n        </div>\n        <div class=\"form-group\">\n            <a href=\"https://instagram.com/(%user_info.instagram%)\" target=\"_blank\">\n                <label class=\"col-sm-5 control-label\"><span class=\"round-icon bg-icon-orange\"><i class=\"fa fa-instagram\"></i></span> Instagram</label>\n            </a>\n            <div class=\"col-sm-7\">\n                <input v-disable=\"disable_edit\" type=\"text\" class=\"form-control editable\" placeholder=\"\"  v-model=\"user_info.instagram\" v-on=\"focus:autoInsert('instagram', user_info.user_name)\">\n            </div>\n        </div>\n    </form>\n    <div class=\"text-center\">\n        <follow followed=\"(%@ user_info.followed%)\" god_id=\"(%user_info.god_id%)\"></follow>\n        <button id=\"btn-edit\" v-btn-loading=\"loading\" type=\"submit\" class=\"btn btn-primary btn-flat btn-border\" v-on=\"click:save\">编辑</button>\n    </div>\n    <hr>\n</div>\n";

/***/ },
/* 107 */
/***/ function(module, exports, __webpack_require__) {

	var bz;

	__webpack_require__(108);

	bz = __webpack_require__(77);

	module.exports = {
	  template: __webpack_require__(110),
	  data: function() {
	    return {
	      gods: []
	    };
	  },
	  ready: function() {
	    return this.getGods();
	  },
	  methods: {
	    getGods: function() {
	      return $.ajax({
	        url: '/recommandGods',
	        type: 'POST',
	        success: (function(_this) {
	          return function(data, status, response) {
	            return _this.gods = data.gods;
	          };
	        })(this)
	      });
	    }
	  },
	  components: {
	    'god': __webpack_require__(111)
	  }
	};


/***/ },
/* 108 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(109);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/less-loader/index.js!./style.less", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/less-loader/index.js!./style.less");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 109 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 110 */
/***/ function(module, exports) {

	module.exports = "<god v-repeat=\"god in gods\" v-transition=\"fade\"></god>\n";

/***/ },
/* 111 */
/***/ function(module, exports, __webpack_require__) {

	var bz;

	__webpack_require__(112);

	bz = __webpack_require__(77);

	module.exports = {
	  template: __webpack_require__(114),
	  props: ['god'],
	  computed: {
	    twitter_link: function() {
	      var count;
	      if (this.god.twitter_user) {
	        count = bz.formatCount(this.god.twitter_user.followers_count);
	        return "<a class='a-icon' target='_blank' href='https://twitter.com/" + this.god.twitter + "'> <span class='round-icon bg-icon-blue'> <i class='fa fa-twitter'></i> </span> </a> " + count;
	      } else {
	        return '';
	      }
	    },
	    github_link: function() {
	      var count;
	      if (this.god.github_user) {
	        count = bz.formatCount(this.god.github_user.followers);
	        return "<a class='a-icon' target='_blank' href='https://github.com/" + this.god.github + "'> <span class='round-icon bg-icon-black'> <i class='fa fa-github'></i> </span> </a> " + count;
	      } else {
	        return '';
	      }
	    },
	    instagram_link: function() {
	      var count;
	      if (this.god.instagram_user) {
	        count = bz.formatCount(this.god.instagram_user.counts.followed_by);
	        return "<a class='a-icon' target='_blank' href='https://instagram.com/" + this.god.instagram + "'> <span class='round-icon bg-icon-orange'> <i class='fa fa-instagram'></i> </span> </a> " + count;
	      } else {
	        return '';
	      }
	    },
	    all_link: function() {
	      return this.twitter_link + this.github_link + this.instagram_link;
	    },
	    description: function() {
	      var description;
	      description = '';
	      if (this.god.slogan) {
	        description = this.god.slogan;
	      } else if (this.god.twitter_user) {
	        description = this.god.twitter_user.description;
	      }
	      return description;
	    },
	    avatar: function() {
	      var avatar_url;
	      if (this.god.picture) {
	        avatar_url = this.god.picture;
	      } else if (this.god.github_user) {
	        avatar_url = this.god.github_user.avatar_url;
	      } else if (this.god.instagram_user) {
	        avatar_url = this.god.instagram_user.profile_picture;
	        avatar_url = '/sp/' + btoa(btoa(avatar_url));
	      } else if (this.god.twitter_user) {
	        avatar_url = this.god.twitter_user.profile_image_url_https;
	        avatar_url = '/sp/' + btoa(btoa(avatar_url));
	      }
	      return avatar_url;
	    }
	  }
	};


/***/ },
/* 112 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(113);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/less-loader/index.js!./style.less", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/less-loader/index.js!./style.less");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 113 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 114 */
/***/ function(module, exports) {

	module.exports = "<div  class=\"box box-solid item\">\n    <div class=\"box-header\">\n        <h3 class=\"box-title\">\n            <a href=\"/#/god/(%god.user_name%)\">\n                <img v-attr=\"src:avatar\" class=\"direct-chat-img\">\n                <div class=\"name\">\n                    (%god.user_name%)\n                </div>\n            </a>\n        </h3>\n        <div class=\"box-tools pull-right\" v-html=\"all_link\">\n        </div>\n    </div>\n    <div class=\"box-body\" v-html=\"description\">\n    </div>\n    <div class=\"box-footer\">\n        <follow followed=\"(%god.followed%)\" god_id=\"(%god.god_id%)\"></follow>\n    </div>\n</div>\n";

/***/ },
/* 115 */
/***/ function(module, exports, __webpack_require__) {

	var bz;

	__webpack_require__(116);

	bz = __webpack_require__(77);

	module.exports = {
	  template: __webpack_require__(118),
	  data: function() {
	    return {
	      btn_loading: false,
	      slogan: '',
	      user_name: ''
	    };
	  },
	  ready: function() {
	    return bz.setOnErrorVm(this);
	  },
	  methods: {
	    pop: function() {
	      this.user_name = '';
	      return this.slogan = '';
	    },
	    addGod: function() {
	      var parm;
	      if (this.btn_loading) {

	      } else {
	        this.btn_loading = true;
	        parm = JSON.stringify({
	          user_name: this.user_name,
	          slogan: this.slogan,
	          twitter: this.user_name,
	          github: this.user_name,
	          instagram: this.user_name
	        });
	        return $.ajax({
	          url: '/add',
	          type: 'POST',
	          data: parm,
	          success: (function(_this) {
	            return function(data, status, response) {
	              _this.btn_loading = false;
	              if (data.error !== '0') {
	                throw new Error(data.error);
	              } else {
	                return bz.showSuccess5("保存成功");
	              }
	            };
	          })(this)
	        });
	      }
	    }
	  }
	};


/***/ },
/* 116 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(117);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/less-loader/index.js!./style.less", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/less-loader/index.js!./style.less");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 117 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 118 */
/***/ function(module, exports) {

	module.exports = "<a v-on=\"click:pop\" class=\"btn btn-defalt\" data-toggle=\"modal\" data-target=\"#god_input\">添加</a>\n<div id=\"god_input\" class=\"modal fade\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"exampleModalLabel\">\n    <div class=\"modal-dialog\" role=\"document\">\n        <div class=\"modal-content\">\n            <div class=\"modal-header\">\n                <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>\n                <h4 class=\"modal-title\" id=\"exampleModalLabel\">添加一个新的牛人</h4>\n            </div>\n            <div class=\"modal-body\">\n                <form>\n                    <div class=\"form-group\">\n                        <label for=\"recipient-name\" class=\"control-label\">用户名:</label>\n                        <input v-model=\"user_name\" type=\"text\" class=\"form-control\" id=\"recipient-name\">\n                    </div>\n                    <div class=\"form-group\">\n                        <label for=\"message-text\" class=\"control-label\">描述:</label>\n                        <simditor content=\"(%@ slogan%)\"></simditor>\n                    </div>\n                </form>\n            </div>\n            <div class=\"modal-footer\">\n                <button v-btn-loading=\"btn_loading\" v-on=\"click:addGod\" type=\"button\" class=\"btn btn-sm btn-default\" data-dismiss=\"modal\">加好了</button>\n            </div>\n        </div>\n    </div>\n</div>\n";

/***/ },
/* 119 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(120);

	module.exports = {
	  bind: function() {
	    $(this.el).prepend("<i class='fa fa-spin fa-spinner'></i>");
	  },
	  update: function(new_value, old_value) {
	    if (new_value) {
	      $(this.el).children().css('visibility', 'visible');
	    } else {
	      $(this.el).children().css('visibility', 'hidden');
	    }
	  },
	  unbind: function() {}
	};


/***/ },
/* 120 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(121);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/less-loader/index.js!./style.less", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/less-loader/index.js!./style.less");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 121 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 122 */
/***/ function(module, exports, __webpack_require__) {

	

	//
	// Generated on Tue Dec 16 2014 12:13:47 GMT+0100 (CET) by Charlie Robbins, Paolo Fragomeni & the Contributors (Using Codesurgeon).
	// Version 1.2.6
	//

	(function (exports) {

	/*
	 * browser.js: Browser specific functionality for director.
	 *
	 * (C) 2011, Charlie Robbins, Paolo Fragomeni, & the Contributors.
	 * MIT LICENSE
	 *
	 */

	var dloc = document.location;

	function dlocHashEmpty() {
	  // Non-IE browsers return '' when the address bar shows '#'; Director's logic
	  // assumes both mean empty.
	  return dloc.hash === '' || dloc.hash === '#';
	}

	var listener = {
	  mode: 'modern',
	  hash: dloc.hash,
	  history: false,

	  check: function () {
	    var h = dloc.hash;
	    if (h != this.hash) {
	      this.hash = h;
	      this.onHashChanged();
	    }
	  },

	  fire: function () {
	    if (this.mode === 'modern') {
	      this.history === true ? window.onpopstate() : window.onhashchange();
	    }
	    else {
	      this.onHashChanged();
	    }
	  },

	  init: function (fn, history) {
	    var self = this;
	    this.history = history;

	    if (!Router.listeners) {
	      Router.listeners = [];
	    }

	    function onchange(onChangeEvent) {
	      for (var i = 0, l = Router.listeners.length; i < l; i++) {
	        Router.listeners[i](onChangeEvent);
	      }
	    }

	    //note IE8 is being counted as 'modern' because it has the hashchange event
	    if ('onhashchange' in window && (document.documentMode === undefined
	      || document.documentMode > 7)) {
	      // At least for now HTML5 history is available for 'modern' browsers only
	      if (this.history === true) {
	        // There is an old bug in Chrome that causes onpopstate to fire even
	        // upon initial page load. Since the handler is run manually in init(),
	        // this would cause Chrome to run it twise. Currently the only
	        // workaround seems to be to set the handler after the initial page load
	        // http://code.google.com/p/chromium/issues/detail?id=63040
	        setTimeout(function() {
	          window.onpopstate = onchange;
	        }, 500);
	      }
	      else {
	        window.onhashchange = onchange;
	      }
	      this.mode = 'modern';
	    }
	    else {
	      //
	      // IE support, based on a concept by Erik Arvidson ...
	      //
	      var frame = document.createElement('iframe');
	      frame.id = 'state-frame';
	      frame.style.display = 'none';
	      document.body.appendChild(frame);
	      this.writeFrame('');

	      if ('onpropertychange' in document && 'attachEvent' in document) {
	        document.attachEvent('onpropertychange', function () {
	          if (event.propertyName === 'location') {
	            self.check();
	          }
	        });
	      }

	      window.setInterval(function () { self.check(); }, 50);

	      this.onHashChanged = onchange;
	      this.mode = 'legacy';
	    }

	    Router.listeners.push(fn);

	    return this.mode;
	  },

	  destroy: function (fn) {
	    if (!Router || !Router.listeners) {
	      return;
	    }

	    var listeners = Router.listeners;

	    for (var i = listeners.length - 1; i >= 0; i--) {
	      if (listeners[i] === fn) {
	        listeners.splice(i, 1);
	      }
	    }
	  },

	  setHash: function (s) {
	    // Mozilla always adds an entry to the history
	    if (this.mode === 'legacy') {
	      this.writeFrame(s);
	    }

	    if (this.history === true) {
	      window.history.pushState({}, document.title, s);
	      // Fire an onpopstate event manually since pushing does not obviously
	      // trigger the pop event.
	      this.fire();
	    } else {
	      dloc.hash = (s[0] === '/') ? s : '/' + s;
	    }
	    return this;
	  },

	  writeFrame: function (s) {
	    // IE support...
	    var f = document.getElementById('state-frame');
	    var d = f.contentDocument || f.contentWindow.document;
	    d.open();
	    d.write("<script>_hash = '" + s + "'; onload = parent.listener.syncHash;<script>");
	    d.close();
	  },

	  syncHash: function () {
	    // IE support...
	    var s = this._hash;
	    if (s != dloc.hash) {
	      dloc.hash = s;
	    }
	    return this;
	  },

	  onHashChanged: function () {}
	};

	var Router = exports.Router = function (routes) {
	  if (!(this instanceof Router)) return new Router(routes);

	  this.params   = {};
	  this.routes   = {};
	  this.methods  = ['on', 'once', 'after', 'before'];
	  this.scope    = [];
	  this._methods = {};

	  this._insert = this.insert;
	  this.insert = this.insertEx;

	  this.historySupport = (window.history != null ? window.history.pushState : null) != null

	  this.configure();
	  this.mount(routes || {});
	};

	Router.prototype.init = function (r) {
	  var self = this
	    , routeTo;
	  this.handler = function(onChangeEvent) {
	    var newURL = onChangeEvent && onChangeEvent.newURL || window.location.hash;
	    var url = self.history === true ? self.getPath() : newURL.replace(/.*#/, '');
	    self.dispatch('on', url.charAt(0) === '/' ? url : '/' + url);
	  };

	  listener.init(this.handler, this.history);

	  if (this.history === false) {
	    if (dlocHashEmpty() && r) {
	      dloc.hash = r;
	    } else if (!dlocHashEmpty()) {
	      self.dispatch('on', '/' + dloc.hash.replace(/^(#\/|#|\/)/, ''));
	    }
	  }
	  else {
	    if (this.convert_hash_in_init) {
	      // Use hash as route
	      routeTo = dlocHashEmpty() && r ? r : !dlocHashEmpty() ? dloc.hash.replace(/^#/, '') : null;
	      if (routeTo) {
	        window.history.replaceState({}, document.title, routeTo);
	      }
	    }
	    else {
	      // Use canonical url
	      routeTo = this.getPath();
	    }

	    // Router has been initialized, but due to the chrome bug it will not
	    // yet actually route HTML5 history state changes. Thus, decide if should route.
	    if (routeTo || this.run_in_init === true) {
	      this.handler();
	    }
	  }

	  return this;
	};

	Router.prototype.explode = function () {
	  var v = this.history === true ? this.getPath() : dloc.hash;
	  if (v.charAt(1) === '/') { v=v.slice(1) }
	  return v.slice(1, v.length).split("/");
	};

	Router.prototype.setRoute = function (i, v, val) {
	  var url = this.explode();

	  if (typeof i === 'number' && typeof v === 'string') {
	    url[i] = v;
	  }
	  else if (typeof val === 'string') {
	    url.splice(i, v, s);
	  }
	  else {
	    url = [i];
	  }

	  listener.setHash(url.join('/'));
	  return url;
	};

	//
	// ### function insertEx(method, path, route, parent)
	// #### @method {string} Method to insert the specific `route`.
	// #### @path {Array} Parsed path to insert the `route` at.
	// #### @route {Array|function} Route handlers to insert.
	// #### @parent {Object} **Optional** Parent "routes" to insert into.
	// insert a callback that will only occur once per the matched route.
	//
	Router.prototype.insertEx = function(method, path, route, parent) {
	  if (method === "once") {
	    method = "on";
	    route = function(route) {
	      var once = false;
	      return function() {
	        if (once) return;
	        once = true;
	        return route.apply(this, arguments);
	      };
	    }(route);
	  }
	  return this._insert(method, path, route, parent);
	};

	Router.prototype.getRoute = function (v) {
	  var ret = v;

	  if (typeof v === "number") {
	    ret = this.explode()[v];
	  }
	  else if (typeof v === "string"){
	    var h = this.explode();
	    ret = h.indexOf(v);
	  }
	  else {
	    ret = this.explode();
	  }

	  return ret;
	};

	Router.prototype.destroy = function () {
	  listener.destroy(this.handler);
	  return this;
	};

	Router.prototype.getPath = function () {
	  var path = window.location.pathname;
	  if (path.substr(0, 1) !== '/') {
	    path = '/' + path;
	  }
	  return path;
	};
	function _every(arr, iterator) {
	  for (var i = 0; i < arr.length; i += 1) {
	    if (iterator(arr[i], i, arr) === false) {
	      return;
	    }
	  }
	}

	function _flatten(arr) {
	  var flat = [];
	  for (var i = 0, n = arr.length; i < n; i++) {
	    flat = flat.concat(arr[i]);
	  }
	  return flat;
	}

	function _asyncEverySeries(arr, iterator, callback) {
	  if (!arr.length) {
	    return callback();
	  }
	  var completed = 0;
	  (function iterate() {
	    iterator(arr[completed], function(err) {
	      if (err || err === false) {
	        callback(err);
	        callback = function() {};
	      } else {
	        completed += 1;
	        if (completed === arr.length) {
	          callback();
	        } else {
	          iterate();
	        }
	      }
	    });
	  })();
	}

	function paramifyString(str, params, mod) {
	  mod = str;
	  for (var param in params) {
	    if (params.hasOwnProperty(param)) {
	      mod = params[param](str);
	      if (mod !== str) {
	        break;
	      }
	    }
	  }
	  return mod === str ? "([._a-zA-Z0-9-%()]+)" : mod;
	}

	function regifyString(str, params) {
	  var matches, last = 0, out = "";
	  while (matches = str.substr(last).match(/[^\w\d\- %@&]*\*[^\w\d\- %@&]*/)) {
	    last = matches.index + matches[0].length;
	    matches[0] = matches[0].replace(/^\*/, "([_.()!\\ %@&a-zA-Z0-9-]+)");
	    out += str.substr(0, matches.index) + matches[0];
	  }
	  str = out += str.substr(last);
	  var captures = str.match(/:([^\/]+)/ig), capture, length;
	  if (captures) {
	    length = captures.length;
	    for (var i = 0; i < length; i++) {
	      capture = captures[i];
	      if (capture.slice(0, 2) === "::") {
	        str = capture.slice(1);
	      } else {
	        str = str.replace(capture, paramifyString(capture, params));
	      }
	    }
	  }
	  return str;
	}

	function terminator(routes, delimiter, start, stop) {
	  var last = 0, left = 0, right = 0, start = (start || "(").toString(), stop = (stop || ")").toString(), i;
	  for (i = 0; i < routes.length; i++) {
	    var chunk = routes[i];
	    if (chunk.indexOf(start, last) > chunk.indexOf(stop, last) || ~chunk.indexOf(start, last) && !~chunk.indexOf(stop, last) || !~chunk.indexOf(start, last) && ~chunk.indexOf(stop, last)) {
	      left = chunk.indexOf(start, last);
	      right = chunk.indexOf(stop, last);
	      if (~left && !~right || !~left && ~right) {
	        var tmp = routes.slice(0, (i || 1) + 1).join(delimiter);
	        routes = [ tmp ].concat(routes.slice((i || 1) + 1));
	      }
	      last = (right > left ? right : left) + 1;
	      i = 0;
	    } else {
	      last = 0;
	    }
	  }
	  return routes;
	}

	var QUERY_SEPARATOR = /\?.*/;

	Router.prototype.configure = function(options) {
	  options = options || {};
	  for (var i = 0; i < this.methods.length; i++) {
	    this._methods[this.methods[i]] = true;
	  }
	  this.recurse = options.recurse || this.recurse || false;
	  this.async = options.async || false;
	  this.delimiter = options.delimiter || "/";
	  this.strict = typeof options.strict === "undefined" ? true : options.strict;
	  this.notfound = options.notfound;
	  this.resource = options.resource;
	  this.history = options.html5history && this.historySupport || false;
	  this.run_in_init = this.history === true && options.run_handler_in_init !== false;
	  this.convert_hash_in_init = this.history === true && options.convert_hash_in_init !== false;
	  this.every = {
	    after: options.after || null,
	    before: options.before || null,
	    on: options.on || null
	  };
	  return this;
	};

	Router.prototype.param = function(token, matcher) {
	  if (token[0] !== ":") {
	    token = ":" + token;
	  }
	  var compiled = new RegExp(token, "g");
	  this.params[token] = function(str) {
	    return str.replace(compiled, matcher.source || matcher);
	  };
	  return this;
	};

	Router.prototype.on = Router.prototype.route = function(method, path, route) {
	  var self = this;
	  if (!route && typeof path == "function") {
	    route = path;
	    path = method;
	    method = "on";
	  }
	  if (Array.isArray(path)) {
	    return path.forEach(function(p) {
	      self.on(method, p, route);
	    });
	  }
	  if (path.source) {
	    path = path.source.replace(/\\\//ig, "/");
	  }
	  if (Array.isArray(method)) {
	    return method.forEach(function(m) {
	      self.on(m.toLowerCase(), path, route);
	    });
	  }
	  path = path.split(new RegExp(this.delimiter));
	  path = terminator(path, this.delimiter);
	  this.insert(method, this.scope.concat(path), route);
	};

	Router.prototype.path = function(path, routesFn) {
	  var self = this, length = this.scope.length;
	  if (path.source) {
	    path = path.source.replace(/\\\//ig, "/");
	  }
	  path = path.split(new RegExp(this.delimiter));
	  path = terminator(path, this.delimiter);
	  this.scope = this.scope.concat(path);
	  routesFn.call(this, this);
	  this.scope.splice(length, path.length);
	};

	Router.prototype.dispatch = function(method, path, callback) {
	  var self = this, fns = this.traverse(method, path.replace(QUERY_SEPARATOR, ""), this.routes, ""), invoked = this._invoked, after;
	  this._invoked = true;
	  if (!fns || fns.length === 0) {
	    this.last = [];
	    if (typeof this.notfound === "function") {
	      this.invoke([ this.notfound ], {
	        method: method,
	        path: path
	      }, callback);
	    }
	    return false;
	  }
	  if (this.recurse === "forward") {
	    fns = fns.reverse();
	  }
	  function updateAndInvoke() {
	    self.last = fns.after;
	    self.invoke(self.runlist(fns), self, callback);
	  }
	  after = this.every && this.every.after ? [ this.every.after ].concat(this.last) : [ this.last ];
	  if (after && after.length > 0 && invoked) {
	    if (this.async) {
	      this.invoke(after, this, updateAndInvoke);
	    } else {
	      this.invoke(after, this);
	      updateAndInvoke();
	    }
	    return true;
	  }
	  updateAndInvoke();
	  return true;
	};

	Router.prototype.invoke = function(fns, thisArg, callback) {
	  var self = this;
	  var apply;
	  if (this.async) {
	    apply = function(fn, next) {
	      if (Array.isArray(fn)) {
	        return _asyncEverySeries(fn, apply, next);
	      } else if (typeof fn == "function") {
	        fn.apply(thisArg, (fns.captures || []).concat(next));
	      }
	    };
	    _asyncEverySeries(fns, apply, function() {
	      if (callback) {
	        callback.apply(thisArg, arguments);
	      }
	    });
	  } else {
	    apply = function(fn) {
	      if (Array.isArray(fn)) {
	        return _every(fn, apply);
	      } else if (typeof fn === "function") {
	        return fn.apply(thisArg, fns.captures || []);
	      } else if (typeof fn === "string" && self.resource) {
	        self.resource[fn].apply(thisArg, fns.captures || []);
	      }
	    };
	    _every(fns, apply);
	  }
	};

	Router.prototype.traverse = function(method, path, routes, regexp, filter) {
	  var fns = [], current, exact, match, next, that;
	  function filterRoutes(routes) {
	    if (!filter) {
	      return routes;
	    }
	    function deepCopy(source) {
	      var result = [];
	      for (var i = 0; i < source.length; i++) {
	        result[i] = Array.isArray(source[i]) ? deepCopy(source[i]) : source[i];
	      }
	      return result;
	    }
	    function applyFilter(fns) {
	      for (var i = fns.length - 1; i >= 0; i--) {
	        if (Array.isArray(fns[i])) {
	          applyFilter(fns[i]);
	          if (fns[i].length === 0) {
	            fns.splice(i, 1);
	          }
	        } else {
	          if (!filter(fns[i])) {
	            fns.splice(i, 1);
	          }
	        }
	      }
	    }
	    var newRoutes = deepCopy(routes);
	    newRoutes.matched = routes.matched;
	    newRoutes.captures = routes.captures;
	    newRoutes.after = routes.after.filter(filter);
	    applyFilter(newRoutes);
	    return newRoutes;
	  }
	  if (path === this.delimiter && routes[method]) {
	    next = [ [ routes.before, routes[method] ].filter(Boolean) ];
	    next.after = [ routes.after ].filter(Boolean);
	    next.matched = true;
	    next.captures = [];
	    return filterRoutes(next);
	  }
	  for (var r in routes) {
	    if (routes.hasOwnProperty(r) && (!this._methods[r] || this._methods[r] && typeof routes[r] === "object" && !Array.isArray(routes[r]))) {
	      current = exact = regexp + this.delimiter + r;
	      if (!this.strict) {
	        exact += "[" + this.delimiter + "]?";
	      }
	      match = path.match(new RegExp("^" + exact));
	      if (!match) {
	        continue;
	      }
	      if (match[0] && match[0] == path && routes[r][method]) {
	        next = [ [ routes[r].before, routes[r][method] ].filter(Boolean) ];
	        next.after = [ routes[r].after ].filter(Boolean);
	        next.matched = true;
	        next.captures = match.slice(1);
	        if (this.recurse && routes === this.routes) {
	          next.push([ routes.before, routes.on ].filter(Boolean));
	          next.after = next.after.concat([ routes.after ].filter(Boolean));
	        }
	        return filterRoutes(next);
	      }
	      next = this.traverse(method, path, routes[r], current);
	      if (next.matched) {
	        if (next.length > 0) {
	          fns = fns.concat(next);
	        }
	        if (this.recurse) {
	          fns.push([ routes[r].before, routes[r].on ].filter(Boolean));
	          next.after = next.after.concat([ routes[r].after ].filter(Boolean));
	          if (routes === this.routes) {
	            fns.push([ routes["before"], routes["on"] ].filter(Boolean));
	            next.after = next.after.concat([ routes["after"] ].filter(Boolean));
	          }
	        }
	        fns.matched = true;
	        fns.captures = next.captures;
	        fns.after = next.after;
	        return filterRoutes(fns);
	      }
	    }
	  }
	  return false;
	};

	Router.prototype.insert = function(method, path, route, parent) {
	  var methodType, parentType, isArray, nested, part;
	  path = path.filter(function(p) {
	    return p && p.length > 0;
	  });
	  parent = parent || this.routes;
	  part = path.shift();
	  if (/\:|\*/.test(part) && !/\\d|\\w/.test(part)) {
	    part = regifyString(part, this.params);
	  }
	  if (path.length > 0) {
	    parent[part] = parent[part] || {};
	    return this.insert(method, path, route, parent[part]);
	  }
	  if (!part && !path.length && parent === this.routes) {
	    methodType = typeof parent[method];
	    switch (methodType) {
	     case "function":
	      parent[method] = [ parent[method], route ];
	      return;
	     case "object":
	      parent[method].push(route);
	      return;
	     case "undefined":
	      parent[method] = route;
	      return;
	    }
	    return;
	  }
	  parentType = typeof parent[part];
	  isArray = Array.isArray(parent[part]);
	  if (parent[part] && !isArray && parentType == "object") {
	    methodType = typeof parent[part][method];
	    switch (methodType) {
	     case "function":
	      parent[part][method] = [ parent[part][method], route ];
	      return;
	     case "object":
	      parent[part][method].push(route);
	      return;
	     case "undefined":
	      parent[part][method] = route;
	      return;
	    }
	  } else if (parentType == "undefined") {
	    nested = {};
	    nested[method] = route;
	    parent[part] = nested;
	    return;
	  }
	  throw new Error("Invalid route context: " + parentType);
	};



	Router.prototype.extend = function(methods) {
	  var self = this, len = methods.length, i;
	  function extend(method) {
	    self._methods[method] = true;
	    self[method] = function() {
	      var extra = arguments.length === 1 ? [ method, "" ] : [ method ];
	      self.on.apply(self, extra.concat(Array.prototype.slice.call(arguments)));
	    };
	  }
	  for (i = 0; i < len; i++) {
	    extend(methods[i]);
	  }
	};

	Router.prototype.runlist = function(fns) {
	  var runlist = this.every && this.every.before ? [ this.every.before ].concat(_flatten(fns)) : _flatten(fns);
	  if (this.every && this.every.on) {
	    runlist.push(this.every.on);
	  }
	  runlist.captures = fns.captures;
	  runlist.source = fns.source;
	  return runlist;
	};

	Router.prototype.mount = function(routes, path) {
	  if (!routes || typeof routes !== "object" || Array.isArray(routes)) {
	    return;
	  }
	  var self = this;
	  path = path || [];
	  if (!Array.isArray(path)) {
	    path = path.split(self.delimiter);
	  }
	  function insertOrMount(route, local) {
	    var rename = route, parts = route.split(self.delimiter), routeType = typeof routes[route], isRoute = parts[0] === "" || !self._methods[parts[0]], event = isRoute ? "on" : rename;
	    if (isRoute) {
	      rename = rename.slice((rename.match(new RegExp("^" + self.delimiter)) || [ "" ])[0].length);
	      parts.shift();
	    }
	    if (isRoute && routeType === "object" && !Array.isArray(routes[route])) {
	      local = local.concat(parts);
	      self.mount(routes[route], local);
	      return;
	    }
	    if (isRoute) {
	      local = local.concat(rename.split(self.delimiter));
	      local = terminator(local, self.delimiter);
	    }
	    self.insert(event, local, routes[route]);
	  }
	  for (var route in routes) {
	    if (routes.hasOwnProperty(route)) {
	      insertOrMount(route, path.slice(0));
	    }
	  }
	};



	}( true ? exports : window));

/***/ }
/******/ ]);