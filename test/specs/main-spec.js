// Sorry for the not great code readability, ported from coffee ...

function countListentrs($el, event, selector) {
  var allListeners, count, listener, _i, _len, _ref;
  // http://stackoverflow.com/questions/2518421/
  allListeners = $._data($el.get(0), "events");
  count = 0;
  if ((allListeners != null ? allListeners[event] : void 0) != null) {
    _ref = allListeners[event];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      listener = _ref[_i];
      if (listener.selector === selector) {
        count++;
      }
    }
  }
  return count;
};

function withDOM(cb) {
  var div = document.createElement('div');
  document.body.appendChild(div);
  cb(div);
  document.body.removeChild(div);
}

function toLogEntry(event) {
  if (event.type === 'value') {
    if (event.current) {
      return {
        current: event.value
      };
    } else {
      return event.value;
    }
  } else if (event.type === 'error') {
    if (event.current) {
      return {
        currentError: event.value
      };
    } else {
      return {
        error: event.value
      };
    }
  } else {
    if (event.current) {
      return '<end:current>';
    } else {
      return '<end>';
    }
  }
}

function watch(obs) {
  var fn, log, unwatch;
  log = [];
  fn = function(event) {
    return log.push(toLogEntry(event));
  };
  unwatch = function() {
    return obs.offAny(fn);
  };
  obs.onAny(fn);
  return {
    log: log,
    unwatch: unwatch
  };
}

function expectToEmit(observable, expectedLog, cb) {
  var watchResult = watch(observable);
  cb && cb();
  watchResult.unwatch();
  expect(watchResult.log).toEqual(expectedLog);
}

var $ = window.jQuery;



describe("making sure test enviroment is ok", function() {


  it("window.Kefir & window.jQuery should be defined", function() {
    expect(window.Kefir).toBeDefined();
    expect(window.jQuery).toBeDefined();
  });

  describe('countListentrs()', function() {

    it('returns 0 when no listeners at all', function() {
      withDOM(function(tmpDom) {
        expect(countListentrs($(tmpDom), 'click')).toBe(0);
        expect(countListentrs($(tmpDom), 'click', '.foo')).toBe(0);
      });
    });

    it('returns 0 when there is listeners but for different event', function() {
      withDOM(function(tmpDom) {
        $(tmpDom).on('mouseover', function() {});
        expect(countListentrs($(tmpDom), 'click')).toBe(0);
        expect(countListentrs($(tmpDom), 'click', '.foo')).toBe(0);
      });
    });

    it('returns 0 when there is listeners but for different selector', function() {
      withDOM(function(tmpDom) {
        $(tmpDom).on('click', '.bar', function() {});
        expect(countListentrs($(tmpDom), 'click')).toBe(0);
        expect(countListentrs($(tmpDom), 'click', '.foo')).toBe(0);
      });
    });

    it('returns right ammount of listeners', function() {
      withDOM(function(tmpDom) {
        $(tmpDom).on('mouseover', function() {});
        $(tmpDom).on('click', function() {});
        $(tmpDom).on('click', '.foo', function() {});
        $(tmpDom).on('click', '.foo', function() {});
        $(tmpDom).on('click', '.bar', function() {});
        expect(countListentrs($(tmpDom), 'click')).toBe(1);
        expect(countListentrs($(tmpDom), 'click', '.foo')).toBe(2);
        $(tmpDom).off('click');
        expect(countListentrs($(tmpDom), 'click')).toBe(0);
        expect(countListentrs($(tmpDom), 'click', '.foo')).toBe(0);
        expect(countListentrs($(tmpDom), 'mouseover')).toBe(1);
      });
    });

    it('returns right ammount of listeners (custom events)', function() {
      withDOM(function(tmpDom) {
        $(tmpDom).on('kick', function() {});
        $(tmpDom).on('lick', function() {});
        $(tmpDom).on('lick', '.foo', function() {});
        $(tmpDom).on('lick', '.foo', function() {});
        $(tmpDom).on('lick', '.bar', function() {});
        expect(countListentrs($(tmpDom), 'lick')).toBe(1);
        expect(countListentrs($(tmpDom), 'lick', '.foo')).toBe(2);
        $(tmpDom).off('lick');
        expect(countListentrs($(tmpDom), 'lick')).toBe(0);
        expect(countListentrs($(tmpDom), 'lick', '.foo')).toBe(0);
        expect(countListentrs($(tmpDom), 'kick')).toBe(1);
      });
    });

  });



  describe('$.fn.trigger()', function() {

    it('callback being called', function() {
      withDOM(function(tmpDom) {
        var callCount;
        callCount = 0;
        $(tmpDom).on('click', function() {
          callCount++;
        });
        expect(callCount).toBe(0);
        $(tmpDom).trigger('click');
        expect(callCount).toBe(1);
        $(tmpDom).trigger('click');
        expect(callCount).toBe(2);
      });
    });

    it('callback being called (custom event)', function() {
      withDOM(function(tmpDom) {
        var callCount;
        callCount = 0;
        $(tmpDom).on('lick', function() {
          callCount++;
        });
        expect(callCount).toBe(0);
        $(tmpDom).trigger('lick');
        expect(callCount).toBe(1);
        $(tmpDom).trigger('lick');
        expect(callCount).toBe(2);
      });
    });

    it('callback with selector being called', function() {
      withDOM(function(tmpDom) {
        var $bar, $foo, callCount;
        callCount = 0;
        $(tmpDom).on('click', '.foo', function() {
          callCount++;
        });
        $foo = $('<div class="foo"></div>').appendTo(tmpDom);
        expect(callCount).toBe(0);
        $foo.trigger('click');
        expect(callCount).toBe(1);
        $foo.trigger('click');
        expect(callCount).toBe(2);
        $bar = $('<div class="bar"></div>').appendTo(tmpDom);
        $bar.trigger('click');
        expect(callCount).toBe(2);
      });
    });

    it('callback with selector being called (custom event)', function() {
      withDOM(function(tmpDom) {
        var $bar, $foo, callCount;
        callCount = 0;
        $(tmpDom).on('lick', '.foo', function() {
          callCount++;
        });
        $foo = $('<div class="foo"></div>').appendTo(tmpDom);
        expect(callCount).toBe(0);
        $foo.trigger('lick');
        expect(callCount).toBe(1);
        $foo.trigger('lick');
        expect(callCount).toBe(2);
        $bar = $('<div class="bar"></div>').appendTo(tmpDom);
        $bar.trigger('lick');
        expect(callCount).toBe(2);
      });
    });

  });

});



describe('$.fn.asKefirStream()', function() {

  it('should return stream', function() {
    withDOM(function(tmpDom) {
      expect($(tmpDom).asKefirStream('click')).toEqual(jasmine.any(Kefir.Stream));
    });
  });

  it('should add/remove jquery-listener on activation/deactivation', function() {
    withDOM(function(tmpDom) {
      var clicks, f, f2, licks;
      clicks = $(tmpDom).asKefirStream('click');
      licks = $(tmpDom).asKefirStream('lick');
      f = function() {};
      f2 = function() {};
      expect(countListentrs($(tmpDom), 'click')).toBe(0);
      expect(countListentrs($(tmpDom), 'lick')).toBe(0);
      clicks.onValue(f);
      expect(countListentrs($(tmpDom), 'click')).toBe(1);
      expect(countListentrs($(tmpDom), 'lick')).toBe(0);
      licks.onValue(f);
      clicks.onValue(f2);
      expect(countListentrs($(tmpDom), 'click')).toBe(1);
      expect(countListentrs($(tmpDom), 'lick')).toBe(1);
      licks.offValue(f);
      expect(countListentrs($(tmpDom), 'click')).toBe(1);
      expect(countListentrs($(tmpDom), 'lick')).toBe(0);
      clicks.offValue(f);
      expect(countListentrs($(tmpDom), 'click')).toBe(1);
      expect(countListentrs($(tmpDom), 'lick')).toBe(0);
      clicks.offValue(f2);
      expect(countListentrs($(tmpDom), 'click')).toBe(0);
      expect(countListentrs($(tmpDom), 'lick')).toBe(0);
    });
  });

  it('should add/remove jquery-listener on activation/deactivation (with selector)', function() {
    withDOM(function(tmpDom) {
      var clicks, f;
      clicks = $(tmpDom).asKefirStream('click', '.foo');
      expect(countListentrs($(tmpDom), 'click', '.foo')).toBe(0);
      clicks.onValue(f = function() {});
      expect(countListentrs($(tmpDom), 'click', '.foo')).toBe(1);
      clicks.offValue(f);
      expect(countListentrs($(tmpDom), 'click', '.foo')).toBe(0);
    });
  });

  it('should deliver events', function() {
    withDOM(function(tmpDom) {
      var stream = $(tmpDom).asKefirStream('click').map(function(e) {
        return e.type;
      });
      expectToEmit(stream, ['click', 'click'], function() {
        $(tmpDom).trigger('click').trigger('click');
      });
    });
  });

  it('should deliver events (with selector)', function() {
    withDOM(function(tmpDom) {
      var stream = $(tmpDom).asKefirStream('click', '.foo').map(function(e) {
        return $(e.target).attr('class');
      });
      expectToEmit(stream, ['foo', 'foo', 'foo bar'], function() {
        var $bar, $foo;
        $foo = $('<div class="foo"></div>').appendTo(tmpDom);
        $foo.trigger('click').trigger('click');
        $bar = $('<div class="foo bar"></div>').appendTo(tmpDom);
        $bar.trigger('click');
        $bar.removeClass('foo');
        $bar.trigger('click');
      });
    });
  });

  it('should accept optional transformer fn', function() {
    withDOM(function(tmpDom) {
      var stream = $(tmpDom).asKefirStream('click', function(e) {
        return e.type;
      });
      expectToEmit(stream, ['click', 'click'], function() {
        $(tmpDom).trigger('click').trigger('click');
      });
    });
  });

  it('should pass data to transformer', function() {
    withDOM(function(tmpDom) {
      var stream = $(tmpDom).asKefirStream('click', function(e, data) {
        return data;
      });
      expectToEmit(stream, [1, 2], function() {
        $(tmpDom).trigger('click', 1).trigger('click', 2);
      });
    });
  });

  it('should call transformer with correct this context', function() {
    withDOM(function(tmpDom) {
      var stream = $(tmpDom).asKefirStream('click', function(e) {
        return e.currentTarget === this;
      })
      expectToEmit(stream, [true, true], function() {
        $(tmpDom).trigger('click').trigger('click');
      });
    });
  });

});




describe('$.fn.asKefirProperty()', function() {

  it('should return property', function() {
    withDOM(function(tmpDom) {
      expect($(tmpDom).asKefirProperty('click', function() {})).toEqual(jasmine.any(Kefir.Property));
    });
  });

  it('should throw if no getter provided', function() {
    withDOM(function(tmpDom) {
      expect(function() {
        $(tmpDom).asKefirProperty('click');
      }).toThrow();
      expect(function() {
        $(tmpDom).asKefirProperty('click', '.foo');
      }).toThrow();
    });
  });

  it('should call getter immediately after creation (without event)', function() {
    withDOM(function(tmpDom) {
      var count;
      count = 0;
      $(tmpDom).asKefirProperty('click', function(event) {
        if (event === void 0) {
          count++;
        }
      });
      expect(count).toBe(1);
    });
  });

  it('should has current value returned by getter', function() {
    withDOM(function(tmpDom) {
      var property = $(tmpDom).asKefirProperty('click', function() {
        return 0;
      });
      expectToEmit(property, [
        {
          current: 0
        }
      ]);
    });
  });

  it('should handle events', function() {
    withDOM(function(tmpDom) {
      var i;
      i = 0;
      var property = $(tmpDom).asKefirProperty('click', function(event, data) {
        if (!event) {
          return 0;
        } else {
          if (event.type === 'click' && event.currentTarget === this) {
            return data;
          } else {
            return -1;
          }
        }
      });
      expectToEmit(property, [
        {
          current: 0
        }, 1, 2
      ], function() {
        $(tmpDom).trigger('click', 1).trigger('click', 2);
      });
    });
  });

});
