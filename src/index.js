import publicIp from 'public-ip';
import cron from 'node-cron';
import { uniq } from 'lodash';

import { patchRecords, getCurrentContent } from './ip-manager';
import logger, { ipChangeLogger } from './logger';

let isRunning = false;
let cronExpression = null;
// TODO - remove INTERVAL_IN_MINUTES validation after resolution of:
// https://github.com/node-cron/node-cron/issues/226
const cronIntervalInMinutes = process.env.INTERVAL_IN_MINUTES && `*/${process.env.INTERVAL_IN_MINUTES} * * * *`;

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
    publicIp.v4().then((ip) => {
      logger.debug(`Current IP: ${ip}`)
      return ip;
    }),
    getCurrentContent().then((ips) => {
      const uniqueIps = uniq(ips);
      logger.debug(`Known IPs: [${uniqueIps.join(', ')}]`)
      return uniqueIps;
    })
  ];

  Promise.all(ipPromises)
    .then(([currentIp, knownIps]) => {
      const differentIps = knownIps.filter((knownIp) => knownIp !== currentIp);
      if (differentIps.length) {
        ipChangeLogger.warn(`Public IP Changed from [${differentIps.join(', ')}] to [${currentIp}]`);
        return patchRecords(currentIp);
      }
      logger.info('Current record matches current IP');
    })
    .catch((e) => {
      if (e.response?.status) {
        const {status, statusText, data} = e.response;
        logger.error(`HTTP ERROR: ${status} (${statusText})`);
        logger.error(data);
      } else {
        logger.error(e)
      }
    })
    .finally(() => isRunning = false);
}
