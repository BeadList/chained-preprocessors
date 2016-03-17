'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/*global module, require */

var _consolidate = undefined;
var commonmark = undefined;
var _sass = undefined;
var coffeeScript = undefined;
var handlers = {
  consolidate: function consolidate(engine) {
    _consolidate = _consolidate || require('consolidate');
    return function (engine) {
      return function (contents, options, cb) {
        _consolidate[engine].render(contents, options, cb);
      };
    }(engine);
  },
  markdown: function markdown(contents, options, cb) {
    commonmark = commonmark || require('commonmark');
    try {
      var reader = new commonmark.Parser();
      var writer = new commonmark.HtmlRenderer();
      var parsed = reader.parse(contents);
      cb(null, writer.render(parsed));
    } catch (err) {
      cb(err, null);
    }
  },
  coffeescript: function coffeescript(contents, options, cb) {
    coffeeScript = coffeeScript || require('coffee-script');
    try {
      cb(null, coffeeScript.compile(contents, options));
    } catch (err) {
      cb(err, null);
    }
  },
  sass: function sass(contents, options, cb) {
    _sass = _sass || require('node-sass');
    var newOptions = Object.assign({
      indentedSyntax: true,
      data: contents
    });

    try {
      _sass.render(newOptions, function (err, obj) {
        cb(err, obj.css.toString());
      });
    } catch (err) {
      cb(err, null);
    }
  }
};

module.exports = handlers;
exports.default = handlers;