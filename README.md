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

```
<script src="...kefir.js"></script>
<script src="...jquery.js"></script>
<script src="...kefir-jquery.js"></script> <!-- You can take this file from this repo -->
```


# Initialisation

Before you'll be able to use this plugin, you must call `kefirJQuery.init` method,
which will add methods to your `jQuery.fn` object.

```
// with browserify, webpack, etc.

var Kefir = require('kefir');
var jQuery = require('jquery');
var kefirJQuery = require('kefir-jquery');

kefirJQuery.init(Kefir, jQuery);
```

```
// with globals

window.kefirJQuery.init(window.Kefir, window.jQuery);
```


# API

... TODO

