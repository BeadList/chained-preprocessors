Chained Preprocessors
=====================

Chained Preprocessors brings the ease of using different preprocessors together.
You can use as many preprocessors as you want, although you have to preinstall
them via npm. Just add them to package file.
In order to use  preprocessors you have to chain extensions of file,
in order reverse to preprocessing. I.e. for `file.html.md.hbs` first
will be used handlebars preprocessor, and then markdown.


Installation
------------

```shell
npm install --save chained-preprocessors
```

Install preprocessors you want to use, i.e.:

```shell
npm install --save coffee-script node-sass handlebars commonmark ejs

```


Usage
-----

```js
  var chainedPreprocessors = require('chained-preprocessors');
  var options = {
    all: {
      user: 'Bill Murray'
    }
  };

  chainedPreprocessors
    .renderFile('./pages/index.md.hbs', options, function (err, html){
      console.log(html);
    });

  // Or pass contents of file, and file extensions ordered by related
  // preprocessor to be used i.e. for same file:

    chainedPreprocessors
    .render(fileContents, ['hbs', 'md'], options, function (err, html) {
      console.log(html);
    });
```

You can specify preprocessor specific options via its key, like this:

```js
  var options = {
    all: {
      user: 'Bill Murray',
    },
    hbs: {
      user: 'Tom Hanks,
      noEscape: true
    }
  };
```
Options
-------

You can normalize helpers - pass context as this to helper functions, as well
not passing template specific arguments. For that you can use `normalizeHelpers`
options along with `helpers` object of functions. Template specific arguments
then can be accessed via `this.arguments`. Also for template engines which do
not support helpers, functions will be just flatten to the context object.

```js
{
  normalizeHelpers: true,
  helpers: {
    fullName: (firstName) => {
       firstName + this.lastName;
    }
  }
}
```

Examples
--------

So let's say you want to pass some variables to you sass stylesheets, no
problem:

```scss
/* styles.css.scss.ejs */

$primary-color: <%= primaryColor %>

.header {
  background: $primary-color;
  <% if (environment === 'development') { %>
    font-weight: bold;
  <% } %>
}
```

```js
  var options = {
    all: {
      primaryColor: 'red',
      environment: 'development'
    }
  };

  chainedPreprocessors
    .renderFile('styles.css.scss.ejs', options, function (err, html) {
    console.log(html);
  });
```

Will result in:

```css
.header {
  background: red;
  font-weight: bold;
}
```
