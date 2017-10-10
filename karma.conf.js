const basePath = process.cwd();

module.exports = function(config) {
  config.set({
    autoWatch: true,
    basePath: basePath,
    browsers: ['ChromeNoSandboxHeadless'],
    // browsers: ['Chrome'],
    // browsers: ['PhantomJS'],
    customLaunchers: {
      ChromeNoSandboxHeadless: {
        base: 'Chrome',
        flags: [
          '--no-sandbox',
          // See https://chromium.googlesource.com/chromium/src/+/lkgr/headless/README.md
          '--headless',
          '--disable-gpu',
          // Without a remote debugging port, Google Chrome exits immediately.
          ' --remote-debugging-port=9222'
        ]
      }
    },
    files: [
      'src/tiny-uri.test.js'
    ],
    frameworks: ['mocha', 'chai-sinon'],
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_ERROR,
    reporters: ['spec']
  });
};
