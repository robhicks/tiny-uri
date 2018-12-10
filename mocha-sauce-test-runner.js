const { MochaSauceRunner } = require("mocha-sauce-connect");
const StaticServer = require('static-server');
const port = 8001;
const host = 'localhost';
const istanbul = require('istanbul');

const server = new StaticServer({
  rootPath: '.',
  port: port,
  host: host,
  cors: '*',
  followSymlink: true,
  templates: {
    index: 'mocha.html'
  }
});

server.start(() => console.log(`test server running on port: ${port}`));

const url = `http://${host}:${port}/mocha.html`;

// configure
const runner = new MochaSauceRunner({
	name: "tiny-uri", // your project name
	username: process.env.SAUCE_USERNAME, // Sauce username
	accessKey: process.env.SAUCE_ACCESS_KEY, // Sauce access key
	host, // using Sauce Connect
	port: 4445,
	url // point to the site running your mocha tests
});

runner.record(true);

// setup what browsers to test with
runner.browser({ name: "safari", platform: "macOS 10.13" });
runner.browser({ name: "chrome", platform: "Windows 10" });
runner.browser({ name: "firefox", platform: "Windows 10" });
runner.browser({ name: "firefox", platform: "macOS 10.13" });
runner.browser({ name: "chrome", platform: "macOS 10.13" });

runner.on('init', function(browser) {
  console.log('  init : %s %s', browser.name, browser.platform);
});

runner.on('start', function(browser) {
  console.log('  start : %s %s', browser.name, browser.platform);
});

runner.on('end', function(browser, res) {
  console.log('  end : %s %s : %d failures', browser.name, browser.platform, res.failures);
});

runner.on('error', err => console.log('err', err));

runner.start()
  .then(collector => {
    const reporter = new istanbul.Reporter();
    reporter.add('lcovonly');
    reporter.write(collector, true, () => {
      process.exit(0);
    });
  })
  .catch(err => {
    console.log('err', err);
    process.exit(1);
  });
