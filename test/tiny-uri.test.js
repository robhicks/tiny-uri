import TinyUri from '../src/TinyUri.js';

describe('TinyUri', () => {

  it('should parse a url into its parts', () => {
    let url = 'https://user:pass@big.example.com/path/to/file.xml?context=foo&credentials=bar';
    let uri = new TinyUri(url);
    expect(uri.scheme()).to.be.equal('https');
    expect(uri.host()).to.be.equal('big.example.com');
    expect(uri.authority()).to.be.equal('user:pass@big.example.com');
    expect(uri.path.toString()).to.be.equal('path/to/file.xml');
    expect(uri.query.toString()).to.be.equal('context=foo&credentials=bar');
    // expect(uri.query.get()).to.be.equal('foo')
  });

  it('should parse a url with url template tags into its parts', () => {
    let url = 'https://user:pass@big.example.com/quotetools/getHistoryDownload/{user}/download.csv{?webmasterId,startDay,startMonth,startYear,endDay,endMonth,endYear,isRanged,symbol}';
    let uri = new TinyUri(url);
    expect(uri.scheme()).to.be.equal('https');
    expect(uri.host()).to.be.equal('big.example.com');
    expect(uri.authority()).to.be.equal('user:pass@big.example.com');
    expect(uri.path.toString()).to.be.equal('quotetools/getHistoryDownload/{user}/download.csv');
    expect(Array.isArray(uri.path.get())).to.be.equal(true);
    expect(uri.path.get()).to.be.eql(['quotetools', 'getHistoryDownload', '{user}', 'download.csv']);
    expect(uri.query.toString()).to.be.equal('');
    expect(uri.query.getUrlTemplateQuery()).to.be.equal('webmasterId,startDay,startMonth,startYear,endDay,endMonth,endYear,isRanged,symbol');
  });

  it('should parse a url into its parts even if query string not provided', () => {
    let url = 'https://user:pass@big.example.com/path/to/file.xml';
    let uri = new TinyUri(url);
    expect(uri.scheme()).to.be.equal('https');
    expect(uri.host()).to.be.equal('big.example.com');
    expect(uri.authority()).to.be.equal('user:pass@big.example.com');
    expect(uri.path.toString()).to.be.equal('path/to/file.xml');
    expect(uri.query.toString()).to.be.equal('');
  });

  it('should convert the uri to a string', () => {
    let url = 'https://user:pass@big.example.com/path/to/file.xml?context=foo&credentials=bar';
    let uri = new TinyUri(url);
    expect(uri.toString()).to.be.equal(url);
  });

  it('should convert the uri to a string without a trailing slash', () => {
    let url = 'https://big.example.com/';
    let uri = new TinyUri(url);
    expect(uri.toString()).to.be.equal('https://big.example.com');
  });

  describe('Path', () => {
    it('should return the path', () => {
      let url = 'https://user:pass@big.example.com/path/to/file.xml';
      let uri = new TinyUri(url);

      expect(uri.path.toString()).to.be.equal('path/to/file.xml');
    });

    it('should replace the path', () => {
      let url = 'https://user:pass@big.example.com/path/to/file.xml';
      let uri = new TinyUri(url);

      expect(uri.path.replace('different/path/to/file.json').path.toString()).to.be.equal('different/path/to/file.json');
    });

    it('should replace the file part of the path', () => {
      let url = 'https://user:pass@big.example.com/path/to/file.xml';
      let uri = new TinyUri(url);

      expect(uri.path.replace('file.json', 'file').path.toString()).to.be.equal('path/to/file.json');
    });

    it('should remove the last segment of the path', () => {
      let url = 'https://user:pass@big.example.com/path/to/file.xml';
      let uri = new TinyUri(url);

      expect(uri.path.delete().path.toString()).to.be.equal('path/to');
    });

    it('should replace the first segment of the path', () => {
      let url = 'https://user:pass@big.example.com/path/to/file.xml';
      let uri = new TinyUri(url);

      expect(uri.path.replace('new-path', 0).path.toString()).to.be.equal('new-path/to/file.xml');
    });

    it('should replace the second segment of the path', () => {
      let url = 'https://user:pass@big.example.com/path/to/file.xml';
      let uri = new TinyUri(url);

      expect(uri.path.replace('new-to', 1).path.toString()).to.be.equal('path/new-to/file.xml');
    });

    it('should return the uri as a string', () => {
      let url = 'https://user:pass@big.example.com/path/to/file.xml';
      let uri = new TinyUri(url);

      expect(uri.path.replace('new-to', 1).path.toString(true)).to.be.equal('https://user:pass@big.example.com/path/new-to/file.xml');
    });

    it('should support path chaining', () => {
      let url = 'https://user:pass@big.example.com/path/to/file.xml';
      let uri = new TinyUri(url);

      expect(uri.path.replace('new-path', 0).path.replace('new-to', 1).path.toString(true)).to.be.equal('https://user:pass@big.example.com/new-path/new-to/file.xml');
    });

    it('should support path appending and chaining', () => {
      let url = 'https://user:pass@big.example.com';
      let uri = new TinyUri(url);
      uri.path.append('path').path.append('to').path.append('file');

      expect(uri.toString()).to.be.equal('https://user:pass@big.example.com/path/to/file');
    });

  });

  describe('Query', () => {
    it('should set the query string', () => {
      let url = 'https://user:pass@big.example.com/path/to/file.xml?context=foo&credentials=bar';
      let uri = new TinyUri(url);
      uri.query.set({foo: 'bar'});
      expect(uri.query.toString()).to.be.equal('foo=bar');
    });

    it('should return a url template query string', () => {
      let url = 'https://user:pass@big.example.com/path/to/file.xml{?userid,name}';
      let uri = new TinyUri(url);

      expect(uri.query.getUrlTemplateQuery()).to.be.equal('userid,name');
    });

    it('should add a query string properly on a naked host', () => {
      let url = 'https://big.example.com';
      let uri = new TinyUri(url);
      uri.query.add({foo: 'bar'});
      expect(uri.toString()).to.be.equal('https://big.example.com?foo=bar');
    });

    it('should clear to the query string', () => {
      let url = 'https://user:pass@big.example.com/path/to/file.xml?context=foo&credentials=bar';
      let uri = new TinyUri(url);
      expect(uri.query.clear().query.toString()).to.be.equal('');
    });

    it('should append to the query string', () => {
      let url = 'https://user:pass@big.example.com/path/to/file.xml?context=foo&credentials=bar';
      let uri = new TinyUri(url);
      uri.query.add({foo: 'bar'});
      expect(uri.query.toString()).to.be.equal('context=foo&credentials=bar&foo=bar');
    });

    it('should change/replace a query parameter', () => {
      let url = 'https://user:pass@big.example.com/path/to/file.xml?context=foo&credentials=bar';
      let uri = new TinyUri(url);
      uri.query.merge({context: 'bar'});
      expect(uri.query.toString()).to.be.equal('context=bar&credentials=bar');
    });

    it('should, when cleared, return a proper url', () => {
      let url = 'https://user:pass@big.example.com/path/to/file.xml?context=foo&credentials=bar';
      let uri = new TinyUri(url);
      uri.query.clear();
      expect(uri.toString()).to.be.equal('https://user:pass@big.example.com/path/to/file.xml');
    });

  });

  it('should change the host', () => {
    let url = 'https://user:pass@big.example.com/path/to/file.xml?context=foo&credentials=bar';
    let uri = new TinyUri(url);
    uri.host('little.example.com');
    expect(uri.host()).to.be.equal('little.example.com');
  });

  it('should change the scheme', () => {
    let url = 'https://user:pass@big.example.com/path/to/file.xml?context=foo&credentials=bar';
    let uri = new TinyUri(url);
    uri.scheme('http');
    expect(uri.scheme()).to.be.equal('http');
  });

  it('should demonstrate chaining', () => {
    let url = 'https://user:pass@big.example.com/path/to/file.xml?context=foo&credentials=bar';
    let uri = new TinyUri(url);
    expect(uri.scheme().toString()).to.be.equal('https');
    expect(uri.host().toString()).to.be.equal('big.example.com');
    expect(uri.port().toString()).to.be.equal('');
    expect(Array.isArray(uri.path.get())).to.be.equal(true);
    expect(uri.path.toString()).to.be.equal('path/to/file.xml');
    expect(uri.query.add({foo: 'bar'}).query.toString()).to.be.equal('context=foo&credentials=bar&foo=bar');
    expect(uri.query.add({foo: 'bar'}).query.merge({foo: 'bars'}).query.toString()).to.be.equal('context=foo&credentials=bar&foo=bars');
    expect(uri.query.clear().query.add({foo: 'bar'}).query.merge({foo: 'bars'}).query.toString()).to.be.equal('foo=bars');
    expect(uri.query.clear().query.add({foo: 'bar'}).query.merge({foo: 'bars'}).query.toString(true)).to.be.equal('https://user:pass@big.example.com/path/to/file.xml?foo=bars');
  });

});
