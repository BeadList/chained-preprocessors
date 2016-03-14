/*global describe it beforeEach Application */
import { expect } from 'chai';
import chainedPreprocessors from '../src/chained-preprocessors';

describe('chainedPreprocessors', () => {
  let mdHbs = `
    Hello
    =====

    {{ title }}
  `;
  let options = { all: { title: 'Bazinga' } };
  describe('.render', () => {
    it('runs all prerpocessors', (done) => {
      chainedPreprocessors
        .render(mdHbs, ['hbs', 'md'], options, (err, html) => {
          expect(html).to.equal(`<h1>Hello</h1>`);
          done();
        });
    });
  });

  describe('.renderOne', () => {
    it('runs one preprocessor', (done) => {
      chainedPreprocessors.renderOne(mdHbs, 'hbs', options, (err, html) => {
        expect(html).to.equal((`
          Hello
          =====

          Bazinga
        `).replace(/\n {6}/g,'\n'));
        done();
      });
    });
  });
});
