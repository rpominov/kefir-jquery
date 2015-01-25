# kefir-jquery [![Build Status](https://travis-ci.org/pozadi/kefir-jquery.svg?branch=master)](https://travis-ci.org/pozadi/kefir-jquery)

jQuery bindings for [Kefir.js](https://pozadi.github.io/kefir/)


# Installation

## NPM

```
npm install kefir-jquery
```

## Bower

```
bower install kefir-jquery
```

## Without pakage management

```html
<script src="...kefir.js"></script>
<script src="...jquery.js"></script>

<!-- You can take it file from this repo -->
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

... TODO

