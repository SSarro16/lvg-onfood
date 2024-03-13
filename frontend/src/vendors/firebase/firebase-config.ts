// Your web app's Firebase configuration
const config = {
  apiKey: "AIzaSyD_RYc6UFaeAwvdWfzOXzA1mhuPlxRxAXE",
  authDomain: "lvg-onfood.firebaseapp.com",
  databaseURL: "https://lvg-onfood-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "lvg-onfood",
  storageBucket: "lvg-onfood.appspot.com",
  messagingSenderId: "97950098600",
  appId: "1:97950098600:web:33246a2d10f7f1bfc20e9d"
};
 
export function getFirebaseConfig() {
  if (!config || !config.apiKey) {
    throw new Error('No Firebase configuration object provided.' + '\n' +
    'Add your web app\'s configuration object to firebase-config.ts');
  } else {
    return config;
  }
} 