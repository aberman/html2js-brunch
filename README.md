##html2js-brunch [![Build Status](https://travis-ci.org/aberman/html2js-brunch.png?branch=master)](https://travis-ci.org/aberman/html2js-brunch)

Mimics [grunt-html2js](https://github.com/karlgoldstein/grunt-html2js) behavior for brunch.

###Usage

Install the plugin using npm: `npm install --save html2js-brunch`.

To install manually:

* Add `"html2js-brunch": "x.y.z"` to your `package.json` in your brunch app.
* If you want the git version of the plugin, you can use: `"html2js-brunch": "https://github.com/aberman/html2js-brunch.git"`.

Example:

**NOTE: In order for this plugin to recognize templates, they must have a .tpl.html extension.**

The following example will create a single JavaScript file called templates-app.js in the public/js directory with an Angular module named 'templates-app', which will automatically load up all the templates located in the app/scripts/ directory.  By default, the module name will match the name of the concatenated file.  By setting the base in the plugin, the templates can be referenced starting from that directory.  For example, if your template is in app/scripts/somedir/myTemplate.tpl.html, you can reference the template as 'somedir/myTemplate.tpl.html' by setting the base to 'app/scripts'. Furthermore, the templates can be run through html-minifier removing all comments by setting the htmlmin option with the removeComments set to true.

```JavaScript
files: {
    templates: {
        joinTo: {
            'js/templates-app.js': /^app\/scripts\//
        }
    }
}
plugins: {
	html2js: {
		options: {
			base: 'app/scripts',
            htmlmin: {
                removeComments: true
            }
		}
	}
}
```

In your Angular module:

```JavaScript
angular.module('yourmodule', ['templates-app'])
    .config(['$routeProvider', function ($routeProvidear) {
        $routeProvider.when('/yourpath', {
            templateUrl:'somedir/myTemplate.tpl.html',
            ...
```

###Options (taken from grunt-html2js project, thanks @karlgoldstein)

To keep things simple, some options from the grunt-html2js project have been removed.

#### options.base
Type: `String`
Default value: `'src'`

The prefix relative to the project directory that should be stripped from each template path to produce a module identifier for the template.  For example, a template located at `src/projects/projects.tpl.html` would be identified as just `projects/projects.tpl.html`.

#### options.target
Type: `String`
Default value: `'js'`

Language of the output file. Possible values: `'coffee'`, `'js'`.

#### options.quoteChar
Type: `Character`
Default value: `"`

Strings are quoted with double-quotes by default.  However, for projects
that want strict single quote-only usage, you can specify:

```
options: { quoteChar: '\'' }
```

to use single quotes, or any other odd quoting character you want

#### indentString
Type: `String`
Default value: `  `

By default a 2-space indent is used for the generated code. However,
you can specify alternate indenting via:

```
options: { indentString: '    ' }
```

to get, for example, 4-space indents. Same goes for tabs or any other
indent system you want to use.

#### useStrict:
Type: `Boolean`
Default value: ``

If set true, each module in JavaScript will have 'use strict'; written at the top of the
module.  Useful for global strict jshint settings.

```
options: { useStrict: true }
```

#### moduleName:
Type: `String`
Default value: `null`

If not set, the module name will match the name of the concatenated file.


#### htmlmin:
Type: `Object`
Default value: {}

Minifies HTML using [html-minifier](https://github.com/kangax/html-minifier).

```
options: {
  htmlmin: {
    collapseBooleanAttributes: true,
    collapseWhitespace: true,
    removeAttributeQuotes: true,
    removeComments: true,
    removeEmptyAttributes: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true
  }
}
```

TODO:

* More tests
