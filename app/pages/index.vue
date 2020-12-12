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
const tab = {
  // 投票済みは votes コレクションから取得する
  voted: "votes",
  // 作成した質問は subjects コレクションから取得する
  created: "subjects",
}

export default {
  async asyncData() {
    return {
      subjects: await getVotedSubjects(),
    }
  },
  data() {
    return {}
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
async function getVotedSubjects() {
  let subjectList = null
  await firebase.auth().onAuthStateChanged((user) => {
    subjectList = fetchSubjectsList(user, tab.voted)
  })
  return subjectList
}

// 自分が作成した質問を配列で返す
async function getCreatedSubjects() {
  let subjectList = null
  await firebase.auth().onAuthStateChanged((user) => {
    subjectList = fetchSubjectsList(user, tab.created)
  })
  return subjectList
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
  } else if (type === tab.voted) {
    return subjectsListFromVotesCollection(snapshot)
  } else if (type === tab.created) {
    return subjectsListFromSubjectsCollection(snapshot)
  }
}

// votes コレクションから取得したレコードを質問配列へと変換する
function subjectsListFromVotesCollection(snapshot) {
  const subjects = []
  snapshot.forEach((doc) => {
    const params = doc.data()
    subjects.push({
      id: params.subjectId,
      title: params.questionTitle,
      ...params,
    })
  })
  return subjects
}

// firestore から取得したレコードを質問配列へと変換する
function subjectsListFromSubjectsCollection(snapshot) {
  const subjects = []
  snapshot.forEach((doc) => {
    const params = doc.data()
    subjects.push({
      id: doc.id,
      ...params,
    })
  })
  return subjects
}
</script>
