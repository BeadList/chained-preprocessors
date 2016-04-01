import { expect } from 'chai';
import chainedPreprocessors from '../src/chained-preprocessors';

describe('chainedPreprocessors', () => {
  let mdHbs =(`
    Hello
    =====

    {{ title }}
  `).replace(/\n {2}/g,'\n');

  let hbsEjs = `
    <%= title %>
    {{ title }}
  `.replace(/\n {2}/g,'\n');

  let options = {
    all:
    {
      title: 'Bazinga',
      primaryColor: 'red',
      environment: 'development'
    }
  };
  let stylesPath = __dirname + '/fixtures/styles.css.sass.ejs';

  describe('.render', () => {
    it('runs all prerpocessors', (done) => {
      chainedPreprocessors
        .render(mdHbs, ['hbs', 'md'], options, (err, html) => {
          expect(html).to.equal('<h1>Hello</h1>\n<p>Bazinga</p>\n');
          done();
        });
    });
  });

  describe('.renderFile', () => {
    it('runs all prerpocessors', (done) => {
      chainedPreprocessors
        .renderFile(stylesPath, options, (err, css) => {
          expect(css).to
            .equal('.header {\n  background: red;\n  font-weight: bold; }\n');
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
        `).replace(/\n {8}/g,'\n'));
        done();
      });
    });

    it('uses preprocessor specific options', (done) => {
      let options = {
        hbs: { title: 'HBS' },
        ejs: { title: 'EJS' }
      };
      chainedPreprocessors.renderOne(hbsEjs, 'hbs', options, (err, html) => {
        expect(html).to.equal((`
          <%= title %>
          HBS
        `).replace(/\n {8}/g,'\n'));
        done();
      });
    });
  });

  describe('.extensionsToPreprocess', () => {
    it('returns array of extensions with one in reverse order', () => {
      var extensions = chainedPreprocessors.extensionsToPreprocess(stylesPath);
      expect(extensions).to.deep.equal(['ejs', 'sass']);
    });
  });

  describe('.preprocessedName', () => {
    it('returns clean name after preprocessing', () => {
      let name =  chainedPreprocessors.preprocessedName(stylesPath);
      expect(name).to.equal(__dirname + '/fixtures/styles.css');
    });
  });

  describe.only('option normalizeHelpers', (done) => {
    const ejs = "<p><%= color('fulvous') %></p>";
    let options = {
      all: {
        prefix: 'My favorite color is'
      },
      normalizeHelpers: true,
      helpers: {
        color: function(value) {
          expect(arguments.length).to.equal(1);
          expect(arguments[0]).to.equal('fulvous');
          expect(this.prefix).to.equal('My favorite color is');
          expect(this.color).to.be.a('function');
          return `${this.prefix} ${value}`;
        }
      }
    };

    it('normalizes helpers for ejs', (done) => {
      chainedPreprocessors
        .render(ejs, ['ejs'], options, (err, html) => {
          console.log(err);
          expect(html).to.equal('<p>My favorite color is fulvous</p>');
          done();
        });
    });
  });
});
