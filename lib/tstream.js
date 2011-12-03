var https = require('https')
  , url = require('url')
  , util = require('util')
  , _ = require('underscore')
  , EventEmitter = require('events').EventEmitter;

var username = process.env.TWITTER_ID
  , password = process.env.TWITTER_PASS
  , auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');

var twitterSampleStreamOptions = _.extend({
    headers: { 'Authorization': auth }
  , port: 443
  , method: 'GET'
}, url.parse('https://stream.twitter.com/1/statuses/sample.json'));

/**
 * Stream Wrapper for Twitter Streaming API
 *
 * @param {String} keyword Search keyword
 */
function TwitterStream(keyword) {
  if (!keyword) {
    throw new Error('keyword is required');
  }
  
  this.keyword = keyword;
  this.request = null;

  EventEmitter.call(this);
}
util.inherits(TwitterStream, EventEmitter);

TwitterStream.prototype.open = function() {
  var self = this;
  self.close();

  console.log('Options: %j', twitterSampleStreamOptions);

  var req = https.request(twitterSampleStreamOptions, function(res) {
    if (res.statusCode === 200) {
      res.setEncoding('utf-8');
      res.on('data', function(chunk) {
        var data = JSON.parse(chunk);
        console.log(data.text);
        if (data.text && data.text.indexOf(self.keyword) !== -1) {
          self.emit('data', data);
        }
      });
    } else {
      console.log('%s: %s', res.statusCode, res.statusText);
      self.close();
    }
  });

  req.on('error', function(err) {
    console.error(err);
  });

  req.end();

  this.requiest = req;
};

TwitterStream.prototype.close = function() {
  if (this.request) {
    this.request.abort();
    this.request = null;
  }
};

module.exports = TwitterStream;