// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  endpoint: 'http://localhost:8080/jlo-crm-backend',
  whitelistedDomains: ['localhost:8080'],
  endpointWebsocket: 'ws://localhost:8080/jlo-crm-backend/chat',
  // endpoint: 'http://192.168.10.177:8080/JLOXG',
  // whitelistedDomains: ['192.168.10.177:8080']
  // endpoint: 'https://jlo.locus.co.th/jlo-crm-backend',
  // whitelistedDomains: ['jlo.locus.co.th']
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
