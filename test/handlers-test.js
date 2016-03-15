/*global describe it beforeEach Application */
import { expect } from 'chai';
import handlers from '../src/handlers';

describe('handlers', () => {
  let options = { title: 'Bazinga' };
  let handlebars = '<h1>{{title}}</h1>';

  describe('.consolidate', () => {
    it('renders', (done) => {
      handlers.consolidate('handlebars')(handlebars, options, (err, html) => {
        expect(html).to.equal('<h1>Bazinga</h1>');
        done();
      });
    });
  });
});
