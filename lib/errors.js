'use strict';

var createError = require('errno').create;

var AidpcoreNodeError = createError('AidpcoreNodeError');

var RPCError = createError('RPCError', AidpcoreNodeError);

module.exports = {
  Error: AidpcoreNodeError,
  RPCError: RPCError
};
