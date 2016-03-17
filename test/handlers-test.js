/*global describe it beforeEach Application */
import { expect } from 'chai';
import handlers from '../src/handlers';

describe('handlers', () => {
  let options = { title: 'Bazinga' };
  let handlebars = '<h1>{{title}}</h1>';
  let markdown = '# Hello';
  let coffeescript = '(x) ->';
  let sass = '.main\n border: blue';

  describe('.consolidate', () => {
    it('renders', (done) => {
      handlers.consolidate('handlebars')(handlebars, options, (err, html) => {
        expect(html).to.equal('<h1>Bazinga</h1>');
        done();
      });
    });
  });

  describe('.markdown', () => {
    it('renders', (done) => {
      handlers.markdown(markdown, options, (err, html) => {
        expect(html).to.equal('<h1>Hello</h1>\n');
        done();
      });
    });
  });


  describe('.coffeescript', () => {
    it('renders', (done) => {
      handlers.coffeescript(coffeescript, options, (err, js) => {
        expect(js).to.equal('(function() {\n  (function(x) {});\n\n}).call(this);\n');
        done();
      });
    });
  });


  describe('.sass', () => {
    it('renders', (done) => {
      handlers.sass(sass, options, (err, css) => {
        expect(css).to.equal('.main {\n  border: blue; }\n');
        done();
      });
    });
  });
});
