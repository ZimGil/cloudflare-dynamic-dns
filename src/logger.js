import winston from 'winston';
const { combine, timestamp, printf } = winston.format;

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp(),
    printf(({ level, message, timestamp }) => `${timestamp} :${level.toUpperCase()}: ${message}`)
  ),
  transports: [
    new winston.transports.File({ filename: '/var/log/cloudflare-dynamic-dns.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console());
}

export default logger;
