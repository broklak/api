'use strict';

const StdOut = require('./out/std');
const bunyan = require('bunyan');

class Logger {

  constructor() {
    this.outputs = [{ type: 'raw', level: 0, stream: StdOut}];
    this.backend = bunyan.createLogger({
      name: 'bhmservice',
      streams: this.outputs,
      serializers: {
        err: bunyan.stdSerializers.err,
        req: bunyan.stdSerializers.req,
        res: bunyan.stdSerializers.res
      }
    });
  }

  i() {
    return this.backend.info.apply(this.backend, arguments);
  }

  w() {
    return this.backend.warn.apply(this.backend, arguments);
  }

  e() {
    return this.backend.error.apply(this.backend, arguments);
  }

  d() {
    return this.backend.debug.apply(this.backend, arguments);
  }

  t() {
    return this.backend.trace.apply(this.backend, arguments);
  }

  h() {

    let arg = [];
    if (arguments.length == 1 || !(arguments[0] instanceof Object)) {
      arg[0] = {level: 35};
      arg[1] = arguments[0];
    }
    else {
      let logObj = arguments[0];
      logObj.level = 35;
      arg[0] = logObj;

      if (arguments.length > 1) {
        const theArgs = Array.prototype.slice.call(arguments);
        Array.prototype.push.apply(arg, theArgs.slice(1));
      }
    }


    return this.backend.trace.apply(this.backend, arg);
  }
}

module.exports = new Logger();