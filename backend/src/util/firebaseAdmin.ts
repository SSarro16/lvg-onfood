// firebaseAdmin.ts
import * as admin from 'firebase-admin';
import {initializeApp, cert} from 'firebase-admin/app';
import {getFirestore} from 'firebase-admin/firestore';

// This file is saved on Render
import serviceAccount from '/etc/secrets/service-account-key.json';

initializeApp({
  // @ts-ignore
  credential: cert(serviceAccount),
  projectId: 'lvg-onfood'
});

const db = getFirestore();

export default admin;
export {db};