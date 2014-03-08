'use strict';

var minify = require('html-minifier').minify;
var pathUtils = require('path');
var fs = require('fs');

module.exports = function() {
    Html2Js.prototype.brunchPlugin = true;
    Html2Js.prototype.type = 'template';
    Html2Js.prototype.extension = 'tpl.html';

    Html2Js.prototype.compile = function(content, path, callback) {
        var options = this.options;
        var moduleName = normalizePath(pathUtils.relative(options.base, path));

        //Hack to not include any files not in the app dir since brunch passes in every file matching the extension
        if (moduleName.indexOf('..') === -1) {
            this.moduleNames[path] = "'" + moduleName + "'";

            if (options.target === 'js') {
                return callback(null, compileTemplate(moduleName, content, options.quoteChar, options.indentString, options.useStrict, options.htmlmin));
            } else if (options.target === 'coffee') {
                return callback(null, compileCoffeeTemplate(moduleName, content, options.quoteChar, options.indentString, options.htmlmin));
            } else {
                return callback('Unknown target "' + options.target + '" specified');
            }
        }

        return callback(null, null);
    };

    Html2Js.prototype.onCompile = function(generatedFiles) {
        var bundle = '';
        var options = this.options;

        function passesFilter(filter, modulePath) {
            // filter may either be a regex or callable function
            if (filter.test !== undefined) {
                return filter.test(modulePath);
            } else {
                return filter(modulePath);
            }
        }

        for (var key in this.joinTo) {
            var path = this.publicPath + pathUtils.sep + key;
            var targetModule = this.options.moduleName || pathUtils.basename(path, '.js');
            var filter = this.joinTo[key];

            var moduleNameVals = [];

            for (var modulePath in this.moduleNames) {
                if (passesFilter(filter, modulePath)) {
                    moduleNameVals.push(this.moduleNames[modulePath]);
                }
            }

            bundle = "angular.module('" + targetModule + "', [" + moduleNameVals.join(', ') + "])";
            if (options.target === 'js') {
                bundle += ';';
            }

            bundle += '\n\n';

            var fileContent = fs.readFileSync(path, {encoding: 'utf-8'});

            if (fileContent.indexOf(bundle) === -1) {
                fs.writeFile(path, bundle.concat(fileContent), function(err) {
                    if (err) throw err;
                });
            }
        }
    };

    function Html2Js(cfg) {
        cfg = cfg || {};
        this.options = {
            base: 'src',
            quoteChar: '"',
            indentString: '    ',
            target: 'js',
            moduleName: null,
            htmlmin: {}
        };
        this.joinTo = cfg.files ? cfg.files.templates.joinTo : null;
        this.publicPath = cfg.paths ? cfg.paths.public : null;
        this.moduleNames = {};

        var config = cfg.plugins && cfg.plugins.html2js;
        if (config) {
            var options = config.options || {};

            for (var key in options) {
                if (options.hasOwnProperty(key)) {
                    this.options[key] = options[key];
                }
            }
        }
    };

    function escapeContent(content, quoteChar, indentString) {
        var bsRegexp = new RegExp('\\\\', 'g');
        var quoteRegexp = new RegExp('\\' + quoteChar, 'g');
        var nlReplace = '\\n' + quoteChar + ' +\n' + indentString + indentString + quoteChar;
        return content.replace(bsRegexp, '\\\\').replace(quoteRegexp, '\\' + quoteChar).replace(/\r?\n/g, nlReplace);
    }

    // convert Windows file separator URL path separator

    function normalizePath(p) {
        if (pathUtils.sep !== '/') {
            p = p.replace(/\\/g, '/');
        }
        return p;
    }

    function getContent(content, quoteChar, indentString, htmlmin) {
        if (Object.keys(htmlmin).length) {
            content = minify(content, htmlmin);
        }

        return escapeContent(content, quoteChar, indentString);
    }

    // compile a template to an angular module

    function compileTemplate(moduleName, content, quoteChar, indentString, useStrict, htmlmin, process) {
        var contentModified = getContent(content, quoteChar, indentString, htmlmin, process);
        var doubleIndent = indentString + indentString;
        var strict = (useStrict) ? indentString + quoteChar + 'use strict' + quoteChar + ';\n' : '';

        var module = 'angular.module(' + quoteChar + moduleName +
            quoteChar + ', []).run([' + quoteChar + '$templateCache' + quoteChar + ', function($templateCache) ' +
            '{\n' + strict + indentString + '$templateCache.put(' + quoteChar + moduleName + quoteChar + ',\n' + doubleIndent + quoteChar + contentModified +
            quoteChar + ');\n}]);\n';

        return module;
    }

    // compile a template to an angular module

    function compileCoffeeTemplate(moduleName, content, quoteChar, indentString, htmlmin) {
        var contentModified = getContent(content, quoteChar, indentString, htmlmin);
        var doubleIndent = indentString + indentString;

        var module = 'angular.module(' + quoteChar + moduleName +
            quoteChar + ', []).run([' + quoteChar + '$templateCache' + quoteChar + ', ($templateCache) ->\n' +
            indentString + '$templateCache.put(' + quoteChar + moduleName + quoteChar + ',\n' + doubleIndent + quoteChar + contentModified +
            quoteChar + ')\n])\n';

        return module;
    }

    return Html2Js;
}();
