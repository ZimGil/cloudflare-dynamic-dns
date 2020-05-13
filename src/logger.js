import log4js from 'log4js';

log4js.configure({
  appenders: {
    stdout: { type: 'stdout' },
    file: { type: 'file', filename: 'debug.log' }
  },
  categories: {
    default: { appenders: [ 'stdout', 'file' ], level: process.env.LOG_LEVEL || 'debug' }
  }
});

export default log4js.getLogger();
