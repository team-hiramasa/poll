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
      <v-list-item v-if="subjects.length === 0">
        質問はありません
      </v-list-item>
      <v-list-item
        v-for="(subject, index) in subjects"
        v-else
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
  middleware: "auth",
}

// 自分が投稿した質問を配列で返す
async function getVotedSubjects() {
  let result = null
  await firebase.auth().onAuthStateChanged((user) => {
    result = fetchSubjectsList(user, "votes")
  })
  return result
}

// 自分が作成した質問を配列で返す
async function getCreatedSubjects() {
  let result = null
  await firebase.auth().onAuthStateChanged((user) => {
    result = fetchSubjectsList(user, "subjects")
  })
  return result
}

// firebase から質問一覧を取得して配列に変換して返す
async function fetchSubjectsList(user, type) {
  return await db
    .collection(type)
    .where("authId", "==", user.uid)
    .get()
    .then((snapshot) => {
      return convertToSubjectsList(snapshot, type)
    })
    .catch((err) => {
      console.log("Error getting documents", err)
    })
}

// タイプによって適切な変換する
function convertToSubjectsList(snapshot, type) {
  if (snapshot.empty) {
    console.log("No matching documents.")
    return []
  } else if (type === "votes") {
    return convertToSubjectsListFromVotesCollection(snapshot)
  } else if (type === "subjects") {
    return convertToSubjectsListFromSubjectsCollection(snapshot)
  }
}

// votes コレクションから取得したレコードを質問配列へと変換する
function convertToSubjectsListFromVotesCollection(snapshot) {
  const subjects = []
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
  return subjects
}

// firestore から取得したレコードを質問配列へと変換する
function convertToSubjectsListFromSubjectsCollection(snapshot) {
  const subjects = []
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
  return subjects
}
</script>
