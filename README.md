Uri
===

Uri is yet another Javascript library for working with URLs. It offers a (fluent interface)[https://en.wikipedia.org/wiki/Fluent_interface],
method chaining, and sensible means of manipulating Url parts and a file size of less than 2K, gzipped.

# Installation

```shell
npm install https://github.com/robhicks/Uri.git

# or

yarn add https://github.com/robhicks/Uri.git

```

# Use

You can use the library in the browser or on NodeJs.

In the browser you can load dist/Uri.iife.js in
a script tag, or if you are using an es6 aware bundler like RollupJs, you can import it into your
entry file.

In NodeJs, require it as usual.

# Examples

## Getting URL parts:

```JavaScript
let uri = new Uri('http://example.org/path/to/foo/index.html?hello=world');

console.log('scheme', uri.scheme()); // 'http'
console.log('host', uri.host()); // 'example.org'
console.log('path', uri.path.toString()); // /path/to/foo/index.html
console.log('query', uri.query.toString()); // hello=world
```

## Manipulating URL parts:

```JavaScript
let uri = new Uri('http://example.org/path/to/foo/index.html?hello=world');

uri
  .scheme('https')
  .host('example.com')
  .path.set('path/to/bar/index.html');

console.log('scheme', uri.scheme()); // 'https'
console.log('host', uri.host()); // 'example.com'
console.log('path', uri.path.toString()); // /path/to/bar/index.html
console.log('query', uri.query.toString()); // hello=world
```

## Manipulating query strings

```JavaScript
let uri = new Uri('http://example.org/path/to/foo/index.html?hello=world');

console.log('query', uri.query.toString()); // hello=world
```

### Setting the query string

```JavaScript
let uri = new Uri('http://example.org/path/to/foo/index.html?hello=world');

uri.path.set({goodby: 'world'});

console.log('query', uri.query.toString()); // goodby=world

```

### Clearing the query string

```JavaScript
let uri = new Uri('http://example.org/path/to/foo/index.html?hello=world');

uri.path.clear();

console.log('query', uri.query.toString()); //
```

### Adding to the query string

```JavaScript
let uri = new Uri('http://example.org/path/to/foo/index.html?hello=world');

uri.path.add({goodby: 'world'});

console.log('query', uri.query.toString()); // hello=world&goodby=world

```

### Merging the query string

```JavaScript
let uri = new Uri('http://example.org/path/to/foo/index.html?hello=world');

uri.
  path.add({goodby: 'world'})
  path.merge({hello: 'universe'})

console.log('query', uri.query.toString()); // hello=universe&goodby=world

```

## Chaining Methods

You can chain Uri, Path and Query methods within themselves. This means you cannot chain
Uri methods from Path methods or Query methods, or Path methods from Query methods , or
Query methods from Path methods.

```Javascript
let url = 'https://user:pass@big.example.com/path/to/file.xml?context=foo&credentials=bar';
let uri = new Uri(url);
expect(uri.scheme().toString()).toBe('https');
expect(uri.host().toString()).toBe('big.example.com');
expect(uri.port().toString()).toBe('');
expect(Array.isArray(uri.path.get())).toEqual(true);
expect(uri.path.toString()).toEqual('path/to/file.xml');
expect(uri.query.add({foo: 'bar'}).toString()).toEqual('context=foo&credentials=bar&foo=bar')
expect(uri.query.add({foo: 'bar'}).merge({foo: 'bars'}).toString()).toEqual('context=foo&credentials=bar&foo=bars')
expect(uri.query.clear().add({foo: 'bar'}).merge({foo: 'bars'}).toString()).toEqual('foo=bars')
```
