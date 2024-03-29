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

	var App, Vue, VueRouter, router;

	__webpack_require__(56);

	Vue = __webpack_require__(1);

	App = Vue.extend({});

	VueRouter = __webpack_require__(58);

	router = new VueRouter();

	router.map({
	  '/': {
	    component: __webpack_require__(2)
	  },
	  '/god/:god_name': {
	    component: __webpack_require__(85)
	  }
	});

	router.start(App, '#app');


/***/ },
/* 1 */
/***/ function(module, exports) {

	Vue.config.debug = true;

	Vue.config.silent = false;

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
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(3);

	module.exports = {
	  template: __webpack_require__(7),
	  components: {
	    'messages': __webpack_require__(8),
	    'user_info': __webpack_require__(35),
	    'god_list': __webpack_require__(42),
	    'add_god': __webpack_require__(50)
	  }
	};


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(4);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(6)(content, {});
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
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(5)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 5 */
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
/* 6 */
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
/* 7 */
/***/ function(module, exports) {

	module.exports = "<div  class=\"col-md-8\">\n    <messages></messages>\n</div>\n<div class=\"col-md-4\">\n    <div class=\"text-center\">\n        <add_god></add_god>\n    </div>\n    <god_list></god_list>\n</div>\n";

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(9);

	module.exports = {
	  data: function() {
	    return {
	      new_loading: false,
	      old_loading: false,
	      error_info: '',
	      messages: [],
	      last_message: null
	    };
	  },
	  ready: function() {
	    this["new"]();
	    return this.bindScroll();
	  },
	  template: __webpack_require__(11),
	  components: {
	    'twitter': __webpack_require__(12),
	    'github': __webpack_require__(20),
	    'instagram': __webpack_require__(24),
	    'tumblr': __webpack_require__(28)
	  },
	  directives: {
	    'btn-loading': __webpack_require__(32)
	  },
	  methods: {
	    "new": function() {
	      if (this.new_loading) {
	        return;
	      }
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
	                _this.old();
	              }
	            }
	            return _this.new_loading = false;
	          };
	        })(this)
	      });
	    },
	    old: function() {
	      var parm;
	      if (this.old_loading) {
	        return;
	      }
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
	    getLastMessageEl: function() {
	      var el;
	      if (this.$.c_messages.length !== 0) {
	        el = this.$.c_messages[0].$el;
	      } else {
	        el = null;
	      }
	      return el;
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
	    bindScroll: function() {
	      var messages_element, top, v;
	      v = this;
	      messages_element = $(v.$el.parentElement);
	      top = messages_element.offset().top;
	      return $(window).scroll(function() {
	        if ($(this).scrollTop() === 0) {
	          null;
	        } else if ((messages_element.height() + top - $(this).scrollTop() - $(this).height()) <= 0) {
	          if (v.new_loading === false) {
	            v["new"]();
	          }
	        }
	        return messages_element.children('.box').each(function() {
	          var message, message_position, scroll_bottom;
	          message_position = $(this).offset().top + $(this).height();
	          scroll_bottom = $(window).scrollTop() + $(window).height();
	          message_position = parseInt(message_position / 10);
	          scroll_bottom = parseInt(scroll_bottom / 10);
	          if (message_position === scroll_bottom) {
	            message = $(this)[0].__vue__.message;
	            if (v.last_message === null || v.last_message.created_at < message.created_at) {
	              console.log('saveLast:' + message.id);
	              v.saveLast(message);
	            }
	            return false;
	          }
	        });
	      });
	    }
	  }
	};


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(10);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(6)(content, {});
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
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(5)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = "<div v-show=\"messages.length != 0 \" class=\"text-center\">\n    <a v-on=\"click:old\" v-btn-loading=\"old_loading\" href='javascript:void(0);' class=\"btn btn-defalt\">历史消息</a>\n</div>\n<component is=\"(%message.m_type%)\" keep-alive v-repeat=\"message in messages\" v-ref=\"c_messages\" v-transition=\"fade\">\n</component>\n<div class=\"text-center\">\n    <a v-on=\"click:new\" v-btn-loading=\"new_loading\" href='javascript:void(0);' class=\"btn btn-defalt\"></a>\n</div>\n";

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var autoLink, bz,
	  slice = [].slice;

	__webpack_require__(13);

	bz = __webpack_require__(15);

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
	  template: __webpack_require__(16),
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
	  },
	  directives: {
	    'time-len': __webpack_require__(17)
	  }
	};


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(14);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(6)(content, {});
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
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(5)();
	// imports


	// module
	exports.push([module.id, ".name {\n  margin-right: 50px;\n  margin-left: 0;\n  position: relative;\n  padding: 5px 10px;\n  margin: 5px 0 0 40px;\n  display: block;\n}\n.form-lable {\n  text-align: left;\n  font-weight: normal;\n}\n.min-form-lable {\n  text-align: left;\n  font-weight: normal;\n  padding-right: 0px;\n}\n.form-horizontal .control-label {\n  text-align: left;\n  font-weight: normal;\n}\n.round-icon {\n  border-radius: 100%;\n  padding: 4px;\n  color: #fff;\n  width: 24px;\n  height: 24px;\n  line-height: 17px;\n  display: inline-block;\n  font-size: 14px;\n  text-align: center;\n}\n.bg-icon-red {\n  background: #a33950;\n}\n.bg-icon-blue {\n  background: #3c83c5;\n}\n.bg-icon-orange {\n  background: #cd7020;\n}\n.bg-icon-black {\n  background: #000;\n}\n.bg-icon-green {\n  background: #33b332;\n}\n.round-icon:hover {\n  font-size: 17px;\n}\n@media screen and (max-width: 768px) {\n  #user_info {\n    display: none;\n  }\n}\n.my-img-responsive {\n  display: block;\n  max-width: 100%;\n}\n", ""]);

	// exports


/***/ },
/* 15 */
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
	    var border, img_border, max_width, message_width, real_height, window_width;
	    window_width = $(window).width();
	    border = 15 * 2;
	    if (window_width <= 768) {
	      message_width = window_width - border;
	    }
	    if ((768 < window_width && window_width < 992)) {
	      message_width = 750 - border;
	    }
	    if ((992 <= window_width && window_width < 1200)) {
	      message_width = 970 * (8 / 12) - border;
	    }
	    if (window_width >= 1200) {
	      message_width = 1170 * (8 / 12) - border;
	    }
	    img_border = 20;
	    max_width = message_width - img_border;
	    real_height = window.bz.calculateHeight(img_height, img_width, max_width);
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
/* 16 */
/***/ function(module, exports) {

	module.exports = "<div id=\"twitter_(%message.id%)\" class=\"box box-solid item\">\n    <div class=\"box-header\">\n        <h2 class=\"box-title\">\n            <a href=\"#/god/(%message.user_name%)\">\n                <img v-attr=\"src:avatar\" class=\"direct-chat-img\">\n                <div class=\"name\">\n                    (%message.name%)\n                </div>\n            </a>\n        </h2>\n        <div class=\"box-tools pull-right\">\n            <a class=\"a-icon\" target=\"_blank\" href=\"(%message.href%)\">\n                <span class=\"round-icon bg-icon-blue\">\n                    <i class=\"fa fa-twitter\"></i>\n                </span>\n            </a>\n            <a href=\"/message?t=(%message.m_type%)&id=(%message.id%)\">\n                <sub v-time-len=\"message.created_at\"></sub>\n            </a>\n        </div>\n    </div>\n    <div class=\"box-body\">\n        <p class=\"description_bz\" v-html=\"text\"></p>\n        <template v-repeat=\"media:medias\">\n            <img v-attr=\"src:media.img_url, height:media.height\" class=\"my-img-responsive\" >\n            <br>\n        </template>\n    </div>\n</div>\n";

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var bz;

	__webpack_require__(18);

	bz = __webpack_require__(15);

	module.exports = {
	  bind: function() {},
	  update: function(new_value, old_value) {
	    var date_str, el;
	    if (new_value) {
	      el = $(this.el);
	      date_str = bz.timeLen(new_value);
	      return el.html(date_str);
	    }
	  },
	  unbind: function() {}
	};


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(19);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(6)(content, {});
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
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(5)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var bz;

	__webpack_require__(21);

	bz = __webpack_require__(15);

	module.exports = {
	  template: __webpack_require__(23),
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
	  },
	  directives: {
	    'time-len': __webpack_require__(17)
	  }
	};


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(22);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(6)(content, {});
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
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(5)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 23 */
/***/ function(module, exports) {

	module.exports = "<div id=\"github_(%message.id%)\" class=\"box box-solid item\">\n    <div class=\"box-header\">\n        <h2 class=\"box-title\">\n            <a href=\"#/god/(%message.user_name%)\">\n                <img v-attr=\"src:avatar\" class=\"direct-chat-img\">\n                <div class=\"name\">\n                    (%message.name%)\n                </div>\n            </a>\n        </h2>\n        <div class=\"box-tools pull-right\">\n            <a class=\"a-icon\" target=\"_blank\" href=\"(%repo_url%)\">\n                <span class=\"round-icon bg-icon-black\">\n                    <i class=\"fa fa-github\"></i>\n                </span>\n            </a>\n            <a href=\"/message?t=(%message.m_type%)&id=(%message.id%)\">\n                <sub v-time-len=\"message.created_at\"></sub>\n            </a>\n        </div>\n    </div>\n    <div class=\"box-body\">\n        (%type%) <a href='(%repo_url%)' target='_blank'>(%repo_name%)</a>\n        <li v-repeat=\"commits\">\n            <a target=\"_blank\" href=\"(%url.replace('api.github.com/repos', 'github.com')%)\">\n                (%message%)\n            </a>\n        </li>\n        <p v-html=\"issue_comment_link\">\n        </p>\n        <p v-show=\"issue_comment_body\" class='description_bz'>\n        (%issue_comment_body%)\n        </p>\n    </div>\n</div>\n";

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var bz;

	__webpack_require__(25);

	bz = __webpack_require__(15);

	module.exports = {
	  template: __webpack_require__(27),
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
	      var img_height, img_width, real_height;
	      img_height = this.message.extended_entities.height;
	      img_width = this.message.extended_entities.width;
	      real_height = bz.getFitHeight(img_height, img_width);
	      return real_height;
	    }
	  },
	  directives: {
	    'time-len': __webpack_require__(17)
	  }
	};


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(26);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(6)(content, {});
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
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(5)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 27 */
/***/ function(module, exports) {

	module.exports = "<div id=\"instagram_(%message.id%)\" class=\"box box-solid item\">\n    <div class=\"box-header\">\n        <h2 class=\"box-title\">\n            <a href=\"#/god/(%message.user_name%)\">\n                <img v-attr=\"src:avatar\" class=\"direct-chat-img\">\n                <div class=\"name\">\n                    (%message.name%)\n                </div>\n            </a>\n        </h2>\n        <div class=\"box-tools pull-right\">\n            <a class=\"a-icon\" target=\"_blank\" href=\"(%message.href%)\">\n                <span class=\"round-icon bg-icon-orange\">\n                    <i class=\"fa fa-instagram\"></i>\n                </span>\n            </a>\n            <a href=\"/message?t=(%message.m_type%)&id=(%message.id%)\">\n                <sub v-time-len=\"message.created_at\"></sub>\n            </a>\n        </div>\n    </div>\n    <div class=\"box-body\">\n        <p class=\"description_bz\">(%message.text%)</p>\n        <br>\n        <img v-attr=\"src:img_url,height:height\" class=\"my-img-responsive\">\n    </div>\n</div>\n";

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	var autoLink, bz,
	  slice = [].slice;

	__webpack_require__(29);

	bz = __webpack_require__(15);

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
	  template: __webpack_require__(31),
	  props: ['message'],
	  computed: {
	    avatar: function() {
	      var avatar;
	      avatar = btoa(btoa(this.message.avatar));
	      return '/sp/' + avatar;
	    },
	    medias: function() {
	      if (this.message.extended_entities) {
	        return _.map(this.message.extended_entities, function(d) {
	          var caption, height, img_height, img_url, img_width, t;
	          img_url = '/sp/' + btoa(btoa(d.original_size.url));
	          img_url = d.original_size.url;
	          img_height = d.original_size.height;
	          img_width = d.original_size.width;
	          caption = d.caption;
	          height = bz.getFitHeight(img_height, img_width);
	          t = {
	            img_url: img_url,
	            height: height,
	            caption: caption
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
	  },
	  directives: {
	    'time-len': __webpack_require__(17)
	  }
	};


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(30);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(6)(content, {});
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
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(5)();
	// imports


	// module
	exports.push([module.id, ".name {\n  margin-right: 50px;\n  margin-left: 0;\n  position: relative;\n  padding: 5px 10px;\n  margin: 5px 0 0 40px;\n  display: block;\n}\n.form-lable {\n  text-align: left;\n  font-weight: normal;\n}\n.min-form-lable {\n  text-align: left;\n  font-weight: normal;\n  padding-right: 0px;\n}\n.form-horizontal .control-label {\n  text-align: left;\n  font-weight: normal;\n}\n.round-icon {\n  border-radius: 100%;\n  padding: 4px;\n  color: #fff;\n  width: 24px;\n  height: 24px;\n  line-height: 17px;\n  display: inline-block;\n  font-size: 14px;\n  text-align: center;\n}\n.bg-icon-red {\n  background: #a33950;\n}\n.bg-icon-blue {\n  background: #3c83c5;\n}\n.bg-icon-orange {\n  background: #cd7020;\n}\n.bg-icon-black {\n  background: #000;\n}\n.bg-icon-green {\n  background: #33b332;\n}\n.round-icon:hover {\n  font-size: 17px;\n}\n@media screen and (max-width: 768px) {\n  #user_info {\n    display: none;\n  }\n}\n.my-img-responsive {\n  display: block;\n  max-width: 100%;\n}\n", ""]);

	// exports


/***/ },
/* 31 */
/***/ function(module, exports) {

	module.exports = "<div id=\"tumblr_(%message.id%)\" class=\"box box-solid item\">\n    <div class=\"box-header\">\n        <h2 class=\"box-title\">\n            <a href=\"#/god/(%message.user_name%)\">\n                <img v-attr=\"src:avatar\" class=\"direct-chat-img\">\n                <div class=\"name\">\n                    (%message.name%)\n                </div>\n            </a>\n        </h2>\n        <div class=\"box-tools pull-right\">\n            <a class=\"a-icon\" target=\"_blank\" href=\"(%message.href%)\">\n                <span class=\"round-icon bg-icon-dark-blue\">\n                    <i class=\"fa fa-tumblr\"></i>\n                </span>\n            </a>\n            <a href=\"/message?t=(%message.m_type%)&id=(%message.id%)\">\n                <sub v-time-len=\"message.created_at\"></sub>\n            </a>\n        </div>\n    </div>\n    <div class=\"box-body\">\n        <p class=\"description_bz\" v-html=\"text\"></p>\n        <template v-repeat=\"media:medias\">\n            <p class=\"description_bz\" v-html=\"media.caption\"></p>\n            <img v-attr=\"src:media.img_url, height:media.height\" class=\"my-img-responsive\" >\n            <br>\n        </template>\n    </div>\n</div>\n";

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(33);

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
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(34);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(6)(content, {});
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
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(5)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	var bz;

	__webpack_require__(36);

	bz = __webpack_require__(15);

	module.exports = {
	  template: __webpack_require__(38),
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
	  },
	  directives: {
	    disable: __webpack_require__(39),
	    'btn-loading': __webpack_require__(32)
	  },
	  components: {
	    'follow': __webpack_require__(89)
	  }
	};


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(37);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(6)(content, {});
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
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(5)();
	// imports


	// module
	exports.push([module.id, ".bg-icon-dark-blue {\n  background: #36465D;\n}\n", ""]);

	// exports


/***/ },
/* 38 */
/***/ function(module, exports) {

	module.exports = "<div class=\"fixed\" v-show=\"user_info\" v-transition=\"fade\">\n    <h3 class=\"box-title text-center\">(%user_info.user_name%)</h3>\n    <input v-disable=\"disable_edit\" id=\"profile-image-upload\" class=\"hide\" type=\"file\" v-on=\"change:previewImg\" accept=\"image/*\"/>\n    <a v-on=\"click:changeImg\" href=\"javascript:void(0)\">\n        <img v-attr=\"src:avatar\" id=\"profile-image\" class=\"img-responsive center-block avatar\" />\n    </a>\n    <div class=\"text-center\">\n        <sub v-show=\"!disable_edit\" >点击更换头像</sub>\n    </div>\n    <div v-html=\"user_info.slogan\">\n    </div>\n    <br>\n    <hr>\n    <form class=\"form-horizontal\">\n        <div class=\"form-group\">\n            <label for=\"user_name\" class=\"col-sm-3 control-label min-form-lable\">用户名</label>\n            <div class=\"col-sm-9\">\n                <input v-disable=\"disable_edit\" type=\"text\"  class=\"form-control\" id=\"user_name\" v-model=\"user_info.user_name\">\n            </div>\n        </div>\n        <div class=\"form-group\">\n            <label for=\"blog\" class=\"col-sm-3 control-label min-form-lable\">个人博客</label>\n            <div class=\"col-sm-9\">\n                <input v-disable=\"disable_edit\" type=\"text\"  class=\"form-control editable\" id=\"blog\" placeholder=\"\"  v-model=\"user_info.blog\"  v-on=\"focus:autoInsert('blog')\">\n            </div>\n        </div>\n        <div v-show=\"!disable_edit\" class=\"form-group\" id=\"slogan-group\">\n            <label for=\"editor\" class=\"col-sm-3 control-label min-form-lable\">个性签名</label>\n            <div class=\"col-sm-9\">\n                <simditor content=\"(%@ user_info.slogan%)\"></simditor>\n            </div>\n        </div>\n        <hr>\n        <div class=\"form-group\">\n            <a href=\"https://twitter.com/(%user_info.twitter%)\" target=\"_blank\">\n                <label class=\"col-sm-5 control-label\">\n                    <span class=\"round-icon bg-icon-blue\">\n                        <i class=\"fa fa-twitter\"></i>\n                    </span>\n                    Twitter\n                </label>\n            </a>\n            <div class=\"col-sm-7\">\n                <input v-disable=\"disable_edit\" type=\"text\" class=\"form-control editable\" id=\"twitter\" placeholder=\"\"   v-model=\"user_info.twitter\" v-on=\"focus:autoInsert('twitter', user_info.user_name)\">\n            </div>\n        </div>\n        <div class=\"form-group\">\n            <a href=\"https://github.com/(%user_info.github%)\" target=\"_blank\">\n                <label class=\"col-sm-5 control-label\"><span class=\"round-icon bg-icon-black\"><i class=\"fa fa-github\"></i></span> Github</label>\n            </a>\n            <div class=\"col-sm-7\">\n                <input v-disable=\"disable_edit\" type=\"text\" class=\"form-control editable\" placeholder=\"\"  v-model=\"user_info.github\" v-on=\"focus:autoInsert('github', user_info.user_name)\">\n            </div>\n        </div>\n        <div class=\"form-group\">\n            <a href=\"https://instagram.com/(%user_info.instagram%)\" target=\"_blank\">\n                <label class=\"col-sm-5 control-label\"><span class=\"round-icon bg-icon-orange\"><i class=\"fa fa-instagram\"></i></span> Instagram</label>\n            </a>\n            <div class=\"col-sm-7\">\n                <input v-disable=\"disable_edit\" type=\"text\" class=\"form-control editable\" placeholder=\"\"  v-model=\"user_info.instagram\" v-on=\"focus:autoInsert('instagram', user_info.user_name)\">\n            </div>\n        </div>\n        <div class=\"form-group\">\n            <a href=\"http://(%user_info.tumblr%).tumblr.com\" target=\"_blank\">\n                <label class=\"col-sm-5 control-label\"><span class=\"round-icon bg-icon-dark-blue\"><i class=\"fa fa-tumblr\"></i></span> Tumblr</label>\n            </a>\n            <div class=\"col-sm-7\">\n                <input v-disable=\"disable_edit\" type=\"text\" class=\"form-control editable\" placeholder=\"\"  v-model=\"user_info.tumblr\" v-on=\"focus:autoInsert('tumblr', user_info.user_name)\">\n            </div>\n        </div>\n    </form>\n    <div class=\"text-center\">\n        <follow followed=\"(%@ user_info.followed%)\" god_id=\"(%user_info.god_id%)\"></follow>\n        <button id=\"btn-edit\" v-btn-loading=\"loading\" type=\"submit\" class=\"btn btn-primary btn-sm\" v-on=\"click:save\">编辑</button>\n    </div>\n    <hr>\n</div>\n";

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(40);

	module.exports = {
	  bind: function() {},
	  update: function(new_value, old_value) {
	    return this.el.disabled = new_value;
	  },
	  unbind: function() {}
	};


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(41);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(6)(content, {});
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
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(5)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	var bz;

	__webpack_require__(43);

	bz = __webpack_require__(15);

	module.exports = {
	  template: __webpack_require__(45),
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
	    'god': __webpack_require__(46)
	  }
	};


/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(44);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(6)(content, {});
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
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(5)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 45 */
/***/ function(module, exports) {

	module.exports = "<god v-repeat=\"god in gods\" v-transition=\"fade\"></god>\n";

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	var bz;

	__webpack_require__(47);

	bz = __webpack_require__(15);

	module.exports = {
	  template: __webpack_require__(49),
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
	  },
	  components: {
	    'follow': __webpack_require__(89)
	  }
	};


/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(48);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(6)(content, {});
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
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(5)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 49 */
/***/ function(module, exports) {

	module.exports = "<div  class=\"box box-solid item\">\n    <div class=\"box-header\">\n        <h3 class=\"box-title\">\n            <a href=\"/#/god/(%god.user_name%)\">\n                <img v-attr=\"src:avatar\" class=\"direct-chat-img\">\n                <div class=\"name\">\n                    (%god.user_name%)\n                </div>\n            </a>\n        </h3>\n        <div class=\"box-tools pull-right\" v-html=\"all_link\">\n        </div>\n    </div>\n    <div class=\"box-body\" v-html=\"description\">\n    </div>\n    <div class=\"box-footer\">\n        <follow followed=\"(%god.followed%)\" god_id=\"(%god.god_id%)\"></follow>\n    </div>\n</div>\n";

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	var bz;

	__webpack_require__(51);

	bz = __webpack_require__(15);

	module.exports = {
	  template: __webpack_require__(53),
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
	          instagram: this.user_name,
	          tumblr: this.user_name
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
	                bz.showSuccess5("保存成功");
	                return $('#god_input').modal('hide');
	              }
	            };
	          })(this)
	        });
	      }
	    }
	  },
	  directives: {
	    'btn-loading': __webpack_require__(32)
	  }
	};


/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(52);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(6)(content, {});
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
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(5)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 53 */
/***/ function(module, exports) {

	module.exports = "<a v-on=\"click:pop\" class=\"btn btn-defalt\" data-toggle=\"modal\" data-target=\"#god_input\">添加</a>\n<div id=\"god_input\" class=\"modal fade\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"exampleModalLabel\">\n    <div class=\"modal-dialog\" role=\"document\">\n        <div class=\"modal-content\">\n            <div class=\"modal-header\">\n                <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>\n                <h4 class=\"modal-title\" id=\"exampleModalLabel\">添加一个新的牛人</h4>\n            </div>\n            <div class=\"modal-body\">\n                <form>\n                    <div class=\"form-group\">\n                        <label for=\"recipient-name\" class=\"control-label\">用户名:</label>\n                        <input v-on=\"keyup:addGod | key 'enter'\" v-model=\"user_name\" type=\"text\" class=\"form-control\" id=\"recipient-name\">\n                    </div>\n                    <div class=\"form-group\">\n                        <label for=\"message-text\" class=\"control-label\">描述:</label>\n                        <simditor content=\"(%@ slogan%)\"></simditor>\n                    </div>\n                </form>\n            </div>\n            <div class=\"modal-footer\">\n                <button v-btn-loading=\"btn_loading\" v-on=\"click:addGod\" type=\"button\" class=\"btn btn-sm btn-default\" data-dismiss=\"modal\">加好了</button>\n            </div>\n        </div>\n    </div>\n</div>\n";

/***/ },
/* 54 */,
/* 55 */,
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(57);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(6)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./node_modules/css-loader/index.js!./node_modules/less-loader/index.js!./app.less", function() {
				var newContent = require("!!./node_modules/css-loader/index.js!./node_modules/less-loader/index.js!./app.less");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(5)();
	// imports


	// module
	exports.push([module.id, "body {\n  background-color: #F9F9F9!important;\n}\n.box.box-solid > .box-header .a-icon:hover {\n  background: rgba(0, 0, 0, 0) !important;\n}\n", ""]);

	// exports


/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _interopRequireDefault = __webpack_require__(59)['default'];

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _util = __webpack_require__(60);

	var _router = __webpack_require__(64);

	var _router2 = _interopRequireDefault(_router);

	/**
	 * Installation interface.
	 * Install the necessary directives.
	 */

	_router2['default'].install = function (Vue) {
	  /* istanbul ignore if */
	  if (_router2['default'].installed) {
	    (0, _util.warn)('already installed.');
	    return;
	  }
	  __webpack_require__(73)(Vue, _router2['default']);
	  __webpack_require__(74)(Vue, _router2['default']);
	  __webpack_require__(78)(Vue);
	  __webpack_require__(79)(Vue);
	  __webpack_require__(80)(Vue);
	  _router2['default'].Vue = Vue;
	  _router2['default'].installed = true;
	};

	// auto install
	/* istanbul ignore if */
	if (typeof window !== 'undefined' && window.Vue) {
	  window.Vue.use(_router2['default']);
	}

	exports['default'] = _router2['default'];
	module.exports = exports['default'];

/***/ },
/* 59 */
/***/ function(module, exports) {

	"use strict";

	exports["default"] = function (obj) {
	  return obj && obj.__esModule ? obj : {
	    "default": obj
	  };
	};

	exports.__esModule = true;

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _interopRequireDefault = __webpack_require__(59)['default'];

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports.warn = warn;
	exports.resolvePath = resolvePath;
	exports.isPromise = isPromise;
	exports.getRouteConfig = getRouteConfig;
	exports.resolveAsyncComponent = resolveAsyncComponent;
	exports.mapParams = mapParams;

	var _routeRecognizer = __webpack_require__(61);

	var _routeRecognizer2 = _interopRequireDefault(_routeRecognizer);

	var genQuery = _routeRecognizer2['default'].prototype.generateQueryString;

	/**
	 * Warn stuff.
	 *
	 * @param {String} msg
	 * @param {Error} [err]
	 */

	function warn(msg, err) {
	  /* istanbul ignore next */
	  if (window.console) {
	    console.warn('[vue-router] ' + msg);
	    if (err) {
	      console.warn(err.stack);
	    }
	  }
	}

	/**
	 * Resolve a relative path.
	 *
	 * @param {String} base
	 * @param {String} relative
	 * @return {String}
	 */

	function resolvePath(base, relative) {
	  var query = base.match(/(\?.*)$/);
	  if (query) {
	    query = query[1];
	    base = base.slice(0, -query.length);
	  }
	  // a query!
	  if (relative.charAt(0) === '?') {
	    return base + relative;
	  }
	  var stack = base.split('/');
	  // remove trailing segment
	  stack.pop();
	  // resolve relative path
	  var segments = relative.split('/');
	  for (var i = 0; i < segments.length; i++) {
	    var segment = segments[i];
	    if (segment === '.') {
	      continue;
	    } else if (segment === '..') {
	      stack.pop();
	    } else {
	      stack.push(segment);
	    }
	  }
	  // ensure leading slash
	  if (stack[0] !== '') {
	    stack.unshift('');
	  }
	  return stack.join('/');
	}

	/**
	 * Forgiving check for a promise
	 *
	 * @param {Object} p
	 * @return {Boolean}
	 */

	function isPromise(p) {
	  return p && typeof p.then === 'function';
	}

	/**
	 * Retrive a route config field from a component instance
	 * OR a component contructor.
	 *
	 * @param {Function|Vue} component
	 * @param {String} name
	 * @return {*}
	 */

	function getRouteConfig(component, name) {
	  var options = component && (component.$options || component.options);
	  return options && options.route && options.route[name];
	}

	/**
	 * Resolve an async component factory. Have to do a dirty
	 * mock here because of Vue core's internal API depends on
	 * an ID check.
	 *
	 * @param {Object} handler
	 * @param {Function} cb
	 */

	var resolver = undefined;

	function resolveAsyncComponent(handler, cb) {
	  if (!resolver) {
	    resolver = {
	      // HACK
	      resolve: __webpack_require__(64).Vue.prototype._resolveComponent,
	      $options: {
	        components: {
	          _: handler.component
	        }
	      }
	    };
	  } else {
	    resolver.$options.components._ = handler.component;
	  }
	  resolver.resolve('_', function (Component) {
	    handler.component = Component;
	    cb(Component);
	  });
	}

	/**
	 * Map the dynamic segments in a path to params.
	 *
	 * @param {String} path
	 * @param {Object} params
	 * @param {Object} query
	 */

	function mapParams(path, params, query) {
	  for (var key in params) {
	    path = replaceParam(path, params, key);
	  }
	  if (query) {
	    path += genQuery(query);
	  }
	  return path;
	}

	/**
	 * Replace a param segment with real value in a matched
	 * path.
	 *
	 * @param {String} path
	 * @param {Object} params
	 * @param {String} key
	 * @return {String}
	 */

	function replaceParam(path, params, key) {
	  var regex = new RegExp(':' + key + '(\\/|$)');
	  var value = params[key];
	  return path.replace(regex, function (m) {
	    return m.charAt(m.length - 1) === '/' ? value + '/' : value;
	  });
	}

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {(function() {
	    "use strict";
	    function $$route$recognizer$dsl$$Target(path, matcher, delegate) {
	      this.path = path;
	      this.matcher = matcher;
	      this.delegate = delegate;
	    }

	    $$route$recognizer$dsl$$Target.prototype = {
	      to: function(target, callback) {
	        var delegate = this.delegate;

	        if (delegate && delegate.willAddRoute) {
	          target = delegate.willAddRoute(this.matcher.target, target);
	        }

	        this.matcher.add(this.path, target);

	        if (callback) {
	          if (callback.length === 0) { throw new Error("You must have an argument in the function passed to `to`"); }
	          this.matcher.addChild(this.path, target, callback, this.delegate);
	        }
	        return this;
	      }
	    };

	    function $$route$recognizer$dsl$$Matcher(target) {
	      this.routes = {};
	      this.children = {};
	      this.target = target;
	    }

	    $$route$recognizer$dsl$$Matcher.prototype = {
	      add: function(path, handler) {
	        this.routes[path] = handler;
	      },

	      addChild: function(path, target, callback, delegate) {
	        var matcher = new $$route$recognizer$dsl$$Matcher(target);
	        this.children[path] = matcher;

	        var match = $$route$recognizer$dsl$$generateMatch(path, matcher, delegate);

	        if (delegate && delegate.contextEntered) {
	          delegate.contextEntered(target, match);
	        }

	        callback(match);
	      }
	    };

	    function $$route$recognizer$dsl$$generateMatch(startingPath, matcher, delegate) {
	      return function(path, nestedCallback) {
	        var fullPath = startingPath + path;

	        if (nestedCallback) {
	          nestedCallback($$route$recognizer$dsl$$generateMatch(fullPath, matcher, delegate));
	        } else {
	          return new $$route$recognizer$dsl$$Target(startingPath + path, matcher, delegate);
	        }
	      };
	    }

	    function $$route$recognizer$dsl$$addRoute(routeArray, path, handler) {
	      var len = 0;
	      for (var i=0, l=routeArray.length; i<l; i++) {
	        len += routeArray[i].path.length;
	      }

	      path = path.substr(len);
	      var route = { path: path, handler: handler };
	      routeArray.push(route);
	    }

	    function $$route$recognizer$dsl$$eachRoute(baseRoute, matcher, callback, binding) {
	      var routes = matcher.routes;

	      for (var path in routes) {
	        if (routes.hasOwnProperty(path)) {
	          var routeArray = baseRoute.slice();
	          $$route$recognizer$dsl$$addRoute(routeArray, path, routes[path]);

	          if (matcher.children[path]) {
	            $$route$recognizer$dsl$$eachRoute(routeArray, matcher.children[path], callback, binding);
	          } else {
	            callback.call(binding, routeArray);
	          }
	        }
	      }
	    }

	    var $$route$recognizer$dsl$$default = function(callback, addRouteCallback) {
	      var matcher = new $$route$recognizer$dsl$$Matcher();

	      callback($$route$recognizer$dsl$$generateMatch("", matcher, this.delegate));

	      $$route$recognizer$dsl$$eachRoute([], matcher, function(route) {
	        if (addRouteCallback) { addRouteCallback(this, route); }
	        else { this.add(route); }
	      }, this);
	    };

	    var $$route$recognizer$$specials = [
	      '/', '.', '*', '+', '?', '|',
	      '(', ')', '[', ']', '{', '}', '\\'
	    ];

	    var $$route$recognizer$$escapeRegex = new RegExp('(\\' + $$route$recognizer$$specials.join('|\\') + ')', 'g');

	    function $$route$recognizer$$isArray(test) {
	      return Object.prototype.toString.call(test) === "[object Array]";
	    }

	    // A Segment represents a segment in the original route description.
	    // Each Segment type provides an `eachChar` and `regex` method.
	    //
	    // The `eachChar` method invokes the callback with one or more character
	    // specifications. A character specification consumes one or more input
	    // characters.
	    //
	    // The `regex` method returns a regex fragment for the segment. If the
	    // segment is a dynamic of star segment, the regex fragment also includes
	    // a capture.
	    //
	    // A character specification contains:
	    //
	    // * `validChars`: a String with a list of all valid characters, or
	    // * `invalidChars`: a String with a list of all invalid characters
	    // * `repeat`: true if the character specification can repeat

	    function $$route$recognizer$$StaticSegment(string) { this.string = string; }
	    $$route$recognizer$$StaticSegment.prototype = {
	      eachChar: function(callback) {
	        var string = this.string, ch;

	        for (var i=0, l=string.length; i<l; i++) {
	          ch = string.charAt(i);
	          callback({ validChars: ch });
	        }
	      },

	      regex: function() {
	        return this.string.replace($$route$recognizer$$escapeRegex, '\\$1');
	      },

	      generate: function() {
	        return this.string;
	      }
	    };

	    function $$route$recognizer$$DynamicSegment(name) { this.name = name; }
	    $$route$recognizer$$DynamicSegment.prototype = {
	      eachChar: function(callback) {
	        callback({ invalidChars: "/", repeat: true });
	      },

	      regex: function() {
	        return "([^/]+)";
	      },

	      generate: function(params) {
	        return params[this.name];
	      }
	    };

	    function $$route$recognizer$$StarSegment(name) { this.name = name; }
	    $$route$recognizer$$StarSegment.prototype = {
	      eachChar: function(callback) {
	        callback({ invalidChars: "", repeat: true });
	      },

	      regex: function() {
	        return "(.+)";
	      },

	      generate: function(params) {
	        return params[this.name];
	      }
	    };

	    function $$route$recognizer$$EpsilonSegment() {}
	    $$route$recognizer$$EpsilonSegment.prototype = {
	      eachChar: function() {},
	      regex: function() { return ""; },
	      generate: function() { return ""; }
	    };

	    function $$route$recognizer$$parse(route, names, specificity) {
	      // normalize route as not starting with a "/". Recognition will
	      // also normalize.
	      if (route.charAt(0) === "/") { route = route.substr(1); }

	      var segments = route.split("/"), results = [];

	      // A routes has specificity determined by the order that its different segments
	      // appear in. This system mirrors how the magnitude of numbers written as strings
	      // works.
	      // Consider a number written as: "abc". An example would be "200". Any other number written
	      // "xyz" will be smaller than "abc" so long as `a > z`. For instance, "199" is smaller
	      // then "200", even though "y" and "z" (which are both 9) are larger than "0" (the value
	      // of (`b` and `c`). This is because the leading symbol, "2", is larger than the other
	      // leading symbol, "1".
	      // The rule is that symbols to the left carry more weight than symbols to the right
	      // when a number is written out as a string. In the above strings, the leading digit
	      // represents how many 100's are in the number, and it carries more weight than the middle
	      // number which represents how many 10's are in the number.
	      // This system of number magnitude works well for route specificity, too. A route written as
	      // `a/b/c` will be more specific than `x/y/z` as long as `a` is more specific than
	      // `x`, irrespective of the other parts.
	      // Because of this similarity, we assign each type of segment a number value written as a
	      // string. We can find the specificity of compound routes by concatenating these strings
	      // together, from left to right. After we have looped through all of the segments,
	      // we convert the string to a number.
	      specificity.val = '';

	      for (var i=0, l=segments.length; i<l; i++) {
	        var segment = segments[i], match;

	        if (match = segment.match(/^:([^\/]+)$/)) {
	          results.push(new $$route$recognizer$$DynamicSegment(match[1]));
	          names.push(match[1]);
	          specificity.val += '3';
	        } else if (match = segment.match(/^\*([^\/]+)$/)) {
	          results.push(new $$route$recognizer$$StarSegment(match[1]));
	          specificity.val += '2';
	          names.push(match[1]);
	        } else if(segment === "") {
	          results.push(new $$route$recognizer$$EpsilonSegment());
	          specificity.val += '1';
	        } else {
	          results.push(new $$route$recognizer$$StaticSegment(segment));
	          specificity.val += '4';
	        }
	      }

	      specificity.val = +specificity.val;

	      return results;
	    }

	    // A State has a character specification and (`charSpec`) and a list of possible
	    // subsequent states (`nextStates`).
	    //
	    // If a State is an accepting state, it will also have several additional
	    // properties:
	    //
	    // * `regex`: A regular expression that is used to extract parameters from paths
	    //   that reached this accepting state.
	    // * `handlers`: Information on how to convert the list of captures into calls
	    //   to registered handlers with the specified parameters
	    // * `types`: How many static, dynamic or star segments in this route. Used to
	    //   decide which route to use if multiple registered routes match a path.
	    //
	    // Currently, State is implemented naively by looping over `nextStates` and
	    // comparing a character specification against a character. A more efficient
	    // implementation would use a hash of keys pointing at one or more next states.

	    function $$route$recognizer$$State(charSpec) {
	      this.charSpec = charSpec;
	      this.nextStates = [];
	    }

	    $$route$recognizer$$State.prototype = {
	      get: function(charSpec) {
	        var nextStates = this.nextStates;

	        for (var i=0, l=nextStates.length; i<l; i++) {
	          var child = nextStates[i];

	          var isEqual = child.charSpec.validChars === charSpec.validChars;
	          isEqual = isEqual && child.charSpec.invalidChars === charSpec.invalidChars;

	          if (isEqual) { return child; }
	        }
	      },

	      put: function(charSpec) {
	        var state;

	        // If the character specification already exists in a child of the current
	        // state, just return that state.
	        if (state = this.get(charSpec)) { return state; }

	        // Make a new state for the character spec
	        state = new $$route$recognizer$$State(charSpec);

	        // Insert the new state as a child of the current state
	        this.nextStates.push(state);

	        // If this character specification repeats, insert the new state as a child
	        // of itself. Note that this will not trigger an infinite loop because each
	        // transition during recognition consumes a character.
	        if (charSpec.repeat) {
	          state.nextStates.push(state);
	        }

	        // Return the new state
	        return state;
	      },

	      // Find a list of child states matching the next character
	      match: function(ch) {
	        // DEBUG "Processing `" + ch + "`:"
	        var nextStates = this.nextStates,
	            child, charSpec, chars;

	        // DEBUG "  " + debugState(this)
	        var returned = [];

	        for (var i=0, l=nextStates.length; i<l; i++) {
	          child = nextStates[i];

	          charSpec = child.charSpec;

	          if (typeof (chars = charSpec.validChars) !== 'undefined') {
	            if (chars.indexOf(ch) !== -1) { returned.push(child); }
	          } else if (typeof (chars = charSpec.invalidChars) !== 'undefined') {
	            if (chars.indexOf(ch) === -1) { returned.push(child); }
	          }
	        }

	        return returned;
	      }

	      /** IF DEBUG
	      , debug: function() {
	        var charSpec = this.charSpec,
	            debug = "[",
	            chars = charSpec.validChars || charSpec.invalidChars;

	        if (charSpec.invalidChars) { debug += "^"; }
	        debug += chars;
	        debug += "]";

	        if (charSpec.repeat) { debug += "+"; }

	        return debug;
	      }
	      END IF **/
	    };

	    /** IF DEBUG
	    function debug(log) {
	      console.log(log);
	    }

	    function debugState(state) {
	      return state.nextStates.map(function(n) {
	        if (n.nextStates.length === 0) { return "( " + n.debug() + " [accepting] )"; }
	        return "( " + n.debug() + " <then> " + n.nextStates.map(function(s) { return s.debug() }).join(" or ") + " )";
	      }).join(", ")
	    }
	    END IF **/

	    // Sort the routes by specificity
	    function $$route$recognizer$$sortSolutions(states) {
	      return states.sort(function(a, b) {
	        return b.specificity.val - a.specificity.val;
	      });
	    }

	    function $$route$recognizer$$recognizeChar(states, ch) {
	      var nextStates = [];

	      for (var i=0, l=states.length; i<l; i++) {
	        var state = states[i];

	        nextStates = nextStates.concat(state.match(ch));
	      }

	      return nextStates;
	    }

	    var $$route$recognizer$$oCreate = Object.create || function(proto) {
	      function F() {}
	      F.prototype = proto;
	      return new F();
	    };

	    function $$route$recognizer$$RecognizeResults(queryParams) {
	      this.queryParams = queryParams || {};
	    }
	    $$route$recognizer$$RecognizeResults.prototype = $$route$recognizer$$oCreate({
	      splice: Array.prototype.splice,
	      slice:  Array.prototype.slice,
	      push:   Array.prototype.push,
	      length: 0,
	      queryParams: null
	    });

	    function $$route$recognizer$$findHandler(state, path, queryParams) {
	      var handlers = state.handlers, regex = state.regex;
	      var captures = path.match(regex), currentCapture = 1;
	      var result = new $$route$recognizer$$RecognizeResults(queryParams);

	      for (var i=0, l=handlers.length; i<l; i++) {
	        var handler = handlers[i], names = handler.names, params = {};

	        for (var j=0, m=names.length; j<m; j++) {
	          params[names[j]] = captures[currentCapture++];
	        }

	        result.push({ handler: handler.handler, params: params, isDynamic: !!names.length });
	      }

	      return result;
	    }

	    function $$route$recognizer$$addSegment(currentState, segment) {
	      segment.eachChar(function(ch) {
	        var state;

	        currentState = currentState.put(ch);
	      });

	      return currentState;
	    }

	    function $$route$recognizer$$decodeQueryParamPart(part) {
	      // http://www.w3.org/TR/html401/interact/forms.html#h-17.13.4.1
	      part = part.replace(/\+/gm, '%20');
	      return decodeURIComponent(part);
	    }

	    // The main interface

	    var $$route$recognizer$$RouteRecognizer = function() {
	      this.rootState = new $$route$recognizer$$State();
	      this.names = {};
	    };


	    $$route$recognizer$$RouteRecognizer.prototype = {
	      add: function(routes, options) {
	        var currentState = this.rootState, regex = "^",
	            specificity = {},
	            handlers = [], allSegments = [], name;

	        var isEmpty = true;

	        for (var i=0, l=routes.length; i<l; i++) {
	          var route = routes[i], names = [];

	          var segments = $$route$recognizer$$parse(route.path, names, specificity);

	          allSegments = allSegments.concat(segments);

	          for (var j=0, m=segments.length; j<m; j++) {
	            var segment = segments[j];

	            if (segment instanceof $$route$recognizer$$EpsilonSegment) { continue; }

	            isEmpty = false;

	            // Add a "/" for the new segment
	            currentState = currentState.put({ validChars: "/" });
	            regex += "/";

	            // Add a representation of the segment to the NFA and regex
	            currentState = $$route$recognizer$$addSegment(currentState, segment);
	            regex += segment.regex();
	          }

	          var handler = { handler: route.handler, names: names };
	          handlers.push(handler);
	        }

	        if (isEmpty) {
	          currentState = currentState.put({ validChars: "/" });
	          regex += "/";
	        }

	        currentState.handlers = handlers;
	        currentState.regex = new RegExp(regex + "$");
	        currentState.specificity = specificity;

	        if (name = options && options.as) {
	          this.names[name] = {
	            segments: allSegments,
	            handlers: handlers
	          };
	        }
	      },

	      handlersFor: function(name) {
	        var route = this.names[name], result = [];
	        if (!route) { throw new Error("There is no route named " + name); }

	        for (var i=0, l=route.handlers.length; i<l; i++) {
	          result.push(route.handlers[i]);
	        }

	        return result;
	      },

	      hasRoute: function(name) {
	        return !!this.names[name];
	      },

	      generate: function(name, params) {
	        var route = this.names[name], output = "";
	        if (!route) { throw new Error("There is no route named " + name); }

	        var segments = route.segments;

	        for (var i=0, l=segments.length; i<l; i++) {
	          var segment = segments[i];

	          if (segment instanceof $$route$recognizer$$EpsilonSegment) { continue; }

	          output += "/";
	          output += segment.generate(params);
	        }

	        if (output.charAt(0) !== '/') { output = '/' + output; }

	        if (params && params.queryParams) {
	          output += this.generateQueryString(params.queryParams, route.handlers);
	        }

	        return output;
	      },

	      generateQueryString: function(params, handlers) {
	        var pairs = [];
	        var keys = [];
	        for(var key in params) {
	          if (params.hasOwnProperty(key)) {
	            keys.push(key);
	          }
	        }
	        keys.sort();
	        for (var i = 0, len = keys.length; i < len; i++) {
	          key = keys[i];
	          var value = params[key];
	          if (value == null) {
	            continue;
	          }
	          var pair = encodeURIComponent(key);
	          if ($$route$recognizer$$isArray(value)) {
	            for (var j = 0, l = value.length; j < l; j++) {
	              var arrayPair = key + '[]' + '=' + encodeURIComponent(value[j]);
	              pairs.push(arrayPair);
	            }
	          } else {
	            pair += "=" + encodeURIComponent(value);
	            pairs.push(pair);
	          }
	        }

	        if (pairs.length === 0) { return ''; }

	        return "?" + pairs.join("&");
	      },

	      parseQueryString: function(queryString) {
	        var pairs = queryString.split("&"), queryParams = {};
	        for(var i=0; i < pairs.length; i++) {
	          var pair      = pairs[i].split('='),
	              key       = $$route$recognizer$$decodeQueryParamPart(pair[0]),
	              keyLength = key.length,
	              isArray = false,
	              value;
	          if (pair.length === 1) {
	            value = 'true';
	          } else {
	            //Handle arrays
	            if (keyLength > 2 && key.slice(keyLength -2) === '[]') {
	              isArray = true;
	              key = key.slice(0, keyLength - 2);
	              if(!queryParams[key]) {
	                queryParams[key] = [];
	              }
	            }
	            value = pair[1] ? $$route$recognizer$$decodeQueryParamPart(pair[1]) : '';
	          }
	          if (isArray) {
	            queryParams[key].push(value);
	          } else {
	            queryParams[key] = value;
	          }
	        }
	        return queryParams;
	      },

	      recognize: function(path) {
	        var states = [ this.rootState ],
	            pathLen, i, l, queryStart, queryParams = {},
	            isSlashDropped = false;

	        queryStart = path.indexOf('?');
	        if (queryStart !== -1) {
	          var queryString = path.substr(queryStart + 1, path.length);
	          path = path.substr(0, queryStart);
	          queryParams = this.parseQueryString(queryString);
	        }

	        path = decodeURI(path);

	        // DEBUG GROUP path

	        if (path.charAt(0) !== "/") { path = "/" + path; }

	        pathLen = path.length;
	        if (pathLen > 1 && path.charAt(pathLen - 1) === "/") {
	          path = path.substr(0, pathLen - 1);
	          isSlashDropped = true;
	        }

	        for (i=0, l=path.length; i<l; i++) {
	          states = $$route$recognizer$$recognizeChar(states, path.charAt(i));
	          if (!states.length) { break; }
	        }

	        // END DEBUG GROUP

	        var solutions = [];
	        for (i=0, l=states.length; i<l; i++) {
	          if (states[i].handlers) { solutions.push(states[i]); }
	        }

	        states = $$route$recognizer$$sortSolutions(solutions);

	        var state = solutions[0];

	        if (state && state.handlers) {
	          // if a trailing slash was dropped and a star segment is the last segment
	          // specified, put the trailing slash back
	          if (isSlashDropped && state.regex.source.slice(-5) === "(.+)$") {
	            path = path + "/";
	          }
	          return $$route$recognizer$$findHandler(state, path, queryParams);
	        }
	      }
	    };

	    $$route$recognizer$$RouteRecognizer.prototype.map = $$route$recognizer$dsl$$default;

	    $$route$recognizer$$RouteRecognizer.VERSION = '0.1.9';

	    var $$route$recognizer$$default = $$route$recognizer$$RouteRecognizer;

	    /* global define:true module:true window: true */
	    if ("function" === 'function' && __webpack_require__(63)['amd']) {
	      !(__WEBPACK_AMD_DEFINE_RESULT__ = function() { return $$route$recognizer$$default; }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof module !== 'undefined' && module['exports']) {
	      module['exports'] = $$route$recognizer$$default;
	    } else if (typeof this !== 'undefined') {
	      this['RouteRecognizer'] = $$route$recognizer$$default;
	    }
	}).call(this);

	//# sourceMappingURL=route-recognizer.js.map
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(62)(module)))

/***/ },
/* 62 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 63 */
/***/ function(module, exports) {

	module.exports = function() { throw new Error("define cannot be used indirect"); };


/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _classCallCheck = __webpack_require__(65)['default'];

	var _interopRequireDefault = __webpack_require__(59)['default'];

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _routeRecognizer = __webpack_require__(61);

	var _routeRecognizer2 = _interopRequireDefault(_routeRecognizer);

	var historyBackends = {
	  abstract: __webpack_require__(66),
	  hash: __webpack_require__(71),
	  html5: __webpack_require__(72)
	};

	/**
	 * Router constructor
	 *
	 * @param {Object} [options]
	 */

	var Router = function Router() {
	  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	  var _ref$hashbang = _ref.hashbang;
	  var hashbang = _ref$hashbang === undefined ? true : _ref$hashbang;
	  var _ref$abstract = _ref.abstract;
	  var abstract = _ref$abstract === undefined ? false : _ref$abstract;
	  var _ref$history = _ref.history;
	  var history = _ref$history === undefined ? false : _ref$history;
	  var _ref$saveScrollPosition = _ref.saveScrollPosition;
	  var saveScrollPosition = _ref$saveScrollPosition === undefined ? false : _ref$saveScrollPosition;
	  var _ref$transitionOnLoad = _ref.transitionOnLoad;
	  var transitionOnLoad = _ref$transitionOnLoad === undefined ? false : _ref$transitionOnLoad;
	  var _ref$suppressTransitionError = _ref.suppressTransitionError;
	  var suppressTransitionError = _ref$suppressTransitionError === undefined ? false : _ref$suppressTransitionError;
	  var _ref$root = _ref.root;
	  var root = _ref$root === undefined ? null : _ref$root;
	  var _ref$linkActiveClass = _ref.linkActiveClass;
	  var linkActiveClass = _ref$linkActiveClass === undefined ? 'v-link-active' : _ref$linkActiveClass;

	  _classCallCheck(this, Router);

	  /* istanbul ignore if */
	  if (!Router.installed) {
	    throw new Error('Please install the Router with Vue.use() before ' + 'creating an instance.');
	  }

	  // Vue instances
	  this.app = null;
	  this._views = [];
	  this._children = [];

	  // route recognizer
	  this._recognizer = new _routeRecognizer2['default']();
	  this._guardRecognizer = new _routeRecognizer2['default']();

	  // state
	  this._started = false;
	  this._currentRoute = {};
	  this._currentTransition = null;
	  this._previousTransition = null;
	  this._notFoundHandler = null;
	  this._beforeEachHook = null;
	  this._afterEachHook = null;

	  // feature detection
	  this._hasPushState = typeof window !== 'undefined' && window.history && window.history.pushState;

	  // trigger transition on initial render?
	  this._rendered = false;
	  this._transitionOnLoad = transitionOnLoad;

	  // history mode
	  this._abstract = abstract;
	  this._hashbang = hashbang;
	  this._history = this._hasPushState && history;

	  // other options
	  this._saveScrollPosition = saveScrollPosition;
	  this._linkActiveClass = linkActiveClass;
	  this._suppress = suppressTransitionError;

	  // create history object
	  var inBrowser = Router.Vue.util.inBrowser;
	  this.mode = !inBrowser || this._abstract ? 'abstract' : this._history ? 'html5' : 'hash';

	  var History = historyBackends[this.mode];
	  var self = this;
	  this.history = new History({
	    root: root,
	    hashbang: this._hashbang,
	    onChange: function onChange(path, state, anchor) {
	      self._match(path, state, anchor);
	    }
	  });
	};

	exports['default'] = Router;

	Router.installed = false;
	module.exports = exports['default'];

/***/ },
/* 65 */
/***/ function(module, exports) {

	"use strict";

	exports["default"] = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

	exports.__esModule = true;

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = __webpack_require__(67)['default'];

	var _classCallCheck = __webpack_require__(65)['default'];

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _util = __webpack_require__(60);

	var AbstractHistory = (function () {
	  function AbstractHistory(_ref) {
	    var onChange = _ref.onChange;

	    _classCallCheck(this, AbstractHistory);

	    this.onChange = onChange;
	    this.currentPath = '/';
	  }

	  _createClass(AbstractHistory, [{
	    key: 'start',
	    value: function start() {
	      this.onChange('/');
	    }
	  }, {
	    key: 'stop',
	    value: function stop() {
	      // noop
	    }
	  }, {
	    key: 'go',
	    value: function go(path) {
	      path = this.currentPath = this.formatPath(path);
	      this.onChange(path);
	    }
	  }, {
	    key: 'formatPath',
	    value: function formatPath(path) {
	      return path.charAt(0) === '/' ? path : (0, _util.resolvePath)(this.currentPath, path);
	    }
	  }]);

	  return AbstractHistory;
	})();

	exports['default'] = AbstractHistory;
	module.exports = exports['default'];

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _Object$defineProperty = __webpack_require__(68)["default"];

	exports["default"] = (function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;

	      _Object$defineProperty(target, descriptor.key, descriptor);
	    }
	  }

	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	})();

	exports.__esModule = true;

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(69), __esModule: true };

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(70);
	module.exports = function defineProperty(it, key, desc){
	  return $.setDesc(it, key, desc);
	};

/***/ },
/* 70 */
/***/ function(module, exports) {

	var $Object = Object;
	module.exports = {
	  create:     $Object.create,
	  getProto:   $Object.getPrototypeOf,
	  isEnum:     {}.propertyIsEnumerable,
	  getDesc:    $Object.getOwnPropertyDescriptor,
	  setDesc:    $Object.defineProperty,
	  setDescs:   $Object.defineProperties,
	  getKeys:    $Object.keys,
	  getNames:   $Object.getOwnPropertyNames,
	  getSymbols: $Object.getOwnPropertySymbols,
	  each:       [].forEach
	};

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = __webpack_require__(67)['default'];

	var _classCallCheck = __webpack_require__(65)['default'];

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _util = __webpack_require__(60);

	var HashHistory = (function () {
	  function HashHistory(_ref) {
	    var hashbang = _ref.hashbang;
	    var onChange = _ref.onChange;

	    _classCallCheck(this, HashHistory);

	    this.hashbang = hashbang;
	    this.onChange = onChange;
	  }

	  _createClass(HashHistory, [{
	    key: 'start',
	    value: function start() {
	      var self = this;
	      this.listener = function () {
	        var path = location.hash;
	        var formattedPath = self.formatPath(path, true);
	        if (formattedPath !== path) {
	          location.replace(formattedPath);
	          return;
	        }
	        var pathToMatch = decodeURI(path.replace(/^#!?/, '') + location.search);
	        self.onChange(pathToMatch);
	      };
	      window.addEventListener('hashchange', this.listener);
	      this.listener();
	    }
	  }, {
	    key: 'stop',
	    value: function stop() {
	      window.removeEventListener('hashchange', this.listener);
	    }
	  }, {
	    key: 'go',
	    value: function go(path, replace) {
	      path = this.formatPath(path);
	      if (replace) {
	        location.replace(path);
	      } else {
	        location.hash = path;
	      }
	    }
	  }, {
	    key: 'formatPath',
	    value: function formatPath(path, expectAbsolute) {
	      path = path.replace(/^#!?/, '');
	      var isAbsoloute = path.charAt(0) === '/';
	      if (expectAbsolute && !isAbsoloute) {
	        path = '/' + path;
	      }
	      var prefix = '#' + (this.hashbang ? '!' : '');
	      return isAbsoloute || expectAbsolute ? prefix + path : prefix + (0, _util.resolvePath)(location.hash.replace(/^#!?/, ''), path);
	    }
	  }]);

	  return HashHistory;
	})();

	exports['default'] = HashHistory;
	module.exports = exports['default'];

/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = __webpack_require__(67)['default'];

	var _classCallCheck = __webpack_require__(65)['default'];

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _util = __webpack_require__(60);

	var hashRE = /#.*$/;

	var HTML5History = (function () {
	  function HTML5History(_ref) {
	    var root = _ref.root;
	    var onChange = _ref.onChange;

	    _classCallCheck(this, HTML5History);

	    if (root) {
	      // make sure there's the starting slash
	      if (root.charAt(0) !== '/') {
	        root = '/' + root;
	      }
	      // remove trailing slash
	      this.root = root.replace(/\/$/, '');
	      this.rootRE = new RegExp('^\\' + this.root);
	    } else {
	      this.root = null;
	    }
	    this.onChange = onChange;
	    // check base tag
	    var baseEl = document.querySelector('base');
	    this.base = baseEl && baseEl.getAttribute('href');
	  }

	  _createClass(HTML5History, [{
	    key: 'start',
	    value: function start() {
	      var _this = this;

	      this.listener = function (e) {
	        var url = decodeURI(location.pathname + location.search);
	        if (_this.root) {
	          url = url.replace(_this.rootRE, '');
	        }
	        _this.onChange(url, e && e.state, location.hash);
	      };
	      window.addEventListener('popstate', this.listener);
	      this.listener();
	    }
	  }, {
	    key: 'stop',
	    value: function stop() {
	      window.removeEventListener('popstate', this.listener);
	    }
	  }, {
	    key: 'go',
	    value: function go(path, replace) {
	      var root = this.root;
	      var url = this.formatPath(path, root);
	      if (replace) {
	        history.replaceState({}, '', url);
	      } else {
	        // record scroll position by replacing current state
	        history.replaceState({
	          pos: {
	            x: window.pageXOffset,
	            y: window.pageYOffset
	          }
	        }, '');
	        // then push new state
	        history.pushState({}, '', url);
	      }
	      var hashMatch = path.match(hashRE);
	      var hash = hashMatch && hashMatch[0];
	      path = url
	      // strip hash so it doesn't mess up params
	      .replace(hashRE, '')
	      // remove root before matching
	      .replace(this.rootRE, '');
	      this.onChange(path, null, hash);
	    }
	  }, {
	    key: 'formatPath',
	    value: function formatPath(path) {
	      return path.charAt(0) === '/'
	      // absolute path
	      ? this.root ? this.root + '/' + path.replace(/^\//, '') : path : (0, _util.resolvePath)(this.base || location.pathname, path);
	    }
	  }]);

	  return HTML5History;
	})();

	exports['default'] = HTML5History;
	module.exports = exports['default'];

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _util = __webpack_require__(60);

	exports['default'] = function (Vue, Router) {

	  /**
	   * Register a map of top-level paths.
	   */

	  Router.prototype.map = function (map) {
	    for (var route in map) {
	      this.on(route, map[route]);
	    }
	  };

	  /**
	   * Register a single root-level path
	   *
	   * @param {String} rootPath
	   * @param {Object} handler
	   *                 - {String} component
	   *                 - {Object} [subRoutes]
	   *                 - {Boolean} [forceRefresh]
	   *                 - {Function} [before]
	   *                 - {Function} [after]
	   */

	  Router.prototype.on = function (rootPath, handler) {
	    if (rootPath === '*') {
	      this._notFound(handler);
	    } else {
	      this._addRoute(rootPath, handler, []);
	    }
	  };

	  /**
	   * Set redirects.
	   *
	   * @param {Object} map
	   */

	  Router.prototype.redirect = function (map) {
	    for (var path in map) {
	      this._addRedirect(path, map[path]);
	    }
	  };

	  /**
	   * Set aliases.
	   *
	   * @param {Object} map
	   */

	  Router.prototype.alias = function (map) {
	    for (var path in map) {
	      this._addAlias(path, map[path]);
	    }
	  };

	  /**
	   * Set global before hook.
	   *
	   * @param {Function} fn
	   */

	  Router.prototype.beforeEach = function (fn) {
	    this._beforeEachHook = fn;
	  };

	  /**
	   * Set global after hook.
	   *
	   * @param {Function} fn
	   */

	  Router.prototype.afterEach = function (fn) {
	    this._afterEachHook = fn;
	  };

	  /**
	   * Navigate to a given path.
	   * The path is assumed to be already decoded, and will
	   * be resolved against root (if provided)
	   *
	   * @param {String} path
	   * @param {Boolean} [replace]
	   */

	  Router.prototype.go = function (path, replace) {
	    this.history.go(path + '', replace);
	  };

	  /**
	   * Short hand for replacing current path
	   *
	   * @param {String} path
	   */

	  Router.prototype.replace = function (path) {
	    this.go(path, true);
	  };

	  /**
	   * Start the router.
	   *
	   * @param {VueConstructor} App
	   * @param {String|Element} container
	   */

	  Router.prototype.start = function (App, container) {
	    /* istanbul ignore if */
	    if (this._started) {
	      (0, _util.warn)('already started.');
	      return;
	    }
	    this._started = true;
	    if (!this.app) {
	      /* istanbul ignore if */
	      if (!App || !container) {
	        throw new Error('Must start vue-router with a component and a ' + 'root container.');
	      }
	      this._appContainer = container;
	      this._appConstructor = typeof App === 'function' ? App : Vue.extend(App);
	    }
	    this.history.start();
	  };

	  /**
	   * Stop listening to route changes.
	   */

	  Router.prototype.stop = function () {
	    this.history.stop();
	    this._started = false;
	  };
	};

	module.exports = exports['default'];

/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _interopRequireDefault = __webpack_require__(59)['default'];

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _util = __webpack_require__(60);

	var _route = __webpack_require__(75);

	var _route2 = _interopRequireDefault(_route);

	var _transition = __webpack_require__(76);

	var _transition2 = _interopRequireDefault(_transition);

	exports['default'] = function (Vue, Router) {

	  var _ = Vue.util;

	  /**
	   * Add a route containing a list of segments to the internal
	   * route recognizer. Will be called recursively to add all
	   * possible sub-routes.
	   *
	   * @param {String} path
	   * @param {Object} handler
	   * @param {Array} segments
	   */

	  Router.prototype._addRoute = function (path, handler, segments) {
	    guardComponent(handler);
	    segments.push({
	      path: path,
	      handler: handler
	    });
	    this._recognizer.add(segments);
	    if (handler.subRoutes) {
	      for (var subPath in handler.subRoutes) {
	        // recursively walk all sub routes
	        this._addRoute(subPath, handler.subRoutes[subPath],
	        // pass a copy in recursion to avoid mutating
	        // across branches
	        segments.slice());
	      }
	    }
	  };

	  /**
	   * Set the notFound route handler.
	   *
	   * @param {Object} handler
	   */

	  Router.prototype._notFound = function (handler) {
	    guardComponent(handler);
	    this._notFoundHandler = [{ handler: handler }];
	  };

	  /**
	   * Add a redirect record.
	   *
	   * @param {String} path
	   * @param {String} redirectPath
	   */

	  Router.prototype._addRedirect = function (path, redirectPath) {
	    this._addGuard(path, redirectPath, this.replace);
	  };

	  /**
	   * Add an alias record.
	   *
	   * @param {String} path
	   * @param {String} aliasPath
	   */

	  Router.prototype._addAlias = function (path, aliasPath) {
	    this._addGuard(path, aliasPath, this._match);
	  };

	  /**
	   * Add a path guard.
	   *
	   * @param {String} path
	   * @param {String} mappedPath
	   * @param {Function} handler
	   */

	  Router.prototype._addGuard = function (path, mappedPath, _handler) {
	    var _this = this;

	    this._guardRecognizer.add([{
	      path: path,
	      handler: function handler(match, query) {
	        var realPath = (0, _util.mapParams)(mappedPath, match.params, query);
	        _handler.call(_this, realPath);
	      }
	    }]);
	  };

	  /**
	   * Check if a path matches any redirect records.
	   *
	   * @param {String} path
	   * @return {Boolean} - if true, will skip normal match.
	   */

	  Router.prototype._checkGuard = function (path) {
	    var matched = this._guardRecognizer.recognize(path);
	    if (matched) {
	      matched[0].handler(matched[0], matched.queryParams);
	      return true;
	    }
	  };

	  /**
	   * Match a URL path and set the route context on vm,
	   * triggering view updates.
	   *
	   * @param {String} path
	   * @param {Object} [state]
	   * @param {String} [anchor]
	   */

	  Router.prototype._match = function (path, state, anchor) {
	    var _this2 = this;

	    if (this._checkGuard(path)) {
	      return;
	    }

	    var prevRoute = this._currentRoute;
	    var prevTransition = this._currentTransition;

	    // do nothing if going to the same route.
	    // the route only changes when a transition successfully
	    // reaches activation; we don't need to do anything
	    // if an ongoing transition is aborted during validation
	    // phase.
	    if (prevTransition && path === prevRoute.path) {
	      return;
	    }

	    // construct new route and transition context
	    var route = new _route2['default'](path, this);
	    var transition = new _transition2['default'](this, route, prevRoute);
	    this._prevTransition = prevTransition;
	    this._currentTransition = transition;

	    if (!this.app) {
	      // initial render
	      this.app = new this._appConstructor({
	        el: this._appContainer,
	        _meta: {
	          $route: route
	        }
	      });
	    }

	    // check global before hook
	    var before = this._beforeEachHook;
	    var startTransition = function startTransition() {
	      transition.start(function () {
	        _this2._postTransition(route, state, anchor);
	      });
	    };

	    if (before) {
	      transition.callHook(before, null, startTransition, true);
	    } else {
	      startTransition();
	    }

	    // HACK:
	    // set rendered to true after the transition start, so
	    // that components that are acitvated synchronously know
	    // whether it is the initial render.
	    this._rendered = true;
	  };

	  /**
	   * Set current to the new transition.
	   * This is called by the transition object when the
	   * validation of a route has succeeded.
	   *
	   * @param {RouteTransition} transition
	   */

	  Router.prototype._onTransitionValidated = function (transition) {
	    // now that this one is validated, we can abort
	    // the previous transition.
	    var prevTransition = this._prevTransition;
	    if (prevTransition) {
	      prevTransition.aborted = true;
	    }
	    // set current route
	    var route = this._currentRoute = transition.to;
	    // update route context for all children
	    if (this.app.$route !== route) {
	      this.app.$route = route;
	      this._children.forEach(function (child) {
	        child.$route = route;
	      });
	    }
	    // call global after hook
	    if (this._afterEachHook) {
	      this._afterEachHook.call(null, {
	        to: transition.to,
	        from: transition.from
	      });
	    }
	  };

	  /**
	   * Handle stuff after the transition.
	   *
	   * @param {Route} route
	   * @param {Object} [state]
	   * @param {String} [anchor]
	   */

	  Router.prototype._postTransition = function (route, state, anchor) {
	    // handle scroll positions
	    // saved scroll positions take priority
	    // then we check if the path has an anchor
	    var pos = state && state.pos;
	    if (pos && this._saveScrollPosition) {
	      Vue.nextTick(function () {
	        window.scrollTo(pos.x, pos.y);
	      });
	    } else if (anchor) {
	      Vue.nextTick(function () {
	        var el = document.getElementById(anchor.slice(1));
	        if (el) {
	          window.scrollTo(window.scrollX, el.offsetTop);
	        }
	      });
	    }
	  };

	  /**
	   * Allow directly passing components to a route
	   * definition.
	   *
	   * @param {Object} handler
	   */

	  function guardComponent(handler) {
	    var comp = handler.component;
	    if (_.isPlainObject(comp)) {
	      comp = handler.component = Vue.extend(comp);
	    }
	    /* istanbul ignore if */
	    if (typeof comp !== 'function') {
	      handler.component = null;
	      (0, _util.warn)('invalid component for route "' + handler.path + '"');
	    }
	  }
	};

	module.exports = exports['default'];

/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Route Context Object
	 *
	 * @param {String} path
	 * @param {Router} router
	 */

	"use strict";

	var _classCallCheck = __webpack_require__(65)["default"];

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var Route = function Route(path, router) {
	  _classCallCheck(this, Route);

	  this.path = path;
	  this.router = router;

	  var matched = router._recognizer.recognize(path);

	  this.query = matched ? matched.queryParams : {};

	  this.params = matched ? [].reduce.call(matched, function (prev, cur) {
	    if (cur.params) {
	      for (var key in cur.params) {
	        prev[key] = cur.params[key];
	      }
	    }
	    return prev;
	  }, {}) : {};

	  // private stuff
	  this._matched = matched || router._notFoundHandler;
	};

	exports["default"] = Route;
	module.exports = exports["default"];

/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = __webpack_require__(67)['default'];

	var _classCallCheck = __webpack_require__(65)['default'];

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _util = __webpack_require__(60);

	var _pipeline = __webpack_require__(77);

	/**
	 * A RouteTransition object manages the pipeline of a
	 * router-view switching process. This is also the object
	 * passed into user route hooks.
	 *
	 * @param {Router} router
	 * @param {Route} to
	 * @param {Route} from
	 */

	var RouteTransition = (function () {
	  function RouteTransition(router, to, from) {
	    _classCallCheck(this, RouteTransition);

	    this.router = router;
	    this.to = to;
	    this.from = from;
	    this.next = null;
	    this.aborted = false;

	    // start by determine the queues

	    // the deactivate queue is an array of router-view
	    // directive instances that need to be deactivated,
	    // deepest first.
	    this.deactivateQueue = router._views;

	    // check the default handler of the deepest match
	    var matched = to._matched ? Array.prototype.slice.call(to._matched) : [];

	    // the activate queue is an array of route handlers
	    // that need to be activated
	    this.activateQueue = matched.map(function (match) {
	      return match.handler;
	    });
	  }

	  /**
	   * Abort current transition and return to previous location.
	   */

	  _createClass(RouteTransition, [{
	    key: 'abort',
	    value: function abort() {
	      if (!this.aborted) {
	        this.aborted = true;
	        // if the root path throws an error during validation
	        // on initial load, it gets caught in an infinite loop.
	        var abortingOnLoad = !this.from.path && this.to.path === '/';
	        if (!abortingOnLoad) {
	          this.router.replace(this.from.path || '/');
	        }
	      }
	    }

	    /**
	     * Abort current transition and redirect to a new location.
	     *
	     * @param {String} path
	     */

	  }, {
	    key: 'redirect',
	    value: function redirect(path) {
	      if (!this.aborted) {
	        this.aborted = true;
	        path = (0, _util.mapParams)(path, this.to.params, this.to.query);
	        this.router.replace(path);
	      }
	    }

	    /**
	     * A router view transition's pipeline can be described as
	     * follows, assuming we are transitioning from an existing
	     * <router-view> chain [Component A, Component B] to a new
	     * chain [Component A, Component C]:
	     *
	     *  A    A
	     *  | => |
	     *  B    C
	     *
	     * 1. Reusablity phase:
	     *   -> canReuse(A, A)
	     *   -> canReuse(B, C)
	     *   -> determine new queues:
	     *      - deactivation: [B]
	     *      - activation: [C]
	     *
	     * 2. Validation phase:
	     *   -> canDeactivate(B)
	     *   -> canActivate(C)
	     *
	     * 3. Activation phase:
	     *   -> deactivate(B)
	     *   -> activate(C)
	     *
	     * Each of these steps can be asynchronous, and any
	     * step can potentially abort the transition.
	     *
	     * @param {Function} cb
	     */

	  }, {
	    key: 'start',
	    value: function start(cb) {
	      var transition = this;
	      var daq = this.deactivateQueue;
	      var aq = this.activateQueue;
	      var rdaq = daq.slice().reverse();
	      var reuseQueue = undefined;

	      // 1. Reusability phase
	      var i = undefined;
	      for (i = 0; i < rdaq.length; i++) {
	        if (!(0, _pipeline.canReuse)(rdaq[i], aq[i], transition)) {
	          break;
	        }
	      }
	      if (i > 0) {
	        reuseQueue = rdaq.slice(0, i);
	        daq = rdaq.slice(i).reverse();
	        aq = aq.slice(i);
	      }

	      // 2. Validation phase
	      transition.runQueue(daq, _pipeline.canDeactivate, function () {
	        transition.runQueue(aq, _pipeline.canActivate, function () {
	          transition.runQueue(daq, _pipeline.deactivate, function () {
	            // 3. Activation phase

	            // Update router current route
	            transition.router._onTransitionValidated(transition);

	            // trigger reuse for all reused views
	            reuseQueue && reuseQueue.forEach(function (view) {
	              (0, _pipeline.reuse)(view, transition);
	            });

	            // the root of the chain that needs to be replaced
	            // is the top-most non-reusable view.
	            if (daq.length) {
	              var view = daq[daq.length - 1];
	              var depth = reuseQueue ? reuseQueue.length : 0;
	              (0, _pipeline.activate)(view, transition, depth, cb);
	            } else {
	              cb();
	            }
	          });
	        });
	      });
	    }

	    /**
	     * Asynchronously and sequentially apply a function to a
	     * queue.
	     *
	     * @param {Array} queue
	     * @param {Function} fn
	     * @param {Function} cb
	     */

	  }, {
	    key: 'runQueue',
	    value: function runQueue(queue, fn, cb) {
	      var transition = this;
	      step(0);
	      function step(index) {
	        if (index >= queue.length) {
	          cb();
	        } else {
	          fn(queue[index], transition, function () {
	            step(index + 1);
	          });
	        }
	      }
	    }

	    /**
	     * Call a user provided route transition hook and handle
	     * the response (e.g. if the user returns a promise).
	     *
	     * @param {Function} hook
	     * @param {*} [context]
	     * @param {Function} [cb]
	     * @param {Boolean} [expectBoolean]
	     * @param {Function} [cleanup]
	     */

	  }, {
	    key: 'callHook',
	    value: function callHook(hook, context, cb, expectBoolean, cleanup) {
	      var transition = this;
	      var nextCalled = false;

	      // advance the transition to the next step
	      var next = function next(data) {
	        if (nextCalled) {
	          (0, _util.warn)('transition.next() should be called only once.');
	          return;
	        }
	        nextCalled = true;
	        if (!cb || transition.aborted) {
	          return;
	        }
	        cb(data);
	      };

	      // abort the transition
	      var abort = function abort(back) {
	        cleanup && cleanup();
	        transition.abort(back);
	      };

	      // handle errors
	      var onError = function onError(err) {
	        // cleanup indicates an after-activation hook,
	        // so instead of aborting we just let the transition
	        // finish.
	        cleanup ? next() : abort();
	        if (err && !transition.router._suppress) {
	          (0, _util.warn)('Uncaught error during transition: ');
	          throw err instanceof Error ? err : new Error(err);
	        }
	      };

	      // expose a clone of the transition object, so that each
	      // hook gets a clean copy and prevent the user from
	      // messing with the internals.
	      var exposed = {
	        to: transition.to,
	        from: transition.from,
	        abort: abort,
	        next: next,
	        redirect: function redirect() {
	          transition.redirect.apply(transition, arguments);
	        }
	      };

	      // actually call the hook
	      var res = undefined;
	      try {
	        res = hook.call(context, exposed);
	      } catch (err) {
	        return onError(err);
	      }

	      // handle boolean/promise return values
	      var resIsPromise = (0, _util.isPromise)(res);
	      if (expectBoolean) {
	        if (typeof res === 'boolean') {
	          res ? next() : abort();
	        } else if (resIsPromise) {
	          res.then(function (ok) {
	            ok ? next() : abort();
	          }, onError);
	        }
	      } else if (resIsPromise) {
	        res.then(next, onError);
	      }
	    }
	  }]);

	  return RouteTransition;
	})();

	exports['default'] = RouteTransition;
	module.exports = exports['default'];

/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports.canReuse = canReuse;
	exports.canDeactivate = canDeactivate;
	exports.canActivate = canActivate;
	exports.deactivate = deactivate;
	exports.activate = activate;
	exports.reuse = reuse;

	var _util = __webpack_require__(60);

	/**
	 * Determine the reusability of an existing router view.
	 *
	 * @param {Directive} view
	 * @param {Object} handler
	 * @param {Transition} transition
	 */

	function canReuse(view, handler, transition) {
	  var component = view.childVM;
	  if (!component || !handler) {
	    return false;
	  }
	  // important: check view.Component here because it may
	  // have been changed in activate hook
	  if (view.Component !== handler.component) {
	    return false;
	  }
	  var canReuseFn = (0, _util.getRouteConfig)(component, 'canReuse');
	  return typeof canReuseFn === 'boolean' ? canReuseFn : canReuseFn ? canReuseFn.call(component, {
	    to: transition.to,
	    from: transition.from
	  }) : true; // defaults to true
	}

	/**
	 * Check if a component can deactivate.
	 *
	 * @param {Directive} view
	 * @param {Transition} transition
	 * @param {Function} next
	 */

	function canDeactivate(view, transition, next) {
	  var fromComponent = view.childVM;
	  var hook = (0, _util.getRouteConfig)(fromComponent, 'canDeactivate');
	  if (!hook) {
	    next();
	  } else {
	    transition.callHook(hook, fromComponent, next, true);
	  }
	}

	/**
	 * Check if a component can activate.
	 *
	 * @param {Object} handler
	 * @param {Transition} transition
	 * @param {Function} next
	 */

	function canActivate(handler, transition, next) {
	  (0, _util.resolveAsyncComponent)(handler, function (Component) {
	    // have to check due to async-ness
	    if (transition.aborted) {
	      return;
	    }
	    // determine if this component can be activated
	    var hook = (0, _util.getRouteConfig)(Component, 'canActivate');
	    if (!hook) {
	      next();
	    } else {
	      transition.callHook(hook, null, next, true);
	    }
	  });
	}

	/**
	 * Call deactivate hooks for existing router-views.
	 *
	 * @param {Directive} view
	 * @param {Transition} transition
	 * @param {Function} next
	 */

	function deactivate(view, transition, next) {
	  var component = view.childVM;
	  var hook = (0, _util.getRouteConfig)(component, 'deactivate');
	  if (!hook) {
	    next();
	  } else {
	    transition.callHook(hook, component, next);
	  }
	}

	/**
	 * Activate / switch component for a router-view.
	 *
	 * @param {Directive} view
	 * @param {Transition} transition
	 * @param {Number} depth
	 * @param {Function} [cb]
	 */

	function activate(view, transition, depth, cb) {
	  var handler = transition.activateQueue[depth];
	  if (!handler) {
	    view.setComponent(null);
	    cb && cb();
	    return;
	  }

	  var Component = view.Component = handler.component;
	  var activateHook = (0, _util.getRouteConfig)(Component, 'activate');
	  var dataHook = (0, _util.getRouteConfig)(Component, 'data');
	  var waitForData = (0, _util.getRouteConfig)(Component, 'waitForData');

	  // unbuild current component. this step also destroys
	  // and removes all nested child views.
	  view.unbuild(true);
	  // build the new component. this will also create the
	  // direct child view of the current one. it will register
	  // itself as view.childView.
	  var component = view.build({
	    _meta: {
	      $loadingRouteData: !!(dataHook && !waitForData)
	    }
	  });

	  // cleanup the component in case the transition is aborted
	  // before the component is ever inserted.
	  var cleanup = function cleanup() {
	    component.$destroy();
	  };

	  // actually insert the component and trigger transition
	  var insert = function insert() {
	    var router = transition.router;
	    if (router._rendered || router._transitionOnLoad) {
	      view.transition(component);
	    } else {
	      // no transition on first render, manual transition
	      view.setCurrent(component);
	      component.$before(view.anchor, null, false);
	    }
	    cb && cb();
	  };

	  // called after activation hook is resolved
	  var afterActivate = function afterActivate() {
	    // activate the child view
	    if (view.childView) {
	      exports.activate(view.childView, transition, depth + 1);
	    }
	    if (dataHook && waitForData) {
	      // wait until data loaded to insert
	      loadData(component, transition, dataHook, insert, cleanup);
	    } else {
	      // load data and insert at the same time
	      if (dataHook) {
	        loadData(component, transition, dataHook);
	      }
	      insert();
	    }
	  };

	  if (activateHook) {
	    transition.callHook(activateHook, component, afterActivate, false, cleanup);
	  } else {
	    afterActivate();
	  }
	}

	/**
	 * Reuse a view, just reload data if necessary.
	 *
	 * @param {Directive} view
	 * @param {Transition} transition
	 */

	function reuse(view, transition) {
	  var component = view.childVM;
	  var dataHook = (0, _util.getRouteConfig)(component, 'data');
	  if (dataHook) {
	    loadData(component, transition, dataHook);
	  }
	}

	/**
	 * Asynchronously load and apply data to component.
	 *
	 * @param {Vue} component
	 * @param {Transition} transition
	 * @param {Function} hook
	 * @param {Function} cb
	 * @param {Function} cleanup
	 */

	function loadData(component, transition, hook, cb, cleanup) {
	  component.$loadingRouteData = true;
	  transition.callHook(hook, component, function (data) {
	    for (var key in data) {
	      component.$set(key, data[key]);
	    }
	    component.$loadingRouteData = false;
	    cb && cb(data);
	  }, false, cleanup);
	}

/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _util = __webpack_require__(60);

	exports['default'] = function (Vue) {

	  var _ = Vue.util;
	  var componentDef = Vue.directive('_component');
	  // <router-view> extends the internal component directive
	  var viewDef = _.extend({}, componentDef);

	  // with some overrides
	  _.extend(viewDef, {

	    _isRouterView: true,

	    bind: function bind() {
	      var route = this.vm.$route;
	      /* istanbul ignore if */
	      if (!route) {
	        (0, _util.warn)('<router-view> can only be used inside a ' + 'router-enabled app.');
	        return;
	      }
	      // force dynamic directive so v-component doesn't
	      // attempt to build right now
	      this._isDynamicLiteral = true;
	      // finally, init by delegating to v-component
	      componentDef.bind.call(this);
	      // does not support keep-alive.
	      /* istanbul ignore if */
	      if (this.keepAlive) {
	        this.keepAlive = false;
	        (0, _util.warn)('<router-view> does not support keep-alive.');
	      }

	      // all we need to do here is registering this view
	      // in the router. actual component switching will be
	      // managed by the pipeline.
	      var router = this.router = route.router;
	      router._views.unshift(this);

	      // note the views are in reverse order.
	      var parentView = router._views[1];
	      if (parentView) {
	        // register self as a child of the parent view,
	        // instead of activating now. This is so that the
	        // child's activate hook is called after the
	        // parent's has resolved.
	        parentView.childView = this;
	      }
	    },

	    unbind: function unbind() {
	      this.router._views.$remove(this);
	      componentDef.unbind.call(this);
	    }
	  });

	  Vue.elementDirective('router-view', viewDef);
	};

	module.exports = exports['default'];

/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _util = __webpack_require__(60);

	// install v-link, which provides navigation support for
	// HTML5 history mode

	exports['default'] = function (Vue) {

	  var _ = Vue.util;

	  Vue.directive('link', {

	    isLiteral: true,

	    bind: function bind() {
	      var _this = this;

	      var vm = this.vm;
	      /* istanbul ignore if */
	      if (!vm.$route) {
	        (0, _util.warn)('v-link can only be used inside a ' + 'router-enabled app.');
	        return;
	      }
	      var router = vm.$route.router;
	      this.handler = function (e) {
	        if (e.button === 0) {
	          e.preventDefault();
	          if (_this.destination != null) {
	            router.go(_this.destination);
	          }
	        }
	      };
	      this.el.addEventListener('click', this.handler);
	      if (!this._isDynamicLiteral) {
	        this.update(this.expression);
	      }
	      // manage active link class
	      this.unwatch = vm.$watch('$route.path', _.bind(this.updateClasses, this));
	    },

	    updateClasses: function updateClasses(path) {
	      var el = this.el;
	      var dest = this.destination;
	      var router = this.vm.$route.router;
	      var activeClass = router._linkActiveClass;
	      var exactClass = activeClass + '-exact';
	      if (path.indexOf(dest) === 0 && path !== '/') {
	        _.addClass(el, activeClass);
	      } else {
	        _.removeClass(el, activeClass);
	      }
	      if (path === dest) {
	        _.addClass(el, exactClass);
	      } else {
	        _.removeClass(el, exactClass);
	      }
	    },

	    update: function update(path) {
	      this.destination = path;
	      this.updateClasses(this.vm.$route.path);
	      path = path || '';
	      var router = this.vm.$route.router;
	      var isAbsolute = path.charAt(0) === '/';
	      // do not format non-hash relative paths
	      var href = router.mode === 'hash' || isAbsolute ? router.history.formatPath(path) : path;
	      if (this.el.tagName === 'A') {
	        if (href) {
	          this.el.href = href;
	        } else {
	          this.el.removeAttribute('href');
	        }
	      }
	    },

	    unbind: function unbind() {
	      this.el.removeEventListener('click', this.handler);
	      this.unwatch && this.unwatch();
	    }
	  });
	};

	module.exports = exports['default'];

/***/ },
/* 80 */
/***/ function(module, exports) {

	// overriding Vue's $addChild method, so that every child
	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	exports['default'] = function (Vue) {

	  var addChild = Vue.prototype.$addChild;

	  Vue.prototype.$addChild = function (opts, Ctor) {

	    var route = this.$route;
	    var router = route && route.router;

	    // inject meta
	    if (router) {
	      opts = opts || {};
	      var meta = opts._meta = opts._meta || {};
	      meta.$route = route;
	      if (opts._isRouterView) {
	        meta.$loadingRouteData = meta.$loadingRouteData || false;
	      }
	    }

	    var child = addChild.call(this, opts, Ctor);

	    if (router) {
	      // keep track of all children created so we can
	      // update the routes
	      router._children.push(child);
	      child.$on('hook:beforeDestroy', function () {
	        router._children.$remove(child);
	      });
	    }

	    return child;
	  };
	};

	module.exports = exports['default'];
	// instance inherits the route data

/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(82);

	module.exports = {
	  data: function() {
	    return {
	      new_loading: false,
	      old_loading: false,
	      messages: []
	    };
	  },
	  ready: function() {
	    this.god_name = this.$route.params.god_name;
	    return this["new"]();
	  },
	  template: __webpack_require__(84),
	  components: {
	    'twitter': __webpack_require__(12),
	    'github': __webpack_require__(20),
	    'instagram': __webpack_require__(24),
	    'tumblr': __webpack_require__(28)
	  },
	  directives: {
	    'btn-loading': __webpack_require__(32)
	  },
	  methods: {
	    "new": function() {
	      var parm;
	      if (this.new_loading) {
	        return;
	      }
	      this.new_loading = true;
	      parm = JSON.stringify({
	        god_name: this.god_name
	      });
	      return $.ajax({
	        url: '/god',
	        type: 'POST',
	        data: parm,
	        success: (function(_this) {
	          return function(data, status, response) {
	            _this.messages = _.uniq(_.union(_this.messages, data.messages.reverse()), false, function(item, key, a) {
	              return item.row_num;
	            });
	            _this.setTitleUnreadCount(0);
	            return _this.new_loading = false;
	          };
	        })(this)
	      });
	    },
	    old: function() {
	      var parm;
	      if (this.old_loading) {
	        return;
	      }
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
	    scrollTo: function(target, offset) {
	      var y;
	      if (offset == null) {
	        offset = 0;
	      }
	      y = $(target).offset().top;
	      y = y + offset;
	      return window.scrollTo(0, y);
	    },
	    setTitleUnreadCount: function(count) {
	      this.unreadCount = count;
	      if (count === 0) {
	        return document.title = "Follow Center";
	      } else {
	        return document.title = "(" + count + ") Follow Center";
	      }
	    }
	  }
	};


/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(83);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(6)(content, {});
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
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(5)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 84 */
/***/ function(module, exports) {

	module.exports = "<div v-show=\"messages.length != 0 \" class=\"text-center\">\n    <a v-on=\"click:old\" v-btn-loading=\"old_loading\" href='javascript:void(0);' class=\"btn btn-defalt\">历史消息</a>\n</div>\n<component is=\"(%message.m_type%)\" keep-alive v-repeat=\"message in messages\" v-ref=\"c_messages\" v-transition=\"fade\">\n</component>\n<div class=\"text-center\">\n    <a v-on=\"click:new\" v-btn-loading=\"new_loading\" href='javascript:void(0);' class=\"btn btn-defalt\"></a>\n</div>\n";

/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(86);

	module.exports = {
	  data: function() {
	    return {
	      user_info: ''
	    };
	  },
	  ready: function() {
	    return this.getUserInfo(this.$route.params.god_name);
	  },
	  template: __webpack_require__(88),
	  components: {
	    'god_messages': __webpack_require__(81),
	    'user_info': __webpack_require__(35),
	    'add_god': __webpack_require__(50)
	  },
	  methods: {
	    getUserInfo: function(user_name) {
	      var parm;
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
	            return console.log(_this.user_info);
	          };
	        })(this)
	      });
	    }
	  }
	};


/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(87);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(6)(content, {});
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
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(5)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 88 */
/***/ function(module, exports) {

	module.exports = "<div  class=\"col-md-8\">\n    <god_messages></god_messages>\n</div>\n<div class=\"col-md-4\">\n    <div class=\"text-center\">\n        <add_god></add_god>\n    </div>\n    <user_info user_info=\"(%user_info%)\"></user_info>\n</div>\n";

/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	var bz;

	__webpack_require__(90);

	bz = __webpack_require__(15);

	module.exports = {
	  template: __webpack_require__(92),
	  props: ['followed', 'god_id'],
	  data: function() {
	    return {
	      btn_loading: false
	    };
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
	  },
	  directives: {
	    'btn-loading': __webpack_require__(32)
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
	var update = __webpack_require__(6)(content, {});
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

	exports = module.exports = __webpack_require__(5)();
	// imports


	// module
	exports.push([module.id, ".yellow {\n  color: #F39C12;\n}\n", ""]);

	// exports


/***/ },
/* 92 */
/***/ function(module, exports) {

	module.exports = "<button v-btn-loading=\"btn_loading\" v-on=\"click:toggleFollow\" type=\"button\" class=\"btn btn-sm\" aria-label=\"Left Align\">\n</button>\n";

/***/ }
/******/ ]);