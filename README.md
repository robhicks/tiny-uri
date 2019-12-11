tiny-uri
=======

tiny-uri is yet another Javascript library for working with URLs. It offers a (fluent interface)[https://en.wikipedia.org/wiki/Fluent_interface],
method chaining, and sensible means of manipulating Url parts and a file size of less than 5K, gzipped.

# Installation

```shell
npm install https://github.com/robhicks/tiny-uri.git

# or

yarn add https://github.com/robhicks/tiny-uri.git

```

# Use

You can use the library in the browser or on NodeJs.

In the browser you can load dist/tiny-uri.iife.js in
a script tag, or if you are using an es6 aware bundler like RollupJs, you can import it into your
entry file.

In NodeJs, require it as usual.

# Examples

## Getting URL parts:

```JavaScript
let uri = new TinyUri('http://example.org/path/to/foo/index.html?hello=world');

console.log('scheme', uri.scheme()); // 'http'
console.log('host', uri.host()); // 'example.org'
console.log('path', uri.path.toString()); // /path/to/foo/index.html
console.log('query', uri.query.toString()); // hello=world
```

## Manipulating URL parts:

```JavaScript
let uri = new TinyUri('http://example.org/path/to/foo/index.html?hello=world');

uri
  .scheme('https')
  .host('example.com')
  .authority('user:password@example.com')
  .path.set('path/to/bar/index.html')
  .query.merge({q, 'foo'});

console.log('scheme', uri.scheme()); // 'https'
console.log('host', uri.host()); // 'example.com'
console.log('authority', uri.authority()) // 'user:password@example.com'
console.log('path', uri.path.toString()); // /path/to/bar/index.html
console.log('query', uri.query.toString()); // hello=world
```

## Manipulating query strings

```JavaScript
let uri = new TinyUri('http://example.org/path/to/foo/index.html?hello=world');

console.log('query', uri.query.toString()); // hello=world
```

### Setting the query string

```JavaScript
let uri = new TinyUri('http://example.org/path/to/foo/index.html?hello=world');

uri.query.set({goodby: 'world'});

console.log('query', uri.query.toString()); // goodby=world

```

### Clearing the query string

```JavaScript
let uri = new TinyUri('http://example.org/path/to/foo/index.html?hello=world');

uri.query.clear();

console.log('query', uri.query.toString()); //
```

### Adding to the query string

```JavaScript
let uri = new TinyUri('http://example.org/path/to/foo/index.html?hello=world');

uri.query.add({goodby: 'world'});

console.log('query', uri.query.toString()); // hello=world&goodby=world

```

### Merging the query string

```JavaScript
let uri = new TinyUri('http://example.org/path/to/foo/index.html?hello=world');

uri.
  query.add({goodby: 'world'})
  query.merge({hello: 'universe'})

console.log('query', uri.query.toString()); // hello=universe&goodby=world

```

## Chaining Methods

You can chain Uri, Path and Query methods.

```Javascript
expect(uri.scheme().toString()).toBe('https');
expect(uri.host().toString()).toBe('big.example.com');
expect(uri.port().toString()).toBe('');
expect(Array.isArray(uri.path.get())).toEqual(true);
expect(uri.path.toString()).toEqual('path/to/file.xml');
expect(uri.query).toEqual(jasmine.any(Object));
expect(uri.query.add({foo: 'bar'}).query.toString()).toEqual('context=foo&credentials=bar&foo=bar');
expect(uri.query.add({foo: 'bar'}).query.merge({foo: 'bars'}).query.toString()).toEqual('context=foo&credentials=bar&foo=bars');
expect(uri.query.clear().query.add({foo: 'bar'}).query.merge({foo: 'bars'}).query.toString()).toEqual('foo=bars');
expect(uri.query.clear().query.add({foo: 'bar'}).query.merge({foo: 'bars'}).query.toString(true)).toEqual('https://user:pass@big.example.com/path/to/file.xml?foo=bars');
```
