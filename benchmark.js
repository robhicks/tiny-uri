const Uri = require('jsuri');
const TinyUri = require('./dist/tiny-uri.cjs');
const URI = require('urijs');

const INSTANCES = 10000;
const url = 'http://www.example.org:5000/path/to/foo/index.html?hello=world';


function runJsUriBenchMark() {
  console.time('jsuriBenchmark');
  for (let i = 0; i < INSTANCES; i++) {
    const uri = new Uri(url);
    uri.userInfo('rob:password');
    uri.protocol('https');
    uri.host('big.dog.example.org');
    uri.port(8080);
    uri.path('path/to/bar/index.html');
    uri.query('foo=bar');
    uri.userInfo();
    uri.protocol();
    uri.host();
    uri.port();
    uri.query();
    uri.toString();
  }
  console.timeEnd('jsuriBenchmark');
}

function runTinyUriBenchmark() {
  console.time('tinyUriBenchmark');
  for (let i = 0; i < INSTANCES; i++) {
    const uri = new TinyUri(url);
    uri
      .authority.set('rob:password')
      .scheme.set('https')
      .host.set('big.dog.example.org')
      .port.set(8080)
      .path.set('path/to/bar/index.html')
      .query.set({foo: 'bar'});

    uri.scheme.get();
    uri.port.get();
    uri.host.get();
    uri.authority.get();
    uri.path.toString();
    uri.query.toString();
    uri.toString();
  }
  console.timeEnd('tinyUriBenchmark');
}

function runUriJsBenchmark() {
  console.time('uriJsBenchmark');
  for (let i = 0; i < INSTANCES; i++) {
    const uri = new URI(url);
    uri.userinfo('rob:password');
    uri.protocol('https');
    uri.hostname('big.dog.example.org');
    uri.port(8080);
    uri.pathname('path/to/bar/index.html');
    uri.query({foo: 'bar'});
    uri.userinfo();
    uri.protocol();
    uri.hostname();
    uri.port();
    uri.query();
    uri.toString();
  }
  console.timeEnd('uriJsBenchmark');
}

runJsUriBenchMark();
runTinyUriBenchmark();
runUriJsBenchmark();
