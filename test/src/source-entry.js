var Kefir = require('kefir');
var jQuery = require('jquery');
var kefirJQuery = require('../../kefir-jquery');

kefirJQuery.init(Kefir, jQuery);

window.Kefir = Kefir;
window.jQuery = jQuery;
