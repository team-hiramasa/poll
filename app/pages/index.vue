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

export default {
  async asyncData() {
    return {
      subjects: await getSubjects(),
    }
  },
  methods: {
    },
    fetchVoted: getVotedSubjects(),
    fetchCreated: getSubjects(),
  },
}

// Subjects を全て取得する
async function getSubjects() {
  return await db
    .collection("subjects")
    .get()
    .then((snapshot) => {
      return convertToSubjectsArray(snapshot)
    })
    .catch((err) => {
      console.log("Error getting documents", err)
    })
}

// WIP
// 自分が投稿した質問を配列で返す
async function getVotedSubjects() {
  return await db
    .collection("subjects")
    .where("authId", "==", "1q2a3s45dtuvybiunoip")
    .get()
    .then((snapshot) => {
      return convertToSubjectsArray(snapshot)
    })
    .catch((err) => {
      console.log("Error getting documents", err)
    })
}

// firestore から取得したレコードを質問配列へと変換する
function convertToSubjectsArray(snapshot) {
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
