var assert = require('assert'),
	MockRequest = require('./index');

var tests = [

	function is_writable_and_readable() {
		var req = new MockRequest();
		assert(req.readable);
		assert(req.writable);

		next();
	},

	function default_options() {
		var req = new MockRequest();

		assert.equal(typeof req.url, 'string');
		assert.equal(req.method, 'GET');
		assert.deepEqual(req.headers, {});
		assert.deepEqual(req.rawHeaders, []);

		next()
	},

	function parses_headers() {
		var req = new MockRequest({
			headers: {
				'Content-Type': 'text/plain',
				'Content-Length': 10
			}
		});

		assert.equal(req.headers['content-type'], 'text/plain');
		assert.equal(req.headers['content-length'], '10');
		assert.deepEqual(req.rawHeaders, [
			'Content-Type',
			'text/plain',
			'Content-Length',
			'10'
		]);

		next()
	},

	function automatically_ends_for_bodiless() {
		var ends = {
			GET: true,
			HEAD: true,
			DELETE: true,
			POST: false,
			PUT: false,
			WHATEVS: false
		};

		Object.keys(ends).forEach(function(method) {
			var req = new MockRequest({
				method: method
			});

			assert.equal(req._writableState.ended, ends[method], method);
		});

		next();
	},

	function string_body() {
		var req = new MockRequest({
			method: 'POST'
		});

		req.write('hello', 'utf8');
		req.end();

		req.setEncoding('utf8');
		req.once('readable', function() {
			var d = this.read();
			assert.equal(d, 'hello');
			next();
		});
	},

	function json_body() {
		var req = new MockRequest({
			method: 'POST'
		});

		req.write({
			hello: 3
		});
		req.end();

		req.setEncoding('utf8');
		req.once('readable', function() {
			var d = this.read();
			assert.deepEqual(d, '{"hello":3}');
			next();
		});
	},

	function buffer_body() {
		var req = new MockRequest({
			method: 'POST'
		});

		var buf = new Buffer('yo', 'utf8');
		req.write(buf);
		req.end();

		req.once('readable', function() {
			var d = this.read();
			assert.equal(d, buf);
			next();
		});
	},

	function fails() {
		var req = new MockRequest({
			method: 'POST'
		});

		var err = new Error('Oops');
		req._fail(err);

		req.on('error', function(err2) {
			assert.equal(err, err2);
			next();
		});

		req.write('yo');
	}

];

var ready = true;

function next() {
	ready = true;
}

setInterval(function() {
	if (!ready) return;
	var test = tests.shift();
	if (!test) {
		console.log('All tests passed');
		return process.exit(0);
	}

	ready = false;
	test();
}, 0);