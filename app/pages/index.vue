<template>
  <v-app>
    <v-app-bar fixed app>
      <v-tabs class="elevation-2" dark centered="centered" fixed-tabs>
        <v-tabs-slider />
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
    <v-list>
      <v-list-item
        v-for="(subject, index) in subjects"
        :key="index"
        :to="subject.id"
        v-text="subject.title"
      />
    </v-list>
    <p>{{ counter }}</p>
    <button @click="countUp">
      COUNN UP
    </button>
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
    },
  },
}

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
}
</script>
