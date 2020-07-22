import firebase from "firebase/app"
import "firebase/auth"
import "firebase/firestore"

const config = {
  apiKey: process.env.APP_apiKey,
  authDomain: process.env.APP_authDomain,
  databaseURL: process.env.APP_databaseURL,
  projectId: process.env.APP_projectId,
  storageBucket: process.env.APP_storageBucket,
  messagingSenderId: process.env.APP_messagingSenderId,
  appId: process.env.APP_appId,
  measurementId: process.env.APP_measurementId,
}

if (!firebase.apps.length) {
  firebase.initializeApp(config)
}

export default firebase
