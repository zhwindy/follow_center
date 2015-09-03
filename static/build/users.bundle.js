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
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	var Vue, v_users;

	Vue = __webpack_require__(5);

	v_users = new Vue({
	  created: function() {
	    return bz.setOnErrorVm(this);
	  },
	  el: '#v_users'
	});


/***/ },

/***/ 5:
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


/***/ }

/******/ });