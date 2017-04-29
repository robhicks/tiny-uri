import Uri from '../src/Uri.js';

describe('Uri', () => {

  it('should parse a url into its parts', () => {
    let url = 'https://user:pass@big.example.com/path/to/file.xml?context=foo&credentials=bar';
    let uri = new Uri(url);
    expect(uri.scheme()).toBe('https');
    expect(uri.host()).toBe('big.example.com');
    expect(uri.authority()).toBe('user:pass@big.example.com');
    expect(uri.path.toString()).toBe('path/to/file.xml');
    expect(uri.query.toString()).toBe('context=foo&credentials=bar');
  });

    it('should parse a url into its parts even if querstring not provided', () => {
      let url = 'https://user:pass@big.example.com/path/to/file.xml';
      let uri = new Uri(url);
      expect(uri.scheme()).toBe('https');
      expect(uri.host()).toBe('big.example.com');
      expect(uri.authority()).toBe('user:pass@big.example.com');
      expect(uri.path.toString()).toBe('path/to/file.xml');
      expect(uri.query.toString()).toBe('');
    });

  it('should convert the uri to a string', () => {
    let url = 'https://user:pass@big.example.com/path/to/file.xml?context=foo&credentials=bar';
    let uri = new Uri(url);
    expect(uri.toString()).toBe(url);
  });

  it('should set the query string', () => {
    let url = 'https://user:pass@big.example.com/path/to/file.xml?context=foo&credentials=bar';
    let uri = new Uri(url);
    uri.query.set({foo: 'bar'});
    expect(uri.query.toString()).toBe('foo=bar');
  });

  it('should append to the query string', () => {
    let url = 'https://user:pass@big.example.com/path/to/file.xml?context=foo&credentials=bar';
    let uri = new Uri(url);
    uri.query.add({foo: 'bar'});
    expect(uri.query.toString()).toBe('context=foo&credentials=bar&foo=bar');
  });

  it('should change/replace a query parameter', () => {
    let url = 'https://user:pass@big.example.com/path/to/file.xml?context=foo&credentials=bar';
    let uri = new Uri(url);
    uri.query.merge({context: 'bar'});
    expect(uri.query.toString()).toBe('context=bar&credentials=bar');
  });

  it('should change the host', () => {
    let url = 'https://user:pass@big.example.com/path/to/file.xml?context=foo&credentials=bar';
    let uri = new Uri(url);
    uri.host('little.example.com');
    expect(uri.host()).toBe('little.example.com');
  });

  it('should change the scheme', () => {
    let url = 'https://user:pass@big.example.com/path/to/file.xml?context=foo&credentials=bar';
    let uri = new Uri(url);
    uri.scheme('http');
    expect(uri.scheme()).toBe('http');
  });

});
