import log4js from 'log4js';

log4js.configure({
  appenders: {
    stdout: { type: 'stdout' },
    file: { type: 'file', filename: 'logs/debug.log', maxLogSize: 1048576, compress: true, keepFileExt: true },
    ipChange: { type: 'file', filename: 'logs/ip-change.log'},
    errorsFile: { type: 'file', filename: 'logs/error.log' },
    errorsOnly: { type: 'logLevelFilter', appender: 'errorsFile', level: 'error' }
  },
  categories: {
    default: { appenders: [ 'stdout', 'file', 'errorsOnly' ], level: process.env.LOG_LEVEL || 'debug' },
    ipChange: { appenders: [ 'stdout', 'ipChange' ], level: process.env.LOG_LEVEL || 'info' }
  }
});

export const ipChangeLogger = log4js.getLogger('ipChange');
export default log4js.getLogger();
