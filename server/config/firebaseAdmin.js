const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getMessaging: getAdminMessaging } = require('firebase-admin/messaging');
const path = require('path');

let initialized = false;

const initFirebaseAdmin = () => {
  if (initialized || getApps().length > 0) {
    initialized = true;
    return true;
  }

  try {
    const serviceAccountPath = path.resolve(__dirname, 'firebase-admin.json');
    const serviceAccount = require(serviceAccountPath);

    // Validate that real credentials are present (not placeholder)
    if (!serviceAccount.private_key || serviceAccount.private_key.startsWith('REPLACE_')) {
      console.warn('⚠️  firebase-admin.json still has placeholder values.');
      console.warn('⚠️  Place the real ajraksha-bedcb-firebase-adminsdk-fbsvc-632aad49a1.json content into server/config/firebase-admin.json');
      console.warn('⚠️  Push notifications will be unavailable until then.');
      return false;
    }

    initializeApp({ credential: cert(serviceAccount) });
    initialized = true;
    console.log('✅ Firebase Admin SDK initialized');
    return true;
  } catch (err) {
    console.error('❌ Firebase Admin initialization failed:', err.message);
    console.warn('⚠️  Push notifications will be unavailable.');
    return false;
  }
};

const getMessaging = () => {
  if (!initialized && getApps().length === 0) {
    const ok = initFirebaseAdmin();
    if (!ok) return null;
  }
  try {
    return getAdminMessaging();
  } catch {
    return null;
  }
};

module.exports = { initFirebaseAdmin, getMessaging };
