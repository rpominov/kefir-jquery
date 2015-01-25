;(function(global){
  "use strict";



  function init(Kefir, $) {



    $.fn.asKefirStream = function(eventName, selector, transformer) {
      var $el = this;
      if (transformer == null && selector != null && 'string' !== typeof selector) {
        transformer = selector;
        selector = null;
      }
      return Kefir.fromSubUnsub(
        function(handler) {  $el.on(eventName, selector, handler)  },
        function(handler) {  $el.off(eventName, selector, handler)  },
        transformer
      ).setName('asKefirStream');
    }



    $.fn.asKefirProperty = function(eventName, selector, getter) {
      if (getter == null) {
        getter = selector;
        selector = null;
      }
      return this.asKefirStream(eventName, selector, getter)
        .toProperty(getter())
        .setName('asKefirProperty');
    }



  }




  var exports = {
    init: init
  };

  if (typeof define === 'function' && define.amd) {
    define([], function() {
      return exports;
    });
    global.KefirJQuery = exports;
  } else if (typeof module === "object" && typeof exports === "object") {
    module.exports = exports;
  } else {
    global.KefirJQuery = exports;
  }

}(this));
