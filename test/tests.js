require('reify');

global.nock = require('nock');
global.chai = require('chai');
global.sinon = require('sinon');
global.expect = global.chai.expect;
global.assert = global.chai.assert;

require('./tiny-uri.test.js');
