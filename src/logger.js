import log4js from 'log4js';

log4js.configure({
  appenders: {
    stdout: { type: 'stdout' },
    file: { type: 'file', filename: 'debug.log' },
    ipChange: {type: 'file', filename: 'ip-change.log'}
  },
  categories: {
    default: { appenders: [ 'stdout', 'file' ], level: process.env.LOG_LEVEL || 'debug' },
    ipChange: { appenders: [ 'stdout', 'ipChange' ], level: process.env.LOG_LEVEL || 'info' }
  }
});

export const ipChangeLogger = log4js.getLogger('ipChange');
export default log4js.getLogger();
