import axios from 'axios';
import logger from './logger';

const cloudflareApi = 'https://api.cloudflare.com/client/v4';
const apiToken = process.env.CLOUDEFLARE_API_TOKEN;
const zoneId = process.env.ZONE_ID;
axios.defaults.headers.common['Authorization'] = `Bearer ${apiToken}`;
axios.defaults.headers.common['Content-Type'] = 'application/json';
let _rootARecordId;

export function getRootARecordContent() {
  return getRootARecordId()
    .then((rootRecordId) => axios.get(`${cloudflareApi}/zones/${zoneId}/dns_records/${rootRecordId}`))
    .then(({data}) => {
      const content = data.result.content;
      logger.debug(`Root A record content: ${content}`);
      return content;
    });
}

export function saveIp(content) {
  return getRootARecordId()
    .then((rootRecordId) => axios.patch(`${cloudflareApi}/zones/${zoneId}/dns_records/${rootRecordId}`, {content}))
    .then(({data}) => logger.info(`Root A record contect patched to: ${data.result.content}`));
}

function getRootARecordId() {
  if (_rootARecordId) {return Promise.resolve(_rootARecordId);}
  const URI = `${cloudflareApi}/zones/${zoneId}/dns_records/`;
  return axios.get(`${cloudflareApi}/zones/${zoneId}/dns_records/`)
    .then(({data}) => data.result.find((record) => record.type === 'A'))
    .then((rootRecord) => {
      if (rootRecord && rootRecord.id) {
        _rootARecordId = rootRecord.id;
        return _rootARecordId;
      }
    });
}
