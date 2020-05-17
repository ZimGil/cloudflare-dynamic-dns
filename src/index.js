import publicIp from 'public-ip';
import cron from 'node-cron';

import { patchRecords, getCurrentContent } from './ip-manager';
import logger, { ipChangeLogger } from './logger';

let isRunning = false;
let cronExpression = null;
const cronIntervalInMinutes = `*/${process.env.INTERVAL_IN_MINUTES} * * * *`;

if (cron.validate(process.env.CRON_EXPRESSION)) {
  cronExpression = process.env.CRON_EXPRESSION;
} else if (cron.validate(cronIntervalInMinutes)) {
  cronExpression = cronIntervalInMinutes;
}

if (!cronExpression) {
  run();
} else {
  cron.schedule(cronExpression, run);
}


function run() {
  if (isRunning) {return;}
  isRunning = true;
  const ipPromises = [
    publicIp.v4().then((ip) => (logger.debug(`Current IP: ${ip}`), ip)),
    getCurrentContent().then((ip) => (logger.debug(`Known IP: ${ip}`), ip)),
  ];

  Promise.all(ipPromises)
    .then(([currentIp, knownIp]) => {
      if (currentIp !== knownIp) {
        ipChangeLogger.warn(`Public IP Changed from ${knownIp} to ${currentIp}`);
        return patchRecords(currentIp);
      }
      logger.info('Current record matches current IP');
    })
    .catch((e) => {
      if (e.response.status) {
        const {status, statusText, data} = e.response;
        logger.error(`HTTP ERROR: ${status} (${statusText})`);
        logger.error(data);
      } else {
        logger.error(e)
      }
    })
    .finally(() => isRunning = false);
}
