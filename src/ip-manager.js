import axios from 'axios';
import logger from './logger';

const cloudflareApi = 'https://api.cloudflare.com/client/v4';
const apiToken = process.env.CLOUDEFLARE_API_TOKEN;
const zoneId = process.env.ZONE_ID;
axios.defaults.headers.common['Authorization'] = `Bearer ${apiToken}`;
axios.defaults.headers.common['Content-Type'] = 'application/json';
let records = [];

export function patchRecords(content) {
  const patchPromises = records.map(({id, name}) => {
    const URI = `${cloudflareApi}/zones/${zoneId}/dns_records/${id}`;
    return axios.patch(URI, {content})
      .then(() => logger.debug(`Record for ${name} patched to ${content}`));
  });

  return Promise.all(patchPromises)
    .then(() => logger.info(`All records patched to ${content}`));
}

export function getCurrentContent() {
  return getARecords()
    .then((_records) => records = _records)
    .then(() => records.length && records[0].content);
}

function getARecords() {
  const URI = `${cloudflareApi}/zones/${zoneId}/dns_records/`;
  return axios.get(`${cloudflareApi}/zones/${zoneId}/dns_records/`)
    .then(({data}) => data.result.filter(({type}) => type === 'A'))
}
