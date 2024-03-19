// firebaseAdmin.ts
import * as admin from 'firebase-admin';
import {initializeApp, cert} from 'firebase-admin/app';
import {getFirestore} from 'firebase-admin/firestore';

import serviceAccount from '../../service/lvg-onfood-2c56b73bfa25.json';

initializeApp({
  // @ts-ignore
  credential: cert(serviceAccount),
  projectId: 'lvg-onfood'
});

const db = getFirestore();

export default admin;
export {db};