/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require("webpack");

module.exports = function override(config, env) {
  const fallback = config.resolve.fallback || {};
  Object.assign(fallback, {
    url: require.resolve("url"),
    fs: require.resolve("fs"),
    assert: require.resolve("assert"),
    crypto: require.resolve("crypto-browserify"),
    http: require.resolve("stream-http"),
    https: require.resolve("https-browserify"),
    os: require.resolve("os-browserify/browser"),
    buffer: require.resolve("buffer"),
    stream: require.resolve("stream-browserify"),
    // process: require.resolve("process/browser"),
  });
  config.resolve.fallback = fallback;
  // config.resolve.alias = {
  //   process: "process/browser",
  // };

  config.plugins.push(
    new webpack.ProvidePlugin({
      // process: "process/browser.js",
      Buffer: ["buffer", "Buffer"],
    })
  );
  config.ignoreWarnings = [/Failed to parse source map/];

  return config;
};
