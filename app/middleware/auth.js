import firebase from "~/plugins/firebase.ts"
// TODO: あとで綺麗に書き直す
export default async function ({ _ }) {
  let isAuthed = false
  await firebase.auth().onAuthStateChanged((user) => {
    isAuthed = !!user
  })
  if (!isAuthed) {
    await firebase.auth().signInAnonymously()
  }
}
