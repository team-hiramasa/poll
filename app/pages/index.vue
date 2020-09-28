<template>
  <v-app>
    <v-app-bar fixed app>
      <v-tabs class="elevation-2" dark centered="centered" fixed-tabs>
        <v-tabs-slider />
<<<<<<< HEAD
        <v-tab
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          v-text="item.title"
        />
      </v-tabs>
    </v-app-bar>
    <v-tabs-items>
      <v-tab-item
        v-for="(item, i) in items"
        :key="i"
        :to="item.to"
        v-text="item.title"
      />
    </v-tabs-items>
=======
        <v-tab @click="fetchVoted">
          回答した質問
        </v-tab>
        <v-tab @click="fetchCreated">
          作成した質問
        </v-tab>
      </v-tabs>
    </v-app-bar>
>>>>>>> 2f8af0cfd51898cecb769aaaf3ec2fcb03bf127c
    <v-list>
      <v-list-item
        v-for="(subject, index) in subjects"
        :key="index"
        :to="subject.id"
        v-text="subject.title"
      />
    </v-list>
<<<<<<< HEAD
    <p>{{ counter }}</p>
    <button @click="countUp">
      COUNN UP
    </button>
=======
>>>>>>> 2f8af0cfd51898cecb769aaaf3ec2fcb03bf127c
  </v-app>
</template>

<script>
import firebase from "@/plugins/firebase"
const db = firebase.firestore()
<<<<<<< HEAD
=======
// 匿名認証でログイン
firebase.auth().signInAnonymously()
>>>>>>> 2f8af0cfd51898cecb769aaaf3ec2fcb03bf127c

export default {
  async asyncData() {
    return {
<<<<<<< HEAD
      subjects: await getSubjects(),
    }
  },
  data() {
    return {
      counter: 0,
      items: [
        {
          title: "回答した質問",
          to: "/#voted",
        },
        {
          title: "作成した質問",
          to: "/#created",
        },
      ],
    }
  },
  methods: {
    countUp() {
      this.counter += 1
=======
      subjects: await getVotedSubjects(),
    }
  },
  methods: {
    async fetchVoted() {
      this.subjects = await getVotedSubjects()
    },
    async fetchCreated() {
      this.subjects = await getCreatedSubjects()
>>>>>>> 2f8af0cfd51898cecb769aaaf3ec2fcb03bf127c
    },
  },
}

<<<<<<< HEAD
async function getSubjects() {
  return await db
    .collection("subjects")
    .get()
    .then((snapshot) => {
      console.log(
        "startGetSubjects ==============================================================="
      )
      snapshot.forEach((doc) => {
        console.log(doc.id, "=>", doc.data())
      })
      console.log(
        "end ============================================================================"
      )

      const subjects = []
      if (snapshot.empty) {
        console.log("Nomatching documents.")
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
    })
    .catch((err) => {
      console.log("Error getting documents", err)
    })
=======
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
>>>>>>> 2f8af0cfd51898cecb769aaaf3ec2fcb03bf127c
}
</script>
