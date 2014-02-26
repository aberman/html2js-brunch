##html2js-brunch [![Build Status](https://travis-ci.org/aberman/html2js-brunch.png?branch=master)](https://travis-ci.org/aberman/html2js-brunch)

Mimics [grunt-html2js](https://github.com/karlgoldstein/grunt-html2js) for brunch.

###Usage

Install the plugin using npm: `npm install --save html2js-brunch`.

To install manually:

* Add `"html2js-brunch": "x.y.z"` to your `package.json` in your brunch app.
* If you want the git version of the plugin, you can use: `"html2js-brunch": "https://github.com/aberman/html2js-brunch.git"`.

###Options (taken from grunt-html2js project, thanks @karlgoldstein)

Example:

```
plugins: {
	html2js: {
		options: {
			base: 'app/scripts'
		}
	}
}

```

#### options.base
Type: `String`
Default value: `'src'`

The prefix relative to the project directory that should be stripped from each template path to produce a module identifier for the template.  For example, a template located at `src/projects/projects.tpl.html` would be identified as just `projects/projects.tpl.html`.

#### options.target
Type: `String`
Default value: `'js'`

Language of the output file. Possible values: `'coffee'`, `'js'`.

#### options.module
Type: `String` or `Function`
Default value: `templates-TARGET` 

The name of the parent Angular module for each set of templates.  Defaults to the task target prefixed by `templates-`.

The value of this argument can be a string or a function.  The function should expect the module file path as an argument, and it should return the name to use for the parent Angular module.

If no bundle module is desired, set this to false.

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