// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseURL: 'https://ticket2u.azurewebsites.net/Event',
  firebase: {
    apiKey: "AIzaSyBPcqcnIFtJY7UYMdry75FWGltLITY5WXg",
    authDomain: "pfc-ticket2u.firebaseapp.com",
    databaseURL: "https://pfc-ticket2u.firebaseio.com",
    projectId: "pfc-ticket2u",
    storageBucket: "pfc-ticket2u.appspot.com",
    messagingSenderId: "940072732852",
    appId: "1:940072732852:web:04dc3f93f600c35ef02fe1",
    measurementId: "G-P10810CJV5"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
