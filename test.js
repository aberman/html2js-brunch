var assert = require('chai').assert;
var Plugin = require('./');

describe('Plugin', function() {
	var plugin;

	beforeEach(function() {
		plugin = new Plugin({});
	});

	it('should be an object', function() {
		assert.ok(plugin);
	});

	it('should have a #compile method', function() {
		assert.isFunction(plugin.compile);
	});

	it('should have an #onCompile method', function() {
		assert.isFunction(plugin.compile);
	});

	// it('should compile and yield a valid result', function(done) {

	// })
});