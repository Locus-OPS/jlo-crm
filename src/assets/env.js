(function (window) {
  window.env = window.env || {};

  // The environment variables are defined in the Dockerfile and replaced at runtime by entrypoint.sh file.
  window.env.production = '__PRODUCTION__';
  window.env.endpoint = '__API_ENDPOINT__';
  window.env.endpointWebsocket = '__WEB_SOCKET_ENDPOINT__';
  window.env.whitelistedDomains = '__WHITELISTED_DOMAINS__';
})(this);
