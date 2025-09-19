// @ts-ignore
const env = window.env || {};

export const environment = {
  production: env.production === 'true' || false,
  endpoint: env.endpoint,
  endpointWebsocket: env.endpointWebsocket,
  whitelistedDomains: [env.whitelistedDomains],
};
