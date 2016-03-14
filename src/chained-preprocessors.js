/*global module, require */

let consolidate = undefined;

let consolidateHandler = (engine) => {
  consolidate = consolidate || require('consolidate');
  return ((engine) => {
    return (contents, options, cb) => {
      consolidate[engine].render(contents, options, cb);
    };})(engine);
};

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
    hbs: { engine:'handlebars', type: 'html', handler: consolidateHandler('handlebars') }
  }
};


module.exports = chainedPreprocessors;
export default chainedPreprocessors;
