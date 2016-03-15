/*global module */

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

  renderOne(contents, extension, options, cb) {
    this.extensionsMap[extension].handler(contents, options.all, cb);
  },

  extensionsMap: {
    ejs: { engine:'ejs',              type: 'html', handler: handlers.consolidate('ejs') },
    hbs: { engine:'handlebars',       type: 'html', handler: handlers.consolidate('handlebars') },
    md:  { engine:'markdown',         type: 'html', handler: handlers.markdown },

    coffee:  { engine:'coffeescript', type: 'js', handler: handlers.coffeescript }
  }
};


module.exports = chainedPreprocessors;
export default chainedPreprocessors;
