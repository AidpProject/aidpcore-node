'use strict';

var path = require('path');
var should = require('chai').should();
var sinon = require('sinon');
var proxyquire = require('proxyquire');

describe('#defaultConfig', function() {
  var expectedExecPath = path.resolve(__dirname, '../../bin/aidpd');

  it('will return expected configuration', function() {
    var config = JSON.stringify({
      network: 'livenet',
      port: 3001,
      services: [
        'aidpd',
        'web'
      ],
	  messageLog: '',
	  servicesConfig: {
        web: {
          disablePolling: true,
	      enableSocketRPC: false
		},
		'insight-ui': {
		  routePrefix: '',
          apiPrefix: 'api'
		},
		'insight-api': {
		  routePrefix: 'api',
		  coinTicker: 'https://api.coinmarketcap.com/v1/ticker/aidpcoin/?convert=USD',
		  coinShort: 'AIDP',
      db: {
        host: '127.0.0.1',
        port: '27017',
        database: 'aidp-api-livenet',
        user: 'aidpcore',
        password: 'password123'
      }      
		},
		aidpd: {
		  sendTxLog: process.env.HOME + '/.aidpcore/pushtx.log',
          spawn: {
            datadir: process.env.HOME + '/.aidpcore/data',
            exec: expectedExecPath,
		    rpcqueue: 1000,
		    rpcport: 8766,
		    zmqpubrawtx: 'tcp://127.0.0.1:28332',
		    zmqpubhashblock: 'tcp://127.0.0.1:28332'
          }
        }
      }
    }, null, 2);
    var defaultConfig = proxyquire('../../lib/scaffold/default-config', {
      fs: {
        existsSync: sinon.stub().returns(false),
        writeFileSync: function(path, data) {
          path.should.equal(process.env.HOME + '/.aidpcore/aidpcore-node.json');
          data.should.equal(config);
        },
        readFileSync: function() {
          return config;
        }
      },
      mkdirp: {
        sync: sinon.stub()
      }
    });
    var home = process.env.HOME;
    var info = defaultConfig();
    info.path.should.equal(home + '/.aidpcore');
    info.config.network.should.equal('livenet');
    info.config.port.should.equal(3001);
    info.config.services.should.deep.equal(['aidpd', 'web']);
    var aidpd = info.config.servicesConfig.aidpd;
    should.exist(aidpd);
    aidpd.spawn.datadir.should.equal(home + '/.aidpcore/data');
    aidpd.spawn.exec.should.equal(expectedExecPath);
  });
  it('will include additional services', function() {
    var config = JSON.stringify({
      network: 'livenet',
      port: 3001,
      services: [
        'aidpd',
        'web',
        'insight-api',
        'insight-ui'
      ],
	  messageLog: '',	  
	  servicesConfig: {
        web: {
          disablePolling: true,
	      enableSocketRPC: false
		},
		'insight-ui': {
		  routePrefix: '',
          apiPrefix: 'api'
		},
		'insight-api': {
		  routePrefix: 'api',
		  coinTicker: 'https://api.coinmarketcap.com/v1/ticker/aidpcoin/?convert=USD',
		  coinShort: 'AIDP',
      db: {
        host: '127.0.0.1',
        port: '27017',
        database: 'aidp-api-livenet',
        user: 'aidpcore',
        password: 'password123'
      }      
		},
		aidpd: {
		  sendTxLog: process.env.HOME + '/.aidpcore/pushtx.log',
          spawn: {
            datadir: process.env.HOME + '/.aidpcore/data',
            exec: expectedExecPath,
		    rpcqueue: 1000,
		    rpcport: 8766,
		    zmqpubrawtx: 'tcp://127.0.0.1:28332',
		    zmqpubhashblock: 'tcp://127.0.0.1:28332'
          }
        }
      }
    }, null, 2);
    var defaultConfig = proxyquire('../../lib/scaffold/default-config', {
      fs: {
        existsSync: sinon.stub().returns(false),
        writeFileSync: function(path, data) {
          path.should.equal(process.env.HOME + '/.aidpcore/aidpcore-node.json');
          data.should.equal(config);
        },
        readFileSync: function() {
          return config;
        }
      },
      mkdirp: {
        sync: sinon.stub()
      }
    });
    var home = process.env.HOME;
    var info = defaultConfig({
      additionalServices: ['insight-api', 'insight-ui']
    });
    info.path.should.equal(home + '/.aidpcore');
    info.config.network.should.equal('livenet');
    info.config.port.should.equal(3001);
    info.config.services.should.deep.equal([
      'aidpd',
      'web',
      'insight-api',
      'insight-ui'
    ]);
    var aidpd = info.config.servicesConfig.aidpd;
    should.exist(aidpd);
    aidpd.spawn.datadir.should.equal(home + '/.aidpcore/data');
    aidpd.spawn.exec.should.equal(expectedExecPath);
  });
});
