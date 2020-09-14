import firebase from "~/plugins/firebase.ts"
export default function ({ _ }) {
  firebase.auth().onAuthStateChanged(function (user) {
    if (!user) {
      firebase
        .auth()
        .signInAnonymously()
        .catch(function (error) {
          console.log(error)
        })
    }
  })
}
