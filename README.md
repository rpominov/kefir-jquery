# kefir-jquery [![Build Status](https://travis-ci.org/pozadi/kefir-jquery.svg?branch=master)](https://travis-ci.org/pozadi/kefir-jquery)

jQuery bindings for [Kefir.js](https://pozadi.github.io/kefir/)


# Installation

### NPM

```
npm install kefir-jquery
```

### Bower

```
bower install kefir-jquery
```

### Without package management

```html
<script src="...kefir.js"></script>
<script src="...jquery.js"></script>

<!-- You can take this file from this repo -->
<script src="...kefir-jquery.js"></script>
```


# Initialisation

Before you'll be able to use this plugin, you must call `kefirJQuery.init` method,
which will add methods to your `jQuery.fn` object.

```js
// with browserify, webpack, etc.

var Kefir = require('kefir');
var jQuery = require('jquery');
var kefirJQuery = require('kefir-jquery');

kefirJQuery.init(Kefir, jQuery);
```

```js
// with globals

window.kefirJQuery.init(window.Kefir, window.jQuery);
```


# API

### asKefirStream

`$(...).asKefirStream(eventName, [selector], [eventTransformer])`

Creates a stream from events on a jQuery object. This methods mimics
[jQuery .on method](http://api.jquery.com/on/) with two exceptions:
it not accepts **data** argument, and instead of **handler** function
it accepts optional **eventTransformer** function, which, if provided,
will be called on each event with same arguments and context as jQuery
**handler** callback, and value returned by **eventTransformer** will be emitted
to Kefir stream. If no **eventTransformer** provided,
jQuery event object will be emited in stream.

Example:
```js
var clicks = $('body').asKefirStream('click');
clicks.log();

// Will print:
//    > [asKefirStream] <value> jQuery.Event {originalEvent: MouseEvent...}
//    > [asKefirStream] <value> jQuery.Event {originalEvent: MouseEvent...}
//    > [asKefirStream] <value> jQuery.Event {originalEvent: MouseEvent...}
//
// Events in time:
//    clicks: ----•---------•-------------•---
//       jQuery.Event   jQuery.Event   jQuery.Event
```

Example with optional arguments:
```js
var clicksOnContainer = $('body').asKefirStream('click', '.container');
clicksOnContainer.log('[clicks on .container]');

var clicksPageX = $('body').asKefirStream('click', function(e) {return e.pageX});
clicksPageX.log('[e.pageX]');

// Will print:
//    > [clicks on .container] <value> jQuery.Event {originalEvent: MouseEvent...}
//    > [e.pageX] <value> 643
//    > [e.pageX] <value> 15
//    > [clicks on .container] <value> jQuery.Event {originalEvent: MouseEvent...}
//    > [e.pageX] <value> 721
//
// Events in time:
//    clicksOnContainer: ----•-------•---
//                  jQuery.Event   jQuery.Event
//    clicksPageX:       ----•---•---•---
//                         643  15   721
```

### asKefirProperty

`$(...).asKefirProperty(eventName, [selector], getter)`

This method is a shorthand for:<br>
`$(...).asKefirStream(eventName, [selector], getter).toProperty(getter())`

Like **asKefirStream**, but instead of optional **eventTransformer**
accepts required **getter** function, which is called like **eventTransformer**
for each new event, but also called once without any argument
at moment when property is created.
Also unlike **asKefirStream** returns a property.

Example:
```js
var cursorPosition = $('body').asKefirProperty('mousemove', function(event) {
  if (!event) { // if no event passed then it's an "on creation" call
    return [0, 0];
  } else {
    return [event.pageX, event.pageY];
  }
});
cursorPosition.log();

// Will print:
//    > [asKefirProperty] <value:current> [0, 0]
//    > [asKefirProperty] <value> [551, 1168]
//    > [asKefirProperty] <value> [551, 1168]
//    > [asKefirProperty] <value> [556, 1161]
//    > ...
//
// Events in time:
//    cursorPosition: •-----------•-----------•-----------•---
//                 [0,0]  [551,1168]  [551,1168]  [556,1161]
```
