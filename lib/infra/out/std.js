'use strict';

const stream = require('stream');
const chalk  = require('chalk');

const levelToString = function(lvl) {
  if (lvl < 15) return 'trace';
  else if (lvl < 25) return 'debug';
  else if (lvl < 35) return 'info';
  else if (lvl === 35) return 'http';
  else if (lvl === 36) return 'pkg_req';
  else if (lvl < 45) return 'warn';
  else if (lvl < 55) return 'error';
  return 'fatal';
};

const prettyPrint = function(logObject) {
  const lvlStr = levelToString(logObject.level);
  const levels = {
    fatal: chalk.red,
    error: chalk.red,
    warn : chalk.yellow,
    http : chalk.cyan,
    info : chalk.green,
    debug: (str) => chalk.white(chalk.bold(str)),
    trace: chalk.gray
  };

  const text = `${lvlStr}\t - [${logObject.time.toISOString()}] ${logObject.msg} \n`;

  return levels[lvlStr](text);
};

class ConsoleTransform extends stream.Transform {

  constructor(options) {
    let opt = options || {};
    opt.objectMode = true;
    super(opt);
  }

  _transform(chunk, encoding, callback) {
    let strObj = '';

    try {
      strObj = prettyPrint(chunk);
    }
    catch (err) {
      return callback(err);
    }

    callback(null, strObj);
  }
}

const outputStream = new ConsoleTransform();
outputStream.pipe(process.stdout);

module.exports = outputStream;