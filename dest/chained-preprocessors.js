'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _handlers = require('./handlers');

var _handlers2 = _interopRequireDefault(_handlers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var chainedPreprocessors = {
  render: function render(contents, extensions, options, cb) {
    var _this = this;

    if (extensions.length == 0) {
      cb(null, contents);
      return;
    }

    this.renderOne(contents, extensions[0], options, function (err, newContents) {
      if (err) {
        cb(err);
        return;
      }
      var newExtensions = extensions.slice(1, extensions.length);
      _this.render(newContents, newExtensions, options, cb);
    });
  },
  renderFile: function renderFile(file, options, cb) {
    var _this2 = this;

    _fs2.default.readFile(file, function (err, data) {
      if (err) {
        cb(err);
        return;
      }
      var extensions = _this2.extensionsToPreprocess(file);
      _this2.render(data.toString(), extensions, options, cb);
    });
  },
  renderOne: function renderOne(contents, extension, options, cb) {
    this.extensionsMap[extension].handler(contents, options.all, cb);
  },
  extensionsToPreprocess: function extensionsToPreprocess(file) {
    var allExtensions = _path2.default.basename(file).split('.').reverse();
    return allExtensions.slice(0, allExtensions.length - 2);
  },
  preprocessedName: function preprocessedName(file) {
    return file.replace(/(\.[^.]+)\..+/, '$1');
  },


  extensionsMap: {
    ejs: { engine: 'ejs', type: 'html', handler: _handlers2.default.consolidate('ejs') },
    hbs: { engine: 'handlebars', type: 'html', handler: _handlers2.default.consolidate('handlebars') },
    jade: { engine: 'jade', type: 'html', handler: _handlers2.default.consolidate('jade') },
    md: { engine: 'markdown', type: 'html', handler: _handlers2.default.markdown },

    coffee: { engine: 'coffeescript', type: 'js', handler: _handlers2.default.coffeescript },

    sass: { engine: 'sass', type: 'css', handler: _handlers2.default.sass }
  }
}; /*global module */

module.exports = chainedPreprocessors;
exports.default = chainedPreprocessors;