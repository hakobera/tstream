var TwitterStream = require('../lib/tstream');

var assert = require('assert')
  , should = require('should');

describe('TwitterStream', function(){
  describe('when constructor called with empty arguments', function() {
    it('should throw error', function() {
      assert.throws(
        function() {
          new TwitterStream();
        },
        Error
      );
    });
  });

  describe('#open()', function(){
    it('should ', function(done) {
      var keyword = 'a'
        , stream = new TwitterStream(keyword)
        , called = false;

      stream.open();
      stream.on('data', function(data) {
        if (!called) {
          called = true;
          console.log(data.text);
          data.text.indexOf(keyword).should.not.equal(-1);
          stream.close();
          done();
        }
      });
    });
  });
})