const MochaSauce = require("mocha-sauce");
const StaticServer = require('static-server');
const exec = require('child_process').exec;
const port = 8001;
const host = 'localhost';

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

// configure
const sauce = new MochaSauce({
	name: "idx-esm-utils", // your project name
	username: process.env.SAUCE_USERNAME, // Sauce username
	accessKey: process.env.SAUCE_ACCESS_KEY, // Sauce access key
	host, // using Sauce Connect
	port: 4445,
	url: `http://${host}:${port}/demo/mocha.html` // point to the site running your mocha tests
});

// setup what browsers to test with
sauce.browser({ browserName: "chrome", platform: "Windows 10" });
sauce.browser({ browserName: "firefox", platform: "Windows 10" });
sauce.browser({ browserName: "safari", platform: "macOS 10.13" });
sauce.browser({ browserName: "firefox", platform: "macOS 10.13" });
sauce.browser({ browserName: "chrome", platform: "macOS 10.13" });

sauce.on('init', function(browser) {
  console.log('  init : %s %s', browser.browserName, browser.platform);
});

sauce.on('start', function(browser) {
  console.log('  start : %s %s', browser.browserName, browser.platform);
});

sauce.on('end', function(browser, res) {
  console.log('  end : %s %s : %d failures', browser.browserName, browser.platform, res.failures);
});

sauce.start((err, res) => {
  if (err) {
    console.log('err', err);
    process.exit(1);
  } else {
    process.exit(0);
  }
});
