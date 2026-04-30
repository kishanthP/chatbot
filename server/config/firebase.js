const admin = require("firebase-admin");

// Initialize Firebase Admin SDK using environment variables
// (avoids committing the service account JSON file to git)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Replace \n in the env var with actual newlines
      privateKey: process.env.FIREBASE_PRIVATE_KEY
        ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
        : undefined,
    }),
  });
}

const auth = admin.auth();

module.exports = { admin, auth };
