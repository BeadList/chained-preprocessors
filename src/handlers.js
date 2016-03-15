/*global module, require */

let consolidate = undefined;

let handlers =  {
  consolidate(engine) {
    consolidate = consolidate || require('consolidate');
    return ((engine) => {
      return (contents, options, cb) => {
        consolidate[engine].render(contents, options, cb);
      };})(engine);
  }
}

module.exports = handlers;
export default handlers;
