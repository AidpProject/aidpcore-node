'use strict';

var should = require('chai').should();

describe('Index Exports', function() {
  it('will export aidpcore-lib', function() {
    var aidpcore = require('../');
    should.exist(aidpcore.lib);
    should.exist(aidpcore.lib.Transaction);
    should.exist(aidpcore.lib.Block);
  });
});
