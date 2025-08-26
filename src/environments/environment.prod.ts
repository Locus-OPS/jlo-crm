// @ts-ignore
const env = window.env || {};

export const environment = {
  // production: true,
  production: env.production === 'true' || false,
  // endpoint: 'http://52.221.33.21/jlo-crm-backend',
  endpoint: env.endpoint,
  // endpointWebsocket: 'ws://52.221.33.21/jlo-crm-ws/chat',
  endpointWebsocket: env.endpointWebsocket,
  // whitelistedDomains: ['52.221.33.21']
  whitelistedDomains: [env.whitelistedDomains],
};
