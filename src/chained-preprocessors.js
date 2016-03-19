/*global module */

import fs from 'fs';
import path from 'path';

import handlers from './handlers';

let chainedPreprocessors = {
  render(contents, extensions, options, cb) {
    if (extensions.length == 0) {
      cb(null, contents);
      return;
    }

    this.renderOne(contents, extensions[0], options, (err, newContents) => {
      if (err) {
        cb(err);
        return;
      }
      let newExtensions = extensions.slice(1, extensions.length);
      this.render(newContents, newExtensions, options, cb);
    });
  },

  renderFile(file, options, cb) {
    fs.readFile(file, (err, data) => {
      if (err) {
        cb(err);
        return;
      }
      let extensions = this.extensionsToPreprocess(file);
      this.render(data.toString(), extensions, options, cb);
    });
  },

  renderOne(contents, extension, options, cb) {
    let newOptions = Object.assign({}, options.all, options[extension]);
    this.extensionsMap[extension].handler(contents, newOptions, cb);
  },

  extensionsToPreprocess(file) {
    let allExtensions = path.basename(file).split('.').reverse();
    return allExtensions.slice(0, allExtensions.length - 2);
  },

  preprocessedName(file) {
    return file.replace(/(\.[^.]+)\..+/,'$1');
  },

  extensionsMap: {
    ejs:     { engine: 'ejs',          type: 'html', handler: handlers.consolidate('ejs') },
    hbs:     { engine: 'handlebars',   type: 'html', handler: handlers.consolidate('handlebars') },
    jade:    { engine: 'jade',         type: 'html', handler: handlers.consolidate('jade') },
    md:      { engine: 'markdown',     type: 'html', handler: handlers.markdown },

    coffee:  { engine: 'coffeescript', type: 'js',   handler: handlers.coffeescript },

    sass:    { engine: 'sass',         type: 'css',  handler: handlers.sass }
  }
};


module.exports = chainedPreprocessors;
export default chainedPreprocessors;
