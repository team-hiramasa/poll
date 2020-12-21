<template>
  <v-app>
    <v-app-bar fixed app>
      <v-tabs class="elevation-2" dark centered="centered" fixed-tabs>
        <v-tabs-slider />
        <v-tab @click="fetchVoted">
          回答した質問
        </v-tab>
        <v-tab @click="fetchCreated">
          作成した質問
        </v-tab>
      </v-tabs>
    </v-app-bar>
    <v-list>
      <v-list-item
        v-for="(subject, index) in subjects"
        :key="index"
        :to="subject.id"
        v-text="subject.title"
      />
    </v-list>
  </v-app>
</template>

<script>
import firebase from "@/plugins/firebase"
const db = firebase.firestore()
// 匿名認証でログイン
firebase.auth().signInAnonymously()

export default {
  async asyncData() {
    return {
      subjects: await getVotedSubjects(),
    }
  },
  methods: {
    async fetchVoted() {
      this.subjects = await getVotedSubjects()
    },
    async fetchCreated() {
      this.subjects = await getCreatedSubjects()
    },
  },
}

// 自分が投稿した質問を配列で返す
function getVotedSubjects() {
  return new Promise((resolve) => {
    firebase.auth().onAuthStateChanged((user) => {
      db.collection("votes")
        .where("authId", "==", user.uid)
        .get()
        .then((snapshot) => {
          resolve(convertToSubjectsListFromVotesCollection(snapshot))
        })
        .catch((err) => {
          console.log("Error getting documents", err)
        })
    })
  })
}

// 自分が作成した質問を配列で返す
function getCreatedSubjects() {
  return new Promise((resolve) => {
    firebase.auth().onAuthStateChanged((user) => {
      db.collection("subjects")
        .where("authId", "==", user.uid)
        .get()
        .then((snapshot) => {
          resolve(convertToSubjectsListFromSubjectsCollection(snapshot))
        })
        .catch((err) => {
          console.log("Error getting documents", err)
        })
    })
  })
}

// votes コレクションから取得したレコードを質問配列へと変換する
function convertToSubjectsListFromVotesCollection(snapshot) {
  const subjects = []
  if (snapshot.empty) {
    console.log("No matching documents.")
    subjects.push({
      title: "見つかりませんでした",
      subjectId: "",
      optionId: "",
      authId: "",
      comment: "",
      createdAt: "",
    })
  } else {
    snapshot.forEach((doc) => {
      const params = doc.data()
      subjects.push({
        id: doc.id,
        title: params.questionTitle,
        subjectId: params.subjectId,
        optionId: params.optionId,
        authId: params.authId,
        comment: params.comment,
        createdAt: params.createdAt,
      })
    })
  }
  return subjects
}

// firestore から取得したレコードを質問配列へと変換する
function convertToSubjectsListFromSubjectsCollection(snapshot) {
  const subjects = []
  if (snapshot.empty) {
    console.log("No matching documents.")
    subjects.push({
      id: "",
      title: "見つかりませんでした",
      authId: "",
      isPublic: "",
      isCloseVoted: "",
      visibleOrder: "",
      createdAt: "",
    })
  } else {
    snapshot.forEach((doc) => {
      const params = doc.data()
      subjects.push({
        id: doc.id,
        title: params.title,
        authId: params.authId,
        isPublic: params.isPublic,
        isCloseVoted: params.isCloseVoted,
        visibleOrder: params.visibleOrder,
        createdAt: params.createdAt,
      })
    })
  }
  return subjects
}
</script>
