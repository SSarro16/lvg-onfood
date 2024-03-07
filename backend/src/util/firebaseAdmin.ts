// firebaseAdmin.ts
import * as admin from 'firebase-admin';

const DATABASE_NAME = 'lvg-onfood';

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: `https://${DATABASE_NAME}.firebaseio.com`
});

export default admin;