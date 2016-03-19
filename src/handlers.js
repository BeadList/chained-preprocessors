/*global module, require */

let consolidate = undefined;
let commonmark = undefined;
let sass = undefined;
let coffeeScript = undefined;
let handlers =  {
  consolidate(engine) {
    consolidate = consolidate || require('consolidate');
    return ((engine) => {
      return (contents, options, cb) => {
        consolidate[engine].render(contents, options, cb);
      };})(engine);
  },

  markdown(contents, options, cb) {
    commonmark = commonmark || require('commonmark');
    try {
      let reader = new commonmark.Parser();
      let writer = new commonmark.HtmlRenderer();
      let parsed = reader.parse(contents);
      cb(null, writer.render(parsed));
    } catch (err) {
      cb(err, null);
    }
  },


  coffeescript(contents, options, cb) {
    coffeeScript = coffeeScript || require('coffee-script');
    try {
      cb(null, coffeeScript.compile(contents, options));
    } catch (err) {
      cb(err, null);
    }
  },


  sass(contents, options, cb) {
    sass = sass || require('node-sass');

    options.indentedSyntax = true;
    options.data = contents;

    try {
      sass.render(options, function(err, obj){
        if (err) {
          cb(err, null);
          return;
        }
        cb(err, obj.css.toString());
      });
    } catch (err) {
      cb(err, null);
    }
  }
}

module.exports = handlers;
export default handlers;
