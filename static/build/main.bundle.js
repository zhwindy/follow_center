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

	var Vue, router, routes, v_messages;

	__webpack_require__(1);

	Vue = __webpack_require__(5);

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
	    'follow': __webpack_require__(73),
	    'simditor': __webpack_require__(78),
	    'twitter': __webpack_require__(84),
	    'github': __webpack_require__(89),
	    'instagram': __webpack_require__(93),
	    'user_info': __webpack_require__(97),
	    'god_list': __webpack_require__(101),
	    'add_god': __webpack_require__(109)
	  },
	  directives: {
	    'btn-loading': __webpack_require__(113)
	  }
	});

	routes = {
	  '/god/:god_name': v_messages.mainGod,
	  '/': v_messages.main
	};

	router = Router(routes);

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
/***/ function(module, exports) {

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
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */,
/* 32 */,
/* 33 */,
/* 34 */,
/* 35 */,
/* 36 */,
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */,
/* 41 */,
/* 42 */,
/* 43 */,
/* 44 */,
/* 45 */,
/* 46 */,
/* 47 */,
/* 48 */,
/* 49 */,
/* 50 */,
/* 51 */,
/* 52 */,
/* 53 */,
/* 54 */,
/* 55 */,
/* 56 */,
/* 57 */,
/* 58 */,
/* 59 */,
/* 60 */,
/* 61 */,
/* 62 */,
/* 63 */,
/* 64 */,
/* 65 */,
/* 66 */,
/* 67 */,
/* 68 */,
/* 69 */,
/* 70 */,
/* 71 */,
/* 72 */,
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	var bz;

	__webpack_require__(74);

	bz = __webpack_require__(76);

	module.exports = {
	  template: __webpack_require__(77),
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
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(75);
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
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, ".yellow {\n  color: #F39C12;\n}\n", ""]);

	// exports


/***/ },
/* 76 */
/***/ function(module, exports) {

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
	    var _hash, _hashItem, _hashStr, _hashs, i, len1;
	    _hashStr = window.location.hash.replace('#', '');
	    if (!_hashStr || _hashStr === "") {
	      return void 0;
	    }
	    _hashs = _hashStr.split(";");
	    for (i = 0, len1 = _hashs.length; i < len1; i++) {
	      _hashItem = _hashs[i];
	      _hash = _hashItem.split("=");
	      if (key === _hash[0]) {
	        return _hash[1];
	      }
	    }
	    return void 0;
	  },
	  setHashPram: function(key, value) {
	    var _hash, _hashItem, _hashStr, _hashs, _newHashStr, i, len1;
	    _hashStr = window.location.hash.replace('#', '');
	    if (!window.bz.getHashPram(key) && value) {
	      return window.location.hash = _hashStr + key + "=" + value + ";";
	    } else {
	      _hashs = _hashStr.split(";");
	      _newHashStr = "";
	      for (i = 0, len1 = _hashs.length; i < len1; i++) {
	        _hashItem = _hashs[i];
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
/* 77 */
/***/ function(module, exports) {

	module.exports = "<button v-btn-loading=\"btn_loading\" v-on=\"click:toggleFollow\" type=\"button\" class=\"btn btn-sm\" aria-label=\"Left Align\">\n</button>\n";

/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	var bz;

	__webpack_require__(79);

	bz = __webpack_require__(76);

	module.exports = {
	  template: __webpack_require__(83),
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
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(80);
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
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, ".simditor .simditor-body {\n  min-height: 2em !important;\n}\n", ""]);

	// exports


/***/ },
/* 81 */,
/* 82 */,
/* 83 */
/***/ function(module, exports) {

	module.exports = "<textarea placeholder=\"\"></textarea>\n";

/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	var autoLink, bz,
	  slice = [].slice;

	__webpack_require__(85);

	bz = __webpack_require__(76);

	autoLink = function() {
	  var k, linkAttributes, option, options, pattern, v;
	  options = 1 <= arguments.length ? slice.call(arguments, 0) : [];
	  pattern = /(^|[\s\n]|<br\/?>)((?:https?|ftp):\/\/[\-A-Z0-9+\u0026\u2019@#\/%?=()~_|!:,.;]*[\-A-Z0-9+\u0026@#\/%=~()_|])/gi;
	  if (!(options.length > 0)) {
	    return this.replace(pattern, "$1<a href='$2'>$2</a>");
	  }
	  option = options[0];
	  linkAttributes = ((function() {
	    var results;
	    results = [];
	    for (k in option) {
	      v = option[k];
	      if (k !== 'callback') {
	        results.push(" " + k + "='" + v + "'");
	      }
	    }
	    return results;
	  })()).join('');
	  return this.replace(pattern, function(match, space, url) {
	    var link;
	    link = (typeof option.callback === "function" ? option.callback(url) : void 0) || ("<a href='" + url + "'" + linkAttributes + ">" + url + "</a>");
	    return "" + space + link;
	  });
	};

	String.prototype['autoLink'] = autoLink;

	module.exports = {
	  template: __webpack_require__(88),
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
	      return this.message.text.autoLink({
	        target: "_blank",
	        rel: "外部链接,请谨慎打开"
	      });
	    }
	  }
	};


/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(86);
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
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, ".name {\n  margin-right: 50px;\n  margin-left: 0;\n  position: relative;\n  padding: 5px 10px;\n  margin: 5px 0 0 40px;\n  display: block;\n}\n.form-lable {\n  text-align: left;\n  font-weight: normal;\n}\n.min-form-lable {\n  text-align: left;\n  font-weight: normal;\n  padding-right: 0px;\n}\n.form-horizontal .control-label {\n  text-align: left;\n  font-weight: normal;\n}\n.round-icon {\n  border-radius: 100%;\n  padding: 4px;\n  color: #fff;\n  width: 24px;\n  height: 24px;\n  line-height: 17px;\n  display: inline-block;\n  font-size: 14px;\n  text-align: center;\n}\n.bg-icon-red {\n  background: #a33950;\n}\n.bg-icon-blue {\n  background: #3c83c5;\n}\n.bg-icon-orange {\n  background: #cd7020;\n}\n.bg-icon-black {\n  background: #000;\n}\n.bg-icon-green {\n  background: #33b332;\n}\n.round-icon:hover {\n  font-size: 17px;\n}\n@media screen and (max-width: 768px) {\n  #user_info {\n    display: none;\n  }\n}\n.my-img-responsive {\n  display: block;\n  max-width: 100%;\n}\n", ""]);

	// exports


/***/ },
/* 87 */,
/* 88 */
/***/ function(module, exports) {

	module.exports = "<div id=\"twitter_(%message.id%)\" class=\"box box-solid item\">\n    <div class=\"box-header\">\n        <h2 class=\"box-title\">\n            <a href=\"#/god/(%message.user_name%)\">\n                <img v-attr=\"src:avatar\" class=\"direct-chat-img\">\n                <div class=\"name\">\n                    (%message.name%)\n                </div>\n            </a>\n        </h2>\n        <div class=\"box-tools pull-right\">\n            <a class=\"a-icon\" target=\"_blank\" href=\"(%message.href%)\">\n                <span class=\"round-icon bg-icon-blue\">\n                    <i class=\"fa fa-twitter\"></i>\n                </span>\n            </a>\n            <a href=\"/message?t=(%message.m_type%)&id=(%message.id%)\">\n                <sub v-time-len=\"message.created_at\"></sub>\n            </a>\n        </div>\n    </div>\n    <div class=\"box-body\">\n        <p class=\"description_bz\" v-html=\"text\"></p>\n        <template v-repeat=\"media:medias\">\n            <img v-attr=\"src:media.img_url, height:media.height\" class=\"my-img-responsive\" >\n            <br>\n        </template>\n    </div>\n</div>\n";

/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	var bz;

	__webpack_require__(90);

	bz = __webpack_require__(76);

	module.exports = {
	  template: __webpack_require__(92),
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
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(91);
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
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 92 */
/***/ function(module, exports) {

	module.exports = "<div id=\"github_(%message.id%)\" class=\"box box-solid item\">\n    <div class=\"box-header\">\n        <h2 class=\"box-title\">\n            <a href=\"#/god/(%message.user_name%)\">\n                <img v-attr=\"src:avatar\" class=\"direct-chat-img\">\n                <div class=\"name\">\n                    (%message.name%)\n                </div>\n            </a>\n        </h2>\n        <div class=\"box-tools pull-right\">\n            <a class=\"a-icon\" target=\"_blank\" href=\"(%repo_url%)\">\n                <span class=\"round-icon bg-icon-black\">\n                    <i class=\"fa fa-github\"></i>\n                </span>\n            </a>\n            <a href=\"/message?t=(%message.m_type%)&id=(%message.id%)\">\n                <sub v-time-len=\"message.created_at\"></sub>\n            </a>\n        </div>\n    </div>\n    <div class=\"box-body\">\n        (%type%) <a href='(%repo_url%)' target='_blank'>(%repo_name%)</a>\n        <li v-repeat=\"commits\">\n            <a target=\"_blank\" href=\"(%url.replace('api.github.com/repos', 'github.com')%)\">\n                (%message%)\n            </a>\n        </li>\n        <p v-html=\"issue_comment_link\">\n        </p>\n        <p v-show=\"issue_comment_body\" class='description_bz'>\n        (%issue_comment_body%)\n        </p>\n    </div>\n</div>\n";

/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	var bz;

	__webpack_require__(94);

	bz = __webpack_require__(76);

	module.exports = {
	  template: __webpack_require__(96),
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
/* 94 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(95);
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
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 96 */
/***/ function(module, exports) {

	module.exports = "<div id=\"instagram_(%message.id%)\" class=\"box box-solid item\">\n    <div class=\"box-header\">\n        <h2 class=\"box-title\">\n            <a href=\"#/god/(%message.user_name%)\">\n                <img v-attr=\"src:avatar\" class=\"direct-chat-img\">\n                <div class=\"name\">\n                    (%message.name%)\n                </div>\n            </a>\n        </h2>\n        <div class=\"box-tools pull-right\">\n            <a class=\"a-icon\" target=\"_blank\" href=\"(%message.href%)\">\n                <span class=\"round-icon bg-icon-orange\">\n                    <i class=\"fa fa-instagram\"></i>\n                </span>\n            </a>\n            <a href=\"/message?t=(%message.m_type%)&id=(%message.id%)\">\n                <sub v-time-len=\"message.created_at\"></sub>\n            </a>\n        </div>\n    </div>\n    <div class=\"box-body\">\n        <p class=\"description_bz\">(%message.text%)</p>\n        <br>\n        <img v-attr=\"src:img_url,height:height\" class=\"my-img-responsive\">\n    </div>\n</div>\n";

/***/ },
/* 97 */
/***/ function(module, exports, __webpack_require__) {

	var bz;

	__webpack_require__(98);

	bz = __webpack_require__(76);

	module.exports = {
	  template: __webpack_require__(100),
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
/* 98 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(99);
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
/* 99 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 100 */
/***/ function(module, exports) {

	module.exports = "<div class=\"fixed\" v-show=\"user_info\" v-transition=\"fade\">\n    <h3 class=\"box-title text-center\">(%user_info.user_name%)</h3>\n    <input v-disable=\"disable_edit\" id=\"profile-image-upload\" class=\"hide\" type=\"file\" v-on=\"change:previewImg\" accept=\"image/*\"/>\n    <a v-on=\"click:changeImg\" href=\"javascript:void(0)\">\n        <img v-attr=\"src:avatar\" id=\"profile-image\" class=\"img-responsive center-block avatar\" />\n    </a>\n    <div class=\"text-center\">\n        <sub v-show=\"!disable_edit\" >点击更换头像</sub>\n    </div>\n    <div v-html=\"user_info.slogan\">\n    </div>\n    <br>\n    <hr>\n    <form class=\"form-horizontal\">\n        <div class=\"form-group\">\n            <label for=\"user_name\" class=\"col-sm-3 control-label min-form-lable\">用户名</label>\n            <div class=\"col-sm-9\">\n                <input v-disable=\"disable_edit\" type=\"text\"  class=\"form-control\" id=\"user_name\" v-model=\"user_info.user_name\">\n            </div>\n        </div>\n        <div class=\"form-group\">\n            <label for=\"blog\" class=\"col-sm-3 control-label min-form-lable\">个人博客</label>\n            <div class=\"col-sm-9\">\n                <input v-disable=\"disable_edit\" type=\"text\"  class=\"form-control editable\" id=\"blog\" placeholder=\"\"  v-model=\"user_info.blog\"  v-on=\"focus:autoInsert('blog')\">\n            </div>\n        </div>\n        <div v-show=\"!disable_edit\" class=\"form-group\" id=\"slogan-group\">\n            <label for=\"editor\" class=\"col-sm-3 control-label min-form-lable\">个性签名</label>\n            <div class=\"col-sm-9\">\n                <simditor content=\"(%@ user_info.slogan%)\"></simditor>\n            </div>\n        </div>\n        <hr>\n        <div class=\"form-group\">\n            <a href=\"https://twitter.com/(%user_info.twitter%)\" target=\"_blank\">\n                <label class=\"col-sm-5 control-label\">\n                    <span class=\"round-icon bg-icon-blue\">\n                        <i class=\"fa fa-twitter\"></i>\n                    </span>\n                    Twitter\n                </label>\n            </a>\n            <div class=\"col-sm-7\">\n                <input v-disable=\"disable_edit\" type=\"text\" class=\"form-control editable\" id=\"twitter\" placeholder=\"\"   v-model=\"user_info.twitter\" v-on=\"focus:autoInsert('twitter', user_info.user_name)\">\n            </div>\n        </div>\n        <div class=\"form-group\">\n            <a href=\"https://github.com/(%user_info.github%)\" target=\"_blank\">\n                <label class=\"col-sm-5 control-label\"><span class=\"round-icon bg-icon-black\"><i class=\"fa fa-github\"></i></span> Github</label>\n            </a>\n            <div class=\"col-sm-7\">\n                <input v-disable=\"disable_edit\" type=\"text\" class=\"form-control editable\" placeholder=\"\"  v-model=\"user_info.github\" v-on=\"focus:autoInsert('github', user_info.user_name)\">\n            </div>\n        </div>\n        <div class=\"form-group\">\n            <a href=\"https://instagram.com/(%user_info.instagram%)\" target=\"_blank\">\n                <label class=\"col-sm-5 control-label\"><span class=\"round-icon bg-icon-orange\"><i class=\"fa fa-instagram\"></i></span> Instagram</label>\n            </a>\n            <div class=\"col-sm-7\">\n                <input v-disable=\"disable_edit\" type=\"text\" class=\"form-control editable\" placeholder=\"\"  v-model=\"user_info.instagram\" v-on=\"focus:autoInsert('instagram', user_info.user_name)\">\n            </div>\n        </div>\n    </form>\n    <div class=\"text-center\">\n        <follow followed=\"(%@ user_info.followed%)\" god_id=\"(%user_info.god_id%)\"></follow>\n        <button id=\"btn-edit\" v-btn-loading=\"loading\" type=\"submit\" class=\"btn btn-primary btn-flat btn-border\" v-on=\"click:save\">编辑</button>\n    </div>\n    <hr>\n</div>\n";

/***/ },
/* 101 */
/***/ function(module, exports, __webpack_require__) {

	var bz;

	__webpack_require__(102);

	bz = __webpack_require__(76);

	module.exports = {
	  template: __webpack_require__(104),
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
	    'god': __webpack_require__(105)
	  }
	};


/***/ },
/* 102 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(103);
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
/* 103 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 104 */
/***/ function(module, exports) {

	module.exports = "<god v-repeat=\"god in gods\" v-transition=\"fade\"></god>\n";

/***/ },
/* 105 */
/***/ function(module, exports, __webpack_require__) {

	var bz;

	__webpack_require__(106);

	bz = __webpack_require__(76);

	module.exports = {
	  template: __webpack_require__(108),
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
/* 106 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(107);
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
/* 107 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 108 */
/***/ function(module, exports) {

	module.exports = "<div  class=\"box box-solid item\">\n    <div class=\"box-header\">\n        <h3 class=\"box-title\">\n            <a href=\"/#/god/(%god.user_name%)\">\n                <img v-attr=\"src:avatar\" class=\"direct-chat-img\">\n                <div class=\"name\">\n                    (%god.user_name%)\n                </div>\n            </a>\n        </h3>\n        <div class=\"box-tools pull-right\" v-html=\"all_link\">\n        </div>\n    </div>\n    <div class=\"box-body\" v-html=\"description\">\n    </div>\n    <div class=\"box-footer\">\n        <follow followed=\"(%god.followed%)\" god_id=\"(%god.god_id%)\"></follow>\n    </div>\n</div>\n";

/***/ },
/* 109 */
/***/ function(module, exports, __webpack_require__) {

	var bz;

	__webpack_require__(110);

	bz = __webpack_require__(76);

	module.exports = {
	  template: __webpack_require__(112),
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
/* 110 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(111);
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
/* 111 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 112 */
/***/ function(module, exports) {

	module.exports = "<a v-on=\"click:pop\" class=\"btn btn-defalt\" data-toggle=\"modal\" data-target=\"#god_input\">添加</a>\n<div id=\"god_input\" class=\"modal fade\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"exampleModalLabel\">\n    <div class=\"modal-dialog\" role=\"document\">\n        <div class=\"modal-content\">\n            <div class=\"modal-header\">\n                <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>\n                <h4 class=\"modal-title\" id=\"exampleModalLabel\">添加一个新的牛人</h4>\n            </div>\n            <div class=\"modal-body\">\n                <form>\n                    <div class=\"form-group\">\n                        <label for=\"recipient-name\" class=\"control-label\">用户名:</label>\n                        <input v-model=\"user_name\" type=\"text\" class=\"form-control\" id=\"recipient-name\">\n                    </div>\n                    <div class=\"form-group\">\n                        <label for=\"message-text\" class=\"control-label\">描述:</label>\n                        <simditor content=\"(%@ slogan%)\"></simditor>\n                    </div>\n                </form>\n            </div>\n            <div class=\"modal-footer\">\n                <button v-btn-loading=\"btn_loading\" v-on=\"click:addGod\" type=\"button\" class=\"btn btn-sm btn-default\" data-dismiss=\"modal\">加好了</button>\n            </div>\n        </div>\n    </div>\n</div>\n";

/***/ },
/* 113 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(114);

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
/* 114 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(115);
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
/* 115 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ }
/******/ ]);