mock-req
========

Mocks node.js `http.IncomingMessage` (a request).  See also `mock-res`.

Being a readable/writable stream, you can pipe the request body to and from it.

# Usage
See `test.js` for further usage.

## GET/HEAD/DELETE
	var assert = require('assert');
	var myHandler = require('./my-handler');
	var MockRequest = require('mock-req');

	var req = new MockRequest({
		method: 'GET',
		url: '/stuff',
		headers: {
			'Accept': 'text/plain'
		}
	});

	// `req.end()` is automatically called for GET/HEAD/DELETE methods

	// Use `mock-res` instead of doing this
	var res = {
		end: end
	};

	myHandler(req, res);

	function end(data) {
		assert.equal(data, 'Here is stuff!');
	}

## POST/PUT

## Stream data