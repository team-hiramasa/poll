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
      <v-btn nuxt to="/subjects/edit/new" class="primary">
        新規作成
      </v-btn>
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
      subjects: await fetchSubjectsList(tab.voted),
    }
  },
  data() {
    return {}
  },
  methods: {
    async fetchVoted() {
      this.subjects = await fetchSubjectsList(tab.voted)
    },
    async fetchCreated() {
      this.subjects = await fetchSubjectsList(tab.created)
    },
  },
}

// firebase から質問一覧を取得して配列に変換して返す
// 自分が投稿した質問 : 引数 votes
// 自分が作成した質問 : 引数 subjects
async function fetchSubjectsList(collectionName) {
  const subjectList = []
  await firebase.auth().onAuthStateChanged((user) => {
    db.collection(collectionName)
      .where("authId", "==", user.uid)
      .get()
      .then((snapshot) => {
        if (snapshot.empty) {
          console.log("No matching documents.")
        } else {
          snapshot.forEach((doc) => {
            const params = doc.data()
            if (collectionName === tab.voted) {
              // 作成した質問
              subjectList.push({
                id: params.subjectId,
                title: params.questionTitle,
                ...params,
              })
            } else if (collectionName === tab.created) {
              // 回答した質問
              subjectList.push({
                id: doc.id,
                ...params,
              })
            }
          })
        }
      })
      .catch((err) => {
        console.log("Error getting documents", err)
      })
  })
  return subjectList
}
</script>
