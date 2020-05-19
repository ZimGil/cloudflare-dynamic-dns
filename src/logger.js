import log4js from 'log4js';

const defaultAppenders = ['file', 'errorsOnly'];
const ipChangeAppenders = ['ipChange'];
const logFilesPath = process.env.LOG_FILES_PATH || 'logs'

if (process.env.NODE_ENV !== 'production') {
  defaultAppenders.push('stdout');
  ipChangeAppenders.push('stdout');
}


log4js.configure({
  appenders: {
    stdout: { type: 'stdout' },
    file: { type: 'file', filename: `${logFilesPath}/debug.log`, maxLogSize: 1048576, compress: true, keepFileExt: true },
    ipChange: { type: 'file', filename: `${logFilesPath}/ip-change.log`},
    errorsFile: { type: 'file', filename: `${logFilesPath}/error.log` },
    errorsOnly: { type: 'logLevelFilter', appender: 'errorsFile', level: 'error' }
  },
  categories: {
    default: { appenders: defaultAppenders, level: process.env.LOG_LEVEL || 'debug' },
    ipChange: { appenders: ipChangeAppenders, level: process.env.LOG_LEVEL || 'info' }
  }
});

export const ipChangeLogger = log4js.getLogger('ipChange');
export default log4js.getLogger();
